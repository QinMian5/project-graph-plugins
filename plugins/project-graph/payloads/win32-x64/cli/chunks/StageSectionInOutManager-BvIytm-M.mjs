import { et as __decorate, i as CollisionBox, tt as __decorateMetadata } from "./ProjectUpgrader-C2CEsQ4r.mjs";
import { r as service, t as Project } from "./Project-eqh45NY9.mjs";
import { t as Edge } from "./Edge-z8WkqkYU.mjs";
import { t as TextNode } from "./TextNode-0KzNwbRI.mjs";
import { t as MultiTargetUndirectedEdge } from "./MutiTargetUndirectedEdge-BwjS-DGt.mjs";
//#region src/core/stage/stageManager/concreteMethods/StageSectionInOutManager.tsx
var SectionInOutManager = class SectionInOutManager {
	project;
	constructor(project) {
		this.project = project;
	}
	goInSection(entities, section) {
		let changed = false;
		for (const entity of entities) changed = this.attachEntityToSection(entity, section) || changed;
		if (changed) this.project.stageManager.updateReferences();
	}
	/**
	* 一些实体跳入多个Section（交叉嵌套）
	* 会先解除所有实体与Section的关联，再重新关联
	* @param entities
	* @param sections
	*/
	goInSections(entities, sections) {
		const targetSection = this.pickPreferredSection(sections);
		let changed = false;
		for (const entity of entities) if (targetSection) changed = this.attachEntityToSection(entity, targetSection) || changed;
		else changed = this.entityDropParent(entity) || changed;
		if (changed) this.project.stageManager.updateReferences();
	}
	goOutSection(entities, section) {
		let changed = false;
		for (const entity of entities) changed = this.sectionDropChild(section, entity) || changed;
		if (changed) this.project.stageManager.updateReferences();
	}
	/**
	* 将实体挂入某个 Section，但暂不刷新运行时索引。
	* 如果实体已经有父 Section，会先从旧父级中摘除，保证单父结构。
	*/
	attachEntityToSection(entity, section) {
		if (entity === section) return false;
		let changed = false;
		changed = this.entityDropParent(entity, false, section) || changed;
		if (!section.children.includes(entity)) {
			section.children.push(entity);
			entity.parentSection = section;
			changed = true;
		}
		return changed;
	}
	/**
	* 将实体从当前父 Section 中摘除，但暂不刷新运行时索引。
	*/
	entityDropParent(entity, convertEmptySectionToTextNode = false, excludeSection = null) {
		const currentParent = entity.parentSection;
		if (currentParent && currentParent !== excludeSection) return this.sectionDropChild(currentParent, entity, convertEmptySectionToTextNode);
		let changed = false;
		for (const section of this.project.stageManager.getSections()) {
			if (section === excludeSection) continue;
			if (section.children.includes(entity)) changed = this.sectionDropChild(section, entity, convertEmptySectionToTextNode) || changed;
		}
		return changed;
	}
	/**
	* Section 丢弃某个孩子
	* @param section
	* @param entity
	*/
	sectionDropChild(section, entity, convertEmptySectionToTextNode = true) {
		const newChildren = [];
		for (const child of section.children) if (entity.uuid !== child.uuid) newChildren.push(child);
		if (!(newChildren.length !== section.children.length)) return false;
		section.children = newChildren;
		if (entity.parentSection === section) entity.parentSection = null;
		if (convertEmptySectionToTextNode && section.children.length === 0) this.convertSectionToTextNode(section);
		return true;
	}
	pickPreferredSection(sections) {
		if (sections.length === 0) return null;
		return [...sections].sort((a, b) => {
			const areaDiff = this.getSectionArea(a) - this.getSectionArea(b);
			if (areaDiff !== 0) return areaDiff;
			const rectA = a.collisionBox.getRectangle();
			const rectB = b.collisionBox.getRectangle();
			if (rectA.top !== rectB.top) return rectA.top - rectB.top;
			if (rectA.left !== rectB.left) return rectA.left - rectB.left;
			return a.uuid.localeCompare(b.uuid);
		})[0];
	}
	getSectionArea(section) {
		const rect = section.collisionBox.getRectangle();
		return rect.size.x * rect.size.y;
	}
	/**
	* 将section转换为TextNode，保持UUID、详细信息和连线关系不变
	* @param section 要转换的section
	*/
	convertSectionToTextNode(section) {
		const fatherSection = section.parentSection;
		if (fatherSection) this.sectionDropChild(fatherSection, section, false);
		const textNode = new TextNode(this.project, {
			uuid: section.uuid,
			text: section.text,
			details: section.details,
			collisionBox: new CollisionBox([section.collisionBox.getRectangle()]),
			color: section.color.clone()
		});
		this.project.stageManager.add(textNode);
		if (fatherSection) this.attachEntityToSection(textNode, fatherSection);
		for (const edge of this.project.stageManager.getAssociations()) if (edge instanceof Edge) {
			if (edge.target.uuid === section.uuid) edge.target = textNode;
			if (edge.source.uuid === section.uuid) edge.source = textNode;
		} else if (edge instanceof MultiTargetUndirectedEdge) {
			for (let i = 0; i < edge.associationList.length; i++) if (edge.associationList[i].uuid === section.uuid) edge.associationList[i] = textNode;
		}
		this.project.stageManager.deleteEntities([section]);
	}
};
SectionInOutManager = __decorate([service("sectionInOutManager"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], SectionInOutManager);
//#endregion
export { SectionInOutManager as t };
