//#region src/core/service/dataManageService/aiEngine/BuiltInToolRuntimeProfiles.ts
var closedProjectCapabilities = new Set([
	"project",
	"references",
	"history",
	"effects",
	"delete",
	"text",
	"graph",
	"layout",
	"tree-import",
	"node-connect",
	"attachments",
	"dom",
	"image",
	"settings",
	"network",
	"model",
	"abort-signal"
]);
function canClosedProjectProvideCapabilities(capabilities) {
	return capabilities.every((capability) => closedProjectCapabilities.has(capability));
}
function canOpenProjectProvideCapabilities() {
	return true;
}
//#endregion
export { canOpenProjectProvideCapabilities as n, canClosedProjectProvideCapabilities as t };
