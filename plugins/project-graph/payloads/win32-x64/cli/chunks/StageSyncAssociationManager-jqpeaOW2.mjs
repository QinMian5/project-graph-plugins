import { G as Vector, U as Rectangle, X as Color, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-C2CEsQ4r.mjs";
import { r as service, t as Project } from "./Project-eqh45NY9.mjs";
import { t as Association } from "./Association-BI72uMwO.mjs";
import { t as TextNode } from "./TextNode-0KzNwbRI.mjs";
//#region src/core/stage/stageObject/association/SyncAssociation.tsx
var SyncAssociation = class SyncAssociation extends Association {
	project;
	unknown;
	uuid;
	/**
	* 需要同步的字段列表
	* "text"：同步节点文字内容
	* "color"：同步节点背景颜色
	* "details"：同步节点富文本详情
	*/
	keys;
	/**
	* 参与同步的所有成员（宽泛接受 StageObject，未来可扩展）
	*/
	associationList = [];
	/**
	* 孪生关系没有碰撞箱，返回零大小的空碰撞箱
	*/
	get collisionBox() {
		return new CollisionBox([new Rectangle(Vector.getZero(), Vector.getZero())]);
	}
	/**
	* 孪生关系不占据物理空间，排除在框选、劈砍、F键视野重置等交互之外
	*/
	get isPhysical() {
		return false;
	}
	/**
	* 孪生关系对象不可被选中
	*/
	_isSelected = false;
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		this._isSelected = value;
	}
	constructor(project, { uuid = crypto.randomUUID(), keys = [
		"text",
		"color",
		"details"
	], associationList = [], color = Color.Transparent }, unknown = false) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.uuid = uuid;
		this.keys = keys;
		this.associationList = associationList;
		this.color = color;
	}
	/**
	* 将 source 节点的同步字段值，复制给 this（自身）
	* 由 StageSyncAssociationManager.syncFrom 调用，不应直接调用
	*
	* @param source 发生变化的源节点
	*/
	applyFrom(source) {
		for (const member of this.associationList) {
			if (member === source) continue;
			for (const key of this.keys) if (key in source && key in member) member[key] = source[key];
		}
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], SyncAssociation.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", Array)], SyncAssociation.prototype, "keys", void 0);
__decorate([serializable, __decorateMetadata("design:type", Array)], SyncAssociation.prototype, "associationList", void 0);
SyncAssociation = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object
	])
], SyncAssociation);
//#endregion
//#region src/core/stage/stageManager/concreteMethods/StageSyncAssociationManager.tsx
var StageSyncAssociationManager = class StageSyncAssociationManager {
	project;
	constructor(project) {
		this.project = project;
	}
	createTwinsFromSelectedEntities() {
		const selectedEntities = this.project.stageManager.getSelectedEntities();
		const createdTwins = [];
		for (const entity of selectedEntities) if (entity instanceof TextNode) createdTwins.push(this.createTwinTextNode(entity));
		if (createdTwins.length === 0) return;
		this.project.stageManager.clearSelectAll();
		for (const twin of createdTwins) twin.isSelected = true;
	}
	/**
	* 获取所有 SyncAssociation 对象
	*/
	getSyncAssociations() {
		return this.project.stage.filter((obj) => obj instanceof SyncAssociation);
	}
	/**
	* 获取某个 StageObject 所在的所有 SyncAssociation
	*/
	getSyncAssociationsByMember(member) {
		return this.getSyncAssociations().filter((sa) => sa.associationList.includes(member));
	}
	/**
	* 获取某个 StageObject 的所有孪生兄弟（同组中除自身以外的成员）
	*/
	getSyncSiblings(member) {
		const result = [];
		for (const sa of this.getSyncAssociationsByMember(member)) for (const other of sa.associationList) if (other !== member && !result.includes(other)) result.push(other);
		return result;
	}
	/**
	* 从已有的 TextNode 创建一个孪生节点。
	*
	* 行为：
	* - 新节点内容（text、color、details）与原节点相同
	* - 新节点位置偏移在原节点右侧
	* - 如果原节点已在某个 SyncAssociation 中，新节点直接加入该组；否则新建一个 SyncAssociation
	*
	* @param source 作为孪生来源的节点
	*/
	createTwinTextNode(source) {
		const sourceRect = source.rectangle;
		const offset = new Vector(sourceRect.size.x + 60, 0);
		const newLocation = sourceRect.location.clone().add(offset);
		const twin = new TextNode(this.project, {
			text: source.text,
			collisionBox: new CollisionBox([new Rectangle(newLocation, Vector.getZero())]),
			color: source.color.clone()
		});
		twin.details = source.details;
		twin.forceAdjustSizeByText();
		this.project.stageManager.add(twin);
		const existingSyncAssociations = this.getSyncAssociationsByMember(source);
		if (existingSyncAssociations.length > 0) existingSyncAssociations[0].associationList.push(twin);
		else {
			const syncAssociation = new SyncAssociation(this.project, {
				associationList: [source, twin],
				keys: [
					"text",
					"color",
					"details"
				]
			});
			this.project.stageManager.add(syncAssociation);
		}
		this.project.historyManager.recordStep();
		return twin;
	}
	/**
	* 当某个成员的指定字段发生变化时，将变化同步给同组所有其他成员。
	*
	* 使用 syncingSet 防止循环同步：
	* - A 修改 → 同步 B、C，将 A 加入 syncingSet
	* - B 收到同步写入时，发现 B 也在某个 SyncAssociation 中，但 A 已在 syncingSet 中，跳过
	*
	* @param source 发生变化的源节点
	* @param key 发生变化的字段名
	* @param syncingSet 当前同步会话中已处理过的节点 UUID 集合（防止循环）
	*/
	syncFrom(source, key, syncingSet = /* @__PURE__ */ new Set()) {
		syncingSet.add(source.uuid);
		for (const sa of this.getSyncAssociationsByMember(source)) {
			if (!sa.keys.includes(key)) continue;
			for (const member of sa.associationList) {
				if (member === source) continue;
				if (syncingSet.has(member.uuid)) continue;
				if (key === "text" && member instanceof TextNode) {
					member._isSyncing = true;
					member.rename(source[key]);
					member._isSyncing = false;
				} else if (key in source && key in member) member[key] = source[key];
				syncingSet.add(member.uuid);
				this.syncFrom(member, key, syncingSet);
			}
		}
	}
	/**
	* 当某个 StageObject 被从舞台删除时，从所有 SyncAssociation 中移除它。
	* 若某个 SyncAssociation 成员数量减少到 1 以下，则整个关系对象也被删除。
	*
	* 由 StageDeleteManager 调用。
	*
	* @param deleted 被删除的对象
	*/
	onStageObjectDeleted(deleted) {
		const toDeleteSyncAssociations = [];
		for (const sa of this.getSyncAssociationsByMember(deleted)) {
			const idx = sa.associationList.indexOf(deleted);
			if (idx !== -1) sa.associationList.splice(idx, 1);
			if (sa.associationList.length < 2) toDeleteSyncAssociations.push(sa);
		}
		for (const sa of toDeleteSyncAssociations) this.project.stageManager.delete(sa);
	}
};
StageSyncAssociationManager = __decorate([service("syncAssociationManager"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], StageSyncAssociationManager);
//#endregion
export { StageSyncAssociationManager as t };
