import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const arguments_ = process.argv.slice(2);

function argument(name, fallback) {
  const index = arguments_.indexOf(name);
  if (index === -1) return fallback;
  const value = arguments_[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

function runAdapter(adapterPath, args) {
  const command = process.platform === "win32" ? process.env.ComSpec : adapterPath;
  const commandArguments = process.platform === "win32" ? ["/d", "/c", adapterPath, ...args] : args;
  const result = spawnSync(command, commandArguments, {
    encoding: "utf8",
    env: { ...process.env, PATH: process.platform === "win32" ? "C:\\no-runtime-path" : "/no-runtime-path" },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status === 0 && result.stderr === "") return result.stdout;
  throw new Error(
    `${adapterPath} ${args.join(" ")} failed with status ${String(result.status)}\n${result.stdout}${result.stderr}`.trimEnd(),
  );
}

function parseJson(output, label) {
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`${label} did not return JSON`, { cause: error });
  }
}

async function hash(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

const pluginRootArgument = argument("--plugin-root");
if (!pluginRootArgument) throw new Error("--plugin-root is required");
const pluginRoot = resolve(pluginRootArgument);
const projectGraphRoot = resolve(argument("--project-graph", join(import.meta.dirname, "../../project-graph")));
const fixturePath = resolve(argument("--fixture", join(projectGraphRoot, "docs-pg/ProjectGraph开发进程图.prg")));
const adapterPath = join(pluginRoot, "bin", process.platform === "win32" ? "project-graph.cmd" : "project-graph");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "project-graph-closed-smoke-"));

try {
  const invoke = (...args) => runAdapter(adapterPath, args);
  const version = invoke("--version").trim();
  const tools = parseJson(invoke("tool", "list"), "tool list");
  assert.ok(Array.isArray(tools) && tools.length > 0, "tool list returned no tools");
  const description = parseJson(invoke("tool", "describe", "get_all_nodes"), "tool describe");
  assert.equal(description.name, "get_all_nodes");

  const sourceHash = await hash(fixturePath);
  const closedReadPath = join(temporaryDirectory, "closed-read.prg");
  await copyFile(fixturePath, closedReadPath);
  const closedReadHash = await hash(closedReadPath);
  const closedRead = parseJson(
    invoke("tool", "invoke", "get_all_nodes", "--project", closedReadPath, "--input", "{}", "--allow-upgrade"),
    "Closed Project read",
  );
  assert.equal(await hash(closedReadPath), closedReadHash, "Closed Project read changed its fixture copy");
  assert.equal(await hash(fixturePath), sourceHash, "Closed Project read changed the source fixture");

  process.stdout.write(
    `${JSON.stringify({
      platform: process.platform,
      architecture: process.arch,
      version,
      toolCount: tools.length,
      describedTool: description.name,
      closedProjectObjectCount: closedRead.objects.length,
      sourceUnchanged: true,
    })}\n`,
  );
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
