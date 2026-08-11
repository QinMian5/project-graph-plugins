import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  access,
  chmod,
  constants,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const arguments_ = process.argv.slice(2);
const sourceIndex = arguments_.indexOf("--project-graph");
const projectGraphRoot = resolve(
  sourceIndex === -1 ? join(repositoryRoot, "../project-graph") : arguments_[sourceIndex + 1],
);
const release = JSON.parse(await readFile(join(repositoryRoot, "release.json"), "utf8"));
const target =
  process.platform === "darwin" && process.arch === "arm64"
    ? "darwin-arm64"
    : process.platform === "win32" && process.arch === "x64"
      ? "win32-x64"
      : undefined;
const targetMetadata = release.targets[target];
const helperIndex = arguments_.indexOf("--ownership-helper");
let helperPath;
const pluginRoot = join(repositoryRoot, "plugins/project-graph");
const payloadParent = join(pluginRoot, "payloads");
const payloadRoot = join(payloadParent, target ?? "unsupported");
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
    `${command} failed with status ${String(result.status)}\n${result.error?.message ?? ""}${result.stdout ?? ""}${result.stderr ?? ""}`.trimEnd(),
  );
}

function runNpm(args, options = {}) {
  if (process.platform === "win32") {
    return run(process.env.ComSpec ?? "cmd.exe", ["/d", "/c", "npm.cmd", ...args], options);
  }
  return run("npm", args, options);
}

function npmVersion(version) {
  const peerSuffix = version.indexOf("(");
  return peerSuffix === -1 ? version : version.slice(0, peerSuffix);
}

try {
  if (!target) throw new Error("payloads must be materialized on a supported target");
  if (!targetMetadata) throw new Error(`release metadata does not define ${target}`);
  helperPath = resolve(
    helperIndex === -1
      ? join(projectGraphRoot, targetMetadata.ownershipHelper.sourcePath)
      : arguments_[helperIndex + 1],
  );

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
  await mkdir(join(stagingRoot, "licenses"), { recursive: true });
  await writeFile(join(stagingRoot, "VERSION"), `${release.version}\n`);
  await writeFile(
    join(stagingRoot, "licenses/project-graph-GPL-3.0.txt"),
    await readFile(join(projectGraphRoot, "app/LICENSE")),
  );

  run(
    process.platform === "win32" ? "pnpm.exe" : "pnpm",
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

  const cliRoot = join(stagingRoot, "cli");
  const runtimePackagePath = join(cliRoot, "package.json");
  const runtimePackage = JSON.parse(await readFile(runtimePackagePath, "utf8"));
  runtimePackage.dependencies = Object.fromEntries(
    Object.entries(runtimePackage.dependencies ?? {}).map(([name, version]) => [name, npmVersion(version)]),
  );
  runtimePackage.engines = { node: release.hostRuntime.node };
  await writeFile(runtimePackagePath, `${JSON.stringify(runtimePackage, null, 2)}\n`);
  await rm(join(cliRoot, "node_modules"), { recursive: true, force: true });
  await rm(join(cliRoot, "pnpm-lock.yaml"), { force: true });
  await rm(join(cliRoot, "pnpm-workspace.yaml"), { force: true });
  runNpm(
    ["install", "--package-lock-only", "--ignore-scripts", "--omit=dev", "--include=optional", "--no-audit", "--no-fund"],
    { cwd: cliRoot },
  );

  const helperName = target === "win32-x64" ? "project-graph-ownership-helper.exe" : "project-graph-ownership-helper";
  await chmod(join(cliRoot, helperName), 0o755);
  const provenance = {
    integrationRelease: release.version,
    target,
    projectGraph: release.projectGraph,
    hostRuntime: release.hostRuntime,
    ownershipHelper: targetMetadata.ownershipHelper,
    dependencyInstall: "npm ci --omit=dev --include=optional --no-audit --no-fund",
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  };
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
}
