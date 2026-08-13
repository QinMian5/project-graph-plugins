import { X as Color, et as __decorate, o as StageObject, ot as serializable, tt as __decorateMetadata } from "./ProjectUpgrader-C2CEsQ4r.mjs";
//#region src/core/stage/stageObject/abstract/Association.tsx
/**
* 一切连接关系的抽象
*/
var Association = class extends StageObject {
	associationList = [];
	/**
	* 任何关系都应该有一个颜色用来标注
	*/
	color = Color.Transparent;
};
__decorate([serializable, __decorateMetadata("design:type", Array)], Association.prototype, "associationList", void 0);
/**
* 一切可被连接的关联
*/
var ConnectableAssociation = class extends Association {
	associationList = [];
	reverse() {
		this.associationList.reverse();
	}
	get target() {
		return this.associationList[1];
	}
	set target(value) {
		this.associationList[1] = value;
	}
	get source() {
		return this.associationList[0];
	}
	set source(value) {
		this.associationList[0] = value;
	}
};
__decorate([serializable, __decorateMetadata("design:type", Array)], ConnectableAssociation.prototype, "associationList", void 0);
//#endregion
export { ConnectableAssociation as n, Association as t };
