import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("one Integration Release metadata source drives both Host package identities", async () => {
  const release = await readJson("../release.json");
  const codexMarketplace = await readJson("../.agents/plugins/marketplace.json");
  const codexPlugin = await readJson("../plugins/project-graph/.codex-plugin/plugin.json");
  const claudeMarketplace = await readJson("../.claude-plugin/marketplace.json");
  const claudePlugin = await readJson("../plugins/project-graph/.claude-plugin/plugin.json");

  assert.deepEqual(release, {
    schemaVersion: 1,
    version: "0.1.8",
    projectGraph: {
      repository: "https://github.com/QinMian5/project-graph",
      revision: "7a1cebb09ea9c9736f79e3b236e1c1a6c2eaba8f",
    },
    hostRuntime: {
      node: ">=22.13.0",
      packageManager: "npm",
      installMode: "persistent-plugin-data",
    },
    targets: {
      "darwin-arm64": {
        ownershipHelper: {
          sourcePath: "app/src-tauri/target/debug/project-graph-ownership-helper",
          sha256: "105001bbce022a364ca85ad99854790eacc4d93c847fb98efa18fbab7591f313",
        },
      },
      "win32-x64": {
        ownershipHelper: {
          sourcePath: "app/src-tauri/target/release/project-graph-ownership-helper.exe",
          sha256: "0950509cad604770c0fd2d90966d09b8f3273ea9fd8b7b8fdeb6e878971d1801",
        },
      },
    },
  });
  assert.equal(codexMarketplace.name, "project-graph");
  assert.equal(codexMarketplace.interface.displayName, "Project Graph");
  assert.deepEqual(codexMarketplace.plugins.map(({ name, source }) => ({ name, source })), [
    { name: "project-graph", source: { source: "local", path: "./plugins/project-graph" } },
  ]);
  assert.equal(codexPlugin.name, "project-graph");
  assert.equal(codexPlugin.version, release.version);
  assert.equal(codexPlugin.homepage, "https://github.com/QinMian5/project-graph-plugins");
  assert.equal(codexPlugin.repository, "https://github.com/QinMian5/project-graph-plugins");
  assert.deepEqual(codexPlugin.author, { name: "Mian Qin", url: "https://github.com/QinMian5" });
  assert.equal(codexPlugin.interface.developerName, "Mian Qin");
  assert.equal(codexPlugin.interface.displayName, "Project Graph");

  assert.equal(claudeMarketplace.name, "project-graph");
  assert.deepEqual(claudeMarketplace.plugins.map(({ name, source, version }) => ({ name, source, version })), [
    { name: "project-graph", source: "./plugins/project-graph", version: release.version },
  ]);
  assert.equal(claudePlugin.name, "project-graph");
  assert.equal(claudePlugin.displayName, "Project Graph");
  assert.equal(claudePlugin.version, release.version);
  assert.equal(claudePlugin.homepage, "https://github.com/QinMian5/project-graph-plugins");
  assert.equal(claudePlugin.repository, "https://github.com/QinMian5/project-graph-plugins");
  assert.deepEqual(claudePlugin.author, { name: "Mian Qin", url: "https://github.com/QinMian5" });
  assert.deepEqual(claudeMarketplace.owner, { name: "Mian Qin", url: "https://github.com/QinMian5" });
});

test("the release projection command detects and repairs version drift", async () => {
  const root = await mkdtemp(join(tmpdir(), "project-graph-release-projection-"));
  const codexManifestDirectory = join(root, "plugins/project-graph/.codex-plugin");
  const claudeManifestDirectory = join(root, "plugins/project-graph/.claude-plugin");
  const claudeMarketplaceDirectory = join(root, ".claude-plugin");
  const sharedSkillDirectory = join(root, "shared/skills/project-graph");
  const codexSkillDirectory = join(root, "plugins/project-graph/skills/project-graph");
  await mkdir(codexManifestDirectory, { recursive: true });
  await mkdir(claudeManifestDirectory, { recursive: true });
  await mkdir(claudeMarketplaceDirectory, { recursive: true });
  await mkdir(sharedSkillDirectory, { recursive: true });
  await mkdir(codexSkillDirectory, { recursive: true });
  await writeFile(join(root, "release.json"), '{"version":"9.8.7"}\n');
  await writeFile(join(codexManifestDirectory, "plugin.json"), '{"name":"project-graph","version":"0.0.0"}\n');
  await writeFile(join(claudeManifestDirectory, "plugin.json"), '{"name":"project-graph","version":"0.0.0"}\n');
  await writeFile(
    join(claudeMarketplaceDirectory, "marketplace.json"),
    '{"name":"project-graph","plugins":[{"name":"project-graph","version":"0.0.0"}]}\n',
  );
  await writeFile(join(root, "plugins/project-graph/release-version"), "0.0.0\n");
  await writeFile(join(sharedSkillDirectory, "SKILL.md"), "canonical\n");
  await writeFile(join(codexSkillDirectory, "SKILL.md"), "stale\n");

  const command = fileURLToPath(new URL("../scripts/sync-release.mjs", import.meta.url));
  const check = spawnSync(process.execPath, [command, "--root", root, "--check"], { encoding: "utf8" });
  assert.equal(check.status, 1);
  assert.match(check.stderr, /release projections are stale/);

  const sync = spawnSync(process.execPath, [command, "--root", root], { encoding: "utf8" });
  assert.deepEqual({ status: sync.status, stderr: sync.stderr }, { status: 0, stderr: "" });
  assert.equal(JSON.parse(await readFile(join(codexManifestDirectory, "plugin.json"), "utf8")).version, "9.8.7");
  assert.equal(JSON.parse(await readFile(join(claudeManifestDirectory, "plugin.json"), "utf8")).version, "9.8.7");
  assert.equal(
    JSON.parse(await readFile(join(claudeMarketplaceDirectory, "marketplace.json"), "utf8")).plugins[0].version,
    "9.8.7",
  );
  assert.equal(await readFile(join(root, "plugins/project-graph/release-version"), "utf8"), "9.8.7\n");
  assert.equal(await readFile(join(codexSkillDirectory, "SKILL.md"), "utf8"), "canonical\n");
});
