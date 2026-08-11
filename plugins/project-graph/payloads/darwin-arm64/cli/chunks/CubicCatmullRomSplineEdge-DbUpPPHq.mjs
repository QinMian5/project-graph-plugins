import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, U as Rectangle, V as CubicCatmullRomSpline, W as Line, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, s as v4, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CX2Ju4hB.mjs";
import { r as Renderer } from "./effectObject-7D20fXBW.mjs";
import { t as Edge } from "./Edge-B1pxf1e1.mjs";
import { t as Section } from "./Section-CJmXOAGS.mjs";
import { r as getMultiLineTextSize } from "./font-Cbb8DY3Q.mjs";
import { t as TextNode } from "./TextNode-D6GFgnmc.mjs";
//#region src/core/stage/stageObject/association/ArcEdge.tsx
/**
* 圆弧上的线段近似采样点
*/
function sampleArcPoints(center, radius, startAngle, endAngle, _counterclockwise, segments = 20) {
	const points = [];
	const step = (endAngle - startAngle) / segments;
	for (let i = 0; i <= segments; i++) {
		const angle = startAngle + step * i;
		points.push(new Vector(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle)));
	}
	return points;
}
/**
* 计算经过三点的圆心
*/
function computeCircleCenter(a, b, c) {
	const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
	return new Vector(((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d, ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d);
}
/**
* 计算圆心到点 p 的角度（y-down canvas 坐标系）
*/
function angleFromCenter(center, p) {
	return Math.atan2(p.y - center.y, p.x - center.x);
}
/**
* 将角度标准化到 [0, 2π)
*/
function normalizeAngle(θ) {
	const r = θ % (2 * Math.PI);
	return r < 0 ? r + 2 * Math.PI : r;
}
/**
* 计算经过三点 A、C、B 的圆弧参数。
* 返回的 startAngle 对应 A 点，endAngle 对应 B 点。
* counterclockwise 控制 canvas arc() 的方向。
*/
function arcThroughThreePoints(a, b, c) {
	const center = computeCircleCenter(a, b, c);
	const radius = center.distance(a);
	const thetaA = angleFromCenter(center, a);
	const thetaB = angleFromCenter(center, b);
	const thetaC = angleFromCenter(center, c);
	const aN = normalizeAngle(thetaA);
	const bN = normalizeAngle(thetaB);
	const cN = normalizeAngle(thetaC);
	const cwStart = aN;
	let cwEnd = bN;
	if (cwStart > cwEnd) cwEnd += 2 * Math.PI;
	const cCW = cN < cwStart ? cN + 2 * Math.PI : cN;
	if (cCW >= cwStart && cCW <= cwEnd) return {
		center,
		radius,
		startAngle: thetaA,
		endAngle: thetaB + (aN > bN ? 2 * Math.PI : 0),
		counterclockwise: false
	};
	else return {
		center,
		radius,
		startAngle: thetaA,
		endAngle: thetaB - (aN < bN ? 2 * Math.PI : 0),
		counterclockwise: true
	};
}
/**
* 计算圆与矩形 4 条边的交点（线段求交）
* 返回所有落在矩形边上的交点
*/
function circleRectangleIntersections(center, radius, rect) {
	const intersections = [];
	const edges = [
		[rect.location, rect.location.add(new Vector(rect.size.x, 0))],
		[rect.location.add(new Vector(0, rect.size.y)), rect.location.add(rect.size)],
		[rect.location, rect.location.add(new Vector(0, rect.size.y))],
		[rect.location.add(new Vector(rect.size.x, 0)), rect.location.add(rect.size)]
	];
	for (const [p1, p2] of edges) {
		const d = p2.subtract(p1);
		const f = p1.subtract(center);
		const a = d.dot(d);
		const b = 2 * f.dot(d);
		const c = f.dot(f) - radius * radius;
		const discriminant = b * b - 4 * a * c;
		if (discriminant < 0) continue;
		const sqrtD = Math.sqrt(discriminant);
		for (const t of [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)]) if (t >= 0 && t <= 1) intersections.push(p1.add(d.multiply(t)));
	}
	return intersections;
}
/**
* 判断点是否在圆弧上（角度范围检查）
*/
function isPointOnArc(point, center, startAngle, endAngle, counterclockwise) {
	const θ = normalizeAngle(angleFromCenter(center, point));
	const s = normalizeAngle(startAngle);
	const e = normalizeAngle(endAngle);
	if (!counterclockwise) {
		if (s < e) return θ >= s && θ <= e;
		return θ >= s || θ <= e;
	} else {
		if (s > e) return θ <= s && θ >= e;
		return θ <= s || θ >= e;
	}
}
var ArcEdge = class ArcEdge extends Edge {
	project;
	unknown;
	uuid;
	text;
	color = Color.Transparent;
	lineType = "solid";
	arrowType = "default";
	/**
	* 圆弧偏移量（世界坐标）
	* 0 = 直线
	* 正数 = 向 AB 连线左侧弯曲
	* 负数 = 向 AB 连线右侧弯曲
	*/
	offset = 0;
	/**
	* 弧线上文字的位置比例。
	* 0.0 = 靠近源节点，0.5 = 中间，1.0 = 靠近目标节点
	*/
	textPosition = .5;
	/**
	* 获取或计算圆弧几何参数（每次实时计算，不缓存）
	*/
	get arcGeometry() {
		const srcCenter = this.source.collisionBox.getRectangle().center;
		const tarCenter = this.target.collisionBox.getRectangle().center;
		if (this.offset === 0) {
			const mid = Vector.average(srcCenter, tarCenter);
			const perp = srcCenter.subtract(tarCenter).normalize().rotateDegrees(90);
			return arcThroughThreePoints(srcCenter, tarCenter, mid.add(perp.multiply(1e-4)));
		} else {
			const mid = Vector.average(srcCenter, tarCenter);
			const perp = tarCenter.subtract(srcCenter).normalize().rotateDegrees(90);
			return arcThroughThreePoints(srcCenter, tarCenter, mid.add(perp.multiply(this.offset)));
		}
	}
	/**
	* 获取圆弧在矩形边缘上的裁剪后的端点
	*/
	get clippedStart() {
		const geo = this.arcGeometry;
		const srcRect = this.source.collisionBox.getRectangle();
		const srcCenter = srcRect.center;
		const intersections = circleRectangleIntersections(geo.center, geo.radius, srcRect);
		if (intersections.length === 0) return srcCenter;
		intersections.sort((a, b) => a.distance(srcCenter) - b.distance(srcCenter));
		const onArc = intersections.filter((p) => isPointOnArc(p, geo.center, geo.startAngle, geo.endAngle, geo.counterclockwise));
		return (onArc.length > 0 ? onArc : intersections).reduce((a, b) => a.distance(srcCenter) < b.distance(srcCenter) ? a : b);
	}
	/**
	* 获取圆弧在目标矩形边缘上的裁剪后的端点
	*/
	get clippedEnd() {
		const geo = this.arcGeometry;
		const tarRect = this.target.collisionBox.getRectangle();
		const tarCenter = tarRect.center;
		const intersections = circleRectangleIntersections(geo.center, geo.radius, tarRect);
		if (intersections.length === 0) return tarCenter;
		const onArc = intersections.filter((p) => isPointOnArc(p, geo.center, geo.startAngle, geo.endAngle, geo.counterclockwise));
		return (onArc.length > 0 ? onArc : intersections).reduce((a, b) => a.distance(tarCenter) < b.distance(tarCenter) ? a : b);
	}
	/**
	* 获取圆弧在终点处的切线方向（用于箭头）
	*/
	getArrowDirection() {
		const geo = this.arcGeometry;
		const radial = this.clippedEnd.subtract(geo.center).normalize();
		if (geo.counterclockwise) return radial.rotateDegrees(-90);
		else return radial.rotateDegrees(90);
	}
	/**
	* 获取圆弧在起点处离开 source 节点的切线方向（用于菱形方向）
	* 弧线在 source 端的行进方向（从 source 出发朝向 target）
	*/
	getSourceDirection() {
		const geo = this.arcGeometry;
		const radial = this.clippedStart.subtract(geo.center).normalize();
		if (geo.counterclockwise) return radial.rotateDegrees(-90);
		else return radial.rotateDegrees(90);
	}
	get collisionBox() {
		const geo = this.arcGeometry;
		const start = this.clippedStart;
		const end = this.clippedEnd;
		const startAngle = angleFromCenter(geo.center, start);
		const endAngle = angleFromCenter(geo.center, end);
		let adjustedEnd;
		if (!geo.counterclockwise) adjustedEnd = startAngle <= endAngle ? endAngle : endAngle + 2 * Math.PI;
		else adjustedEnd = startAngle >= endAngle ? endAngle : endAngle - 2 * Math.PI;
		const points = sampleArcPoints(geo.center, geo.radius, startAngle, adjustedEnd, geo.counterclockwise);
		const lines = [];
		for (let i = 0; i < points.length - 1; i++) lines.push(new Line(points[i], points[i + 1]));
		return new CollisionBox(lines);
	}
	get edgeWidth() {
		if (Settings.enableAutoEdgeWidth && this.target instanceof Section && this.source instanceof Section) {
			const rect1 = this.source.collisionBox.getRectangle();
			const rect2 = this.target.collisionBox.getRectangle();
			return Math.min(Math.min(Math.max(rect1.width, rect1.height), Math.max(rect2.width, rect2.height)) / 100, 100);
		} else if (this.source instanceof TextNode) return this.source.getBorderWidth();
		return 2;
	}
	get textFontSize() {
		return Renderer.FONT_SIZE * (this.edgeWidth / 2);
	}
	get textRectangle() {
		const textSize = getMultiLineTextSize(this.text, this.textFontSize, 1.2);
		return new Rectangle(this.getArcMidPoint().subtract(textSize.divide(2)), textSize);
	}
	/**
	* 获取圆弧的中点（用于文字定位）
	* 使用裁剪后的起点终点计算中点在可见弧段上的位置
	*/
	getArcMidPoint() {
		const geo = this.arcGeometry;
		const start = this.clippedStart;
		const end = this.clippedEnd;
		const startAngle = Math.atan2(start.y - geo.center.y, start.x - geo.center.x);
		const endAngle = Math.atan2(end.y - geo.center.y, end.x - geo.center.x);
		let adjustedEnd;
		if (!geo.counterclockwise) adjustedEnd = startAngle <= endAngle ? endAngle : endAngle + 2 * Math.PI;
		else adjustedEnd = startAngle >= endAngle ? endAngle : endAngle - 2 * Math.PI;
		const textAngle = startAngle + (adjustedEnd - startAngle) * this.textPosition;
		return new Vector(geo.center.x + geo.radius * Math.cos(textAngle), geo.center.y + geo.radius * Math.sin(textAngle));
	}
	constructor(project, { associationList = [], text = "", uuid = crypto.randomUUID(), color = Color.Transparent, sourceRectangleRate = Vector.same(.5), targetRectangleRate = Vector.same(.5), lineType = "solid", arrowType = "default", offset = 0, textPosition = .5 }, unknown = false) {
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
		this.offset = offset;
		this.textPosition = textPosition;
		this.adjustSizeByText();
	}
	adjustSizeByText() {}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], ArcEdge.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], ArcEdge.prototype, "text", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], ArcEdge.prototype, "color", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], ArcEdge.prototype, "lineType", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], ArcEdge.prototype, "arrowType", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], ArcEdge.prototype, "offset", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], ArcEdge.prototype, "textPosition", void 0);
