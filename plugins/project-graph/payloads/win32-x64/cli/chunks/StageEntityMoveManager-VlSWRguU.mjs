import { n as __exportAll } from "./chunk-2rV9d50f.mjs";
import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, K as ProgressNumber, X as Color, et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { r as service, t as Project } from "./Project-Dh_heHFZ.mjs";
import { n as ConnectableEntity, r as Renderer, t as Effect } from "./effectObject-7D20fXBW.mjs";
import { t as SoundService } from "./ClosedProjectSoundService-CC7OE8L4.mjs";
import { t as RectanglePushInEffect } from "./RectanglePushInEffect-ooPgSMHQ.mjs";
//#region src/core/service/feedbackService/effectEngine/mathTools/rateFunctions.tsx
var RateFunctions;
(function(_RateFunctions) {
	function doorFunction(xRate) {
		return Math.sin(xRate * Math.PI) ** 1;
	}
	_RateFunctions.doorFunction = doorFunction;
	function quadraticDownward(xRate) {
		return -4 * (xRate - .5) ** 2 + 1;
	}
	_RateFunctions.quadraticDownward = quadraticDownward;
})(RateFunctions || (RateFunctions = {}));
//#endregion
//#region src/core/service/feedbackService/effectEngine/concrete/EntityJumpMoveEffect.tsx
var EntityJumpMoveEffect_exports = /* @__PURE__ */ __exportAll({ EntityJumpMoveEffect: () => EntityJumpMoveEffect });
var EntityJumpMoveEffect = class extends Effect {
	time;
	rectStart;
	delta;
	constructor(time, rectStart, delta) {
		super(new ProgressNumber(0, time));
		this.time = time;
		this.rectStart = rectStart;
		this.delta = delta;
	}
	render(project) {
		const currentRect = this.rectStart.clone();
		currentRect.location = currentRect.location.add(this.delta.clone().multiply(this.timeProgress.rate));
		const groundShadowRect = currentRect.clone();
		const addHeight = RateFunctions.quadraticDownward(this.timeProgress.rate) * 100;
		currentRect.location.y -= addHeight;
		project.shapeRenderer.renderRectWithShadow(project.renderer.transformWorld2View(groundShadowRect), project.stageStyleManager.currentStyle.effects.windowFlash.toNewAlpha(.2), Color.Transparent, 2 * project.camera.currentScale, project.stageStyleManager.currentStyle.effects.windowFlash.toNewAlpha(.2), 10, 0, 0, Renderer.NODE_ROUNDED_RADIUS * project.camera.currentScale);
		project.shapeRenderer.renderRect(project.renderer.transformWorld2View(currentRect), Color.Transparent, project.stageStyleManager.currentStyle.StageObjectBorder, 2 * project.camera.currentScale, Renderer.NODE_ROUNDED_RADIUS * project.camera.currentScale);
	}
};
//#endregion
//#region src/core/stage/stageManager/concreteMethods/StageEntityMoveManager.tsx
var EntityMoveManager = class EntityMoveManager {
	project;
	constructor(project) {
		this.project = project;
	}
	/** 方向命令向量，由快捷键 press/release 写入，值域 [-1,1]×[-1,1] */
	moveAccelerateCommander = Vector.getZero();
	/** 当前速度 */
	moveSpeed = Vector.getZero();
	/** 速度指数摩擦力指数（与 Camera 保持一致） */
	frictionExponent = 1.5;
	/**
	* 每帧物理 tick：把速度转化为实体位移
	* 注意：移动过程中不记录历史（避免历史爆炸），松开按键速度归零后再记录一次
	*/
	tick() {
		if (this.moveAccelerateCommander.isZero() && this.moveSpeed.isZero()) return;
		let friction = Vector.getZero();
		if (!this.moveSpeed.isZero()) {
			const speedSize = this.moveSpeed.magnitude();
			friction = this.moveSpeed.normalize().multiply(-1).multiply(Settings.moveFriction * speedSize ** this.frictionExponent).limitX(-300, 300).limitY(-300, 300);
		}
		const power = this.moveAccelerateCommander.multiply(Settings.moveAmplitude * (1 / this.project.camera.currentScale) ** 2).limitX(-300, 300).limitY(-300, 300);
		this.moveSpeed = this.moveSpeed.add(power).add(friction);
		if (this.moveSpeed.magnitude() < .01) {
			this.moveSpeed = Vector.getZero();
			if (this.moveAccelerateCommander.isZero()) this.project.historyManager.recordStep();
			return;
		}
		this.moveEntitiesWithChildren(this.moveSpeed, true);
	}
	/**
	* 持续移动：某方向键按下
	*/
	continuousMoveKeyPress(direction) {
		this.moveAccelerateCommander = this.moveAccelerateCommander.add(direction).limitX(-1, 1).limitY(-1, 1);
	}
	/**
	* 持续移动：某方向键松开（速度会自然衰减至停止后记录历史）
	*/
	continuousMoveKeyRelease(direction) {
		this.moveAccelerateCommander = this.moveAccelerateCommander.subtract(direction).limitX(-1, 1).limitY(-1, 1);
	}
	/**
	* 立刻刹车：清除命令向量和速度（进入编辑模式等场景使用）
	*/
	stopImmediately() {
		this.moveAccelerateCommander = Vector.getZero();
		this.moveSpeed = Vector.getZero();
	}
	/**
	* 检查实体是否可以移动（考虑锁定状态）
	* @param entity 要检查的实体
	* @returns 如果实体可以移动返回 true，否则返回 false
	*/
	canMoveEntity(entity) {
		return entity.nearestLockedAncestorSection === null;
	}
	/**
	* 让某一个实体移动一小段距离
	* @param entity
	* @param delta
	* @param isAutoAdjustSection 移动的时候是否触发分组框的弹性调整
	*/
	moveEntityUtils(entity, delta, isAutoAdjustSection = true) {
		if (!this.canMoveEntity(entity)) return;
		entity.move(delta);
		if (isAutoAdjustSection) {
			let current = entity.parentSection;
			while (current) {
				current.adjustLocationAndSize();
				current = current.parentSection;
			}
		}
	}
	/**
	* 跳跃式移动传入的实体
	* 会破坏嵌套关系
	* @param entity
	* @param delta
	*/
	jumpMoveEntityUtils(entity, delta) {
		if (!this.canMoveEntity(entity)) return;
		const beforeMoveRect = entity.collisionBox.getRectangle().clone();
		console.log("JUMP MOVE");
		this.project.effects.addEffect(new EntityJumpMoveEffect(15, beforeMoveRect, delta));
		const targetSection = this.project.sectionMethods.getInnermostSectionByLocation(beforeMoveRect.center.add(delta));
		if (targetSection && (targetSection.locked || this.project.sectionMethods.isObjectBeLockedBySection(targetSection))) return;
		if (targetSection === null) {
			if (entity.parentSection) this.project.stageManager.goOutSection([entity], entity.parentSection);
		} else {
			this.project.sectionInOutManager.goInSection([entity], targetSection);
			this.project.effects.addEffect(new RectanglePushInEffect(entity.collisionBox.getRectangle(), targetSection.collisionBox.getRectangle()));
			SoundService.play.entityJumpSoundFile();
		}
		this.moveEntityUtils(entity, delta, false);
	}
	/**
	* 将某个实体移动到目标位置
	* @param entity
	* @param location
	*/
	moveEntityToUtils(entity, location) {
		if (!this.canMoveEntity(entity)) return;
		entity.moveTo(location);
		let current = entity.parentSection;
		while (current) {
			current.adjustLocationAndSize();
			current = current.parentSection;
		}
	}
	/**
	* 移动所有选中的实体一小段距离
	* @param delta
	* @param isAutoAdjustSection
	*/
	moveSelectedEntities(delta, isAutoAdjustSection = true) {
		for (const node of this.project.stageManager.getEntities()) if (node.isSelected) this.moveEntityUtils(node, delta, isAutoAdjustSection);
	}
	/**
	* 跳跃式移动所有选中的可连接实体
	* 会破坏框的嵌套关系
	* @param delta
	*/
	jumpMoveSelectedConnectableEntities(delta) {
		for (const node of this.project.stageManager.getConnectableEntity()) if (node.isSelected) this.jumpMoveEntityUtils(node, delta);
	}
	/**
	* 树型移动 所有选中的实体
	* @param delta
	* @param skipDashed 是否跳过虚线边（树形格式化时传 true，避免带动虚线连接的节点）
	*/
	moveEntitiesWithChildren(delta, skipDashed = true) {
		for (const node of this.project.stageManager.getEntities()) if (node.isSelected) if (node instanceof ConnectableEntity) this.moveWithChildren(node, delta, skipDashed);
		else this.moveEntityUtils(node, delta);
	}
	/**
	* 树形移动传入的可连接实体
	* @param node
	* @param delta
	* @param skipDashed 是否跳过虚线边（树形格式化时传 true，避免带动虚线连接的节点）
	*/
	moveWithChildren(node, delta, skipDashed = false) {
		const successorSet = this.project.graphMethods.getSuccessorSet(node, true, skipDashed);
		for (const successor of successorSet) this.moveEntityUtils(successor, delta);
	}
};
EntityMoveManager = __decorate([service("entityMoveManager"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], EntityMoveManager);
//#endregion
export { EntityJumpMoveEffect as n, EntityJumpMoveEffect_exports as r, EntityMoveManager as t };
