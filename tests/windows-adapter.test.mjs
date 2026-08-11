import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const adapterSource = new URL("../plugins/project-graph/bin/project-graph.cmd", import.meta.url);
const windowsTest = process.platform === "win32" ? test : test.skip;

async function createPluginFixture() {
  const root = await mkdtemp(join(tmpdir(), "project-graph-windows-adapter-"));
  const adapter = join(root, "bin/project-graph.cmd");
  const payload = join(root, "payloads/win32-x64");
  const node = join(payload, "bin/node.exe");
  const entry = join(payload, "cli/project-graph.mjs");
  const helper = join(payload, "cli/project-graph-ownership-helper.exe");
  await mkdir(join(root, "bin"), { recursive: true });
  await mkdir(join(payload, "bin"), { recursive: true });
  await mkdir(join(payload, "cli"), { recursive: true });
  await copyFile(adapterSource, adapter);
  await copyFile(process.execPath, node);
  await copyFile(process.execPath, helper);
  await writeFile(join(root, "release-version"), "0.1.1\n");
  await writeFile(
    entry,
    'const args = process.argv.slice(2);\nif (args.length === 1 && args[0] === "--version") console.log("0.1.1");\nelse console.log(`forwarded:${args.join(" ")}`);\n',
  );
  return { root, adapter, helper };
}

function run(adapter, args = [], environment = {}) {
  return spawnSync(process.env.ComSpec, ["/d", "/c", adapter, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: "C:\\definitely-not-a-runtime-path", ...environment },
  });
}

windowsTest("the Windows Host adapter uses only its package-local win32-x64 payload", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const version = run(fixture.adapter, ["--version"]);
  assert.deepEqual(
    { status: version.status, stdout: version.stdout, stderr: version.stderr },
    { status: 0, stdout: "0.1.1\r\n", stderr: "" },
  );
  const invocation = run(fixture.adapter, ["tool", "list"]);
  assert.deepEqual(
    { status: invocation.status, stdout: invocation.stdout, stderr: invocation.stderr },
    { status: 0, stdout: "forwarded:tool list\n", stderr: "" },
  );
});

windowsTest("the Windows Host adapter fails closed for missing and mismatched payloads", async (context) => {
  const missing = await createPluginFixture();
  const mismatch = await createPluginFixture();
  context.after(() => Promise.all([missing, mismatch].map(({ root }) => rm(root, { recursive: true, force: true }))));

  await rm(missing.helper);
  const missingResult = run(missing.adapter);
  assert.equal(missingResult.status, 1);
  assert.equal(
    missingResult.stderr,
    '{"code":"PAYLOAD_MISSING","message":"Project Graph CLI payload is incomplete."}\r\n',
  );

  await writeFile(join(mismatch.root, "release-version"), "9.9.9\n");
  const mismatchResult = run(mismatch.adapter);
  assert.equal(mismatchResult.status, 1);
  assert.equal(
    mismatchResult.stderr,
    '{"code":"VERSION_MISMATCH","message":"Project Graph CLI payload version does not match the Plugin."}\r\n',
  );
});

windowsTest("the Windows Host adapter fails closed for an unsupported architecture", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const result = run(fixture.adapter, [], { PROCESSOR_ARCHITECTURE: "ARM64" });
  assert.equal(result.status, 1);
  assert.equal(
    result.stderr,
    '{"code":"UNSUPPORTED_TARGET","message":"Project Graph CLI has no payload for this platform."}\r\n',
  );
});
