import { G as Vector, U as Rectangle, W as Line, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CsxlE7F6.mjs";
import { n as ConnectableAssociation } from "./Association-DIdpotmC.mjs";
import { r as Renderer } from "./effectObject-7D20fXBW.mjs";
import { r as getMultiLineTextSize } from "./font-Cbb8DY3Q.mjs";
//#region src/core/algorithm/geometry/convexHull.tsx
var ConvexHull;
(function(_ConvexHull) {
	function computeConvexHull(points) {
		if (points.length <= 1) return [...points];
		const sorted = [...points].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
		if (isCollinear(sorted)) return [sorted[0], sorted[sorted.length - 1]];
		const lower = [];
		const upper = [];
		for (const point of sorted) buildHull(lower, point, (a, b, c) => cross(a, b, c) <= 0);
		for (const point of sorted.reverse()) buildHull(upper, point, (a, b, c) => cross(a, b, c) <= 0);
		const hull = [...lower, ...upper];
		return Array.from(new Set(hull.slice(0, -1)));
	}
	_ConvexHull.computeConvexHull = computeConvexHull;
	/** 辅助函数：三点叉积计算 */
	function cross(a, b, c) {
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	}
	/** 辅助函数：构建单边凸包 */
	function buildHull(hull, point, shouldRemove) {
		while (hull.length >= 2) {
			const [b, a] = [hull[hull.length - 1], hull[hull.length - 2]];
			if (shouldRemove(a, b, point)) hull.pop();
			else break;
		}
		hull.push(point);
	}
	/** 判断所有点是否共线 */
	function isCollinear(points) {
		if (points.length < 3) return true;
		const [a, b] = [points[0], points[1]];
		return points.every((c) => cross(a, b, c) === 0);
	}
})(ConvexHull || (ConvexHull = {}));
//#endregion
//#region src/core/stage/stageObject/association/MutiTargetUndirectedEdge.tsx
var _MultiTargetUndirectedEdge;
var MultiTargetUndirectedEdge = _MultiTargetUndirectedEdge = class MultiTargetUndirectedEdge extends ConnectableAssociation {
	project;
	unknown;
	uuid;
	get collisionBox() {
		if (this.renderType === "convex") {
			const shapes = [];
			if (this.associationList.length >= 2) {
				const convexPoints = [];
				this.associationList.map((node) => {
					const nodeRectangle = node.collisionBox.getRectangle().expandFromCenter(this.padding);
					convexPoints.push(nodeRectangle.leftTop);
					convexPoints.push(nodeRectangle.rightTop);
					convexPoints.push(nodeRectangle.rightBottom);
					convexPoints.push(nodeRectangle.leftBottom);
				});
				if (this.text !== "") {
					const textRectangle = this.textRectangle.expandFromCenter(this.padding);
					convexPoints.push(textRectangle.leftTop);
					convexPoints.push(textRectangle.rightTop);
					convexPoints.push(textRectangle.rightBottom);
					convexPoints.push(textRectangle.leftBottom);
				}
				const convexHull = ConvexHull.computeConvexHull(convexPoints);
				for (let i = 0; i < convexHull.length; i++) {
					const start = convexHull[i];
					const end = convexHull[(i + 1) % convexHull.length];
					shapes.push(new Line(start, end));
				}
			}
			return new CollisionBox(shapes);
		} else if (this.renderType === "circle") {
			const shapes = [];
			if (this.associationList.length >= 2) {
				const allPoints = [];
				this.associationList.map((node) => {
					const nodeRectangle = node.collisionBox.getRectangle().expandFromCenter(this.padding);
					allPoints.push(nodeRectangle.leftTop);
					allPoints.push(nodeRectangle.rightTop);
					allPoints.push(nodeRectangle.rightBottom);
					allPoints.push(nodeRectangle.leftBottom);
				});
				if (this.text !== "") {
					const textRectangle = this.textRectangle.expandFromCenter(this.padding);
					allPoints.push(textRectangle.leftTop);
					allPoints.push(textRectangle.rightTop);
					allPoints.push(textRectangle.rightBottom);
					allPoints.push(textRectangle.leftBottom);
				}
				const center = Vector.averageMultiple(allPoints);
				let maxDistance = 0;
				for (const point of allPoints) {
					const distance = center.distance(point);
					if (distance > maxDistance) maxDistance = distance;
				}
				const vertexCount = 20;
				const vertices = [];
				for (let i = 0; i < vertexCount; i++) {
					const angle = i / vertexCount * Math.PI * 2;
					const x = center.x + maxDistance * Math.cos(angle);
					const y = center.y + maxDistance * Math.sin(angle);
					vertices.push(new Vector(x, y));
				}
				for (let i = 0; i < vertices.length; i++) {
					const start = vertices[i];
					const end = vertices[(i + 1) % vertices.length];
					shapes.push(new Line(start, end));
				}
			}
			return new CollisionBox(shapes);
		} else {
			const center = this.centerLocation;
			const shapes = [];
			for (const node of this.associationList) {
				const line = new Line(center, node.collisionBox.getRectangle().center);
				shapes.push(line);
			}
			return new CollisionBox(shapes);
		}
	}
	text;
	color;
	rectRates;
	centerRate;
	arrow = "none";
	arrowType = "default";
	renderType = "line";
	lineType = "solid";
	padding;
	rename(text) {
		this.text = text;
	}
	constructor(project, { associationList = [], text = "", uuid = crypto.randomUUID(), color = Color.Transparent, rectRates = associationList.map(() => Vector.same(.5)), arrow = "none", arrowType = "default", centerRate = Vector.same(.5), padding = 10, renderType = "line", lineType = "solid" }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.text = text;
		this.uuid = uuid;
		this.color = color;
		this.associationList = associationList;
		this.rectRates = rectRates;
		this.centerRate = centerRate;
		this.arrow = arrow;
		this.arrowType = arrowType;
		this.renderType = renderType;
		this.lineType = lineType;
		this.padding = padding;
	}
	/**
	* 获取中心点
	*/
	get centerLocation() {
		return Rectangle.getBoundingRectangle(this.associationList.map((n) => n.collisionBox.getRectangle())).getInnerLocationByRateVector(this.centerRate);
	}
	get textRectangle() {
		const textSize = getMultiLineTextSize(this.text, Renderer.FONT_SIZE, 1.2);
		return new Rectangle(this.centerLocation.subtract(textSize.divide(2)), textSize);
	}
	static createFromSomeEntity(project, entities) {
		let padding = 10;
		for (const entity of entities) {
			const hyperEdges = project.graphMethods.getHyperEdgesByNode(entity);
			if (hyperEdges.length > 0) {
				const maxPadding = Math.max(...hyperEdges.map((e) => e.padding));
				padding = Math.max(maxPadding + 10, padding);
			}
		}
		return new _MultiTargetUndirectedEdge(project, {
			associationList: entities,
			padding
		});
	}
	/**
	* 是否被选中
	*/
	_isSelected = false;
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		this._isSelected = value;
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], MultiTargetUndirectedEdge.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], MultiTargetUndirectedEdge.prototype, "text", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], MultiTargetUndirectedEdge.prototype, "color", void 0);
__decorate([serializable, __decorateMetadata("design:type", Array)], MultiTargetUndirectedEdge.prototype, "rectRates", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], MultiTargetUndirectedEdge.prototype, "centerRate", void 0);
__decorate([serializable, __decorateMetadata("design:type", Object)], MultiTargetUndirectedEdge.prototype, "arrow", void 0);
__decorate([serializable, __decorateMetadata("design:type", Object)], MultiTargetUndirectedEdge.prototype, "arrowType", void 0);
__decorate([serializable, __decorateMetadata("design:type", Object)], MultiTargetUndirectedEdge.prototype, "renderType", void 0);
__decorate([serializable, __decorateMetadata("design:type", Object)], MultiTargetUndirectedEdge.prototype, "lineType", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], MultiTargetUndirectedEdge.prototype, "padding", void 0);
MultiTargetUndirectedEdge = _MultiTargetUndirectedEdge = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], MultiTargetUndirectedEdge);
//#endregion
export { ConvexHull as n, MultiTargetUndirectedEdge as t };
