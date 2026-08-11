import { t as v4_default } from "./chunks/v4-DD_PkrNo.mjs";
import { c as prepareBuiltInToolInvocation, n as builtInToolCatalog, o as getBuiltInToolDefinition } from "./chunks/BuiltInToolRegistry-Dl_dIFF8.mjs";
import { n as canOpenProjectProvideCapabilities, t as canClosedProjectProvideCapabilities } from "./chunks/BuiltInToolRuntimeProfiles-BScINZH6.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/core/service/dataManageService/aiEngine/BuiltInToolCliAdapter.ts
function toCliEntry({ name, description, inputSchema }) {
	return {
		name,
		description,
		inputSchema: v4_default.toJSONSchema(inputSchema)
	};
}
function getBuiltInToolCliEntries() {
	return builtInToolCatalog.map(toCliEntry);
}
function getBuiltInToolCliEntry(name) {
	const definition = getBuiltInToolDefinition(name);
	return definition ? toCliEntry(definition) : void 0;
}
//#endregion
//#region src/cli/ProjectGraphCli.ts
var help = `Usage: project-graph <command>

Commands:
  tool list
  tool describe <tool>
  tool invoke <tool> --project <path> --input <JSON> [--allow-upgrade]

Options:
  --help     Show help
  --version  Show version
`;
function writeError(error) {
	process.stderr.write(`${JSON.stringify(error)}\n`);
}
async function runProjectGraphCli(args, options) {
	if (args.length === 1 && args[0] === "--help") {
		process.stdout.write(help);
		return 0;
	}
	if (args.length === 1 && args[0] === "--version") {
		process.stdout.write(`${options.version}\n`);
		return 0;
	}
	if (args.length === 2 && args[0] === "tool" && args[1] === "list") {
		process.stdout.write(`${JSON.stringify(getBuiltInToolCliEntries())}\n`);
		return 0;
	}
	if (args.length === 3 && args[0] === "tool" && args[1] === "describe") {
		const definition = getBuiltInToolCliEntry(args[2]);
		if (!definition) {
			writeError({
				code: "UNKNOWN_TOOL",
				message: `Unknown built-in tool: ${args[2]}`
			});
			return 2;
		}
		process.stdout.write(`${JSON.stringify(definition)}\n`);
		return 0;
	}
	if (args[0] === "tool" && args[1] === "invoke") {
		const allowUpgrade = args.length === 8 && args[7] === "--allow-upgrade";
		if (args.length !== 7 && !allowUpgrade || args[3] !== "--project" || args[5] !== "--input") {
			writeError({
				code: "INVALID_COMMAND",
				message: "Invalid Project Graph CLI command."
			});
			return 2;
		}
		const toolName = args[2];
		if (!getBuiltInToolDefinition(toolName)) {
			writeError({
				code: "UNKNOWN_TOOL",
				message: `Unknown built-in tool: ${toolName}`
			});
			return 2;
		}
		let input;
		try {
			input = JSON.parse(args[6]);
		} catch {
			writeError({
				code: "INVALID_JSON",
				message: "The --input value must be valid JSON."
			});
			return 2;
		}
		try {
			prepareBuiltInToolInvocation(toolName, input, (capabilities) => canClosedProjectProvideCapabilities(capabilities) || canOpenProjectProvideCapabilities(capabilities));
		} catch {
			writeError({
				code: "TOOL_INPUT_INVALID",
				message: `Tool input does not match the built-in tool schema: ${toolName}`
			});
			return 2;
		}
		const { runPathRoutedInvocation } = await options.loadRuntime();
		const result = await runPathRoutedInvocation({
			toolName,
			input,
			projectPath: args[4],
			allowUpgrade,
			abortSignal: options.abortSignal
		});
		if ("forwarded" in result) return result.exitCode;
		if (!result.ok) {
			writeError(result.error);
			return result.error.code === "CANCELLED" ? 130 : 1;
		}
		process.stdout.write(`${JSON.stringify(result.value === void 0 ? null : result.value)}\n`);
		return 0;
	}
	writeError({
		code: "INVALID_COMMAND",
		message: "Invalid Project Graph CLI command."
	});
	return 2;
}
async function runProjectGraphCliProcess(options) {
	const args = process.argv.slice(2);
	const abortController = new AbortController();
	const handleSignal = (signal) => abortController.abort(signal);
	const handleSigint = () => handleSignal("SIGINT");
	const handleSigterm = () => handleSignal("SIGTERM");
	process.on("SIGINT", handleSigint);
	process.on("SIGTERM", handleSigterm);
	try {
		process.exitCode = await runProjectGraphCli(args[0] === "--" ? args.slice(1) : args, {
			...options,
			abortSignal: abortController.signal
		});
	} finally {
		process.off("SIGINT", handleSigint);
		process.off("SIGTERM", handleSigterm);
	}
}
//#endregion
//#region src/cli/project-graph-production.ts
process.env.PROJECT_GRAPH_OWNERSHIP_HELPER_PATH = join(dirname(fileURLToPath(import.meta.url)), process.platform === "win32" ? "project-graph-ownership-helper.exe" : "project-graph-ownership-helper");
await runProjectGraphCliProcess({
	version: "0.1.1",
	loadRuntime: () => import("./chunks/ProjectGraphCliProductionRuntime-CuBcZBE-.mjs")
});
//#endregion
export {};
