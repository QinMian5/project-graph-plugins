import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, K as ProgressNumber, U as Rectangle, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { n as ConnectableEntity, r as Renderer } from "./effectObject-7D20fXBW.mjs";
import { n as NodeMoveShadowEffect, t as Section } from "./Section-BuwCXB6_.mjs";
import { r as getMultiLineTextSize } from "./font-Cbb8DY3Q.mjs";
//#region src/core/stage/stageObject/entity/TextNode.tsx
var TextNode = class TextNode extends ConnectableEntity {
	project;
	unknown;
	uuid;
	text;
	collisionBox;
	color = Color.Transparent;
	/**
	* 字体缩放级别，整数，基准值为0，对应默认字体大小
	* 计算公式：finalFontSize = Renderer.FONT_SIZE * Math.pow(2, fontScaleLevel)
	*/
	fontScaleLevel = 0;
	static enableResizeCharCount = 20;
	/**
	* 调整大小的模式
	* auto：自动缩紧
	* manual：手动调整宽度，高度自动撑开。
	*/
	sizeAdjust = "auto";
	/**
	* 自定义字体，空字符串表示使用默认字体
	*/
	fontFamily = "";
	/**
	* 自定义字重，空字符串表示使用 normal
	*/
	fontWeight = "";
	/**
	* 边框样式：实线、虚线、无边框
	*/
	borderStyle = "solid";
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
	/**
	* 只读，获取节点的矩形
	* 若要修改节点的矩形，请使用 moveTo等 方法
	*/
	get rectangle() {
		return this.collisionBox.shapes[0];
	}
	get geometryCenter() {
		return this.rectangle.location.clone().add(this.rectangle.size.clone().multiply(.5));
	}
	set isSelected(value) {
		this._isSelected = value;
	}
	/**
	* 是否在编辑文字，编辑时不渲染文字
	*/
	_isEditing = false;
	get isEditing() {
		return this._isEditing;
	}
	set isEditing(value) {
		this._isEditing = value;
		this.project.textNodeRenderer.renderTextNode(this);
	}
	isHiddenBySectionCollapse = false;
	constructor(project, { uuid = crypto.randomUUID(), text = "", details = [], collisionBox = new CollisionBox([new Rectangle(Vector.getZero(), Vector.getZero())]), color = Color.Transparent, sizeAdjust = "auto", fontScaleLevel = 0, fontFamily = "", fontWeight = "", borderStyle = "solid" }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.uuid = uuid;
		this.text = text;
		this.details = details;
		this.collisionBox = collisionBox;
		this.color = color;
		this.sizeAdjust = sizeAdjust;
		this.fontScaleLevel = fontScaleLevel;
		this.fontFamily = fontFamily;
		this.fontWeight = fontWeight;
		this.borderStyle = borderStyle;
		this.updateFontSizeCache();
		if (this.sizeAdjust === "auto") this.adjustSizeByText();
		else if (this.sizeAdjust === "manual") this.resizeHandle(Vector.getZero());
	}
	/**
	* 字体大小缓存，避免重复计算
	*/
	fontSizeCache = Renderer.FONT_SIZE;
	/**
	* 获取当前字体大小
	*/
	getFontSize() {
		return this.fontSizeCache;
	}
	/**
	* 动态内边距，与字体大小等比缩放
	*/
	getPadding() {
		return this.fontSizeCache / Renderer.FONT_SIZE * Renderer.NODE_PADDING;
	}
	/**
	* 动态边框粗细，与字体大小等比缩放，基准为 2px
	*/
	getBorderWidth() {
		return this.fontSizeCache / Renderer.FONT_SIZE * 2;
	}
	/**
	* 动态圆角半径，与字体大小等比缩放
	*/
	getBorderRadius() {
		return this.fontSizeCache / Renderer.FONT_SIZE * Renderer.NODE_ROUNDED_RADIUS;
	}
	/**
	* 更新字体大小缓存
	* fontScaleLevel 存储的是"半个级别"，所以计算时要除以 2
	* 这样步长就是 0.5，避免了浮点数精度问题
	*/
	updateFontSizeCache() {
		this.fontSizeCache = Renderer.FONT_SIZE * 2 ** (this.fontScaleLevel / 2);
		if (this.fontSizeCache >= 2) this.fontSizeCache = Math.floor(this.fontSizeCache);
	}
	setFontScaleLevel(level) {
		this.fontScaleLevel = level;
		this.updateFontSizeCache();
		if (this.sizeAdjust === "auto") this.adjustSizeByText();
		else if (this.sizeAdjust === "manual") this.resizeHandle(Vector.getZero());
	}
	/**
	* 放大字体
	* @param anchorRate 可选。缩放时保持固定的锚点（矩形内比例，如 (0.5,0.5) 为中心）。不传则保持左上角不变。
	*/
	increaseFontSize(anchorRate) {
		this.fontScaleLevel++;
		this.updateFontSizeCache();
		if (this.sizeAdjust === "auto") {
			const oldRect = this.rectangle.clone();
			this.adjustSizeByText();
			if (anchorRate) this._adjustLocationToKeepAnchor(oldRect, anchorRate);
		} else if (this.sizeAdjust === "manual") {
			this.resizeHandle(Vector.getZero());
			if (anchorRate) {
				const oldRect = this.rectangle.clone();
				this._adjustLocationToKeepAnchor(oldRect, new Vector(anchorRate.x, 0));
			}
		}
	}
	/**
	* 缩小字体
	* @param anchorRate 可选。缩放时保持固定的锚点（矩形内比例）。不传则保持左上角不变。
	*/
	decreaseFontSize(anchorRate) {
		this.fontScaleLevel--;
		this.updateFontSizeCache();
		if (this.sizeAdjust === "auto") {
			const oldRect = this.rectangle.clone();
			this.adjustSizeByText();
			if (anchorRate) this._adjustLocationToKeepAnchor(oldRect, anchorRate);
		} else if (this.sizeAdjust === "manual") {
			this.resizeHandle(Vector.getZero());
			if (anchorRate) {
				const oldRect = this.rectangle.clone();
				this._adjustLocationToKeepAnchor(oldRect, new Vector(anchorRate.x, 0));
			}
		}
	}
	/**
	* 在尺寸已变更后，根据旧矩形和锚点比例调整 location，使锚点在世界坐标中保持不变
	*/
	_adjustLocationToKeepAnchor(oldRect, anchorRate) {
		const newSize = this.rectangle.size;
		const locationDelta = new Vector((oldRect.size.x - newSize.x) * anchorRate.x, (oldRect.size.y - newSize.y) * anchorRate.y);
		this.moveTo(oldRect.location.clone().add(locationDelta));
	}
	/**
	* 调整后的矩形是当前文字加了一圈padding之后的大小
	*/
	adjustSizeByText() {
		this.collisionBox.shapes[0] = new Rectangle(this.rectangle.location.clone(), getMultiLineTextSize(this.text, this.getFontSize(), 1.5, void 0, this.fontFamily, this.fontWeight).add(Vector.same(this.getPadding()).multiply(2)));
	}
	adjustHeightByText() {
		const wrapWidth = this.rectangle.size.x - this.getPadding() * 2;
		const newTextSize = this.project.textRenderer.measureMultiLineTextSize(this.text, this.getFontSize(), wrapWidth, 1.5, this.fontFamily, this.fontWeight);
		this.collisionBox.shapes[0] = new Rectangle(this.rectangle.location.clone(), new Vector(this.rectangle.size.x, newTextSize.y + this.getPadding() * 2));
		this.updateFatherSectionByMove();
	}
	/**
	* 强制触发自动调整大小
	*/
	forceAdjustSizeByText() {
		this.adjustSizeByText();
	}
	/**
	* 强制触发手动模式下的高度调整
	*/
	forceAdjustHeightByText() {
		this.adjustHeightByText();
	}
	rename(text) {
		this.text = text;
		if (this.sizeAdjust === "auto") this.adjustSizeByText();
		else if (this.sizeAdjust === "manual") this.adjustHeightByText();
		if (!this._isSyncing) this.project.syncAssociationManager.syncFrom(this, "text");
	}
	resizeHandle(delta) {
		const newRectangle = this.collisionBox.shapes[0].clone();
		const newSize = newRectangle.size.add(delta);
		newSize.x = Math.max(75, newSize.x);
		newSize.y = this.project.textRenderer.measureMultiLineTextSize(this.text, this.getFontSize(), newSize.x - this.getPadding() * 2, 1.5).y + this.getPadding() * 2;
		newRectangle.size = newSize;
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
	resizeWidthTo(width) {
		const currentWidth = this.rectangle.size.x;
		this.resizeHandle(new Vector(width - currentWidth, 0));
	}
	getResizeHandleRect() {
		const rect = this.collisionBox.getRectangle();
		return new Rectangle(rect.rightTop, new Vector(25, rect.size.y));
	}
	/**
	* 将某个物体移动一小段距离
	* @param delta
	*/
	move(delta) {
		const newRectangle = this.rectangle.clone();
		newRectangle.location = newRectangle.location.add(delta);
		this.collisionBox.shapes[0] = newRectangle;
		if (!this.isHiddenBySectionCollapse) this.project.effects.addEffect(new NodeMoveShadowEffect(new ProgressNumber(0, 30), this.rectangle, delta));
		this.updateFatherSectionByMove();
		this.updateOtherEntityLocationByMove();
	}
	collideWithOtherEntity(other) {
		if (!Settings.isEnableEntityCollision) return;
		if (other instanceof Section) {
			if (this.project.sectionMethods.isEntityInSection(this, other)) return;
		}
		super.collideWithOtherEntity(other);
	}
	/**
	* 将某个物体 的最小外接矩形的左上角位置 移动到某个位置
	* @param location
	*/
	moveTo(location) {
		const newRectangle = this.rectangle.clone();
		newRectangle.location = location.clone();
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], TextNode.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], TextNode.prototype, "text", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof CollisionBox === "undefined" ? Object : CollisionBox)], TextNode.prototype, "collisionBox", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], TextNode.prototype, "color", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], TextNode.prototype, "fontScaleLevel", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], TextNode.prototype, "sizeAdjust", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], TextNode.prototype, "fontFamily", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], TextNode.prototype, "fontWeight", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], TextNode.prototype, "borderStyle", void 0);
TextNode = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		Object,
		Object,
		Object
	])
], TextNode);
//#endregion
export { TextNode as t };
