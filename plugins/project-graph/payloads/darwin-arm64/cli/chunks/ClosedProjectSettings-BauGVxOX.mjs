import { t as v4_default } from "./v4-DD_PkrNo.mjs";
import { t as zod_default } from "./zod-C3_Tqlmo.mjs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
//#region src/core/service/ProjectToolSettingsSchema.ts
var MAC_DEFAULT_FONT_FAMILY = "PingFang SC, PingFang TC, -apple-system";
var DEFAULT_FONT_FAMILY = "-apple-system, BlinkMacSystemFont, MiSans, system-ui, sans-serif";
function createProjectToolSettingSchemas(defaultFontFamily) {
	return {
		defaultFontFamily: zod_default.string().default(defaultFontFamily),
		defaultEdgeLineType: zod_default.union([
			zod_default.literal("solid"),
			zod_default.literal("dashed"),
			zod_default.literal("double")
		]).default("solid"),
		defaultEdgeArrowType: zod_default.union([
			zod_default.literal("default"),
			zod_default.literal("hollow-triangle"),
			zod_default.literal("filled-triangle"),
			zod_default.literal("hollow-diamond"),
			zod_default.literal("filled-diamond")
		]).default("default"),
		historyManagerMode: zod_default.union([zod_default.literal("memoryEfficient"), zod_default.literal("timeEfficient")]).default("timeEfficient"),
		historySize: zod_default.number().int().min(1).max(5e3).default(150),
		showDebug: zod_default.boolean().default(false),
		protectingPrivacy: zod_default.boolean().default(false),
		textIntegerLocationAndSizeRender: zod_default.boolean().default(false),
		isEnableEntityCollision: zod_default.boolean().default(false),
		isEnableSectionCollision: zod_default.boolean().default(false),
		moveFriction: zod_default.number().min(0).max(1).default(.1),
		moveAmplitude: zod_default.number().min(0).max(10).default(2),
		effectsPerferences: zod_default.record(zod_default.string(), zod_default.boolean()).default({}),
		maxPastedImageSize: zod_default.number().int().min(256).max(8192).default(1920),
		aiApiBaseUrl: zod_default.string().default("https://generativelanguage.googleapis.com/v1beta/openai/"),
		aiApiKey: zod_default.string().default(""),
		aiModel: zod_default.string().default("gemini-2.5-flash")
	};
}
function parseProjectToolSettings(rawSettings, defaultFontFamily) {
	const settingSchemas = createProjectToolSettingSchemas(defaultFontFamily);
	const raw = rawSettings && typeof rawSettings === "object" && !Array.isArray(rawSettings) ? rawSettings : {};
	return Object.fromEntries(Object.entries(settingSchemas).map(([key, schema]) => {
		const result = schema.safeParse(raw[key]);
		return [key, result.success ? result.data : schema.parse(void 0)];
	}));
}
//#endregion
//#region src/cli/ClosedProjectSettings.ts
var availableSettings;
var settingsSchema = v4_default.object({});
function loadSettings() {
	if (availableSettings) return availableSettings;
	const path = join(homedir(), "Library", "Application Support", "liren.project-graph", "settings.json");
	let savedSettings = {};
	try {
		const value = JSON.parse(readFileSync(path, "utf8"));
		if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid Settings store");
		savedSettings = value;
	} catch (error) {
		if (!(typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT")) throw error;
	}
	availableSettings = {
		...parseProjectToolSettings(savedSettings, process.platform === "darwin" ? MAC_DEFAULT_FONT_FAMILY : DEFAULT_FONT_FAMILY),
		watch: () => () => {}
	};
	return availableSettings;
}
var Settings = new Proxy({}, {
	get(_target, property) {
		const settings = loadSettings();
		if (typeof property === "string" && property in settings) return settings[property];
		throw new Error(`Closed Project Runtime Host did not acquire the Settings capability: ${String(property)}`);
	},
	set(_target, property, value) {
		const settings = loadSettings();
		if (typeof property !== "string" || !(property in settings)) throw new Error(`Closed Project Runtime Host did not acquire the Settings capability: ${String(property)}`);
		settings[property] = value;
		return true;
	}
});
//#endregion
export { settingsSchema as n, Settings as t };
