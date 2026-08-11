import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status === 0 && (options.allowStderr || result.stderr === "")) return result.stdout;
  throw new Error(
    `${command} ${args.join(" ")} failed with status ${String(result.status)}\n${result.stdout}${result.stderr}`.trimEnd(),
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

function shellQuote(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}

const pluginRootArgument = argument("--plugin-root");
if (!pluginRootArgument) throw new Error("--plugin-root is required");
const pluginRoot = resolve(pluginRootArgument);
const projectGraphRoot = resolve(argument("--project-graph", join(import.meta.dirname, "../../project-graph")));
const fixturePath = resolve(
  argument("--fixture", join(projectGraphRoot, "docs-pg/ProjectGraph开发进程图.prg")),
);
const adapterPath = join(pluginRoot, "bin/project-graph");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "project-graph-codex-tracer-"));

try {
  if (process.platform !== "darwin" || process.arch !== "arm64") {
    throw new Error("the GRAPH-45 tracer requires macOS arm64");
  }
  const referenceStorePath = join(temporaryDirectory, "references.json");
  const adapterEnvironment = {
    ...process.env,
    PROJECT_GRAPH_REFERENCE_STORE_PATH: referenceStorePath,
  };
  const invoke = (...args) => run(adapterPath, args, { env: adapterEnvironment });

  const version = invoke("--version").trim();
  const tools = parseJson(invoke("tool", "list"), "tool list");
  assert.ok(Array.isArray(tools) && tools.length > 0, "tool list returned no tools");
  const description = parseJson(invoke("tool", "describe", tools[0].name), "tool describe");
  assert.equal(description.name, tools[0].name);

  const sourceHashBefore = await hash(fixturePath);
  const closedReadPath = join(temporaryDirectory, "closed-read.prg");
  await copyFile(fixturePath, closedReadPath);
  const closedReadHashBefore = await hash(closedReadPath);
  const closedRead = parseJson(
    invoke("tool", "invoke", "get_all_nodes", "--project", closedReadPath, "--input", "{}", "--allow-upgrade"),
    "Closed Project read",
  );
  assert.equal(await hash(closedReadPath), closedReadHashBefore, "Closed Project read changed its fixture copy");
  assert.equal(await hash(fixturePath), sourceHashBefore, "Closed Project read changed the source fixture");

  const disposablePath = join(temporaryDirectory, "disposable.prg");
  await copyFile(fixturePath, disposablePath);
  const disposableHashBefore = await hash(disposablePath);
  invoke("tool", "invoke", "delete_all_nodes", "--project", disposablePath, "--input", "{}", "--allow-upgrade");
  const disposableRead = parseJson(
    invoke("tool", "invoke", "get_all_nodes", "--project", disposablePath, "--input", "{}", "--allow-upgrade"),
    "disposable Project read",
  );
  const disposableHashAfter = await hash(disposablePath);
  assert.notEqual(disposableHashAfter, disposableHashBefore, "write did not change the disposable Project");
  assert.equal(disposableRead.objects.length, 0, "delete_all_nodes left nodes in the disposable Project");
  assert.equal(await hash(fixturePath), sourceHashBefore, "disposable write changed the source fixture");

  const pnpmPath = run("/usr/bin/which", ["pnpm"]).trim();
  const shimDirectory = join(temporaryDirectory, "shim");
  await mkdir(shimDirectory);
  const shimPath = join(shimDirectory, "pnpm");
  await writeFile(
    shimPath,
    `#!/bin/sh\nif [ "\${1-}" = "cli" ]; then\n  shift\n  if [ "\${1-}" = "--" ]; then shift; fi\n  exec ${shellQuote(adapterPath)} "$@"\nfi\nexec ${shellQuote(pnpmPath)} "$@"\n`,
  );
  await chmod(shimPath, 0o755);
  const desktopOutput = run(pnpmPath, ["test:cli:desktop"], {
    cwd: projectGraphRoot,
    env: { ...process.env, PATH: `${shimDirectory}:${process.env.PATH}` },
    allowStderr: true,
  });
  const desktopLine = desktopOutput
    .trim()
    .split("\n")
    .findLast((line) => line.startsWith("{") && line.endsWith("}"));
  if (!desktopLine) throw new Error("Open Project acceptance did not return a JSON summary");
  const desktop = parseJson(desktopLine, "Open Project acceptance");
  assert.equal(desktop.desktopContext, "unchanged");

  process.stdout.write(
    `${JSON.stringify({
      version,
      toolCount: tools.length,
      describedTool: description.name,
      closedProject: {
        sourceObjectCount: closedRead.objects.length,
        sourceHash: sourceHashBefore,
        sourceUnchanged: true,
        disposableObjectCount: disposableRead.objects.length,
        disposableChanged: true,
      },
      openProject: desktop,
    })}\n`,
  );
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
