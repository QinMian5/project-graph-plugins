import { G as Vector, U as Rectangle, X as Color, a as Entity, i as CollisionBox } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { n as ConnectableEntity } from "./effectObject-7D20fXBW.mjs";
import { t as Edge } from "./Edge-6LzeGjeC.mjs";
import { t as ImageNode } from "./ImageNode-B1vnrEi_.mjs";
import { t as Section } from "./Section-BuwCXB6_.mjs";
import { t as TextNode } from "./TextNode-DbEh0zOl.mjs";
//#region src/core/service/dataManageService/aiEngine/imageNodeFinder.ts
function findFirstImageInChildren(children, isImage, getChildren) {
	for (const child of children) {
		if (isImage(child)) return child;
		const sub = getChildren(child);
		if (sub) {
			const found = findFirstImageInChildren(sub, isImage, getChildren);
			if (found) return found;
		}
	}
}
//#endregion
//#region src/core/service/dataManageService/aiEngine/BuiltInToolExecutors.tsx
var builtInToolExecutorLoaders = {};
function addExecutor(name, loadExecutor) {
	if (name in builtInToolExecutorLoaders) throw new Error(`Duplicate built-in tool executor: ${name}`);
	builtInToolExecutorLoaders[name] = loadExecutor;
}
function loadBuiltInToolExecutor(name) {
	const loadExecutor = builtInToolExecutorLoaders[name];
	if (!loadExecutor) throw new Error(`Missing built-in tool executor: ${name}`);
	return loadExecutor();
}
function toAgentObjectInfo(object, references) {
	const rect = object.collisionBox.getRectangle();
	const info = {
		ref: references.getOrCreateRef(object),
		type: object.constructor.name,
		position: {
			x: rect.location.x,
			y: rect.location.y
		},
		size: {
			width: rect.size.x,
			height: rect.size.y
		}
	};
	if (object instanceof TextNode) info.text = object.text;
	if (object instanceof ImageNode) {
		info.isBackground = object.isBackground;
		info.imageState = object.state;
	}
	const color = "color" in object ? object.color : void 0;
	if (color instanceof Color) info.color = color.toArray();
	if (object instanceof Section) info.childRefs = object.children.map((child) => references.getOrCreateRef(child));
	if (object instanceof Edge) {
		info.sourceRef = references.getOrCreateRef(object.source);
		info.targetRef = references.getOrCreateRef(object.target);
		info.text = object.text;
	}
	return info;
}
function sanitizeImageSourceText(value) {
	return value?.replace(/[\r\n]+/g, " ").trim().slice(0, 500).replace(/([\\`*_[\]{}()#+\-.!|>])/g, "\\$1") || void 0;
}
function sanitizeImageSourceUrl(value) {
	if (!value || !URL.canParse(value)) return void 0;
	const url = new URL(value);
	return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : void 0;
}
function createOpenverseImageDetails(candidate, markdownToDetails) {
	const lines = ["## 网络图片来源"];
	const title = sanitizeImageSourceText(candidate.title);
	const creator = sanitizeImageSourceText(candidate.creator);
	const license = sanitizeImageSourceText(candidate.license);
	const sourceUrl = sanitizeImageSourceUrl(candidate.foreign_landing_url);
	const licenseUrl = sanitizeImageSourceUrl(candidate.license_url);
	if (title) lines.push(`标题：${title}`);
	if (creator) lines.push(`作者：${creator}`);
	if (license) lines.push(`许可证：${license}`);
	if (sourceUrl) lines.push(`来源页面：<${sourceUrl}>`);
	if (licenseUrl) lines.push(`许可证页面：<${licenseUrl}>`);
	lines.push("搜索服务：Openverse");
	return markdownToDetails(lines.join("\n\n"));
}
function getViewportCenteredLocation(project, size) {
	return project.renderer.getCoverWorldRectangle().center.subtract(size.clone().multiply(.5));
}
function resolveEntityRefs(refs, references) {
	const entitiesByUuid = /* @__PURE__ */ new Map();
	for (const ref of refs) {
		const object = references.resolve(ref, "node");
		if (!(object instanceof Entity)) throw new Error(`节点引用 ${ref} 未指向可删除的实体`);
		entitiesByUuid.set(object.uuid, object);
	}
	return [...entitiesByUuid.values()];
}
function deleteEntities(project, entities) {
	const entityCountBefore = project.stageManager.getEntities().length;
	const associationCountBefore = project.stageManager.getAssociations().length;
	project.stageManager.deleteEntities(entities);
	return {
		deletedNodeCount: entityCountBefore - project.stageManager.getEntities().length,
		deletedAssociationCount: associationCountBefore - project.stageManager.getAssociations().length
	};
}
addExecutor("get_all_nodes", () => (project, _data, references) => ({ objects: project.stage.map((object) => toAgentObjectInfo(object, references)) }));
addExecutor("delete_node", () => (project, { ref }, references) => {
	return deleteEntities(project, resolveEntityRefs([ref], references));
});
addExecutor("delete_nodes", () => (project, { refs }, references) => {
	return deleteEntities(project, resolveEntityRefs(refs, references));
});
addExecutor("delete_selected_nodes", () => (project) => {
	return deleteEntities(project, [...project.stageManager.getSelectedEntities()]);
});
addExecutor("delete_all_nodes", () => (project) => {
	const entities = [...project.stageManager.getEntities()];
	const associations = [...project.stageManager.getAssociations()];
	for (const assoc of associations) project.stageManager.delete(assoc);
	for (const entity of entities) project.stageManager.delete(entity);
	if (entities.length + associations.length > 0) project.historyManager.recordStep();
	return {
		deletedEntities: entities.length,
		deletedAssociations: associations.length
	};
});
addExecutor("edit_text_node", () => (project, { ref, data }, references) => {
	const node = references.resolve(ref, "node");
	if (!(node instanceof TextNode)) return {
		success: false,
		error: {
			code: "wrong_node_type",
			ref,
			expected: "TextNode",
			actual: node.constructor.name
		}
	};
	if (data.text === void 0 && data.color === void 0 && data.width === void 0 && data.sizeAdjust === void 0) return {
		success: false,
		error: {
			code: "no_changes",
			ref,
			message: "没有提供要修改的字段"
		}
	};
	if (data.width !== void 0 && data.sizeAdjust === "auto") return {
		success: false,
		error: {
			code: "invalid_size_mode",
			ref,
			message: "width 只能在 manual 宽度模式下使用"
		}
	};
	const previous = {
		text: node.text,
		color: node.color,
		sizeAdjust: node.sizeAdjust,
		rectangle: node.collisionBox.getRectangle().clone()
	};
	try {
		node.text = data.text ?? node.text;
		node.color = data.color ? new Color(...data.color) : node.color;
		node.sizeAdjust = data.sizeAdjust ?? (data.width !== void 0 ? "manual" : node.sizeAdjust);
		if (data.width !== void 0) {
			const rect = node.collisionBox.getRectangle();
			node.collisionBox.updateShapeList([new Rectangle(rect.location.clone(), new Vector(data.width, rect.size.y))]);
		}
		if (node.sizeAdjust === "manual") node.forceAdjustHeightByText();
		else node.forceAdjustSizeByText();
		project.historyManager.recordStep();
		const finalRect = node.collisionBox.getRectangle();
		return {
			success: true,
			ref,
			text: node.text,
			size: {
				width: finalRect.size.x,
				height: finalRect.size.y
			},
			sizeAdjust: node.sizeAdjust
		};
	} catch (error) {
		node.text = previous.text;
		node.color = previous.color;
		node.sizeAdjust = previous.sizeAdjust;
		node.collisionBox.updateShapeList([previous.rectangle]);
		throw error;
	}
});
addExecutor("edit_image_node", () => (project, { ref, data }, references) => {
	const node = references.resolve(ref, "node");
	if (!(node instanceof ImageNode)) return {
		success: false,
		error: {
			code: "wrong_node_type",
			ref,
			expected: "ImageNode",
			actual: node.constructor.name
		}
	};
	if (data.displaySize === void 0 && data.isBackground === void 0) return {
		success: false,
		error: {
			code: "no_changes",
			ref,
			message: "没有提供要修改的字段"
		}
	};
	const previous = {
		scale: node.scale,
		isBackground: node.isBackground,
		rectangle: node.collisionBox.getRectangle().clone()
	};
	try {
		const currentRect = node.collisionBox.getRectangle();
		if (data.displaySize) {
			const intrinsicWidth = node.bitmap?.width ?? currentRect.width / node.scale;
			const intrinsicHeight = node.bitmap?.height ?? currentRect.height / node.scale;
			if (!Number.isFinite(intrinsicWidth) || !Number.isFinite(intrinsicHeight) || intrinsicWidth <= 0 || intrinsicHeight <= 0) return {
				success: false,
				error: {
					code: "invalid_image_size",
					ref,
					message: "无法确定图片的原始尺寸"
				}
			};
			const basisSize = data.displaySize.basis === "width" ? intrinsicWidth : data.displaySize.basis === "height" ? intrinsicHeight : Math.max(intrinsicWidth, intrinsicHeight);
			const nextScale = data.displaySize.value / basisSize;
			if (nextScale < .1 || nextScale > 10) return {
				success: false,
				error: {
					code: "scale_out_of_range",
					ref,
					message: "目标尺寸超出 ImageNode 支持的 0.1 到 10 倍缩放范围"
				}
			};
			node.scaleUpdate(nextScale - node.scale);
			if (!node.bitmap) node.collisionBox.updateShapeList([new Rectangle(currentRect.location.clone(), new Vector(intrinsicWidth * nextScale, intrinsicHeight * nextScale))]);
		}
		node.isBackground = data.isBackground ?? node.isBackground;
		project.historyManager.recordStep();
		const finalRect = node.collisionBox.getRectangle();
		return {
			success: true,
			ref,
			displaySize: {
				width: finalRect.width,
				height: finalRect.height
			},
			isBackground: node.isBackground
		};
	} catch (error) {
		node.scale = previous.scale;
		node.isBackground = previous.isBackground;
		node.collisionBox.updateShapeList([previous.rectangle]);
		throw error;
	}
});
addExecutor("auto_layout_dag", () => (project, { refs }, references) => {
	const uniqueRefs = [...new Set(refs)];
	if (uniqueRefs.length !== refs.length) return {
		success: false,
		error: {
			code: "duplicate_refs",
			message: "refs 不能包含重复节点引用"
		}
	};
	const nodes = uniqueRefs.map((ref) => ({
		ref,
		node: references.resolve(ref, "node")
	}));
	const invalidNode = nodes.find(({ node }) => !(node instanceof ConnectableEntity) || node instanceof Section);
	if (invalidNode) return {
		success: false,
		error: {
			code: "unsupported_node_type",
			ref: invalidNode.ref,
			message: "DAG 布局目前只支持非 Section 的可连接节点"
		}
	};
	const entities = nodes.map(({ node }) => node);
	const parentSection = entities[0].parentSection;
	if (!entities.every((entity) => entity.parentSection === parentSection)) return {
		success: false,
		error: {
			code: "mixed_containers",
			message: "DAG 布局的节点必须位于同一直属 Section 层级"
		}
	};
	const nodeIds = new Set(entities.map((entity) => entity.uuid));
	if (project.stageManager.getEdges().filter((edge) => nodeIds.has(edge.source.uuid) && nodeIds.has(edge.target.uuid)).length === 0) return {
		success: false,
		error: {
			code: "no_internal_edges",
			message: "DAG 布局至少需要一条位于 refs 范围内的有向连线"
		}
	};
	if (!project.graphMethods.isDAGByNodes(entities)) return {
		success: false,
		error: {
			code: "not_dag",
			message: "指定节点不构成有向无环图"
		}
	};
	return {
		success: true,
		...project.autoLayout.autoLayoutDAG(entities)
	};
});
addExecutor("create_text_node", () => (project, { text, color, width, sizeAdjust }, references) => {
	if (width !== void 0 && sizeAdjust === "auto") return {
		success: false,
		error: {
			code: "invalid_size_mode",
			message: "width 只能在 manual 宽度模式下使用"
		}
	};
	if (sizeAdjust === "manual" && width === void 0) return {
		success: false,
		error: {
			code: "missing_width",
			message: "manual 宽度模式必须提供 width"
		}
	};
	const resolvedSizeAdjust = sizeAdjust ?? (width === void 0 ? "auto" : "manual");
	const node = new TextNode(project, {
		text,
		color: color ? new Color(...color) : Color.Transparent,
		collisionBox: new CollisionBox([new Rectangle(Vector.getZero(), new Vector(width ?? 100, 50))]),
		sizeAdjust: resolvedSizeAdjust
	});
	node.moveTo(getViewportCenteredLocation(project, node.collisionBox.getRectangle().size));
	project.stageManager.add(node);
	project.historyManager.recordStep();
	const rect = node.collisionBox.getRectangle();
	return {
		success: true,
		ref: references.getOrCreateRef(node),
		size: {
			width: rect.width,
			height: rect.height
		},
		sizeAdjust: node.sizeAdjust
	};
});
addExecutor("generate_node_tree_by_text", () => (project, { text }) => {
	project.stageManager.generateNodeTreeByText(text, 2);
});
addExecutor("expand_node_tree_from_node", () => (project, { ref, text }, references) => {
	const root = references.resolve(ref, "node");
	const result = project.stageImport.addNodeTreeByTextFromNode(root.uuid, text, 2);
	if (result.success && result.nodeCount && result.nodeCount > 0) project.historyManager.recordStep();
	return result;
});
addExecutor("search_text_nodes_by_regex", () => (project, { regex }, references) => {
	const results = [];
	const regexObj = new RegExp(regex);
	for (const entity of project.stageManager.getEntities()) if (entity instanceof TextNode && regexObj.test(entity.text)) results.push({
		text: entity.text,
		ref: references.getOrCreateRef(entity)
	});
	return results;
});
addExecutor("get_children", () => (project, { ref }, references) => {
	const object = references.resolve(ref, "node");
	const node = project.stageManager.getConnectableEntityByUUID(object.uuid);
	if (!node) return [];
	const children = project.graphMethods.nodeChildrenArray(node);
	const results = [];
	for (const child of children) if (child instanceof TextNode) results.push({
		text: child.text,
		ref: references.getOrCreateRef(child)
	});
	return results;
});
addExecutor("get_parents", () => (project, { ref }, references) => {
	const object = references.resolve(ref, "node");
	const node = project.stageManager.getConnectableEntityByUUID(object.uuid);
	if (!node) return [];
	const parents = project.graphMethods.nodeParentArray(node);
	const results = [];
	for (const parent of parents) if (parent instanceof TextNode) results.push({
		text: parent.text,
		ref: references.getOrCreateRef(parent)
	});
	return results;
});
addExecutor("batch_change_color", () => (project, { refs, color }, references) => {
	const colorObj = new Color(...color);
	let changedCount = 0;
	for (const ref of refs) {
		const obj = references.resolve(ref);
		if ("color" in obj && obj.color instanceof Color) {
			obj.color = colorObj;
			changedCount++;
		}
	}
	if (changedCount > 0) project.historyManager.recordStep();
	return { changedCount };
});
addExecutor("get_object_details", () => (_project, { refs }, references) => refs.map((ref) => toAgentObjectInfo(references.resolve(ref), references)));
addExecutor("check_connections", () => (project, { pairs }, references) => {
	const results = [];
	for (const [fromRef, toRef] of pairs) {
		const fromObject = references.resolve(fromRef, "node");
		const toObject = references.resolve(toRef, "node");
		const fromNode = project.stageManager.getConnectableEntityByUUID(fromObject.uuid);
		const toNode = project.stageManager.getConnectableEntityByUUID(toObject.uuid);
		if (fromNode && toNode) {
			const connected = project.graphMethods.isConnected(fromNode, toNode);
			results.push({
				fromRef,
				toRef,
				connected
			});
		} else results.push({
			fromRef,
			toRef,
			connected: false
		});
	}
	return results;
});
addExecutor("create_edges", () => (project, { edges }, references) => {
	const results = [];
	for (const edgeData of edges) {
		const sourceObject = references.resolve(edgeData.sourceRef, "node");
		const targetObject = references.resolve(edgeData.targetRef, "node");
		const sourceNode = project.stageManager.getConnectableEntityByUUID(sourceObject.uuid);
		const targetNode = project.stageManager.getConnectableEntityByUUID(targetObject.uuid);
		if (!sourceNode) {
			results.push({
				sourceRef: edgeData.sourceRef,
				targetRef: edgeData.targetRef,
				success: false,
				error: `源节点不存在或不是可连接对象`
			});
			continue;
		}
		if (!targetNode) {
			results.push({
				sourceRef: edgeData.sourceRef,
				targetRef: edgeData.targetRef,
				success: false,
				error: `目标节点不存在或不是可连接对象`
			});
			continue;
		}
		try {
			project.nodeConnector.connectConnectableEntity(sourceNode, targetNode, edgeData.text || "");
			const newEdge = project.stageManager.getAssociations().find((edge) => edge instanceof Edge && edge.source === sourceNode && edge.target === targetNode);
			if (newEdge) results.push({
				sourceRef: edgeData.sourceRef,
				targetRef: edgeData.targetRef,
				success: true,
				edgeRef: references.getOrCreateRef(newEdge)
			});
			else results.push({
				sourceRef: edgeData.sourceRef,
				targetRef: edgeData.targetRef,
				success: false,
				error: `连线创建失败，未知原因`
			});
		} catch (error) {
			results.push({
				sourceRef: edgeData.sourceRef,
				targetRef: edgeData.targetRef,
				success: false,
				error: error instanceof Error ? error.message : "连线创建失败"
			});
		}
	}
	if (results.some((r) => r.success)) project.historyManager.recordStep();
	return results;
});
addExecutor("change_edge_text", () => (project, { edgeRef, text }, references) => {
	const edge = references.resolve(edgeRef, "edge");
	if (!(edge instanceof Edge)) return {
		success: false,
		error: "连线不存在或不是Edge类型"
	};
	edge.rename(text);
	project.historyManager.recordStep();
	return { success: true };
});
addExecutor("select_objects", () => (project, { refs, clearOthers }, references) => {
	if (clearOthers) {
		for (const obj of project.stageManager.getEntities()) obj.isSelected = false;
		for (const assoc of project.stageManager.getAssociations()) assoc.isSelected = false;
	}
	let selectedCount = 0;
	for (const ref of refs) {
		const obj = references.resolve(ref);
		obj.isSelected = true;
		selectedCount++;
	}
	if (selectedCount > 0) project.historyManager.recordStep();
	return { selectedCount };
});
addExecutor("get_selected_nodes", () => (project, _data, references) => ({ objects: [...project.stageManager.getSelectedEntities(), ...project.stageManager.getSelectedAssociations()].map((object) => toAgentObjectInfo(object, references)) }));
addExecutor("get_nodes_in_viewport", () => (project, _data, references) => {
	const viewRect = project.renderer.getCoverWorldRectangle();
	const results = [];
	for (const entity of project.stageManager.getEntities()) if (entity.collisionBox.getRectangle().isAbsoluteIn(viewRect)) results.push(toAgentObjectInfo(entity, references));
	return { nodes: results };
});
addExecutor("get_selected_refs", () => (project, _data, references) => {
	const selectedEntities = project.stageManager.getSelectedEntities();
	const selectedAssociations = project.stageManager.getSelectedAssociations();
	return { refs: [...selectedEntities, ...selectedAssociations].map((object) => references.getOrCreateRef(object)) };
});
addExecutor("breadth_expand_node", () => (project, { ref, texts }, references) => {
	const sourceObject = references.resolve(ref, "node");
	const sourceNode = project.stageManager.getConnectableEntityByUUID(sourceObject.uuid);
	if (!sourceNode) return {
		success: false,
		error: "源节点不存在或不是可连接对象"
	};
	const sourceRect = sourceNode.collisionBox.getRectangle();
	const startX = sourceRect.location.x + sourceRect.size.x + 100;
	const startY = sourceRect.location.y;
	const verticalSpacing = 60;
	const results = [];
	for (let i = 0; i < texts.length; i++) {
		const text = texts[i];
		try {
			const node = new TextNode(project, {
				text,
				color: new Color(0, 0, 0, 0),
				collisionBox: new CollisionBox([new Rectangle(new Vector(startX, startY + i * verticalSpacing), new Vector(100, 50))]),
				sizeAdjust: "auto"
			});
			project.stageManager.add(node);
			project.nodeConnector.connectConnectableEntity(sourceNode, node, "");
			results.push({
				text,
				ref: references.getOrCreateRef(node),
				success: true
			});
		} catch (error) {
			results.push({
				text,
				success: false,
				error: error instanceof Error ? error.message : "创建节点失败"
			});
		}
	}
	if (results.some((r) => r.success)) project.historyManager.recordStep();
	return { results };
});
addExecutor("depth_expand_node", () => (project, { ref, texts }, references) => {
	const rootObject = references.resolve(ref, "node");
	const rootNode = project.stageManager.getConnectableEntityByUUID(rootObject.uuid);
	if (!rootNode) return {
		success: false,
		error: "根节点不存在或不是可连接对象"
	};
	const results = [];
	let currentNode = rootNode;
	const horizontalSpacing = 150;
	for (let i = 0; i < texts.length; i++) {
		const text = texts[i];
		try {
			const currentRect = currentNode.collisionBox.getRectangle();
			const node = new TextNode(project, {
				text,
				color: new Color(0, 0, 0, 0),
				collisionBox: new CollisionBox([new Rectangle(new Vector(currentRect.location.x + horizontalSpacing, currentRect.location.y), new Vector(100, 50))]),
				sizeAdjust: "auto"
			});
			project.stageManager.add(node);
			project.nodeConnector.connectConnectableEntity(currentNode, node, "");
			results.push({
				text,
				ref: references.getOrCreateRef(node),
				success: true
			});
			currentNode = node;
		} catch (error) {
			results.push({
				text,
				success: false,
				error: error instanceof Error ? error.message : "创建节点失败"
			});
			break;
		}
	}
	if (results.some((r) => r.success)) project.historyManager.recordStep();
	return { results };
});
addExecutor("sort_selected_nodes_by_y", () => (project, { current_order, desired_order }) => {
	const selectedTextNodes = project.stageManager.getSelectedEntities().filter((e) => e instanceof TextNode);
	const textCounts = /* @__PURE__ */ new Map();
	for (const node of selectedTextNodes) textCounts.set(node.text, (textCounts.get(node.text) ?? 0) + 1);
	const duplicates = [...textCounts.entries()].filter(([, count]) => count > 1).map(([text]) => text);
	if (duplicates.length > 0) return {
		success: false,
		error: `排序功能不能有重复名称的文本节点，重复的内容：${duplicates.join(", ")}`
	};
	const currentSet = new Set(current_order);
	const desiredSet = new Set(desired_order);
	if (current_order.length !== desired_order.length || [...currentSet].some((t) => !desiredSet.has(t))) return {
		success: false,
		error: "current_order 与 desired_order 包含的元素不一致"
	};
	const textToNode = /* @__PURE__ */ new Map();
	for (const node of selectedTextNodes) textToNode.set(node.text, node);
	for (const text of current_order) if (!textToNode.has(text)) return {
		success: false,
		error: `current_order 中的 "${text}" 在选中节点中未找到`
	};
	let currentY = textToNode.get(current_order[0]).collisionBox.getRectangle().location.y;
	for (const text of desired_order) {
		const node = textToNode.get(text);
		const rect = node.collisionBox.getRectangle();
		node.collisionBox.updateShapeList([new Rectangle(new Vector(rect.location.x, currentY), rect.size)]);
		node.forceAdjustSizeByText();
		currentY += node.collisionBox.getRectangle().size.y;
	}
	project.historyManager.recordStep();
	return {
		success: true,
		movedCount: desired_order.length
	};
});
addExecutor("sort_selected_nodes_by_x", () => (project, { current_order, desired_order }) => {
	const selectedTextNodes = project.stageManager.getSelectedEntities().filter((e) => e instanceof TextNode);
	const textCounts = /* @__PURE__ */ new Map();
	for (const node of selectedTextNodes) textCounts.set(node.text, (textCounts.get(node.text) ?? 0) + 1);
	const duplicates = [...textCounts.entries()].filter(([, count]) => count > 1).map(([text]) => text);
	if (duplicates.length > 0) return {
		success: false,
		error: `排序功能不能有重复名称的文本节点，重复的内容：${duplicates.join(", ")}`
	};
	const currentSet = new Set(current_order);
	const desiredSet = new Set(desired_order);
	if (current_order.length !== desired_order.length || [...currentSet].some((t) => !desiredSet.has(t))) return {
		success: false,
		error: "current_order 与 desired_order 包含的元素不一致"
	};
	const textToNode = /* @__PURE__ */ new Map();
	for (const node of selectedTextNodes) textToNode.set(node.text, node);
	for (const text of current_order) if (!textToNode.has(text)) return {
		success: false,
		error: `current_order 中的 "${text}" 在选中节点中未找到`
	};
	let currentX = textToNode.get(current_order[0]).collisionBox.getRectangle().location.x;
	for (const text of desired_order) {
		const node = textToNode.get(text);
		const rect = node.collisionBox.getRectangle();
		node.collisionBox.updateShapeList([new Rectangle(new Vector(currentX, rect.location.y), rect.size)]);
		node.forceAdjustSizeByText();
		currentX += node.collisionBox.getRectangle().size.x;
	}
	project.historyManager.recordStep();
	return {
		success: true,
		movedCount: desired_order.length
	};
});
addExecutor("search_and_add_image_node", () => async (project, { query, preferredOrientation, maxDisplaySize }, references, { abortSignal }) => {
	const [imageUtils, imageNodeFactory, entityDetailsManager, openverseImageSearch] = await Promise.all([
		import("./imageUtils-Cql0EBUS.mjs"),
		import("./imageNodeFactory-CObhPSwl.mjs"),
		import("./ClosedProjectDetailsManager-CWWFXNxH.mjs"),
		import("./OpenverseImageSearch-B0rKr6ky.mjs")
	]);
	const { prepareImageBlobForImport } = imageUtils;
	const { calculateImageDisplaySize, createImageNodeFromBlob } = imageNodeFactory;
	const { DetailsManager } = entityDetailsManager;
	const { findDownloadableOpenverseImage } = openverseImageSearch;
	const { candidate, image: prepared } = await findDownloadableOpenverseImage(query, {
		orientation: preferredOrientation,
		abortSignal,
		transform: prepareImageBlobForImport
	});
	const targetDisplaySize = calculateImageDisplaySize(prepared.width, prepared.height, maxDisplaySize ?? 480);
	const { node, width, height } = await createImageNodeFromBlob(project, prepared.blob, {
		location: getViewportCenteredLocation(project, new Vector(targetDisplaySize.width, targetDisplaySize.height)),
		intrinsicSize: prepared,
		maxDisplaySize: maxDisplaySize ?? 480,
		details: createOpenverseImageDetails(candidate, DetailsManager.markdownToDetails)
	});
	project.historyManager.recordStep();
	const license = candidate.license?.match(/^[a-z0-9-]{1,32}$/i) ? candidate.license.toLowerCase() : void 0;
	return {
		ref: references.getOrCreateRef(node),
		intrinsicSize: {
			width,
			height
		},
		displaySize: {
			width: targetDisplaySize.width,
			height: targetDisplaySize.height
		},
		source: "openverse",
		license
	};
});
addExecutor("recognize_image", () => async (project, { ref, prompt }, references) => {
	const [{ encodeModelImageDataUrl }, { Settings }] = await Promise.all([import("./ClosedProjectModelImageEncoder-CDh2DMJL.mjs"), import("./ClosedProjectSettings-C-nTQWFE.mjs")]);
	const obj = references.resolve(ref, "node");
	const imageNode = obj instanceof ImageNode ? obj : findFirstImageInChildren(obj instanceof Section ? obj.children : [], (n) => n instanceof ImageNode, (n) => n instanceof Section ? n.children : void 0);
	if (!imageNode) return {
		success: false,
		error: "该节点不是 ImageNode，且其内部未找到图片"
	};
	const blob = project.attachments.get(imageNode.attachmentId);
	if (!blob) return {
		success: false,
		error: "图片数据未找到（附件可能已丢失）"
	};
	try {
		return {
			success: true,
			description: await recognizeImage(await encodeModelImageDataUrl(blob, Settings.maxPastedImageSize), prompt)
		};
	} catch (e) {
		return {
			success: false,
			error: e instanceof Error ? e.message : "图片识别失败"
		};
	}
});
Object.freeze(builtInToolExecutorLoaders);
async function recognizeImage(dataUrl, prompt) {
	const { getCliDesktopAcceptanceRecognition } = await import("./CliDesktopAcceptanceAdapter-D37OWigR.mjs");
	const acceptanceRecognition = getCliDesktopAcceptanceRecognition();
	if (acceptanceRecognition) return acceptanceRecognition;
	const [{ Settings }, { createOpenAICompatible }, { fetch }, { generateText }] = await Promise.all([
		import("./ClosedProjectSettings-C-nTQWFE.mjs"),
		import("./dist-DsBUdY5Z.mjs"),
		import("./ClosedProjectHttp-Bdo5YhYs.mjs"),
		import("./dist-CfGMyOFx.mjs")
	]);
	return (await generateText({
		model: createOpenAICompatible({
			name: "project-graph",
			baseURL: Settings.aiApiBaseUrl,
			apiKey: Settings.aiApiKey || void 0,
			fetch: async (url, init) => {
				const response = await fetch(url.toString(), {
					...init,
					mode: "cors"
				});
				if (!response.ok) {
					const errorText = await response.text().catch(() => "unknown error");
					throw new Error(`图像识别请求失败 (${response.status}): ${errorText}`);
				}
				return response;
			}
		}).chatModel(Settings.aiModel),
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: prompt
			}, {
				type: "image",
				image: dataUrl
			}]
		}]
	})).text;
}
//#endregion
export { loadBuiltInToolExecutor };
