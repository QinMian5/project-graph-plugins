import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, lt as MaxSizeCache } from "./ProjectUpgrader-CJFD-Z4z.mjs";
//#region src/utils/font.tsx
var _context = document.createElement("canvas").getContext("2d");
var _cache = new MaxSizeCache(1e4);
var _fontDescriptorCache = new MaxSizeCache(100);
var REFERENCE_FONT_SIZE = 100;
function getFontIdentity(fontFamily, fontWeight) {
	return JSON.stringify([fontWeight || "normal", fontFamily || Settings.defaultFontFamily]);
}
function resolveFontFamily(fontFamily, fontWeight) {
	const cacheKey = getFontIdentity(fontFamily, fontWeight);
	const cached = _fontDescriptorCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolvedFamily = fontFamily ? `"${fontFamily}"` : Settings.defaultFontFamily;
	_fontDescriptorCache.set(cacheKey, resolvedFamily);
	return resolvedFamily;
}
/**
* 解析字体字符串，支持自定义字体族和字重
* @param fontSize 字体大小
* @param fontFamily 自定义字体族，空字符串或 undefined 时使用全局默认字体
* @param fontWeight 自定义字重，空字符串或 undefined 时使用 normal
*/
function resolveFont(fontSize, fontFamily, fontWeight) {
	return `${fontWeight || "normal"} ${fontSize}px ${resolveFontFamily(fontFamily, fontWeight)}`;
}
/**
* 测量文本的宽度（高度不测量）
* 不要在循环中调用，会影响性能
* @param text
* @param size
* @returns
*/
function getTextSize(text, size, fontFamily, fontWeight) {
	const cacheKey = JSON.stringify([text, getFontIdentity(fontFamily, fontWeight)]);
	{
		const referenceWidth = _cache.get(cacheKey);
		if (referenceWidth !== void 0) return new Vector(referenceWidth * size / REFERENCE_FONT_SIZE, size);
	}
	if (!_context) throw new Error("Failed to get canvas context");
	_context.font = resolveFont(REFERENCE_FONT_SIZE, fontFamily, fontWeight);
	const metrics = _context.measureText(text);
	_cache.set(cacheKey, metrics.width);
	return new Vector(metrics.width * size / REFERENCE_FONT_SIZE, size);
}
/**
* 获取多行文本的宽度和高度
* @param text
* @param fontSize
* @param lineHeight 行高，是一个比率
* @returns
*/
function getMultiLineTextSize(text, fontSize, lineHeight, _limitWidth, fontFamily, fontWeight) {
	const lines = text.split("\n");
	let width = 0;
	let height = 0;
	for (const line of lines) {
		const size = getTextSize(line, fontSize, fontFamily, fontWeight);
		width = Math.max(width, size.x);
		height += size.y * lineHeight;
	}
	return new Vector(width, height);
}
/**
* 隐私保护文本替换
* 根据设置的保护模式进行不同的替换
* @param text
*/
function replaceTextWhenProtect(text) {
	if ((Settings.protectingPrivacyMode || "secretWord") === "caesar") return text.split("").map((char) => {
		const code = char.charCodeAt(0);
		if (code >= 32 && code <= 126) {
			if (char === "z") return "a";
			if (char === "Z") return "A";
			if (char === "9") return "0";
			return String.fromCharCode(code + 1);
		}
		if (code >= 19968 && code <= 40869) {
			const shiftedCode = code + 1;
			return String.fromCharCode(shiftedCode <= 40869 ? shiftedCode : 19968);
		}
		return char;
	}).join("");
	return text.replace(/[\u4e00-\u9fa5]/g, "㊙").replace(/[a-z]/g, "a").replace(/[A-Z]/g, "A").replace(/\d/g, "6");
}
function camelCaseToDashCase(text) {
	return text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
/**
* 将文本按宽度限制分割成多行数组
* 遇到宽度限制或换行符时进行换行
* @param text 原始文本
* @param fontSize 字体大小
* @param limitWidth 宽度限制
* @returns 分割后的行数组
*/
function textToTextArray(text, fontSize, limitWidth, fontFamily, fontWeight) {
	const lines = [];
	const paragraphs = text.split("\n");
	for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
		const paragraph = paragraphs[paragraphIndex];
		const characters = Array.from(paragraph);
		let start = 0;
		let isFirstWrappedLine = true;
		while (start < characters.length) {
			const remaining = characters.slice(start);
			const remainingText = remaining.join("");
			if (getTextSize(remainingText, fontSize, fontFamily, fontWeight).x <= limitWidth) {
				lines.push(remainingText);
				start = characters.length;
				break;
			}
			let low = 1;
			let high = remaining.length;
			let fittingLength = 0;
			while (low <= high) {
				const middle = Math.floor((low + high) / 2);
				if (getTextSize(remaining.slice(0, middle).join(""), fontSize, fontFamily, fontWeight).x <= limitWidth) {
					fittingLength = middle;
					low = middle + 1;
				} else high = middle - 1;
			}
			if (fittingLength === 0) {
				if (isFirstWrappedLine) lines.push("");
				fittingLength = 1;
			}
			lines.push(remaining.slice(0, fittingLength).join(""));
			start += fittingLength;
			isFirstWrappedLine = false;
		}
		if (paragraphIndex < paragraphs.length - 1 && paragraph.length === 0) lines.push("");
		else if (paragraphIndex < paragraphs.length - 1 && start === 0) lines.push(paragraph);
	}
	return lines;
}
//#endregion
export { replaceTextWhenProtect as a, getTextSize as i, getFontIdentity as n, resolveFont as o, getMultiLineTextSize as r, textToTextArray as s, camelCaseToDashCase as t };
