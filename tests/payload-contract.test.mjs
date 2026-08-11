import assert from "node:assert/strict";
import { access, constants, lstat, readFile, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pluginRoot = new URL("../plugins/project-graph/", import.meta.url);
const payloadRoot = new URL("payloads/darwin-arm64/", pluginRoot);
const nodePath = new URL("bin/node", payloadRoot);
const entryPath = new URL("cli/project-graph.mjs", payloadRoot);
const helperPath = new URL("cli/project-graph-ownership-helper", payloadRoot);
const adapterPath = new URL("bin/project-graph", pluginRoot);
const readJson = async (url) => JSON.parse(await readFile(url, "utf8"));

function run(command, args, options = {}) {
  return spawnSync(fileURLToPath(command), args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: { PATH: "/definitely-not-a-runtime-path", HOME: process.env.HOME },
  });
}

async function assertNoSymlinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const metadata = await lstat(path);
    assert.equal(metadata.isSymbolicLink(), false, `${path} is a symlink that Codex installation would omit`);
    if (metadata.isDirectory()) await assertNoSymlinks(path);
  }
}

test("the shared Host package contains a self-contained darwin-arm64 production payload", async () => {
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
  const productionDependencies = run(nodePath, ["--eval", "require('jsdom'); require('sharp')"], {
    cwd: fileURLToPath(new URL("cli/", payloadRoot)),
  });
  assert.deepEqual(
    { status: productionDependencies.status, stderr: productionDependencies.stderr },
    { status: 0, stderr: "" },
  );

  const provenance = await readJson(new URL("provenance.json", payloadRoot));
  assert.deepEqual(provenance, {
    integrationRelease: release.version,
    target: "darwin-arm64",
    projectGraph: release.projectGraph,
    node: {
      ...release.targets["darwin-arm64"].node,
      source: `https://nodejs.org/dist/v${release.targets["darwin-arm64"].node.version}/${release.targets["darwin-arm64"].node.archive}`,
      transformations: [
        "strip -u -r preserving napi_, node_api_, node_module_, and uv_ symbols",
        "codesign --force --sign -",
      ],
    },
    ownershipHelper: release.targets["darwin-arm64"].ownershipHelper,
    packageTransformations: [
      "flatten pnpm production dependencies for Codex installation",
      "remove package-manager command shims",
    ],
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  });
  assert.equal(
    createHash("sha256").update(await readFile(helperPath)).digest("hex"),
    release.targets["darwin-arm64"].ownershipHelper.sha256,
  );
  assert.match(await readFile(new URL("licenses/project-graph-GPL-3.0.txt", payloadRoot), "utf8"), /GNU GENERAL PUBLIC LICENSE/);
  assert.match(await readFile(new URL("licenses/node-LICENSE", payloadRoot), "utf8"), /Node\.js/);
  const ignoreResult = spawnSync(
    "git",
    ["check-ignore", "-q", "plugins/project-graph/payloads/darwin-arm64/cli/node_modules/.modules.yaml"],
    { cwd: fileURLToPath(root) },
  );
  assert.equal(ignoreResult.status, 1, "production dependencies are excluded from the candidate ref");
  await assertNoSymlinks(fileURLToPath(payloadRoot));
});
