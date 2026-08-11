import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, X as Color, ct as LruCache, et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { r as service, t as Project } from "./Project-CX2Ju4hB.mjs";
import { a as replaceTextWhenProtect, i as getTextSize, n as getFontIdentity, o as resolveFont, s as textToTextArray } from "./font-Cbb8DY3Q.mjs";
//#region src/core/render/canvas2d/basicRenderer/textRenderer.tsx
var TEXT_RENDER_SIZE = 100;
var TextRenderer = class TextRenderer {
	project;
	constructor(project) {
		this.project = project;
	}
	prefixWidth(characters, length, size, fontFamily, fontWeight) {
		return getTextSize(characters.slice(0, length).join(""), size, fontFamily, fontWeight).x;
	}
	findPrefixAtWidth(characters, targetWidth, size, fontFamily, fontWeight) {
		let low = 0;
		let high = characters.length;
		while (low < high) {
			const middle = Math.floor((low + high) / 2);
			if (this.prefixWidth(characters, middle, size, fontFamily, fontWeight) < targetWidth) low = middle + 1;
			else high = middle;
		}
		return low;
	}
	visibleTextRun(text, left, size, textWidth, fontFamily, fontWeight) {
		const viewportWidth = this.project.renderer.w;
		if (viewportWidth <= 0) return {
			text,
			left
		};
		if (left >= viewportWidth || left + textWidth <= 0) return void 0;
		if (textWidth <= viewportWidth * 2 || text.length < 16) return {
			text,
			left
		};
		const characters = Array.from(text);
		const visibleStart = Math.max(0, -left);
		const visibleEnd = Math.min(textWidth, viewportWidth - left);
		const start = Math.max(0, this.findPrefixAtWidth(characters, visibleStart, size, fontFamily, fontWeight) - 1);
		const end = Math.min(characters.length, this.findPrefixAtWidth(characters, visibleEnd, size, fontFamily, fontWeight) + 1);
		const prefixWidth = this.prefixWidth(characters, start, size, fontFamily, fontWeight);
		return {
			text: characters.slice(start, end).join(""),
			left: left + prefixWidth
		};
	}
	drawText(text, location, size, color, fontFamily, fontWeight) {
		if (!Number.isFinite(size) || size <= 0) return;
		const viewportHeight = this.project.renderer.h;
		if (viewportHeight > 0 && (location.y - size * .25 >= viewportHeight || location.y + size * 1.25 <= 0)) return;
		const textWidth = getTextSize(text, size, fontFamily, fontWeight).x;
		const visibleRun = this.visibleTextRun(text, location.x, size, textWidth, fontFamily, fontWeight);
		if (!visibleRun) return;
		const ctx = this.project.canvas.ctx;
		const font = resolveFont(TEXT_RENDER_SIZE, fontFamily, fontWeight);
		const fillStyle = color.toString();
		if (ctx.textBaseline !== "middle") ctx.textBaseline = "middle";
		if (ctx.textAlign !== "left") ctx.textAlign = "left";
		if (ctx.font !== font) ctx.font = font;
		if (ctx.fillStyle !== fillStyle) ctx.fillStyle = fillStyle;
		ctx.save();
		ctx.translate(visibleRun.left, location.y);
		ctx.scale(size / TEXT_RENDER_SIZE, size / TEXT_RENDER_SIZE);
		ctx.fillText(visibleRun.text, 0, TEXT_RENDER_SIZE / 2);
		ctx.restore();
	}
	prepareText(text) {
		return Settings.protectingPrivacy ? replaceTextWhenProtect(text) : text;
	}
	drawTextFromCenter(text, centerLocation, size, color, fontFamily, fontWeight) {
		const textWidth = getTextSize(text, size, fontFamily, fontWeight).x;
		this.drawText(text, new Vector(centerLocation.x - textWidth / 2, centerLocation.y - size / 2), size, color, fontFamily, fontWeight);
	}
	/**
	* 从左上角画文本
	*/
	renderText(text, location, size, color = Color.White, fontFamily, fontWeight) {
		this.renderTempText(text, location, size, color, fontFamily, fontWeight);
	}
	/**
	* 渲染临时文字，不构建缓存，不使用缓存
	*/
	renderTempText(text, location, size, color = Color.White, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		text = this.prepareText(text);
		if (Settings.textIntegerLocationAndSizeRender) {
			location = location.toInteger();
			size = Math.round(size);
			if (size === 0) return;
		}
		this.drawText(text, location, size, color, fontFamily, fontWeight);
	}
	/**
	* 从中心位置开始绘制文本
	*/
	renderTextFromCenter(text, centerLocation, size, color = Color.White, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			centerLocation = centerLocation.toInteger();
			size = Math.round(size);
			if (size === 0) return;
		}
		text = this.prepareText(text);
		this.drawTextFromCenter(text, centerLocation, size, color, fontFamily, fontWeight);
	}
	renderTempTextFromCenter(text, centerLocation, size, color = Color.White, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			centerLocation = centerLocation.toInteger();
			size = Math.round(size);
			if (size === 0) return;
		}
		text = this.prepareText(text);
		this.drawTextFromCenter(text, centerLocation, size, color, fontFamily, fontWeight);
	}
	renderTextInRectangle(text, rectangle, color, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		this.renderTextFromCenter(text, rectangle.center, this.getFontSizeByRectangleSize(text, rectangle, fontFamily, fontWeight).y, color, fontFamily, fontWeight);
	}
	getFontSizeByRectangleSize(text, rectangle, fontFamily, fontWeight) {
		const measuredSize = getTextSize(text, 100, fontFamily, fontWeight);
		const ratio = measuredSize.x / measuredSize.y;
		const sectionRatio = rectangle.size.x / rectangle.size.y;
		let fontHeight;
		const paddingRatio = .9;
		if (sectionRatio < ratio) fontHeight = rectangle.size.x / ratio * paddingRatio;
		else fontHeight = rectangle.size.y * paddingRatio;
		const minFontSize = .1;
		const maxFontSize = Math.max(rectangle.size.x, rectangle.size.y) * .8;
		fontHeight = Math.max(minFontSize, Math.min(fontHeight, maxFontSize));
		return new Vector(ratio * fontHeight, fontHeight);
	}
	/**
	* 渲染多行文本
	* @param text
	* @param location
	* @param fontSize
	* @param color
	* @param lineHeight
	*/
	renderMultiLineText(text, location, fontSize, limitWidth, color = Color.White, lineHeight = 1.2, limitLines = Infinity, fontFamily, fontWeight) {
		this.renderTempMultiLineText(text, location, fontSize, limitWidth, color, lineHeight, limitLines, fontFamily, fontWeight);
	}
	renderTempMultiLineText(text, location, fontSize, limitWidth, color = Color.White, lineHeight = 1.2, limitLines = Infinity, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			location = location.toInteger();
			fontSize = Math.round(fontSize);
			limitWidth = Math.round(limitWidth);
			if (fontSize === 0) return;
		}
		text = this.prepareText(text);
		let currentY = 0;
		let textLineArray = this.textToTextArrayWrapCache(text, fontSize, limitWidth, fontFamily, fontWeight);
		if (limitLines < textLineArray.length) {
			textLineArray = textLineArray.slice(0, limitLines);
			textLineArray[limitLines - 1] += "...";
		}
		for (const line of textLineArray) {
			this.drawText(line, location.add(new Vector(0, currentY)), fontSize, color, fontFamily, fontWeight);
			currentY += fontSize * lineHeight;
		}
	}
	/**
	* 从中心位置绘制带描边的多行文本。
	* 描边颜色通常设为背景色，用于让文字"压住"穿过它的连线，
	* 比矩形遮罩更简洁且不依赖坐标求交。
	*/
	renderMultiLineTextFromCenterWithStroke(text, centerLocation, size, fillColor, strokeColor, limitWidth = Infinity, lineHeight = 1.2, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			centerLocation = centerLocation.toInteger();
			size = Math.round(size);
			if (size === 0) return;
			limitWidth = Math.round(limitWidth);
		}
		text = this.prepareText(text);
		const textLineArray = this.textToTextArrayWrapCache(text, size, limitWidth, fontFamily, fontWeight);
		const ctx = this.project.canvas.ctx;
		const renderScale = size / TEXT_RENDER_SIZE;
		ctx.save();
		ctx.translate(centerLocation.x, centerLocation.y);
		ctx.scale(renderScale, renderScale);
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = resolveFont(TEXT_RENDER_SIZE, fontFamily, fontWeight);
		ctx.lineJoin = "round";
		ctx.strokeStyle = strokeColor.toString();
		ctx.lineWidth = TEXT_RENDER_SIZE * .4;
		ctx.fillStyle = fillColor.toString();
		for (let i = 0; i < textLineArray.length; i++) {
			const line = textLineArray[i];
			const y = (i - (textLineArray.length - 1) / 2) * TEXT_RENDER_SIZE * lineHeight;
			ctx.strokeText(line, 0, y);
			ctx.fillText(line, 0, y);
		}
		ctx.restore();
	}
	renderMultiLineTextFromCenter(text, centerLocation, size, limitWidth, color, lineHeight = 1.2, limitLines = Infinity, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			centerLocation = centerLocation.toInteger();
			size = Math.round(size);
			if (size === 0) return;
			limitWidth = Math.round(limitWidth);
		}
		text = this.prepareText(text);
		let currentY = 0;
		let textLineArray = this.textToTextArrayWrapCache(text, size, limitWidth, fontFamily, fontWeight);
		if (limitLines < textLineArray.length) {
			textLineArray = textLineArray.slice(0, limitLines);
			textLineArray[limitLines - 1] += "...";
		}
		for (const line of textLineArray) {
			this.drawTextFromCenter(line, centerLocation.add(new Vector(0, currentY - (textLineArray.length - 1) * size / 2)), size, color, fontFamily, fontWeight);
			currentY += size * lineHeight;
		}
	}
	renderTempMultiLineTextFromCenter(text, centerLocation, size, limitWidth, color, lineHeight = 1.2, limitLines = Infinity, fontFamily, fontWeight) {
		if (text.trim().length === 0) return;
		if (Settings.textIntegerLocationAndSizeRender) {
			centerLocation = centerLocation.toInteger();
			size = Math.round(size);
			if (size === 0) return;
			limitWidth = Math.round(limitWidth);
		}
		text = this.prepareText(text);
		let currentY = 0;
		let textLineArray = this.textToTextArrayWrapCache(text, size, limitWidth, fontFamily, fontWeight);
		if (limitLines < textLineArray.length) {
			textLineArray = textLineArray.slice(0, limitLines);
			textLineArray[limitLines - 1] += "...";
		}
		for (const line of textLineArray) {
			this.drawTextFromCenter(line, centerLocation.add(new Vector(0, currentY - (textLineArray.length - 1) * size / 2)), size, color, fontFamily, fontWeight);
			currentY += size * lineHeight;
		}
	}
	textArrayCache = new LruCache(1e3);
	/**
	* 加了缓存后的多行文本渲染函数
	* @param text
	* @param fontSize
	* @param limitWidth
	*/
	textToTextArrayWrapCache(text, fontSize, limitWidth, fontFamily, fontWeight) {
		const widthInEm = limitWidth / fontSize;
		const normalizedWidthInEm = Number.isFinite(widthInEm) ? Number(widthInEm.toPrecision(12)) : widthInEm;
		const cacheKey = JSON.stringify([
			text,
			normalizedWidthInEm,
			getFontIdentity(fontFamily, fontWeight)
		]);
		const cacheValue = this.textArrayCache.get(cacheKey);
		if (cacheValue) return cacheValue;
		const lines = this.textToTextArray(text, TEXT_RENDER_SIZE, normalizedWidthInEm * TEXT_RENDER_SIZE, fontFamily, fontWeight);
		this.textArrayCache.set(cacheKey, lines);
		return lines;
	}
	/**
	* 渲染多行文本的辅助函数
	* 将一段字符串分割成多行数组，遇到宽度限制和换行符进行换行。
	* 复用 font.tsx 中的公共函数
	* @param text
	*/
	textToTextArray(text, fontSize, limitWidth, fontFamily, fontWeight) {
		return textToTextArray(text, fontSize, limitWidth, fontFamily, fontWeight);
	}
	/**
	* 测量多行文本的大小
	* @param text
	* @param fontSize
	* @param limitWidth
	* @returns
	*/
	measureMultiLineTextSize(text, fontSize, limitWidth, lineHeight = 1.2, fontFamily, fontWeight) {
		const lines = this.textToTextArrayWrapCache(text, fontSize, limitWidth, fontFamily, fontWeight);
		let maxWidth = 0;
		let totalHeight = 0;
		for (const line of lines) {
			maxWidth = Math.max(maxWidth, getTextSize(line, fontSize, fontFamily, fontWeight).x);
			totalHeight += fontSize * lineHeight;
		}
		return new Vector(maxWidth, totalHeight);
	}
};
TextRenderer = __decorate([service("textRenderer"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], TextRenderer);
//#endregion
export { TextRenderer as t };
