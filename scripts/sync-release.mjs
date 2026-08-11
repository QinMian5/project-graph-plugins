import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const arguments_ = process.argv.slice(2);
const rootIndex = arguments_.indexOf("--root");
const root = resolve(rootIndex === -1 ? "." : arguments_[rootIndex + 1]);
const check = arguments_.includes("--check");

const releasePath = resolve(root, "release.json");
const codexManifestPath = resolve(root, "plugins/project-graph/.codex-plugin/plugin.json");
const claudeManifestPath = resolve(root, "plugins/project-graph/.claude-plugin/plugin.json");
const claudeMarketplacePath = resolve(root, ".claude-plugin/marketplace.json");
const versionPath = resolve(root, "plugins/project-graph/release-version");
const sharedSkillPath = resolve(root, "shared/skills/project-graph/SKILL.md");
const codexSkillPath = resolve(root, "plugins/project-graph/skills/project-graph/SKILL.md");

try {
  const release = JSON.parse(await readFile(releasePath, "utf8"));
  const codexManifest = JSON.parse(await readFile(codexManifestPath, "utf8"));
  const claudeManifest = JSON.parse(await readFile(claudeManifestPath, "utf8"));
  const claudeMarketplace = JSON.parse(await readFile(claudeMarketplacePath, "utf8"));
  const projectedVersion = await readFile(versionPath, "utf8").catch(() => "");
  const sharedSkill = await readFile(sharedSkillPath, "utf8");
  const codexSkill = await readFile(codexSkillPath, "utf8").catch(() => "");
  const stale =
    codexManifest.version !== release.version ||
    claudeManifest.version !== release.version ||
    claudeMarketplace.plugins[0]?.version !== release.version ||
    projectedVersion !== `${release.version}\n` ||
    codexSkill !== sharedSkill;

  if (check && stale) throw new Error("release projections are stale; run pnpm sync-release");
  if (!stale) process.exit(0);

  codexManifest.version = release.version;
  claudeManifest.version = release.version;
  claudeMarketplace.plugins[0].version = release.version;
  await writeFile(codexManifestPath, `${JSON.stringify(codexManifest, null, 2)}\n`);
  await writeFile(claudeManifestPath, `${JSON.stringify(claudeManifest, null, 2)}\n`);
  await writeFile(claudeMarketplacePath, `${JSON.stringify(claudeMarketplace, null, 2)}\n`);
  await writeFile(versionPath, `${release.version}\n`);
  await mkdir(resolve(codexSkillPath, ".."), { recursive: true });
  await writeFile(codexSkillPath, sharedSkill);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
