import { C as object, D as string, S as number, h as boolean, p as array } from "./v4-DD_PkrNo.mjs";
import { t as fetch } from "./ClosedProjectHttp-B1zYjAcG.mjs";
//#region src/core/service/dataManageService/aiEngine/OpenverseImageSearch.ts
var MAX_DOWNLOAD_BYTES = 20 * 1024 * 1024;
var MAX_REDIRECTS = 5;
var MAX_DOWNLOAD_RETRIES = 5;
var INITIAL_RETRY_DELAY_MS = 250;
var ALLOWED_IMAGE_TYPES = new Set([
	"image/png",
	"image/jpeg",
	"image/webp"
]);
var REDIRECT_STATUSES = new Set([
	301,
	302,
	303,
	307,
	308
]);
var openverseSearchResponseSchema = object({ results: array(object({
	id: string(),
	title: string().nullable().optional(),
	url: string(),
	foreign_landing_url: string().nullable().optional(),
	creator: string().nullable().optional(),
	license: string().nullable().optional(),
	license_url: string().nullable().optional(),
	width: number().nullable().optional(),
	height: number().nullable().optional(),
	mature: boolean().optional()
})) });
var NonRetryableImageDownloadError = class extends Error {};
var ImageDownloadHttpError = class extends Error {
	retryable;
	constructor(status, retryable) {
		super(`图片下载失败 (${status})`);
		this.retryable = retryable;
	}
};
function isPrivateIpv4(hostname) {
	const parts = hostname.split(".");
	if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) return false;
	const numbers = parts.map(Number);
	if (numbers.some((value) => value < 0 || value > 255)) return true;
	const [a, b] = numbers;
	return a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a >= 224;
}
function isBlockedIpv6Literal(hostname) {
	return hostname.replace(/^\[|\]$/g, "").toLowerCase().includes(":");
}
function assertSafeRemoteImageUrl(value) {
	const url = new URL(value);
	if (url.protocol !== "https:") throw new NonRetryableImageDownloadError("图片地址必须使用 HTTPS");
	const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
	if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname.endsWith(".lan") || hostname.endsWith(".internal") || hostname.endsWith(".home.arpa") || isPrivateIpv4(hostname) || isBlockedIpv6Literal(hostname)) throw new NonRetryableImageDownloadError("图片地址指向本地或私有网络");
	return url;
}
async function fetchRemoteImageResponse(initialUrl, fetchImpl, abortSignal) {
	let currentUrl = assertSafeRemoteImageUrl(initialUrl);
	for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
		const response = await fetchImpl(currentUrl.toString(), {
			headers: { Accept: "image/png,image/jpeg,image/webp" },
			redirect: "manual",
			signal: abortSignal
		});
		if (!REDIRECT_STATUSES.has(response.status)) return response;
		const location = response.headers.get("location");
		await response.body?.cancel();
		if (!location) throw new NonRetryableImageDownloadError("图片重定向缺少目标地址");
		if (redirectCount === MAX_REDIRECTS) throw new NonRetryableImageDownloadError("图片重定向次数过多");
		currentUrl = assertSafeRemoteImageUrl(new URL(location, currentUrl).toString());
	}
	throw new NonRetryableImageDownloadError("图片重定向次数过多");
}
async function downloadRemoteImageOnce(url, fetchImpl, abortSignal) {
	const response = await fetchRemoteImageResponse(url, fetchImpl, abortSignal);
	if (!response.ok) {
		await response.body?.cancel();
		const retryable = response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500;
		throw new ImageDownloadHttpError(response.status, retryable);
	}
	const rawContentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
	const contentType = rawContentType === "image/jpg" ? "image/jpeg" : rawContentType;
	if (!contentType || !ALLOWED_IMAGE_TYPES.has(contentType)) {
		await response.body?.cancel();
		throw new NonRetryableImageDownloadError(`不支持的图片格式: ${contentType ?? "unknown"}`);
	}
	const contentLength = Number(response.headers.get("content-length"));
	if (Number.isFinite(contentLength) && contentLength > MAX_DOWNLOAD_BYTES) {
		await response.body?.cancel();
		throw new NonRetryableImageDownloadError("图片文件超过 20 MB 限制");
	}
	const chunks = [];
	let receivedBytes = 0;
	const reader = response.body?.getReader();
	if (reader) while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		receivedBytes += value.byteLength;
		if (receivedBytes > MAX_DOWNLOAD_BYTES) {
			await reader.cancel();
			throw new NonRetryableImageDownloadError("图片文件超过 20 MB 限制");
		}
		chunks.push(value);
	}
	else {
		const bytes = new Uint8Array(await response.arrayBuffer());
		if (bytes.byteLength > MAX_DOWNLOAD_BYTES) throw new NonRetryableImageDownloadError("图片文件超过 20 MB 限制");
		chunks.push(bytes);
		receivedBytes = bytes.byteLength;
	}
	if (receivedBytes === 0) throw new NonRetryableImageDownloadError("下载的图片为空");
	return new Blob(chunks.map((chunk) => chunk.slice().buffer), { type: contentType });
}
function createAbortError() {
	const error = /* @__PURE__ */ new Error("图片下载已取消");
	error.name = "AbortError";
	return error;
}
function waitForRetry(delayMs, abortSignal) {
	if (abortSignal?.aborted) return Promise.reject(createAbortError());
	return new Promise((resolve, reject) => {
		const handleAbort = () => {
			clearTimeout(timer);
			reject(createAbortError());
		};
		const timer = setTimeout(() => {
			abortSignal?.removeEventListener("abort", handleAbort);
			resolve();
		}, delayMs);
		abortSignal?.addEventListener("abort", handleAbort, { once: true });
	});
}
function isRetryableDownloadError(error, abortSignal) {
	if (abortSignal?.aborted || error instanceof Error && error.name === "AbortError") return false;
	if (error instanceof NonRetryableImageDownloadError) return false;
	if (error instanceof ImageDownloadHttpError) return error.retryable;
	return true;
}
async function downloadRemoteImageWithBudget(url, options, retryBudget) {
	const fetchImpl = options.fetchImpl ?? fetch;
	const retryDelay = options.retryDelay ?? waitForRetry;
	let retryIndex = 0;
	while (true) try {
		return await downloadRemoteImageOnce(url, fetchImpl, options.abortSignal);
	} catch (error) {
		if (!isRetryableDownloadError(error, options.abortSignal) || retryBudget.remaining <= 0) throw error;
		retryBudget.remaining--;
		const delayMs = Math.min(INITIAL_RETRY_DELAY_MS * 2 ** retryIndex, 4e3);
		retryIndex++;
		await retryDelay(delayMs, options.abortSignal);
	}
}
async function downloadRemoteImage(url, options = {}) {
	const requestedRetries = options.maxRetries ?? MAX_DOWNLOAD_RETRIES;
	return downloadRemoteImageWithBudget(url, options, { remaining: Math.max(0, Math.min(MAX_DOWNLOAD_RETRIES, Number.isFinite(requestedRetries) ? Math.floor(requestedRetries) : MAX_DOWNLOAD_RETRIES)) });
}
async function searchOpenverseImages(query, fetchImpl = fetch, abortSignal) {
	const searchUrl = new URL("https://api.openverse.org/v1/images/");
	searchUrl.search = new URLSearchParams({
		q: query,
		page_size: "8",
		mature: "false",
		filter_dead: "true",
		license_type: "commercial,modification"
	}).toString();
	const response = await fetchImpl(searchUrl.toString(), {
		headers: { Accept: "application/json" },
		signal: abortSignal
	});
	if (!response.ok) throw new Error(`Openverse 图片搜索失败 (${response.status})`);
	const parsed = openverseSearchResponseSchema.safeParse(await response.json());
	if (!parsed.success) throw new Error("Openverse 返回的图片搜索结果格式无效");
	return parsed.data.results.filter((candidate) => candidate.mature !== true);
}
function matchesOrientation(candidate, orientation) {
	if (!orientation || !candidate.width || !candidate.height) return false;
	const ratio = candidate.width / candidate.height;
	if (orientation === "square") return ratio >= .8 && ratio <= 1.25;
	return orientation === "landscape" ? ratio > 1.25 : ratio < .8;
}
async function findDownloadableOpenverseImage(query, options = {}) {
	const { getCliDesktopAcceptanceImage } = await import("./CliDesktopAcceptanceAdapter-D37OWigR.mjs");
	const acceptanceImage = getCliDesktopAcceptanceImage();
	if (acceptanceImage) return {
		candidate: {
			id: "desktop-acceptance",
			title: "Desktop acceptance image",
			creator: "Project Graph",
			url: "https://example.invalid/desktop-acceptance.png",
			foreign_landing_url: "https://example.invalid/desktop-acceptance",
			license: "cc0",
			license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
			width: 32,
			height: 16,
			mature: false
		},
		image: options.transform ? await options.transform(acceptanceImage) : acceptanceImage
	};
	const fetchImpl = options.fetchImpl ?? fetch;
	const orderedCandidates = [...await searchOpenverseImages(query, fetchImpl, options.abortSignal)].sort((left, right) => Number(matchesOrientation(right, options.orientation)) - Number(matchesOrientation(left, options.orientation)));
	const failures = [];
	const retryBudget = { remaining: MAX_DOWNLOAD_RETRIES };
	for (const candidate of orderedCandidates) try {
		const blob = await downloadRemoteImageWithBudget(candidate.url, {
			fetchImpl,
			abortSignal: options.abortSignal,
			retryDelay: options.retryDelay
		}, retryBudget);
		return {
			candidate,
			image: options.transform ? await options.transform(blob) : blob
		};
	} catch (error) {
		if (options.abortSignal?.aborted) throw error;
		failures.push(error);
	}
	throw new AggregateError(failures, `没有找到可下载的 Openverse 图片（共检查 ${orderedCandidates.length} 个结果）`);
}
//#endregion
export { assertSafeRemoteImageUrl, downloadRemoteImage, findDownloadableOpenverseImage, searchOpenverseImages };
