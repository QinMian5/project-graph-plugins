import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("both Host packages expose one canonical Shared Skill Core verbatim", async () => {
  const canonical = await readFile(new URL("../shared/skills/project-graph/SKILL.md", import.meta.url), "utf8");
  const hostSkill = await readFile(
    new URL("../plugins/project-graph/skills/project-graph/SKILL.md", import.meta.url),
    "utf8",
  );
  const codexManifest = JSON.parse(
    await readFile(new URL("../plugins/project-graph/.codex-plugin/plugin.json", import.meta.url), "utf8"),
  );
  const claudeManifest = JSON.parse(
    await readFile(new URL("../plugins/project-graph/.claude-plugin/plugin.json", import.meta.url), "utf8"),
  );

  assert.equal(hostSkill, canonical);
  assert.equal(codexManifest.skills, "./skills/");
  assert.equal(claudeManifest.skills, "./skills/");
  assert.match(canonical, /^---\nname: project-graph\ndescription:/);
  assert.match(canonical, /explicit `\.prg` Project Path/);
  assert.match(canonical, /tool list/);
  assert.match(canonical, /tool describe <tool-name>/);
  assert.match(canonical, /--project <project-path> --input '<complete-json-object>'/);
  assert.match(canonical, /stdout, stderr, and exit code/);
  assert.match(canonical, /Host's approval mechanism/);
  assert.doesNotMatch(canonical, /Codex|Claude Code/);
  assert.doesNotMatch(canonical, /get_all_nodes|create_text_node|delete_node/);
});
