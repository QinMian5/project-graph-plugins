import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  access,
  chmod,
  constants,
  cp,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const arguments_ = process.argv.slice(2);
const sourceIndex = arguments_.indexOf("--project-graph");
const projectGraphRoot = resolve(
  sourceIndex === -1 ? join(repositoryRoot, "../project-graph") : arguments_[sourceIndex + 1],
);
const release = JSON.parse(await readFile(join(repositoryRoot, "release.json"), "utf8"));
const target = "darwin-arm64";
const targetMetadata = release.targets[target];
const helperIndex = arguments_.indexOf("--ownership-helper");
const helperPath = resolve(
  helperIndex === -1
    ? join(projectGraphRoot, targetMetadata.ownershipHelper.sourcePath)
    : arguments_[helperIndex + 1],
);
const pluginRoot = join(repositoryRoot, "plugins/project-graph");
const payloadParent = join(pluginRoot, "payloads");
const payloadRoot = join(payloadParent, target);
const downloadDirectory = await mkdtemp(join(tmpdir(), "project-graph-node-runtime-"));
const runtimeSymbolPrefixes = ["_napi_", "_node_api_", "_node_module_", "_uv_"];
let stagingRoot;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: "utf8",
    env: options.env ?? process.env,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status === 0) return result.stdout;
  throw new Error(
    `${command} failed with status ${String(result.status)}\n${result.stdout}${result.stderr}`.trimEnd(),
  );
}

async function removePackageManagerCommandShims(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);
    if (entry.name === ".bin") await rm(path, { recursive: true, force: true });
    else await removePackageManagerCommandShims(path);
  }
}

