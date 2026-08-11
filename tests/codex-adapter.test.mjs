import assert from "node:assert/strict";
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const adapterSource = new URL("../plugins/project-graph/bin/project-graph", import.meta.url);

async function createPluginFixture() {
  const root = await mkdtemp(join(tmpdir(), "project-graph-codex-adapter-"));
  const adapter = join(root, "bin/project-graph");
  const payload = join(root, "payloads/darwin-arm64");
  const node = join(payload, "bin/node");
  const entry = join(payload, "cli/project-graph.mjs");
  const helper = join(payload, "cli/project-graph-ownership-helper");
  await mkdir(join(root, "bin"), { recursive: true });
  await mkdir(join(payload, "bin"), { recursive: true });
  await mkdir(join(payload, "cli"), { recursive: true });
  await copyFile(adapterSource, adapter);
  await chmod(adapter, 0o755);
  await writeFile(join(root, "release-version"), "0.1.0\n");
  await writeFile(
    node,
    '#!/bin/sh\nshift\nif [ "${1-}" = "--version" ]; then printf "0.1.0\\n"; exit 0; fi\nprintf "forwarded:%s\\n" "$*"\n',
  );
  await chmod(node, 0o755);
  await writeFile(entry, "// fixture entry\n");
  await writeFile(helper, "#!/bin/sh\nexit 0\n");
  await chmod(helper, 0o755);
  return { root, adapter, node, helper };
}

function run(adapter, args = [], environment = {}) {
  return spawnSync(adapter, args, {
    encoding: "utf8",
    env: { PATH: "/definitely-not-a-runtime-path", ...environment },
  });
}

test("the shared Host adapter uses only its package-local darwin-arm64 payload", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const version = run(fixture.adapter, ["--version"]);
  assert.deepEqual(
    { status: version.status, stdout: version.stdout, stderr: version.stderr },
    { status: 0, stdout: "0.1.0\n", stderr: "" },
  );
  const invocation = run(fixture.adapter, ["tool", "list"]);
  assert.deepEqual(
    { status: invocation.status, stdout: invocation.stdout, stderr: invocation.stderr },
    { status: 0, stdout: "forwarded:tool list\n", stderr: "" },
  );
});

test("the shared Host adapter fails closed for an unsupported target", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));

  const productionAdapter = await readFile(adapterSource, "utf8");
  assert.doesNotMatch(productionAdapter, /PROJECT_GRAPH_ADAPTER_TEST/);
  const unsupportedAdapter = productionAdapter.replace("Darwin:arm64) target=darwin-arm64", "Unsupported:target) target=darwin-arm64");
  assert.notEqual(unsupportedAdapter, productionAdapter);
  await writeFile(fixture.adapter, unsupportedAdapter);
  const result = run(fixture.adapter);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"UNSUPPORTED_TARGET","message":"Project Graph CLI has no payload for this platform."}\n',
  );
});

test("the shared Host adapter fails closed when payload files are missing or not executable", async (context) => {
  const missing = await createPluginFixture();
  const notExecutable = await createPluginFixture();
  context.after(() => Promise.all([missing, notExecutable].map(({ root }) => rm(root, { recursive: true, force: true }))));

  await rm(missing.helper);
  const missingResult = run(missing.adapter);
  assert.equal(missingResult.status, 1);
  assert.equal(
    missingResult.stderr,
    '{"code":"PAYLOAD_MISSING","message":"Project Graph CLI payload is incomplete."}\n',
  );

  await chmod(notExecutable.node, 0o644);
  const modeResult = run(notExecutable.adapter);
  assert.equal(modeResult.status, 1);
  assert.equal(
    modeResult.stderr,
    '{"code":"PAYLOAD_NOT_EXECUTABLE","message":"Project Graph CLI payload is not executable."}\n',
  );
});

test("the shared Host adapter fails closed when the bundled CLI version does not match", async (context) => {
  const fixture = await createPluginFixture();
  context.after(() => rm(fixture.root, { recursive: true, force: true }));
  await writeFile(join(fixture.root, "release-version"), "0.1.1\n");

  const result = run(fixture.adapter);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    '{"code":"VERSION_MISMATCH","message":"Project Graph CLI payload version does not match the Plugin."}\n',
  );
});
