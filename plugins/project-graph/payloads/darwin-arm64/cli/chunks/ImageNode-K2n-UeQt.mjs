import { t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { G as Vector, R as toast, U as Rectangle, at as passObject, et as __decorate, i as CollisionBox, it as passExtraAtArg1, ot as serializable, rt as id, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { t as Project } from "./Project-CX2Ju4hB.mjs";
import { n as ConnectableEntity } from "./effectObject-7D20fXBW.mjs";
import { t as applyBlackAndWhite } from "./imageUtils-YozicIH_.mjs";
//#region src/core/stage/stageObject/entity/ImageNode.tsx
var ImageNode = class ImageNode extends ConnectableEntity {
	project;
	unknown;
	onReady;
	isHiddenBySectionCollapse = false;
	uuid;
	collisionBox;
	attachmentId;
	scale;
	/**
	* 是否为背景图片
	*/
	isBackground = false;
	/**
	* 节点是否被选中
	*/
	_isSelected = false;
	/**
	* 获取节点的选中状态
	*/
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		this._isSelected = value;
	}
	bitmap;
	disposed = false;
	pendingBitmapTasks = /* @__PURE__ */ new Set();
	state = "loading";
	constructor(project, { uuid = crypto.randomUUID(), collisionBox = new CollisionBox([new Rectangle(Vector.getZero(), Vector.getZero())]), details = [], attachmentId = "", scale = 1, isBackground = false }, unknown = false, onReady) {
		super();
		this.project = project;
		this.unknown = unknown;
		this.onReady = onReady;
		this.uuid = uuid;
		this.collisionBox = collisionBox;
		this.details = details;
		this.attachmentId = attachmentId;
		this.scale = scale;
		this.isBackground = isBackground;
		const blob = project.attachments.get(attachmentId);
		if (!blob) {
			this.state = "notFound";
			return;
		}
		if (typeof createImageBitmap === "undefined") return;
		this.loadBitmap(createImageBitmap(blob), () => {
			this.state = "success";
			this.scaleUpdate(0);
			this.onReady?.();
		});
	}
	loadBitmap(bitmapPromise, onLoaded) {
		const task = bitmapPromise.then((bitmap) => {
			if (this.disposed) {
				bitmap.close();
				return;
			}
			this.bitmap?.close();
			this.bitmap = bitmap;
			onLoaded();
		});
		this.pendingBitmapTasks.add(task);
		task.then(() => this.pendingBitmapTasks.delete(task), (error) => window.dispatchEvent(new ErrorEvent("error", { error })));
	}
	async dispose() {
		this.disposed = true;
		const results = await Promise.allSettled(this.pendingBitmapTasks);
		this.bitmap?.close();
		this.bitmap = void 0;
		const errors = results.filter((result) => result.status === "rejected").map(({ reason }) => reason);
		if (errors.length > 0) throw new AggregateError(errors, "ImageNode cleanup failed");
	}
	scaleUpdate(scaleDiff) {
		this.scale += scaleDiff;
		if (this.scale < .1) this.scale = .1;
		if (this.scale > 10) this.scale = 10;
		if (!this.bitmap) return;
		this.collisionBox = new CollisionBox([new Rectangle(this.rectangle.location, new Vector(this.bitmap.width, this.bitmap.height).multiply(this.scale))]);
		this.updateFatherSectionByMove();
	}
	/**
	* 只读，获取节点的矩形
	* 若要修改节点的矩形，请使用 moveTo等 方法
	*/
	get rectangle() {
		return this.collisionBox.shapes[0];
	}
	get geometryCenter() {
		return this.rectangle.location.clone().add(this.rectangle.size.clone().multiply(.5));
	}
	move(delta) {
		const newRectangle = this.rectangle.clone();
		newRectangle.location = newRectangle.location.add(delta);
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
	moveTo(location) {
		const newRectangle = this.rectangle.clone();
		newRectangle.location = location.clone();
		this.collisionBox.shapes[0] = newRectangle;
		this.updateFatherSectionByMove();
	}
	/**
	* 反转图片颜色
	* 将图片的RGB值转换为互补色（255-R, 255-G, 255-B）
	* 并将反色后的图片数据保存到project.attachments中，实现持久化存储
	*/
	reverseColors() {
		if (!this.bitmap) return;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = this.bitmap.width;
		canvas.height = this.bitmap.height;
		ctx.drawImage(this.bitmap, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			data[i] = 255 - data[i];
			data[i + 1] = 255 - data[i + 1];
			data[i + 2] = 255 - data[i + 2];
		}
		ctx.putImageData(imageData, 0, 0);
		this.loadBitmap(createImageBitmap(imageData), () => {
			canvas.toBlob((blob) => {
				if (blob) {
					const newAttachmentId = this.project.addAttachment(blob);
					this.attachmentId = newAttachmentId;
				}
			}, "image/png");
		});
	}
	/**
	* 交换图片的红蓝通道
	* 将图片的红色和蓝色通道对调，绿色和alpha通道保持不变
	* 并将处理后的图片数据保存到project.attachments中，实现持久化存储
	*/
	swapRedBlueChannels() {
		if (!this.bitmap) return;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = this.bitmap.width;
		canvas.height = this.bitmap.height;
		ctx.drawImage(this.bitmap, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			data[i] = data[i + 2];
			data[i + 2] = r;
		}
		ctx.putImageData(imageData, 0, 0);
		this.loadBitmap(createImageBitmap(imageData), () => {
			canvas.toBlob((blob) => {
				if (blob) {
					const newAttachmentId = this.project.addAttachment(blob);
					this.attachmentId = newAttachmentId;
				}
			}, "image/png");
		});
	}
	compressImage() {
		const blob = this.project.attachments.get(this.attachmentId);
		if (!blob) {
			toast.error("无法获取图片数据");
			return;
		}
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.onload = () => {
			let w = img.naturalWidth;
			let h = img.naturalHeight;
			if (Settings.resizePastedImages) {
				const maxSize = Settings.maxPastedImageSize;
				const maxDim = Math.max(w, h);
				if (maxDim > maxSize) {
					const scale = maxSize / maxDim;
					w = Math.round(w * scale);
					h = Math.round(h * scale);
				}
			}
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			URL.revokeObjectURL(url);
			if (Settings.compressImageToBlackAndWhite) applyBlackAndWhite(canvas);
			const sourceIsPng = blob.type === "image/png";
			const outputType = Settings.compressImageToBlackAndWhite ? "image/png" : sourceIsPng && Settings.compressImageToWebp ? "image/webp" : blob.type;
			canvas.toBlob((newBlob) => {
				if (!newBlob) {
					toast.error("图片压缩失败");
					return;
				}
				if (outputType === "image/webp" && !newBlob.type.includes("webp")) toast.warning("当前系统 webview 不支持 WebP 编码，已回退为 PNG");
				const newAttachmentId = this.project.addAttachment(newBlob);
				this.attachmentId = newAttachmentId;
				this.loadBitmap(createImageBitmap(newBlob), () => {
					this.scaleUpdate(0);
				});
			}, outputType, Settings.compressImageToBlackAndWhite ? void 0 : Settings.compressImageToWebp && sourceIsPng ? Settings.webpQuality : void 0);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			toast.error("图片加载失败");
		};
		img.src = url;
	}
	/**
	* 处理拖拽缩放逻辑
	* @param delta 拖拽距离向量
	*/
	resizeHandle(delta) {
		if (!this.bitmap) return;
		const currentDisplayWidth = this.bitmap.width * this.scale;
		const scaleDiff = Math.max(currentDisplayWidth + delta.x, this.bitmap.width * .1) / this.bitmap.width - this.scale;
		this.scaleUpdate(scaleDiff);
	}
	/**
	* 获取缩放控制点矩形
	* 返回右下角的一个小矩形，用于拖拽缩放
	*/
	getResizeHandleRect() {
		const rect = this.collisionBox.getRectangle();
		return new Rectangle(new Vector(rect.right - 25, rect.bottom - 25), new Vector(25, 25));
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], ImageNode.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof CollisionBox === "undefined" ? Object : CollisionBox)], ImageNode.prototype, "collisionBox", void 0);
__decorate([serializable, __decorateMetadata("design:type", String)], ImageNode.prototype, "attachmentId", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], ImageNode.prototype, "scale", void 0);
__decorate([serializable, __decorateMetadata("design:type", Boolean)], ImageNode.prototype, "isBackground", void 0);
ImageNode = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [
		typeof Project === "undefined" ? Object : Project,
		Object,
		Object,
		Function
	])
], ImageNode);
//#endregion
export { ImageNode as t };
