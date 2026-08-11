import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  access,
  chmod,
  constants,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
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
const pluginRoot = join(repositoryRoot, "plugins/project-graph");
const payloadParent = join(pluginRoot, "payloads");
const payloadRoot = join(payloadParent, target);
const downloadDirectory = await mkdtemp(join(tmpdir(), "project-graph-node-runtime-"));
let stagingRoot;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: "utf8",
    env: options.env ?? process.env,
  });
  if (result.status === 0) return result.stdout;
  throw new Error(
    `${command} failed with status ${String(result.status)}\n${result.stdout}${result.stderr}`.trimEnd(),
  );
}

try {
  if (process.platform !== "darwin" || process.arch !== "arm64") {
    throw new Error("darwin-arm64 payloads must be materialized on darwin-arm64");
  }
  if (!targetMetadata) throw new Error(`release metadata does not define ${target}`);
  await access(payloadRoot).then(
    () => {
      throw new Error(`${payloadRoot} already exists`);
    },
    () => undefined,
  );

  const projectGraphRevision = run("git", ["-C", projectGraphRoot, "rev-parse", "HEAD"]).trim();
  if (projectGraphRevision !== release.projectGraph.revision) {
    throw new Error(`Project Graph revision ${projectGraphRevision} does not match release metadata`);
  }
  if (run("git", ["-C", projectGraphRoot, "status", "--porcelain"]).trim()) {
    throw new Error("Project Graph source worktree must be clean");
  }

  const helperPath = join(projectGraphRoot, "app/src-tauri/target/debug/project-graph-ownership-helper");
  await access(helperPath, constants.R_OK | constants.X_OK);
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
  run("/usr/bin/strip", ["-u", "-r", bundledNodePath]);
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

  const provenance = {
    integrationRelease: release.version,
    target,
    projectGraph: release.projectGraph,
    node: {
      ...targetMetadata.node,
      source: nodeUrl,
      transformations: ["strip -u -r", "codesign --force --sign -"],
    },
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  };
  await writeFile(join(stagingRoot, "VERSION"), `${release.version}\n`);
  await writeFile(join(stagingRoot, "provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
  await rename(stagingRoot, payloadRoot);
  stagingRoot = undefined;
  process.stdout.write(`${JSON.stringify({ target, version: release.version, payloadRoot })}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
} finally {
  if (stagingRoot) await rm(stagingRoot, { recursive: true, force: true });
  await rm(downloadDirectory, { recursive: true, force: true });
}
