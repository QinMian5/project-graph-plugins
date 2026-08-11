import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const pluginRoot = new URL("../plugins/project-graph/", import.meta.url);

async function assertMissing(path) {
  await assert.rejects(access(new URL(path, pluginRoot)));
}

test("the plugin uses the Host Node runtime and keeps dependencies out of the package", async () => {
  await Promise.all([
    assertMissing("payloads/darwin-arm64/bin/node"),
    assertMissing("payloads/win32-x64/bin/node.exe"),
    assertMissing("payloads/darwin-arm64/cli/node_modules"),
    assertMissing("payloads/win32-x64/cli/node_modules"),
  ]);

  for (const target of ["darwin-arm64", "win32-x64"]) {
    await assert.doesNotReject(access(new URL(`payloads/${target}/cli/package-lock.json`, pluginRoot)));
  }

  const unixAdapter = await readFile(new URL("bin/project-graph", pluginRoot), "utf8");
  const windowsAdapter = await readFile(new URL("bin/project-graph.cmd", pluginRoot), "utf8");
  assert.match(unixAdapter, /command -v node/);
  assert.match(windowsAdapter, /where node/);
  assert.match(unixAdapter, /runtime\/bootstrap\.mjs/);
  assert.match(windowsAdapter, /runtime\\bootstrap\.mjs/);
});
