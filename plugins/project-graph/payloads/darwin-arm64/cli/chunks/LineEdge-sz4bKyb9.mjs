import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { B as SymmetryCurve, G as Vector, H as Circle, U as Rectangle, W as Line, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CsxlE7F6.mjs";
import { r as Renderer } from "./effectObject-7D20fXBW.mjs";
import { n as ConnectPoint, t as Edge } from "./Edge-BTEk8dkY.mjs";
import { t as ImageNode } from "./ImageNode-B1MOcm9P.mjs";
import { t as Section } from "./Section-oTirqCNu.mjs";
import { r as getMultiLineTextSize } from "./font-Cbb8DY3Q.mjs";
import { t as TextNode } from "./TextNode-C6fG2cYN.mjs";
//#region src/core/stage/stageObject/association/EdgeCollisionBoxGetter.tsx
var EdgeCollisionBoxGetter;
(function(_EdgeCollisionBoxGetter) {
	function init() {
		Settings.watch("lineStyle", updateState);
	}
	_EdgeCollisionBoxGetter.init = init;
	let currentStyle;
	function updateState(style) {
		currentStyle = style;
	}
	function getCollisionBox(edge) {
		if (edge.source.uuid === edge.target.uuid) {
			const sourceEntityRect = edge.source.collisionBox.getRectangle();
			return new CollisionBox([new Circle(sourceEntityRect.location, sourceEntityRect.size.y / 2)]);
		} else if (currentStyle === "bezier") return getBezierCollisionBox(edge);
		else if (currentStyle === "straight") return getStraightCollisionBox(edge);
		else if (currentStyle === "vertical") return new CollisionBox([edge.bodyLine]);
		else return new CollisionBox([edge.bodyLine]);
	}
	_EdgeCollisionBoxGetter.getCollisionBox = getCollisionBox;
	function getBezierCollisionBox(edge) {
		if (edge.shiftingIndex !== 0) {
			const shiftingMidPoint = edge.shiftingMidPoint;
			const sourceRectangle = edge.source.collisionBox.getRectangle();
			const targetRectangle = edge.target.collisionBox.getRectangle();
			const startLine = new Line(sourceRectangle.center, shiftingMidPoint);
			const endLine = new Line(shiftingMidPoint, targetRectangle.center);
			let startPoint = sourceRectangle.getLineIntersectionPoint(startLine);
			if (startPoint.equals(sourceRectangle.center)) startPoint = sourceRectangle.getLineIntersectionPoint(endLine);
			let endPoint = targetRectangle.getLineIntersectionPoint(endLine);
			if (endPoint.equals(targetRectangle.center)) endPoint = targetRectangle.getLineIntersectionPoint(startLine);
			const curve = new SymmetryCurve(startPoint, startLine.direction(), endPoint, endLine.direction().multiply(-1), Math.abs(endPoint.subtract(startPoint).magnitude()) / 2);
			curve.end = curve.end.subtract(curve.endDirection.normalize().multiply(15 / -2));
			return new CollisionBox([curve]);
		} else {
			const bodyLine = edge.bodyLine;
			const start = bodyLine.start;
			const end = bodyLine.end;
			const lineDirection = end.subtract(start).normalize();
			const startDirection = (() => {
				if (edge.source instanceof ConnectPoint) return Vector.getZero();
				const fromRate = Edge.getNormalVectorByRate(edge.sourceRectangleRate);
				if (fromRate !== null) return fromRate;
				const sourceRect = edge.source.collisionBox.getRectangle();
				return (edge.source instanceof ImageNode || edge.source.constructor.name === "ReferenceBlockNode") && start.x !== sourceRect.left && start.x !== sourceRect.right && start.y !== sourceRect.top && start.y !== sourceRect.bottom ? lineDirection : sourceRect.getNormalVectorAt(start);
			})();
			const endDirection = (() => {
				if (edge.target instanceof ConnectPoint) return Vector.getZero();
				const toRate = Edge.getNormalVectorByRate(edge.targetRectangleRate);
				if (toRate !== null) return toRate;
				const targetRect = edge.target.collisionBox.getRectangle();
				return (edge.target instanceof ImageNode || edge.target.constructor.name === "ReferenceBlockNode") && end.x !== targetRect.left && end.x !== targetRect.right && end.y !== targetRect.top && end.y !== targetRect.bottom ? lineDirection.multiply(-1) : targetRect.getNormalVectorAt(end);
			})();
			let edgeWidth = 2;
			if (Settings.enableAutoEdgeWidth && edge.target instanceof Section && edge.source instanceof Section) {
				const rect1 = edge.source.collisionBox.getRectangle();
				const rect2 = edge.target.collisionBox.getRectangle();
				edgeWidth = Math.min(Math.min(Math.max(rect1.width, rect1.height), Math.max(rect2.width, rect2.height)) / 100, 100);
			} else if (edge.source instanceof TextNode) edgeWidth = edge.source.getBorderWidth();
			return new CollisionBox([new SymmetryCurve(start, startDirection, end.add(endDirection.multiply(15 / 2)), endDirection, Math.max(edgeWidth * 25, Math.abs(Math.min(Math.abs(start.x - end.x), Math.abs(start.y - end.y))) / 2))]);
		}
	}
	function getStraightCollisionBox(edge) {
		if (edge.shiftingIndex !== 0) {
			const shiftingMidPoint = edge.shiftingMidPoint;
			return new CollisionBox([new Line(edge.source.collisionBox.getRectangle().center, shiftingMidPoint), new Line(shiftingMidPoint, edge.target.collisionBox.getRectangle().center)]);
		} else return new CollisionBox([edge.bodyLine]);
	}
})(EdgeCollisionBoxGetter || (EdgeCollisionBoxGetter = {}));
//#endregion
//#region src/core/stage/stageObject/association/LineEdge.tsx
var _LineEdge;
var LineEdge = _LineEdge = class LineEdge extends Edge {
	project;
	unknown;
	uuid;
	text;
	color = Color.Transparent;
	lineType = "solid";
	arrowType = "default";
	get collisionBox() {
		return EdgeCollisionBoxGetter.getCollisionBox(this);
	}
	/**
	* 几何组偏移索引（运行时计算，非持久化）
	* 0 = 正常直线/曲线
	* 正负整数 = 向垂直方向偏移，用于同几何组的多重边自动散开
	* 取代旧的 isShifting boolean，逻辑被几何组方案完全包含
	*/
	get shiftingIndex() {
		return this._shiftingIndex;
	}
	set shiftingIndex(value) {
		this._shiftingIndex = value;
	}
	_shiftingIndex = 0;
	constructor(project, { associationList = [], text = "", uuid = crypto.randomUUID(), color = Color.Transparent, sourceRectangleRate = Vector.same(.5), targetRectangleRate = Vector.same(.5), lineType = "solid", arrowType = "default" }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.uuid = uuid;
		this.associationList = associationList;
		this.text = text;
		this.color = color;
		this.sourceRectangleRate = sourceRectangleRate;
		this.targetRectangleRate = targetRectangleRate;
		this.lineType = lineType;
		this.arrowType = arrowType;
		this.adjustSizeByText();
	}
	static fromTwoEntity(project, source, target) {
		return new _LineEdge(project, { associationList: [source, target] });
	}
	rename(text) {
		this.text = text;
		this.adjustSizeByText();
	}
	/** 与渲染器保持一致的线宽，用于字号等比缩放 */
	get edgeWidth() {
		if (this.source instanceof TextNode) return this.source.getBorderWidth();
		return 2;
	}
	/** 连线文字字号，随线宽等比缩放 */
	get textFontSize() {
		return Renderer.FONT_SIZE * (this.edgeWidth / 2);
	}
	get textRectangle() {
		const textSize = getMultiLineTextSize(this.text, this.textFontSize, 1.2);
		if (this.source.uuid === this.target.uuid) return new Rectangle(this.source.collisionBox.getRectangle().location.add(new Vector(0, -50)).subtract(textSize.divide(2)), textSize);
		if (this._shiftingIndex !== 0) return new Rectangle(this.shiftingMidPoint.subtract(textSize.divide(2)), textSize);
		else return new Rectangle(this.bodyLine.midPoint().subtract(textSize.divide(2)), textSize);
	}
	get shiftingMidPoint() {
		const BASE_OFFSET = 60;
		const midPoint = Vector.average(this.source.collisionBox.getRectangle().center, this.target.collisionBox.getRectangle().center);
		const canonicalFrom = this.source.uuid <= this.target.uuid ? this.source.collisionBox.getRectangle().getCenter() : this.target.collisionBox.getRectangle().getCenter();
		const canonicalTo = this.source.uuid <= this.target.uuid ? this.target.collisionBox.getRectangle().getCenter() : this.source.collisionBox.getRectangle().getCenter();
		return midPoint.add(canonicalTo.subtract(canonicalFrom).normalize().rotateDegrees(90).multiply(this._shiftingIndex * BASE_OFFSET));
	}
	adjustSizeByText() {}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], LineEdge.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], LineEdge.prototype, "text", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], LineEdge.prototype, "color", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], LineEdge.prototype, "lineType", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], LineEdge.prototype, "arrowType", void 0);
LineEdge = _LineEdge = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], LineEdge);
//#endregion
export { LineEdge as t };
