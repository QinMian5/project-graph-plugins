import { Buffer } from "node:buffer";
import sharp from "sharp";
//#region src/cli/ClosedProjectModelImageEncoder.ts
async function encodeModelImageDataUrl(blob, maxSize) {
	return `data:image/png;base64,${(await sharp(Buffer.from(await blob.arrayBuffer())).resize({
		width: maxSize,
		height: maxSize,
		fit: "inside",
		withoutEnlargement: true
	}).png().toBuffer()).toString("base64")}`;
}
//#endregion
export { encodeModelImageDataUrl };
