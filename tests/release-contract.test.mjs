import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("one Integration Release metadata source drives the Codex package identity", async () => {
  const release = await readJson("../release.json");
  const marketplace = await readJson("../.agents/plugins/marketplace.json");
  const plugin = await readJson("../plugins/project-graph/.codex-plugin/plugin.json");

  assert.deepEqual(release, {
    schemaVersion: 1,
    version: "0.1.0",
    projectGraph: {
      repository: "https://github.com/graphif/project-graph",
      revision: "5e924e48111e4f4cd3d38135053416befde70bf9",
    },
    targets: {
      "darwin-arm64": {
        ownershipHelper: {
          sourcePath: "app/src-tauri/target/debug/project-graph-ownership-helper",
          sha256: "e1c47324bbe801ee8b5b5164129d80343fd75a5f7ea7d47c56ffb165c1f2495d",
        },
        node: {
          version: "26.7.0",
          archive: "node-v26.7.0-darwin-arm64.tar.gz",
          sha256: "7ee659a7768e641bbfd5360940660b8e8fd0052f77488f365562bac522fc15d4",
        },
      },
    },
  });
  assert.equal(marketplace.name, "project-graph");
  assert.equal(marketplace.interface.displayName, "Project Graph");
  assert.deepEqual(marketplace.plugins.map(({ name, source }) => ({ name, source })), [
    { name: "project-graph", source: { source: "local", path: "./plugins/project-graph" } },
  ]);
  assert.equal(plugin.name, "project-graph");
  assert.equal(plugin.version, release.version);
  assert.equal(plugin.homepage, "https://github.com/QinMian5/project-graph-plugins");
  assert.equal(plugin.repository, "https://github.com/QinMian5/project-graph-plugins");
  assert.equal(plugin.interface.displayName, "Project Graph");
});

test("the release projection command detects and repairs version drift", async () => {
  const root = await mkdtemp(join(tmpdir(), "project-graph-release-projection-"));
  const manifestDirectory = join(root, "plugins/project-graph/.codex-plugin");
  const sharedSkillDirectory = join(root, "shared/skills/project-graph");
  const codexSkillDirectory = join(root, "plugins/project-graph/skills/project-graph");
  await mkdir(manifestDirectory, { recursive: true });
  await mkdir(sharedSkillDirectory, { recursive: true });
  await mkdir(codexSkillDirectory, { recursive: true });
  await writeFile(join(root, "release.json"), '{"version":"9.8.7"}\n');
  await writeFile(join(manifestDirectory, "plugin.json"), '{"name":"project-graph","version":"0.0.0"}\n');
  await writeFile(join(root, "plugins/project-graph/release-version"), "0.0.0\n");
  await writeFile(join(sharedSkillDirectory, "SKILL.md"), "canonical\n");
  await writeFile(join(codexSkillDirectory, "SKILL.md"), "stale\n");

  const command = fileURLToPath(new URL("../scripts/sync-release.mjs", import.meta.url));
  const check = spawnSync(process.execPath, [command, "--root", root, "--check"], { encoding: "utf8" });
  assert.equal(check.status, 1);
  assert.match(check.stderr, /release projections are stale/);

  const sync = spawnSync(process.execPath, [command, "--root", root], { encoding: "utf8" });
  assert.deepEqual({ status: sync.status, stderr: sync.stderr }, { status: 0, stderr: "" });
  assert.equal(JSON.parse(await readFile(join(manifestDirectory, "plugin.json"), "utf8")).version, "9.8.7");
  assert.equal(await readFile(join(root, "plugins/project-graph/release-version"), "utf8"), "9.8.7\n");
  assert.equal(await readFile(join(codexSkillDirectory, "SKILL.md"), "utf8"), "canonical\n");
});
