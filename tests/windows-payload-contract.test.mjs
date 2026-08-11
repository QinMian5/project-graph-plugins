import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, lstat, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const payloadRoot = new URL("../plugins/project-graph/payloads/win32-x64/", import.meta.url);
const readJson = async (url) => JSON.parse(await readFile(url, "utf8"));

async function assertNoSymlinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const metadata = await lstat(path);
    assert.equal(metadata.isSymbolicLink(), false, `${path} is a symlink`);
    if (metadata.isDirectory()) await assertNoSymlinks(path);
  }
}

test("the shared Host package contains a locked win32-x64 CLI template without Node", async () => {
  const release = await readJson(new URL("release.json", root));
  const target = release.targets["win32-x64"];
  assert.ok(target, "release metadata does not define win32-x64");

  for (const path of [
    "cli/project-graph.mjs",
    "cli/project-graph-ownership-helper.exe",
    "cli/package.json",
    "cli/package-lock.json",
    "licenses/project-graph-GPL-3.0.txt",
    "VERSION",
    "provenance.json",
  ]) {
    await assert.doesNotReject(readFile(new URL(path, payloadRoot)), `${path} is missing`);
  }
  for (const path of ["bin/node.exe", "cli/node_modules", "licenses/node-LICENSE"]) {
    await assert.rejects(access(new URL(path, payloadRoot)), `${path} must not be bundled`);
  }

  const provenance = await readJson(new URL("provenance.json", payloadRoot));
  assert.deepEqual(provenance, {
    integrationRelease: release.version,
    target: "win32-x64",
    projectGraph: release.projectGraph,
    hostRuntime: release.hostRuntime,
    ownershipHelper: target.ownershipHelper,
    dependencyInstall: "npm ci --omit=dev --include=optional --no-audit --no-fund",
    materializer: "pnpm --filter @graphif/project-graph materialize:cli",
  });
  assert.equal(
    createHash("sha256")
      .update(await readFile(new URL("cli/project-graph-ownership-helper.exe", payloadRoot)))
      .digest("hex"),
    target.ownershipHelper.sha256,
  );
  const runtimePackage = await readJson(new URL("cli/package.json", payloadRoot));
  const packageLock = await readJson(new URL("cli/package-lock.json", payloadRoot));
  assert.equal(runtimePackage.version, release.version);
  assert.equal(runtimePackage.engines.node, release.hostRuntime.node);
  assert.ok(runtimePackage.dependencies.jsdom);
  assert.ok(runtimePackage.dependencies.sharp);
  assert.equal(runtimePackage.dependencies.tsx, undefined);
  assert.equal(runtimePackage.dependencies.vite, undefined);
  assert.equal(packageLock.version, runtimePackage.version);
  assert.deepEqual(packageLock.packages[""].dependencies, runtimePackage.dependencies);
  assert.deepEqual(packageLock.packages[""].engines, runtimePackage.engines);
  assert.match(
    await readFile(new URL("licenses/project-graph-GPL-3.0.txt", payloadRoot), "utf8"),
    /GNU GENERAL PUBLIC LICENSE/,
  );
  assert.equal(await readFile(new URL("VERSION", payloadRoot), "utf8"), `${release.version}\n`);
  await assertNoSymlinks(fileURLToPath(payloadRoot));
});
