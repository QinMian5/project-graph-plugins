import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, U as Rectangle, i as CollisionBox } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as ImageNode } from "./ImageNode-B1vnrEi_.mjs";
import { t as Section } from "./Section-BuwCXB6_.mjs";
import { t as RectanglePushInEffect } from "./RectanglePushInEffect-ooPgSMHQ.mjs";
//#region src/core/service/dataManageService/imageNodeFactory.ts
function calculateImageDisplaySize(width, height, maxDisplaySize) {
	if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) throw new Error("图片尺寸无效");
	if (maxDisplaySize <= 0 || Number.isNaN(maxDisplaySize)) throw new Error("图片显示尺寸无效");
	const scale = Math.min(1, maxDisplaySize / Math.max(width, height));
	return {
		width: width * scale,
		height: height * scale,
		scale
	};
}
async function createImageNodeFromBlob(project, blob, options) {
	let width = options.intrinsicSize?.width;
	let height = options.intrinsicSize?.height;
	if (!width || !height) {
		const bitmap = await createImageBitmap(blob);
		width = bitmap.width;
		height = bitmap.height;
		bitmap.close();
	}
	const maxDisplaySize = options.maxDisplaySize ?? Number.POSITIVE_INFINITY;
	const scale = calculateImageDisplaySize(width, height, maxDisplaySize).scale;
	const attachmentId = project.addAttachment(blob);
	const location = options.location.clone();
	const imageNode = new ImageNode(project, {
		attachmentId,
		collisionBox: new CollisionBox([new Rectangle(location, new Vector(width * scale, height * scale))]),
		details: options.details ?? [],
		scale
	}, false, options.wrapInSection ?? Settings.wrapImageInGroup ? () => {
		const section = Section.fromEntities(project, [imageNode]);
		section.text = "";
		project.stageManager.add(section);
	} : void 0);
	project.stageManager.add(imageNode);
	const containingSections = project.sectionMethods.getSectionsByInnerLocation(location);
	if (containingSections.length > 0) {
		project.stageManager.goInSection([imageNode], containingSections[0]);
		project.effects.addEffect(RectanglePushInEffect.sectionGoInGoOut(imageNode.collisionBox.getRectangle(), containingSections[0].collisionBox.getRectangle()));
	}
	return {
		node: imageNode,
		width,
		height
	};
}
//#endregion
export { createImageNodeFromBlob as n, calculateImageDisplaySize as t };
