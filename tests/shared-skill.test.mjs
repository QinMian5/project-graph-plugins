import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the Codex package contains the canonical Shared Skill Core verbatim", async () => {
  const canonical = await readFile(new URL("../shared/skills/project-graph/SKILL.md", import.meta.url), "utf8");
  const codex = await readFile(
    new URL("../plugins/project-graph/skills/project-graph/SKILL.md", import.meta.url),
    "utf8",
  );

  assert.equal(codex, canonical);
  assert.match(canonical, /^---\nname: project-graph\ndescription:/);
  assert.match(canonical, /explicit `\.prg` Project Path/);
  assert.match(canonical, /tool list/);
  assert.match(canonical, /tool describe <tool-name>/);
  assert.match(canonical, /--project <project-path> --input '<complete-json-object>'/);
  assert.match(canonical, /stdout, stderr, and exit code/);
  assert.match(canonical, /Codex approval mechanism/);
  assert.doesNotMatch(canonical, /get_all_nodes|create_text_node|delete_node/);
});
