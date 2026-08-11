import { t as v4_default } from "./v4-DD_PkrNo.mjs";
//#region src/core/service/dataManageService/aiEngine/BuiltInToolRegistry.ts
function createLiveProjectBuiltInToolRuntimeHost(project, references) {
	return {
		canProvideCapabilities: () => true,
		acquireCapabilities: (capabilities, context) => Object.fromEntries(capabilities.map((capability) => [capability, capability === "project" ? project : capability === "references" ? references : capability === "abort-signal" ? context.abortSignal : true]))
	};
}
var objectRefSchema = v4_default.string().regex(/^(?:n|e)[1-9]\d*$/).describe("当前项目中的对象引用，例如n1或e1");
var nodeRefSchema = v4_default.string().regex(/^n[1-9]\d*$/).describe("当前项目中的节点引用，例如n1");
var edgeRefSchema = v4_default.string().regex(/^e[1-9]\d*$/).describe("当前项目中的连线引用，例如e1");
var output = Object.freeze({ contract: "existing-handler-result" });
function deepFreeze(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (value === null || typeof value !== "object" || value instanceof RegExp || seen.has(value)) return value;
	seen.add(value);
	for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
	return Object.freeze(value);
}
function defineTool(source) {
	return {
		...source,
		output,
		loadExecutor: async () => {
			const { loadBuiltInToolExecutor } = await import("./BuiltInToolExecutors-B3DqSVWb.mjs");
			return loadBuiltInToolExecutor(source.name);
		}
	};
}
var definitions = [
	defineTool({
		name: "get_all_nodes",
		description: "获取舞台上所有对象及其项目级引用",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"references",
			"dom",
			"image",
			"settings"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "delete_node",
		description: "根据项目级引用删除节点及其关联连线",
		inputSchema: v4_default.object({ ref: nodeRefSchema }),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"delete",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "atomic",
		persistence: "project"
	}),
	defineTool({
		name: "delete_nodes",
		description: "批量删除指定项目级引用对应的节点及其关联连线",
		inputSchema: v4_default.object({ refs: v4_default.array(nodeRefSchema).describe("要删除的节点引用数组") }),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"delete",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "atomic",
		persistence: "project"
	}),
	defineTool({
		name: "delete_selected_nodes",
		description: "删除当前所有选中的节点",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"selection",
			"history",
			"effects",
			"delete",
			"settings"
		],
		projectReferences: {
			reads: false,
			allocates: false
		},
		cancellation: "none",
		transaction: "atomic",
		persistence: "project"
	}),
	defineTool({
		name: "delete_all_nodes",
		description: "删除舞台上所有的节点和连线（清空舞台）",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"history",
			"effects",
			"delete",
			"settings"
		],
		projectReferences: {
			reads: false,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "edit_text_node",
		description: "编辑 TextNode 的内容、颜色和尺寸。此工具不会移动节点。",
		inputSchema: v4_default.object({
			ref: nodeRefSchema,
			data: v4_default.object({
				text: v4_default.string().optional(),
				color: v4_default.array(v4_default.number()).optional().describe("[255,255,255,1]"),
				width: v4_default.number().min(16).max(4096).optional(),
				sizeAdjust: v4_default.union([v4_default.literal("auto").describe("自动调整宽度"), v4_default.literal("manual").describe("宽度由width字段定义，文本自动换行")]).optional()
			})
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"text",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "rollback-on-error",
		persistence: "project"
	}),
	defineTool({
		name: "edit_image_node",
		description: "编辑 ImageNode 的显示尺寸和背景状态。图片始终保持原始宽高比；此工具不会移动节点。",
		inputSchema: v4_default.object({
			ref: nodeRefSchema,
			data: v4_default.object({
				displaySize: v4_default.object({
					basis: v4_default.union([
						v4_default.literal("width"),
						v4_default.literal("height"),
						v4_default.literal("longest_edge")
					]).describe("按照宽度、高度或最长边设置显示尺寸"),
					value: v4_default.number().min(16).max(4096).describe("目标显示尺寸")
				}).optional(),
				isBackground: v4_default.boolean().optional().describe("是否把图片作为背景图片")
			})
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"attachments",
			"image",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "rollback-on-error",
		persistence: "project"
	}),
	defineTool({
		name: "auto_layout_dag",
		description: "将同一分组层级中已经通过有向连线连接的普通节点，按从左到右的 DAG 分层方式整体布局。创建并连线完成后调用一次；不能用于 Section、孤立节点或有环图。",
		inputSchema: v4_default.object({ refs: v4_default.array(nodeRefSchema).min(2).describe("需要整体布局的节点项目级引用") }),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"graph",
			"layout",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "create_text_node",
		description: "创建 TextNode。节点会插入到当前视野中心；完成连线后使用 auto_layout_dag 整体整理，不要尝试提供坐标。",
		inputSchema: v4_default.object({
			text: v4_default.string(),
			color: v4_default.array(v4_default.number()).optional().describe("[R,G,B,A]，不填写时使用透明色"),
			width: v4_default.number().min(16).max(4096).optional().describe("手动宽度模式下的文本框宽度"),
			sizeAdjust: v4_default.union([v4_default.literal("auto").describe("自动调整宽度"), v4_default.literal("manual").describe("宽度由width字段定义，文本自动换行")]).optional()
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"dom",
			"settings",
			"viewport"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project-and-references"
	}),
	defineTool({
		name: "generate_node_tree_by_text",
		description: "根据纯文本缩进结构生成树状节点",
		inputSchema: v4_default.object({ text: v4_default.string().describe("包含缩进结构的文本，每一层缩进2个空格，例如：'root\\n  child1\\n  child2\\n    grandchild'") }),
		capabilities: [
			"project",
			"history",
			"effects",
			"graph",
			"tree-import",
			"dom",
			"settings",
			"viewport"
		],
		projectReferences: {
			reads: false,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "expand_node_tree_from_node",
		description: "从指定节点开始进行树形扩展，传入一个节点引用和缩进文本，在该节点下生成树状子节点",
		inputSchema: v4_default.object({
			ref: nodeRefSchema.describe("根节点引用"),
			text: v4_default.string().describe("包含缩进结构的文本，每一层缩进2个空格，例如：'child1\\n  grandchild\\nchild2'")
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"graph",
			"tree-import",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "search_text_nodes_by_regex",
		description: "根据正则表达式搜索文本节点",
		inputSchema: v4_default.object({ regex: v4_default.string().describe("正则表达式字符串") }),
		capabilities: ["project", "references"],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "get_children",
		description: "通过项目级引用获取一个节点的所有第一层子节点（基于连接关系）",
		inputSchema: v4_default.object({ ref: nodeRefSchema }),
		capabilities: [
			"project",
			"references",
			"graph"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "get_parents",
		description: "通过项目级引用获取一个节点的所有父级节点（基于连接关系）",
		inputSchema: v4_default.object({ ref: nodeRefSchema }),
		capabilities: [
			"project",
			"references",
			"graph"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "batch_change_color",
		description: "批量给物体更改颜色",
		inputSchema: v4_default.object({
			refs: v4_default.array(objectRefSchema).describe("对象引用数组"),
			color: v4_default.array(v4_default.number()).describe("[R,G,B,A]，RGB为0~255，A为0~1")
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "partial-success",
		persistence: "project"
	}),
	defineTool({
		name: "get_object_details",
		description: "通过项目级引用数组获取对象的模型可读详细信息",
		inputSchema: v4_default.object({ refs: v4_default.array(objectRefSchema).describe("对象引用数组") }),
		capabilities: [
			"project",
			"references",
			"image"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "check_connections",
		description: "检查节点是否是通过Edge直接连接的",
		inputSchema: v4_default.object({ pairs: v4_default.array(v4_default.array(nodeRefSchema).length(2)).describe("节点引用对数组，例如[[n1,n2],[n3,n4]]") }),
		capabilities: [
			"project",
			"references",
			"graph"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "none",
		persistence: "none"
	}),
	defineTool({
		name: "create_edges",
		description: "创建一些连线连接多个物体",
		inputSchema: v4_default.object({ edges: v4_default.array(v4_default.object({
			sourceRef: nodeRefSchema,
			targetRef: nodeRefSchema,
			text: v4_default.string().optional().default("")
		})) }),
		capabilities: [
			"project",
			"references",
			"history",
			"node-connect",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "partial-success",
		persistence: "project-and-references"
	}),
	defineTool({
		name: "change_edge_text",
		description: "更改连线上的文字",
		inputSchema: v4_default.object({
			edgeRef: edgeRefSchema,
			text: v4_default.string()
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "select_objects",
		description: "通过项目级引用选中一些舞台对象",
		inputSchema: v4_default.object({
			refs: v4_default.array(objectRefSchema).describe("要选中的对象引用数组"),
			clearOthers: v4_default.boolean().optional().default(false).describe("是否清除其他对象的选中状态")
		}),
		capabilities: [
			"project",
			"references",
			"selection",
			"history",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "partial-success",
		persistence: "none"
	}),
	defineTool({
		name: "get_selected_nodes",
		description: "获取用户当前所有选中对象的详细信息和项目级引用",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"references",
			"selection"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "get_nodes_in_viewport",
		description: "获取当前视野范围中被完全覆盖住的节点",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"references",
			"viewport"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "get_selected_refs",
		description: "获取用户当前所有选中对象的项目级引用",
		inputSchema: v4_default.object({}),
		capabilities: [
			"project",
			"references",
			"selection"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "none",
		transaction: "none",
		persistence: "project-references"
	}),
	defineTool({
		name: "breadth_expand_node",
		description: "广度扩展一个节点，传入一个节点引用和字符串数组，自动添加一层子节点",
		inputSchema: v4_default.object({
			ref: nodeRefSchema.describe("源节点引用"),
			texts: v4_default.array(v4_default.string()).describe("要添加的子节点文本数组")
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"node-connect",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "partial-success",
		persistence: "project-and-references"
	}),
	defineTool({
		name: "depth_expand_node",
		description: "深度扩展一个节点，传入一个节点引用作为根节点，根据字符串数组扩展出链式结构",
		inputSchema: v4_default.object({
			ref: nodeRefSchema.describe("根节点引用"),
			texts: v4_default.array(v4_default.string()).describe("要添加的链式节点文本数组")
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"effects",
			"node-connect",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: true,
			allocates: true
		},
		cancellation: "none",
		transaction: "partial-success",
		persistence: "project-and-references"
	}),
	defineTool({
		name: "sort_selected_nodes_by_y",
		description: "对选中的所有文本节点按照从上到下的顺序重新排列位置（y轴方向）。AI调用前需先用get_selected_nodes获取当前选中节点信息，按y坐标从小到大排列得到current_order，再根据用户期望得到desired_order。",
		inputSchema: v4_default.object({
			current_order: v4_default.array(v4_default.string()).describe("当前选中文本节点的文本内容数组，按y坐标从上到下（从小到大）排列"),
			desired_order: v4_default.array(v4_default.string()).describe("期望排列的文本内容顺序数组，从上到下，必须与current_order包含完全相同的元素")
		}),
		capabilities: [
			"project",
			"selection",
			"history",
			"effects",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: false,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "sort_selected_nodes_by_x",
		description: "对选中的所有文本节点按照从左到右的顺序重新排列位置（x轴方向）。AI调用前需先用get_selected_nodes获取当前选中节点信息，按x坐标从小到大排列得到current_order，再根据用户期望得到desired_order。",
		inputSchema: v4_default.object({
			current_order: v4_default.array(v4_default.string()).describe("当前选中文本节点的文本内容数组，按x坐标从左到右（从小到大）排列"),
			desired_order: v4_default.array(v4_default.string()).describe("期望排列的文本内容顺序数组，从左到右，必须与current_order包含完全相同的元素")
		}),
		capabilities: [
			"project",
			"selection",
			"history",
			"effects",
			"dom",
			"settings"
		],
		projectReferences: {
			reads: false,
			allocates: false
		},
		cancellation: "none",
		transaction: "non-transactional",
		persistence: "project"
	}),
	defineTool({
		name: "search_and_add_image_node",
		description: "从 Openverse 搜索开放授权的网络图片，下载后在当前视野中心创建 ImageNode。完成连线后使用 auto_layout_dag 整体整理；工具不返回图片 URL、附件 ID 或坐标。",
		inputSchema: v4_default.object({
			query: v4_default.string().min(1).max(400).describe("图片搜索关键词，建议包含主体、场景和风格"),
			preferredOrientation: v4_default.union([
				v4_default.literal("square"),
				v4_default.literal("landscape"),
				v4_default.literal("portrait")
			]).optional().describe("偏好的图片方向，不填写时使用搜索相关度最高的结果"),
			maxDisplaySize: v4_default.number().min(128).max(1600).optional().describe("图片节点最长边的最大画布显示尺寸，默认480")
		}),
		capabilities: [
			"project",
			"references",
			"history",
			"dom",
			"settings",
			"image",
			"network",
			"viewport",
			"abort-signal"
		],
		projectReferences: {
			reads: false,
			allocates: true
		},
		cancellation: "cooperative",
		transaction: "non-transactional",
		persistence: "project-and-references"
	}),
	defineTool({
		name: "recognize_image",
		description: "识别指定节点中的图片内容并返回文字描述。传入ImageNode引用或包含图片的Section引用，并用prompt描述识别目标。",
		inputSchema: v4_default.object({
			ref: nodeRefSchema.describe("ImageNode引用，或包含图片的Section引用"),
			prompt: v4_default.string().describe("向图像识别模型提问的提示词，例如\"这张图片里有哪些文字？\"或\"描述图片中的主要物体和场景\"。")
		}),
		capabilities: [
			"project",
			"references",
			"attachments",
			"dom",
			"settings",
			"image",
			"network",
			"model"
		],
		projectReferences: {
			reads: true,
			allocates: false
		},
		cancellation: "none",
		transaction: "none",
		persistence: "none"
	})
];
var builtInToolCatalog = Object.freeze(definitions.map((definition) => deepFreeze(definition)));
var builtInToolsByName = new Map(builtInToolCatalog.map((definition) => [definition.name, definition]));
function getBuiltInToolDefinition(name) {
	return builtInToolsByName.get(name);
}
var BuiltInToolCapabilityUnavailableError = class extends Error {
	capabilities;
	name = "BuiltInToolCapabilityUnavailableError";
	constructor(capabilities) {
		super("Runtime host cannot provide required capabilities");
		this.capabilities = capabilities;
	}
};
function classifyBuiltInToolException(error) {
	if (!(error instanceof Error) || error.name !== "AIObjectReferenceError") return void 0;
	const candidate = error;
	if (candidate.code !== "invalid_ref_format" && candidate.code !== "unknown_ref" && candidate.code !== "stale_ref" && candidate.code !== "wrong_ref_kind") return;
	if (typeof candidate.ref !== "string") return void 0;
	return {
		code: candidate.code,
		ref: candidate.ref,
		message: candidate.message
	};
}
function prepareBuiltInToolInvocation(name, input, canProvideCapabilities) {
	const definition = getBuiltInToolDefinition(name);
	if (!definition) throw new Error(`Unknown built-in tool: ${name}`);
	const parsedInput = definition.inputSchema.parse(input);
	if (!canProvideCapabilities(definition.capabilities)) throw new BuiltInToolCapabilityUnavailableError(definition.capabilities);
	return {
		definition,
		input: parsedInput
	};
}
function throwIfInvocationAborted(abortSignal) {
	if (!abortSignal?.aborted) return;
	if (typeof abortSignal.throwIfAborted === "function") abortSignal.throwIfAborted();
	throw abortSignal.reason ?? new DOMException("The operation was aborted", "AbortError");
}
async function executePreparedBuiltInTool(prepared, host, context = {}) {
	const { definition, input } = prepared;
	throwIfInvocationAborted(context.abortSignal);
	if (!host.canProvideCapabilities(definition.capabilities)) throw new BuiltInToolCapabilityUnavailableError(definition.capabilities);
	const executionContext = definition.capabilities.includes("abort-signal") ? context : {};
	const acquired = await host.acquireCapabilities(definition.capabilities, executionContext);
	for (const capability of Object.keys(acquired)) if (!definition.capabilities.includes(capability)) throw new Error(`Runtime host acquired undeclared capability: ${capability}`);
	for (const capability of definition.capabilities) if (!Object.hasOwn(acquired, capability)) throw new Error(`Runtime host did not acquire required capability: ${capability}`);
	if (!acquired.project) throw new Error("Runtime host did not provide the Project capability");
	if (definition.capabilities.includes("references") && !acquired.references) throw new Error("Runtime host did not provide the Project Object Reference capability");
	const executor = await definition.loadExecutor();
	throwIfInvocationAborted(context.abortSignal);
	if (host.beforeExecutorInvoke) await host.beforeExecutorInvoke();
	throwIfInvocationAborted(context.abortSignal);
	return executor(acquired.project, input, acquired.references, executionContext);
}
async function invokeBuiltInTool(name, input, host, context = {}) {
	return executePreparedBuiltInTool(prepareBuiltInToolInvocation(name, input, (capabilities) => host.canProvideCapabilities(capabilities)), host, context);
}
//#endregion
export { executePreparedBuiltInTool as a, prepareBuiltInToolInvocation as c, createLiveProjectBuiltInToolRuntimeHost as i, builtInToolCatalog as n, getBuiltInToolDefinition as o, classifyBuiltInToolException as r, invokeBuiltInTool as s, BuiltInToolCapabilityUnavailableError as t };
