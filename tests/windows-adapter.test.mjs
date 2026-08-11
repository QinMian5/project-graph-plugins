import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const adapterSource = new URL("../plugins/project-graph/bin/project-graph.cmd", import.meta.url);
const bootstrapSource = new URL("../plugins/project-graph/runtime/bootstrap.mjs", import.meta.url);
const windowsTest = process.platform === "win32" ? test : test.skip;

async function createPluginFixture() {
  const root = await mkdtemp(join(tmpdir(), "project-graph-windows-adapter-"));
  const dataRoot = join(root, "data");
  const adapter = join(root, "bin/project-graph.cmd");
  const payload = join(root, "payloads/win32-x64/cli");
  await mkdir(join(root, "bin"), { recursive: true });
  await mkdir(join(root, "runtime"), { recursive: true });
  await mkdir(payload, { recursive: true });
  await copyFile(adapterSource, adapter);
  await copyFile(bootstrapSource, join(root, "runtime/bootstrap.mjs"));
  await writeFile(join(root, "release-version"), "0.1.2\n");
  await writeFile(
    join(payload, "project-graph.mjs"),
    'const args = process.argv.slice(2);\nif (args[0] === "--version") console.log("0.1.2");\nelse console.log(`forwarded:${args.join(" ")}`);\n',
  );
  await writeFile(
    join(payload, "package.json"),
    `${JSON.stringify({ name: "project-graph-adapter-fixture", version: "0.1.2", private: true }, null, 2)}\n`,
  );
  await writeFile(
    join(payload, "package-lock.json"),
    `${JSON.stringify({ name: "project-graph-adapter-fixture", version: "0.1.2", lockfileVersion: 3, requires: true, packages: { "": { name: "project-graph-adapter-fixture", version: "0.1.2" } } }, null, 2)}\n`,
  );
  return { root, dataRoot, adapter };
}

function run(adapter, args = [], environment = {}) {
  return spawnSync(process.env.ComSpec, ["/d", "/c", adapter, ...args], {
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

windowsTest("the Windows Host adapter installs into persistent plugin data and reuses the cache", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  const environment = { PROJECT_GRAPH_PLUGIN_DATA: fixture.dataRoot };

  const version = run(fixture.adapter, ["--version"], environment);
  assert.deepEqual(
    { status: version.status, stdout: version.stdout, stderr: version.stderr },
    { status: 0, stdout: "0.1.2\n", stderr: "" },
  );
  const runtimeRoot = join(fixture.dataRoot, "runtime/0.1.2/win32-x64");
  await writeFile(join(runtimeRoot, "cache-sentinel"), "preserved\n");

  const invocation = run(fixture.adapter, ["tool", "list"], environment);
  assert.deepEqual(
    { status: invocation.status, stdout: invocation.stdout, stderr: invocation.stderr },
    { status: 0, stdout: "forwarded:tool list\n", stderr: "" },
  );
  assert.equal(await readFile(join(runtimeRoot, "cache-sentinel"), "utf8"), "preserved\n");
});

windowsTest("the Windows Host adapter reports a missing Host Node runtime", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const result = run(fixture.adapter, [], { PATH: "C:\\definitely-not-a-runtime-path" });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"NODE_RUNTIME_MISSING","message":"Project Graph CLI requires Node.js 26 or newer on PATH."}\r\n',
  );
});

windowsTest("the Windows Host adapter reports a missing bootstrap", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  await rm(join(fixture.root, "runtime/bootstrap.mjs"));

  const result = run(fixture.adapter);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"PAYLOAD_MISSING","message":"Project Graph CLI payload is incomplete."}\r\n',
  );
});
