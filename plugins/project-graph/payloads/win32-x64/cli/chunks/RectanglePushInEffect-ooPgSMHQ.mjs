import { n as __exportAll } from "./chunk-2rV9d50f.mjs";
import { $ as mixColors, K as ProgressNumber, X as Color } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Effect } from "./effectObject-7D20fXBW.mjs";
//#region src/core/service/feedbackService/effectEngine/concrete/LineCuttingEffect.tsx
var LineCuttingEffect_exports = /* @__PURE__ */ __exportAll({ LineCuttingEffect: () => LineCuttingEffect });
/**
* 线段特效
* 直接显示全部，随着时间推移逐渐透明，但会有一个从开始到结束点的划过的特效
*
* 0%
* ------------------->
* 50%
*          ---------->
* 100%
*                   ->
*/
var LineCuttingEffect = class extends Effect {
	timeProgress;
	fromLocation;
	toLocation;
	fromColor;
	toColor;
	lineWidth;
	constructor(timeProgress, fromLocation, toLocation, fromColor, toColor, lineWidth = 25) {
		super(timeProgress);
		this.timeProgress = timeProgress;
		this.fromLocation = fromLocation;
		this.toLocation = toLocation;
		this.fromColor = fromColor;
		this.toColor = toColor;
		this.lineWidth = lineWidth;
	}
	render(project) {
		if (this.timeProgress.isFull) return;
		const fromLocation = this.fromLocation.add(this.toLocation.subtract(this.fromLocation).multiply(this.timeProgress.rate));
		const toLocation = this.toLocation;
		project.worldRenderUtils.renderCuttingFlash(fromLocation, toLocation, this.lineWidth * (1 - this.timeProgress.rate), mixColors(this.fromColor, this.toColor, this.timeProgress.rate));
	}
};
//#endregion
//#region src/core/service/feedbackService/effectEngine/concrete/RectanglePushInEffect.tsx
var RectanglePushInEffect_exports = /* @__PURE__ */ __exportAll({ RectanglePushInEffect: () => RectanglePushInEffect });
/**
* 用于某个节点进入了某个Section内部，四个角连向了父Section矩形的四个角
*/
var RectanglePushInEffect = class RectanglePushInEffect extends Effect {
	smallRectangle;
	bigRectangle;
	timeProgress;
	reversed;
	constructor(smallRectangle, bigRectangle, timeProgress = new ProgressNumber(0, 50), reversed = false) {
		super(timeProgress);
		this.smallRectangle = smallRectangle;
		this.bigRectangle = bigRectangle;
		this.timeProgress = timeProgress;
		this.reversed = reversed;
		if (this.reversed) this.subEffects = [
			new LineCuttingEffect(timeProgress, bigRectangle.leftTop, smallRectangle.leftTop, Color.Red, Color.Red),
			new LineCuttingEffect(timeProgress, bigRectangle.rightTop, smallRectangle.rightTop, Color.Red, Color.Red),
			new LineCuttingEffect(timeProgress, bigRectangle.leftBottom, smallRectangle.leftBottom, Color.Red, Color.Red),
			new LineCuttingEffect(timeProgress, bigRectangle.rightBottom, smallRectangle.rightBottom, Color.Red, Color.Red)
		];
		else this.subEffects = [
			new LineCuttingEffect(timeProgress, smallRectangle.leftTop, bigRectangle.leftTop, Color.Green, Color.Green),
			new LineCuttingEffect(timeProgress, smallRectangle.rightTop, bigRectangle.rightTop, Color.Green, Color.Green),
			new LineCuttingEffect(timeProgress, smallRectangle.leftBottom, bigRectangle.leftBottom, Color.Green, Color.Green),
			new LineCuttingEffect(timeProgress, smallRectangle.rightBottom, bigRectangle.rightBottom, Color.Green, Color.Green)
		];
	}
	static sectionGoInGoOut(entityRectangle, sectionRectangle, isGoOut = false) {
		return new RectanglePushInEffect(entityRectangle, sectionRectangle, new ProgressNumber(0, 50), isGoOut);
	}
	subEffects;
	render(project) {
		for (const effect of this.subEffects) effect.render(project);
	}
};
//#endregion
export { LineCuttingEffect_exports as i, RectanglePushInEffect_exports as n, LineCuttingEffect as r, RectanglePushInEffect as t };
