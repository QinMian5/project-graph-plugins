import assert from "node:assert/strict";
import { access, constants, lstat, readFile, readdir, readlink, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pluginRoot = new URL("../plugins/project-graph/", import.meta.url);
const payloadRoot = new URL("payloads/darwin-arm64/", pluginRoot);
const nodePath = new URL("bin/node", payloadRoot);
const entryPath = new URL("cli/project-graph.mjs", payloadRoot);
const helperPath = new URL("cli/project-graph-ownership-helper", payloadRoot);
const adapterPath = new URL("bin/project-graph", pluginRoot);
const readJson = async (url) => JSON.parse(await readFile(url, "utf8"));

function run(command, args) {
  return spawnSync(fileURLToPath(command), args, {
    encoding: "utf8",
    env: { PATH: "/definitely-not-a-runtime-path", HOME: process.env.HOME },
  });
}

async function assertSymlinksStayInside(directory, rootDirectory = resolve(directory)) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const metadata = await lstat(path);
    if (metadata.isSymbolicLink()) {
      const target = resolve(dirname(path), await readlink(path));
      assert.ok(target.startsWith(`${rootDirectory}/`), `${path} points outside the payload`);
    } else if (metadata.isDirectory()) {
      await assertSymlinksStayInside(path, rootDirectory);
    }
  }
}

test("the Codex package contains a self-contained darwin-arm64 production payload", async () => {
  const release = await readJson(new URL("release.json", root));
  await Promise.all([nodePath, helperPath, adapterPath].map((path) => access(path, constants.X_OK)));
  await access(entryPath, constants.R_OK);

  const nodeVersion = run(nodePath, ["--version"]);
  assert.deepEqual(
    { status: nodeVersion.status, stdout: nodeVersion.stdout, stderr: nodeVersion.stderr },
    { status: 0, stdout: `v${release.targets["darwin-arm64"].node.version}\n`, stderr: "" },
  );
  assert.ok((await stat(nodePath)).size < 100 * 1024 * 1024);
  const nodeTarget = run(nodePath, ["--print", '`${process.platform}-${process.arch}`']);
  assert.deepEqual(
    { status: nodeTarget.status, stdout: nodeTarget.stdout, stderr: nodeTarget.stderr },
    { status: 0, stdout: "darwin-arm64\n", stderr: "" },
  );

  const version = run(adapterPath, ["--version"]);
  assert.deepEqual(
    { status: version.status, stdout: version.stdout, stderr: version.stderr },
    { status: 0, stdout: `${release.version}\n`, stderr: "" },
  );
  const discovery = run(adapterPath, ["tool", "list"]);
  assert.deepEqual({ status: discovery.status, stderr: discovery.stderr }, { status: 0, stderr: "" });
  const tools = JSON.parse(discovery.stdout);
  assert.ok(Array.isArray(tools) && tools.length > 0);
  const description = run(adapterPath, ["tool", "describe", tools[0].name]);
  assert.deepEqual({ status: description.status, stderr: description.stderr }, { status: 0, stderr: "" });
  assert.equal(JSON.parse(description.stdout).name, tools[0].name);

  const runtimePackage = await readJson(new URL("cli/package.json", payloadRoot));
  assert.equal(runtimePackage.version, release.version);
  assert.ok(runtimePackage.dependencies.jsdom);
  assert.ok(runtimePackage.dependencies.sharp);
  assert.equal(runtimePackage.dependencies.tsx, undefined);
  assert.equal(runtimePackage.dependencies.vite, undefined);

  const provenance = await readJson(new URL("provenance.json", payloadRoot));
  assert.deepEqual(provenance, {
    integrationRelease: release.version,
    target: "darwin-arm64",
    projectGraph: release.projectGraph,
    node: {
      ...release.targets["darwin-arm64"].node,
      source: `https://nodejs.org/dist/v${release.targets["darwin-arm64"].node.version}/${release.targets["darwin-arm64"].node.archive}`,
      transformations: ["strip -u -r", "codesign --force --sign -"],
    },
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  });
  assert.match(await readFile(new URL("licenses/project-graph-GPL-3.0.txt", payloadRoot), "utf8"), /GNU GENERAL PUBLIC LICENSE/);
  assert.match(await readFile(new URL("licenses/node-LICENSE", payloadRoot), "utf8"), /Node\.js/);
  await assertSymlinksStayInside(fileURLToPath(payloadRoot));
});
