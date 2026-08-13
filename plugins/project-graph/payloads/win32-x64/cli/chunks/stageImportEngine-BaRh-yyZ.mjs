import { t as DetailsManager } from "./ClosedProjectDetailsManager-D3W3KvYw.mjs";
import { G as Vector, U as Rectangle, et as __decorate, i as CollisionBox, q as MonoStack, tt as __decorateMetadata } from "./ProjectUpgrader-C2CEsQ4r.mjs";
import { r as service, t as Project } from "./Project-eqh45NY9.mjs";
import { t as Section } from "./Section-DDRccMt9.mjs";
import { t as TextNode } from "./TextNode-0KzNwbRI.mjs";
import { t as LineEdge } from "./LineEdge-BnY-O_Qc.mjs";
//#region src/core/service/dataGenerateService/stageImportEngine/BaseImporter.tsx
/**
* 导入器基类，包含共享的工具方法
*/
var BaseImporter = class {
	project;
	constructor(project) {
		this.project = project;
	}
};
//#endregion
//#region src/core/service/dataGenerateService/stageImportEngine/GraphImporter.tsx
/**
* 图结构导入器
* 支持通过纯文本生成网状结构
* 格式：
* - A --> B （连线上无文字）
* - A -label-> B （连线上有文字）
* - A （单独的节点）
*/
var GraphImporter = class extends BaseImporter {
	constructor(project) {
		super(project);
	}
	/**
	* 导入图结构文本并生成节点
	* 这个函数不稳定，可能会随时throw错误
	* @param text 网状结构的格式文本
	* @param diffLocation 偏移位置
	*/
	import(text, diffLocation = Vector.getZero()) {
		const lines = text.split("\n");
		if (lines.length === 0) return;
		const randomRadius = 40 * lines.length;
		const nodeDict = /* @__PURE__ */ new Map();
		const createNodeByName = (name) => {
			const node = new TextNode(this.project, {
				text: name,
				collisionBox: new CollisionBox([new Rectangle(diffLocation.add(new Vector(randomRadius * Math.random(), randomRadius * Math.random())), Vector.same(100))])
			});
			this.project.stageManager.add(node);
			nodeDict.set(name, node);
			return node;
		};
		for (const line of lines) {
			if (line.trim() === "") continue;
			if (line.includes("-->") || line.includes("-") && line.includes("->")) if (line.includes("-->")) {
				const names = line.split("-->");
				if (names.length !== 2) throw new Error(`解析时出现错误: "${line}"，应该只有两个名称`);
				const startName = names[0].trim();
				const endName = names[1].trim();
				if (startName === "" || endName === "") throw new Error(`解析时出现错误: "${line}"，名称不能为空`);
				let startNode = nodeDict.get(startName);
				let endNode = nodeDict.get(endName);
				if (!startNode) startNode = createNodeByName(startName);
				if (!endNode) endNode = createNodeByName(endName);
				this.project.nodeConnector.connectEntityFast(startNode, endNode);
			} else {
				const names = line.split("->");
				if (names.length !== 2) throw new Error(`解析时出现错误: "${line}"，应该只有两个名称`);
				const leftContent = names[0].trim();
				const endName = names[1].trim();
				if (leftContent === "" || endName === "") throw new Error(`解析时出现错误: "${line}"，名称不能为空`);
				let endNode = nodeDict.get(endName);
				if (!endNode) endNode = createNodeByName(endName);
				const leftContentList = leftContent.split("-");
				if (leftContentList.length !== 2) if (leftContentList.length === 1) throw new Error(`解析时出现错误: "${line}"，此行被识别为连线上有文字的行，中间的连接线应该是 "-->"，而不是 "->"`);
				else throw new Error(`解析时出现错误: "${line}"，此行被识别为连线上有文字的行，短横线 "-" 左侧内容应该确保只有两个名称`);
				const startName = leftContentList[0].trim();
				const edgeText = leftContentList[1].trim();
				if (startName === "" || edgeText === "") throw new Error(`解析时出现错误: "${line}"，名称不能为空`);
				let startNode = nodeDict.get(startName);
				if (!startNode) startNode = createNodeByName(startName);
				this.project.nodeConnector.connectEntityFast(startNode, endNode, edgeText);
			}
			else createNodeByName(line.trim());
		}
	}
};
//#endregion
//#region src/core/service/dataGenerateService/stageImportEngine/TreeImporter.tsx
/**
* 树形结构导入器
* 支持通过带有缩进格式的文本来增加节点
* 格式：基于缩进的树形文本
* 使用栈处理父子关系
* 自动连接父子节点
*/
var TreeImporter = class extends BaseImporter {
	constructor(project) {
		super(project);
	}
	/**
	* 导入树形结构文本并生成节点
	* @param text 树形结构的格式文本
	* @param indention 缩进大小（空格数或Tab数）
	* @param diffLocation 偏移位置
	*/
	import(text, indention, diffLocation = Vector.getZero()) {
		const lines = text.split("\n");
		const rootNode = new TextNode(this.project, {
			text: "root",
			collisionBox: new CollisionBox([new Rectangle(diffLocation, Vector.same(100))])
		});
		const nodeStack = new MonoStack();
		nodeStack.push(rootNode, -1);
		this.project.stageManager.add(rootNode);
		for (let yIndex = 0; yIndex < lines.length; yIndex++) {
			const line = lines[yIndex];
			if (line.trim() === "") continue;
			const indent = this.getIndentLevel(line, indention);
			const textContent = line.trim();
			const node = new TextNode(this.project, {
				text: textContent.replaceAll("\\t", "	").replaceAll("\\n", "\n"),
				collisionBox: new CollisionBox([new Rectangle(diffLocation.add(new Vector(indent * 50, yIndex * 100)), Vector.same(100))])
			});
			this.project.stageManager.add(node);
			if (nodeStack.peek()) {
				nodeStack.push(node, indent);
				const fatherNode = nodeStack.unsafeGet(nodeStack.length - 2);
				const newEdge = new LineEdge(this.project, {
					associationList: [fatherNode, node],
					targetRectangleRate: new Vector(.01, .5),
					sourceRectangleRate: new Vector(.99, .5)
				});
				this.project.stageManager.add(newEdge);
			}
		}
		this.project.autoLayoutFastTree.autoLayoutFastTreeMode(rootNode);
	}
	/**
	* 从指定节点开始导入树形结构文本并生成节点
	* @param uuid 根节点的UUID
	* @param text 树形结构的格式文本
	* @param indention 缩进大小（空格数或Tab数）
	* @returns 导入结果对象
	*/
	importFromNode(uuid, text, indention) {
		const rootNode = this.project.stageManager.getConnectableEntityByUUID(uuid);
		if (!rootNode) return {
			success: false,
			error: "节点不存在"
		};
		if (!(rootNode instanceof TextNode)) return {
			success: false,
			error: "节点不是TextNode类型"
		};
		const lines = text.split("\n");
		const nodeStack = new MonoStack();
		nodeStack.push(rootNode, -1);
		let nodeCount = 0;
		for (let yIndex = 0; yIndex < lines.length; yIndex++) {
			const line = lines[yIndex];
			if (line.trim() === "") continue;
			const indent = this.getIndentLevel(line, indention);
			const textContent = line.trim();
			const node = new TextNode(this.project, {
				text: textContent.replaceAll("\\t", "	").replaceAll("\\n", "\n"),
				collisionBox: new CollisionBox([new Rectangle(rootNode.collisionBox.getRectangle().location.add(new Vector(indent * 50, (yIndex + 1) * 100)), Vector.same(100))])
			});
			this.project.stageManager.add(node);
			nodeCount++;
			if (nodeStack.peek()) {
				nodeStack.push(node, indent);
				const fatherNode = nodeStack.unsafeGet(nodeStack.length - 2);
				const newEdge = new LineEdge(this.project, {
					associationList: [fatherNode, node],
					targetRectangleRate: new Vector(.01, .5),
					sourceRectangleRate: new Vector(.99, .5)
				});
				this.project.stageManager.add(newEdge);
			}
		}
		if (nodeCount > 0) {
			this.project.autoLayoutFastTree.autoLayoutFastTreeMode(rootNode);
			return {
				success: true,
				nodeCount
			};
		} else return {
			success: true,
			nodeCount: 0
		};
	}
	/**
	* 计算缩进层级
	* @param line 文本行
	* @param indention 缩进大小
	* @returns 缩进层级
	* @example
	* 'a' -> 0
	* '    a' -> 1
	* '\t\ta' -> 2
	*/
	getIndentLevel(line, indention) {
		let indent = 0;
		for (let i = 0; i < line.length; i++) if (line[i] === " ") indent++;
		else if (line[i] === "	") indent += indention;
		else break;
		return Math.floor(indent / indention);
	}
};
//#endregion
//#region src/core/service/dataGenerateService/stageImportEngine/MermaidImporter.tsx
/**
* Mermaid 图导入器
* 支持根据 mermaid 文本生成框嵌套网状结构
* 支持 graph TD 格式的 mermaid 文本
* 支持 subgraph 嵌套
* 解析节点形状和标签
* 处理各种连线类型
*/
var MermaidImporter = class extends BaseImporter {
	constructor(project) {
		super(project);
	}
	/**
	* 导入 Mermaid 文本并生成节点
	* @param text Mermaid 格式文本
	* @param diffLocation 偏移位置
	* @example
	* graph TD;
	*   A[Section A] --> B[Section B];
	*   A --> C[C];
	*   B --> D[D];
	*/
	import(text, diffLocation = Vector.getZero()) {
		const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("```") && !line.startsWith("%%") && !line.toLowerCase().startsWith("style ") && !line.toLowerCase().startsWith("linkstyle ") && !line.toLowerCase().startsWith("classdef "));
		if (lines.length === 0) return;
		const entityMap = /* @__PURE__ */ new Map();
		const entityParentMap = /* @__PURE__ */ new Map();
		const sectionChildrenMap = /* @__PURE__ */ new Map();
		const sectionStack = [];
		const createdEntities = /* @__PURE__ */ new Set();
		const pendingEdges = [];
		const ensureSectionChild = (section, child) => {
			if (section === child) return;
			if (!sectionChildrenMap.has(section)) sectionChildrenMap.set(section, []);
			const childList = sectionChildrenMap.get(section);
			if (!childList.includes(child)) childList.push(child);
			if (!section.children.includes(child)) this.project.sectionInOutManager.attachEntityToSection(child, section);
			entityParentMap.set(child, section);
		};
		const shouldTreatAsSection = (label, forceSection) => {
			if (forceSection) return true;
			if (!label) return false;
			return /(section|章节|组|容器)/i.test(label);
		};
		const createDefaultRectangle = (size) => new Rectangle(diffLocation.add(new Vector(Math.random() * 40, Math.random() * 40)), size);
		const ensureEntity = (token, options = {}) => {
			const parsed = this.parseNodeToken(token);
			const baseId = parsed.id;
			if (!baseId) throw new Error(`无法解析节点标识: "${token}"`);
			const existing = entityMap.get(baseId);
			const finalLabel = options.displayText ?? parsed.label;
			const treatAsSection = shouldTreatAsSection(finalLabel, options.forceSection ?? false);
			if (existing) {
				if (finalLabel) {
					if (existing instanceof Section) {
						if (existing.text !== finalLabel) existing.rename(finalLabel);
					} else if (existing instanceof TextNode) {
						if (existing.text !== finalLabel) existing.rename(finalLabel);
					}
				}
				if (sectionStack.length > 0) {
					const currentSection = sectionStack[sectionStack.length - 1];
					ensureSectionChild(currentSection, existing);
				}
				return existing;
			}
			let entity;
			if (treatAsSection) {
				const section = new Section(this.project, {
					text: finalLabel ?? baseId,
					collisionBox: new CollisionBox([createDefaultRectangle(new Vector(240, 180))]),
					children: []
				});
				entity = section;
				sectionChildrenMap.set(section, sectionChildrenMap.get(section) ?? []);
			} else entity = new TextNode(this.project, {
				text: finalLabel ?? baseId,
				collisionBox: new CollisionBox([createDefaultRectangle(Vector.same(120))])
			});
			this.project.stageManager.add(entity);
			entityMap.set(baseId, entity);
			createdEntities.add(entity);
			if (sectionStack.length > 0) {
				const currentSection = sectionStack[sectionStack.length - 1];
				ensureSectionChild(currentSection, entity);
			}
			return entity;
		};
		for (const rawLine of lines) {
			const line = this.normalizeLine(rawLine);
			if (line.length === 0) continue;
			const lowerLine = line.toLowerCase();
			if (lowerLine.startsWith("graph ")) continue;
			if (lowerLine.startsWith("subgraph ")) {
				const sectionEntity = ensureEntity(line.slice(9).trim(), { forceSection: true });
				if (sectionEntity instanceof Section) sectionStack.push(sectionEntity);
				continue;
			}
			if (lowerLine === "end" || lowerLine.startsWith("end ")) {
				sectionStack.pop();
				continue;
			}
			const arrowIndex = line.indexOf("-->");
			if (arrowIndex !== -1) {
				const leftPart = line.slice(0, arrowIndex).trim();
				const rightPart = line.slice(arrowIndex + 3).trim();
				if (!rightPart) continue;
				let sourceToken = leftPart;
				let edgeLabel;
				const labelIndex = leftPart.indexOf("--");
				if (labelIndex !== -1) {
					sourceToken = leftPart.slice(0, labelIndex).trim();
					const rawLabel = leftPart.slice(labelIndex + 2).trim();
					edgeLabel = this.sanitizeLabel(rawLabel);
				}
				const sourceEntity = ensureEntity(sourceToken);
				const targetEntity = ensureEntity(rightPart);
				pendingEdges.push({
					source: sourceEntity,
					target: targetEntity,
					label: edgeLabel
				});
				continue;
			}
			ensureEntity(line);
		}
		const layoutGroup = (entities, origin, spacing) => {
			if (entities.length === 0) return;
			const columns = Math.max(1, Math.ceil(Math.sqrt(entities.length)));
			for (let index = 0; index < entities.length; index++) {
				const entity = entities[index];
				const row = Math.floor(index / columns);
				const col = index % columns;
				const target = origin.add(new Vector(col * spacing.x, row * spacing.y));
				if (entity instanceof Section) layoutSection(entity, target);
				else {
					entity.moveTo(target);
					if (entity instanceof TextNode) entity.forceAdjustSizeByText();
				}
			}
		};
		const layoutSection = (section, origin) => {
			const children = sectionChildrenMap.get(section) ?? [];
			if (children.length === 0) {
				section.moveTo(origin);
				section.adjustLocationAndSize();
				section.moveTo(origin);
				return;
			}
			section.moveTo(origin);
			layoutGroup(children, origin.add(new Vector(40, 120)), new Vector(200, 160));
			section.adjustLocationAndSize();
			section.moveTo(origin);
		};
		const rootEntities = [];
		for (const entity of entityMap.values()) if (!entityParentMap.has(entity)) rootEntities.push(entity);
		layoutGroup(rootEntities, diffLocation, new Vector(260, 200));
		for (const { source, target, label } of pendingEdges) if (label) this.project.nodeConnector.connectEntityFast(source, target, label);
		else this.project.nodeConnector.connectEntityFast(source, target);
		for (const section of sectionChildrenMap.keys()) section.adjustLocationAndSize();
		if (createdEntities.size > 0 || pendingEdges.length > 0) this.project.historyManager.recordStep();
	}
	/**
	* 规范化行，去除尾部分号
	*/
	normalizeLine(line) {
		return line.trim().replace(/;$/, "");
	}
	/**
	* 解码 Mermaid 文本中的特殊字符
	*/
	decodeMermaidText(value) {
		return value.replace(/&quot;/g, "\"").replace(/<br\s*\/?>/gi, "\n");
	}
	/**
	* 清理标签文本
	*/
	sanitizeLabel(raw) {
		if (!raw) return;
		let result = raw.trim();
		if (result.startsWith("\"") && result.endsWith("\"") || result.startsWith("'") && result.endsWith("'")) result = result.slice(1, -1);
		result = this.decodeMermaidText(result);
		result = result.trim();
		return result.length > 0 ? result : void 0;
	}
	/**
	* 解析节点标记，提取节点ID、标签和形状
	*/
	parseNodeToken(token) {
		const content = this.normalizeLine(token);
		const bracketMatch = content.match(/^([^[]+)\[(.*)\]$/);
		if (bracketMatch) return {
			id: this.decodeMermaidText(bracketMatch[1].trim()),
			label: this.sanitizeLabel(bracketMatch[2]),
			shape: "rectangle"
		};
		const quotedBracketMatch = content.match(/^([^[]+)\["(.*)"\]$/);
		if (quotedBracketMatch) return {
			id: this.decodeMermaidText(quotedBracketMatch[1].trim()),
			label: this.sanitizeLabel(`"${quotedBracketMatch[2]}"`),
			shape: "rectangle"
		};
		const doubleRoundMatch = content.match(/^([^(]+)\(\((.*)\)\)$/);
		if (doubleRoundMatch) return {
			id: this.decodeMermaidText(doubleRoundMatch[1].trim()),
			label: this.sanitizeLabel(doubleRoundMatch[2]),
			shape: "circle"
		};
		const roundMatch = content.match(/^([^(]+)\((.*)\)$/);
		if (roundMatch) return {
			id: this.decodeMermaidText(roundMatch[1].trim()),
			label: this.sanitizeLabel(roundMatch[2]),
			shape: "round"
		};
		const rhombusMatch = content.match(/^([^{}]+)\{(.*)\}$/);
		if (rhombusMatch) return {
			id: this.decodeMermaidText(rhombusMatch[1].trim()),
			label: this.sanitizeLabel(rhombusMatch[2]),
			shape: "rhombus"
		};
		const stadiumMatch = content.match(/^([^[]+)\[\((.*)\)\]$/);
		if (stadiumMatch) return {
			id: this.decodeMermaidText(stadiumMatch[1].trim()),
			label: this.sanitizeLabel(stadiumMatch[2]),
			shape: "stadium"
		};
		return {
			id: this.sanitizeLabel(content) ?? this.decodeMermaidText(content),
			shape: "other"
		};
	}
};
//#endregion
//#region src/utils/markdownParse.tsx
/**
* 将markdonwn文本解析为JSON对象
* @param markdown
* @returns
*/
function parseMarkdownToJSON(markdown) {
	const lines = markdown.split("\n");
	const root = [];
	const stack = [];
	for (const line of lines) {
		const titleMatch = line.match(/^(#+)\s*(.*)/);
		if (titleMatch) {
			const level = titleMatch[1].length;
			const newNode = {
				title: titleMatch[2].trim(),
				content: "",
				children: []
			};
			while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
			if (stack.length === 0) root.push(newNode);
			else stack[stack.length - 1].node.children.push(newNode);
			stack.push({
				node: newNode,
				level
			});
		} else if (line.trim()) {
			if (stack.length > 0) {
				stack[stack.length - 1].node.content += line + "\n";
				stack[stack.length - 1].node.content = stack[stack.length - 1].node.content.trim();
			}
		}
	}
	return root;
}
//#endregion
//#region src/core/service/dataGenerateService/stageImportEngine/MarkdownImporter.tsx
/**
* Markdown 导入器
* 将 Markdown 格式文本转换为节点树结构
* 支持标题层级（#, ##, ###）
*/
var MarkdownImporter = class extends BaseImporter {
	constructor(project) {
		super(project);
	}
	/**
	* 导入 Markdown 文本并生成节点树
	* @param markdownText Markdown 格式文本
	* @param diffLocation 偏移位置
	* @param autoLayout 是否自动应用树形布局（默认为 true，自动整理为向右的树状结构）
	*/
	import(markdownText, diffLocation = Vector.getZero(), autoLayout = true) {
		const markdownJson = parseMarkdownToJSON(markdownText);
		const monoStack = new MonoStack();
		const rootNode = new TextNode(this.project, {
			text: "root",
			collisionBox: new CollisionBox([new Rectangle(diffLocation, Vector.same(100))])
		});
		monoStack.push(rootNode, -1);
		this.project.stageManager.add(rootNode);
		let yIndex = 0;
		const visitFunction = (markdownNode, deepLevel) => {
			const node = new TextNode(this.project, {
				text: markdownNode.title,
				details: DetailsManager.markdownToDetails(markdownNode.content),
				collisionBox: new CollisionBox([new Rectangle(diffLocation.add(new Vector(deepLevel * 50, yIndex * 100)), Vector.same(100))])
			});
			this.project.stageManager.add(node);
			yIndex++;
			if (monoStack.peek()) {
				monoStack.push(node, deepLevel);
				const fatherNode = monoStack.unsafeGet(monoStack.length - 2);
				const newEdge = new LineEdge(this.project, {
					associationList: [fatherNode, node],
					targetRectangleRate: new Vector(.01, .5),
					sourceRectangleRate: new Vector(.99, .5)
				});
				this.project.stageManager.add(newEdge);
			}
		};
		const dfsMarkdownNode = (markdownNode, deepLevel) => {
			visitFunction(markdownNode, deepLevel);
			for (const child of markdownNode.children) dfsMarkdownNode(child, deepLevel + 1);
		};
		for (const markdownNode of markdownJson) dfsMarkdownNode(markdownNode, 0);
		if (autoLayout) this.project.autoAlign.autoLayoutSelectedFastTreeMode(rootNode);
		this.project.historyManager.recordStep();
	}
};
//#endregion
//#region src/core/service/dataGenerateService/stageImportEngine/stageImportEngine.tsx
var StageImport = class StageImport {
	project;
	graphImporter;
	treeImporter;
	mermaidImporter;
	markdownImporter;
	constructor(project) {
		this.project = project;
		this.graphImporter = new GraphImporter(project);
		this.treeImporter = new TreeImporter(project);
		this.mermaidImporter = new MermaidImporter(project);
		this.markdownImporter = new MarkdownImporter(project);
	}
	/**
	* 通过纯文本生成网状结构
	* 格式：
	* - A --> B （连线上无文字）
	* - A -label-> B （连线上有文字）
	* - A （单独的节点）
	* @param text 网状结构的格式文本
	* @param diffLocation 偏移位置
	*/
	addNodeGraphByText(text, diffLocation = Vector.getZero()) {
		return this.graphImporter.import(text, diffLocation);
	}
	/**
	* 通过带有缩进格式的文本来增加节点
	* 格式：基于缩进的树形文本
	* @param text 树形结构的格式文本
	* @param indention 缩进大小（空格数或Tab数）
	* @param diffLocation 偏移位置
	*/
	addNodeTreeByText(text, indention, diffLocation = Vector.getZero()) {
		return this.treeImporter.import(text, indention, diffLocation);
	}
	/**
	* 从指定节点开始根据文本生成树形结构
	* @param uuid 根节点的UUID
	* @param text 树形结构的格式文本
	* @param indention 缩进大小（空格数或Tab数）
	* @returns 导入结果对象
	*/
	addNodeTreeByTextFromNode(uuid, text, indention) {
		return this.treeImporter.importFromNode(uuid, text, indention);
	}
	/**
	* 根据 mermaid 文本生成框嵌套网状结构
	* 支持 graph TD 格式的 mermaid 文本
	* @param text Mermaid 格式文本
	* @param diffLocation 偏移位置
	* @example
	* graph TD;
	*   A[Section A] --> B[Section B];
	*   A --> C[C];
	*   B --> D[D];
	*/
	addNodeMermaidByText(text, diffLocation = Vector.getZero()) {
		return this.mermaidImporter.import(text, diffLocation);
	}
	/**
	* 根据 Markdown 文本生成节点树结构
	* 支持 Markdown 标题层级（#, ##, ###）
	* @param markdownText Markdown 格式文本
	* @param diffLocation 偏移位置
	* @param autoLayout 是否自动应用树形布局（默认为 true）
	* @example
	* # 标题1
	* ## 子标题1.1
	* ## 子标题1.2
	* # 标题2
	*/
	addNodeByMarkdown(markdownText, diffLocation = Vector.getZero(), autoLayout = true) {
		return this.markdownImporter.import(markdownText, diffLocation, autoLayout);
	}
};
StageImport = __decorate([service("stageImport"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], StageImport);
//#endregion
export { StageImport as t };
