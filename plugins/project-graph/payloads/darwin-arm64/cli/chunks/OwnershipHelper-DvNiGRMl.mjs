import { spawn } from "node:child_process";
//#region src/cli/OwnershipHelper.ts
var OwnershipHelperError = class extends Error {
	cliError;
	name = "OwnershipHelperError";
	constructor(cliError) {
		super(cliError.message);
		this.cliError = cliError;
	}
};
var OwnershipHelperLease = class {
	child;
	exit;
	released = false;
	constructor(child) {
		this.child = child;
		this.exit = waitForExit(child);
	}
	async release() {
		if (this.released) return;
		if (this.child.exitCode !== null || this.child.signalCode !== null) throw helperProcessFailure(this.child);
		this.released = true;
		this.child.stdin.end();
		const exit = await this.exit;
		const protocolError = helperProtocolErrors.get(this.child);
		if (protocolError) throw protocolError;
		if (exit.code !== 0) throw helperFailed();
	}
	terminate() {
		if (!this.released) this.child.kill();
	}
};
function helperUnavailable() {
	return new OwnershipHelperError({
		code: "OWNERSHIP_HELPER_UNAVAILABLE",
		message: "Project ownership helper is unavailable."
	});
}
function invalidHelperResponse() {
	return new OwnershipHelperError({
		code: "OWNERSHIP_HELPER_INVALID_RESPONSE",
		message: "Project ownership helper returned an invalid response."
	});
}
function helperFailed() {
	return new OwnershipHelperError({
		code: "OWNERSHIP_HELPER_FAILED",
		message: "Project ownership helper failed."
	});
}
var helperProtocolErrors = /* @__PURE__ */ new WeakMap();
function helperProcessFailure(child) {
	return helperProtocolErrors.get(child) ?? helperFailed();
}
function rejectAdditionalOutput(child) {
	const onData = () => {
		helperProtocolErrors.set(child, invalidHelperResponse());
		child.kill();
	};
	child.stdout.once("data", onData);
	child.once("close", () => child.stdout.off("data", onData));
}
function recordStdinFailure(child) {
	const onError = () => helperProtocolErrors.set(child, helperFailed());
	child.stdin.once("error", onError);
	child.once("close", () => child.stdin.off("error", onError));
}
function projectFailure(code) {
	return new OwnershipHelperError({
		code,
		message: code === "PROJECT_NOT_FOUND" ? "Project file was not found." : "Project file could not be loaded."
	});
}
function ownershipHelperPath() {
	const path = process.env.PROJECT_GRAPH_OWNERSHIP_HELPER_PATH;
	if (!path) throw helperUnavailable();
	return path;
}
function startOwnershipHelper(args) {
	try {
		const child = spawn(ownershipHelperPath(), args, {
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			windowsHide: true
		});
		child.stderr.resume();
		return child;
	} catch {
		throw helperUnavailable();
	}
}
function waitForExit(child) {
	if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve({
		code: child.exitCode,
		signal: child.signalCode
	});
	return new Promise((resolve) => {
		child.once("close", (code, signal) => resolve({
			code,
			signal
		}));
	});
}
function readResponse(child, abortSignal) {
	return new Promise((resolve, reject) => {
		let output = "";
		const cleanup = () => {
			child.stdout.off("data", onData);
			child.off("error", onError);
			child.off("close", onClose);
			abortSignal?.removeEventListener("abort", onAbort);
		};
		const finish = (value) => {
			cleanup();
			rejectAdditionalOutput(child);
			resolve(value);
		};
		const fail = (error) => {
			cleanup();
			child.kill();
			reject(error);
		};
		const onData = (chunk) => {
			output += chunk.toString();
			const newline = output.indexOf("\n");
			if (newline === -1) return;
			if (output.slice(newline + 1) !== "") return fail(invalidHelperResponse());
			try {
				finish(JSON.parse(output.slice(0, newline)));
			} catch {
				fail(invalidHelperResponse());
			}
		};
		const onError = () => fail(helperUnavailable());
		const onClose = () => fail(invalidHelperResponse());
		const onAbort = () => {
			cleanup();
			child.kill();
			reject(helperFailed());
		};
		child.stdout.on("data", onData);
		child.once("error", onError);
		child.once("close", onClose);
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		if (abortSignal?.aborted) onAbort();
	});
}
async function requireExitCode(child, expectedCode) {
	child.stdin.end();
	const exit = await waitForExit(child);
	const protocolError = helperProtocolErrors.get(child);
	if (protocolError) throw protocolError;
	if (exit.code !== expectedCode || exit.signal !== null) throw invalidHelperResponse();
}
function isProjectOwner(value) {
	if (!value || typeof value !== "object" || !("kind" in value)) return false;
	if (value.kind === "unconnectable_holder") return hasExactKeys(value, ["kind"]);
	return value.kind === "connectable" && "endpoint" in value && typeof value.endpoint === "string" && hasExactKeys(value, ["kind", "endpoint"]);
}
function hasExactKeys(value, keys) {
	const actualKeys = Object.keys(value);
	return actualKeys.length === keys.length && keys.every((key) => actualKeys.includes(key));
}
function normalizeWindowsVerbatimPath(path) {
	if (path.startsWith("\\\\?\\UNC\\")) return `\\\\${path.slice(8)}`;
	return path.startsWith("\\\\?\\") ? path.slice(4) : path;
}
async function acquireProjectOwnership(canonicalPath, abortSignal) {
	const child = startOwnershipHelper(["try-hold-project", canonicalPath]);
	const response = await readResponse(child, abortSignal);
	if (!response || typeof response !== "object" || !("status" in response)) {
		child.kill();
		throw invalidHelperResponse();
	}
	if (response.status === "acquired" && "canonicalPath" in response && typeof response.canonicalPath === "string" && normalizeWindowsVerbatimPath(response.canonicalPath) === normalizeWindowsVerbatimPath(canonicalPath) && hasExactKeys(response, ["status", "canonicalPath"])) return {
		status: "acquired",
		canonicalPath,
		lease: new OwnershipHelperLease(child)
	};
	if (response.status === "busy" && "owner" in response && isProjectOwner(response.owner) && hasExactKeys(response, ["status", "owner"])) {
		await requireExitCode(child, 75);
		return {
			status: "busy",
			owner: response.owner
		};
	}
	if (response.status === "error" && "code" in response && (response.code === "PROJECT_NOT_FOUND" || response.code === "PROJECT_LOAD_FAILED") && hasExactKeys(response, ["status", "code"])) {
		await requireExitCode(child, 1);
		throw projectFailure(response.code);
	}
	child.kill();
	throw invalidHelperResponse();
}
async function loadProjectReferences(project, abortSignal) {
	const child = startOwnershipHelper(["load-project-references", project.uri.toString()]);
	recordStdinFailure(child);
	child.stdin.end();
	const response = await readResponse(child, abortSignal);
	if (response && typeof response === "object" && "status" in response && response.status === "loaded" && "snapshot" in response && (response.snapshot === null || typeof response.snapshot === "object" && response.snapshot !== null && !Array.isArray(response.snapshot)) && hasExactKeys(response, ["status", "snapshot"])) {
		await requireExitCode(child, 0);
		return response.snapshot;
	}
	if (response && typeof response === "object" && "status" in response && response.status === "error" && "code" in response && response.code === "REFERENCE_STORE_LOAD_FAILED" && hasExactKeys(response, ["status", "code"])) {
		await requireExitCode(child, 1);
		throw new Error("Project Object Reference store could not be loaded.");
	}
	child.kill();
	throw invalidHelperResponse();
}
async function saveProjectReferences(project, references, abortSignal) {
	const projectUri = project.uri.toString();
	const serializedReferences = JSON.stringify(references);
	const child = startOwnershipHelper(["save-project-references", projectUri]);
	recordStdinFailure(child);
	child.stdin.end(serializedReferences);
	const response = await readResponse(child, abortSignal);
	if (response && typeof response === "object" && "status" in response && response.status === "saved" && hasExactKeys(response, ["status"])) {
		await requireExitCode(child, 0);
		return;
	}
	if (response && typeof response === "object" && "status" in response && response.status === "error" && "code" in response && response.code === "REFERENCE_STORE_SAVE_FAILED" && hasExactKeys(response, ["status", "code"])) {
		await requireExitCode(child, 1);
		throw new Error("Project Object Reference store could not be saved.");
	}
	child.kill();
	throw invalidHelperResponse();
}
//#endregion
export { saveProjectReferences as i, acquireProjectOwnership as n, loadProjectReferences as r, OwnershipHelperError as t };