ArcEdge = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], ArcEdge);
//#endregion
//#region src/core/stage/stageObject/association/CubicCatmullRomSplineEdge.tsx
/**
* CR曲线连线
* 和早期的Edge一样，用于有向的连接两个实体，形成连接关系
* alpha 不用自己修改了，这个是0.5固定值了，只会微微影响形状
* tension 控制曲线的弯曲程度，0是折线。
*/
var CubicCatmullRomSplineEdge = class CubicCatmullRomSplineEdge extends Edge {
	project;
	unknown;
	uuid;
	text;
	_source;
	_target;
	color = Color.Transparent;
	alpha = .5;
	tension = 0;
	controlPoints = [];
	getControlPoints() {
		return this.controlPoints;
	}
	addControlPoint() {
		if (this.controlPoints.length >= 4) {
			const secondLastPoint = this.controlPoints[this.controlPoints.length - 2];
			const thirdLastPoint = this.controlPoints[this.controlPoints.length - 3];
			const middlePoint = Vector.fromTwoPointsCenter(secondLastPoint, thirdLastPoint);
			this.controlPoints.splice(this.controlPoints.length - 2, 0, middlePoint);
		}
	}
	_collisionBox;
	get collisionBox() {
		return this._collisionBox;
	}
	static fromTwoEntity(project, source, target) {
		const startLocation = source.geometryCenter.clone();
		const endLocation = target.geometryCenter.clone();
		const line = Edge.getCenterLine(source, target);
		return new CubicCatmullRomSplineEdge(project, {
			source: source.uuid,
			target: target.uuid,
			text: "",
			uuid: v4(),
			type: "core:cublic_catmull_rom_spline_edge",
			alpha: .5,
			tension: 0,
			color: [
				0,
				0,
				0,
				0
			],
			sourceRectRate: [.5, .5],
			targetRectRate: [.5, .5],
			controlPoints: [
				[startLocation.x, startLocation.y],
				[line.start.x, line.start.y],
				[line.end.x, line.end.y],
				[endLocation.x, endLocation.y]
			]
		});
	}
	constructor(project, { uuid, source, target, text, alpha, tension, color, controlPoints, sourceRectRate, targetRectRate }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this._source = new TextNode(this.project, { uuid: source }, true);
		this._target = new TextNode(this.project, { uuid: target }, true);
		this.uuid = uuid;
		this.text = text;
		this.alpha = alpha;
		this.color = new Color(...color);
		this.tension = tension;
		this.controlPoints = controlPoints.map((item) => new Vector(item[0], item[1]));
		this.sourceRectangleRate = new Vector(...sourceRectRate);
		this.targetRectangleRate = new Vector(...targetRectRate);
		this._collisionBox = new CollisionBox([new CubicCatmullRomSpline(this.controlPoints, this.alpha, this.tension)]);
	}
	getShape() {
		const crShape = this._collisionBox.shapes[0];
		this.autoUpdateControlPoints();
		return crShape;
	}
	/**
	* 获取文字的矩形框的方法
	*/
	get textRectangle() {
		const textSize = getMultiLineTextSize(this.text, Renderer.FONT_SIZE, 1.2);
		return new Rectangle(this.bodyLine.midPoint().subtract(textSize.divide(2)), textSize);
	}
	autoUpdateControlPoints() {
		const startLocation = this._source.collisionBox.getRectangle().center;
		const endLocation = this._target.collisionBox.getRectangle().center;
		const line = Edge.getCenterLine(this._source, this._target);
		if (this.controlPoints.length <= 4) this.controlPoints = [
			startLocation,
			line.start,
			line.end,
			endLocation
		];
		else {
			const middleControlPoints = this.controlPoints.slice(2, -2);
			this.controlPoints = [startLocation, line.start].concat(middleControlPoints).concat([line.end, endLocation]);
		}
		this._collisionBox.shapes = [new CubicCatmullRomSpline(this.controlPoints, this.alpha, this.tension)];
	}
	/**
	* 获取箭头的位置和方向
	*/
	getArrowHead() {
		const crShape = this._collisionBox.shapes[0];
		const location = crShape.controlPoints[crShape.controlPoints.length - 2].clone();
		const lines = crShape.computeFunction();
		return {
			location,
			direction: lines[lines.length - 1].derivative(.95)
		};
	}
	adjustSizeByText() {}
};
//#endregion
export { ArcEdge as n, CubicCatmullRomSplineEdge as t };
