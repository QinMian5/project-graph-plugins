import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const pluginRoot = new URL("../plugins/project-graph/", import.meta.url);

test("the Claude Code package is the self-contained shared Host package", async () => {
  const entries = new Set(await readdir(pluginRoot));
  for (const required of [
    ".claude-plugin",
    ".codex-plugin",
    "bin",
    "payloads",
    "release-version",
    "skills",
  ]) {
    assert.equal(entries.has(required), true, `${required} is missing from the shared Host package`);
  }
  for (const forbidden of [".mcp.json", "agents", "commands", "data", "hooks", "settings.json", "state"]) {
    assert.equal(entries.has(forbidden), false, `${forbidden} exceeds the Claude Code Host boundary`);
  }

  const marketplace = JSON.parse(
    await readFile(new URL("../.claude-plugin/marketplace.json", import.meta.url), "utf8"),
  );
  assert.equal(marketplace.plugins[0].source, "./plugins/project-graph");

  for (const adapterPath of ["bin/project-graph", "bin/project-graph.cmd"]) {
    const adapter = await readFile(new URL(adapterPath, pluginRoot), "utf8");
    assert.doesNotMatch(
      adapter,
      /get_all_nodes|delete_all_nodes|tool definitions?|orchestrat|hooks?|MCP|REFERENCE_STORE|persistent state/i,
    );
  }
});
