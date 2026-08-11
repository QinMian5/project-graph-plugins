import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, R as toast, et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { r as service, t as Project } from "./Project-Dh_heHFZ.mjs";
//#region src/core/service/controlService/autoLayoutEngine/mainTick.tsx
var AutoLayout = class AutoLayout {
	project;
	constructor(project) {
		this.project = project;
	}
	/**
	* DAG布局算法输入数据结构
	*/
	getDAGLayoutInput(entities) {
		const nodeMap = /* @__PURE__ */ new Map();
		const nodes = entities.map((entity) => {
			nodeMap.set(entity.uuid, entity);
			return {
				id: entity.uuid,
				rectangle: entity.collisionBox.getRectangle()
			};
		});
		const edges = [];
		for (const entity of entities) {
			const children = this.project.graphMethods.nodeChildrenArray(entity);
			for (const child of children) if (nodeMap.has(child.uuid)) edges.push({
				from: entity.uuid,
				to: child.uuid
			});
		}
		return {
			nodes,
			edges
		};
	}
	/**
	* DAG布局算法接口
	* @param input 包含节点和边的DAG结构
	* @returns 每个节点的新位置 { [nodeId: string]: Vector }
	*/
	computeDAGLayout(input) {
		const { nodes, edges } = input;
		const { order: topologicalOrder, levels } = this.topologicalSort(nodes, edges);
		const nodesByLevel = /* @__PURE__ */ new Map();
		levels.forEach((level, nodeId) => {
			if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
			nodesByLevel.get(level)?.push(nodeId);
		});
		const nodeMap = /* @__PURE__ */ new Map();
		nodes.forEach((node) => {
			nodeMap.set(node.id, node);
		});
		const newPositions = {};
		const horizontalSpacing = 150;
		const verticalSpacing = 100;
		if (topologicalOrder.length > 0) {
			const firstNodeId = topologicalOrder[0];
			newPositions[firstNodeId] = nodeMap.get(firstNodeId).rectangle.location;
			const firstNodePos = newPositions[firstNodeId];
			const baseY = firstNodePos.y;
			const maxLevel = Math.max(...Array.from(levels.values()));
			const levelMaxWidths = /* @__PURE__ */ new Map();
			for (let level = 0; level <= maxLevel; level++) {
				const nodesInLevel = nodesByLevel.get(level) || [];
				let maxWidth = 0;
				for (const nodeId of nodesInLevel) {
					const nodeWidth = nodeMap.get(nodeId).rectangle.width;
					if (nodeWidth > maxWidth) maxWidth = nodeWidth;
				}
				levelMaxWidths.set(level, maxWidth);
			}
			const levelOffsets = /* @__PURE__ */ new Map();
			levelOffsets.set(0, firstNodePos.x);
			for (let level = 1; level <= maxLevel; level++) {
				const currentOffset = (levelOffsets.get(level - 1) || 0) + (levelMaxWidths.get(level - 1) || 0) + horizontalSpacing;
				levelOffsets.set(level, currentOffset);
			}
			for (let level = 0; level <= maxLevel; level++) {
				const nodesInLevel = nodesByLevel.get(level) || [];
				if (nodesInLevel.length === 0) continue;
				const levelX = levelOffsets.get(level) || 0;
				for (let i = 0; i < nodesInLevel.length; i++) {
					const currentNodeId = nodesInLevel[i];
					if (level === 0 && i === 0) continue;
					newPositions[currentNodeId] = new Vector(levelX, baseY + i * verticalSpacing);
				}
			}
		}
		return newPositions;
	}
	/**
	* 使用Kahn算法对DAG进行拓扑排序，并计算节点层数
	* @param nodes 节点数组
	* @param edges 边数组
	* @returns 包含拓扑排序结果和节点层数映射的对象
	*/
	topologicalSort(nodes, edges) {
		const adjacencyList = /* @__PURE__ */ new Map();
		const inDegree = /* @__PURE__ */ new Map();
		const levels = /* @__PURE__ */ new Map();
		nodes.forEach((node) => {
			adjacencyList.set(node.id, []);
			inDegree.set(node.id, 0);
			levels.set(node.id, 0);
		});
		edges.forEach((edge) => {
			const { from, to } = edge;
			adjacencyList.get(from)?.push(to);
			inDegree.set(to, (inDegree.get(to) || 0) + 1);
		});
		const queue = [];
		inDegree.forEach((degree, nodeId) => {
			if (degree === 0) {
				queue.push(nodeId);
				levels.set(nodeId, 0);
			}
		});
		const result = [];
		while (queue.length > 0) {
			const current = queue.shift();
			result.push(current);
			const currentLevel = levels.get(current);
			(adjacencyList.get(current) || []).forEach((neighbor) => {
				const newDegree = (inDegree.get(neighbor) || 0) - 1;
				inDegree.set(neighbor, newDegree);
				const neighborLevel = Math.max(levels.get(neighbor) || 0, currentLevel + 1);
				levels.set(neighbor, neighborLevel);
				if (newDegree === 0) queue.push(neighbor);
			});
		}
		if (result.length !== nodes.length) console.warn("DAG布局警告：图中存在环，拓扑排序结果可能不完整");
		return {
			order: result,
			levels
		};
	}
	/**
	* DAG布局主函数
	* @param entities 选中的实体列表
	*/
	autoLayoutDAG(entities) {
		const input = this.getDAGLayoutInput(entities);
		const newPositions = this.computeDAGLayout(input);
		const nodeMap = /* @__PURE__ */ new Map();
		entities.forEach((entity) => nodeMap.set(entity.uuid, entity));
		const previousLocations = new Map(entities.map((entity) => [entity, entity.collisionBox.getRectangle().location.clone()]));
		const previousSectionCollision = Settings.isEnableSectionCollision;
		Settings.isEnableSectionCollision = false;
		try {
			for (const [nodeId, position] of Object.entries(newPositions)) {
				const entity = nodeMap.get(nodeId);
				if (entity) entity.moveTo(position);
			}
			this.project.historyManager.recordStep();
		} catch (error) {
			for (const [entity, location] of previousLocations) entity.moveTo(location);
			throw error;
		} finally {
			Settings.isEnableSectionCollision = previousSectionCollision;
		}
		toast.success("DAG布局已应用");
		return {
			movedCount: Object.keys(newPositions).length,
			internalEdgeCount: input.edges.length
		};
	}
};
AutoLayout = __decorate([service("autoLayout"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], AutoLayout);
//#endregion
export { AutoLayout as t };
