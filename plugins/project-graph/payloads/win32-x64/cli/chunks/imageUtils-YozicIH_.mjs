import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
//#region src/core/service/dataManageService/imageUtils.tsx
function applyBlackAndWhite(canvas) {
	const ctx = canvas.getContext("2d");
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	const threshold = Settings.blackAndWhiteThreshold;
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const gray = .299 * r + .587 * g + .114 * b;
		if (threshold <= 0) data[i] = data[i + 1] = data[i + 2] = gray;
		else if (threshold >= 1) {
			const binary = gray > 128 ? 255 : 0;
			data[i] = data[i + 1] = data[i + 2] = binary;
		} else {
			const binary = gray > 128 ? 255 : 0;
			const blended = Math.round(gray * (1 - threshold) + binary * threshold);
			data[i] = data[i + 1] = data[i + 2] = blended;
		}
	}
	ctx.putImageData(imageData, 0, 0);
}
var MAX_IMPORT_IMAGE_DIMENSION = 16384;
var MAX_IMPORT_IMAGE_PIXELS = 64 * 1024 * 1024;
async function prepareImageBlobForImport(blob) {
	const bitmap = await createImageBitmap(blob);
	const sourceWidth = bitmap.width;
	const sourceHeight = bitmap.height;
	if (sourceWidth <= 0 || sourceHeight <= 0 || sourceWidth > MAX_IMPORT_IMAGE_DIMENSION || sourceHeight > MAX_IMPORT_IMAGE_DIMENSION || sourceWidth * sourceHeight > MAX_IMPORT_IMAGE_PIXELS) {
		bitmap.close();
		throw new Error(`图片尺寸不受支持: ${sourceWidth}×${sourceHeight}`);
	}
	let width = sourceWidth;
	let height = sourceHeight;
	if (Settings.resizePastedImages) {
		const maxDimension = Math.max(width, height);
		if (maxDimension > Settings.maxPastedImageSize) {
			const scale = Settings.maxPastedImageSize / maxDimension;
			width = Math.max(1, Math.round(width * scale));
			height = Math.max(1, Math.round(height * scale));
		}
	}
	if (!(width !== sourceWidth || height !== sourceHeight || Settings.compressImageToBlackAndWhite || Settings.compressImageToWebp)) {
		bitmap.close();
		return {
			blob,
			width,
			height
		};
	}
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	if (!context) {
		bitmap.close();
		throw new Error("无法获取 Canvas 2D 上下文");
	}
	context.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	if (Settings.compressImageToBlackAndWhite) applyBlackAndWhite(canvas);
	const outputType = Settings.compressImageToBlackAndWhite ? "image/png" : Settings.compressImageToWebp ? "image/webp" : blob.type;
	const quality = outputType === "image/webp" ? Settings.webpQuality : void 0;
	return {
		blob: await new Promise((resolve, reject) => {
			canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("图片编码失败")), outputType, quality);
		}),
		width,
		height
	};
}
//#endregion
export { prepareImageBlobForImport as n, applyBlackAndWhite as t };
