import { c as prepareBuiltInToolInvocation } from "./BuiltInToolRegistry-BSSuJBGq.mjs";
import { n as canOpenProjectProvideCapabilities, t as canClosedProjectProvideCapabilities } from "./BuiltInToolRuntimeProfiles-Dz_4e43l.mjs";
import { n as finalizeRuntimeCleanup } from "./RuntimeCleanup-CKF35Wew.mjs";
import { n as acquireProjectOwnership, t as OwnershipHelperError } from "./OwnershipHelper-DvNiGRMl.mjs";
import { realpathSync, statSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { JSDOM } from "jsdom";
import { createConnection } from "node:net";
//#region src/cli/ProjectGraphCliClosedRuntime.ts
async function runClosedProjectRuntime(execute, cleanupTasks = []) {
	const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
	const previousWindow = globalThis.window;
	const previousDocument = globalThis.document;
	Object.assign(globalThis, {
		window: dom.window,
		document: dom.window.document
	});
	Object.defineProperty(dom.window.HTMLCanvasElement.prototype, "getContext", {
		configurable: true,
		value: () => ({ measureText: (text) => ({ width: text.length * 50 }) })
	});
	let result;
	try {
		result = await execute();
	} catch {
		result = {
			ok: false,
			error: {
				code: "TOOL_EXECUTION_FAILED",
				message: "Built-in tool execution failed."
			}
		};
	}
	return finalizeRuntimeCleanup(result, [
		...cleanupTasks,
		() => dom.window.close(),
		() => Object.assign(globalThis, {
			window: previousWindow,
			document: previousDocument
		})
	]);
}
//#endregion
//#region src/cli/ProjectGraphCliRuntime.ts
var cancelledResult = () => ({
	ok: false,
	error: {
		code: "CANCELLED",
		message: "Project Graph CLI invocation was cancelled."
	}
});
function canonicalizeProjectPath(projectPath) {
	try {
		const canonicalPath = realpathSync.native(projectPath);
		if (!statSync(canonicalPath).isFile() || !canonicalPath.toLowerCase().endsWith(".prg")) return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
		return {
			ok: true,
			canonicalPath
		};
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return {
			ok: false,
			error: {
				code: "PROJECT_NOT_FOUND",
				message: "Project file was not found."
			}
		};
		return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
	}
}
function isStructuredCliError(output) {
	try {
		const error = JSON.parse(output);
		return !!error && typeof error === "object" && "code" in error && typeof error.code === "string" && "message" in error && typeof error.message === "string";
	} catch {
		return false;
	}
}
async function runOwnedWorker(args, canonicalPath, abortSignal) {
	if (abortSignal?.aborted) return {
		status: null,
		stdout: "",
		stderr: ""
	};
	let acquisition;
	try {
		acquisition = await acquireProjectOwnership(canonicalPath, abortSignal);
	} catch (error) {
		if (abortSignal?.aborted) return {
			status: null,
			stdout: "",
			stderr: ""
		};
		if (error instanceof OwnershipHelperError) return {
			status: null,
			stdout: "",
			stderr: "",
			helperError: error.cliError
		};
		return {
			status: null,
			stdout: "",
			stderr: "",
			error
		};
	}
	if (acquisition.status === "busy") return {
		status: 75,
		stdout: "",
		stderr: "",
		owner: acquisition.owner
	};
	const ownership = acquisition.lease;
	return new Promise((resolve) => {
		const worker = spawn(process.execPath, [
			process.argv[1],
			"--",
			...args
		], {
			env: {
				...process.env,
				PROJECT_GRAPH_CLI_OWNERSHIP_ACQUIRED: "1"
			},
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			windowsHide: true
		});
		const stdoutStream = worker.stdout;
		const stderrStream = worker.stderr;
		if (!stdoutStream || !stderrStream) {
			worker.kill();
			ownership.terminate();
			return resolve({
				status: null,
				stdout: "",
				stderr: "",
				error: /* @__PURE__ */ new Error("CLI worker pipes are unavailable")
			});
		}
		let stdout = "";
		let stderr = "";
		let error;
		let workerClosed = false;
		let ownershipExitedEarly = false;
		ownership.exit.then(() => {
			if (workerClosed) return;
			ownershipExitedEarly = true;
			worker.kill();
		});
		stdoutStream.setEncoding("utf8");
		stderrStream.setEncoding("utf8");
		stdoutStream.on("data", (chunk) => {
			stdout += chunk;
		});
		stderrStream.on("data", (chunk) => {
			stderr += chunk;
		});
		worker.once("error", (workerError) => {
			error = workerError;
		});
		const cancelWorker = () => {
			const signal = abortSignal?.reason === "SIGINT" ? "SIGINT" : "SIGTERM";
			try {
				worker.kill(signal);
			} catch (workerError) {
				if (workerError.code !== "ESRCH") error = workerError;
			}
		};
		abortSignal?.addEventListener("abort", cancelWorker, { once: true });
		worker.once("close", (status) => {
			workerClosed = true;
			abortSignal?.removeEventListener("abort", cancelWorker);
			ownership.release().then(() => {
				if (ownershipExitedEarly) resolve({
					status,
					stdout,
					stderr,
					helperError: {
						code: "OWNERSHIP_HELPER_FAILED",
						message: "Project ownership helper failed."
					}
				});
				else resolve({
					status,
					stdout,
					stderr,
					...error ? { error } : {}
				});
			}).catch((releaseError) => {
				if (releaseError instanceof OwnershipHelperError) resolve({
					status,
					stdout,
					stderr,
					helperError: releaseError.cliError
				});
				else resolve({
					status,
					stdout,
					stderr,
					error: releaseError
				});
			});
		});
		if (abortSignal?.aborted) cancelWorker();
	});
}
function waitForOwnerRetry(abortSignal) {
	if (abortSignal?.aborted) return Promise.resolve();
	return new Promise((resolve) => {
		const finish = () => {
			clearTimeout(timeout);
			abortSignal?.removeEventListener("abort", finish);
			resolve();
		};
		const timeout = setTimeout(finish, 5e3);
		abortSignal?.addEventListener("abort", finish, { once: true });
	});
}
function invokeOpenProjectTool(endpoint, request, abortSignal) {
	return new Promise((resolve) => {
		let address;
		try {
			address = new URL(endpoint);
			if (address.protocol !== "tcp:" || !address.hostname || !address.port) throw new Error("Invalid endpoint");
		} catch {
			resolve({
				ok: false,
				error: {
					code: "RUNTIME_HOST_UNAVAILABLE",
					message: "Open Project Runtime Host is unavailable."
				}
			});
			return;
		}
		let output = "";
		let settled = false;
		const requestId = randomUUID();
		const cancellationRequest = `${JSON.stringify({ cancelRequestId: requestId })}\n`;
		let connected = false;
		const sendCancellation = () => {
			if (connected) socket.write(cancellationRequest);
		};
		const finish = (result) => {
			if (settled) return;
			settled = true;
			abortSignal?.removeEventListener("abort", sendCancellation);
			resolve(abortSignal?.aborted ? cancelledResult() : result);
		};
		const unavailable = () => finish({
			ok: false,
			error: {
				code: "RUNTIME_HOST_UNAVAILABLE",
				message: "Open Project Runtime Host is unavailable."
			}
		});
		const socket = createConnection({
			host: address.hostname,
			port: Number(address.port)
		});
		socket.setEncoding("utf8");
		socket.once("connect", () => {
			connected = true;
			socket.write(`${JSON.stringify({
				requestId,
				...request
			})}\n`);
			if (abortSignal?.aborted) sendCancellation();
		});
		abortSignal?.addEventListener("abort", sendCancellation, { once: true });
		socket.on("data", (chunk) => {
			output += chunk;
		});
		socket.once("error", unavailable);
		socket.once("end", () => {
			try {
				const response = JSON.parse(output);
				if (!response || typeof response !== "object" || !("ok" in response)) return unavailable();
				if (response.ok === true && "value" in response) return finish({
					ok: true,
					value: response.value
				});
				if (response.ok === false && "error" in response && response.error && typeof response.error === "object" && "code" in response.error && typeof response.error.code === "string" && "message" in response.error && typeof response.error.message === "string") return finish({
					ok: false,
					error: response.error
				});
				unavailable();
			} catch {
				unavailable();
			}
		});
	});
}
function invokeConnectableOwner(endpoint, canonicalPath, options) {
	return invokeOpenProjectTool(endpoint, {
		projectPath: canonicalPath,
		toolName: options.toolName,
		input: options.input
	}, options.abortSignal);
}
async function runPathRoutedInvocation$1(options, invokeClosedProjectTool) {
	if (options.abortSignal?.aborted) return cancelledResult();
	let prepared;
	try {
		prepared = prepareBuiltInToolInvocation(options.toolName, options.input, (capabilities) => canClosedProjectProvideCapabilities(capabilities) || canOpenProjectProvideCapabilities());
	} catch {
		return {
			ok: false,
			error: {
				code: "TOOL_EXECUTION_FAILED",
				message: "Built-in tool execution failed."
			}
		};
	}
	const requiresOpenProject = !canClosedProjectProvideCapabilities(prepared.definition.capabilities);
	if (process.env.PROJECT_GRAPH_CLI_OWNERSHIP_ACQUIRED === "1" && requiresOpenProject) return {
		ok: false,
		error: {
			code: "PROJECT_MUST_BE_OPEN",
			message: "This tool requires a matching Open Project."
		}
	};
	const projectPathResult = canonicalizeProjectPath(options.projectPath);
	if (!projectPathResult.ok) return projectPathResult;
	if (process.env.PROJECT_GRAPH_CLI_OWNERSHIP_ACQUIRED === "1") return invokeClosedProjectTool({
		...options,
		canonicalPath: projectPathResult.canonicalPath
	});
	const args = [
		"tool",
		"invoke",
		options.toolName,
		"--project",
		projectPathResult.canonicalPath,
		"--input",
		JSON.stringify(options.input),
		...options.allowUpgrade ? ["--allow-upgrade"] : []
	];
	let worker = await runOwnedWorker(args, projectPathResult.canonicalPath, options.abortSignal);
	if (worker.status === 75 && worker.owner?.kind === "connectable") return invokeConnectableOwner(worker.owner.endpoint, projectPathResult.canonicalPath, options);
	if (worker.status === 75) {
		await waitForOwnerRetry(options.abortSignal);
		if (options.abortSignal?.aborted) return cancelledResult();
		worker = await runOwnedWorker(args, projectPathResult.canonicalPath, options.abortSignal);
	}
	if (worker.status === 75) {
		if (worker.owner?.kind === "connectable") return invokeConnectableOwner(worker.owner.endpoint, projectPathResult.canonicalPath, options);
		return {
			ok: false,
			error: {
				code: "PROJECT_BUSY",
				message: "Project is already owned by another runtime."
			}
		};
	}
	if (worker.helperError) return {
		ok: false,
		error: worker.helperError
	};
	if (worker.error || worker.status === null) {
		if (options.abortSignal?.aborted) return cancelledResult();
		return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
	}
	if (worker.status !== 0 && !isStructuredCliError(worker.stderr)) return {
		ok: false,
		error: {
			code: "PROJECT_LOAD_FAILED",
			message: "Project file could not be loaded."
		}
	};
	if (worker.stdout) process.stdout.write(worker.stdout);
	if (worker.stderr) process.stderr.write(worker.stderr);
	return {
		forwarded: true,
		exitCode: worker.status
	};
}
function createProjectGraphCliRuntime(invokeClosedProjectTool) {
	return { runPathRoutedInvocation: (options) => runPathRoutedInvocation$1(options, invokeClosedProjectTool) };
}
//#endregion
//#region src/cli/ProjectGraphCliProductionRuntime.ts
function invokeClosedProjectToolInProduction(options) {
	return runClosedProjectRuntime(async () => {
		const { invokeClosedProjectTool, loadPrecompiledClosedProjectModule } = await import("./ClosedProjectInvocation-Bokk3i0V.mjs");
		return invokeClosedProjectTool(options, loadPrecompiledClosedProjectModule);
	});
}
var { runPathRoutedInvocation } = createProjectGraphCliRuntime(invokeClosedProjectToolInProduction);
//#endregion
export { runPathRoutedInvocation };
