import { a as Entity } from "./ProjectUpgrader-C2CEsQ4r.mjs";
//#region src/cli/ClosedProjectRenderer.ts
var Renderer = class {
	static FONT_SIZE = 32;
	static NODE_PADDING = 14;
};
//#endregion
//#region src/core/stage/stageObject/abstract/ConnectableEntity.tsx
/**
* 一切可被Edge连接的东西，且会算入图分析算法的东西
*/
var ConnectableEntity = class extends Entity {
	unknown = false;
};
//#endregion
//#region src/core/service/feedbackService/effectEngine/effectObject.tsx
/**
* 一次性特效类
* timeProgress 0~max 表示时间进度，0表示开始，单位：帧
*/
var Effect = class {
	timeProgress;
	delay;
	constructor(timeProgress, delay = 0) {
		this.timeProgress = timeProgress;
		this.delay = delay;
	}
	/** 子特效（构成树形组合模式） */
	subEffects = [];
	tick(project) {
		if (this.timeProgress.maxValue > this.timeProgress.curValue) this.timeProgress.add(1);
		else this.timeProgress.subtract(1);
		for (const subEffect of this.subEffects) subEffect.tick(project);
	}
};
//#endregion
export { ConnectableEntity as n, Renderer as r, Effect as t };
