//#region src/core/RuntimeCleanup.ts
var RuntimeCleanupError = class extends Error {};
function runtimeCleanupFailure(executionError) {
	return {
		ok: false,
		error: {
			code: "RUNTIME_CLEANUP_FAILED",
			message: "Project Runtime Host cleanup failed.",
			...executionError ? { details: { executionError } } : {}
		}
	};
}
async function finalizeRuntimeCleanup(result, cleanupTasks) {
	let cleanupFailed = false;
	for (const cleanup of cleanupTasks) try {
		await cleanup();
	} catch {
		cleanupFailed = true;
	}
	if (!cleanupFailed) return result;
	return runtimeCleanupFailure(result.ok ? void 0 : result.error);
}
//#endregion
export { finalizeRuntimeCleanup as n, runtimeCleanupFailure as r, RuntimeCleanupError as t };
