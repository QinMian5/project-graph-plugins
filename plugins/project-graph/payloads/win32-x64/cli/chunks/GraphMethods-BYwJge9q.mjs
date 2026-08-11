import { et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { r as service, t as Project } from "./Project-Dh_heHFZ.mjs";
import { t as TextNode } from "./TextNode-DbEh0zOl.mjs";
import { t as MultiTargetUndirectedEdge } from "./MutiTargetUndirectedEdge-CNOGvxOa.mjs";
//#region src/core/stage/stageManager/basicMethods/GraphMethods.tsx
var GraphMethods = class GraphMethods {
	project;
	constructor(project) {
		this.project = project;
	}
	isTree(node, skipDashed = false) {
		const dfs = (node, visited) => {
			if (visited.includes(node)) return false;
			visited.push(node);
			for (const child of this.nodeChildrenArray(node, skipDashed)) if (!dfs(child, visited)) return false;
			return true;
		};
		return dfs(node, []);
	}
	/**
	* 获取节点的显示文本（最多5个字符，溢出用省略号）
	*/
	getNodeDisplayName(node) {
		if (node instanceof TextNode) {
			const text = node.text || "未命名";
			return text.length > 5 ? text.slice(0, 5) + "..." : text;
		}
		return "节点";
	}
	/**
	* 详细检测树形结构问题
	* @param rootNode 根节点
	* @param skipDashed 是否跳过虚线边
	* @returns 检测结果，包含所有发现的问题
	*/
	validateTreeStructure(rootNode, skipDashed = false) {
		const issues = [];
		const visited = /* @__PURE__ */ new Set();
		const recursionStack = /* @__PURE__ */ new Set();
		const allNodes = this.getSuccessorSet(rootNode, true, skipDashed);
		const nodeSet = new Set(allNodes.map((n) => n.uuid));
		const isDashedEdge = (edge) => {
			return "lineType" in edge && edge.lineType === "dashed";
		};
		for (const node of allNodes) {
			const selfLoopEdges = this.project.stageManager.getLineEdges().filter((edge) => {
				if (skipDashed && isDashedEdge(edge)) return false;
				return edge.source.uuid === node.uuid && edge.target.uuid === node.uuid;
			});
			if (selfLoopEdges.length > 0) issues.push({
				type: "selfLoop",
				message: `节点 "${this.getNodeDisplayName(node)}" 存在自环`,
				nodes: [node],
				edges: selfLoopEdges
			});
		}
		for (const node of allNodes) {
			const outgoingEdges = this.getOutgoingEdges(node).filter((edge) => {
				if (skipDashed && isDashedEdge(edge)) return false;
				return nodeSet.has(edge.target.uuid);
			});
			const edgesByTarget = /* @__PURE__ */ new Map();
			for (const edge of outgoingEdges) {
				const targetId = edge.target.uuid;
				if (!edgesByTarget.has(targetId)) edgesByTarget.set(targetId, []);
				edgesByTarget.get(targetId).push(edge);
			}
			for (const [targetId, edges] of edgesByTarget) if (edges.length > 1) {
				const targetNode = this.project.stageManager.getConnectableEntityByUUID(targetId);
				if (targetNode) issues.push({
					type: "overlappingEdges",
					message: `节点 "${this.getNodeDisplayName(node)}" 和 "${this.getNodeDisplayName(targetNode)}" 之间存在 ${edges.length} 条重叠的边`,
					nodes: [node, targetNode],
					edges
				});
			}
		}
		const dfs = (node, currentPath) => {
			const nodeId = node.uuid;
			if (recursionStack.has(nodeId)) {
				const cycleStart = currentPath.indexOf(nodeId);
				const cycleNodes = currentPath.slice(cycleStart).map((id) => this.project.stageManager.getConnectableEntityByUUID(id)).filter((n) => n !== void 0);
				cycleNodes.push(node);
				const nodeNames = cycleNodes.map((n) => `"${this.getNodeDisplayName(n)}"`).join(" → ");
				issues.push({
					type: "cycle",
					message: `存在环路: ${nodeNames}`,
					nodes: cycleNodes
				});
				return false;
			}
			if (visited.has(nodeId)) {
				const parents = this.nodeParentArray(node, skipDashed).filter((p) => nodeSet.has(p.uuid));
				if (parents.length > 1) {
					if (!issues.find((i) => i.type === "diamond" && i.nodes?.some((n) => n.uuid === nodeId))) {
						const parentNames = parents.map((p) => `"${this.getNodeDisplayName(p)}"`).join(", ");
						issues.push({
							type: "diamond",
							message: `节点 "${this.getNodeDisplayName(node)}" 有多个父节点: ${parentNames}，形成菱形结构`,
							nodes: [node, ...parents]
						});
					}
				}
				return true;
			}
			visited.add(nodeId);
			recursionStack.add(nodeId);
			const children = this.nodeChildrenArray(node, skipDashed).filter((child) => nodeSet.has(child.uuid));
			for (const child of children) dfs(child, [...currentPath, nodeId]);
			recursionStack.delete(nodeId);
			return true;
		};
		dfs(rootNode, []);
		for (const node of allNodes) {
			if (node.uuid === rootNode.uuid) continue;
			const parents = this.nodeParentArray(node, skipDashed).filter((p) => nodeSet.has(p.uuid));
			if (parents.length > 1) {
				if (!issues.some((i) => i.type === "diamond" && i.nodes?.some((n) => n.uuid === node.uuid))) {
					const parentNames = parents.map((p) => `"${this.getNodeDisplayName(p)}"`).join(", ");
					issues.push({
						type: "diamond",
						message: `节点 "${this.getNodeDisplayName(node)}" 有多个父节点: ${parentNames}，形成菱形结构`,
						nodes: [node, ...parents]
					});
				}
			}
		}
		return {
			isValid: issues.length === 0,
			issues
		};
	}
	/** 获取节点连接的子节点数组，未排除自环 */
	nodeChildrenArray(node, skipDashed = false) {
		const res = [];
		for (const edge of this.project.stageManager.getLineEdges()) {
			if (skipDashed && edge.lineType === "dashed") continue;
			if (edge.source.uuid === node.uuid) res.push(edge.target);
		}
		return res;
	}
	/**
	* 获取一个节点的所有父亲节点，排除自环
	* 性能有待优化！！
	*/
	nodeParentArray(node, skipDashed = false) {
		const res = [];
		for (const edge of this.project.stageManager.getLineEdges()) {
			if (skipDashed && edge.lineType === "dashed") continue;
			if (edge.target.uuid === node.uuid && edge.target.uuid !== edge.source.uuid) res.push(edge.source);
		}
		return res;
	}
	edgeChildrenArray(node) {
		return this.project.stageManager.getLineEdges().filter((edge) => edge.source.uuid === node.uuid);
	}
	edgeParentArray(node) {
		return this.project.stageManager.getLineEdges().filter((edge) => edge.target.uuid === node.uuid);
	}
	/**
	* 获取反向边集
	* @param skipDashed 是否跳过虚线边
	*/
	getReversedEdgeDict(skipDashed = false) {
		const res = {};
		for (const edge of this.project.stageManager.getLineEdges()) {
			if (skipDashed && edge.lineType === "dashed") continue;
			res[edge.target.uuid] = edge.source.uuid;
		}
		return res;
	}
	/**
	* 当前节点是否是存在于树形结构中，且非树形结构的跟节点
	* @param node
	* @returns
	*/
	isCurrentNodeInTreeStructAndNotRoot(node) {
		const roots = this.getRoots(node, true);
		if (roots.length !== 1) return false;
		const rootNode = roots[0];
		if (rootNode.uuid === node.uuid) return false;
		return this.isTree(rootNode, true);
	}
	/**
	* 获取自己的祖宗节点
	* @param node 节点
	* @param skipDashed 是否跳过虚线边（用于树形格式化时）
	*/
	getRoots(node, skipDashed = false) {
		const reverseEdges = this.getReversedEdgeDict(skipDashed);
		let rootUUID = node.uuid;
		const visited = /* @__PURE__ */ new Set();
		while (reverseEdges[rootUUID] && !visited.has(rootUUID)) {
			visited.add(rootUUID);
			const parentUUID = reverseEdges[rootUUID];
			if (this.project.stageManager.getConnectableEntityByUUID(parentUUID)) rootUUID = parentUUID;
			else break;
		}
		const root = this.project.stageManager.getConnectableEntityByUUID(rootUUID);
		if (root) return [root];
		else return [];
	}
	isConnected(node, target) {
		for (const edge of this.project.stageManager.getLineEdges()) if (edge.source === node && edge.target === target) return true;
		return false;
	}
	/**
	* 通过一个节点获取一个 可达节点集合/后继节点集合 Successor Set
	* 包括它自己
	* @param node
	* @param isHaveSelf 是否包含节点自身
	* @param skipDashed 是否跳过虚线边（用于树形格式化时，避免虚线连接的节点被包含）
	*/
	getSuccessorSet(node, isHaveSelf = true, skipDashed = false) {
		let result = [];
		const visited = /* @__PURE__ */ new Set();
		const dfs = (currentNode) => {
			if (visited.has(currentNode.uuid)) return;
			visited.add(currentNode.uuid);
			result.push(currentNode);
			const children = this.nodeChildrenArray(currentNode, skipDashed);
			for (const child of children) dfs(child);
		};
		dfs(node);
		if (!isHaveSelf) result = result.filter((n) => n === node);
		return result;
	}
	/**
	* 获取一个节点的一步可达节点集合/后继节点集合 One-Step Successor Set
	* 排除自环
	* @param node
	*/
	getOneStepSuccessorSet(node) {
		const result = [];
		for (const edge of this.project.stageManager.getLineEdges()) if (edge.source === node && edge.target.uuid !== edge.source.uuid) result.push(edge.target);
		return result;
	}
	getEdgesBetween(node1, node2) {
		const result = [];
		for (const edge of this.project.stageManager.getEdges()) if (edge.source === node1 && edge.target === node2) result.push(edge);
		return result;
	}
	getEdgeFromTwoEntity(fromNode, toNode) {
		for (const edge of this.project.stageManager.getEdges()) if (edge.source === fromNode && edge.target === toNode) return edge;
		return null;
	}
	/**
	* 找到和一个节点直接相连的所有超边
	* @param node
	* @returns
	*/
	getHyperEdgesByNode(node) {
		const edges = [];
		const hyperEdges = this.project.stageManager.getAssociations().filter((association) => association instanceof MultiTargetUndirectedEdge);
		for (const hyperEdge of hyperEdges) if (hyperEdge.associationList.includes(node)) edges.push(hyperEdge);
		return edges;
	}
	/**
	* 获取一个节点的所有出度（出边）
	* @param node 源节点
	* @returns 节点的所有出边数组
	*/
	getOutgoingEdges(node) {
		const result = [];
		for (const edge of this.project.stageManager.getEdges()) if (edge.source === node) result.push(edge);
		return result;
	}
	/**
	* 获取一个节点的所有入度（入边）
	* @param node 目标节点
	* @returns 节点的所有入边数组
	*/
	getIncomingEdges(node) {
		const result = [];
		for (const edge of this.project.stageManager.getEdges()) if (edge.target === node) result.push(edge);
		return result;
	}
	/**
	* 获取一个节点通过连接它的所有超边的其他节点
	* 例如 {A B C}, {C, D, E}，f(A) => {B, C, D, E}
	* @param node 指定节点
	* @returns 通过超边连接的所有其他节点集合（排除节点自身）
	*/
	getNodesConnectedByHyperEdges(node) {
		const hyperEdges = this.getHyperEdgesByNode(node);
		const connectedNodes = /* @__PURE__ */ new Set();
		for (const hyperEdge of hyperEdges) for (const connectedNode of hyperEdge.associationList) if (connectedNode.uuid !== node.uuid) connectedNodes.add(connectedNode);
		return Array.from(connectedNodes);
	}
	nodeChildrenArrayWithinSet(node, nodeSet) {
		return this.nodeChildrenArray(node).filter((child) => nodeSet.has(child.uuid));
	}
	nodeParentArrayWithinSet(node, nodeSet) {
		return this.nodeParentArray(node).filter((parent) => nodeSet.has(parent.uuid));
	}
	/**
	* 根据一组节点判断其在子图中的连接关系是否构成一棵树，并返回唯一根节点。
	* 规则：
	* - 子图中每个节点的入度至多为1
	* - 恰好存在一个入度为0的根节点
	* - 从根出发可达所有节点（连通），且无环
	*/
	getTreeRootByNodes(nodes) {
		if (nodes.length === 0) return null;
		const nodeSet = new Set(nodes.map((n) => n.uuid));
		const roots = nodes.filter((n) => this.nodeParentArrayWithinSet(n, nodeSet).length === 0);
		if (roots.length !== 1) return null;
		return roots[0];
	}
	/** 判断一组节点在其诱导子图中是否构成一棵树 */
	isTreeByNodes(nodes) {
		if (nodes.length === 0) return false;
		const nodeSet = new Set(nodes.map((n) => n.uuid));
		for (const n of nodes) if (this.nodeParentArrayWithinSet(n, nodeSet).length > 1) return false;
		const root = this.getTreeRootByNodes(nodes);
		if (!root) return false;
		const visited = /* @__PURE__ */ new Set();
		const dfs = (current) => {
			if (visited.has(current.uuid)) return false;
			visited.add(current.uuid);
			for (const child of this.nodeChildrenArrayWithinSet(current, nodeSet)) if (!dfs(child)) return false;
			return true;
		};
		if (!dfs(root)) return false;
		return visited.size === nodeSet.size;
	}
	/** 判断一组节点在其诱导子图中是否构成有向无环图（DAG） */
	isDAGByNodes(nodes) {
		if (nodes.length === 0) return false;
		const nodeSet = new Set(nodes.map((n) => n.uuid));
		const inDegree = /* @__PURE__ */ new Map();
		const adjacency = /* @__PURE__ */ new Map();
		for (const node of nodes) {
			inDegree.set(node.uuid, this.nodeParentArrayWithinSet(node, nodeSet).length);
			adjacency.set(node.uuid, this.nodeChildrenArrayWithinSet(node, nodeSet));
		}
		const queue = [];
		for (const node of nodes) if (inDegree.get(node.uuid) === 0) queue.push(node);
		let count = 0;
		while (queue.length > 0) {
			const current = queue.shift();
			count++;
			for (const neighbor of adjacency.get(current.uuid)) {
				const neighborId = neighbor.uuid;
				const newInDegree = inDegree.get(neighborId) - 1;
				inDegree.set(neighborId, newInDegree);
				if (newInDegree === 0) queue.push(neighbor);
			}
		}
		return count === nodes.length;
	}
};
GraphMethods = __decorate([service("graphMethods"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], GraphMethods);
//#endregion
export { GraphMethods as t };
