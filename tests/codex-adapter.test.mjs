import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";

const adapterSource = new URL("../plugins/project-graph/bin/project-graph", import.meta.url);
const bootstrapSource = new URL("../plugins/project-graph/runtime/bootstrap.mjs", import.meta.url);

async function createPluginFixture() {
  const root = await mkdtemp(join(tmpdir(), "project-graph-codex-adapter-"));
  const dataRoot = join(root, "data");
  const adapter = join(root, "bin/project-graph");
  const payload = join(root, "payloads/darwin-arm64/cli");
  await mkdir(join(root, "bin"), { recursive: true });
  await mkdir(join(root, "runtime"), { recursive: true });
  await mkdir(payload, { recursive: true });
  await copyFile(adapterSource, adapter);
  await copyFile(bootstrapSource, join(root, "runtime/bootstrap.mjs"));
  await chmod(adapter, 0o755);
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
  return spawnSync(adapter, args, {
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

function runAsync(adapter, args = [], environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(adapter, args, { env: { ...process.env, ...environment } });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk));
    child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

test("the shared Host adapter installs into persistent plugin data and reuses the cache", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  const environment = { PROJECT_GRAPH_PLUGIN_DATA: fixture.dataRoot };

  const version = run(fixture.adapter, ["--version"], environment);
  assert.deepEqual(
    { status: version.status, stdout: version.stdout, stderr: version.stderr },
    { status: 0, stdout: "0.1.2\n", stderr: "" },
  );
  const runtimeRoot = join(fixture.dataRoot, "runtime/0.1.2/darwin-arm64");
  const packageLock = await readFile(join(fixture.root, "payloads/darwin-arm64/cli/package-lock.json"));
  assert.deepEqual(JSON.parse(await readFile(join(runtimeRoot, ".ready.json"), "utf8")), {
    version: "0.1.2",
    target: "darwin-arm64",
    packageLockSha256: createHash("sha256").update(packageLock).digest("hex"),
  });

  await writeFile(join(runtimeRoot, "cache-sentinel"), "preserved\n");
  const invocation = run(fixture.adapter, ["tool", "list"], environment);
  assert.deepEqual(
    { status: invocation.status, stdout: invocation.stdout, stderr: invocation.stderr },
    { status: 0, stdout: "forwarded:tool list\n", stderr: "" },
  );
  assert.equal(await readFile(join(runtimeRoot, "cache-sentinel"), "utf8"), "preserved\n");
});

test("the shared Host adapter supports concurrent first-use installation", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  const environment = { PROJECT_GRAPH_PLUGIN_DATA: fixture.dataRoot };
  const payloadRoot = join(fixture.root, "payloads/darwin-arm64/cli");
  const packagePath = join(payloadRoot, "package.json");
  const packageData = JSON.parse(await readFile(packagePath, "utf8"));
  packageData.scripts = { preinstall: "node install-barrier.mjs" };
  await writeFile(packagePath, `${JSON.stringify(packageData, null, 2)}\n`);
  await writeFile(
    join(payloadRoot, "install-barrier.mjs"),
    'import { readdir, writeFile } from "node:fs/promises";\nimport { dirname, join } from "node:path";\nimport { setTimeout as delay } from "node:timers/promises";\nconst root = dirname(process.cwd());\nawait writeFile(join(root, `barrier-${process.pid}`), "");\nwhile ((await readdir(root)).filter((name) => name.startsWith("barrier-")).length < 4) await delay(10);\n',
  );

  const results = await Promise.all(
    Array.from({ length: 4 }, () => runAsync(fixture.adapter, ["--version"], environment)),
  );
  for (const result of results) {
    assert.deepEqual(result, { status: 0, stdout: "0.1.2\n", stderr: "" });
  }
});

test("the shared Host adapter repairs an invalid cached runtime", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  const runtimeRoot = join(fixture.dataRoot, "runtime/0.1.2/darwin-arm64");
  await mkdir(runtimeRoot, { recursive: true });
  await writeFile(join(runtimeRoot, ".ready.json"), "{}\n");

  const result = run(fixture.adapter, ["--version"], { PROJECT_GRAPH_PLUGIN_DATA: fixture.dataRoot });
  assert.deepEqual(
    { status: result.status, stdout: result.stdout, stderr: result.stderr },
    { status: 0, stdout: "0.1.2\n", stderr: "" },
  );
  const packageLock = await readFile(join(fixture.root, "payloads/darwin-arm64/cli/package-lock.json"));
  const repairHash = createHash("sha256").update(packageLock).digest("hex").slice(0, 16);
  assert.equal(
    JSON.parse(await readFile(`${runtimeRoot}.repair-${repairHash}/.ready.json`, "utf8")).version,
    "0.1.2",
  );
});

test("the shared Host adapter reports a missing Host Node runtime", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const result = run(fixture.adapter, [], { PATH: "/definitely-not-a-runtime-path" });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"NODE_RUNTIME_MISSING","message":"Project Graph CLI requires Node.js 26 or newer on PATH."}\n',
  );
});

test("the shared Host adapter reports a missing bootstrap", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  await rm(join(fixture.root, "runtime/bootstrap.mjs"));

  const result = run(fixture.adapter);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"PAYLOAD_MISSING","message":"Project Graph CLI bootstrap is missing."}\n',
  );
});
