import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const arguments_ = process.argv.slice(2);
const rootIndex = arguments_.indexOf("--root");
const root = resolve(rootIndex === -1 ? "." : arguments_[rootIndex + 1]);
const check = arguments_.includes("--check");

const releasePath = resolve(root, "release.json");
const manifestPath = resolve(root, "plugins/project-graph/.codex-plugin/plugin.json");
const versionPath = resolve(root, "plugins/project-graph/release-version");
const sharedSkillPath = resolve(root, "shared/skills/project-graph/SKILL.md");
const codexSkillPath = resolve(root, "plugins/project-graph/skills/project-graph/SKILL.md");

try {
  const release = JSON.parse(await readFile(releasePath, "utf8"));
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const projectedVersion = await readFile(versionPath, "utf8").catch(() => "");
  const sharedSkill = await readFile(sharedSkillPath, "utf8");
  const codexSkill = await readFile(codexSkillPath, "utf8").catch(() => "");
  const stale =
    manifest.version !== release.version ||
    projectedVersion !== `${release.version}\n` ||
    codexSkill !== sharedSkill;

  if (check && stale) throw new Error("release projections are stale; run npm run sync-release");
  if (!stale) process.exit(0);

  manifest.version = release.version;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(versionPath, `${release.version}\n`);
  await mkdir(resolve(codexSkillPath, ".."), { recursive: true });
  await writeFile(codexSkillPath, sharedSkill);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
