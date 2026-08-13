import { a as executePreparedBuiltInTool, c as prepareBuiltInToolInvocation, t as BuiltInToolCapabilityUnavailableError } from "./BuiltInToolRegistry-B4jwgOBk.mjs";
import { t as canClosedProjectProvideCapabilities } from "./BuiltInToolRuntimeProfiles-Dz_4e43l.mjs";
import { D as compareProjectVersions, E as LATEST_PROJECT_VERSION, O as parseProjectFile, k as URI, nt as deserialize } from "./ProjectUpgrader-C2CEsQ4r.mjs";
import { f as Decoder, n as ProjectState, o as classifyBuiltInToolRuntimeError, t as Project } from "./Project-eqh45NY9.mjs";
import { n as finalizeRuntimeCleanup, r as runtimeCleanupFailure, t as RuntimeCleanupError } from "./RuntimeCleanup-CKF35Wew.mjs";
import { d as FileSystemProviderFile, t as StageManager, u as AIObjectReferenceRegistry } from "./StageManager-u5iehNnN.mjs";
import "./LineEdge-BnY-O_Qc.mjs";
import { i as saveProjectReferences, r as loadProjectReferences, t as OwnershipHelperError } from "./OwnershipHelper-DvNiGRMl.mjs";
import { readFile, writeFile } from "node:fs/promises";
//#region src/cli/ClosedProjectEffects.ts
var ClosedProjectEffects = class {
	static id = "effects";
	effectsCount = 0;
	addEffect() {}
	addEffects() {}
	tick() {}
};
//#endregion
//#region src/cli/ClosedProjectInvocation.ts
var closedProjectServices = {
	history: {
		moduleId: "/src/core/stage/stageManager/StageHistoryManager.tsx",
		exportName: "HistoryManager",
		load: () => import("./StageHistoryManager-BqYnM8-F.mjs")
	},
	section: {
		moduleId: "/src/core/stage/stageManager/basicMethods/SectionMethods.tsx",
		exportName: "SectionMethods",
		load: () => import("./SectionMethods-Du7HSWx-.mjs")
	},
	sectionInOut: {
		moduleId: "/src/core/stage/stageManager/concreteMethods/StageSectionInOutManager.tsx",
		exportName: "SectionInOutManager",
		load: () => import("./StageSectionInOutManager-BUx1Zt9L.mjs")
	},
	syncAssociation: {
		moduleId: "/src/core/stage/stageManager/concreteMethods/StageSyncAssociationManager.tsx",
		exportName: "StageSyncAssociationManager",
		load: () => import("./StageSyncAssociationManager-BLb0VIfO.mjs")
	},
	delete: {
		moduleId: "/src/core/stage/stageManager/concreteMethods/StageDeleteManager.tsx",
		exportName: "DeleteManager",
		load: () => import("./StageDeleteManager-CsSzSv4D.mjs")
	},
	text: {
		moduleId: "/src/core/render/canvas2d/basicRenderer/textRenderer.tsx",
		exportName: "TextRenderer",
		load: () => import("./textRenderer-BQUSRobq.mjs")
	},
	graph: {
		moduleId: "/src/core/stage/stageManager/basicMethods/GraphMethods.tsx",
		exportName: "GraphMethods",
		load: () => import("./GraphMethods-Bblsl3nd.mjs")
	},
	entityMove: {
		moduleId: "/src/core/stage/stageManager/concreteMethods/StageEntityMoveManager.tsx",
		exportName: "EntityMoveManager",
		load: () => import("./StageEntityMoveManager-2L6BppJn.mjs")
	},
	layout: {
		moduleId: "/src/core/service/controlService/autoLayoutEngine/mainTick.tsx",
		exportName: "AutoLayout",
		load: () => import("./mainTick-8nYOKfZC.mjs")
	},
	fastTreeLayout: {
		moduleId: "/src/core/service/controlService/autoLayoutEngine/autoLayoutFastTreeMode.tsx",
		exportName: "AutoLayoutFastTree",
		load: () => import("./autoLayoutFastTreeMode-C4EWeMzX.mjs")
	},
	stageImport: {
		moduleId: "/src/core/service/dataGenerateService/stageImportEngine/stageImportEngine.tsx",
		exportName: "StageImport",
		load: () => import("./stageImportEngine-CNVC-_eS.mjs")
	},
	nodeConnector: {
		moduleId: "/src/core/stage/stageManager/concreteMethods/StageNodeConnector.tsx",
		exportName: "NodeConnector",
		load: () => import("./StageNodeConnector-BseDhkmi.mjs")
	}
};
async function loadPrecompiledClosedProjectModule(id) {
	const service = Object.values(closedProjectServices).find(({ moduleId }) => moduleId === id);
	if (!service) throw new Error(`Closed Project module is unavailable: ${id}`);
	return await service.load();
}
var closedProjectCapabilityServices = {
	history: [closedProjectServices.history],
	delete: [
		closedProjectServices.section,
		closedProjectServices.sectionInOut,
		closedProjectServices.syncAssociation,
		closedProjectServices.delete
	],
	text: [closedProjectServices.text, closedProjectServices.syncAssociation],
	graph: [closedProjectServices.graph],
	layout: [closedProjectServices.entityMove, closedProjectServices.layout],
	"tree-import": [
		closedProjectServices.entityMove,
		closedProjectServices.fastTreeLayout,
		closedProjectServices.stageImport
	],
	"node-connect": [closedProjectServices.nodeConnector]
};
function loadServiceOnce(project, service) {
	if (!service.id || !project.getService(service.id)) project.loadService(service);
}
async function loadClosedProjectCapability(project, capability, loadModule) {
	if (capability === "effects") loadServiceOnce(project, ClosedProjectEffects);
	for (const service of closedProjectCapabilityServices[capability] ?? []) {
		const loaded = (await loadModule(service.moduleId))[service.exportName];
		if (typeof loaded !== "function") throw new Error(`Closed Project service is unavailable: ${service.exportName}`);
		loadServiceOnce(project, loaded);
	}
}
function createClosedProject(parsed, attachments, canonicalPath) {
	const project = new Project(URI.file(canonicalPath));
	project.registerFileSystemProvider("file", FileSystemProviderFile);
	project.attachments = attachments;
	project.tags = parsed.tags;
	project.references = parsed.references;
	project.metadata = parsed.metadata;
	project.readme = parsed.readme;
	project.stage = deserialize(parsed.serializedStageObjects, project);
	project.loadService(StageManager);
	project.stageManager.updateReferences();
	project.projectState = ProjectState.Saved;
	return {
		project,
		async dispose() {
			await project.dispose();
			project.stage.length = 0;
		}
	};
}
function createClosedProjectRuntimeHost(project, references, loadModule, beforeExecutorInvoke) {
	return {
		beforeExecutorInvoke,
		canProvideCapabilities: canClosedProjectProvideCapabilities,
		async acquireCapabilities(capabilities, context) {
			const acquired = {};
			for (const capability of capabilities) if (capability === "project") acquired.project = project;
			else if (capability === "references") acquired.references = references;
			else if (capability === "abort-signal") acquired[capability] = context.abortSignal;
			else {
				await loadClosedProjectCapability(project, capability, loadModule);
				acquired[capability] = true;
			}
			return acquired;
		}
	};
}
async function executeClosedProjectTool(options, loadModule, lifecycle) {
	const { attachments } = lifecycle;
	let prepared;
	try {
		prepared = prepareBuiltInToolInvocation(options.toolName, options.input, canClosedProjectProvideCapabilities);
	} catch (error) {
		if (error instanceof BuiltInToolCapabilityUnavailableError) return {
			ok: false,
			error: {
				code: "PROJECT_MUST_BE_OPEN",
				message: "This tool requires a matching Open Project."
			}
		};
		return {
			ok: false,
			error: {
				code: "TOOL_EXECUTION_FAILED",
				message: "Built-in tool execution failed."
			}
		};
	}
	let parsed;
	try {
		parsed = await parseProjectFile(new Uint8Array(await readFile(options.canonicalPath)), new Decoder(), attachments);
	} catch {
		return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
	}
	const versionComparison = compareProjectVersions(parsed.metadata.version, LATEST_PROJECT_VERSION);
	if (versionComparison > 0) return {
		ok: false,
		error: {
			code: "PROJECT_VERSION_UNSUPPORTED",
			message: "Project version is newer than this Project Graph runtime."
		}
	};
	if (versionComparison < 0 && !options.allowUpgrade) return {
		ok: false,
		error: {
			code: "PROJECT_UPGRADE_REQUIRED",
			message: "Project must be upgraded before it can be invoked."
		}
	};
	if (versionComparison < 0) try {
		const { ProjectUpgrader } = await import("./ProjectUpgrader-C6tdWPQr.mjs");
		[parsed.serializedStageObjects, parsed.metadata] = ProjectUpgrader.upgradeNAnyToNLatest(parsed.serializedStageObjects, parsed.metadata);
	} catch {
		return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
	}
	const loadedProject = createClosedProject(parsed, attachments, options.canonicalPath);
	const project = loadedProject.project;
	lifecycle.disposeProject = loadedProject.dispose;
	let pendingReferenceSnapshot;
	const references = new AIObjectReferenceRegistry(project, (snapshot) => {
		pendingReferenceSnapshot = snapshot;
	});
	try {
		const storedReferences = await loadProjectReferences(project, options.abortSignal);
		if (storedReferences) references.restoreSnapshot(storedReferences);
	} catch (error) {
		if (options.abortSignal?.aborted) return {
			ok: false,
			error: {
				code: "CANCELLED",
				message: "Project Graph CLI invocation was cancelled."
			}
		};
		if (error instanceof OwnershipHelperError) return {
			ok: false,
			error: error.cliError
		};
		return {
			ok: false,
			error: {
				code: "PROJECT_LOAD_FAILED",
				message: "Project file could not be loaded."
			}
		};
	}
	const executorReadyPath = process.env.PROJECT_GRAPH_CLI_EXECUTOR_READY_PATH;
	let value;
	if (options.abortSignal?.aborted) return {
		ok: false,
		error: {
			code: "CANCELLED",
			message: "Project Graph CLI invocation was cancelled."
		}
	};
	try {
		value = await executePreparedBuiltInTool(prepared, createClosedProjectRuntimeHost(project, references, loadModule, executorReadyPath ? () => writeFile(executorReadyPath, process.hrtime.bigint().toString()) : void 0), { abortSignal: options.abortSignal });
	} catch (error) {
		if (options.abortSignal?.aborted) return {
			ok: false,
			error: {
				code: "CANCELLED",
				message: "Project Graph CLI invocation was cancelled."
			}
		};
		const referenceError = classifyBuiltInToolRuntimeError(error);
		if (referenceError) return {
			ok: false,
			error: referenceError
		};
		return {
			ok: false,
			error: {
				code: "TOOL_EXECUTION_FAILED",
				message: "Built-in tool execution failed."
			}
		};
	}
	if (options.abortSignal?.aborted) return {
		ok: false,
		error: {
			code: "CANCELLED",
			message: "Project Graph CLI invocation was cancelled."
		}
	};
	let projectSaved = false;
	if (project.projectState === ProjectState.Unsaved) try {
		await project.save({ includeThumbnail: false });
		projectSaved = true;
	} catch (error) {
		if (error instanceof RuntimeCleanupError) return runtimeCleanupFailure({
			code: "PROJECT_SAVE_FAILED",
			message: "Project could not be saved."
		});
		return {
			ok: false,
			error: {
				code: "PROJECT_SAVE_FAILED",
				message: "Project could not be saved."
			}
		};
	}
	if (!projectSaved && options.abortSignal?.aborted) return {
		ok: false,
		error: {
			code: "CANCELLED",
			message: "Project Graph CLI invocation was cancelled."
		}
	};
	if (pendingReferenceSnapshot) try {
		await saveProjectReferences(project, pendingReferenceSnapshot, options.abortSignal);
	} catch (error) {
		if (options.abortSignal?.aborted) return {
			ok: false,
			error: {
				code: "CANCELLED",
				message: "Project Graph CLI invocation was cancelled."
			}
		};
		if (error instanceof OwnershipHelperError) return {
			ok: false,
			error: error.cliError
		};
		if (error instanceof RuntimeCleanupError) return runtimeCleanupFailure({
			code: "PROJECT_REFERENCE_SAVE_FAILED",
			message: "Project Object References could not be saved.",
			...projectSaved ? { details: { projectSaved: true } } : {}
		});
		return {
			ok: false,
			error: {
				code: "PROJECT_REFERENCE_SAVE_FAILED",
				message: "Project Object References could not be saved.",
				...projectSaved ? { details: { projectSaved: true } } : {}
			}
		};
	}
	return {
		ok: true,
		value
	};
}
async function invokeClosedProjectTool(options, loadModule) {
	const lifecycle = { attachments: /* @__PURE__ */ new Map() };
	let result;
	try {
		result = await executeClosedProjectTool(options, loadModule, lifecycle);
	} catch {
		result = {
			ok: false,
			error: {
				code: "TOOL_EXECUTION_FAILED",
				message: "Built-in tool execution failed."
			}
		};
	}
	return finalizeRuntimeCleanup(result, [async () => lifecycle.disposeProject?.(), () => lifecycle.attachments.clear()]);
}
//#endregion
export { invokeClosedProjectTool, loadPrecompiledClosedProjectModule };
