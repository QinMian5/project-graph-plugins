import { n as __exportAll } from "./chunk-2rV9d50f.mjs";
import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { $ as mixColors, G as Vector, K as ProgressNumber, U as Rectangle, W as Line, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CX2Ju4hB.mjs";
import { n as ConnectableEntity, r as Renderer, t as Effect } from "./effectObject-7D20fXBW.mjs";
import { i as getTextSize } from "./font-Cbb8DY3Q.mjs";
//#region src/core/algorithm/random.tsx
var Random;
(function(_Random) {
	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	_Random.randomInt = randomInt;
	function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}
	_Random.randomFloat = randomFloat;
	function randomBoolean() {
		return Math.random() < .5;
	}
	_Random.randomBoolean = randomBoolean;
	function randomItem(items) {
		return items[randomInt(0, items.length - 1)];
	}
	_Random.randomItem = randomItem;
	function randomItems(items, count) {
		return items.slice(0, count).sort(() => Math.random() - .5);
	}
	_Random.randomItems = randomItems;
	function randomVector(min, max) {
		return new Vector(randomFloat(min.x, max.x), randomFloat(min.y, max.y));
	}
	_Random.randomVector = randomVector;
	function randomVectorOnNormalCircle() {
		const randomDegrees = randomFloat(0, 360);
		return new Vector(1, 0).rotateDegrees(randomDegrees);
	}
	_Random.randomVectorOnNormalCircle = randomVectorOnNormalCircle;
	function poissonRandom(lambda) {
		const L = Math.exp(-lambda);
		let p = 1;
		let k = 0;
		do {
			k++;
			p *= Math.random();
		} while (p > L);
		return k - 1;
	}
	_Random.poissonRandom = poissonRandom;
})(Random || (Random = {}));
//#endregion
//#region src/core/service/feedbackService/effectEngine/concrete/NodeMoveShadowEffect.tsx
var NodeMoveShadowEffect_exports = /* @__PURE__ */ __exportAll({ NodeMoveShadowEffect: () => NodeMoveShadowEffect });
/**
*
*/
var NodeMoveShadowEffect = class extends Effect {
	timeProgress;
	rectangle;
	rectangleSpeed;
	pointList = [];
	pointInitSpeedList = [];
	constructor(timeProgress, rectangle, rectangleSpeed) {
		super(timeProgress);
		this.timeProgress = timeProgress;
		this.rectangle = rectangle;
		this.rectangleSpeed = rectangleSpeed;
		if (rectangleSpeed.magnitude() < 1) return;
		for (let i = 0; i < 2; i++) {
			const direction = this.getSpeedMainDirection(this.rectangleSpeed);
			let x, y;
			if (direction === "top") {
				x = Random.randomFloat(this.rectangle.left, this.rectangle.right);
				y = this.rectangle.bottom;
			} else if (direction === "bottom") {
				x = Random.randomFloat(this.rectangle.left, this.rectangle.right);
				y = this.rectangle.top;
			} else if (direction === "left") {
				y = Random.randomFloat(this.rectangle.top, this.rectangle.bottom);
				x = this.rectangle.right;
			} else if (direction === "right") {
				y = Random.randomFloat(this.rectangle.top, this.rectangle.bottom);
				x = this.rectangle.left;
			} else {
				x = Random.randomFloat(this.rectangle.left, this.rectangle.right);
				y = Random.randomFloat(this.rectangle.top, this.rectangle.bottom);
			}
			this.pointList.push(new Vector(x, y));
			this.pointInitSpeedList.push(this.rectangleSpeed.multiply(Random.randomFloat(-.1, -1)).rotateDegrees(Random.randomFloat(-30, 30)));
		}
	}
	tick(project) {
		super.tick(project);
		for (let i = 0; i < this.pointList.length; i++) this.pointList[i] = this.pointList[i].add(this.pointInitSpeedList[i].multiply(1 - this.timeProgress.rate));
	}
	/**
	* 将速度方向转换为垂直坐标轴的方向，按照最可能的方向返回
	*/
	getSpeedMainDirection(speed) {
		if (Math.abs(speed.y) > Math.abs(speed.x)) {
			if (speed.y > 0) return "bottom";
			else if (speed.y < 0) return "top";
		} else if (speed.x > 0) return "right";
		else if (speed.x < 0) return "left";
		return "top";
	}
	render(project) {
		if (this.timeProgress.isFull) return;
		for (const point of this.pointList) {
			const viewLocation = project.renderer.transformWorld2View(point);
			const color = mixColors(project.stageStyleManager.currentStyle.effects.flash, project.stageStyleManager.currentStyle.effects.flash.toTransparent(), this.timeProgress.rate);
			project.renderUtils.renderPixel(viewLocation, color);
		}
	}
};
//#endregion
//#region src/core/stage/stageObject/entity/Section.tsx
var _Section;
var Section = class Section extends ConnectableEntity {
	static {
		_Section = this;
	}
	project;
	unknown;
	/**
	* 节点是否被选中
	*/
	_isSelected = false;
	uuid;
	_isEditingTitle = false;
	_collisionBoxWhenCollapsed;
	_collisionBoxNormal;
	get isEditingTitle() {
		return this._isEditingTitle;
	}
	set isEditingTitle(value) {
		this._isEditingTitle = value;
		this.project.sectionRenderer.render(this);
	}
	/**
	* 小于多少的情况下，开始渲染大标题
	*/
	static bigTitleCameraScale = .2;
	get collisionBox() {
		if (this.isCollapsed) return this._collisionBoxWhenCollapsed;
		else if (this.locked) return new CollisionBox([this.rectangle]);
		else return this._collisionBoxNormal;
	}
	/** 获取折叠状态下的碰撞箱 */
	collapsedCollisionBox() {
		const centerLocation = this._collisionBoxNormal.getRectangle().center;
		const collapsedRectangleSize = getTextSize(this.text, Renderer.FONT_SIZE).add(Vector.same(Renderer.NODE_PADDING).multiply(2));
		return new CollisionBox([new Rectangle(centerLocation.clone().subtract(collapsedRectangleSize.multiply(.5)), collapsedRectangleSize)]);
	}
	color = Color.Transparent;
	text;
	children;
	/** 是否是折叠状态 */
	isCollapsed;
	/**
	* 是否锁定 Section 内部物体
	* 当 locked 为 true 时，Section 内部的所有物体都不能移动或删除
	*/
	locked = false;
	/**
	* 边框样式：实线、虚线、无边框
	*/
	borderStyle = "solid";
	isHiddenBySectionCollapse = false;
	constructor(project, { uuid = crypto.randomUUID(), text = "", collisionBox = new CollisionBox([new Rectangle(new Vector(0, 0), new Vector(0, 0))]), _collisionBoxNormal: collisionBoxNormal = void 0, color = Color.Transparent, locked = false, isCollapsed = false, children = [], details = [], borderStyle = "solid" } = {}, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.uuid = uuid;
		if (collisionBoxNormal) this._collisionBoxNormal = collisionBoxNormal;
		else {
			const shapes = collisionBox.getRectangle().getBoundingLines();
			this._collisionBoxNormal = new CollisionBox(shapes);
		}
		this._collisionBoxWhenCollapsed = collisionBox;
		this.color = color;
		this.text = text;
		this.locked = locked;
		this.isCollapsed = isCollapsed;
		this.details = details;
		this.children = children;
		this.borderStyle = borderStyle;
		this.adjustLocationAndSize();
	}
	/**
	* 根据多个实体创建Section
	* @param entities
	*/
	static fromEntities(project, entities) {
		return new _Section(project, {
			text: "section",
			children: entities,
			borderStyle: Settings.sectionInitBorderStyle
		});
	}
	rename(newName) {
		this.text = newName;
		this.adjustLocationAndSize();
	}
	/**
	* 根据子内容 自动调整分组框的位置和大小
	* 如果没有子内容，则
	*   自动调整大小为 标题+padding，位置为 当前碰撞箱外接矩形的左上角
	*/
	adjustLocationAndSize() {
		let rectangle;
		const titleSize = getTextSize(this.text, Renderer.FONT_SIZE);
		const titleBarHeight = this.text === "" ? 0 : 50;
		if (this.children.length === 0) rectangle = new Rectangle(this.collisionBox.getRectangle().location, new Vector(Math.max(titleSize.x + Renderer.NODE_PADDING * 2, 100), 100));
		else {
			rectangle = Rectangle.getBoundingRectangle(this.children.map((child) => child.collisionBox.getRectangle()), 30);
			rectangle.size.x = Math.max(rectangle.size.x, titleSize.x + Renderer.NODE_PADDING * 2);
			rectangle.location = rectangle.location.subtract(new Vector(0, titleBarHeight));
			rectangle.size = rectangle.size.add(new Vector(0, titleBarHeight));
		}
		this._collisionBoxNormal.shapes = rectangle.getBoundingLines();
		if (titleBarHeight > 0) {
			const newRect = new Rectangle(rectangle.location.clone(), new Vector(rectangle.size.x, titleBarHeight));
			this._collisionBoxNormal.shapes.push(newRect);
		}
		this._collisionBoxWhenCollapsed = this.collapsedCollisionBox();
	}
	/**
	* 根据自身的折叠状态调整子节点的状态
	* 以屏蔽触碰和显示
	*/
	adjustChildrenStateByCollapse(parentCollapsed = false) {
		if (parentCollapsed || this.isCollapsed) this.children.forEach((child) => {
			child.isHiddenBySectionCollapse = true;
			if (child instanceof _Section) child.adjustChildrenStateByCollapse(true);
		});
		else this.children.forEach((child) => {
			if (child instanceof _Section) child.adjustChildrenStateByCollapse(false);
		});
	}
	/**
	* 获取节点的选中状态
	*/
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		this._isSelected = value;
	}
	/**
	* 只读，获取节点的矩形
	* 若要修改节点的矩形，请使用 moveTo等 方法
	*/
	get rectangle() {
		if (this.isCollapsed) return this._collisionBoxWhenCollapsed.getRectangle();
		else {
			const topLine = this._collisionBoxNormal.shapes[0];
			const rightLine = this._collisionBoxNormal.shapes[1];
			const bottomLine = this._collisionBoxNormal.shapes[2];
			const leftLine = this._collisionBoxNormal.shapes[3];
			return new Rectangle(new Vector(leftLine.start.x, topLine.start.y), new Vector(rightLine.end.x - leftLine.start.x, bottomLine.end.y - topLine.start.y));
		}
	}
	get geometryCenter() {
		return this.rectangle.location.clone().add(this.rectangle.size.clone().multiply(.5));
	}
	move(delta) {
		for (const shape of this.collisionBox.shapes) if (shape instanceof Line) {
			shape.start = shape.start.add(delta);
			shape.end = shape.end.add(delta);
		} else if (shape instanceof Rectangle) shape.location = shape.location.add(delta);
		for (const child of this.children) {
			if (child.isSelected) continue;
			child.move(delta);
		}
		if (!this.isHiddenBySectionCollapse) this.project.effects.addEffect(new NodeMoveShadowEffect(new ProgressNumber(0, 30), this.rectangle, delta));
		this.updateFatherSectionByMove();
		this.updateOtherEntityLocationByMove();
	}
	collideWithOtherEntity(other) {
		if (!Settings.isEnableEntityCollision) return;
		if (other instanceof _Section) {
			if (this.project.sectionMethods.isEntityInSection(this, other)) return;
		}
		if (this.project.sectionMethods.isEntityInSection(other, this)) return;
		super.collideWithOtherEntity(other);
	}
	/**
	* 将某个物体 的最小外接矩形的左上角位置 移动到某个位置
	* @param location
	*/
	moveTo(location) {
		const currentLeftTop = this.rectangle.location;
		const delta = location.clone().subtract(currentLeftTop);
		this.move(delta);
		this.updateFatherSectionByMove();
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], Section.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof CollisionBox === "undefined" ? Object : CollisionBox)], Section.prototype, "_collisionBoxNormal", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], Section.prototype, "color", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], Section.prototype, "text", void 0);
__decorate([serializable, __decorateMetadata("design:type", Array)], Section.prototype, "children", void 0);
__decorate([serializable, __decorateMetadata("design:type", Boolean)], Section.prototype, "isCollapsed", void 0);
__decorate([serializable, __decorateMetadata("design:type", Boolean)], Section.prototype, "locked", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], Section.prototype, "borderStyle", void 0);
Section = _Section = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], Section);
//#endregion
export { Random as i, NodeMoveShadowEffect as n, NodeMoveShadowEffect_exports as r, Section as t };