try {
  if (process.platform !== "darwin" || process.arch !== "arm64") {
    throw new Error("darwin-arm64 payloads must be materialized on darwin-arm64");
  }
  if (!targetMetadata) throw new Error(`release metadata does not define ${target}`);

  const projectGraphRevision = run("git", ["-C", projectGraphRoot, "rev-parse", "HEAD"]).trim();
  if (projectGraphRevision !== release.projectGraph.revision) {
    throw new Error(`Project Graph revision ${projectGraphRevision} does not match release metadata`);
  }
  if (run("git", ["-C", projectGraphRoot, "status", "--porcelain"]).trim()) {
    throw new Error("Project Graph source worktree must be clean");
  }

  await access(helperPath, constants.R_OK | constants.X_OK);
  const helperHash = createHash("sha256").update(await readFile(helperPath)).digest("hex");
  if (helperHash !== targetMetadata.ownershipHelper.sha256) {
    throw new Error("Project Graph ownership helper checksum does not match release metadata");
  }
  run(process.execPath, [join(repositoryRoot, "scripts/sync-release.mjs"), "--check"]);

  await mkdir(payloadParent, { recursive: true });
  stagingRoot = await mkdtemp(join(payloadParent, `.${target}-`));
  await Promise.all([
    mkdir(join(stagingRoot, "bin"), { recursive: true }),
    mkdir(join(stagingRoot, "licenses"), { recursive: true }),
  ]);

  const nodeUrl = `https://nodejs.org/dist/v${targetMetadata.node.version}/${targetMetadata.node.archive}`;
  const response = await fetch(nodeUrl);
  if (!response.ok) throw new Error(`Node download failed with status ${response.status}`);
  const archive = Buffer.from(await response.arrayBuffer());
  const archiveHash = createHash("sha256").update(archive).digest("hex");
  if (archiveHash !== targetMetadata.node.sha256) throw new Error("Node archive checksum does not match release metadata");
  const archivePath = join(downloadDirectory, targetMetadata.node.archive);
  await writeFile(archivePath, archive);
  run("/usr/bin/tar", ["-xzf", archivePath, "-C", downloadDirectory]);

  const extractedNodeRoot = join(
    downloadDirectory,
    targetMetadata.node.archive.replace(/\.tar\.gz$/, ""),
  );
  const bundledNodePath = join(stagingRoot, "bin/node");
  await copyFile(join(extractedNodeRoot, "bin/node"), bundledNodePath);
  await chmod(bundledNodePath, 0o755);
  const runtimeSymbols = run("/usr/bin/nm", ["-gj", bundledNodePath])
    .split("\n")
    .filter((symbol) => runtimeSymbolPrefixes.some((prefix) => symbol.startsWith(prefix)))
    .sort();
  if (runtimeSymbols.length === 0) throw new Error("Node runtime symbol allowlist is empty");
  const runtimeSymbolsPath = join(downloadDirectory, "runtime-symbols.txt");
  await writeFile(runtimeSymbolsPath, `${runtimeSymbols.join("\n")}\n`);
  run("/usr/bin/strip", ["-u", "-r", "-s", runtimeSymbolsPath, bundledNodePath]);
  run("/usr/bin/codesign", ["--force", "--sign", "-", bundledNodePath]);
  await copyFile(join(extractedNodeRoot, "LICENSE"), join(stagingRoot, "licenses/node-LICENSE"));
  await copyFile(
    join(projectGraphRoot, "app/LICENSE"),
    join(stagingRoot, "licenses/project-graph-GPL-3.0.txt"),
  );

  run(
    "pnpm",
    ["--silent", "--filter", "@graphif/project-graph", "materialize:cli", "--outDir", join(stagingRoot, "cli")],
    {
      cwd: projectGraphRoot,
      env: {
        ...process.env,
        PROJECT_GRAPH_CLI_VERSION: release.version,
        PROJECT_GRAPH_OWNERSHIP_HELPER_PATH: helperPath,
      },
    },
  );

  const deployedNodeModulesPath = join(stagingRoot, "cli/node_modules");
  const flattenedNodeModulesPath = join(stagingRoot, "cli/node_modules.flattened");
  await cp(join(deployedNodeModulesPath, ".pnpm/node_modules"), flattenedNodeModulesPath, {
    recursive: true,
    dereference: true,
    preserveTimestamps: true,
  });
  const runtimePackage = JSON.parse(await readFile(join(stagingRoot, "cli/package.json"), "utf8"));
  for (const dependency of Object.keys(runtimePackage.dependencies ?? {})) {
    await cp(join(deployedNodeModulesPath, dependency), join(flattenedNodeModulesPath, dependency), {
      recursive: true,
      dereference: true,
      preserveTimestamps: true,
      force: true,
    });
  }
  await rm(deployedNodeModulesPath, { recursive: true, force: true });
  await rename(flattenedNodeModulesPath, deployedNodeModulesPath);
  await removePackageManagerCommandShims(deployedNodeModulesPath);

  const provenance = {
    integrationRelease: release.version,
    target,
    projectGraph: release.projectGraph,
    node: {
      ...targetMetadata.node,
      source: nodeUrl,
      transformations: [
        "strip -u -r preserving napi_, node_api_, node_module_, and uv_ symbols",
        "codesign --force --sign -",
      ],
    },
    ownershipHelper: targetMetadata.ownershipHelper,
    packageTransformations: [
      "flatten pnpm production dependencies for Codex installation",
      "remove package-manager command shims",
    ],
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  };
  await writeFile(join(stagingRoot, "VERSION"), `${release.version}\n`);
  await writeFile(join(stagingRoot, "provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
  const previousPayloadRoot = join(payloadParent, `.${target}-previous-${String(process.pid)}`);
  let previousPayloadMoved = false;
  try {
    await rename(payloadRoot, previousPayloadRoot);
    previousPayloadMoved = true;
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  }
  try {
    await rename(stagingRoot, payloadRoot);
  } catch (error) {
    if (previousPayloadMoved) await rename(previousPayloadRoot, payloadRoot);
    throw error;
  }
  stagingRoot = undefined;
  if (previousPayloadMoved) await rm(previousPayloadRoot, { recursive: true, force: true });
  process.stdout.write(`${JSON.stringify({ target, version: release.version, payloadRoot })}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  if (stagingRoot) await rm(stagingRoot, { recursive: true, force: true });
  await rm(downloadDirectory, { recursive: true, force: true });
}
