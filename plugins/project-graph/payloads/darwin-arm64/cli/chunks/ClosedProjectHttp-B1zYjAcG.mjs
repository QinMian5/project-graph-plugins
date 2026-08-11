//#region src/cli/ClosedProjectHttp.ts
function fetch(...args) {
	return globalThis.fetch(...args);
}
//#endregion
export { fetch as t };
