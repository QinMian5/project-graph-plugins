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
async function acquireProjectOwnership(canonicalPath, abortSignal) {
	let child;
	try {
		child = spawn(ownershipHelperPath(), ["try-hold-project", canonicalPath], { stdio: [
			"pipe",
			"pipe",
			"pipe"
		] });
		child.stderr.resume();
	} catch {
		throw helperUnavailable();
	}
	const response = await readResponse(child, abortSignal);
	if (!response || typeof response !== "object" || !("status" in response)) {
		child.kill();
		throw invalidHelperResponse();
	}
	if (response.status === "acquired" && "canonicalPath" in response && response.canonicalPath === canonicalPath && hasExactKeys(response, ["status", "canonicalPath"])) return {
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
async function acquireReferenceStoreLock(storePath, abortSignal) {
	let child;
	try {
		child = spawn(ownershipHelperPath(), ["hold-reference-store", storePath], { stdio: [
			"pipe",
			"pipe",
			"pipe"
		] });
		child.stderr.resume();
	} catch {
		throw helperUnavailable();
	}
	const response = await readResponse(child, abortSignal);
	if (response && typeof response === "object" && "status" in response && response.status === "acquired" && hasExactKeys(response, ["status"])) return new OwnershipHelperLease(child);
	if (response && typeof response === "object" && "status" in response && response.status === "error" && "code" in response && response.code === "REFERENCE_STORE_LOCK_FAILED" && hasExactKeys(response, ["status", "code"])) {
		await requireExitCode(child, 1);
		throw helperFailed();
	}
	child.kill();
	throw invalidHelperResponse();
}
//#endregion
export { acquireProjectOwnership as n, acquireReferenceStoreLock as r, OwnershipHelperError as t };
