import { t as Settings } from "./ClosedProjectSettings-CDenKQSg.mjs";
import { G as Vector, et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-C2CEsQ4r.mjs";
import { r as service, t as Project } from "./Project-eqh45NY9.mjs";
import { n as ConnectPoint } from "./Edge-z8WkqkYU.mjs";
import { t as LineEdge } from "./LineEdge-BnY-O_Qc.mjs";
import { n as ArcEdge, t as CubicCatmullRomSplineEdge } from "./CubicCatmullRomSplineEdge-Bm5SCcIo.mjs";
//#region src/core/stage/stageManager/concreteMethods/StageNodeConnector.tsx
var NodeConnector = class NodeConnector {
	project;
	constructor(project) {
		this.project = project;
	}
	/**
	* 检测是否可以连接两个节点
	* @param fromNode
	* @param toNode
	*/
	isConnectable(fromNode, toNode) {
		if (this.project.stageManager.isEntityExists(fromNode.uuid) && this.project.stageManager.isEntityExists(toNode.uuid)) {
			if (fromNode.uuid === toNode.uuid && fromNode instanceof ConnectPoint) return false;
			return true;
		} else return false;
	}
	/**
	* 如果两个节点都是同一个 ConnectPoint 对象类型，则不能连接，因为没有必要
	* @param fromNode
	* @param toNode
	* @param text
	* @returns
	*/
	connectConnectableEntity(fromNode, toNode, text = "", targetRectRate, sourceRectRate) {
		if (!this.isConnectable(fromNode, toNode)) return;
		const newEdge = new LineEdge(this.project, {
			associationList: [fromNode, toNode],
			text,
			targetRectangleRate: new Vector(...targetRectRate || [.5, .5]),
			sourceRectangleRate: new Vector(...sourceRectRate || [.5, .5]),
			lineType: Settings.defaultEdgeLineType,
			arrowType: Settings.defaultEdgeArrowType
		});
		this.project.stageManager.add(newEdge);
	}
	connectEntityFast(fromNode, toNode, text = "") {
		const newEdge = new LineEdge(this.project, {
			associationList: [fromNode, toNode],
			text,
			targetRectangleRate: new Vector(.5, .5),
			sourceRectangleRate: new Vector(.5, .5)
		});
		this.project.stageManager.add(newEdge);
	}
	addCrEdge(fromNode, toNode) {
		if (!this.isConnectable(fromNode, toNode)) return;
		const newEdge = CubicCatmullRomSplineEdge.fromTwoEntity(this.project, fromNode, toNode);
		this.project.stageManager.add(newEdge);
	}
	addArcEdge(fromNode, toNode) {
		if (!this.isConnectable(fromNode, toNode)) return;
		const newEdge = new ArcEdge(this.project, {
			associationList: [fromNode, toNode],
			offset: 10,
			lineType: Settings.defaultEdgeLineType,
			arrowType: Settings.defaultEdgeArrowType
		});
		this.project.stageManager.add(newEdge);
	}
	reverseEdges(edges) {
		edges.forEach((edge) => {
			const oldSource = edge.source;
			edge.source = edge.target;
			edge.target = oldSource;
			const oldSourceRectRage = edge.sourceRectangleRate;
			edge.sourceRectangleRate = edge.targetRectangleRate;
			edge.targetRectangleRate = oldSourceRectRage;
		});
		this.project.stageManager.updateReferences();
	}
	/**
	* 单独改变一个节点的连接点
	* @param edge
	* @param newTarget
	* @returns
	*/
	changeEdgeTarget(edge, newTarget) {
		if (edge.target.uuid === newTarget.uuid) return;
		edge.target = newTarget;
		this.project.stageManager.updateReferences();
	}
	/**
	* 单独改变一个节点的源连接点
	* @param edge
	* @param newSource
	* @returns
	*/
	changeEdgeSource(edge, newSource) {
		if (edge.source.uuid === newSource.uuid) return;
		edge.source = newSource;
		this.project.stageManager.updateReferences();
	}
	/**
	* 改变所有选中的连线的目标节点
	* @param newTarget
	*/
	changeSelectedEdgeTarget(newTarget) {
		const selectedEdges = this.project.stageManager.getSelectedStageObjects().filter((obj) => obj instanceof LineEdge);
		for (const edge of selectedEdges) if (edge instanceof LineEdge) this.changeEdgeTarget(edge, newTarget);
	}
	/**
	* 改变所有选中的连线的源节点
	* @param newSource
	*/
	changeSelectedEdgeSource(newSource) {
		const selectedEdges = this.project.stageManager.getSelectedStageObjects().filter((obj) => obj instanceof LineEdge);
		for (const edge of selectedEdges) if (edge instanceof LineEdge) this.changeEdgeSource(edge, newSource);
	}
};
NodeConnector = __decorate([service("nodeConnector"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], NodeConnector);
//#endregion
export { NodeConnector as t };
