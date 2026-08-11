import { G as Vector, U as Rectangle, W as Line, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CsxlE7F6.mjs";
import { n as ConnectableAssociation } from "./Association-DIdpotmC.mjs";
import { n as ConnectableEntity } from "./effectObject-7D20fXBW.mjs";
//#region src/core/stage/stageObject/entity/ConnectPoint.tsx
var _ConnectPoint;
var ConnectPoint = class ConnectPoint extends ConnectableEntity {
	static {
		_ConnectPoint = this;
	}
	project;
	unknown;
	static CONNECT_POINT_SHRINK_RADIUS = 15;
	static CONNECT_POINT_EXPAND_RADIUS = 15;
	get geometryCenter() {
		return this.collisionBox.getRectangle().center;
	}
	isHiddenBySectionCollapse = false;
	collisionBox;
	uuid;
	get radius() {
		return this._isSelected ? _ConnectPoint.CONNECT_POINT_EXPAND_RADIUS : _ConnectPoint.CONNECT_POINT_SHRINK_RADIUS;
	}
	/**
	* 节点是否被选中
	*/
	_isSelected = false;
	/**
	* 获取节点的选中状态
	*/
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		if (this._isSelected === value) return;
		this._isSelected = value;
		const rectangle = this.collisionBox.shapes[0];
		if (!(rectangle instanceof Rectangle)) return;
		const centerLocation = this.geometryCenter.clone();
		if (value) {
			rectangle.size = Vector.same(_ConnectPoint.CONNECT_POINT_EXPAND_RADIUS * 2);
			rectangle.location = centerLocation.subtract(Vector.same(_ConnectPoint.CONNECT_POINT_EXPAND_RADIUS));
		} else {
			rectangle.size = Vector.same(_ConnectPoint.CONNECT_POINT_SHRINK_RADIUS * 2);
			rectangle.location = centerLocation.subtract(Vector.same(_ConnectPoint.CONNECT_POINT_SHRINK_RADIUS));
		}
	}
	constructor(project, { uuid = crypto.randomUUID(), collisionBox = new CollisionBox([new Rectangle(Vector.getZero(), Vector.same(_ConnectPoint.CONNECT_POINT_SHRINK_RADIUS * 2))]), details = [] }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.uuid = uuid;
		this.collisionBox = collisionBox;
		this.details = details;
	}
	move(delta) {
		const newRectangle = this.collisionBox.getRectangle();
		newRectangle.location = newRectangle.location.add(delta);
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
	moveTo(location) {
		const newRectangle = this.collisionBox.getRectangle();
		newRectangle.location = location;
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
};
__decorate([serializable, __decorateMetadata("design:type", typeof CollisionBox === "undefined" ? Object : CollisionBox)], ConnectPoint.prototype, "collisionBox", void 0);
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], ConnectPoint.prototype, "uuid", void 0);
ConnectPoint = _ConnectPoint = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], ConnectPoint);
//#endregion
//#region src/core/stage/stageObject/association/Edge.tsx
/**
* 连接两个实体的有向边
*/
var Edge = class Edge extends ConnectableAssociation {
	get isHiddenBySectionCollapse() {
		return this.source.isHiddenBySectionCollapse && this.target.isHiddenBySectionCollapse;
	}
	/** region 选中状态 */
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
	/**
	* 获取两个实体之间的直线
	* 此直线两端在两个实体外接矩形的边缘，延长后可过两个实体外接矩形的中心
	* 但对于图片节点，如果rate是精确值（不是旧的默认值），则直接使用内部位置
	*/
	get bodyLine() {
		const sourceRectangle = this.source.collisionBox.getRectangle();
		const targetRectangle = this.target.collisionBox.getRectangle();
		const edgeCenterLine = new Line(sourceRectangle.getInnerLocationByRateVector(this.sourceRectangleRate), targetRectangle.getInnerLocationByRateVector(this.targetRectangleRate));
		let startPoint;
		let endPoint;
		const isCenterRate = (rate) => rate.x === .5 && rate.y === .5;
		if (this.source instanceof ConnectPoint) startPoint = this.source.geometryCenter;
		else if (!isCenterRate(this.sourceRectangleRate)) startPoint = Edge.getExactEdgePositionByRate(sourceRectangle, this.sourceRectangleRate) ?? edgeCenterLine.start;
		else startPoint = sourceRectangle.getLineIntersectionPoint(edgeCenterLine);
		if (this.target instanceof ConnectPoint) endPoint = this.target.geometryCenter;
		else if (!isCenterRate(this.targetRectangleRate)) endPoint = Edge.getExactEdgePositionByRate(targetRectangle, this.targetRectangleRate) ?? edgeCenterLine.end;
		else endPoint = targetRectangle.getLineIntersectionPoint(edgeCenterLine);
		return new Line(startPoint, endPoint);
	}
	/**
	* 获取该连线的起始点位置对应的世界坐标
	*/
	get sourceLocation() {
		return this.source.collisionBox.getRectangle().getInnerLocationByRateVector(this.sourceRectangleRate);
	}
	/**
	* 获取该连线的终止点位置对应的世界坐标
	*/
	get targetLocation() {
		return this.target.collisionBox.getRectangle().getInnerLocationByRateVector(this.targetRectangleRate);
	}
	targetRectangleRate = new Vector(.5, .5);
	sourceRectangleRate = new Vector(.5, .5);
	/**
	* 静态方法：
	* 获取两个实体外接矩形的连线线段，（只连接到两个边，不连到矩形中心）
	* @param source
	* @param target
	* @returns
	*/
	static getCenterLine(source, target) {
		const sourceRectangle = source.collisionBox.getRectangle();
		const targetRectangle = target.collisionBox.getRectangle();
		const edgeCenterLine = new Line(sourceRectangle.center, targetRectangle.center);
		return new Line(sourceRectangle.getLineIntersectionPoint(edgeCenterLine), targetRectangle.getLineIntersectionPoint(edgeCenterLine));
	}
	/**
	* 根据 rate 向量推算贝塞尔曲线的出发/到达法线方向。
	* rate 直接编码了连接点所在的边，无需依赖点坐标与矩形边的精确相等比较。
	* - rate.x === 0.01 → 左边缘 → (-1, 0)
	* - rate.x === 0.99 → 右边缘 → (1, 0)
	* - rate.y === 0.01 → 上边缘 → (0, -1)
	* - rate.y === 0.99 → 下边缘 → (0, 1)
	* - 其他（中心或图片内部精确位置）→ null，由调用方回退到其他逻辑
	*/
	static getNormalVectorByRate(rate) {
		if (rate.x === .01) return new Vector(-1, 0);
		if (rate.x === .99) return new Vector(1, 0);
		if (rate.y === .01) return new Vector(0, -1);
		if (rate.y === .99) return new Vector(0, 1);
		return null;
	}
	/**
	* 当 rate 是边缘哨兵值（0.01/0.99）时，返回该边缘的精确中心坐标，
	* 避免 getInnerLocationByRateVector 产生的 width*0.01 偏移在大节点上可见。
	* - rate.x === 0.01 → 左边缘中心
	* - rate.x === 0.99 → 右边缘中心
	* - rate.y === 0.01 → 上边缘中心
	* - rate.y === 0.99 → 下边缘中心
	* - 其他 → null，由调用方使用 getInnerLocationByRateVector 处理
	*/
	static getExactEdgePositionByRate(rect, rate) {
		if (rate.x === .01) return rect.leftCenter;
		if (rate.x === .99) return rect.rightCenter;
		if (rate.y === .01) return rect.topCenter;
		if (rate.y === .99) return rect.bottomCenter;
		return null;
	}
	rename(text) {
		this.text = text;
		this.adjustSizeByText();
	}
	/** 碰撞相关 */
	/**
	* 用于碰撞箱框选
	* @param rectangle
	*/
	isIntersectsWithRectangle(rectangle) {
		return this.collisionBox.isIntersectsWithRectangle(rectangle);
	}
	/**
	* 用于鼠标悬浮在线上的时候
	* @param location
	* @returns
	*/
	isIntersectsWithLocation(location) {
		return this.collisionBox.isContainsPoint(location);
	}
	/**
	* 用于线段框选
	* @param line
	* @returns
	*/
	isIntersectsWithLine(line) {
		return this.collisionBox.isIntersectsWithLine(line);
	}
	isLeftToRight() {
		return this.sourceRectangleRate.x === .99 && this.targetRectangleRate.x === .01;
	}
	isRightToLeft() {
		return this.sourceRectangleRate.x === .01 && this.targetRectangleRate.x === .99;
	}
	isTopToBottom() {
		return this.sourceRectangleRate.y === .99 && this.targetRectangleRate.y === .01;
	}
	isBottomToTop() {
		return this.sourceRectangleRate.y === .01 && this.targetRectangleRate.y === .99;
	}
	isUnknownDirection() {
		return this.sourceRectangleRate.x === .5 && this.targetRectangleRate.x === .5 && this.sourceRectangleRate.y === .5 && this.targetRectangleRate.y === .5;
	}
	/**
	* 是否是非标准连线（端点位置不对应标准四方向，也不是默认中心方向）
	* 例如：右侧发出 + 上侧接收，即混合了不同轴的端点
	*/
	isNonStandardDirection() {
		return !this.isLeftToRight() && !this.isRightToLeft() && !this.isTopToBottom() && !this.isBottomToTop() && !this.isUnknownDirection();
	}
};
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Edge.prototype, "targetRectangleRate", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Edge.prototype, "sourceRectangleRate", void 0);
//#endregion
export { ConnectPoint as n, Edge as t };
