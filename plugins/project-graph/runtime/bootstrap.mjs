import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function fail(code, message) {
  process.stderr.write(`${JSON.stringify({ code, message })}\n`);
  process.exit(1);
}

function targetName() {
  if (process.platform === "darwin" && process.arch === "arm64") return "darwin-arm64";
  if (process.platform === "win32" && process.arch === "x64") return "win32-x64";
  fail("UNSUPPORTED_TARGET", "Project Graph CLI has no payload for this platform.");
}

function defaultDataRoot() {
  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Application Support", "project-graph-plugin");
  }
  if (process.platform === "win32") {
    return join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"), "ProjectGraph", "plugin");
  }
  return join(process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share"), "project-graph-plugin");
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    encoding: "utf8",
    stdio: options.stdio ?? "pipe",
  });
}

function runNpm(args, options = {}) {
  if (process.platform === "win32") {
    return run(process.env.ComSpec ?? "cmd.exe", ["/d", "/c", "npm.cmd", ...args], options);
  }
  return run("npm", args, options);
}

const majorVersion = Number(process.versions.node.split(".")[0]);
if (!Number.isInteger(majorVersion) || majorVersion < 26) {
  fail("NODE_VERSION_UNSUPPORTED", "Project Graph CLI requires Node.js 26 or newer.");
}

const target = targetName();
const version = (await readFile(join(pluginRoot, "release-version"), "utf8")).trim();
const templateRoot = join(pluginRoot, "payloads", target, "cli");
const packageLock = await readFile(join(templateRoot, "package-lock.json"));
const packageLockHash = createHash("sha256").update(packageLock).digest("hex");
const dataRoot =
  process.env.PROJECT_GRAPH_PLUGIN_DATA ??
  process.env.PLUGIN_DATA ??
  process.env.CLAUDE_PLUGIN_DATA ??
  defaultDataRoot();
const runtimeRoot = join(dataRoot, "runtime", version, target);
const markerPath = join(runtimeRoot, ".ready.json");
const expectedMarker = { version, target, packageLockSha256: packageLockHash };
let ready = false;

try {
  const marker = JSON.parse(await readFile(markerPath, "utf8"));
  ready =
    marker.version === expectedMarker.version &&
    marker.target === expectedMarker.target &&
    marker.packageLockSha256 === expectedMarker.packageLockSha256;
} catch {
  ready = false;
}

if (!ready) {
  const npmVersion = runNpm(["--version"]);
  if (npmVersion.status !== 0) {
    fail("NPM_UNAVAILABLE", "Project Graph CLI requires npm to install its production dependencies.");
  }

  const stagingRoot = `${runtimeRoot}.staging-${String(process.pid)}`;
  await rm(stagingRoot, { recursive: true, force: true });
  await mkdir(dirname(runtimeRoot), { recursive: true });
  await cp(templateRoot, stagingRoot, { recursive: true });
  const install = runNpm(
    ["ci", "--omit=dev", "--include=optional", "--no-audit", "--no-fund"],
    { cwd: stagingRoot },
  );
  if (install.status !== 0) {
    await rm(stagingRoot, { recursive: true, force: true });
    fail("DEPENDENCY_INSTALL_FAILED", "Project Graph CLI production dependencies could not be installed.");
  }
  await writeFile(join(stagingRoot, ".ready.json"), `${JSON.stringify(expectedMarker)}\n`);
  await rm(runtimeRoot, { recursive: true, force: true });
  await rename(stagingRoot, runtimeRoot);
}

const entryPath = join(runtimeRoot, "project-graph.mjs");
const result = run(process.execPath, [entryPath, ...process.argv.slice(2)], {
  cwd: runtimeRoot,
  env: { ...process.env, PROJECT_GRAPH_PLUGIN_DATA: dataRoot },
  stdio: "inherit",
});
if (result.error) fail("CLI_START_FAILED", "Project Graph CLI could not be started.");
if (result.signal) process.kill(process.pid, result.signal);
process.exit(result.status ?? 1);
