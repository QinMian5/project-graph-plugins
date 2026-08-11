import { i as __toESM, t as __commonJSMin } from "./chunk-2rV9d50f.mjs";
import { C as object$1, D as string, E as strictObject, O as union, S as number, T as record, _ as discriminatedUnion, d as _null, f as any, g as custom, h as boolean, k as unknown, l as _enum, p as array$1, u as _instanceof, v as lazy, x as never, y as literal } from "./v4-DD_PkrNo.mjs";
import { A as normalizeHeaders, B as validateDownloadUrl, C as isAbortError, E as isUrlSupported, F as readResponseWithSizeLimit, G as AISDKError, H as withUserAgentSuffix, I as resolve, J as InvalidArgumentError$1, K as APICallError, L as safeParseJSON, O as lazySchema, P as postJsonToApi, R as safeValidateTypes, S as getRuntimeEnvironmentUserAgent, U as withoutTrailingSlash, V as validateTypes, W as zodSchema, Y as InvalidPromptError, Z as JSONParseError, a as combineHeaders, at as getErrorMessage, b as getErrorMessage$1, d as createIdGenerator, f as createJsonErrorResponseHandler, h as delay, i as asSchema, it as UnsupportedFunctionalityError, j as parseJsonEventStream, k as loadOptionalSetting, l as convertUint8ArrayToBase64, m as createProviderToolFactoryWithOutputSchema, n as DelayedPromise, o as convertBase64ToUint8Array, ot as isJSONArray, p as createJsonResponseHandler, r as DownloadError, rt as TypeValidationError, st as isJSONObject, t as DEFAULT_MAX_DOWNLOAD_SIZE, tt as NoSuchModelError, u as createEventSourceResponseHandler, v as executeTool, w as isNonNullable, x as getFromApi, y as generateId } from "./dist-DyFtByzE.mjs";
import { n as require_auth_errors, r as require_token_error, t as require_token_util } from "./token-util-BCnwXqAs.mjs";
//#region ../node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-context.js
var require_get_context = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var get_context_exports = {};
	__export(get_context_exports, {
		SYMBOL_FOR_REQ_CONTEXT: () => SYMBOL_FOR_REQ_CONTEXT,
		getContext: () => getContext
	});
	module.exports = __toCommonJS(get_context_exports);
	var SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
	function getContext() {
		return globalThis[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
	}
	0 && (module.exports = {
		SYMBOL_FOR_REQ_CONTEXT,
		getContext
	});
}));
//#endregion
//#region ../node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js
var require_get_vercel_oidc_token = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var get_vercel_oidc_token_exports = {};
	__export(get_vercel_oidc_token_exports, {
		getVercelOidcToken: () => getVercelOidcToken,
		getVercelOidcTokenSync: () => getVercelOidcTokenSync
	});
	module.exports = __toCommonJS(get_vercel_oidc_token_exports);
	var import_get_context = require_get_context();
	var import_token_error = require_token_error();
	async function getVercelOidcToken(options) {
		let token = "";
		let err;
		try {
			token = getVercelOidcTokenSync();
		} catch (error) {
			err = error;
		}
		try {
			const [{ getTokenPayload, isExpired }, { refreshToken }] = await Promise.all([await import("./token-util-Cb_a2vPI.mjs").then((m) => /* @__PURE__ */ __toESM(m.default)), await import("./token-9W3c-wi4.mjs").then((m) => /* @__PURE__ */ __toESM(m.default))]);
			if (!token || isExpired(getTokenPayload(token), options?.expirationBufferMs)) {
				await refreshToken(options);
				token = getVercelOidcTokenSync();
			}
		} catch (error) {
			let message = err instanceof Error ? err.message : "";
			if (error instanceof Error) message = `${message}
${error.message}`;
			if (message) throw new import_token_error.VercelOidcTokenError(message);
			throw error;
		}
		return token;
	}
	function getVercelOidcTokenSync() {
		const token = (0, import_get_context.getContext)().headers?.["x-vercel-oidc-token"] ?? process.env.VERCEL_OIDC_TOKEN;
		if (!token) throw new Error(`The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?`);
		return token;
	}
	0 && (module.exports = {
		getVercelOidcToken,
		getVercelOidcTokenSync
	});
}));
//#endregion
//#region ../node_modules/.pnpm/@ai-sdk+gateway@3.0.109_zod@4.4.3/node_modules/@ai-sdk/gateway/dist/index.mjs
var import_dist = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var src_exports = {};
	__export(src_exports, {
		AccessTokenMissingError: () => import_auth_errors.AccessTokenMissingError,
		RefreshAccessTokenFailedError: () => import_auth_errors.RefreshAccessTokenFailedError,
		getContext: () => import_get_context.getContext,
		getVercelOidcToken: () => import_get_vercel_oidc_token.getVercelOidcToken,
		getVercelOidcTokenSync: () => import_get_vercel_oidc_token.getVercelOidcTokenSync,
		getVercelToken: () => import_token_util.getVercelToken
	});
	module.exports = __toCommonJS(src_exports);
	var import_get_vercel_oidc_token = require_get_vercel_oidc_token();
	var import_get_context = require_get_context();
	var import_auth_errors = require_auth_errors();
	var import_token_util = require_token_util();
	0 && (module.exports = {
		AccessTokenMissingError,
		RefreshAccessTokenFailedError,
		getContext,
		getVercelOidcToken,
		getVercelOidcTokenSync,
		getVercelToken
	});
})))();
var symbol$1 = Symbol.for("vercel.ai.gateway.error");
var _a$1, _b;
var GatewayError = class _GatewayError extends (_b = Error, _a$1 = symbol$1, _b) {
	constructor({ message, statusCode = 500, cause, generationId }) {
		super(generationId ? `${message} [${generationId}]` : message);
		this[_a$1] = true;
		this.statusCode = statusCode;
		this.cause = cause;
		this.generationId = generationId;
	}
	/**
	* Checks if the given error is a Gateway Error.
	* @param {unknown} error - The error to check.
	* @returns {boolean} True if the error is a Gateway Error, false otherwise.
	*/
	static isInstance(error) {
		return _GatewayError.hasMarker(error);
	}
	static hasMarker(error) {
		return typeof error === "object" && error !== null && symbol$1 in error && error[symbol$1] === true;
	}
};
var name$1 = "GatewayAuthenticationError";
var marker2$1 = `vercel.ai.gateway.error.${name$1}`;
var symbol2$1 = Symbol.for(marker2$1);
var _a2$1, _b2;
var GatewayAuthenticationError = class _GatewayAuthenticationError extends (_b2 = GatewayError, _a2$1 = symbol2$1, _b2) {
	constructor({ message = "Authentication failed", statusCode = 401, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a2$1] = true;
		this.name = name$1;
		this.type = "authentication_error";
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol2$1 in error;
	}
	/**
	* Creates a contextual error message when authentication fails
	*/
	static createContextualError({ apiKeyProvided, oidcTokenProvided, message = "Authentication failed", statusCode = 401, cause, generationId }) {
		let contextualMessage;
		if (apiKeyProvided) contextualMessage = `AI Gateway authentication failed: Invalid API key.

Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys

Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.`;
		else if (oidcTokenProvided) contextualMessage = `AI Gateway authentication failed: Invalid OIDC token.

Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.

Alternatively, use an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys`;
		else contextualMessage = `AI Gateway authentication failed: No authentication provided.

Option 1 - API key:
Create an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.

Option 2 - OIDC token:
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`;
		return new _GatewayAuthenticationError({
			message: contextualMessage,
			statusCode,
			cause,
			generationId
		});
	}
};
var name2$1 = "GatewayInvalidRequestError";
var marker3$1 = `vercel.ai.gateway.error.${name2$1}`;
var symbol3$1 = Symbol.for(marker3$1);
var _a3$1, _b3;
var GatewayInvalidRequestError = class extends (_b3 = GatewayError, _a3$1 = symbol3$1, _b3) {
	constructor({ message = "Invalid request", statusCode = 400, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a3$1] = true;
		this.name = name2$1;
		this.type = "invalid_request_error";
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol3$1 in error;
	}
};
var name3$1 = "GatewayRateLimitError";
var marker4$1 = `vercel.ai.gateway.error.${name3$1}`;
var symbol4$1 = Symbol.for(marker4$1);
var _a4$1, _b4;
var GatewayRateLimitError = class extends (_b4 = GatewayError, _a4$1 = symbol4$1, _b4) {
	constructor({ message = "Rate limit exceeded", statusCode = 429, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a4$1] = true;
		this.name = name3$1;
		this.type = "rate_limit_exceeded";
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol4$1 in error;
	}
};
var name4$1 = "GatewayModelNotFoundError";
var marker5$1 = `vercel.ai.gateway.error.${name4$1}`;
var symbol5$1 = Symbol.for(marker5$1);
var modelNotFoundParamSchema = lazySchema(() => zodSchema(object$1({ modelId: string() })));
var _a5$1, _b5;
var GatewayModelNotFoundError = class extends (_b5 = GatewayError, _a5$1 = symbol5$1, _b5) {
	constructor({ message = "Model not found", statusCode = 404, modelId, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a5$1] = true;
		this.name = name4$1;
		this.type = "model_not_found";
		this.modelId = modelId;
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol5$1 in error;
	}
};
var name5$1 = "GatewayInternalServerError";
var marker6$1 = `vercel.ai.gateway.error.${name5$1}`;
var symbol6$1 = Symbol.for(marker6$1);
var _a6$1, _b6;
var GatewayInternalServerError = class extends (_b6 = GatewayError, _a6$1 = symbol6$1, _b6) {
	constructor({ message = "Internal server error", statusCode = 500, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a6$1] = true;
		this.name = name5$1;
		this.type = "internal_server_error";
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol6$1 in error;
	}
};
var name6$1 = "GatewayResponseError";
var marker7$1 = `vercel.ai.gateway.error.${name6$1}`;
var symbol7$1 = Symbol.for(marker7$1);
var _a7$1, _b7;
var GatewayResponseError = class extends (_b7 = GatewayError, _a7$1 = symbol7$1, _b7) {
	constructor({ message = "Invalid response from Gateway", statusCode = 502, response, validationError, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a7$1] = true;
		this.name = name6$1;
		this.type = "response_error";
		this.response = response;
		this.validationError = validationError;
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol7$1 in error;
	}
};
async function createGatewayErrorFromResponse({ response, statusCode, defaultMessage = "Gateway request failed", cause, authMethod }) {
	var _a9;
	const parseResult = await safeValidateTypes({
		value: response,
		schema: gatewayErrorResponseSchema
	});
	if (!parseResult.success) {
		const rawGenerationId = typeof response === "object" && response !== null && "generationId" in response ? response.generationId : void 0;
		return new GatewayResponseError({
			message: `Invalid error response format: ${defaultMessage}`,
			statusCode,
			response,
			validationError: parseResult.error,
			cause,
			generationId: rawGenerationId
		});
	}
	const validatedResponse = parseResult.value;
	const errorType = validatedResponse.error.type;
	const message = validatedResponse.error.message;
	const generationId = (_a9 = validatedResponse.generationId) != null ? _a9 : void 0;
	switch (errorType) {
		case "authentication_error": return GatewayAuthenticationError.createContextualError({
			apiKeyProvided: authMethod === "api-key",
			oidcTokenProvided: authMethod === "oidc",
			statusCode,
			cause,
			generationId
		});
		case "invalid_request_error": return new GatewayInvalidRequestError({
			message,
			statusCode,
			cause,
			generationId
		});
		case "rate_limit_exceeded": return new GatewayRateLimitError({
			message,
			statusCode,
			cause,
			generationId
		});
		case "model_not_found": {
			const modelResult = await safeValidateTypes({
				value: validatedResponse.error.param,
				schema: modelNotFoundParamSchema
			});
			return new GatewayModelNotFoundError({
				message,
				statusCode,
				modelId: modelResult.success ? modelResult.value.modelId : void 0,
				cause,
				generationId
			});
		}
		case "internal_server_error": return new GatewayInternalServerError({
			message,
			statusCode,
			cause,
			generationId
		});
		default: return new GatewayInternalServerError({
			message,
			statusCode,
			cause,
			generationId
		});
	}
}
var gatewayErrorResponseSchema = lazySchema(() => zodSchema(object$1({
	error: object$1({
		message: string(),
		type: string().nullish(),
		param: unknown().nullish(),
		code: union([string(), number()]).nullish()
	}),
	generationId: string().nullish()
})));
function extractApiCallResponse(error) {
	if (error.data !== void 0) return error.data;
	if (error.responseBody != null) try {
		return JSON.parse(error.responseBody);
	} catch (e) {
		return error.responseBody;
	}
	return {};
}
var name7$1 = "GatewayTimeoutError";
var marker8$1 = `vercel.ai.gateway.error.${name7$1}`;
var symbol8$1 = Symbol.for(marker8$1);
var _a8$1, _b8;
var GatewayTimeoutError = class _GatewayTimeoutError extends (_b8 = GatewayError, _a8$1 = symbol8$1, _b8) {
	constructor({ message = "Request timed out", statusCode = 408, cause, generationId } = {}) {
		super({
			message,
			statusCode,
			cause,
			generationId
		});
		this[_a8$1] = true;
		this.name = name7$1;
		this.type = "timeout_error";
	}
	static isInstance(error) {
		return GatewayError.hasMarker(error) && symbol8$1 in error;
	}
	/**
	* Creates a helpful timeout error message with troubleshooting guidance
	*/
	static createTimeoutError({ originalMessage, statusCode = 408, cause, generationId }) {
		return new _GatewayTimeoutError({
			message: `Gateway request timed out: ${originalMessage}

    This is a client-side timeout. To resolve this, increase your timeout configuration: https://vercel.com/docs/ai-gateway/capabilities/video-generation#extending-timeouts-for-node.js`,
			statusCode,
			cause,
			generationId
		});
	}
};
function isTimeoutError(error) {
	if (!(error instanceof Error)) return false;
	const errorCode = error.code;
	if (typeof errorCode === "string") return [
		"UND_ERR_HEADERS_TIMEOUT",
		"UND_ERR_BODY_TIMEOUT",
		"UND_ERR_CONNECT_TIMEOUT"
	].includes(errorCode);
	return false;
}
async function asGatewayError(error, authMethod) {
	var _a9;
	if (GatewayError.isInstance(error)) return error;
	if (isTimeoutError(error)) return GatewayTimeoutError.createTimeoutError({
		originalMessage: error instanceof Error ? error.message : "Unknown error",
		cause: error
	});
	if (APICallError.isInstance(error)) {
		if (error.cause && isTimeoutError(error.cause)) return GatewayTimeoutError.createTimeoutError({
			originalMessage: error.message,
			cause: error
		});
		return await createGatewayErrorFromResponse({
			response: extractApiCallResponse(error),
			statusCode: (_a9 = error.statusCode) != null ? _a9 : 500,
			defaultMessage: "Gateway request failed",
			cause: error,
			authMethod
		});
	}
	return await createGatewayErrorFromResponse({
		response: {},
		statusCode: 500,
		defaultMessage: error instanceof Error ? `Gateway request failed: ${error.message}` : "Unknown Gateway error",
		cause: error,
		authMethod
	});
}
var GATEWAY_AUTH_METHOD_HEADER = "ai-gateway-auth-method";
async function parseAuthMethod(headers) {
	const result = await safeValidateTypes({
		value: headers[GATEWAY_AUTH_METHOD_HEADER],
		schema: gatewayAuthMethodSchema
	});
	return result.success ? result.value : void 0;
}
var gatewayAuthMethodSchema = lazySchema(() => zodSchema(union([literal("api-key"), literal("oidc")])));
var KNOWN_MODEL_TYPES = [
	"embedding",
	"image",
	"language",
	"reranking",
	"video"
];
var GatewayFetchMetadata = class {
	constructor(config) {
		this.config = config;
	}
	async getAvailableModels() {
		try {
			const { value } = await getFromApi({
				url: `${this.config.baseURL}/config`,
				headers: await resolve(this.config.headers()),
				successfulResponseHandler: createJsonResponseHandler(gatewayAvailableModelsResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				fetch: this.config.fetch
			});
			return value;
		} catch (error) {
			throw await asGatewayError(error);
		}
	}
	async getCredits() {
		try {
			const { value } = await getFromApi({
				url: `${new URL(this.config.baseURL).origin}/v1/credits`,
				headers: await resolve(this.config.headers()),
				successfulResponseHandler: createJsonResponseHandler(gatewayCreditsResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				fetch: this.config.fetch
			});
			return value;
		} catch (error) {
			throw await asGatewayError(error);
		}
	}
};
var gatewayAvailableModelsResponseSchema = lazySchema(() => zodSchema(object$1({ models: array$1(object$1({
	id: string(),
	name: string(),
	description: string().nullish(),
	pricing: object$1({
		input: string(),
		output: string(),
		input_cache_read: string().nullish(),
		input_cache_write: string().nullish()
	}).transform(({ input, output, input_cache_read, input_cache_write }) => ({
		input,
		output,
		...input_cache_read ? { cachedInputTokens: input_cache_read } : {},
		...input_cache_write ? { cacheCreationInputTokens: input_cache_write } : {}
	})).nullish(),
	specification: object$1({
		specificationVersion: literal("v3"),
		provider: string(),
		modelId: string()
	}),
	modelType: string().nullish()
})).transform((models) => models.filter((m) => m.modelType == null || KNOWN_MODEL_TYPES.includes(m.modelType))) })));
var gatewayCreditsResponseSchema = lazySchema(() => zodSchema(object$1({
	balance: string(),
	total_used: string()
}).transform(({ balance, total_used }) => ({
	balance,
	totalUsed: total_used
}))));
var GatewaySpendReport = class {
	constructor(config) {
		this.config = config;
	}
	async getSpendReport(params) {
		try {
			const baseUrl = new URL(this.config.baseURL);
			const searchParams = new URLSearchParams();
			searchParams.set("start_date", params.startDate);
			searchParams.set("end_date", params.endDate);
			if (params.groupBy) searchParams.set("group_by", params.groupBy);
			if (params.datePart) searchParams.set("date_part", params.datePart);
			if (params.userId) searchParams.set("user_id", params.userId);
			if (params.model) searchParams.set("model", params.model);
			if (params.provider) searchParams.set("provider", params.provider);
			if (params.credentialType) searchParams.set("credential_type", params.credentialType);
			if (params.tags && params.tags.length > 0) searchParams.set("tags", params.tags.join(","));
			const { value } = await getFromApi({
				url: `${baseUrl.origin}/v1/report?${searchParams.toString()}`,
				headers: await resolve(this.config.headers()),
				successfulResponseHandler: createJsonResponseHandler(gatewaySpendReportResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				fetch: this.config.fetch
			});
			return value;
		} catch (error) {
			throw await asGatewayError(error);
		}
	}
};
var gatewaySpendReportResponseSchema = lazySchema(() => zodSchema(object$1({ results: array$1(object$1({
	day: string().optional(),
	hour: string().optional(),
	user: string().optional(),
	model: string().optional(),
	tag: string().optional(),
	provider: string().optional(),
	credential_type: _enum(["byok", "system"]).optional(),
	total_cost: number(),
	market_cost: number().optional(),
	input_tokens: number().optional(),
	output_tokens: number().optional(),
	cached_input_tokens: number().optional(),
	cache_creation_input_tokens: number().optional(),
	reasoning_tokens: number().optional(),
	request_count: number().optional()
}).transform(({ credential_type, total_cost, market_cost, input_tokens, output_tokens, cached_input_tokens, cache_creation_input_tokens, reasoning_tokens, request_count, ...rest }) => ({
	...rest,
	...credential_type !== void 0 ? { credentialType: credential_type } : {},
	totalCost: total_cost,
	...market_cost !== void 0 ? { marketCost: market_cost } : {},
	...input_tokens !== void 0 ? { inputTokens: input_tokens } : {},
	...output_tokens !== void 0 ? { outputTokens: output_tokens } : {},
	...cached_input_tokens !== void 0 ? { cachedInputTokens: cached_input_tokens } : {},
	...cache_creation_input_tokens !== void 0 ? { cacheCreationInputTokens: cache_creation_input_tokens } : {},
	...reasoning_tokens !== void 0 ? { reasoningTokens: reasoning_tokens } : {},
	...request_count !== void 0 ? { requestCount: request_count } : {}
}))) })));
var GatewayGenerationInfoFetcher = class {
	constructor(config) {
		this.config = config;
	}
	async getGenerationInfo(params) {
		try {
			const { value } = await getFromApi({
				url: `${new URL(this.config.baseURL).origin}/v1/generation?id=${encodeURIComponent(params.id)}`,
				headers: await resolve(this.config.headers()),
				successfulResponseHandler: createJsonResponseHandler(gatewayGenerationInfoResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				fetch: this.config.fetch
			});
			return value;
		} catch (error) {
			throw await asGatewayError(error);
		}
	}
};
var gatewayGenerationInfoResponseSchema = lazySchema(() => zodSchema(object$1({ data: object$1({
	id: string(),
	total_cost: number(),
	upstream_inference_cost: number(),
	usage: number(),
	created_at: string(),
	model: string(),
	is_byok: boolean(),
	provider_name: string(),
	streamed: boolean(),
	finish_reason: string(),
	latency: number(),
	generation_time: number(),
	native_tokens_prompt: number(),
	native_tokens_completion: number(),
	native_tokens_reasoning: number(),
	native_tokens_cached: number(),
	native_tokens_cache_creation: number(),
	billable_web_search_calls: number()
}).transform(({ total_cost, upstream_inference_cost, created_at, is_byok, provider_name, finish_reason, generation_time, native_tokens_prompt, native_tokens_completion, native_tokens_reasoning, native_tokens_cached, native_tokens_cache_creation, billable_web_search_calls, ...rest }) => ({
	...rest,
	totalCost: total_cost,
	upstreamInferenceCost: upstream_inference_cost,
	createdAt: created_at,
	isByok: is_byok,
	providerName: provider_name,
	finishReason: finish_reason,
	generationTime: generation_time,
	promptTokens: native_tokens_prompt,
	completionTokens: native_tokens_completion,
	reasoningTokens: native_tokens_reasoning,
	cachedTokens: native_tokens_cached,
	cacheCreationTokens: native_tokens_cache_creation,
	billableWebSearchCalls: billable_web_search_calls
})) }).transform(({ data }) => data)));
var GatewayLanguageModel = class {
	constructor(modelId, config) {
		this.modelId = modelId;
		this.config = config;
		this.specificationVersion = "v3";
		this.supportedUrls = { "*/*": [/.*/] };
	}
	get provider() {
		return this.config.provider;
	}
	async getArgs(options) {
		const { abortSignal: _abortSignal, ...optionsWithoutSignal } = options;
		return {
			args: this.maybeEncodeFileParts(optionsWithoutSignal),
			warnings: []
		};
	}
	async doGenerate(options) {
		const { args, warnings } = await this.getArgs(options);
		const { abortSignal } = options;
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { responseHeaders, value: responseBody, rawValue: rawResponse } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, options.headers, this.getModelConfigHeaders(this.modelId, false), await resolve(this.config.o11yHeaders)),
				body: args,
				successfulResponseHandler: createJsonResponseHandler(any()),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				...responseBody,
				request: { body: args },
				response: {
					headers: responseHeaders,
					body: rawResponse
				},
				warnings
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	async doStream(options) {
		const { args, warnings } = await this.getArgs(options);
		const { abortSignal } = options;
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { value: response, responseHeaders } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, options.headers, this.getModelConfigHeaders(this.modelId, true), await resolve(this.config.o11yHeaders)),
				body: args,
				successfulResponseHandler: createEventSourceResponseHandler(any()),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				stream: response.pipeThrough(new TransformStream({
					start(controller) {
						if (warnings.length > 0) controller.enqueue({
							type: "stream-start",
							warnings
						});
					},
					transform(chunk, controller) {
						if (chunk.success) {
							const streamPart = chunk.value;
							if (streamPart.type === "raw" && !options.includeRawChunks) return;
							if (streamPart.type === "response-metadata" && streamPart.timestamp && typeof streamPart.timestamp === "string") streamPart.timestamp = new Date(streamPart.timestamp);
							controller.enqueue(streamPart);
						} else controller.error(chunk.error);
					}
				})),
				request: { body: args },
				response: { headers: responseHeaders }
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	isFilePart(part) {
		return part && typeof part === "object" && "type" in part && part.type === "file";
	}
	/**
	* Encodes file parts in the prompt to base64. Mutates the passed options
	* instance directly to avoid copying the file data.
	* @param options - The options to encode.
	* @returns The options with the file parts encoded.
	*/
	maybeEncodeFileParts(options) {
		for (const message of options.prompt) for (const part of message.content) if (this.isFilePart(part)) {
			const filePart = part;
			if (filePart.data instanceof Uint8Array) {
				const buffer = Uint8Array.from(filePart.data);
				const base64Data = Buffer.from(buffer).toString("base64");
				filePart.data = new URL(`data:${filePart.mediaType || "application/octet-stream"};base64,${base64Data}`);
			}
		}
		return options;
	}
	getUrl() {
		return `${this.config.baseURL}/language-model`;
	}
	getModelConfigHeaders(modelId, streaming) {
		return {
			"ai-language-model-specification-version": "3",
			"ai-language-model-id": modelId,
			"ai-language-model-streaming": String(streaming)
		};
	}
};
var GatewayEmbeddingModel = class {
	constructor(modelId, config) {
		this.modelId = modelId;
		this.config = config;
		this.specificationVersion = "v3";
		this.maxEmbeddingsPerCall = 2048;
		this.supportsParallelCalls = true;
	}
	get provider() {
		return this.config.provider;
	}
	async doEmbed({ values, headers, abortSignal, providerOptions }) {
		var _a9;
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { responseHeaders, value: responseBody, rawValue } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await resolve(this.config.o11yHeaders)),
				body: {
					values,
					...providerOptions ? { providerOptions } : {}
				},
				successfulResponseHandler: createJsonResponseHandler(gatewayEmbeddingResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				embeddings: responseBody.embeddings,
				usage: (_a9 = responseBody.usage) != null ? _a9 : void 0,
				providerMetadata: responseBody.providerMetadata,
				response: {
					headers: responseHeaders,
					body: rawValue
				},
				warnings: []
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	getUrl() {
		return `${this.config.baseURL}/embedding-model`;
	}
	getModelConfigHeaders() {
		return {
			"ai-embedding-model-specification-version": "3",
			"ai-model-id": this.modelId
		};
	}
};
var gatewayEmbeddingResponseSchema = lazySchema(() => zodSchema(object$1({
	embeddings: array$1(array$1(number())),
	usage: object$1({ tokens: number() }).nullish(),
	providerMetadata: record(string(), record(string(), unknown())).optional()
})));
var GatewayImageModel = class {
	constructor(modelId, config) {
		this.modelId = modelId;
		this.config = config;
		this.specificationVersion = "v3";
		this.maxImagesPerCall = Number.MAX_SAFE_INTEGER;
	}
	get provider() {
		return this.config.provider;
	}
	async doGenerate({ prompt, n, size, aspectRatio, seed, files, mask, providerOptions, headers, abortSignal }) {
		var _a9, _b9, _c, _d;
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { responseHeaders, value: responseBody, rawValue } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await resolve(this.config.o11yHeaders)),
				body: {
					prompt,
					n,
					...size && { size },
					...aspectRatio && { aspectRatio },
					...seed && { seed },
					...providerOptions && { providerOptions },
					...files && { files: files.map((file) => maybeEncodeImageFile(file)) },
					...mask && { mask: maybeEncodeImageFile(mask) }
				},
				successfulResponseHandler: createJsonResponseHandler(gatewayImageResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				images: responseBody.images,
				warnings: (_a9 = responseBody.warnings) != null ? _a9 : [],
				providerMetadata: responseBody.providerMetadata,
				response: {
					timestamp: /* @__PURE__ */ new Date(),
					modelId: this.modelId,
					headers: responseHeaders
				},
				...responseBody.usage != null && { usage: {
					inputTokens: (_b9 = responseBody.usage.inputTokens) != null ? _b9 : void 0,
					outputTokens: (_c = responseBody.usage.outputTokens) != null ? _c : void 0,
					totalTokens: (_d = responseBody.usage.totalTokens) != null ? _d : void 0
				} }
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	getUrl() {
		return `${this.config.baseURL}/image-model`;
	}
	getModelConfigHeaders() {
		return {
			"ai-image-model-specification-version": "3",
			"ai-model-id": this.modelId
		};
	}
};
function maybeEncodeImageFile(file) {
	if (file.type === "file" && file.data instanceof Uint8Array) return {
		...file,
		data: convertUint8ArrayToBase64(file.data)
	};
	return file;
}
var providerMetadataEntrySchema = object$1({ images: array$1(unknown()).optional() }).catchall(unknown());
var gatewayImageWarningSchema = discriminatedUnion("type", [
	object$1({
		type: literal("unsupported"),
		feature: string(),
		details: string().optional()
	}),
	object$1({
		type: literal("compatibility"),
		feature: string(),
		details: string().optional()
	}),
	object$1({
		type: literal("other"),
		message: string()
	})
]);
var gatewayImageUsageSchema = object$1({
	inputTokens: number().nullish(),
	outputTokens: number().nullish(),
	totalTokens: number().nullish()
});
var gatewayImageResponseSchema = object$1({
	images: array$1(string()),
	warnings: array$1(gatewayImageWarningSchema).optional(),
	providerMetadata: record(string(), providerMetadataEntrySchema).optional(),
	usage: gatewayImageUsageSchema.optional()
});
var GatewayVideoModel = class {
	constructor(modelId, config) {
		this.modelId = modelId;
		this.config = config;
		this.specificationVersion = "v3";
		this.maxVideosPerCall = Number.MAX_SAFE_INTEGER;
	}
	get provider() {
		return this.config.provider;
	}
	async doGenerate({ prompt, n, aspectRatio, resolution, duration, fps, seed, image, providerOptions, headers, abortSignal }) {
		var _a9;
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { responseHeaders, value: responseBody } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await resolve(this.config.o11yHeaders), { accept: "text/event-stream" }),
				body: {
					prompt,
					n,
					...aspectRatio && { aspectRatio },
					...resolution && { resolution },
					...duration && { duration },
					...fps && { fps },
					...seed && { seed },
					...providerOptions && { providerOptions },
					...image && { image: maybeEncodeVideoFile(image) }
				},
				successfulResponseHandler: async ({ response, url, requestBodyValues }) => {
					if (response.body == null) throw new APICallError({
						message: "SSE response body is empty",
						url,
						requestBodyValues,
						statusCode: response.status
					});
					const reader = parseJsonEventStream({
						stream: response.body,
						schema: gatewayVideoEventSchema
					}).getReader();
					const { done, value: parseResult } = await reader.read();
					reader.releaseLock();
					if (done || !parseResult) throw new APICallError({
						message: "SSE stream ended without a data event",
						url,
						requestBodyValues,
						statusCode: response.status
					});
					if (!parseResult.success) throw new APICallError({
						message: "Failed to parse video SSE event",
						cause: parseResult.error,
						url,
						requestBodyValues,
						statusCode: response.status
					});
					const event = parseResult.value;
					if (event.type === "error") throw new APICallError({
						message: event.message,
						statusCode: event.statusCode,
						url,
						requestBodyValues,
						responseHeaders: Object.fromEntries([...response.headers]),
						responseBody: JSON.stringify(event),
						data: { error: {
							message: event.message,
							type: event.errorType,
							param: event.param
						} }
					});
					return {
						value: {
							videos: event.videos,
							warnings: event.warnings,
							providerMetadata: event.providerMetadata
						},
						responseHeaders: Object.fromEntries([...response.headers])
					};
				},
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				videos: responseBody.videos,
				warnings: (_a9 = responseBody.warnings) != null ? _a9 : [],
				providerMetadata: responseBody.providerMetadata,
				response: {
					timestamp: /* @__PURE__ */ new Date(),
					modelId: this.modelId,
					headers: responseHeaders
				}
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	getUrl() {
		return `${this.config.baseURL}/video-model`;
	}
	getModelConfigHeaders() {
		return {
			"ai-video-model-specification-version": "3",
			"ai-model-id": this.modelId
		};
	}
};
function maybeEncodeVideoFile(file) {
	if (file.type === "file" && file.data instanceof Uint8Array) return {
		...file,
		data: convertUint8ArrayToBase64(file.data)
	};
	return file;
}
var providerMetadataEntrySchema2 = object$1({ videos: array$1(unknown()).optional() }).catchall(unknown());
var gatewayVideoDataSchema = union([object$1({
	type: literal("url"),
	url: string(),
	mediaType: string()
}), object$1({
	type: literal("base64"),
	data: string(),
	mediaType: string()
})]);
var gatewayVideoWarningSchema = discriminatedUnion("type", [
	object$1({
		type: literal("unsupported"),
		feature: string(),
		details: string().optional()
	}),
	object$1({
		type: literal("compatibility"),
		feature: string(),
		details: string().optional()
	}),
	object$1({
		type: literal("other"),
		message: string()
	})
]);
var gatewayVideoEventSchema = discriminatedUnion("type", [object$1({
	type: literal("result"),
	videos: array$1(gatewayVideoDataSchema),
	warnings: array$1(gatewayVideoWarningSchema).optional(),
	providerMetadata: record(string(), providerMetadataEntrySchema2).optional()
}), object$1({
	type: literal("error"),
	message: string(),
	errorType: string(),
	statusCode: number(),
	param: unknown().nullable()
})]);
var GatewayRerankingModel = class {
	constructor(modelId, config) {
		this.modelId = modelId;
		this.config = config;
		this.specificationVersion = "v3";
	}
	get provider() {
		return this.config.provider;
	}
	async doRerank({ documents, query, topN, headers, abortSignal, providerOptions }) {
		const resolvedHeaders = await resolve(this.config.headers());
		try {
			const { responseHeaders, value: responseBody, rawValue } = await postJsonToApi({
				url: this.getUrl(),
				headers: combineHeaders(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await resolve(this.config.o11yHeaders)),
				body: {
					documents,
					query,
					...topN != null ? { topN } : {},
					...providerOptions ? { providerOptions } : {}
				},
				successfulResponseHandler: createJsonResponseHandler(gatewayRerankingResponseSchema),
				failedResponseHandler: createJsonErrorResponseHandler({
					errorSchema: any(),
					errorToMessage: (data) => data
				}),
				...abortSignal && { abortSignal },
				fetch: this.config.fetch
			});
			return {
				ranking: responseBody.ranking,
				providerMetadata: responseBody.providerMetadata,
				response: {
					headers: responseHeaders,
					body: rawValue
				},
				warnings: []
			};
		} catch (error) {
			throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
		}
	}
	getUrl() {
		return `${this.config.baseURL}/reranking-model`;
	}
	getModelConfigHeaders() {
		return {
			"ai-reranking-model-specification-version": "3",
			"ai-model-id": this.modelId
		};
	}
};
var gatewayRerankingResponseSchema = lazySchema(() => zodSchema(object$1({
	ranking: array$1(object$1({
		index: number(),
		relevanceScore: number()
	})),
	providerMetadata: record(string(), record(string(), unknown())).optional()
})));
var parallelSearchToolFactory = createProviderToolFactoryWithOutputSchema({
	id: "gateway.parallel_search",
	inputSchema: lazySchema(() => zodSchema(object$1({
		objective: string().describe("Natural-language description of the web research goal, including source or freshness guidance and broader context from the task. Maximum 5000 characters."),
		search_queries: array$1(string()).optional().describe("Optional search queries to supplement the objective. Maximum 200 characters per query."),
		mode: _enum(["one-shot", "agentic"]).optional().describe("Mode preset: \"one-shot\" for comprehensive results with longer excerpts (default), \"agentic\" for concise, token-efficient results for multi-step workflows."),
		max_results: number().optional().describe("Maximum number of results to return (1-20). Defaults to 10 if not specified."),
		source_policy: object$1({
			include_domains: array$1(string()).optional().describe("List of domains to include in search results."),
			exclude_domains: array$1(string()).optional().describe("List of domains to exclude from search results."),
			after_date: string().optional().describe("Only include results published after this date (ISO 8601 format).")
		}).optional().describe("Source policy for controlling which domains to include/exclude and freshness."),
		excerpts: object$1({
			max_chars_per_result: number().optional().describe("Maximum characters per result."),
			max_chars_total: number().optional().describe("Maximum total characters across all results.")
		}).optional().describe("Excerpt configuration for controlling result length."),
		fetch_policy: object$1({ max_age_seconds: number().optional().describe("Maximum age in seconds for cached content. Set to 0 to always fetch fresh content.") }).optional().describe("Fetch policy for controlling content freshness.")
	}))),
	outputSchema: lazySchema(() => zodSchema(union([object$1({
		searchId: string(),
		results: array$1(object$1({
			url: string(),
			title: string(),
			excerpt: string(),
			publishDate: string().nullable().optional(),
			relevanceScore: number().optional()
		}))
	}), object$1({
		error: _enum([
			"api_error",
			"rate_limit",
			"timeout",
			"invalid_input",
			"configuration_error",
			"unknown"
		]),
		statusCode: number().optional(),
		message: string()
	})])))
});
var parallelSearch = (config = {}) => parallelSearchToolFactory(config);
var perplexitySearchToolFactory = createProviderToolFactoryWithOutputSchema({
	id: "gateway.perplexity_search",
	inputSchema: lazySchema(() => zodSchema(object$1({
		query: union([string(), array$1(string())]).describe("Search query (string) or multiple queries (array of up to 5 strings). Multi-query searches return combined results from all queries."),
		max_results: number().optional().describe("Maximum number of search results to return (1-20, default: 10)"),
		max_tokens_per_page: number().optional().describe("Maximum number of tokens to extract per search result page (256-2048, default: 2048)"),
		max_tokens: number().optional().describe("Maximum total tokens across all search results (default: 25000, max: 1000000)"),
		country: string().optional().describe("Two-letter ISO 3166-1 alpha-2 country code for regional search results (e.g., 'US', 'GB', 'FR')"),
		search_domain_filter: array$1(string()).optional().describe("List of domains to include or exclude from search results (max 20). To include: ['nature.com', 'science.org']. To exclude: ['-example.com', '-spam.net']"),
		search_language_filter: array$1(string()).optional().describe("List of ISO 639-1 language codes to filter results (max 10, lowercase). Examples: ['en', 'fr', 'de']"),
		search_after_date: string().optional().describe("Include only results published after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."),
		search_before_date: string().optional().describe("Include only results published before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."),
		last_updated_after_filter: string().optional().describe("Include only results last updated after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."),
		last_updated_before_filter: string().optional().describe("Include only results last updated before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."),
		search_recency_filter: _enum([
			"day",
			"week",
			"month",
			"year"
		]).optional().describe("Filter results by relative time period. Cannot be used with search_after_date or search_before_date.")
	}))),
	outputSchema: lazySchema(() => zodSchema(union([object$1({
		results: array$1(object$1({
			title: string(),
			url: string(),
			snippet: string(),
			date: string().optional(),
			lastUpdated: string().optional()
		})),
		id: string()
	}), object$1({
		error: _enum([
			"api_error",
			"rate_limit",
			"timeout",
			"invalid_input",
			"unknown"
		]),
		statusCode: number().optional(),
		message: string()
	})])))
});
var perplexitySearch = (config = {}) => perplexitySearchToolFactory(config);
var gatewayTools = {
	/**
	* Search the web using Parallel AI's Search API for LLM-optimized excerpts.
	*
	* Takes a natural language objective and returns relevant excerpts,
	* replacing multiple keyword searches with a single call for broad
	* or complex queries. Supports different search types for depth vs
	* breadth tradeoffs.
	*/
	parallelSearch,
	/**
	* Search the web using Perplexity's Search API for real-time information,
	* news, research papers, and articles.
	*
	* Provides ranked search results with advanced filtering options including
	* domain, language, date range, and recency filters.
	*/
	perplexitySearch
};
async function getVercelRequestId() {
	var _a9;
	return (_a9 = (0, import_dist.getContext)().headers) == null ? void 0 : _a9["x-vercel-id"];
}
var VERSION$2 = "3.0.109";
var AI_GATEWAY_PROTOCOL_VERSION = "0.0.1";
function createGatewayProvider(options = {}) {
	var _a9, _b9;
	let pendingMetadata = null;
	let metadataCache = null;
	const cacheRefreshMillis = (_a9 = options.metadataCacheRefreshMillis) != null ? _a9 : 1e3 * 60 * 5;
	let lastFetchTime = 0;
	const baseURL = (_b9 = withoutTrailingSlash(options.baseURL)) != null ? _b9 : "https://ai-gateway.vercel.sh/v3/ai";
	const getHeaders = async () => {
		try {
			const auth = await getGatewayAuthToken(options);
			return withUserAgentSuffix({
				Authorization: `Bearer ${auth.token}`,
				"ai-gateway-protocol-version": AI_GATEWAY_PROTOCOL_VERSION,
				[GATEWAY_AUTH_METHOD_HEADER]: auth.authMethod,
				...options.headers
			}, `ai-sdk/gateway/${VERSION$2}`);
		} catch (error) {
			throw GatewayAuthenticationError.createContextualError({
				apiKeyProvided: false,
				oidcTokenProvided: false,
				statusCode: 401,
				cause: error
			});
		}
	};
	const createO11yHeaders = () => {
		const deploymentId = loadOptionalSetting({
			settingValue: void 0,
			environmentVariableName: "VERCEL_DEPLOYMENT_ID"
		});
		const environment = loadOptionalSetting({
			settingValue: void 0,
			environmentVariableName: "VERCEL_ENV"
		});
		const region = loadOptionalSetting({
			settingValue: void 0,
			environmentVariableName: "VERCEL_REGION"
		});
		const projectId = loadOptionalSetting({
			settingValue: void 0,
			environmentVariableName: "VERCEL_PROJECT_ID"
		});
		return async () => {
			const requestId = await getVercelRequestId();
			return {
				...deploymentId && { "ai-o11y-deployment-id": deploymentId },
				...environment && { "ai-o11y-environment": environment },
				...region && { "ai-o11y-region": region },
				...requestId && { "ai-o11y-request-id": requestId },
				...projectId && { "ai-o11y-project-id": projectId }
			};
		};
	};
	const createLanguageModel = (modelId) => {
		return new GatewayLanguageModel(modelId, {
			provider: "gateway",
			baseURL,
			headers: getHeaders,
			fetch: options.fetch,
			o11yHeaders: createO11yHeaders()
		});
	};
	const getAvailableModels = async () => {
		var _a10, _b10, _c;
		const now = (_c = (_b10 = (_a10 = options._internal) == null ? void 0 : _a10.currentDate) == null ? void 0 : _b10.call(_a10).getTime()) != null ? _c : Date.now();
		if (!pendingMetadata || now - lastFetchTime > cacheRefreshMillis) {
			lastFetchTime = now;
			pendingMetadata = new GatewayFetchMetadata({
				baseURL,
				headers: getHeaders,
				fetch: options.fetch
			}).getAvailableModels().then((metadata) => {
				metadataCache = metadata;
				return metadata;
			}).catch(async (error) => {
				throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
			});
		}
		return metadataCache ? Promise.resolve(metadataCache) : pendingMetadata;
	};
	const getCredits = async () => {
		return new GatewayFetchMetadata({
			baseURL,
			headers: getHeaders,
			fetch: options.fetch
		}).getCredits().catch(async (error) => {
			throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
		});
	};
	const getSpendReport = async (params) => {
		return new GatewaySpendReport({
			baseURL,
			headers: getHeaders,
			fetch: options.fetch
		}).getSpendReport(params).catch(async (error) => {
			throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
		});
	};
	const getGenerationInfo = async (params) => {
		return new GatewayGenerationInfoFetcher({
			baseURL,
			headers: getHeaders,
			fetch: options.fetch
		}).getGenerationInfo(params).catch(async (error) => {
			throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
		});
	};
	const provider = function(modelId) {
		if (new.target) throw new Error("The Gateway Provider model function cannot be called with the new keyword.");
		return createLanguageModel(modelId);
	};
	provider.specificationVersion = "v3";
	provider.getAvailableModels = getAvailableModels;
	provider.getCredits = getCredits;
	provider.getSpendReport = getSpendReport;
	provider.getGenerationInfo = getGenerationInfo;
	provider.imageModel = (modelId) => {
		return new GatewayImageModel(modelId, {
			provider: "gateway",
			baseURL,
			headers: getHeaders,
			fetch: options.fetch,
			o11yHeaders: createO11yHeaders()
		});
	};
	provider.languageModel = createLanguageModel;
	const createEmbeddingModel = (modelId) => {
		return new GatewayEmbeddingModel(modelId, {
			provider: "gateway",
			baseURL,
			headers: getHeaders,
			fetch: options.fetch,
			o11yHeaders: createO11yHeaders()
		});
	};
	provider.embeddingModel = createEmbeddingModel;
	provider.textEmbeddingModel = createEmbeddingModel;
	provider.videoModel = (modelId) => {
		return new GatewayVideoModel(modelId, {
			provider: "gateway",
			baseURL,
			headers: getHeaders,
			fetch: options.fetch,
			o11yHeaders: createO11yHeaders()
		});
	};
	const createRerankingModel = (modelId) => {
		return new GatewayRerankingModel(modelId, {
			provider: "gateway",
			baseURL,
			headers: getHeaders,
			fetch: options.fetch,
			o11yHeaders: createO11yHeaders()
		});
	};
	provider.rerankingModel = createRerankingModel;
	provider.reranking = createRerankingModel;
	provider.chat = provider.languageModel;
	provider.embedding = provider.embeddingModel;
	provider.image = provider.imageModel;
	provider.video = provider.videoModel;
	provider.tools = gatewayTools;
	return provider;
}
var gateway = createGatewayProvider();
async function getGatewayAuthToken(options) {
	const apiKey = loadOptionalSetting({
		settingValue: options.apiKey,
		environmentVariableName: "AI_GATEWAY_API_KEY"
	});
	if (apiKey) return {
		token: apiKey,
		authMethod: "api-key"
	};
	return {
		token: await (0, import_dist.getVercelOidcToken)(),
		authMethod: "oidc"
	};
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js
/** only globals that common to node and browsers are allowed */
var _globalThis = typeof globalThis === "object" ? globalThis : global;
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/version.js
var VERSION$1 = "1.9.0";
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/internal/semver.js
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
* Create a function to test an API version to see if it is compatible with the provided ownVersion.
*
* The returned function has the following semantics:
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param ownVersion version which should be checked against
*/
function _makeCompatibilityCheck(ownVersion) {
	var acceptedVersions = new Set([ownVersion]);
	var rejectedVersions = /* @__PURE__ */ new Set();
	var myVersionMatch = ownVersion.match(re);
	if (!myVersionMatch) return function() {
		return false;
	};
	var ownVersionParsed = {
		major: +myVersionMatch[1],
		minor: +myVersionMatch[2],
		patch: +myVersionMatch[3],
		prerelease: myVersionMatch[4]
	};
	if (ownVersionParsed.prerelease != null) return function isExactmatch(globalVersion) {
		return globalVersion === ownVersion;
	};
	function _reject(v) {
		rejectedVersions.add(v);
		return false;
	}
	function _accept(v) {
		acceptedVersions.add(v);
		return true;
	}
	return function isCompatible(globalVersion) {
		if (acceptedVersions.has(globalVersion)) return true;
		if (rejectedVersions.has(globalVersion)) return false;
		var globalVersionMatch = globalVersion.match(re);
		if (!globalVersionMatch) return _reject(globalVersion);
		var globalVersionParsed = {
			major: +globalVersionMatch[1],
			minor: +globalVersionMatch[2],
			patch: +globalVersionMatch[3],
			prerelease: globalVersionMatch[4]
		};
		if (globalVersionParsed.prerelease != null) return _reject(globalVersion);
		if (ownVersionParsed.major !== globalVersionParsed.major) return _reject(globalVersion);
		if (ownVersionParsed.major === 0) {
			if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) return _accept(globalVersion);
			return _reject(globalVersion);
		}
		if (ownVersionParsed.minor <= globalVersionParsed.minor) return _accept(globalVersion);
		return _reject(globalVersion);
	};
}
/**
* Test an API version to see if it is compatible with this API.
*
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param version version of the API requesting an instance of the global API
*/
var isCompatible = _makeCompatibilityCheck(VERSION$1);
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var major = VERSION$1.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
	var _a;
	if (allowOverride === void 0) allowOverride = false;
	var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : { version: VERSION$1 };
	if (!allowOverride && api[type]) {
		var err = /* @__PURE__ */ new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
		diag.error(err.stack || err.message);
		return false;
	}
	if (api.version !== "1.9.0") {
		var err = /* @__PURE__ */ new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION$1);
		diag.error(err.stack || err.message);
		return false;
	}
	api[type] = instance;
	diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION$1 + ".");
	return true;
}
function getGlobal(type) {
	var _a, _b;
	var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
	if (!globalVersion || !isCompatible(globalVersion)) return;
	return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
	diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION$1 + ".");
	var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api) delete api[type];
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var __read$3 = function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$3 = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
/**
* Component Logger which is meant to be used as part of any component which
* will add automatically additional namespace in front of the log message.
* It will then forward all message to global diag logger
* @example
* const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
* cLogger.debug('test');
* // @opentelemetry/instrumentation-http test
*/
var DiagComponentLogger = function() {
	function DiagComponentLogger(props) {
		this._namespace = props.namespace || "DiagComponentLogger";
	}
	DiagComponentLogger.prototype.debug = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("debug", this._namespace, args);
	};
	DiagComponentLogger.prototype.error = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("error", this._namespace, args);
	};
	DiagComponentLogger.prototype.info = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("info", this._namespace, args);
	};
	DiagComponentLogger.prototype.warn = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("warn", this._namespace, args);
	};
	DiagComponentLogger.prototype.verbose = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return logProxy("verbose", this._namespace, args);
	};
	return DiagComponentLogger;
}();
function logProxy(funcName, namespace, args) {
	var logger = getGlobal("diag");
	if (!logger) return;
	args.unshift(namespace);
	return logger[funcName].apply(logger, __spreadArray$3([], __read$3(args), false));
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/types.js
/**
* Defines the available internal logging levels for the diagnostic logger, the numeric values
* of the levels are defined to match the original values from the initial LogLevel to avoid
* compatibility/migration issues for any implementation that assume the numeric ordering.
*/
var DiagLogLevel;
(function(DiagLogLevel) {
	/** Diagnostic Logging level setting to disable all logging (except and forced logs) */
	DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
	/** Identifies an error scenario */
	DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
	/** Identifies a warning scenario */
	DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
	/** General informational log message */
	DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
	/** General debug log message */
	DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
	/**
	* Detailed trace level logging should only be used for development, should only be set
	* in a development environment.
	*/
	DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
	/** Used to set the logging level to include all logging */
	DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
	if (maxLevel < DiagLogLevel.NONE) maxLevel = DiagLogLevel.NONE;
	else if (maxLevel > DiagLogLevel.ALL) maxLevel = DiagLogLevel.ALL;
	logger = logger || {};
	function _filterFunc(funcName, theLevel) {
		var theFunc = logger[funcName];
		if (typeof theFunc === "function" && maxLevel >= theLevel) return theFunc.bind(logger);
		return function() {};
	}
	return {
		error: _filterFunc("error", DiagLogLevel.ERROR),
		warn: _filterFunc("warn", DiagLogLevel.WARN),
		info: _filterFunc("info", DiagLogLevel.INFO),
		debug: _filterFunc("debug", DiagLogLevel.DEBUG),
		verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
	};
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read$2 = function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$2 = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$2 = "diag";
/**
* Singleton object which represents the entry point to the OpenTelemetry internal
* diagnostic API
*/
var DiagAPI = function() {
	/**
	* Private internal constructor
	* @private
	*/
	function DiagAPI() {
		function _logProxy(funcName) {
			return function() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
				var logger = getGlobal("diag");
				if (!logger) return;
				return logger[funcName].apply(logger, __spreadArray$2([], __read$2(args), false));
			};
		}
		var self = this;
		var setLogger = function(logger, optionsOrLogLevel) {
			var _a, _b, _c;
			if (optionsOrLogLevel === void 0) optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
			if (logger === self) {
				var err = /* @__PURE__ */ new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
				self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
				return false;
			}
			if (typeof optionsOrLogLevel === "number") optionsOrLogLevel = { logLevel: optionsOrLogLevel };
			var oldLogger = getGlobal("diag");
			var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
			if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
				var stack = (_c = (/* @__PURE__ */ new Error()).stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
				oldLogger.warn("Current logger will be overwritten from " + stack);
				newLogger.warn("Current logger will overwrite one already registered from " + stack);
			}
			return registerGlobal("diag", newLogger, self, true);
		};
		self.setLogger = setLogger;
		self.disable = function() {
			unregisterGlobal(API_NAME$2, self);
		};
		self.createComponentLogger = function(options) {
			return new DiagComponentLogger(options);
		};
		self.verbose = _logProxy("verbose");
		self.debug = _logProxy("debug");
		self.info = _logProxy("info");
		self.warn = _logProxy("warn");
		self.error = _logProxy("error");
	}
	/** Get the singleton instance of the DiagAPI API */
	DiagAPI.instance = function() {
		if (!this._instance) this._instance = new DiagAPI();
		return this._instance;
	};
	return DiagAPI;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context/context.js
/** Get a key to uniquely identify a context value */
function createContextKey(description) {
	return Symbol.for(description);
}
/** The root context is used as the default parent context when there is no active context */
var ROOT_CONTEXT = new (function() {
	/**
	* Construct a new context which inherits values from an optional parent context.
	*
	* @param parentContext a context from which to inherit values
	*/
	function BaseContext(parentContext) {
		var self = this;
		self._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
		self.getValue = function(key) {
			return self._currentContext.get(key);
		};
		self.setValue = function(key, value) {
			var context = new BaseContext(self._currentContext);
			context._currentContext.set(key, value);
			return context;
		};
		self.deleteValue = function(key) {
			var context = new BaseContext(self._currentContext);
			context._currentContext.delete(key);
			return context;
		};
	}
	return BaseContext;
}())();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read$1 = function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray$1 = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = function() {
	function NoopContextManager() {}
	NoopContextManager.prototype.active = function() {
		return ROOT_CONTEXT;
	};
	NoopContextManager.prototype.with = function(_context, fn, thisArg) {
		var args = [];
		for (var _i = 3; _i < arguments.length; _i++) args[_i - 3] = arguments[_i];
		return fn.call.apply(fn, __spreadArray$1([thisArg], __read$1(args), false));
	};
	NoopContextManager.prototype.bind = function(_context, target) {
		return target;
	};
	NoopContextManager.prototype.enable = function() {
		return this;
	};
	NoopContextManager.prototype.disable = function() {
		return this;
	};
	return NoopContextManager;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/context.js
var __read = function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
};
var __spreadArray = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$1 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
/**
* Singleton object which represents the entry point to the OpenTelemetry Context API
*/
var ContextAPI = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function ContextAPI() {}
	/** Get the singleton instance of the Context API */
	ContextAPI.getInstance = function() {
		if (!this._instance) this._instance = new ContextAPI();
		return this._instance;
	};
	/**
	* Set the current context manager.
	*
	* @returns true if the context manager was successfully registered, else false
	*/
	ContextAPI.prototype.setGlobalContextManager = function(contextManager) {
		return registerGlobal(API_NAME$1, contextManager, DiagAPI.instance());
	};
	/**
	* Get the currently active context
	*/
	ContextAPI.prototype.active = function() {
		return this._getContextManager().active();
	};
	/**
	* Execute a function with an active context
	*
	* @param context context to be active during function execution
	* @param fn function to execute in a context
	* @param thisArg optional receiver to be used for calling fn
	* @param args optional arguments forwarded to fn
	*/
	ContextAPI.prototype.with = function(context, fn, thisArg) {
		var _a;
		var args = [];
		for (var _i = 3; _i < arguments.length; _i++) args[_i - 3] = arguments[_i];
		return (_a = this._getContextManager()).with.apply(_a, __spreadArray([
			context,
			fn,
			thisArg
		], __read(args), false));
	};
	/**
	* Bind a context to a target function or event emitter
	*
	* @param context context to bind to the event emitter or function. Defaults to the currently active context
	* @param target function or event emitter to bind
	*/
	ContextAPI.prototype.bind = function(context, target) {
		return this._getContextManager().bind(context, target);
	};
	ContextAPI.prototype._getContextManager = function() {
		return getGlobal(API_NAME$1) || NOOP_CONTEXT_MANAGER;
	};
	/** Disable and remove the global context manager */
	ContextAPI.prototype.disable = function() {
		this._getContextManager().disable();
		unregisterGlobal(API_NAME$1, DiagAPI.instance());
	};
	return ContextAPI;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags) {
	/** Represents no flag set. */
	TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
	/** Bit to represent whether trace is sampled in trace flags. */
	TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));
var INVALID_SPAN_CONTEXT = {
	traceId: "00000000000000000000000000000000",
	spanId: "0000000000000000",
	traceFlags: TraceFlags.NONE
};
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
/**
* The NonRecordingSpan is the default {@link Span} that is used when no Span
* implementation is available. All operations are no-op including context
* propagation.
*/
var NonRecordingSpan = function() {
	function NonRecordingSpan(_spanContext) {
		if (_spanContext === void 0) _spanContext = INVALID_SPAN_CONTEXT;
		this._spanContext = _spanContext;
	}
	NonRecordingSpan.prototype.spanContext = function() {
		return this._spanContext;
	};
	NonRecordingSpan.prototype.setAttribute = function(_key, _value) {
		return this;
	};
	NonRecordingSpan.prototype.setAttributes = function(_attributes) {
		return this;
	};
	NonRecordingSpan.prototype.addEvent = function(_name, _attributes) {
		return this;
	};
	NonRecordingSpan.prototype.addLink = function(_link) {
		return this;
	};
	NonRecordingSpan.prototype.addLinks = function(_links) {
		return this;
	};
	NonRecordingSpan.prototype.setStatus = function(_status) {
		return this;
	};
	NonRecordingSpan.prototype.updateName = function(_name) {
		return this;
	};
	NonRecordingSpan.prototype.end = function(_endTime) {};
	NonRecordingSpan.prototype.isRecording = function() {
		return false;
	};
	NonRecordingSpan.prototype.recordException = function(_exception, _time) {};
	return NonRecordingSpan;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
/**
* span key
*/
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
/**
* Return the span if one exists
*
* @param context context to get span from
*/
function getSpan(context) {
	return context.getValue(SPAN_KEY) || void 0;
}
/**
* Gets the span from the current context, if one exists.
*/
function getActiveSpan() {
	return getSpan(ContextAPI.getInstance().active());
}
/**
* Set the span on a context
*
* @param context context to use as parent
* @param span span to set active
*/
function setSpan(context, span) {
	return context.setValue(SPAN_KEY, span);
}
/**
* Remove current span stored in the context
*
* @param context context to delete span from
*/
function deleteSpan(context) {
	return context.deleteValue(SPAN_KEY);
}
/**
* Wrap span context in a NoopSpan and set as span in a new
* context
*
* @param context context to set active span on
* @param spanContext span context to be wrapped
*/
function setSpanContext(context, spanContext) {
	return setSpan(context, new NonRecordingSpan(spanContext));
}
/**
* Get the span context of the span if it exists.
*
* @param context context to get values from
*/
function getSpanContext(context) {
	var _a;
	return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
	return VALID_TRACEID_REGEX.test(traceId) && traceId !== "00000000000000000000000000000000";
}
function isValidSpanId(spanId) {
	return VALID_SPANID_REGEX.test(spanId) && spanId !== "0000000000000000";
}
/**
* Returns true if this {@link SpanContext} is valid.
* @return true if this {@link SpanContext} is valid.
*/
function isSpanContextValid(spanContext) {
	return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
* Wrap the given {@link SpanContext} in a new non-recording {@link Span}
*
* @param spanContext span context to be wrapped
* @returns a new non-recording {@link Span} with the provided context
*/
function wrapSpanContext(spanContext) {
	return new NonRecordingSpan(spanContext);
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var contextApi = ContextAPI.getInstance();
/**
* No-op implementations of {@link Tracer}.
*/
var NoopTracer = function() {
	function NoopTracer() {}
	NoopTracer.prototype.startSpan = function(name, options, context) {
		if (context === void 0) context = contextApi.active();
		if (Boolean(options === null || options === void 0 ? void 0 : options.root)) return new NonRecordingSpan();
		var parentFromContext = context && getSpanContext(context);
		if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) return new NonRecordingSpan(parentFromContext);
		else return new NonRecordingSpan();
	};
	NoopTracer.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
		var opts;
		var ctx;
		var fn;
		if (arguments.length < 2) return;
		else if (arguments.length === 2) fn = arg2;
		else if (arguments.length === 3) {
			opts = arg2;
			fn = arg3;
		} else {
			opts = arg2;
			ctx = arg3;
			fn = arg4;
		}
		var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
		var span = this.startSpan(name, opts, parentContext);
		var contextWithSpanSet = setSpan(parentContext, span);
		return contextApi.with(contextWithSpanSet, fn, void 0, span);
	};
	return NoopTracer;
}();
function isSpanContext(spanContext) {
	return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER = new NoopTracer();
/**
* Proxy tracer provided by the proxy tracer provider
*/
var ProxyTracer = function() {
	function ProxyTracer(_provider, name, version, options) {
		this._provider = _provider;
		this.name = name;
		this.version = version;
		this.options = options;
	}
	ProxyTracer.prototype.startSpan = function(name, options, context) {
		return this._getTracer().startSpan(name, options, context);
	};
	ProxyTracer.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
		var tracer = this._getTracer();
		return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
	};
	/**
	* Try to get a tracer from the proxy tracer provider.
	* If the proxy tracer provider has no delegate, return a noop tracer.
	*/
	ProxyTracer.prototype._getTracer = function() {
		if (this._delegate) return this._delegate;
		var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
		if (!tracer) return NOOP_TRACER;
		this._delegate = tracer;
		return this._delegate;
	};
	return ProxyTracer;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER = new (function() {
	function NoopTracerProvider() {}
	NoopTracerProvider.prototype.getTracer = function(_name, _version, _options) {
		return new NoopTracer();
	};
	return NoopTracerProvider;
}())();
/**
* Tracer provider which provides {@link ProxyTracer}s.
*
* Before a delegate is set, tracers provided are NoOp.
*   When a delegate is set, traces are provided from the delegate.
*   When a delegate is set after tracers have already been provided,
*   all tracers already provided will use the provided delegate implementation.
*/
var ProxyTracerProvider = function() {
	function ProxyTracerProvider() {}
	/**
	* Get a {@link ProxyTracer}
	*/
	ProxyTracerProvider.prototype.getTracer = function(name, version, options) {
		var _a;
		return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
	};
	ProxyTracerProvider.prototype.getDelegate = function() {
		var _a;
		return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
	};
	/**
	* Set the delegate tracer provider
	*/
	ProxyTracerProvider.prototype.setDelegate = function(delegate) {
		this._delegate = delegate;
	};
	ProxyTracerProvider.prototype.getDelegateTracer = function(name, version, options) {
		var _a;
		return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
	};
	return ProxyTracerProvider;
}();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/status.js
/**
* An enumeration of status codes.
*/
var SpanStatusCode;
(function(SpanStatusCode) {
	/**
	* The default status.
	*/
	SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
	/**
	* The operation has been validated by an Application developer or
	* Operator to have completed successfully.
	*/
	SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
	/**
	* The operation contains an error.
	*/
	SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
})(SpanStatusCode || (SpanStatusCode = {}));
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context-api.js
/** Entrypoint for context API */
var context = ContextAPI.getInstance();
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME = "trace";
//#endregion
//#region ../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace-api.js
/** Entrypoint for trace API */
var trace = function() {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	function TraceAPI() {
		this._proxyTracerProvider = new ProxyTracerProvider();
		this.wrapSpanContext = wrapSpanContext;
		this.isSpanContextValid = isSpanContextValid;
		this.deleteSpan = deleteSpan;
		this.getSpan = getSpan;
		this.getActiveSpan = getActiveSpan;
		this.getSpanContext = getSpanContext;
		this.setSpan = setSpan;
		this.setSpanContext = setSpanContext;
	}
	/** Get the singleton instance of the Trace API */
	TraceAPI.getInstance = function() {
		if (!this._instance) this._instance = new TraceAPI();
		return this._instance;
	};
	/**
	* Set the current global tracer.
	*
	* @returns true if the tracer provider was successfully registered, else false
	*/
	TraceAPI.prototype.setGlobalTracerProvider = function(provider) {
		var success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
		if (success) this._proxyTracerProvider.setDelegate(provider);
		return success;
	};
	/**
	* Returns the global tracer provider.
	*/
	TraceAPI.prototype.getTracerProvider = function() {
		return getGlobal(API_NAME) || this._proxyTracerProvider;
	};
	/**
	* Returns a tracer from the global tracer provider.
	*/
	TraceAPI.prototype.getTracer = function(name, version) {
		return this.getTracerProvider().getTracer(name, version);
	};
	/** Remove the global tracer provider */
	TraceAPI.prototype.disable = function() {
		unregisterGlobal(API_NAME, DiagAPI.instance());
		this._proxyTracerProvider = new ProxyTracerProvider();
	};
	return TraceAPI;
}().getInstance();
//#endregion
//#region ../node_modules/.pnpm/ai@6.0.174_zod@4.4.3/node_modules/ai/dist/index.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
	for (var name21 in all) __defProp(target, name21, {
		get: all[name21],
		enumerable: true
	});
};
var name = "AI_InvalidArgumentError";
var marker = `vercel.ai.error.${name}`;
var symbol = Symbol.for(marker);
var _a;
var InvalidArgumentError = class extends AISDKError {
	constructor({ parameter, value, message }) {
		super({
			name,
			message: `Invalid argument for parameter ${parameter}: ${message}`
		});
		this[_a] = true;
		this.parameter = parameter;
		this.value = value;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker);
	}
};
_a = symbol;
var name2 = "AI_InvalidStreamPartError";
var marker2 = `vercel.ai.error.${name2}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var InvalidStreamPartError = class extends AISDKError {
	constructor({ chunk, message }) {
		super({
			name: name2,
			message
		});
		this[_a2] = true;
		this.chunk = chunk;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker2);
	}
};
_a2 = symbol2;
var name3 = "AI_InvalidToolApprovalError";
var marker3 = `vercel.ai.error.${name3}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var InvalidToolApprovalError = class extends AISDKError {
	constructor({ approvalId }) {
		super({
			name: name3,
			message: `Tool approval response references unknown approvalId: "${approvalId}". No matching tool-approval-request found in message history.`
		});
		this[_a3] = true;
		this.approvalId = approvalId;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker3);
	}
};
_a3 = symbol3;
var name4 = "AI_InvalidToolInputError";
var marker4 = `vercel.ai.error.${name4}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var InvalidToolInputError = class extends AISDKError {
	constructor({ toolInput, toolName, cause, message = `Invalid input for tool ${toolName}: ${getErrorMessage(cause)}` }) {
		super({
			name: name4,
			message,
			cause
		});
		this[_a4] = true;
		this.toolInput = toolInput;
		this.toolName = toolName;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker4);
	}
};
_a4 = symbol4;
var name5 = "AI_ToolCallNotFoundForApprovalError";
var marker5 = `vercel.ai.error.${name5}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var ToolCallNotFoundForApprovalError = class extends AISDKError {
	constructor({ toolCallId, approvalId }) {
		super({
			name: name5,
			message: `Tool call "${toolCallId}" not found for approval request "${approvalId}".`
		});
		this[_a5] = true;
		this.toolCallId = toolCallId;
		this.approvalId = approvalId;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker5);
	}
};
_a5 = symbol5;
var name6 = "AI_MissingToolResultsError";
var marker6 = `vercel.ai.error.${name6}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var MissingToolResultsError = class extends AISDKError {
	constructor({ toolCallIds }) {
		super({
			name: name6,
			message: `Tool result${toolCallIds.length > 1 ? "s are" : " is"} missing for tool call${toolCallIds.length > 1 ? "s" : ""} ${toolCallIds.join(", ")}.`
		});
		this[_a6] = true;
		this.toolCallIds = toolCallIds;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker6);
	}
};
_a6 = symbol6;
var name7 = "AI_NoImageGeneratedError";
var marker7 = `vercel.ai.error.${name7}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var NoImageGeneratedError = class extends AISDKError {
	constructor({ message = "No image generated.", cause, responses }) {
		super({
			name: name7,
			message,
			cause
		});
		this[_a7] = true;
		this.responses = responses;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker7);
	}
};
_a7 = symbol7;
var name8 = "AI_NoObjectGeneratedError";
var marker8 = `vercel.ai.error.${name8}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var NoObjectGeneratedError = class extends AISDKError {
	constructor({ message = "No object generated.", cause, text: text2, response, usage, finishReason }) {
		super({
			name: name8,
			message,
			cause
		});
		this[_a8] = true;
		this.text = text2;
		this.response = response;
		this.usage = usage;
		this.finishReason = finishReason;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker8);
	}
};
_a8 = symbol8;
var name9 = "AI_NoOutputGeneratedError";
var marker9 = `vercel.ai.error.${name9}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var NoOutputGeneratedError = class extends AISDKError {
	constructor({ message = "No output generated.", cause } = {}) {
		super({
			name: name9,
			message,
			cause
		});
		this[_a9] = true;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker9);
	}
};
_a9 = symbol9;
var name10 = "AI_NoSpeechGeneratedError";
var marker10 = `vercel.ai.error.${name10}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var NoSpeechGeneratedError = class extends AISDKError {
	constructor(options) {
		super({
			name: name10,
			message: "No speech audio generated."
		});
		this[_a10] = true;
		this.responses = options.responses;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker10);
	}
};
_a10 = symbol10;
var name11 = "AI_NoTranscriptGeneratedError";
var marker11 = `vercel.ai.error.${name11}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var NoTranscriptGeneratedError = class extends AISDKError {
	constructor(options) {
		super({
			name: name11,
			message: "No transcript generated."
		});
		this[_a11] = true;
		this.responses = options.responses;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker11);
	}
};
_a11 = symbol11;
var name12 = "AI_NoVideoGeneratedError";
var marker12 = `vercel.ai.error.${name12}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var NoVideoGeneratedError = class extends AISDKError {
	constructor({ message = "No video generated.", cause, responses }) {
		super({
			name: name12,
			message,
			cause
		});
		this[_a12] = true;
		this.responses = responses;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker12);
	}
	/**
	* @deprecated use `isInstance` instead
	*/
	static isNoVideoGeneratedError(error) {
		return error instanceof Error && error.name === name12 && typeof error.responses !== "undefined" ? true : false;
	}
	/**
	* @deprecated Do not use this method. It will be removed in the next major version.
	*/
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			stack: this.stack,
			cause: this.cause,
			responses: this.responses
		};
	}
};
_a12 = symbol12;
var name13 = "AI_NoSuchToolError";
var marker13 = `vercel.ai.error.${name13}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var NoSuchToolError = class extends AISDKError {
	constructor({ toolName, availableTools = void 0, message = `Model tried to call unavailable tool '${toolName}'. ${availableTools === void 0 ? "No tools are available." : `Available tools: ${availableTools.join(", ")}.`}` }) {
		super({
			name: name13,
			message
		});
		this[_a13] = true;
		this.toolName = toolName;
		this.availableTools = availableTools;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker13);
	}
};
_a13 = symbol13;
var name14 = "AI_ToolCallRepairError";
var marker14 = `vercel.ai.error.${name14}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var ToolCallRepairError = class extends AISDKError {
	constructor({ cause, originalError, message = `Error repairing tool call: ${getErrorMessage(cause)}` }) {
		super({
			name: name14,
			message,
			cause
		});
		this[_a14] = true;
		this.originalError = originalError;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker14);
	}
};
_a14 = symbol14;
var UnsupportedModelVersionError = class extends AISDKError {
	constructor(options) {
		super({
			name: "AI_UnsupportedModelVersionError",
			message: `Unsupported model version ${options.version} for provider "${options.provider}" and model "${options.modelId}". AI SDK 5 only supports models that implement specification version "v2".`
		});
		this.version = options.version;
		this.provider = options.provider;
		this.modelId = options.modelId;
	}
};
var name15 = "AI_UIMessageStreamError";
var marker15 = `vercel.ai.error.${name15}`;
var symbol15 = Symbol.for(marker15);
var _a15;
var UIMessageStreamError = class extends AISDKError {
	constructor({ chunkType, chunkId, message }) {
		super({
			name: name15,
			message
		});
		this[_a15] = true;
		this.chunkType = chunkType;
		this.chunkId = chunkId;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker15);
	}
};
_a15 = symbol15;
var name16 = "AI_InvalidDataContentError";
var marker16 = `vercel.ai.error.${name16}`;
var symbol16 = Symbol.for(marker16);
var _a16;
var InvalidDataContentError = class extends AISDKError {
	constructor({ content, cause, message = `Invalid data content. Expected a base64 string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.` }) {
		super({
			name: name16,
			message,
			cause
		});
		this[_a16] = true;
		this.content = content;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker16);
	}
};
_a16 = symbol16;
var name17 = "AI_InvalidMessageRoleError";
var marker17 = `vercel.ai.error.${name17}`;
var symbol17 = Symbol.for(marker17);
var _a17;
var InvalidMessageRoleError = class extends AISDKError {
	constructor({ role, message = `Invalid message role: '${role}'. Must be one of: "system", "user", "assistant", "tool".` }) {
		super({
			name: name17,
			message
		});
		this[_a17] = true;
		this.role = role;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker17);
	}
};
_a17 = symbol17;
var name18 = "AI_MessageConversionError";
var marker18 = `vercel.ai.error.${name18}`;
var symbol18 = Symbol.for(marker18);
var _a18;
var MessageConversionError = class extends AISDKError {
	constructor({ originalMessage, message }) {
		super({
			name: name18,
			message
		});
		this[_a18] = true;
		this.originalMessage = originalMessage;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker18);
	}
};
_a18 = symbol18;
var name19 = "AI_RetryError";
var marker19 = `vercel.ai.error.${name19}`;
var symbol19 = Symbol.for(marker19);
var _a19;
var RetryError = class extends AISDKError {
	constructor({ message, reason, errors }) {
		super({
			name: name19,
			message
		});
		this[_a19] = true;
		this.reason = reason;
		this.errors = errors;
		this.lastError = errors[errors.length - 1];
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker19);
	}
};
_a19 = symbol19;
function asArray(value) {
	return value === void 0 ? [] : Array.isArray(value) ? value : [value];
}
async function notify(options) {
	for (const callback of asArray(options.callbacks)) {
		if (callback == null) continue;
		try {
			await callback(options.event);
		} catch (_ignored) {}
	}
}
function formatWarning({ warning, provider, model }) {
	const prefix = `AI SDK Warning (${provider} / ${model}):`;
	switch (warning.type) {
		case "unsupported": {
			let message = `${prefix} The feature "${warning.feature}" is not supported.`;
			if (warning.details) message += ` ${warning.details}`;
			return message;
		}
		case "compatibility": {
			let message = `${prefix} The feature "${warning.feature}" is used in a compatibility mode.`;
			if (warning.details) message += ` ${warning.details}`;
			return message;
		}
		case "other": return `${prefix} ${warning.message}`;
		default: return `${prefix} ${JSON.stringify(warning, null, 2)}`;
	}
}
var FIRST_WARNING_INFO_MESSAGE = "AI SDK Warning System: To turn off warning logging, set the AI_SDK_LOG_WARNINGS global to false.";
var hasLoggedBefore = false;
var logWarnings = (options) => {
	if (options.warnings.length === 0) return;
	const logger = globalThis.AI_SDK_LOG_WARNINGS;
	if (logger === false) return;
	if (typeof logger === "function") {
		logger(options);
		return;
	}
	if (!hasLoggedBefore) {
		hasLoggedBefore = true;
		console.info(FIRST_WARNING_INFO_MESSAGE);
	}
	for (const warning of options.warnings) console.warn(formatWarning({
		warning,
		provider: options.provider,
		model: options.model
	}));
};
function logV2CompatibilityWarning({ provider, modelId }) {
	logWarnings({
		warnings: [{
			type: "compatibility",
			feature: "specificationVersion",
			details: `Using v2 specification compatibility mode. Some features may not be available.`
		}],
		provider,
		model: modelId
	});
}
function asEmbeddingModelV3(model) {
	if (model.specificationVersion === "v3") return model;
	logV2CompatibilityWarning({
		provider: model.provider,
		modelId: model.modelId
	});
	return new Proxy(model, { get(target, prop) {
		if (prop === "specificationVersion") return "v3";
		return target[prop];
	} });
}
function asImageModelV3(model) {
	if (model.specificationVersion === "v3") return model;
	logV2CompatibilityWarning({
		provider: model.provider,
		modelId: model.modelId
	});
	return new Proxy(model, { get(target, prop) {
		if (prop === "specificationVersion") return "v3";
		return target[prop];
	} });
}
function asLanguageModelV3(model) {
	if (model.specificationVersion === "v3") return model;
	logV2CompatibilityWarning({
		provider: model.provider,
		modelId: model.modelId
	});
	return new Proxy(model, { get(target, prop) {
		switch (prop) {
			case "specificationVersion": return "v3";
			case "doGenerate": return async (...args) => {
				const result = await target.doGenerate(...args);
				return {
					...result,
					finishReason: convertV2FinishReasonToV3(result.finishReason),
					usage: convertV2UsageToV3(result.usage)
				};
			};
			case "doStream": return async (...args) => {
				const result = await target.doStream(...args);
				return {
					...result,
					stream: convertV2StreamToV3(result.stream)
				};
			};
			default: return target[prop];
		}
	} });
}
function convertV2StreamToV3(stream) {
	return stream.pipeThrough(new TransformStream({ transform(chunk, controller) {
		switch (chunk.type) {
			case "finish":
				controller.enqueue({
					...chunk,
					finishReason: convertV2FinishReasonToV3(chunk.finishReason),
					usage: convertV2UsageToV3(chunk.usage)
				});
				break;
			default:
				controller.enqueue(chunk);
				break;
		}
	} }));
}
function convertV2FinishReasonToV3(finishReason) {
	return {
		unified: finishReason === "unknown" ? "other" : finishReason,
		raw: void 0
	};
}
function convertV2UsageToV3(usage) {
	return {
		inputTokens: {
			total: usage.inputTokens,
			noCache: void 0,
			cacheRead: usage.cachedInputTokens,
			cacheWrite: void 0
		},
		outputTokens: {
			total: usage.outputTokens,
			text: void 0,
			reasoning: usage.reasoningTokens
		}
	};
}
function asSpeechModelV3(model) {
	if (model.specificationVersion === "v3") return model;
	logV2CompatibilityWarning({
		provider: model.provider,
		modelId: model.modelId
	});
	return new Proxy(model, { get(target, prop) {
		if (prop === "specificationVersion") return "v3";
		return target[prop];
	} });
}
function asTranscriptionModelV3(model) {
	if (model.specificationVersion === "v3") return model;
	logV2CompatibilityWarning({
		provider: model.provider,
		modelId: model.modelId
	});
	return new Proxy(model, { get(target, prop) {
		if (prop === "specificationVersion") return "v3";
		return target[prop];
	} });
}
function resolveLanguageModel(model) {
	if (typeof model !== "string") {
		if (model.specificationVersion !== "v3" && model.specificationVersion !== "v2") {
			const unsupportedModel = model;
			throw new UnsupportedModelVersionError({
				version: unsupportedModel.specificationVersion,
				provider: unsupportedModel.provider,
				modelId: unsupportedModel.modelId
			});
		}
		return asLanguageModelV3(model);
	}
	return getGlobalProvider().languageModel(model);
}
function resolveEmbeddingModel(model) {
	if (typeof model !== "string") {
		if (model.specificationVersion !== "v3" && model.specificationVersion !== "v2") {
			const unsupportedModel = model;
			throw new UnsupportedModelVersionError({
				version: unsupportedModel.specificationVersion,
				provider: unsupportedModel.provider,
				modelId: unsupportedModel.modelId
			});
		}
		return asEmbeddingModelV3(model);
	}
	return getGlobalProvider().embeddingModel(model);
}
function resolveTranscriptionModel(model) {
	var _a21, _b;
	if (typeof model !== "string") {
		if (model.specificationVersion !== "v3" && model.specificationVersion !== "v2") {
			const unsupportedModel = model;
			throw new UnsupportedModelVersionError({
				version: unsupportedModel.specificationVersion,
				provider: unsupportedModel.provider,
				modelId: unsupportedModel.modelId
			});
		}
		return asTranscriptionModelV3(model);
	}
	return (_b = (_a21 = getGlobalProvider()).transcriptionModel) == null ? void 0 : _b.call(_a21, model);
}
function resolveSpeechModel(model) {
	var _a21, _b;
	if (typeof model !== "string") {
		if (model.specificationVersion !== "v3" && model.specificationVersion !== "v2") {
			const unsupportedModel = model;
			throw new UnsupportedModelVersionError({
				version: unsupportedModel.specificationVersion,
				provider: unsupportedModel.provider,
				modelId: unsupportedModel.modelId
			});
		}
		return asSpeechModelV3(model);
	}
	return (_b = (_a21 = getGlobalProvider()).speechModel) == null ? void 0 : _b.call(_a21, model);
}
function resolveImageModel(model) {
	if (typeof model !== "string") {
		if (model.specificationVersion !== "v3" && model.specificationVersion !== "v2") {
			const unsupportedModel = model;
			throw new UnsupportedModelVersionError({
				version: unsupportedModel.specificationVersion,
				provider: unsupportedModel.provider,
				modelId: unsupportedModel.modelId
			});
		}
		return asImageModelV3(model);
	}
	return getGlobalProvider().imageModel(model);
}
function resolveVideoModel(model) {
	if (typeof model === "string") {
		const videoModel = getGlobalProvider().videoModel;
		if (!videoModel) throw new Error("The default provider does not support video models. Please use a Experimental_VideoModelV3 object from a provider (e.g., vertex.video(\"model-id\")).");
		return videoModel(model);
	}
	if (model.specificationVersion !== "v3") {
		const unsupportedModel = model;
		throw new UnsupportedModelVersionError({
			version: unsupportedModel.specificationVersion,
			provider: unsupportedModel.provider,
			modelId: unsupportedModel.modelId
		});
	}
	return model;
}
function resolveRerankingModel(model) {
	if (typeof model === "string") {
		const rerankingModel = getGlobalProvider().rerankingModel;
		if (!rerankingModel) throw new Error("The default provider does not support reranking models. Please use a RerankingModel object from a provider (e.g., gateway.rerankingModel(\"model-id\")).");
		return rerankingModel(model);
	}
	if (model.specificationVersion !== "v3") {
		const unsupportedModel = model;
		throw new UnsupportedModelVersionError({
			version: unsupportedModel.specificationVersion,
			provider: unsupportedModel.provider,
			modelId: unsupportedModel.modelId
		});
	}
	return model;
}
function getGlobalProvider() {
	var _a21;
	return (_a21 = globalThis.AI_SDK_DEFAULT_PROVIDER) != null ? _a21 : gateway;
}
function getTotalTimeoutMs(timeout) {
	if (timeout == null) return;
	if (typeof timeout === "number") return timeout;
	return timeout.totalMs;
}
function getStepTimeoutMs(timeout) {
	if (timeout == null || typeof timeout === "number") return;
	return timeout.stepMs;
}
function getChunkTimeoutMs(timeout) {
	if (timeout == null || typeof timeout === "number") return;
	return timeout.chunkMs;
}
var imageMediaTypeSignatures = [
	{
		mediaType: "image/gif",
		bytesPrefix: [
			71,
			73,
			70
		]
	},
	{
		mediaType: "image/png",
		bytesPrefix: [
			137,
			80,
			78,
			71
		]
	},
	{
		mediaType: "image/jpeg",
		bytesPrefix: [255, 216]
	},
	{
		mediaType: "image/webp",
		bytesPrefix: [
			82,
			73,
			70,
			70,
			null,
			null,
			null,
			null,
			87,
			69,
			66,
			80
		]
	},
	{
		mediaType: "image/bmp",
		bytesPrefix: [66, 77]
	},
	{
		mediaType: "image/tiff",
		bytesPrefix: [
			73,
			73,
			42,
			0
		]
	},
	{
		mediaType: "image/tiff",
		bytesPrefix: [
			77,
			77,
			0,
			42
		]
	},
	{
		mediaType: "image/avif",
		bytesPrefix: [
			0,
			0,
			0,
			32,
			102,
			116,
			121,
			112,
			97,
			118,
			105,
			102
		]
	},
	{
		mediaType: "image/heic",
		bytesPrefix: [
			0,
			0,
			0,
			32,
			102,
			116,
			121,
			112,
			104,
			101,
			105,
			99
		]
	}
];
var audioMediaTypeSignatures = [
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 251]
	},
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 250]
	},
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 243]
	},
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 242]
	},
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 227]
	},
	{
		mediaType: "audio/mpeg",
		bytesPrefix: [255, 226]
	},
	{
		mediaType: "audio/wav",
		bytesPrefix: [
			82,
			73,
			70,
			70,
			null,
			null,
			null,
			null,
			87,
			65,
			86,
			69
		]
	},
	{
		mediaType: "audio/ogg",
		bytesPrefix: [
			79,
			103,
			103,
			83
		]
	},
	{
		mediaType: "audio/flac",
		bytesPrefix: [
			102,
			76,
			97,
			67
		]
	},
	{
		mediaType: "audio/aac",
		bytesPrefix: [
			64,
			21,
			0,
			0
		]
	},
	{
		mediaType: "audio/mp4",
		bytesPrefix: [
			102,
			116,
			121,
			112
		]
	},
	{
		mediaType: "audio/webm",
		bytesPrefix: [
			26,
			69,
			223,
			163
		]
	}
];
var videoMediaTypeSignatures = [
	{
		mediaType: "video/mp4",
		bytesPrefix: [
			0,
			0,
			0,
			null,
			102,
			116,
			121,
			112
		]
	},
	{
		mediaType: "video/webm",
		bytesPrefix: [
			26,
			69,
			223,
			163
		]
	},
	{
		mediaType: "video/quicktime",
		bytesPrefix: [
			0,
			0,
			0,
			20,
			102,
			116,
			121,
			112,
			113,
			116
		]
	},
	{
		mediaType: "video/x-msvideo",
		bytesPrefix: [
			82,
			73,
			70,
			70
		]
	}
];
var stripID3 = (data) => {
	const bytes = typeof data === "string" ? convertBase64ToUint8Array(data) : data;
	const id3Size = (bytes[6] & 127) << 21 | (bytes[7] & 127) << 14 | (bytes[8] & 127) << 7 | bytes[9] & 127;
	return bytes.slice(id3Size + 10);
};
function stripID3TagsIfPresent(data) {
	return typeof data === "string" && data.startsWith("SUQz") || typeof data !== "string" && data.length > 10 && data[0] === 73 && data[1] === 68 && data[2] === 51 ? stripID3(data) : data;
}
function detectMediaType({ data, signatures }) {
	const processedData = stripID3TagsIfPresent(data);
	const bytes = typeof processedData === "string" ? convertBase64ToUint8Array(processedData.substring(0, Math.min(processedData.length, 24))) : processedData;
	for (const signature of signatures) if (bytes.length >= signature.bytesPrefix.length && signature.bytesPrefix.every((byte, index) => byte === null || bytes[index] === byte)) return signature.mediaType;
}
var VERSION = "6.0.174";
var download = async ({ url, maxBytes, abortSignal }) => {
	var _a21;
	const urlText = url.toString();
	validateDownloadUrl(urlText);
	try {
		const response = await fetch(urlText, {
			headers: withUserAgentSuffix({}, `ai-sdk/${VERSION}`, getRuntimeEnvironmentUserAgent()),
			signal: abortSignal
		});
		if (response.redirected) validateDownloadUrl(response.url);
		if (!response.ok) throw new DownloadError({
			url: urlText,
			statusCode: response.status,
			statusText: response.statusText
		});
		return {
			data: await readResponseWithSizeLimit({
				response,
				url: urlText,
				maxBytes: maxBytes != null ? maxBytes : DEFAULT_MAX_DOWNLOAD_SIZE
			}),
			mediaType: (_a21 = response.headers.get("content-type")) != null ? _a21 : void 0
		};
	} catch (error) {
		if (DownloadError.isInstance(error)) throw error;
		throw new DownloadError({
			url: urlText,
			cause: error
		});
	}
};
var createDefaultDownloadFunction = (download2 = download) => (requestedDownloads) => Promise.all(requestedDownloads.map(async (requestedDownload) => requestedDownload.isUrlSupportedByModel ? null : download2(requestedDownload)));
function splitDataUrl(dataUrl) {
	try {
		const [header, base64Content] = dataUrl.split(",");
		return {
			mediaType: header.split(";")[0].split(":")[1],
			base64Content
		};
	} catch (error) {
		return {
			mediaType: void 0,
			base64Content: void 0
		};
	}
}
var dataContentSchema = union([
	string(),
	_instanceof(Uint8Array),
	_instanceof(ArrayBuffer),
	custom((value) => {
		var _a21, _b;
		return (_b = (_a21 = globalThis.Buffer) == null ? void 0 : _a21.isBuffer(value)) != null ? _b : false;
	}, { message: "Must be a Buffer" })
]);
function convertToLanguageModelV3DataContent(content) {
	if (content instanceof Uint8Array) return {
		data: content,
		mediaType: void 0
	};
	if (content instanceof ArrayBuffer) return {
		data: new Uint8Array(content),
		mediaType: void 0
	};
	if (typeof content === "string") try {
		content = new URL(content);
	} catch (error) {}
	if (content instanceof URL && content.protocol === "data:") {
		const { mediaType: dataUrlMediaType, base64Content } = splitDataUrl(content.toString());
		if (dataUrlMediaType == null || base64Content == null) throw new AISDKError({
			name: "InvalidDataContentError",
			message: `Invalid data URL format in content ${content.toString()}`
		});
		return {
			data: base64Content,
			mediaType: dataUrlMediaType
		};
	}
	return {
		data: content,
		mediaType: void 0
	};
}
function convertDataContentToBase64String(content) {
	if (typeof content === "string") return content;
	if (content instanceof ArrayBuffer) return convertUint8ArrayToBase64(new Uint8Array(content));
	return convertUint8ArrayToBase64(content);
}
function convertDataContentToUint8Array(content) {
	if (content instanceof Uint8Array) return content;
	if (typeof content === "string") try {
		return convertBase64ToUint8Array(content);
	} catch (error) {
		throw new InvalidDataContentError({
			message: "Invalid data content. Content string is not a base64-encoded media.",
			content,
			cause: error
		});
	}
	if (content instanceof ArrayBuffer) return new Uint8Array(content);
	throw new InvalidDataContentError({ content });
}
async function convertToLanguageModelPrompt({ prompt, supportedUrls, download: download2 = createDefaultDownloadFunction() }) {
	const downloadedAssets = await downloadAssets(prompt.messages, download2, supportedUrls);
	const approvalIdToToolCallId = /* @__PURE__ */ new Map();
	for (const message of prompt.messages) if (message.role === "assistant" && Array.isArray(message.content)) {
		for (const part of message.content) if (part.type === "tool-approval-request" && "approvalId" in part && "toolCallId" in part) approvalIdToToolCallId.set(part.approvalId, part.toolCallId);
	}
	const approvedToolCallIds = /* @__PURE__ */ new Set();
	for (const message of prompt.messages) if (message.role === "tool") {
		for (const part of message.content) if (part.type === "tool-approval-response") {
			const toolCallId = approvalIdToToolCallId.get(part.approvalId);
			if (toolCallId) approvedToolCallIds.add(toolCallId);
		}
	}
	const messages = [...prompt.system != null ? typeof prompt.system === "string" ? [{
		role: "system",
		content: prompt.system
	}] : asArray(prompt.system).map((message) => ({
		role: "system",
		content: message.content,
		providerOptions: message.providerOptions
	})) : [], ...prompt.messages.map((message) => convertToLanguageModelMessage({
		message,
		downloadedAssets
	}))];
	const combinedMessages = [];
	for (const message of messages) {
		if (message.role !== "tool") {
			combinedMessages.push(message);
			continue;
		}
		const lastCombinedMessage = combinedMessages.at(-1);
		if ((lastCombinedMessage == null ? void 0 : lastCombinedMessage.role) === "tool") lastCombinedMessage.content.push(...message.content);
		else combinedMessages.push(message);
	}
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const message of combinedMessages) switch (message.role) {
		case "assistant":
			for (const content of message.content) if (content.type === "tool-call" && !content.providerExecuted) toolCallIds.add(content.toolCallId);
			break;
		case "tool":
			for (const content of message.content) if (content.type === "tool-result") toolCallIds.delete(content.toolCallId);
			break;
		case "user":
		case "system":
			for (const id of approvedToolCallIds) toolCallIds.delete(id);
			if (toolCallIds.size > 0) throw new MissingToolResultsError({ toolCallIds: Array.from(toolCallIds) });
			break;
	}
	for (const id of approvedToolCallIds) toolCallIds.delete(id);
	if (toolCallIds.size > 0) throw new MissingToolResultsError({ toolCallIds: Array.from(toolCallIds) });
	return combinedMessages.filter((message) => message.role !== "tool" || message.content.length > 0);
}
function convertToLanguageModelMessage({ message, downloadedAssets }) {
	const role = message.role;
	switch (role) {
		case "system": return {
			role: "system",
			content: message.content,
			providerOptions: message.providerOptions
		};
		case "user":
			if (typeof message.content === "string") return {
				role: "user",
				content: [{
					type: "text",
					text: message.content
				}],
				providerOptions: message.providerOptions
			};
			return {
				role: "user",
				content: message.content.map((part) => convertPartToLanguageModelPart(part, downloadedAssets)).filter((part) => part.type !== "text" || part.text !== ""),
				providerOptions: message.providerOptions
			};
		case "assistant":
			if (typeof message.content === "string") return {
				role: "assistant",
				content: [{
					type: "text",
					text: message.content
				}],
				providerOptions: message.providerOptions
			};
			return {
				role: "assistant",
				content: message.content.filter((part) => part.type !== "text" || part.text !== "" || part.providerOptions != null).filter((part) => part.type !== "tool-approval-request").map((part) => {
					const providerOptions = part.providerOptions;
					switch (part.type) {
						case "file": {
							const { data, mediaType } = convertToLanguageModelV3DataContent(part.data);
							return {
								type: "file",
								data,
								filename: part.filename,
								mediaType: mediaType != null ? mediaType : part.mediaType,
								providerOptions
							};
						}
						case "reasoning": return {
							type: "reasoning",
							text: part.text,
							providerOptions
						};
						case "text": return {
							type: "text",
							text: part.text,
							providerOptions
						};
						case "tool-call": return {
							type: "tool-call",
							toolCallId: part.toolCallId,
							toolName: part.toolName,
							input: part.input,
							providerExecuted: part.providerExecuted,
							providerOptions
						};
						case "tool-result": return {
							type: "tool-result",
							toolCallId: part.toolCallId,
							toolName: part.toolName,
							output: mapToolResultOutput(part.output),
							providerOptions
						};
					}
				}),
				providerOptions: message.providerOptions
			};
		case "tool": return {
			role: "tool",
			content: message.content.filter((part) => part.type !== "tool-approval-response" || part.providerExecuted).map((part) => {
				switch (part.type) {
					case "tool-result": return {
						type: "tool-result",
						toolCallId: part.toolCallId,
						toolName: part.toolName,
						output: mapToolResultOutput(part.output),
						providerOptions: part.providerOptions
					};
					case "tool-approval-response": return {
						type: "tool-approval-response",
						approvalId: part.approvalId,
						approved: part.approved,
						reason: part.reason
					};
				}
			}),
			providerOptions: message.providerOptions
		};
		default: throw new InvalidMessageRoleError({ role });
	}
}
async function downloadAssets(messages, download2, supportedUrls) {
	const plannedDownloads = messages.filter((message) => message.role === "user").map((message) => message.content).filter((content) => Array.isArray(content)).flat().filter((part) => part.type === "image" || part.type === "file").map((part) => {
		var _a21;
		const mediaType = (_a21 = part.mediaType) != null ? _a21 : part.type === "image" ? "image/*" : void 0;
		let data = part.type === "image" ? part.image : part.data;
		if (typeof data === "string") try {
			data = new URL(data);
		} catch (ignored) {}
		return {
			mediaType,
			data
		};
	}).filter((part) => part.data instanceof URL).map((part) => ({
		url: part.data,
		isUrlSupportedByModel: part.mediaType != null && isUrlSupported({
			url: part.data.toString(),
			mediaType: part.mediaType,
			supportedUrls
		})
	}));
	const downloadedFiles = await download2(plannedDownloads);
	return Object.fromEntries(downloadedFiles.map((file, index) => file == null ? null : [plannedDownloads[index].url.toString(), {
		data: file.data,
		mediaType: file.mediaType
	}]).filter((file) => file != null));
}
function convertPartToLanguageModelPart(part, downloadedAssets) {
	var _a21;
	if (part.type === "text") return {
		type: "text",
		text: part.text,
		providerOptions: part.providerOptions
	};
	let originalData;
	const type = part.type;
	switch (type) {
		case "image":
			originalData = part.image;
			break;
		case "file":
			originalData = part.data;
			break;
		default: throw new Error(`Unsupported part type: ${type}`);
	}
	const { data: convertedData, mediaType: convertedMediaType } = convertToLanguageModelV3DataContent(originalData);
	let mediaType = convertedMediaType != null ? convertedMediaType : part.mediaType;
	let data = convertedData;
	if (data instanceof URL) {
		const downloadedFile = downloadedAssets[data.toString()];
		if (downloadedFile) {
			data = downloadedFile.data;
			mediaType ??= downloadedFile.mediaType;
		}
	}
	switch (type) {
		case "image":
			if (data instanceof Uint8Array || typeof data === "string") mediaType = (_a21 = detectMediaType({
				data,
				signatures: imageMediaTypeSignatures
			})) != null ? _a21 : mediaType;
			return {
				type: "file",
				mediaType: mediaType != null ? mediaType : "image/*",
				filename: void 0,
				data,
				providerOptions: part.providerOptions
			};
		case "file":
			if (mediaType == null) throw new Error(`Media type is missing for file part`);
			return {
				type: "file",
				mediaType,
				filename: part.filename,
				data,
				providerOptions: part.providerOptions
			};
	}
}
function mapToolResultOutput(output) {
	if (output.type !== "content") return output;
	return {
		type: "content",
		value: output.value.map((item) => {
			if (item.type !== "media") return item;
			if (item.mediaType.startsWith("image/")) return {
				type: "image-data",
				data: item.data,
				mediaType: item.mediaType
			};
			return {
				type: "file-data",
				data: item.data,
				mediaType: item.mediaType
			};
		})
	};
}
async function createToolModelOutput({ toolCallId, input, output, tool: tool2, errorMode }) {
	if (errorMode === "text") return {
		type: "error-text",
		value: getErrorMessage(output)
	};
	else if (errorMode === "json") return {
		type: "error-json",
		value: toJSONValue(output)
	};
	if (tool2 == null ? void 0 : tool2.toModelOutput) return await tool2.toModelOutput({
		toolCallId,
		input,
		output
	});
	return typeof output === "string" ? {
		type: "text",
		value: output
	} : {
		type: "json",
		value: toJSONValue(output)
	};
}
function toJSONValue(value) {
	return value === void 0 ? null : value;
}
function prepareCallSettings({ maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, seed, stopSequences }) {
	if (maxOutputTokens != null) {
		if (!Number.isInteger(maxOutputTokens)) throw new InvalidArgumentError({
			parameter: "maxOutputTokens",
			value: maxOutputTokens,
			message: "maxOutputTokens must be an integer"
		});
		if (maxOutputTokens < 1) throw new InvalidArgumentError({
			parameter: "maxOutputTokens",
			value: maxOutputTokens,
			message: "maxOutputTokens must be >= 1"
		});
	}
	if (temperature != null) {
		if (typeof temperature !== "number") throw new InvalidArgumentError({
			parameter: "temperature",
			value: temperature,
			message: "temperature must be a number"
		});
	}
	if (topP != null) {
		if (typeof topP !== "number") throw new InvalidArgumentError({
			parameter: "topP",
			value: topP,
			message: "topP must be a number"
		});
	}
	if (topK != null) {
		if (typeof topK !== "number") throw new InvalidArgumentError({
			parameter: "topK",
			value: topK,
			message: "topK must be a number"
		});
	}
	if (presencePenalty != null) {
		if (typeof presencePenalty !== "number") throw new InvalidArgumentError({
			parameter: "presencePenalty",
			value: presencePenalty,
			message: "presencePenalty must be a number"
		});
	}
	if (frequencyPenalty != null) {
		if (typeof frequencyPenalty !== "number") throw new InvalidArgumentError({
			parameter: "frequencyPenalty",
			value: frequencyPenalty,
			message: "frequencyPenalty must be a number"
		});
	}
	if (seed != null) {
		if (!Number.isInteger(seed)) throw new InvalidArgumentError({
			parameter: "seed",
			value: seed,
			message: "seed must be an integer"
		});
	}
	return {
		maxOutputTokens,
		temperature,
		topP,
		topK,
		presencePenalty,
		frequencyPenalty,
		stopSequences,
		seed
	};
}
function isNonEmptyObject(object2) {
	return object2 != null && Object.keys(object2).length > 0;
}
async function prepareToolsAndToolChoice({ tools, toolChoice, activeTools }) {
	if (!isNonEmptyObject(tools)) return {
		tools: void 0,
		toolChoice: void 0
	};
	const filteredTools = activeTools != null ? Object.entries(tools).filter(([name21]) => activeTools.includes(name21)) : Object.entries(tools);
	const languageModelTools = [];
	for (const [name21, tool2] of filteredTools) {
		const toolType = tool2.type;
		switch (toolType) {
			case void 0:
			case "dynamic":
			case "function":
				languageModelTools.push({
					type: "function",
					name: name21,
					description: tool2.description,
					inputSchema: await asSchema(tool2.inputSchema).jsonSchema,
					...tool2.inputExamples != null ? { inputExamples: tool2.inputExamples } : {},
					providerOptions: tool2.providerOptions,
					...tool2.strict != null ? { strict: tool2.strict } : {}
				});
				break;
			case "provider":
				languageModelTools.push({
					type: "provider",
					name: name21,
					id: tool2.id,
					args: tool2.args
				});
				break;
			default: throw new Error(`Unsupported tool type: ${toolType}`);
		}
	}
	return {
		tools: languageModelTools,
		toolChoice: toolChoice == null ? { type: "auto" } : typeof toolChoice === "string" ? { type: toolChoice } : {
			type: "tool",
			toolName: toolChoice.toolName
		}
	};
}
var jsonValueSchema = lazy(() => union([
	_null(),
	string(),
	number(),
	boolean(),
	record(string(), jsonValueSchema.optional()),
	array$1(jsonValueSchema)
]));
var providerMetadataSchema = record(string(), record(string(), jsonValueSchema.optional()));
var textPartSchema = object$1({
	type: literal("text"),
	text: string(),
	providerOptions: providerMetadataSchema.optional()
});
var imagePartSchema = object$1({
	type: literal("image"),
	image: union([dataContentSchema, _instanceof(URL)]),
	mediaType: string().optional(),
	providerOptions: providerMetadataSchema.optional()
});
var filePartSchema = object$1({
	type: literal("file"),
	data: union([dataContentSchema, _instanceof(URL)]),
	filename: string().optional(),
	mediaType: string(),
	providerOptions: providerMetadataSchema.optional()
});
var reasoningPartSchema = object$1({
	type: literal("reasoning"),
	text: string(),
	providerOptions: providerMetadataSchema.optional()
});
var toolCallPartSchema = object$1({
	type: literal("tool-call"),
	toolCallId: string(),
	toolName: string(),
	input: unknown(),
	providerOptions: providerMetadataSchema.optional(),
	providerExecuted: boolean().optional()
});
var outputSchema = discriminatedUnion("type", [
	object$1({
		type: literal("text"),
		value: string(),
		providerOptions: providerMetadataSchema.optional()
	}),
	object$1({
		type: literal("json"),
		value: jsonValueSchema,
		providerOptions: providerMetadataSchema.optional()
	}),
	object$1({
		type: literal("execution-denied"),
		reason: string().optional(),
		providerOptions: providerMetadataSchema.optional()
	}),
	object$1({
		type: literal("error-text"),
		value: string(),
		providerOptions: providerMetadataSchema.optional()
	}),
	object$1({
		type: literal("error-json"),
		value: jsonValueSchema,
		providerOptions: providerMetadataSchema.optional()
	}),
	object$1({
		type: literal("content"),
		value: array$1(union([
			object$1({
				type: literal("text"),
				text: string(),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("media"),
				data: string(),
				mediaType: string()
			}),
			object$1({
				type: literal("file-data"),
				data: string(),
				mediaType: string(),
				filename: string().optional(),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("file-url"),
				url: string(),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("file-id"),
				fileId: union([string(), record(string(), string())]),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("image-data"),
				data: string(),
				mediaType: string(),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("image-url"),
				url: string(),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("image-file-id"),
				fileId: union([string(), record(string(), string())]),
				providerOptions: providerMetadataSchema.optional()
			}),
			object$1({
				type: literal("custom"),
				providerOptions: providerMetadataSchema.optional()
			})
		]))
	})
]);
var toolResultPartSchema = object$1({
	type: literal("tool-result"),
	toolCallId: string(),
	toolName: string(),
	output: outputSchema,
	providerOptions: providerMetadataSchema.optional()
});
var toolApprovalRequestSchema = object$1({
	type: literal("tool-approval-request"),
	approvalId: string(),
	toolCallId: string()
});
var toolApprovalResponseSchema = object$1({
	type: literal("tool-approval-response"),
	approvalId: string(),
	approved: boolean(),
	reason: string().optional()
});
var systemModelMessageSchema = object$1({
	role: literal("system"),
	content: string(),
	providerOptions: providerMetadataSchema.optional()
});
var userModelMessageSchema = object$1({
	role: literal("user"),
	content: union([string(), array$1(union([
		textPartSchema,
		imagePartSchema,
		filePartSchema
	]))]),
	providerOptions: providerMetadataSchema.optional()
});
var assistantModelMessageSchema = object$1({
	role: literal("assistant"),
	content: union([string(), array$1(union([
		textPartSchema,
		filePartSchema,
		reasoningPartSchema,
		toolCallPartSchema,
		toolResultPartSchema,
		toolApprovalRequestSchema
	]))]),
	providerOptions: providerMetadataSchema.optional()
});
var toolModelMessageSchema = object$1({
	role: literal("tool"),
	content: array$1(union([toolResultPartSchema, toolApprovalResponseSchema])),
	providerOptions: providerMetadataSchema.optional()
});
var modelMessageSchema = union([
	systemModelMessageSchema,
	userModelMessageSchema,
	assistantModelMessageSchema,
	toolModelMessageSchema
]);
async function standardizePrompt({ allowSystemInMessages, system, prompt, messages }) {
	if (prompt == null && messages == null) throw new InvalidPromptError({
		prompt,
		message: "prompt or messages must be defined"
	});
	if (prompt != null && messages != null) throw new InvalidPromptError({
		prompt,
		message: "prompt and messages cannot be defined at the same time"
	});
	if (typeof system !== "string" && !asArray(system).every((message) => message.role === "system")) throw new InvalidPromptError({
		prompt,
		message: "system must be a string, SystemModelMessage, or array of SystemModelMessage"
	});
	if (prompt != null && typeof prompt === "string") messages = [{
		role: "user",
		content: prompt
	}];
	else if (prompt != null && Array.isArray(prompt)) messages = prompt;
	else if (messages == null) throw new InvalidPromptError({
		prompt,
		message: "prompt or messages must be defined"
	});
	if (messages.length === 0) throw new InvalidPromptError({
		prompt,
		message: "messages must not be empty"
	});
	if (messages.some((message) => message.role === "system")) {
		if (allowSystemInMessages === false) throw new InvalidPromptError({
			prompt,
			message: "System messages are not allowed in the prompt or messages fields. Use the system option instead."
		});
		if (allowSystemInMessages === void 0) console.warn("AI SDK Warning: System messages in the prompt or messages fields can be a security risk because they may enable prompt injection attacks. Use the system option instead when possible. Set allowSystemInMessages to true to suppress this warning, or false to throw an error.");
	}
	const validationResult = await safeValidateTypes({
		value: messages,
		schema: array$1(modelMessageSchema)
	});
	if (!validationResult.success) throw new InvalidPromptError({
		prompt,
		message: "The messages do not match the ModelMessage[] schema.",
		cause: validationResult.error
	});
	return {
		messages,
		system
	};
}
function wrapGatewayError(error) {
	if (!GatewayAuthenticationError.isInstance(error)) return error;
	const isProductionEnv = (process == null ? void 0 : process.env.NODE_ENV) === "production";
	const moreInfoURL = "https://ai-sdk.dev/unauthenticated-ai-gateway";
	if (isProductionEnv) return new AISDKError({
		name: "GatewayError",
		message: `Unauthenticated. Configure AI_GATEWAY_API_KEY or use a provider module. Learn more: ${moreInfoURL}`
	});
	return Object.assign(/* @__PURE__ */ new Error(`\x1B[1m\x1B[31mUnauthenticated request to AI Gateway.\x1B[0m

To authenticate, set the \x1B[33mAI_GATEWAY_API_KEY\x1B[0m environment variable with your API key.

Alternatively, you can use a provider module instead of the AI Gateway.

Learn more: \x1B[34m${moreInfoURL}\x1B[0m

`), { name: "GatewayAuthenticationError" });
}
function assembleOperationName({ operationId, telemetry }) {
	return {
		"operation.name": `${operationId}${(telemetry == null ? void 0 : telemetry.functionId) != null ? ` ${telemetry.functionId}` : ""}`,
		"resource.name": telemetry == null ? void 0 : telemetry.functionId,
		"ai.operationId": operationId,
		"ai.telemetry.functionId": telemetry == null ? void 0 : telemetry.functionId
	};
}
function getBaseTelemetryAttributes({ model, settings, telemetry, headers }) {
	var _a21;
	return {
		"ai.model.provider": model.provider,
		"ai.model.id": model.modelId,
		...Object.entries(settings).reduce((attributes, [key, value]) => {
			if (key === "timeout") {
				const totalTimeoutMs = getTotalTimeoutMs(value);
				if (totalTimeoutMs != null) attributes[`ai.settings.${key}`] = totalTimeoutMs;
			} else attributes[`ai.settings.${key}`] = value;
			return attributes;
		}, {}),
		...Object.entries((_a21 = telemetry == null ? void 0 : telemetry.metadata) != null ? _a21 : {}).reduce((attributes, [key, value]) => {
			attributes[`ai.telemetry.metadata.${key}`] = value;
			return attributes;
		}, {}),
		...Object.entries(headers != null ? headers : {}).reduce((attributes, [key, value]) => {
			if (value !== void 0) attributes[`ai.request.headers.${key}`] = value;
			return attributes;
		}, {})
	};
}
var noopTracer = {
	startSpan() {
		return noopSpan;
	},
	startActiveSpan(name21, arg1, arg2, arg3) {
		if (typeof arg1 === "function") return arg1(noopSpan);
		if (typeof arg2 === "function") return arg2(noopSpan);
		if (typeof arg3 === "function") return arg3(noopSpan);
	}
};
var noopSpan = {
	spanContext() {
		return noopSpanContext;
	},
	setAttribute() {
		return this;
	},
	setAttributes() {
		return this;
	},
	addEvent() {
		return this;
	},
	addLink() {
		return this;
	},
	addLinks() {
		return this;
	},
	setStatus() {
		return this;
	},
	updateName() {
		return this;
	},
	end() {
		return this;
	},
	isRecording() {
		return false;
	},
	recordException() {
		return this;
	}
};
var noopSpanContext = {
	traceId: "",
	spanId: "",
	traceFlags: 0
};
function getTracer({ isEnabled = false, tracer } = {}) {
	if (!isEnabled) return noopTracer;
	if (tracer) return tracer;
	return trace.getTracer("ai");
}
async function recordSpan({ name: name21, tracer, attributes, fn, endWhenDone = true }) {
	return tracer.startActiveSpan(name21, { attributes: await attributes }, async (span) => {
		const ctx = context.active();
		try {
			const result = await context.with(ctx, () => fn(span));
			if (endWhenDone) span.end();
			return result;
		} catch (error) {
			try {
				recordErrorOnSpan(span, error);
			} finally {
				span.end();
			}
			throw error;
		}
	});
}
function recordErrorOnSpan(span, error) {
	if (error instanceof Error) {
		span.recordException({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: error.message
		});
	} else span.setStatus({ code: SpanStatusCode.ERROR });
}
async function selectTelemetryAttributes({ telemetry, attributes }) {
	if ((telemetry == null ? void 0 : telemetry.isEnabled) !== true) return {};
	const resultAttributes = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (value == null) continue;
		if (typeof value === "object" && "input" in value && typeof value.input === "function") {
			if ((telemetry == null ? void 0 : telemetry.recordInputs) === false) continue;
			const result = await value.input();
			if (result != null) resultAttributes[key] = result;
			continue;
		}
		if (typeof value === "object" && "output" in value && typeof value.output === "function") {
			if ((telemetry == null ? void 0 : telemetry.recordOutputs) === false) continue;
			const result = await value.output();
			if (result != null) resultAttributes[key] = result;
			continue;
		}
		resultAttributes[key] = value;
	}
	return resultAttributes;
}
function stringifyForTelemetry(prompt) {
	return JSON.stringify(prompt.map((message) => ({
		...message,
		content: typeof message.content === "string" ? message.content : message.content.map((part) => part.type === "file" ? {
			...part,
			data: part.data instanceof Uint8Array ? convertDataContentToBase64String(part.data) : part.data
		} : part)
	})));
}
function registerTelemetryIntegration(integration) {
	if (!globalThis.AI_SDK_TELEMETRY_INTEGRATIONS) globalThis.AI_SDK_TELEMETRY_INTEGRATIONS = [];
	globalThis.AI_SDK_TELEMETRY_INTEGRATIONS.push(integration);
}
function getGlobalTelemetryIntegrations() {
	var _a21;
	return (_a21 = globalThis.AI_SDK_TELEMETRY_INTEGRATIONS) != null ? _a21 : [];
}
function bindTelemetryIntegration(integration) {
	var _a21, _b, _c, _d, _e, _f;
	return {
		onStart: (_a21 = integration.onStart) == null ? void 0 : _a21.bind(integration),
		onStepStart: (_b = integration.onStepStart) == null ? void 0 : _b.bind(integration),
		onToolCallStart: (_c = integration.onToolCallStart) == null ? void 0 : _c.bind(integration),
		onToolCallFinish: (_d = integration.onToolCallFinish) == null ? void 0 : _d.bind(integration),
		onStepFinish: (_e = integration.onStepFinish) == null ? void 0 : _e.bind(integration),
		onFinish: (_f = integration.onFinish) == null ? void 0 : _f.bind(integration)
	};
}
function getGlobalTelemetryIntegration() {
	const globalIntegrations = getGlobalTelemetryIntegrations();
	return (integrations) => {
		const localIntegrations = asArray(integrations);
		const allIntegrations = [...globalIntegrations, ...localIntegrations];
		function createTelemetryComposite(getListenerFromIntegration) {
			const listeners = allIntegrations.map(getListenerFromIntegration).filter(Boolean);
			return async (event) => {
				for (const listener of listeners) try {
					await listener(event);
				} catch (_ignored) {}
			};
		}
		return {
			onStart: createTelemetryComposite((integration) => integration.onStart),
			onStepStart: createTelemetryComposite((integration) => integration.onStepStart),
			onToolCallStart: createTelemetryComposite((integration) => integration.onToolCallStart),
			onToolCallFinish: createTelemetryComposite((integration) => integration.onToolCallFinish),
			onStepFinish: createTelemetryComposite((integration) => integration.onStepFinish),
			onFinish: createTelemetryComposite((integration) => integration.onFinish)
		};
	};
}
function asLanguageModelUsage(usage) {
	return {
		inputTokens: usage.inputTokens.total,
		inputTokenDetails: {
			noCacheTokens: usage.inputTokens.noCache,
			cacheReadTokens: usage.inputTokens.cacheRead,
			cacheWriteTokens: usage.inputTokens.cacheWrite
		},
		outputTokens: usage.outputTokens.total,
		outputTokenDetails: {
			textTokens: usage.outputTokens.text,
			reasoningTokens: usage.outputTokens.reasoning
		},
		totalTokens: addTokenCounts(usage.inputTokens.total, usage.outputTokens.total),
		raw: usage.raw,
		reasoningTokens: usage.outputTokens.reasoning,
		cachedInputTokens: usage.inputTokens.cacheRead
	};
}
function createNullLanguageModelUsage() {
	return {
		inputTokens: void 0,
		inputTokenDetails: {
			noCacheTokens: void 0,
			cacheReadTokens: void 0,
			cacheWriteTokens: void 0
		},
		outputTokens: void 0,
		outputTokenDetails: {
			textTokens: void 0,
			reasoningTokens: void 0
		},
		totalTokens: void 0,
		raw: void 0
	};
}
function addLanguageModelUsage(usage1, usage2) {
	var _a21, _b, _c, _d, _e, _f, _g, _h, _i, _j;
	return {
		inputTokens: addTokenCounts(usage1.inputTokens, usage2.inputTokens),
		inputTokenDetails: {
			noCacheTokens: addTokenCounts((_a21 = usage1.inputTokenDetails) == null ? void 0 : _a21.noCacheTokens, (_b = usage2.inputTokenDetails) == null ? void 0 : _b.noCacheTokens),
			cacheReadTokens: addTokenCounts((_c = usage1.inputTokenDetails) == null ? void 0 : _c.cacheReadTokens, (_d = usage2.inputTokenDetails) == null ? void 0 : _d.cacheReadTokens),
			cacheWriteTokens: addTokenCounts((_e = usage1.inputTokenDetails) == null ? void 0 : _e.cacheWriteTokens, (_f = usage2.inputTokenDetails) == null ? void 0 : _f.cacheWriteTokens)
		},
		outputTokens: addTokenCounts(usage1.outputTokens, usage2.outputTokens),
		outputTokenDetails: {
			textTokens: addTokenCounts((_g = usage1.outputTokenDetails) == null ? void 0 : _g.textTokens, (_h = usage2.outputTokenDetails) == null ? void 0 : _h.textTokens),
			reasoningTokens: addTokenCounts((_i = usage1.outputTokenDetails) == null ? void 0 : _i.reasoningTokens, (_j = usage2.outputTokenDetails) == null ? void 0 : _j.reasoningTokens)
		},
		totalTokens: addTokenCounts(usage1.totalTokens, usage2.totalTokens),
		reasoningTokens: addTokenCounts(usage1.reasoningTokens, usage2.reasoningTokens),
		cachedInputTokens: addTokenCounts(usage1.cachedInputTokens, usage2.cachedInputTokens)
	};
}
function addTokenCounts(tokenCount1, tokenCount2) {
	return tokenCount1 == null && tokenCount2 == null ? void 0 : (tokenCount1 != null ? tokenCount1 : 0) + (tokenCount2 != null ? tokenCount2 : 0);
}
function addImageModelUsage(usage1, usage2) {
	return {
		inputTokens: addTokenCounts(usage1.inputTokens, usage2.inputTokens),
		outputTokens: addTokenCounts(usage1.outputTokens, usage2.outputTokens),
		totalTokens: addTokenCounts(usage1.totalTokens, usage2.totalTokens)
	};
}
function mergeObjects(base, overrides) {
	if (base === void 0 && overrides === void 0) return;
	if (base === void 0) return overrides;
	if (overrides === void 0) return base;
	const result = { ...base };
	for (const key in overrides) {
		if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
		if (Object.prototype.hasOwnProperty.call(overrides, key)) {
			const overridesValue = overrides[key];
			if (overridesValue === void 0) continue;
			const baseValue = key in base ? base[key] : void 0;
			const isSourceObject = overridesValue !== null && typeof overridesValue === "object" && !Array.isArray(overridesValue) && !(overridesValue instanceof Date) && !(overridesValue instanceof RegExp);
			const isTargetObject = baseValue !== null && baseValue !== void 0 && typeof baseValue === "object" && !Array.isArray(baseValue) && !(baseValue instanceof Date) && !(baseValue instanceof RegExp);
			if (isSourceObject && isTargetObject) result[key] = mergeObjects(baseValue, overridesValue);
			else result[key] = overridesValue;
		}
	}
	return result;
}
function getRetryDelayInMs({ error, exponentialBackoffDelay }) {
	const headers = error.responseHeaders;
	if (!headers) return exponentialBackoffDelay;
	let ms;
	const retryAfterMs = headers["retry-after-ms"];
	if (retryAfterMs) {
		const timeoutMs = parseFloat(retryAfterMs);
		if (!Number.isNaN(timeoutMs)) ms = timeoutMs;
	}
	const retryAfter = headers["retry-after"];
	if (retryAfter && ms === void 0) {
		const timeoutSeconds = parseFloat(retryAfter);
		if (!Number.isNaN(timeoutSeconds)) ms = timeoutSeconds * 1e3;
		else ms = Date.parse(retryAfter) - Date.now();
	}
	if (ms != null && !Number.isNaN(ms) && 0 <= ms && (ms < 60 * 1e3 || ms < exponentialBackoffDelay)) return ms;
	return exponentialBackoffDelay;
}
var retryWithExponentialBackoffRespectingRetryHeaders = ({ maxRetries = 2, initialDelayInMs = 2e3, backoffFactor = 2, abortSignal } = {}) => async (f) => _retryWithExponentialBackoff(f, {
	maxRetries,
	delayInMs: initialDelayInMs,
	backoffFactor,
	abortSignal
});
async function _retryWithExponentialBackoff(f, { maxRetries, delayInMs, backoffFactor, abortSignal }, errors = []) {
	try {
		return await f();
	} catch (error) {
		if (isAbortError(error)) throw error;
		if (maxRetries === 0) throw error;
		const errorMessage = getErrorMessage$1(error);
		const newErrors = [...errors, error];
		const tryNumber = newErrors.length;
		if (tryNumber > maxRetries) throw new RetryError({
			message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
			reason: "maxRetriesExceeded",
			errors: newErrors
		});
		if (error instanceof Error && APICallError.isInstance(error) && error.isRetryable === true && tryNumber <= maxRetries) {
			await delay(getRetryDelayInMs({
				error,
				exponentialBackoffDelay: delayInMs
			}), { abortSignal });
			return _retryWithExponentialBackoff(f, {
				maxRetries,
				delayInMs: backoffFactor * delayInMs,
				backoffFactor,
				abortSignal
			}, newErrors);
		}
		if (tryNumber === 1) throw error;
		throw new RetryError({
			message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
			reason: "errorNotRetryable",
			errors: newErrors
		});
	}
}
function prepareRetries({ maxRetries, abortSignal }) {
	if (maxRetries != null) {
		if (!Number.isInteger(maxRetries)) throw new InvalidArgumentError({
			parameter: "maxRetries",
			value: maxRetries,
			message: "maxRetries must be an integer"
		});
		if (maxRetries < 0) throw new InvalidArgumentError({
			parameter: "maxRetries",
			value: maxRetries,
			message: "maxRetries must be >= 0"
		});
	}
	const maxRetriesResult = maxRetries != null ? maxRetries : 2;
	return {
		maxRetries: maxRetriesResult,
		retry: retryWithExponentialBackoffRespectingRetryHeaders({
			maxRetries: maxRetriesResult,
			abortSignal
		})
	};
}
function collectToolApprovals({ messages }) {
	const lastMessage = messages.at(-1);
	if ((lastMessage == null ? void 0 : lastMessage.role) != "tool") return {
		approvedToolApprovals: [],
		deniedToolApprovals: []
	};
	const toolCallsByToolCallId = {};
	for (const message of messages) if (message.role === "assistant" && typeof message.content !== "string") {
		const content = message.content;
		for (const part of content) if (part.type === "tool-call") toolCallsByToolCallId[part.toolCallId] = part;
	}
	const toolApprovalRequestsByApprovalId = {};
	for (const message of messages) if (message.role === "assistant" && typeof message.content !== "string") {
		const content = message.content;
		for (const part of content) if (part.type === "tool-approval-request") toolApprovalRequestsByApprovalId[part.approvalId] = part;
	}
	const toolResults = {};
	for (const part of lastMessage.content) if (part.type === "tool-result") toolResults[part.toolCallId] = part;
	const approvedToolApprovals = [];
	const deniedToolApprovals = [];
	const approvalResponses = lastMessage.content.filter((part) => part.type === "tool-approval-response");
	for (const approvalResponse of approvalResponses) {
		const approvalRequest = toolApprovalRequestsByApprovalId[approvalResponse.approvalId];
		if (approvalRequest == null) throw new InvalidToolApprovalError({ approvalId: approvalResponse.approvalId });
		if (toolResults[approvalRequest.toolCallId] != null) continue;
		const toolCall = toolCallsByToolCallId[approvalRequest.toolCallId];
		if (toolCall == null) throw new ToolCallNotFoundForApprovalError({
			toolCallId: approvalRequest.toolCallId,
			approvalId: approvalRequest.approvalId
		});
		const approval = {
			approvalRequest,
			approvalResponse,
			toolCall
		};
		if (approvalResponse.approved) approvedToolApprovals.push(approval);
		else deniedToolApprovals.push(approval);
	}
	return {
		approvedToolApprovals,
		deniedToolApprovals
	};
}
function now() {
	var _a21, _b;
	return (_b = (_a21 = globalThis == null ? void 0 : globalThis.performance) == null ? void 0 : _a21.now()) != null ? _b : Date.now();
}
async function executeToolCall({ toolCall, tools, tracer, telemetry, messages, abortSignal, experimental_context, stepNumber, model, onPreliminaryToolResult, onToolCallStart, onToolCallFinish }) {
	const { toolName, toolCallId, input } = toolCall;
	const tool2 = tools == null ? void 0 : tools[toolName];
	if ((tool2 == null ? void 0 : tool2.execute) == null) return;
	const baseCallbackEvent = {
		stepNumber,
		model,
		toolCall,
		messages,
		abortSignal,
		functionId: telemetry == null ? void 0 : telemetry.functionId,
		metadata: telemetry == null ? void 0 : telemetry.metadata,
		experimental_context
	};
	return recordSpan({
		name: "ai.toolCall",
		attributes: selectTelemetryAttributes({
			telemetry,
			attributes: {
				...assembleOperationName({
					operationId: "ai.toolCall",
					telemetry
				}),
				"ai.toolCall.name": toolName,
				"ai.toolCall.id": toolCallId,
				"ai.toolCall.args": { output: () => JSON.stringify(input) }
			}
		}),
		tracer,
		fn: async (span) => {
			let output;
			await notify({
				event: baseCallbackEvent,
				callbacks: onToolCallStart
			});
			const startTime = now();
			try {
				const stream = executeTool({
					execute: tool2.execute.bind(tool2),
					input,
					options: {
						toolCallId,
						messages,
						abortSignal,
						experimental_context
					}
				});
				for await (const part of stream) if (part.type === "preliminary") onPreliminaryToolResult?.({
					...toolCall,
					type: "tool-result",
					output: part.output,
					preliminary: true
				});
				else output = part.output;
			} catch (error) {
				const durationMs2 = now() - startTime;
				await notify({
					event: {
						...baseCallbackEvent,
						success: false,
						error,
						durationMs: durationMs2
					},
					callbacks: onToolCallFinish
				});
				recordErrorOnSpan(span, error);
				return {
					type: "tool-error",
					toolCallId,
					toolName,
					input,
					error,
					dynamic: tool2.type === "dynamic",
					...toolCall.providerMetadata != null ? { providerMetadata: toolCall.providerMetadata } : {}
				};
			}
			const durationMs = now() - startTime;
			await notify({
				event: {
					...baseCallbackEvent,
					success: true,
					output,
					durationMs
				},
				callbacks: onToolCallFinish
			});
			try {
				span.setAttributes(await selectTelemetryAttributes({
					telemetry,
					attributes: { "ai.toolCall.result": { output: () => JSON.stringify(output) } }
				}));
			} catch (ignored) {}
			return {
				type: "tool-result",
				toolCallId,
				toolName,
				input,
				output,
				dynamic: tool2.type === "dynamic",
				...toolCall.providerMetadata != null ? { providerMetadata: toolCall.providerMetadata } : {}
			};
		}
	});
}
function extractReasoningContent(content) {
	const parts = content.filter((content2) => content2.type === "reasoning");
	return parts.length === 0 ? void 0 : parts.map((content2) => content2.text).join("\n");
}
function extractTextContent(content) {
	const parts = content.filter((content2) => content2.type === "text");
	if (parts.length === 0) return;
	return parts.map((content2) => content2.text).join("");
}
var DefaultGeneratedFile = class {
	constructor({ data, mediaType }) {
		const isUint8Array = data instanceof Uint8Array;
		this.base64Data = isUint8Array ? void 0 : data;
		this.uint8ArrayData = isUint8Array ? data : void 0;
		this.mediaType = mediaType;
	}
	get base64() {
		if (this.base64Data == null) this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData);
		return this.base64Data;
	}
	get uint8Array() {
		if (this.uint8ArrayData == null) this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data);
		return this.uint8ArrayData;
	}
};
var DefaultGeneratedFileWithType = class extends DefaultGeneratedFile {
	constructor(options) {
		super(options);
		this.type = "file";
	}
};
async function isApprovalNeeded({ tool: tool2, toolCall, messages, experimental_context }) {
	if (tool2.needsApproval == null) return false;
	if (typeof tool2.needsApproval === "boolean") return tool2.needsApproval;
	return await tool2.needsApproval(toolCall.input, {
		toolCallId: toolCall.toolCallId,
		messages,
		experimental_context
	});
}
var output_exports = {};
__export(output_exports, {
	array: () => array,
	choice: () => choice,
	json: () => json,
	object: () => object,
	text: () => text
});
function fixJson(input) {
	const stack = ["ROOT"];
	let lastValidIndex = -1;
	let literalStart = null;
	function processValueStart(char, i, swapState) {
		switch (char) {
			case "\"":
				lastValidIndex = i;
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_STRING");
				break;
			case "f":
			case "t":
			case "n":
				lastValidIndex = i;
				literalStart = i;
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_LITERAL");
				break;
			case "-":
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_NUMBER");
				break;
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				lastValidIndex = i;
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_NUMBER");
				break;
			case "{":
				lastValidIndex = i;
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_OBJECT_START");
				break;
			case "[":
				lastValidIndex = i;
				stack.pop();
				stack.push(swapState);
				stack.push("INSIDE_ARRAY_START");
				break;
		}
	}
	function processAfterObjectValue(char, i) {
		switch (char) {
			case ",":
				stack.pop();
				stack.push("INSIDE_OBJECT_AFTER_COMMA");
				break;
			case "}":
				lastValidIndex = i;
				stack.pop();
				break;
		}
	}
	function processAfterArrayValue(char, i) {
		switch (char) {
			case ",":
				stack.pop();
				stack.push("INSIDE_ARRAY_AFTER_COMMA");
				break;
			case "]":
				lastValidIndex = i;
				stack.pop();
				break;
		}
	}
	for (let i = 0; i < input.length; i++) {
		const char = input[i];
		switch (stack[stack.length - 1]) {
			case "ROOT":
				processValueStart(char, i, "FINISH");
				break;
			case "INSIDE_OBJECT_START":
				switch (char) {
					case "\"":
						stack.pop();
						stack.push("INSIDE_OBJECT_KEY");
						break;
					case "}":
						lastValidIndex = i;
						stack.pop();
						break;
				}
				break;
			case "INSIDE_OBJECT_AFTER_COMMA":
				switch (char) {
					case "\"":
						stack.pop();
						stack.push("INSIDE_OBJECT_KEY");
						break;
				}
				break;
			case "INSIDE_OBJECT_KEY":
				switch (char) {
					case "\"":
						stack.pop();
						stack.push("INSIDE_OBJECT_AFTER_KEY");
						break;
				}
				break;
			case "INSIDE_OBJECT_AFTER_KEY":
				switch (char) {
					case ":":
						stack.pop();
						stack.push("INSIDE_OBJECT_BEFORE_VALUE");
						break;
				}
				break;
			case "INSIDE_OBJECT_BEFORE_VALUE":
				processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
				break;
			case "INSIDE_OBJECT_AFTER_VALUE":
				processAfterObjectValue(char, i);
				break;
			case "INSIDE_STRING":
				switch (char) {
					case "\"":
						stack.pop();
						lastValidIndex = i;
						break;
					case "\\":
						stack.push("INSIDE_STRING_ESCAPE");
						break;
					default: lastValidIndex = i;
				}
				break;
			case "INSIDE_ARRAY_START":
				switch (char) {
					case "]":
						lastValidIndex = i;
						stack.pop();
						break;
					default:
						lastValidIndex = i;
						processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
						break;
				}
				break;
			case "INSIDE_ARRAY_AFTER_VALUE":
				switch (char) {
					case ",":
						stack.pop();
						stack.push("INSIDE_ARRAY_AFTER_COMMA");
						break;
					case "]":
						lastValidIndex = i;
						stack.pop();
						break;
					default:
						lastValidIndex = i;
						break;
				}
				break;
			case "INSIDE_ARRAY_AFTER_COMMA":
				processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
				break;
			case "INSIDE_STRING_ESCAPE":
				stack.pop();
				lastValidIndex = i;
				break;
			case "INSIDE_NUMBER":
				switch (char) {
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						lastValidIndex = i;
						break;
					case "e":
					case "E":
					case "-":
					case ".": break;
					case ",":
						stack.pop();
						if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") processAfterArrayValue(char, i);
						if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") processAfterObjectValue(char, i);
						break;
					case "}":
						stack.pop();
						if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") processAfterObjectValue(char, i);
						break;
					case "]":
						stack.pop();
						if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") processAfterArrayValue(char, i);
						break;
					default:
						stack.pop();
						break;
				}
				break;
			case "INSIDE_LITERAL": {
				const partialLiteral = input.substring(literalStart, i + 1);
				if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
					stack.pop();
					if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") processAfterObjectValue(char, i);
					else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") processAfterArrayValue(char, i);
				} else lastValidIndex = i;
				break;
			}
		}
	}
	let result = input.slice(0, lastValidIndex + 1);
	for (let i = stack.length - 1; i >= 0; i--) switch (stack[i]) {
		case "INSIDE_STRING":
			result += "\"";
			break;
		case "INSIDE_OBJECT_KEY":
		case "INSIDE_OBJECT_AFTER_KEY":
		case "INSIDE_OBJECT_AFTER_COMMA":
		case "INSIDE_OBJECT_START":
		case "INSIDE_OBJECT_BEFORE_VALUE":
		case "INSIDE_OBJECT_AFTER_VALUE":
			result += "}";
			break;
		case "INSIDE_ARRAY_START":
		case "INSIDE_ARRAY_AFTER_COMMA":
		case "INSIDE_ARRAY_AFTER_VALUE":
			result += "]";
			break;
		case "INSIDE_LITERAL": {
			const partialLiteral = input.substring(literalStart, input.length);
			if ("true".startsWith(partialLiteral)) result += "true".slice(partialLiteral.length);
			else if ("false".startsWith(partialLiteral)) result += "false".slice(partialLiteral.length);
			else if ("null".startsWith(partialLiteral)) result += "null".slice(partialLiteral.length);
		}
	}
	return result;
}
async function parsePartialJson(jsonText) {
	if (jsonText === void 0) return {
		value: void 0,
		state: "undefined-input"
	};
	let result = await safeParseJSON({ text: jsonText });
	if (result.success) return {
		value: result.value,
		state: "successful-parse"
	};
	result = await safeParseJSON({ text: fixJson(jsonText) });
	if (result.success) return {
		value: result.value,
		state: "repaired-parse"
	};
	return {
		value: void 0,
		state: "failed-parse"
	};
}
var text = () => ({
	name: "text",
	responseFormat: Promise.resolve({ type: "text" }),
	async parseCompleteOutput({ text: text2 }) {
		return text2;
	},
	async parsePartialOutput({ text: text2 }) {
		return { partial: text2 };
	},
	createElementStreamTransform() {}
});
var object = ({ schema: inputSchema, name: name21, description }) => {
	const schema = asSchema(inputSchema);
	return {
		name: "object",
		responseFormat: resolve(schema.jsonSchema).then((jsonSchema2) => ({
			type: "json",
			schema: jsonSchema2,
			...name21 != null && { name: name21 },
			...description != null && { description }
		})),
		async parseCompleteOutput({ text: text2 }, context2) {
			const parseResult = await safeParseJSON({ text: text2 });
			if (!parseResult.success) throw new NoObjectGeneratedError({
				message: "No object generated: could not parse the response.",
				cause: parseResult.error,
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			const validationResult = await safeValidateTypes({
				value: parseResult.value,
				schema
			});
			if (!validationResult.success) throw new NoObjectGeneratedError({
				message: "No object generated: response did not match schema.",
				cause: validationResult.error,
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			return validationResult.value;
		},
		async parsePartialOutput({ text: text2 }) {
			const result = await parsePartialJson(text2);
			switch (result.state) {
				case "failed-parse":
				case "undefined-input": return;
				case "repaired-parse":
				case "successful-parse": return { partial: result.value };
			}
		},
		createElementStreamTransform() {}
	};
};
var array = ({ element: inputElementSchema, name: name21, description }) => {
	const elementSchema = asSchema(inputElementSchema);
	return {
		name: "array",
		responseFormat: resolve(elementSchema.jsonSchema).then((jsonSchema2) => {
			const { $schema, ...itemSchema } = jsonSchema2;
			return {
				type: "json",
				schema: {
					$schema: "http://json-schema.org/draft-07/schema#",
					type: "object",
					properties: { elements: {
						type: "array",
						items: itemSchema
					} },
					required: ["elements"],
					additionalProperties: false
				},
				...name21 != null && { name: name21 },
				...description != null && { description }
			};
		}),
		async parseCompleteOutput({ text: text2 }, context2) {
			const parseResult = await safeParseJSON({ text: text2 });
			if (!parseResult.success) throw new NoObjectGeneratedError({
				message: "No object generated: could not parse the response.",
				cause: parseResult.error,
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			const outerValue = parseResult.value;
			if (outerValue == null || typeof outerValue !== "object" || !("elements" in outerValue) || !Array.isArray(outerValue.elements)) throw new NoObjectGeneratedError({
				message: "No object generated: response did not match schema.",
				cause: new TypeValidationError({
					value: outerValue,
					cause: "response must be an object with an elements array"
				}),
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			for (const element of outerValue.elements) {
				const validationResult = await safeValidateTypes({
					value: element,
					schema: elementSchema
				});
				if (!validationResult.success) throw new NoObjectGeneratedError({
					message: "No object generated: response did not match schema.",
					cause: validationResult.error,
					text: text2,
					response: context2.response,
					usage: context2.usage,
					finishReason: context2.finishReason
				});
			}
			return outerValue.elements;
		},
		async parsePartialOutput({ text: text2 }) {
			const result = await parsePartialJson(text2);
			switch (result.state) {
				case "failed-parse":
				case "undefined-input": return;
				case "repaired-parse":
				case "successful-parse": {
					const outerValue = result.value;
					if (outerValue == null || typeof outerValue !== "object" || !("elements" in outerValue) || !Array.isArray(outerValue.elements)) return;
					const rawElements = result.state === "repaired-parse" && outerValue.elements.length > 0 ? outerValue.elements.slice(0, -1) : outerValue.elements;
					const parsedElements = [];
					for (const rawElement of rawElements) {
						const validationResult = await safeValidateTypes({
							value: rawElement,
							schema: elementSchema
						});
						if (validationResult.success) parsedElements.push(validationResult.value);
					}
					return { partial: parsedElements };
				}
			}
		},
		createElementStreamTransform() {
			let publishedElements = 0;
			return new TransformStream({ transform({ partialOutput }, controller) {
				if (partialOutput != null) for (; publishedElements < partialOutput.length; publishedElements++) controller.enqueue(partialOutput[publishedElements]);
			} });
		}
	};
};
var choice = ({ options: choiceOptions, name: name21, description }) => {
	return {
		name: "choice",
		responseFormat: Promise.resolve({
			type: "json",
			schema: {
				$schema: "http://json-schema.org/draft-07/schema#",
				type: "object",
				properties: { result: {
					type: "string",
					enum: choiceOptions
				} },
				required: ["result"],
				additionalProperties: false
			},
			...name21 != null && { name: name21 },
			...description != null && { description }
		}),
		async parseCompleteOutput({ text: text2 }, context2) {
			const parseResult = await safeParseJSON({ text: text2 });
			if (!parseResult.success) throw new NoObjectGeneratedError({
				message: "No object generated: could not parse the response.",
				cause: parseResult.error,
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			const outerValue = parseResult.value;
			if (outerValue == null || typeof outerValue !== "object" || !("result" in outerValue) || typeof outerValue.result !== "string" || !choiceOptions.includes(outerValue.result)) throw new NoObjectGeneratedError({
				message: "No object generated: response did not match schema.",
				cause: new TypeValidationError({
					value: outerValue,
					cause: "response must be an object that contains a choice value."
				}),
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			return outerValue.result;
		},
		async parsePartialOutput({ text: text2 }) {
			const result = await parsePartialJson(text2);
			switch (result.state) {
				case "failed-parse":
				case "undefined-input": return;
				case "repaired-parse":
				case "successful-parse": {
					const outerValue = result.value;
					if (outerValue == null || typeof outerValue !== "object" || !("result" in outerValue) || typeof outerValue.result !== "string") return;
					const potentialMatches = choiceOptions.filter((choiceOption) => choiceOption.startsWith(outerValue.result));
					if (result.state === "successful-parse") return potentialMatches.includes(outerValue.result) ? { partial: outerValue.result } : void 0;
					else return potentialMatches.length === 1 ? { partial: potentialMatches[0] } : void 0;
				}
			}
		},
		createElementStreamTransform() {}
	};
};
var json = ({ name: name21, description } = {}) => {
	return {
		name: "json",
		responseFormat: Promise.resolve({
			type: "json",
			...name21 != null && { name: name21 },
			...description != null && { description }
		}),
		async parseCompleteOutput({ text: text2 }, context2) {
			const parseResult = await safeParseJSON({ text: text2 });
			if (!parseResult.success) throw new NoObjectGeneratedError({
				message: "No object generated: could not parse the response.",
				cause: parseResult.error,
				text: text2,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			});
			return parseResult.value;
		},
		async parsePartialOutput({ text: text2 }) {
			const result = await parsePartialJson(text2);
			switch (result.state) {
				case "failed-parse":
				case "undefined-input": return;
				case "repaired-parse":
				case "successful-parse": return result.value === void 0 ? void 0 : { partial: result.value };
			}
		},
		createElementStreamTransform() {}
	};
};
function mergeToolProviderMetadata(toolMetadata, callMetadata) {
	if (toolMetadata == null) return callMetadata;
	if (callMetadata == null) return toolMetadata;
	return {
		...toolMetadata,
		...callMetadata
	};
}
async function parseToolCall({ toolCall, tools, repairToolCall, system, messages }) {
	var _a21, _b;
	try {
		if (tools == null) {
			if (toolCall.providerExecuted && toolCall.dynamic) return await parseProviderExecutedDynamicToolCall(toolCall);
			throw new NoSuchToolError({ toolName: toolCall.toolName });
		}
		try {
			return await doParseToolCall({
				toolCall,
				tools
			});
		} catch (error) {
			if (repairToolCall == null || !(NoSuchToolError.isInstance(error) || InvalidToolInputError.isInstance(error))) throw error;
			let repairedToolCall = null;
			try {
				repairedToolCall = await repairToolCall({
					toolCall,
					tools,
					inputSchema: async ({ toolName }) => {
						const { inputSchema } = tools[toolName];
						return await asSchema(inputSchema).jsonSchema;
					},
					system,
					messages,
					error
				});
			} catch (repairError) {
				throw new ToolCallRepairError({
					cause: repairError,
					originalError: error
				});
			}
			if (repairedToolCall == null) throw error;
			return await doParseToolCall({
				toolCall: repairedToolCall,
				tools
			});
		}
	} catch (error) {
		const parsedInput = await safeParseJSON({ text: toolCall.input });
		const input = parsedInput.success ? parsedInput.value : toolCall.input;
		return {
			type: "tool-call",
			toolCallId: toolCall.toolCallId,
			toolName: toolCall.toolName,
			input,
			dynamic: true,
			invalid: true,
			error,
			title: (_a21 = tools == null ? void 0 : tools[toolCall.toolName]) == null ? void 0 : _a21.title,
			providerExecuted: toolCall.providerExecuted,
			providerMetadata: mergeToolProviderMetadata((_b = tools == null ? void 0 : tools[toolCall.toolName]) == null ? void 0 : _b.providerMetadata, toolCall.providerMetadata)
		};
	}
}
async function parseProviderExecutedDynamicToolCall(toolCall) {
	const parseResult = toolCall.input.trim() === "" ? {
		success: true,
		value: {}
	} : await safeParseJSON({ text: toolCall.input });
	if (parseResult.success === false) throw new InvalidToolInputError({
		toolName: toolCall.toolName,
		toolInput: toolCall.input,
		cause: parseResult.error
	});
	return {
		type: "tool-call",
		toolCallId: toolCall.toolCallId,
		toolName: toolCall.toolName,
		input: parseResult.value,
		providerExecuted: true,
		dynamic: true,
		providerMetadata: toolCall.providerMetadata
	};
}
async function doParseToolCall({ toolCall, tools }) {
	const toolName = toolCall.toolName;
	const tool2 = tools[toolName];
	if (tool2 == null) {
		if (toolCall.providerExecuted && toolCall.dynamic) return await parseProviderExecutedDynamicToolCall(toolCall);
		throw new NoSuchToolError({
			toolName: toolCall.toolName,
			availableTools: Object.keys(tools)
		});
	}
	const schema = asSchema(tool2.inputSchema);
	const parseResult = toolCall.input.trim() === "" ? await safeValidateTypes({
		value: {},
		schema
	}) : await safeParseJSON({
		text: toolCall.input,
		schema
	});
	if (parseResult.success === false) throw new InvalidToolInputError({
		toolName,
		toolInput: toolCall.input,
		cause: parseResult.error
	});
	const mergedProviderMetadata = mergeToolProviderMetadata(tool2.providerMetadata, toolCall.providerMetadata);
	return tool2.type === "dynamic" ? {
		type: "tool-call",
		toolCallId: toolCall.toolCallId,
		toolName: toolCall.toolName,
		input: parseResult.value,
		providerExecuted: toolCall.providerExecuted,
		providerMetadata: mergedProviderMetadata,
		dynamic: true,
		title: tool2.title
	} : {
		type: "tool-call",
		toolCallId: toolCall.toolCallId,
		toolName,
		input: parseResult.value,
		providerExecuted: toolCall.providerExecuted,
		providerMetadata: mergedProviderMetadata,
		title: tool2.title
	};
}
var DefaultStepResult = class {
	constructor({ stepNumber, model, functionId, metadata, experimental_context, content, finishReason, rawFinishReason, usage, warnings, request, response, providerMetadata }) {
		this.stepNumber = stepNumber;
		this.model = model;
		this.functionId = functionId;
		this.metadata = metadata;
		this.experimental_context = experimental_context;
		this.content = content;
		this.finishReason = finishReason;
		this.rawFinishReason = rawFinishReason;
		this.usage = usage;
		this.warnings = warnings;
		this.request = request;
		this.response = response;
		this.providerMetadata = providerMetadata;
	}
	get text() {
		return this.content.filter((part) => part.type === "text").map((part) => part.text).join("");
	}
	get reasoning() {
		return this.content.filter((part) => part.type === "reasoning");
	}
	get reasoningText() {
		return this.reasoning.length === 0 ? void 0 : this.reasoning.map((part) => part.text).join("");
	}
	get files() {
		return this.content.filter((part) => part.type === "file").map((part) => part.file);
	}
	get sources() {
		return this.content.filter((part) => part.type === "source");
	}
	get toolCalls() {
		return this.content.filter((part) => part.type === "tool-call");
	}
	get staticToolCalls() {
		return this.toolCalls.filter((toolCall) => toolCall.dynamic !== true);
	}
	get dynamicToolCalls() {
		return this.toolCalls.filter((toolCall) => toolCall.dynamic === true);
	}
	get toolResults() {
		return this.content.filter((part) => part.type === "tool-result");
	}
	get staticToolResults() {
		return this.toolResults.filter((toolResult) => toolResult.dynamic !== true);
	}
	get dynamicToolResults() {
		return this.toolResults.filter((toolResult) => toolResult.dynamic === true);
	}
};
function stepCountIs(stepCount) {
	return ({ steps }) => steps.length === stepCount;
}
function isLoopFinished() {
	return () => false;
}
function hasToolCall(toolName) {
	return ({ steps }) => {
		var _a21, _b, _c;
		return (_c = (_b = (_a21 = steps[steps.length - 1]) == null ? void 0 : _a21.toolCalls) == null ? void 0 : _b.some((toolCall) => toolCall.toolName === toolName)) != null ? _c : false;
	};
}
async function isStopConditionMet({ stopConditions, steps }) {
	return (await Promise.all(stopConditions.map((condition) => condition({ steps })))).some((result) => result);
}
async function toResponseMessages({ content: inputContent, tools }) {
	const responseMessages = [];
	const content = [];
	for (const part of inputContent) {
		if (part.type === "source") continue;
		if ((part.type === "tool-result" || part.type === "tool-error") && !part.providerExecuted) continue;
		if (part.type === "text" && part.text.length === 0) continue;
		switch (part.type) {
			case "text":
				content.push({
					type: "text",
					text: part.text,
					providerOptions: part.providerMetadata
				});
				break;
			case "reasoning":
				content.push({
					type: "reasoning",
					text: part.text,
					providerOptions: part.providerMetadata
				});
				break;
			case "file":
				content.push({
					type: "file",
					data: part.file.base64,
					mediaType: part.file.mediaType,
					providerOptions: part.providerMetadata
				});
				break;
			case "tool-call":
				content.push({
					type: "tool-call",
					toolCallId: part.toolCallId,
					toolName: part.toolName,
					input: part.invalid && typeof part.input !== "object" ? {} : part.input,
					providerExecuted: part.providerExecuted,
					providerOptions: part.providerMetadata
				});
				break;
			case "tool-result": {
				const output = await createToolModelOutput({
					toolCallId: part.toolCallId,
					input: part.input,
					tool: tools == null ? void 0 : tools[part.toolName],
					output: part.output,
					errorMode: "none"
				});
				content.push({
					type: "tool-result",
					toolCallId: part.toolCallId,
					toolName: part.toolName,
					output,
					providerOptions: part.providerMetadata
				});
				break;
			}
			case "tool-error": {
				const output = await createToolModelOutput({
					toolCallId: part.toolCallId,
					input: part.input,
					tool: tools == null ? void 0 : tools[part.toolName],
					output: part.error,
					errorMode: "json"
				});
				content.push({
					type: "tool-result",
					toolCallId: part.toolCallId,
					toolName: part.toolName,
					output,
					providerOptions: part.providerMetadata
				});
				break;
			}
			case "tool-approval-request":
				content.push({
					type: "tool-approval-request",
					approvalId: part.approvalId,
					toolCallId: part.toolCall.toolCallId
				});
				break;
		}
	}
	if (content.length > 0) responseMessages.push({
		role: "assistant",
		content
	});
	const toolResultContent = [];
	for (const part of inputContent) {
		if (!(part.type === "tool-result" || part.type === "tool-error") || part.providerExecuted) continue;
		const output = await createToolModelOutput({
			toolCallId: part.toolCallId,
			input: part.input,
			tool: tools == null ? void 0 : tools[part.toolName],
			output: part.type === "tool-result" ? part.output : part.error,
			errorMode: part.type === "tool-error" ? "text" : "none"
		});
		toolResultContent.push({
			type: "tool-result",
			toolCallId: part.toolCallId,
			toolName: part.toolName,
			output,
			...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
		});
	}
	if (toolResultContent.length > 0) responseMessages.push({
		role: "tool",
		content: toolResultContent
	});
	return responseMessages;
}
function mergeAbortSignals(...signals) {
	const validSignals = signals.filter((signal) => signal != null);
	if (validSignals.length === 0) return;
	if (validSignals.length === 1) return validSignals[0];
	const controller = new AbortController();
	for (const signal of validSignals) {
		if (signal.aborted) {
			controller.abort(signal.reason);
			return controller.signal;
		}
		signal.addEventListener("abort", () => {
			controller.abort(signal.reason);
		}, { once: true });
	}
	return controller.signal;
}
var originalGenerateId = createIdGenerator({
	prefix: "aitxt",
	size: 24
});
async function generateText({ model: modelArg, tools, toolChoice, system, prompt, messages, allowSystemInMessages, maxRetries: maxRetriesArg, abortSignal, timeout, headers, stopWhen = stepCountIs(1), experimental_output, output = experimental_output, experimental_telemetry: telemetry, providerOptions, experimental_activeTools, activeTools = experimental_activeTools, experimental_prepareStep, prepareStep = experimental_prepareStep, experimental_repairToolCall: repairToolCall, experimental_download: download2, experimental_context, experimental_include: include, _internal: { generateId: generateId2 = originalGenerateId } = {}, experimental_onStart: onStart, experimental_onStepStart: onStepStart, experimental_onToolCallStart: onToolCallStart, experimental_onToolCallFinish: onToolCallFinish, onStepFinish, onFinish, ...settings }) {
	const model = resolveLanguageModel(modelArg);
	const createGlobalTelemetry = getGlobalTelemetryIntegration();
	const stopConditions = asArray(stopWhen);
	const totalTimeoutMs = getTotalTimeoutMs(timeout);
	const stepTimeoutMs = getStepTimeoutMs(timeout);
	const stepAbortController = stepTimeoutMs != null ? new AbortController() : void 0;
	const mergedAbortSignal = mergeAbortSignals(abortSignal, totalTimeoutMs != null ? AbortSignal.timeout(totalTimeoutMs) : void 0, stepAbortController == null ? void 0 : stepAbortController.signal);
	const { maxRetries, retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal: mergedAbortSignal
	});
	const callSettings = prepareCallSettings(settings);
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const baseTelemetryAttributes = getBaseTelemetryAttributes({
		model,
		telemetry,
		headers: headersWithUserAgent,
		settings: {
			...callSettings,
			maxRetries
		}
	});
	const modelInfo = {
		provider: model.provider,
		modelId: model.modelId
	};
	const initialPrompt = await standardizePrompt({
		system,
		prompt,
		messages,
		allowSystemInMessages
	});
	const globalTelemetry = createGlobalTelemetry(telemetry == null ? void 0 : telemetry.integrations);
	await notify({
		event: {
			model: modelInfo,
			system,
			prompt,
			messages,
			tools,
			toolChoice,
			activeTools,
			maxOutputTokens: callSettings.maxOutputTokens,
			temperature: callSettings.temperature,
			topP: callSettings.topP,
			topK: callSettings.topK,
			presencePenalty: callSettings.presencePenalty,
			frequencyPenalty: callSettings.frequencyPenalty,
			stopSequences: callSettings.stopSequences,
			seed: callSettings.seed,
			maxRetries,
			timeout,
			headers,
			providerOptions,
			stopWhen,
			output,
			abortSignal,
			include,
			functionId: telemetry == null ? void 0 : telemetry.functionId,
			metadata: telemetry == null ? void 0 : telemetry.metadata,
			experimental_context
		},
		callbacks: [onStart, globalTelemetry.onStart]
	});
	const tracer = getTracer(telemetry);
	try {
		return await recordSpan({
			name: "ai.generateText",
			attributes: selectTelemetryAttributes({
				telemetry,
				attributes: {
					...assembleOperationName({
						operationId: "ai.generateText",
						telemetry
					}),
					...baseTelemetryAttributes,
					"ai.model.provider": model.provider,
					"ai.model.id": model.modelId,
					"ai.prompt": { input: () => JSON.stringify({
						system,
						prompt,
						messages
					}) }
				}
			}),
			tracer,
			fn: async (span) => {
				var _a21, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
				const initialMessages = initialPrompt.messages;
				const responseMessages = [];
				const { approvedToolApprovals, deniedToolApprovals } = collectToolApprovals({ messages: initialMessages });
				const localApprovedToolApprovals = approvedToolApprovals.filter((toolApproval) => !toolApproval.toolCall.providerExecuted);
				if (deniedToolApprovals.length > 0 || localApprovedToolApprovals.length > 0) {
					const toolOutputs = await executeTools({
						toolCalls: localApprovedToolApprovals.map((toolApproval) => toolApproval.toolCall),
						tools,
						tracer,
						telemetry,
						messages: initialMessages,
						abortSignal: mergedAbortSignal,
						experimental_context,
						stepNumber: 0,
						model: modelInfo,
						onToolCallStart: [onToolCallStart, globalTelemetry.onToolCallStart],
						onToolCallFinish: [onToolCallFinish, globalTelemetry.onToolCallFinish]
					});
					const toolContent = [];
					for (const output2 of toolOutputs) {
						const modelOutput = await createToolModelOutput({
							toolCallId: output2.toolCallId,
							input: output2.input,
							tool: tools == null ? void 0 : tools[output2.toolName],
							output: output2.type === "tool-result" ? output2.output : output2.error,
							errorMode: output2.type === "tool-error" ? "text" : "none"
						});
						toolContent.push({
							type: "tool-result",
							toolCallId: output2.toolCallId,
							toolName: output2.toolName,
							output: modelOutput
						});
					}
					for (const toolApproval of deniedToolApprovals) toolContent.push({
						type: "tool-result",
						toolCallId: toolApproval.toolCall.toolCallId,
						toolName: toolApproval.toolCall.toolName,
						output: {
							type: "execution-denied",
							reason: toolApproval.approvalResponse.reason,
							...toolApproval.toolCall.providerExecuted && { providerOptions: { openai: { approvalId: toolApproval.approvalResponse.approvalId } } }
						}
					});
					responseMessages.push({
						role: "tool",
						content: toolContent
					});
				}
				const callSettings2 = prepareCallSettings(settings);
				let currentModelResponse;
				let clientToolCalls = [];
				let clientToolOutputs = [];
				const steps = [];
				const pendingDeferredToolCalls = /* @__PURE__ */ new Map();
				do {
					const stepTimeoutId = stepTimeoutMs != null ? setTimeout(() => stepAbortController.abort(), stepTimeoutMs) : void 0;
					try {
						const stepInputMessages = [...initialMessages, ...responseMessages];
						const prepareStepResult = await (prepareStep == null ? void 0 : prepareStep({
							model,
							steps,
							stepNumber: steps.length,
							messages: stepInputMessages,
							experimental_context
						}));
						const stepModel = resolveLanguageModel((_a21 = prepareStepResult == null ? void 0 : prepareStepResult.model) != null ? _a21 : model);
						const stepModelInfo = {
							provider: stepModel.provider,
							modelId: stepModel.modelId
						};
						const promptMessages = await convertToLanguageModelPrompt({
							prompt: {
								system: (_b = prepareStepResult == null ? void 0 : prepareStepResult.system) != null ? _b : initialPrompt.system,
								messages: (_c = prepareStepResult == null ? void 0 : prepareStepResult.messages) != null ? _c : stepInputMessages
							},
							supportedUrls: await stepModel.supportedUrls,
							download: download2
						});
						experimental_context = (_d = prepareStepResult == null ? void 0 : prepareStepResult.experimental_context) != null ? _d : experimental_context;
						const stepActiveTools = (_e = prepareStepResult == null ? void 0 : prepareStepResult.activeTools) != null ? _e : activeTools;
						const { toolChoice: stepToolChoice, tools: stepTools } = await prepareToolsAndToolChoice({
							tools,
							toolChoice: (_f = prepareStepResult == null ? void 0 : prepareStepResult.toolChoice) != null ? _f : toolChoice,
							activeTools: stepActiveTools
						});
						const stepMessages = (_g = prepareStepResult == null ? void 0 : prepareStepResult.messages) != null ? _g : stepInputMessages;
						const stepSystem = (_h = prepareStepResult == null ? void 0 : prepareStepResult.system) != null ? _h : initialPrompt.system;
						const stepProviderOptions = mergeObjects(providerOptions, prepareStepResult == null ? void 0 : prepareStepResult.providerOptions);
						await notify({
							event: {
								stepNumber: steps.length,
								model: stepModelInfo,
								system: stepSystem,
								messages: stepMessages,
								tools,
								toolChoice: stepToolChoice,
								activeTools: stepActiveTools,
								steps: [...steps],
								providerOptions: stepProviderOptions,
								timeout,
								headers,
								stopWhen,
								output,
								abortSignal,
								include,
								functionId: telemetry == null ? void 0 : telemetry.functionId,
								metadata: telemetry == null ? void 0 : telemetry.metadata,
								experimental_context
							},
							callbacks: [onStepStart, globalTelemetry.onStepStart]
						});
						currentModelResponse = await retry(() => {
							var _a22;
							return recordSpan({
								name: "ai.generateText.doGenerate",
								attributes: selectTelemetryAttributes({
									telemetry,
									attributes: {
										...assembleOperationName({
											operationId: "ai.generateText.doGenerate",
											telemetry
										}),
										...baseTelemetryAttributes,
										"ai.model.provider": stepModel.provider,
										"ai.model.id": stepModel.modelId,
										"ai.prompt.messages": { input: () => stringifyForTelemetry(promptMessages) },
										"ai.prompt.tools": { input: () => stepTools == null ? void 0 : stepTools.map((tool2) => JSON.stringify(tool2)) },
										"ai.prompt.toolChoice": { input: () => stepToolChoice != null ? JSON.stringify(stepToolChoice) : void 0 },
										"gen_ai.system": stepModel.provider,
										"gen_ai.request.model": stepModel.modelId,
										"gen_ai.request.frequency_penalty": settings.frequencyPenalty,
										"gen_ai.request.max_tokens": settings.maxOutputTokens,
										"gen_ai.request.presence_penalty": settings.presencePenalty,
										"gen_ai.request.stop_sequences": settings.stopSequences,
										"gen_ai.request.temperature": (_a22 = settings.temperature) != null ? _a22 : void 0,
										"gen_ai.request.top_k": settings.topK,
										"gen_ai.request.top_p": settings.topP
									}
								}),
								tracer,
								fn: async (span2) => {
									var _a23, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
									const result = await stepModel.doGenerate({
										...callSettings2,
										tools: stepTools,
										toolChoice: stepToolChoice,
										responseFormat: await (output == null ? void 0 : output.responseFormat),
										prompt: promptMessages,
										providerOptions: stepProviderOptions,
										abortSignal: mergedAbortSignal,
										headers: headersWithUserAgent
									});
									const responseData = {
										id: (_b2 = (_a23 = result.response) == null ? void 0 : _a23.id) != null ? _b2 : generateId2(),
										timestamp: (_d2 = (_c2 = result.response) == null ? void 0 : _c2.timestamp) != null ? _d2 : /* @__PURE__ */ new Date(),
										modelId: (_f2 = (_e2 = result.response) == null ? void 0 : _e2.modelId) != null ? _f2 : stepModel.modelId,
										headers: (_g2 = result.response) == null ? void 0 : _g2.headers,
										body: (_h2 = result.response) == null ? void 0 : _h2.body
									};
									const usage = asLanguageModelUsage(result.usage);
									span2.setAttributes(await selectTelemetryAttributes({
										telemetry,
										attributes: {
											"ai.response.finishReason": result.finishReason.unified,
											"ai.response.text": { output: () => extractTextContent(result.content) },
											"ai.response.reasoning": { output: () => extractReasoningContent(result.content) },
											"ai.response.toolCalls": { output: () => {
												const toolCalls = asToolCalls(result.content);
												return toolCalls == null ? void 0 : JSON.stringify(toolCalls);
											} },
											"ai.response.id": responseData.id,
											"ai.response.model": responseData.modelId,
											"ai.response.timestamp": responseData.timestamp.toISOString(),
											"ai.response.providerMetadata": JSON.stringify(result.providerMetadata),
											"ai.usage.inputTokens": result.usage.inputTokens.total,
											"ai.usage.inputTokenDetails.noCacheTokens": result.usage.inputTokens.noCache,
											"ai.usage.inputTokenDetails.cacheReadTokens": result.usage.inputTokens.cacheRead,
											"ai.usage.inputTokenDetails.cacheWriteTokens": result.usage.inputTokens.cacheWrite,
											"ai.usage.outputTokens": result.usage.outputTokens.total,
											"ai.usage.outputTokenDetails.textTokens": result.usage.outputTokens.text,
											"ai.usage.outputTokenDetails.reasoningTokens": result.usage.outputTokens.reasoning,
											"ai.usage.totalTokens": usage.totalTokens,
											"ai.usage.reasoningTokens": result.usage.outputTokens.reasoning,
											"ai.usage.cachedInputTokens": result.usage.inputTokens.cacheRead,
											"gen_ai.response.finish_reasons": [result.finishReason.unified],
											"gen_ai.response.id": responseData.id,
											"gen_ai.response.model": responseData.modelId,
											"gen_ai.usage.input_tokens": result.usage.inputTokens.total,
											"gen_ai.usage.output_tokens": result.usage.outputTokens.total
										}
									}));
									return {
										...result,
										response: responseData
									};
								}
							});
						});
						const stepToolCalls = await Promise.all(currentModelResponse.content.filter((part) => part.type === "tool-call").map((toolCall) => parseToolCall({
							toolCall,
							tools,
							repairToolCall,
							system,
							messages: stepInputMessages
						})));
						const toolApprovalRequests = {};
						for (const toolCall of stepToolCalls) {
							if (toolCall.invalid) continue;
							const tool2 = tools == null ? void 0 : tools[toolCall.toolName];
							if (tool2 == null) continue;
							if ((tool2 == null ? void 0 : tool2.onInputAvailable) != null) await tool2.onInputAvailable({
								input: toolCall.input,
								toolCallId: toolCall.toolCallId,
								messages: stepInputMessages,
								abortSignal: mergedAbortSignal,
								experimental_context
							});
							if (await isApprovalNeeded({
								tool: tool2,
								toolCall,
								messages: stepInputMessages,
								experimental_context
							})) toolApprovalRequests[toolCall.toolCallId] = {
								type: "tool-approval-request",
								approvalId: generateId2(),
								toolCall
							};
						}
						const invalidToolCalls = stepToolCalls.filter((toolCall) => toolCall.invalid && toolCall.dynamic);
						clientToolOutputs = [];
						for (const toolCall of invalidToolCalls) clientToolOutputs.push({
							type: "tool-error",
							toolCallId: toolCall.toolCallId,
							toolName: toolCall.toolName,
							input: toolCall.input,
							error: getErrorMessage$1(toolCall.error),
							dynamic: true
						});
						clientToolCalls = stepToolCalls.filter((toolCall) => !toolCall.providerExecuted);
						if (tools != null) clientToolOutputs.push(...await executeTools({
							toolCalls: clientToolCalls.filter((toolCall) => !toolCall.invalid && toolApprovalRequests[toolCall.toolCallId] == null),
							tools,
							tracer,
							telemetry,
							messages: stepInputMessages,
							abortSignal: mergedAbortSignal,
							experimental_context,
							stepNumber: steps.length,
							model: stepModelInfo,
							onToolCallStart: [onToolCallStart, globalTelemetry.onToolCallStart],
							onToolCallFinish: [onToolCallFinish, globalTelemetry.onToolCallFinish]
						}));
						for (const toolCall of stepToolCalls) {
							if (!toolCall.providerExecuted) continue;
							const tool2 = tools == null ? void 0 : tools[toolCall.toolName];
							if ((tool2 == null ? void 0 : tool2.type) === "provider" && tool2.supportsDeferredResults) {
								if (!currentModelResponse.content.some((part) => part.type === "tool-result" && part.toolCallId === toolCall.toolCallId)) pendingDeferredToolCalls.set(toolCall.toolCallId, { toolName: toolCall.toolName });
							}
						}
						for (const part of currentModelResponse.content) if (part.type === "tool-result") pendingDeferredToolCalls.delete(part.toolCallId);
						const stepContent = asContent({
							content: currentModelResponse.content,
							toolCalls: stepToolCalls,
							toolOutputs: clientToolOutputs,
							toolApprovalRequests: Object.values(toolApprovalRequests),
							tools
						});
						responseMessages.push(...await toResponseMessages({
							content: stepContent,
							tools
						}));
						const stepRequest = ((_i = include == null ? void 0 : include.requestBody) != null ? _i : true) ? (_j = currentModelResponse.request) != null ? _j : {} : {
							...currentModelResponse.request,
							body: void 0
						};
						const stepResponse = {
							...currentModelResponse.response,
							messages: structuredClone(responseMessages),
							body: ((_k = include == null ? void 0 : include.responseBody) != null ? _k : true) ? (_l = currentModelResponse.response) == null ? void 0 : _l.body : void 0
						};
						const stepNumber = steps.length;
						const currentStepResult = new DefaultStepResult({
							stepNumber,
							model: stepModelInfo,
							functionId: telemetry == null ? void 0 : telemetry.functionId,
							metadata: telemetry == null ? void 0 : telemetry.metadata,
							experimental_context,
							content: stepContent,
							finishReason: currentModelResponse.finishReason.unified,
							rawFinishReason: currentModelResponse.finishReason.raw,
							usage: asLanguageModelUsage(currentModelResponse.usage),
							warnings: currentModelResponse.warnings,
							providerMetadata: currentModelResponse.providerMetadata,
							request: stepRequest,
							response: stepResponse
						});
						logWarnings({
							warnings: (_m = currentModelResponse.warnings) != null ? _m : [],
							provider: stepModelInfo.provider,
							model: stepModelInfo.modelId
						});
						steps.push(currentStepResult);
						await notify({
							event: currentStepResult,
							callbacks: [onStepFinish, globalTelemetry.onStepFinish]
						});
					} finally {
						if (stepTimeoutId != null) clearTimeout(stepTimeoutId);
					}
				} while ((clientToolCalls.length > 0 && clientToolOutputs.length === clientToolCalls.length || pendingDeferredToolCalls.size > 0) && !await isStopConditionMet({
					stopConditions,
					steps
				}));
				span.setAttributes(await selectTelemetryAttributes({
					telemetry,
					attributes: {
						"ai.response.finishReason": currentModelResponse.finishReason.unified,
						"ai.response.text": { output: () => extractTextContent(currentModelResponse.content) },
						"ai.response.reasoning": { output: () => extractReasoningContent(currentModelResponse.content) },
						"ai.response.toolCalls": { output: () => {
							const toolCalls = asToolCalls(currentModelResponse.content);
							return toolCalls == null ? void 0 : JSON.stringify(toolCalls);
						} },
						"ai.response.providerMetadata": JSON.stringify(currentModelResponse.providerMetadata)
					}
				}));
				const lastStep = steps[steps.length - 1];
				const totalUsage = steps.reduce((totalUsage2, step) => {
					return addLanguageModelUsage(totalUsage2, step.usage);
				}, {
					inputTokens: void 0,
					outputTokens: void 0,
					totalTokens: void 0,
					reasoningTokens: void 0,
					cachedInputTokens: void 0
				});
				span.setAttributes(await selectTelemetryAttributes({
					telemetry,
					attributes: {
						"ai.usage.inputTokens": totalUsage.inputTokens,
						"ai.usage.inputTokenDetails.noCacheTokens": (_n = totalUsage.inputTokenDetails) == null ? void 0 : _n.noCacheTokens,
						"ai.usage.inputTokenDetails.cacheReadTokens": (_o = totalUsage.inputTokenDetails) == null ? void 0 : _o.cacheReadTokens,
						"ai.usage.inputTokenDetails.cacheWriteTokens": (_p = totalUsage.inputTokenDetails) == null ? void 0 : _p.cacheWriteTokens,
						"ai.usage.outputTokens": totalUsage.outputTokens,
						"ai.usage.outputTokenDetails.textTokens": (_q = totalUsage.outputTokenDetails) == null ? void 0 : _q.textTokens,
						"ai.usage.outputTokenDetails.reasoningTokens": (_r = totalUsage.outputTokenDetails) == null ? void 0 : _r.reasoningTokens,
						"ai.usage.totalTokens": totalUsage.totalTokens,
						"ai.usage.reasoningTokens": (_s = totalUsage.outputTokenDetails) == null ? void 0 : _s.reasoningTokens,
						"ai.usage.cachedInputTokens": (_t = totalUsage.inputTokenDetails) == null ? void 0 : _t.cacheReadTokens
					}
				}));
				await notify({
					event: {
						stepNumber: lastStep.stepNumber,
						model: lastStep.model,
						functionId: lastStep.functionId,
						metadata: lastStep.metadata,
						experimental_context: lastStep.experimental_context,
						finishReason: lastStep.finishReason,
						rawFinishReason: lastStep.rawFinishReason,
						usage: lastStep.usage,
						content: lastStep.content,
						text: lastStep.text,
						reasoningText: lastStep.reasoningText,
						reasoning: lastStep.reasoning,
						files: lastStep.files,
						sources: lastStep.sources,
						toolCalls: lastStep.toolCalls,
						staticToolCalls: lastStep.staticToolCalls,
						dynamicToolCalls: lastStep.dynamicToolCalls,
						toolResults: lastStep.toolResults,
						staticToolResults: lastStep.staticToolResults,
						dynamicToolResults: lastStep.dynamicToolResults,
						request: lastStep.request,
						response: lastStep.response,
						warnings: lastStep.warnings,
						providerMetadata: lastStep.providerMetadata,
						steps,
						totalUsage
					},
					callbacks: [onFinish, globalTelemetry.onFinish]
				});
				let resolvedOutput;
				if (lastStep.finishReason === "stop") resolvedOutput = await (output != null ? output : text()).parseCompleteOutput({ text: lastStep.text }, {
					response: lastStep.response,
					usage: lastStep.usage,
					finishReason: lastStep.finishReason
				});
				return new DefaultGenerateTextResult({
					steps,
					totalUsage,
					output: resolvedOutput
				});
			}
		});
	} catch (error) {
		throw wrapGatewayError(error);
	}
}
async function executeTools({ toolCalls, tools, tracer, telemetry, messages, abortSignal, experimental_context, stepNumber, model, onToolCallStart, onToolCallFinish }) {
	return (await Promise.all(toolCalls.map(async (toolCall) => executeToolCall({
		toolCall,
		tools,
		tracer,
		telemetry,
		messages,
		abortSignal,
		experimental_context,
		stepNumber,
		model,
		onToolCallStart,
		onToolCallFinish
	})))).filter((output) => output != null);
}
var DefaultGenerateTextResult = class {
	constructor(options) {
		this.steps = options.steps;
		this._output = options.output;
		this.totalUsage = options.totalUsage;
	}
	get finalStep() {
		return this.steps[this.steps.length - 1];
	}
	get content() {
		return this.finalStep.content;
	}
	get text() {
		return this.finalStep.text;
	}
	get files() {
		return this.finalStep.files;
	}
	get reasoningText() {
		return this.finalStep.reasoningText;
	}
	get reasoning() {
		return this.finalStep.reasoning;
	}
	get toolCalls() {
		return this.finalStep.toolCalls;
	}
	get staticToolCalls() {
		return this.finalStep.staticToolCalls;
	}
	get dynamicToolCalls() {
		return this.finalStep.dynamicToolCalls;
	}
	get toolResults() {
		return this.finalStep.toolResults;
	}
	get staticToolResults() {
		return this.finalStep.staticToolResults;
	}
	get dynamicToolResults() {
		return this.finalStep.dynamicToolResults;
	}
	get sources() {
		return this.finalStep.sources;
	}
	get finishReason() {
		return this.finalStep.finishReason;
	}
	get rawFinishReason() {
		return this.finalStep.rawFinishReason;
	}
	get warnings() {
		return this.finalStep.warnings;
	}
	get providerMetadata() {
		return this.finalStep.providerMetadata;
	}
	get response() {
		return this.finalStep.response;
	}
	get request() {
		return this.finalStep.request;
	}
	get usage() {
		return this.finalStep.usage;
	}
	get experimental_output() {
		return this.output;
	}
	get output() {
		if (this._output == null) throw new NoOutputGeneratedError();
		return this._output;
	}
};
function asToolCalls(content) {
	const parts = content.filter((part) => part.type === "tool-call");
	if (parts.length === 0) return;
	return parts.map((toolCall) => ({
		toolCallId: toolCall.toolCallId,
		toolName: toolCall.toolName,
		input: toolCall.input
	}));
}
function asContent({ content, toolCalls, toolOutputs, toolApprovalRequests, tools }) {
	const contentParts = [];
	for (const part of content) switch (part.type) {
		case "text":
		case "reasoning":
		case "source":
			contentParts.push(part);
			break;
		case "file":
			contentParts.push({
				type: "file",
				file: new DefaultGeneratedFile(part),
				...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
			});
			break;
		case "tool-call":
			contentParts.push(toolCalls.find((toolCall) => toolCall.toolCallId === part.toolCallId));
			break;
		case "tool-result": {
			const toolCall = toolCalls.find((toolCall2) => toolCall2.toolCallId === part.toolCallId);
			if (toolCall == null) {
				const tool2 = tools == null ? void 0 : tools[part.toolName];
				if (!((tool2 == null ? void 0 : tool2.type) === "provider" && tool2.supportsDeferredResults)) throw new Error(`Tool call ${part.toolCallId} not found.`);
				if (part.isError) contentParts.push({
					type: "tool-error",
					toolCallId: part.toolCallId,
					toolName: part.toolName,
					input: void 0,
					error: part.result,
					providerExecuted: true,
					dynamic: part.dynamic,
					...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
				});
				else contentParts.push({
					type: "tool-result",
					toolCallId: part.toolCallId,
					toolName: part.toolName,
					input: void 0,
					output: part.result,
					providerExecuted: true,
					dynamic: part.dynamic,
					...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
				});
				break;
			}
			if (part.isError) contentParts.push({
				type: "tool-error",
				toolCallId: part.toolCallId,
				toolName: part.toolName,
				input: toolCall.input,
				error: part.result,
				providerExecuted: true,
				dynamic: toolCall.dynamic,
				...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
			});
			else contentParts.push({
				type: "tool-result",
				toolCallId: part.toolCallId,
				toolName: part.toolName,
				input: toolCall.input,
				output: part.result,
				providerExecuted: true,
				dynamic: toolCall.dynamic,
				...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
			});
			break;
		}
		case "tool-approval-request": {
			const toolCall = toolCalls.find((toolCall2) => toolCall2.toolCallId === part.toolCallId);
			if (toolCall == null) throw new ToolCallNotFoundForApprovalError({
				toolCallId: part.toolCallId,
				approvalId: part.approvalId
			});
			contentParts.push({
				type: "tool-approval-request",
				approvalId: part.approvalId,
				toolCall
			});
			break;
		}
	}
	return [
		...contentParts,
		...toolOutputs,
		...toolApprovalRequests
	];
}
function prepareHeaders(headers, defaultHeaders) {
	const responseHeaders = new Headers(headers != null ? headers : {});
	for (const [key, value] of Object.entries(defaultHeaders)) if (!responseHeaders.has(key)) responseHeaders.set(key, value);
	return responseHeaders;
}
function createTextStreamResponse({ status, statusText, headers, textStream }) {
	return new Response(textStream.pipeThrough(new TextEncoderStream()), {
		status: status != null ? status : 200,
		statusText,
		headers: prepareHeaders(headers, { "content-type": "text/plain; charset=utf-8" })
	});
}
function writeToServerResponse({ response, status, statusText, headers, stream }) {
	const statusCode = status != null ? status : 200;
	if (statusText !== void 0) response.writeHead(statusCode, statusText, headers);
	else response.writeHead(statusCode, headers);
	const reader = stream.getReader();
	const read = async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (!response.write(value)) await new Promise((resolve3) => {
					response.once("drain", resolve3);
				});
			}
		} catch (error) {
			throw error;
		} finally {
			response.end();
		}
	};
	read();
}
function pipeTextStreamToResponse({ response, status, statusText, headers, textStream }) {
	writeToServerResponse({
		response,
		status,
		statusText,
		headers: Object.fromEntries(prepareHeaders(headers, { "content-type": "text/plain; charset=utf-8" }).entries()),
		stream: textStream.pipeThrough(new TextEncoderStream())
	});
}
var JsonToSseTransformStream = class extends TransformStream {
	constructor() {
		super({
			transform(part, controller) {
				controller.enqueue(`data: ${JSON.stringify(part)}

`);
			},
			flush(controller) {
				controller.enqueue("data: [DONE]\n\n");
			}
		});
	}
};
var UI_MESSAGE_STREAM_HEADERS = {
	"content-type": "text/event-stream",
	"cache-control": "no-cache",
	connection: "keep-alive",
	"x-vercel-ai-ui-message-stream": "v1",
	"x-accel-buffering": "no"
};
function createUIMessageStreamResponse({ status, statusText, headers, stream, consumeSseStream }) {
	let sseStream = stream.pipeThrough(new JsonToSseTransformStream());
	if (consumeSseStream) {
		const [stream1, stream2] = sseStream.tee();
		sseStream = stream1;
		consumeSseStream({ stream: stream2 });
	}
	return new Response(sseStream.pipeThrough(new TextEncoderStream()), {
		status,
		statusText,
		headers: prepareHeaders(headers, UI_MESSAGE_STREAM_HEADERS)
	});
}
function getResponseUIMessageId({ originalMessages, responseMessageId }) {
	if (originalMessages == null) return;
	const lastMessage = originalMessages[originalMessages.length - 1];
	return (lastMessage == null ? void 0 : lastMessage.role) === "assistant" ? lastMessage.id : typeof responseMessageId === "function" ? responseMessageId() : responseMessageId;
}
var uiMessageChunkSchema = lazySchema(() => zodSchema(union([
	strictObject({
		type: literal("text-start"),
		id: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("text-delta"),
		id: string(),
		delta: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("text-end"),
		id: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("error"),
		errorText: string()
	}),
	strictObject({
		type: literal("tool-input-start"),
		toolCallId: string(),
		toolName: string(),
		providerExecuted: boolean().optional(),
		providerMetadata: providerMetadataSchema.optional(),
		dynamic: boolean().optional(),
		title: string().optional()
	}),
	strictObject({
		type: literal("tool-input-delta"),
		toolCallId: string(),
		inputTextDelta: string()
	}),
	strictObject({
		type: literal("tool-input-available"),
		toolCallId: string(),
		toolName: string(),
		input: unknown(),
		providerExecuted: boolean().optional(),
		providerMetadata: providerMetadataSchema.optional(),
		dynamic: boolean().optional(),
		title: string().optional()
	}),
	strictObject({
		type: literal("tool-input-error"),
		toolCallId: string(),
		toolName: string(),
		input: unknown(),
		providerExecuted: boolean().optional(),
		providerMetadata: providerMetadataSchema.optional(),
		dynamic: boolean().optional(),
		errorText: string(),
		title: string().optional()
	}),
	strictObject({
		type: literal("tool-approval-request"),
		approvalId: string(),
		toolCallId: string()
	}),
	strictObject({
		type: literal("tool-output-available"),
		toolCallId: string(),
		output: unknown(),
		providerExecuted: boolean().optional(),
		providerMetadata: providerMetadataSchema.optional(),
		dynamic: boolean().optional(),
		preliminary: boolean().optional()
	}),
	strictObject({
		type: literal("tool-output-error"),
		toolCallId: string(),
		errorText: string(),
		providerExecuted: boolean().optional(),
		providerMetadata: providerMetadataSchema.optional(),
		dynamic: boolean().optional()
	}),
	strictObject({
		type: literal("tool-output-denied"),
		toolCallId: string()
	}),
	strictObject({
		type: literal("reasoning-start"),
		id: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("reasoning-delta"),
		id: string(),
		delta: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("reasoning-end"),
		id: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("source-url"),
		sourceId: string(),
		url: string(),
		title: string().optional(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("source-document"),
		sourceId: string(),
		mediaType: string(),
		title: string(),
		filename: string().optional(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: literal("file"),
		url: string(),
		mediaType: string(),
		providerMetadata: providerMetadataSchema.optional()
	}),
	strictObject({
		type: custom((value) => typeof value === "string" && value.startsWith("data-"), { message: "Type must start with \"data-\"" }),
		id: string().optional(),
		data: unknown(),
		transient: boolean().optional()
	}),
	strictObject({ type: literal("start-step") }),
	strictObject({ type: literal("finish-step") }),
	strictObject({
		type: literal("start"),
		messageId: string().optional(),
		messageMetadata: unknown().optional()
	}),
	strictObject({
		type: literal("finish"),
		finishReason: _enum([
			"stop",
			"length",
			"content-filter",
			"tool-calls",
			"error",
			"other"
		]).optional(),
		messageMetadata: unknown().optional()
	}),
	strictObject({
		type: literal("abort"),
		reason: string().optional()
	}),
	strictObject({
		type: literal("message-metadata"),
		messageMetadata: unknown()
	})
])));
function isDataUIMessageChunk(chunk) {
	return chunk.type.startsWith("data-");
}
function isDataUIPart(part) {
	return part.type.startsWith("data-");
}
function isTextUIPart(part) {
	return part.type === "text";
}
function isFileUIPart(part) {
	return part.type === "file";
}
function isReasoningUIPart(part) {
	return part.type === "reasoning";
}
function isStaticToolUIPart(part) {
	return part.type.startsWith("tool-");
}
function isDynamicToolUIPart(part) {
	return part.type === "dynamic-tool";
}
function isToolUIPart(part) {
	return isStaticToolUIPart(part) || isDynamicToolUIPart(part);
}
var isToolOrDynamicToolUIPart = isToolUIPart;
function getStaticToolName(part) {
	return part.type.split("-").slice(1).join("-");
}
function getToolName(part) {
	return isDynamicToolUIPart(part) ? part.toolName : getStaticToolName(part);
}
var getToolOrDynamicToolName = getToolName;
function createStreamingUIMessageState({ lastMessage, messageId }) {
	return {
		message: (lastMessage == null ? void 0 : lastMessage.role) === "assistant" ? lastMessage : {
			id: messageId,
			metadata: void 0,
			role: "assistant",
			parts: []
		},
		activeTextParts: {},
		activeReasoningParts: {},
		partialToolCalls: {}
	};
}
function processUIMessageStream({ stream, messageMetadataSchema, dataPartSchemas, runUpdateMessageJob, onError, onToolCall, onData }) {
	return stream.pipeThrough(new TransformStream({ async transform(chunk, controller) {
		await runUpdateMessageJob(async ({ state, write }) => {
			var _a21, _b, _c, _d;
			function getToolInvocation(toolCallId) {
				const toolInvocation = state.message.parts.filter(isToolUIPart).find((invocation) => invocation.toolCallId === toolCallId);
				if (toolInvocation == null) throw new UIMessageStreamError({
					chunkType: "tool-invocation",
					chunkId: toolCallId,
					message: `No tool invocation found for tool call ID "${toolCallId}".`
				});
				return toolInvocation;
			}
			function updateToolPart(options) {
				var _a22;
				const part = state.message.parts.find((part2) => isStaticToolUIPart(part2) && part2.toolCallId === options.toolCallId);
				const anyOptions = options;
				const anyPart = part;
				if (part != null) {
					part.state = options.state;
					anyPart.input = anyOptions.input;
					anyPart.output = anyOptions.output;
					anyPart.errorText = anyOptions.errorText;
					anyPart.rawInput = anyOptions.rawInput;
					anyPart.preliminary = anyOptions.preliminary;
					if (options.title !== void 0) anyPart.title = options.title;
					anyPart.providerExecuted = (_a22 = anyOptions.providerExecuted) != null ? _a22 : part.providerExecuted;
					const providerMetadata = anyOptions.providerMetadata;
					if (providerMetadata != null) if (options.state === "output-available" || options.state === "output-error") {
						const resultPart = part;
						resultPart.resultProviderMetadata = providerMetadata;
					} else part.callProviderMetadata = providerMetadata;
				} else state.message.parts.push({
					type: `tool-${options.toolName}`,
					toolCallId: options.toolCallId,
					state: options.state,
					title: options.title,
					input: anyOptions.input,
					output: anyOptions.output,
					rawInput: anyOptions.rawInput,
					errorText: anyOptions.errorText,
					providerExecuted: anyOptions.providerExecuted,
					preliminary: anyOptions.preliminary,
					...anyOptions.providerMetadata != null && (options.state === "output-available" || options.state === "output-error") ? { resultProviderMetadata: anyOptions.providerMetadata } : {},
					...anyOptions.providerMetadata != null && !(options.state === "output-available" || options.state === "output-error") ? { callProviderMetadata: anyOptions.providerMetadata } : {}
				});
			}
			function updateDynamicToolPart(options) {
				var _a22, _b2;
				const part = state.message.parts.find((part2) => part2.type === "dynamic-tool" && part2.toolCallId === options.toolCallId);
				const anyOptions = options;
				const anyPart = part;
				if (part != null) {
					part.state = options.state;
					anyPart.toolName = options.toolName;
					anyPart.input = anyOptions.input;
					anyPart.output = anyOptions.output;
					anyPart.errorText = anyOptions.errorText;
					anyPart.rawInput = (_a22 = anyOptions.rawInput) != null ? _a22 : anyPart.rawInput;
					anyPart.preliminary = anyOptions.preliminary;
					if (options.title !== void 0) anyPart.title = options.title;
					anyPart.providerExecuted = (_b2 = anyOptions.providerExecuted) != null ? _b2 : part.providerExecuted;
					const providerMetadata = anyOptions.providerMetadata;
					if (providerMetadata != null) if (options.state === "output-available" || options.state === "output-error") {
						const resultPart = part;
						resultPart.resultProviderMetadata = providerMetadata;
					} else part.callProviderMetadata = providerMetadata;
				} else state.message.parts.push({
					type: "dynamic-tool",
					toolName: options.toolName,
					toolCallId: options.toolCallId,
					state: options.state,
					input: anyOptions.input,
					output: anyOptions.output,
					errorText: anyOptions.errorText,
					preliminary: anyOptions.preliminary,
					providerExecuted: anyOptions.providerExecuted,
					title: options.title,
					...anyOptions.providerMetadata != null && (options.state === "output-available" || options.state === "output-error") ? { resultProviderMetadata: anyOptions.providerMetadata } : {},
					...anyOptions.providerMetadata != null && !(options.state === "output-available" || options.state === "output-error") ? { callProviderMetadata: anyOptions.providerMetadata } : {}
				});
			}
			async function updateMessageMetadata(metadata) {
				if (metadata != null) {
					const mergedMetadata = state.message.metadata != null ? mergeObjects(state.message.metadata, metadata) : metadata;
					if (messageMetadataSchema != null) await validateTypes({
						value: mergedMetadata,
						schema: messageMetadataSchema,
						context: {
							field: "message.metadata",
							entityId: state.message.id
						}
					});
					state.message.metadata = mergedMetadata;
				}
			}
			switch (chunk.type) {
				case "text-start": {
					const textPart = {
						type: "text",
						text: "",
						providerMetadata: chunk.providerMetadata,
						state: "streaming"
					};
					state.activeTextParts[chunk.id] = textPart;
					state.message.parts.push(textPart);
					write();
					break;
				}
				case "text-delta": {
					const textPart = state.activeTextParts[chunk.id];
					if (textPart == null) throw new UIMessageStreamError({
						chunkType: "text-delta",
						chunkId: chunk.id,
						message: `Received text-delta for missing text part with ID "${chunk.id}". Ensure a "text-start" chunk is sent before any "text-delta" chunks.`
					});
					textPart.text += chunk.delta;
					textPart.providerMetadata = (_a21 = chunk.providerMetadata) != null ? _a21 : textPart.providerMetadata;
					write();
					break;
				}
				case "text-end": {
					const textPart = state.activeTextParts[chunk.id];
					if (textPart == null) throw new UIMessageStreamError({
						chunkType: "text-end",
						chunkId: chunk.id,
						message: `Received text-end for missing text part with ID "${chunk.id}". Ensure a "text-start" chunk is sent before any "text-end" chunks.`
					});
					textPart.state = "done";
					textPart.providerMetadata = (_b = chunk.providerMetadata) != null ? _b : textPart.providerMetadata;
					delete state.activeTextParts[chunk.id];
					write();
					break;
				}
				case "reasoning-start": {
					const reasoningPart = {
						type: "reasoning",
						text: "",
						providerMetadata: chunk.providerMetadata,
						state: "streaming"
					};
					state.activeReasoningParts[chunk.id] = reasoningPart;
					state.message.parts.push(reasoningPart);
					write();
					break;
				}
				case "reasoning-delta": {
					const reasoningPart = state.activeReasoningParts[chunk.id];
					if (reasoningPart == null) throw new UIMessageStreamError({
						chunkType: "reasoning-delta",
						chunkId: chunk.id,
						message: `Received reasoning-delta for missing reasoning part with ID "${chunk.id}". Ensure a "reasoning-start" chunk is sent before any "reasoning-delta" chunks.`
					});
					reasoningPart.text += chunk.delta;
					reasoningPart.providerMetadata = (_c = chunk.providerMetadata) != null ? _c : reasoningPart.providerMetadata;
					write();
					break;
				}
				case "reasoning-end": {
					const reasoningPart = state.activeReasoningParts[chunk.id];
					if (reasoningPart == null) throw new UIMessageStreamError({
						chunkType: "reasoning-end",
						chunkId: chunk.id,
						message: `Received reasoning-end for missing reasoning part with ID "${chunk.id}". Ensure a "reasoning-start" chunk is sent before any "reasoning-end" chunks.`
					});
					reasoningPart.providerMetadata = (_d = chunk.providerMetadata) != null ? _d : reasoningPart.providerMetadata;
					reasoningPart.state = "done";
					delete state.activeReasoningParts[chunk.id];
					write();
					break;
				}
				case "file":
					state.message.parts.push({
						type: "file",
						mediaType: chunk.mediaType,
						url: chunk.url,
						...chunk.providerMetadata != null ? { providerMetadata: chunk.providerMetadata } : {}
					});
					write();
					break;
				case "source-url":
					state.message.parts.push({
						type: "source-url",
						sourceId: chunk.sourceId,
						url: chunk.url,
						title: chunk.title,
						providerMetadata: chunk.providerMetadata
					});
					write();
					break;
				case "source-document":
					state.message.parts.push({
						type: "source-document",
						sourceId: chunk.sourceId,
						mediaType: chunk.mediaType,
						title: chunk.title,
						filename: chunk.filename,
						providerMetadata: chunk.providerMetadata
					});
					write();
					break;
				case "tool-input-start": {
					const toolInvocations = state.message.parts.filter(isStaticToolUIPart);
					state.partialToolCalls[chunk.toolCallId] = {
						text: "",
						toolName: chunk.toolName,
						index: toolInvocations.length,
						dynamic: chunk.dynamic,
						title: chunk.title
					};
					if (chunk.dynamic) updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "input-streaming",
						input: void 0,
						providerExecuted: chunk.providerExecuted,
						title: chunk.title,
						providerMetadata: chunk.providerMetadata
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "input-streaming",
						input: void 0,
						providerExecuted: chunk.providerExecuted,
						title: chunk.title,
						providerMetadata: chunk.providerMetadata
					});
					write();
					break;
				}
				case "tool-input-delta": {
					const partialToolCall = state.partialToolCalls[chunk.toolCallId];
					if (partialToolCall == null) throw new UIMessageStreamError({
						chunkType: "tool-input-delta",
						chunkId: chunk.toolCallId,
						message: `Received tool-input-delta for missing tool call with ID "${chunk.toolCallId}". Ensure a "tool-input-start" chunk is sent before any "tool-input-delta" chunks.`
					});
					partialToolCall.text += chunk.inputTextDelta;
					const { value: partialArgs } = await parsePartialJson(partialToolCall.text);
					if (partialToolCall.dynamic) updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: partialToolCall.toolName,
						state: "input-streaming",
						input: partialArgs,
						title: partialToolCall.title
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: partialToolCall.toolName,
						state: "input-streaming",
						input: partialArgs,
						title: partialToolCall.title
					});
					write();
					break;
				}
				case "tool-input-available":
					if (chunk.dynamic) updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "input-available",
						input: chunk.input,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata,
						title: chunk.title
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "input-available",
						input: chunk.input,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata,
						title: chunk.title
					});
					write();
					if (onToolCall && !chunk.providerExecuted) await onToolCall({ toolCall: chunk });
					break;
				case "tool-input-error": {
					const existingPart = state.message.parts.filter(isToolUIPart).find((p) => p.toolCallId === chunk.toolCallId);
					if (existingPart != null ? existingPart.type === "dynamic-tool" : !!chunk.dynamic) updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "output-error",
						input: chunk.input,
						errorText: chunk.errorText,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: chunk.toolName,
						state: "output-error",
						input: void 0,
						rawInput: chunk.input,
						errorText: chunk.errorText,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata
					});
					write();
					break;
				}
				case "tool-approval-request": {
					const toolInvocation = getToolInvocation(chunk.toolCallId);
					toolInvocation.state = "approval-requested";
					toolInvocation.approval = { id: chunk.approvalId };
					write();
					break;
				}
				case "tool-output-denied": {
					const toolInvocation = getToolInvocation(chunk.toolCallId);
					toolInvocation.state = "output-denied";
					write();
					break;
				}
				case "tool-output-available": {
					const toolInvocation = getToolInvocation(chunk.toolCallId);
					if (toolInvocation.type === "dynamic-tool") updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: toolInvocation.toolName,
						state: "output-available",
						input: toolInvocation.input,
						output: chunk.output,
						preliminary: chunk.preliminary,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata,
						title: toolInvocation.title
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: getStaticToolName(toolInvocation),
						state: "output-available",
						input: toolInvocation.input,
						output: chunk.output,
						providerExecuted: chunk.providerExecuted,
						preliminary: chunk.preliminary,
						providerMetadata: chunk.providerMetadata,
						title: toolInvocation.title
					});
					write();
					break;
				}
				case "tool-output-error": {
					const toolInvocation = getToolInvocation(chunk.toolCallId);
					if (toolInvocation.type === "dynamic-tool") updateDynamicToolPart({
						toolCallId: chunk.toolCallId,
						toolName: toolInvocation.toolName,
						state: "output-error",
						input: toolInvocation.input,
						errorText: chunk.errorText,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata,
						title: toolInvocation.title
					});
					else updateToolPart({
						toolCallId: chunk.toolCallId,
						toolName: getStaticToolName(toolInvocation),
						state: "output-error",
						input: toolInvocation.input,
						rawInput: toolInvocation.rawInput,
						errorText: chunk.errorText,
						providerExecuted: chunk.providerExecuted,
						providerMetadata: chunk.providerMetadata,
						title: toolInvocation.title
					});
					write();
					break;
				}
				case "start-step":
					state.message.parts.push({ type: "step-start" });
					break;
				case "finish-step":
					state.activeTextParts = {};
					state.activeReasoningParts = {};
					break;
				case "start":
					if (chunk.messageId != null) state.message.id = chunk.messageId;
					await updateMessageMetadata(chunk.messageMetadata);
					if (chunk.messageId != null || chunk.messageMetadata != null) write();
					break;
				case "finish":
					if (chunk.finishReason != null) state.finishReason = chunk.finishReason;
					await updateMessageMetadata(chunk.messageMetadata);
					if (chunk.messageMetadata != null) write();
					break;
				case "message-metadata":
					await updateMessageMetadata(chunk.messageMetadata);
					if (chunk.messageMetadata != null) write();
					break;
				case "error":
					onError?.(new Error(chunk.errorText));
					break;
				default: if (isDataUIMessageChunk(chunk)) {
					if ((dataPartSchemas == null ? void 0 : dataPartSchemas[chunk.type]) != null) {
						const partIdx = state.message.parts.findIndex((p) => "id" in p && "data" in p && p.id === chunk.id && p.type === chunk.type);
						const actualPartIdx = partIdx >= 0 ? partIdx : state.message.parts.length;
						await validateTypes({
							value: chunk.data,
							schema: dataPartSchemas[chunk.type],
							context: {
								field: `message.parts[${actualPartIdx}].data`,
								entityName: chunk.type,
								entityId: chunk.id
							}
						});
					}
					const dataChunk = chunk;
					if (dataChunk.transient) {
						onData?.(dataChunk);
						break;
					}
					const existingUIPart = dataChunk.id != null ? state.message.parts.find((chunkArg) => dataChunk.type === chunkArg.type && dataChunk.id === chunkArg.id) : void 0;
					if (existingUIPart != null) existingUIPart.data = dataChunk.data;
					else state.message.parts.push(dataChunk);
					onData?.(dataChunk);
					write();
				}
			}
			controller.enqueue(chunk);
		});
	} }));
}
function handleUIMessageStreamFinish({ messageId, originalMessages = [], onStepFinish, onFinish, onError, stream }) {
	let lastMessage = originalMessages == null ? void 0 : originalMessages[originalMessages.length - 1];
	if ((lastMessage == null ? void 0 : lastMessage.role) !== "assistant") lastMessage = void 0;
	else messageId = lastMessage.id;
	let isAborted = false;
	const idInjectedStream = stream.pipeThrough(new TransformStream({ transform(chunk, controller) {
		if (chunk.type === "start") {
			const startChunk = chunk;
			if (startChunk.messageId == null && messageId != null) startChunk.messageId = messageId;
		}
		if (chunk.type === "abort") isAborted = true;
		controller.enqueue(chunk);
	} }));
	if (onFinish == null && onStepFinish == null) return idInjectedStream;
	const state = createStreamingUIMessageState({
		lastMessage: lastMessage ? structuredClone(lastMessage) : void 0,
		messageId: messageId != null ? messageId : ""
	});
	const runUpdateMessageJob = async (job) => {
		await job({
			state,
			write: () => {}
		});
	};
	let finishCalled = false;
	const callOnFinish = async () => {
		if (finishCalled || !onFinish) return;
		finishCalled = true;
		const isContinuation = state.message.id === (lastMessage == null ? void 0 : lastMessage.id);
		await onFinish({
			isAborted,
			isContinuation,
			responseMessage: state.message,
			messages: [...isContinuation ? originalMessages.slice(0, -1) : originalMessages, state.message],
			finishReason: state.finishReason
		});
	};
	const callOnStepFinish = async () => {
		if (!onStepFinish) return;
		const isContinuation = state.message.id === (lastMessage == null ? void 0 : lastMessage.id);
		try {
			await onStepFinish({
				isContinuation,
				responseMessage: structuredClone(state.message),
				messages: [...isContinuation ? originalMessages.slice(0, -1) : originalMessages, structuredClone(state.message)]
			});
		} catch (error) {
			onError(error);
		}
	};
	return processUIMessageStream({
		stream: idInjectedStream,
		runUpdateMessageJob,
		onError
	}).pipeThrough(new TransformStream({
		async transform(chunk, controller) {
			if (chunk.type === "finish-step") await callOnStepFinish();
			controller.enqueue(chunk);
		},
		async cancel() {
			await callOnFinish();
		},
		async flush() {
			await callOnFinish();
		}
	}));
}
function pipeUIMessageStreamToResponse({ response, status, statusText, headers, stream, consumeSseStream }) {
	let sseStream = stream.pipeThrough(new JsonToSseTransformStream());
	if (consumeSseStream) {
		const [stream1, stream2] = sseStream.tee();
		sseStream = stream1;
		consumeSseStream({ stream: stream2 });
	}
	writeToServerResponse({
		response,
		status,
		statusText,
		headers: Object.fromEntries(prepareHeaders(headers, UI_MESSAGE_STREAM_HEADERS).entries()),
		stream: sseStream.pipeThrough(new TextEncoderStream())
	});
}
function createAsyncIterableStream(source) {
	const stream = source.pipeThrough(new TransformStream());
	stream[Symbol.asyncIterator] = function() {
		const reader = this.getReader();
		let finished = false;
		async function cleanup(cancelStream) {
			var _a21;
			if (finished) return;
			finished = true;
			try {
				if (cancelStream) await ((_a21 = reader.cancel) == null ? void 0 : _a21.call(reader));
			} finally {
				try {
					reader.releaseLock();
				} catch (e) {}
			}
		}
		return {
			/**
			* Reads the next chunk from the stream.
			* @returns A promise resolving to the next IteratorResult.
			*/
			async next() {
				if (finished) return {
					done: true,
					value: void 0
				};
				const { done, value } = await reader.read();
				if (done) {
					await cleanup(true);
					return {
						done: true,
						value: void 0
					};
				}
				return {
					done: false,
					value
				};
			},
			/**
			* May be called on early exit (e.g., break from for-await) or after completion.
			* Ensures the stream is cancelled and resources are released.
			* @returns A promise resolving to a completed IteratorResult.
			*/
			async return() {
				await cleanup(true);
				return {
					done: true,
					value: void 0
				};
			},
			/**
			* Called on early exit with error.
			* Ensures the stream is cancelled and resources are released, then rethrows the error.
			* @param err The error to throw.
			* @returns A promise that rejects with the provided error.
			*/
			async throw(err) {
				await cleanup(true);
				throw err;
			}
		};
	};
	return stream;
}
async function consumeStream({ stream, onError }) {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done } = await reader.read();
			if (done) break;
		}
	} catch (error) {
		onError?.(error);
	} finally {
		reader.releaseLock();
	}
}
function createResolvablePromise() {
	let resolve3;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve3 = res;
			reject = rej;
		}),
		resolve: resolve3,
		reject
	};
}
function createStitchableStream() {
	let innerStreamReaders = [];
	let controller = null;
	let isClosed = false;
	let waitForNewStream = createResolvablePromise();
	const terminate = () => {
		isClosed = true;
		waitForNewStream.resolve();
		innerStreamReaders.forEach((reader) => reader.cancel());
		innerStreamReaders = [];
		controller?.close();
	};
	const processPull = async () => {
		if (isClosed && innerStreamReaders.length === 0) {
			controller?.close();
			return;
		}
		if (innerStreamReaders.length === 0) {
			waitForNewStream = createResolvablePromise();
			await waitForNewStream.promise;
			return processPull();
		}
		try {
			const { value, done } = await innerStreamReaders[0].read();
			if (done) {
				innerStreamReaders.shift();
				if (innerStreamReaders.length === 0 && isClosed) controller?.close();
				else await processPull();
			} else controller?.enqueue(value);
		} catch (error) {
			controller?.error(error);
			innerStreamReaders.shift();
			terminate();
		}
	};
	return {
		stream: new ReadableStream({
			start(controllerParam) {
				controller = controllerParam;
			},
			pull: processPull,
			async cancel() {
				for (const reader of innerStreamReaders) await reader.cancel();
				innerStreamReaders = [];
				isClosed = true;
			}
		}),
		addStream: (innerStream) => {
			if (isClosed) throw new Error("Cannot add inner stream: outer stream is closed");
			innerStreamReaders.push(innerStream.getReader());
			waitForNewStream.resolve();
		},
		/**
		* Gracefully close the outer stream. This will let the inner streams
		* finish processing and then close the outer stream.
		*/
		close: () => {
			isClosed = true;
			waitForNewStream.resolve();
			if (innerStreamReaders.length === 0) controller?.close();
		},
		/**
		* Immediately close the outer stream. This will cancel all inner streams
		* and close the outer stream.
		*/
		terminate
	};
}
function runToolsTransformation({ tools, generatorStream, tracer, telemetry, system, messages, abortSignal, repairToolCall, experimental_context, generateId: generateId2, stepNumber, model, onToolCallStart, onToolCallFinish }) {
	let toolResultsStreamController = null;
	const toolResultsStream = new ReadableStream({ start(controller) {
		toolResultsStreamController = controller;
	} });
	const outstandingToolResults = /* @__PURE__ */ new Set();
	const toolInputs = /* @__PURE__ */ new Map();
	const toolCallsByToolCallId = /* @__PURE__ */ new Map();
	let canClose = false;
	let finishChunk = void 0;
	function attemptClose() {
		if (canClose && outstandingToolResults.size === 0) {
			if (finishChunk != null) toolResultsStreamController.enqueue(finishChunk);
			toolResultsStreamController.close();
		}
	}
	const forwardStream = new TransformStream({
		async transform(chunk, controller) {
			const chunkType = chunk.type;
			switch (chunkType) {
				case "stream-start":
				case "text-start":
				case "text-delta":
				case "text-end":
				case "reasoning-start":
				case "reasoning-delta":
				case "reasoning-end":
				case "tool-input-start":
				case "tool-input-delta":
				case "tool-input-end":
				case "source":
				case "response-metadata":
				case "error":
				case "raw":
					controller.enqueue(chunk);
					break;
				case "file":
					controller.enqueue({
						type: "file",
						file: new DefaultGeneratedFileWithType({
							data: chunk.data,
							mediaType: chunk.mediaType
						}),
						...chunk.providerMetadata != null ? { providerMetadata: chunk.providerMetadata } : {}
					});
					break;
				case "finish":
					finishChunk = {
						type: "finish",
						finishReason: chunk.finishReason.unified,
						rawFinishReason: chunk.finishReason.raw,
						usage: asLanguageModelUsage(chunk.usage),
						providerMetadata: chunk.providerMetadata
					};
					break;
				case "tool-approval-request": {
					const toolCall = toolCallsByToolCallId.get(chunk.toolCallId);
					if (toolCall == null) {
						toolResultsStreamController.enqueue({
							type: "error",
							error: new ToolCallNotFoundForApprovalError({
								toolCallId: chunk.toolCallId,
								approvalId: chunk.approvalId
							})
						});
						break;
					}
					controller.enqueue({
						type: "tool-approval-request",
						approvalId: chunk.approvalId,
						toolCall
					});
					break;
				}
				case "tool-call":
					try {
						const toolCall = await parseToolCall({
							toolCall: chunk,
							tools,
							repairToolCall,
							system,
							messages
						});
						toolCallsByToolCallId.set(toolCall.toolCallId, toolCall);
						controller.enqueue(toolCall);
						if (toolCall.invalid) {
							toolResultsStreamController.enqueue({
								type: "tool-error",
								toolCallId: toolCall.toolCallId,
								toolName: toolCall.toolName,
								input: toolCall.input,
								error: getErrorMessage$1(toolCall.error),
								dynamic: true,
								title: toolCall.title
							});
							break;
						}
						const tool2 = tools == null ? void 0 : tools[toolCall.toolName];
						if (tool2 == null) break;
						if (tool2.onInputAvailable != null) await tool2.onInputAvailable({
							input: toolCall.input,
							toolCallId: toolCall.toolCallId,
							messages,
							abortSignal,
							experimental_context
						});
						if (await isApprovalNeeded({
							tool: tool2,
							toolCall,
							messages,
							experimental_context
						})) {
							toolResultsStreamController.enqueue({
								type: "tool-approval-request",
								approvalId: generateId2(),
								toolCall
							});
							break;
						}
						toolInputs.set(toolCall.toolCallId, toolCall.input);
						if (tool2.execute != null && toolCall.providerExecuted !== true) {
							const toolExecutionId = generateId2();
							outstandingToolResults.add(toolExecutionId);
							executeToolCall({
								toolCall,
								tools,
								tracer,
								telemetry,
								messages,
								abortSignal,
								experimental_context,
								stepNumber,
								model,
								onToolCallStart,
								onToolCallFinish,
								onPreliminaryToolResult: (result) => {
									toolResultsStreamController.enqueue(result);
								}
							}).then((result) => {
								toolResultsStreamController.enqueue(result);
							}).catch((error) => {
								toolResultsStreamController.enqueue({
									type: "error",
									error
								});
							}).finally(() => {
								outstandingToolResults.delete(toolExecutionId);
								attemptClose();
							});
						}
					} catch (error) {
						toolResultsStreamController.enqueue({
							type: "error",
							error
						});
					}
					break;
				case "tool-result": {
					const toolName = chunk.toolName;
					if (chunk.isError) toolResultsStreamController.enqueue({
						type: "tool-error",
						toolCallId: chunk.toolCallId,
						toolName,
						input: toolInputs.get(chunk.toolCallId),
						providerExecuted: true,
						error: chunk.result,
						dynamic: chunk.dynamic,
						...chunk.providerMetadata != null ? { providerMetadata: chunk.providerMetadata } : {}
					});
					else controller.enqueue({
						type: "tool-result",
						toolCallId: chunk.toolCallId,
						toolName,
						input: toolInputs.get(chunk.toolCallId),
						output: chunk.result,
						providerExecuted: true,
						dynamic: chunk.dynamic,
						...chunk.providerMetadata != null ? { providerMetadata: chunk.providerMetadata } : {}
					});
					break;
				}
				default: throw new Error(`Unhandled chunk type: ${chunkType}`);
			}
		},
		flush() {
			canClose = true;
			attemptClose();
		}
	});
	return new ReadableStream({ async start(controller) {
		return Promise.all([generatorStream.pipeThrough(forwardStream).pipeTo(new WritableStream({
			write(chunk) {
				controller.enqueue(chunk);
			},
			close() {}
		})), toolResultsStream.pipeTo(new WritableStream({
			write(chunk) {
				controller.enqueue(chunk);
			},
			close() {
				controller.close();
			}
		}))]);
	} });
}
var originalGenerateId2 = createIdGenerator({
	prefix: "aitxt",
	size: 24
});
function streamText({ model, tools, toolChoice, system, prompt, messages, allowSystemInMessages, maxRetries, abortSignal, timeout, headers, stopWhen = stepCountIs(1), experimental_output, output = experimental_output, experimental_telemetry: telemetry, prepareStep, providerOptions, experimental_activeTools, activeTools = experimental_activeTools, experimental_repairToolCall: repairToolCall, experimental_transform: transform, experimental_download: download2, includeRawChunks = false, onChunk, onError = ({ error }) => {
	console.error(error);
}, onFinish, onAbort, onStepFinish, experimental_onStart: onStart, experimental_onStepStart: onStepStart, experimental_onToolCallStart: onToolCallStart, experimental_onToolCallFinish: onToolCallFinish, experimental_context, experimental_include: include, _internal: { now: now2 = now, generateId: generateId2 = originalGenerateId2 } = {}, ...settings }) {
	const totalTimeoutMs = getTotalTimeoutMs(timeout);
	const stepTimeoutMs = getStepTimeoutMs(timeout);
	const chunkTimeoutMs = getChunkTimeoutMs(timeout);
	const stepAbortController = stepTimeoutMs != null ? new AbortController() : void 0;
	const chunkAbortController = chunkTimeoutMs != null ? new AbortController() : void 0;
	return new DefaultStreamTextResult({
		model: resolveLanguageModel(model),
		telemetry,
		headers,
		settings,
		maxRetries,
		abortSignal: mergeAbortSignals(abortSignal, totalTimeoutMs != null ? AbortSignal.timeout(totalTimeoutMs) : void 0, stepAbortController == null ? void 0 : stepAbortController.signal, chunkAbortController == null ? void 0 : chunkAbortController.signal),
		stepTimeoutMs,
		stepAbortController,
		chunkTimeoutMs,
		chunkAbortController,
		system,
		prompt,
		messages,
		allowSystemInMessages,
		tools,
		toolChoice,
		transforms: asArray(transform),
		activeTools,
		repairToolCall,
		stopConditions: asArray(stopWhen),
		output,
		providerOptions,
		prepareStep,
		includeRawChunks,
		timeout,
		stopWhen,
		originalAbortSignal: abortSignal,
		onChunk,
		onError,
		onFinish,
		onAbort,
		onStepFinish,
		onStart,
		onStepStart,
		onToolCallStart,
		onToolCallFinish,
		now: now2,
		generateId: generateId2,
		experimental_context,
		download: download2,
		include
	});
}
function createOutputTransformStream(output) {
	let firstTextChunkId = void 0;
	let text2 = "";
	let textChunk = "";
	let textProviderMetadata = void 0;
	let lastPublishedValue = "";
	function publishTextChunk({ controller, partialOutput = void 0 }) {
		controller.enqueue({
			part: {
				type: "text-delta",
				id: firstTextChunkId,
				text: textChunk,
				providerMetadata: textProviderMetadata
			},
			partialOutput
		});
		textChunk = "";
	}
	return new TransformStream({ async transform(chunk, controller) {
		var _a21;
		if (chunk.type === "finish-step" && textChunk.length > 0) publishTextChunk({ controller });
		if (chunk.type !== "text-delta" && chunk.type !== "text-start" && chunk.type !== "text-end") {
			controller.enqueue({
				part: chunk,
				partialOutput: void 0
			});
			return;
		}
		if (firstTextChunkId == null) firstTextChunkId = chunk.id;
		else if (chunk.id !== firstTextChunkId) {
			controller.enqueue({
				part: chunk,
				partialOutput: void 0
			});
			return;
		}
		if (chunk.type === "text-start") {
			controller.enqueue({
				part: chunk,
				partialOutput: void 0
			});
			return;
		}
		if (chunk.type === "text-end") {
			if (textChunk.length > 0) publishTextChunk({ controller });
			controller.enqueue({
				part: chunk,
				partialOutput: void 0
			});
			return;
		}
		text2 += chunk.text;
		textChunk += chunk.text;
		textProviderMetadata = (_a21 = chunk.providerMetadata) != null ? _a21 : textProviderMetadata;
		const result = await output.parsePartialOutput({ text: text2 });
		if (result !== void 0) {
			const currentValue = typeof result.partial === "string" ? result.partial : JSON.stringify(result.partial);
			if (currentValue !== lastPublishedValue) {
				publishTextChunk({
					controller,
					partialOutput: result.partial
				});
				lastPublishedValue = currentValue;
			}
		}
	} });
}
var DefaultStreamTextResult = class {
	constructor({ model, telemetry, headers, settings, maxRetries: maxRetriesArg, abortSignal, stepTimeoutMs, stepAbortController, chunkTimeoutMs, chunkAbortController, system, prompt, messages, allowSystemInMessages, tools, toolChoice, transforms, activeTools, repairToolCall, stopConditions, output, providerOptions, prepareStep, includeRawChunks, now: now2, generateId: generateId2, timeout, stopWhen, originalAbortSignal, onChunk, onError, onFinish, onAbort, onStepFinish, onStart, onStepStart, onToolCallStart, onToolCallFinish, experimental_context, download: download2, include }) {
		this._totalUsage = new DelayedPromise();
		this._finishReason = new DelayedPromise();
		this._rawFinishReason = new DelayedPromise();
		this._steps = new DelayedPromise();
		this.outputSpecification = output;
		this.includeRawChunks = includeRawChunks;
		this.tools = tools;
		const globalTelemetry = getGlobalTelemetryIntegration()(telemetry == null ? void 0 : telemetry.integrations);
		let stepFinish;
		let recordedContent = [];
		const recordedResponseMessages = [];
		let recordedFinishReason = void 0;
		let recordedRawFinishReason = void 0;
		let recordedTotalUsage = void 0;
		let recordedRequest = {};
		let recordedWarnings = [];
		const recordedSteps = [];
		const pendingDeferredToolCalls = /* @__PURE__ */ new Map();
		let rootSpan;
		let activeTextContent = {};
		let activeReasoningContent = {};
		const eventProcessor = new TransformStream({
			async transform(chunk, controller) {
				var _a21, _b, _c, _d;
				controller.enqueue(chunk);
				const { part } = chunk;
				if (part.type === "text-delta" || part.type === "reasoning-delta" || part.type === "source" || part.type === "tool-call" || part.type === "tool-result" || part.type === "tool-input-start" || part.type === "tool-input-delta" || part.type === "raw") await (onChunk == null ? void 0 : onChunk({ chunk: part }));
				if (part.type === "error") await onError({ error: wrapGatewayError(part.error) });
				if (part.type === "text-start") {
					activeTextContent[part.id] = {
						type: "text",
						text: "",
						providerMetadata: part.providerMetadata
					};
					recordedContent.push(activeTextContent[part.id]);
				}
				if (part.type === "text-delta") {
					const activeText = activeTextContent[part.id];
					if (activeText == null) {
						controller.enqueue({
							part: {
								type: "error",
								error: `text part ${part.id} not found`
							},
							partialOutput: void 0
						});
						return;
					}
					activeText.text += part.text;
					activeText.providerMetadata = (_a21 = part.providerMetadata) != null ? _a21 : activeText.providerMetadata;
				}
				if (part.type === "text-end") {
					const activeText = activeTextContent[part.id];
					if (activeText == null) {
						controller.enqueue({
							part: {
								type: "error",
								error: `text part ${part.id} not found`
							},
							partialOutput: void 0
						});
						return;
					}
					activeText.providerMetadata = (_b = part.providerMetadata) != null ? _b : activeText.providerMetadata;
					delete activeTextContent[part.id];
				}
				if (part.type === "reasoning-start") {
					activeReasoningContent[part.id] = {
						type: "reasoning",
						text: "",
						providerMetadata: part.providerMetadata
					};
					recordedContent.push(activeReasoningContent[part.id]);
				}
				if (part.type === "reasoning-delta") {
					const activeReasoning = activeReasoningContent[part.id];
					if (activeReasoning == null) {
						controller.enqueue({
							part: {
								type: "error",
								error: `reasoning part ${part.id} not found`
							},
							partialOutput: void 0
						});
						return;
					}
					activeReasoning.text += part.text;
					activeReasoning.providerMetadata = (_c = part.providerMetadata) != null ? _c : activeReasoning.providerMetadata;
				}
				if (part.type === "reasoning-end") {
					const activeReasoning = activeReasoningContent[part.id];
					if (activeReasoning == null) {
						controller.enqueue({
							part: {
								type: "error",
								error: `reasoning part ${part.id} not found`
							},
							partialOutput: void 0
						});
						return;
					}
					activeReasoning.providerMetadata = (_d = part.providerMetadata) != null ? _d : activeReasoning.providerMetadata;
					delete activeReasoningContent[part.id];
				}
				if (part.type === "file") recordedContent.push({
					type: "file",
					file: part.file,
					...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
				});
				if (part.type === "source") recordedContent.push(part);
				if (part.type === "tool-call") recordedContent.push(part);
				if (part.type === "tool-result" && !part.preliminary) recordedContent.push(part);
				if (part.type === "tool-approval-request") recordedContent.push(part);
				if (part.type === "tool-error") recordedContent.push(part);
				if (part.type === "start-step") {
					recordedContent = [];
					activeReasoningContent = {};
					activeTextContent = {};
					recordedRequest = part.request;
					recordedWarnings = part.warnings;
				}
				if (part.type === "finish-step") {
					const stepMessages = await toResponseMessages({
						content: recordedContent,
						tools
					});
					const currentStepResult = new DefaultStepResult({
						stepNumber: recordedSteps.length,
						model: modelInfo,
						...callbackTelemetryProps,
						experimental_context,
						content: recordedContent,
						finishReason: part.finishReason,
						rawFinishReason: part.rawFinishReason,
						usage: part.usage,
						warnings: recordedWarnings,
						request: recordedRequest,
						response: {
							...part.response,
							messages: [...recordedResponseMessages, ...stepMessages]
						},
						providerMetadata: part.providerMetadata
					});
					await notify({
						event: currentStepResult,
						callbacks: [onStepFinish, globalTelemetry.onStepFinish]
					});
					logWarnings({
						warnings: recordedWarnings,
						provider: modelInfo.provider,
						model: modelInfo.modelId
					});
					recordedSteps.push(currentStepResult);
					recordedResponseMessages.push(...stepMessages);
					stepFinish.resolve();
				}
				if (part.type === "finish") {
					recordedTotalUsage = part.totalUsage;
					recordedFinishReason = part.finishReason;
					recordedRawFinishReason = part.rawFinishReason;
				}
			},
			async flush(controller) {
				var _a21, _b, _c, _d, _e, _f, _g;
				try {
					if (recordedSteps.length === 0) {
						const error = (abortSignal == null ? void 0 : abortSignal.aborted) ? abortSignal.reason : new NoOutputGeneratedError({ message: "No output generated. Check the stream for errors." });
						self._finishReason.reject(error);
						self._rawFinishReason.reject(error);
						self._totalUsage.reject(error);
						self._steps.reject(error);
						return;
					}
					const finishReason = recordedFinishReason != null ? recordedFinishReason : "other";
					const totalUsage = recordedTotalUsage != null ? recordedTotalUsage : createNullLanguageModelUsage();
					self._finishReason.resolve(finishReason);
					self._rawFinishReason.resolve(recordedRawFinishReason);
					self._totalUsage.resolve(totalUsage);
					self._steps.resolve(recordedSteps);
					const finalStep = recordedSteps[recordedSteps.length - 1];
					await notify({
						event: {
							stepNumber: finalStep.stepNumber,
							model: finalStep.model,
							functionId: finalStep.functionId,
							metadata: finalStep.metadata,
							experimental_context: finalStep.experimental_context,
							finishReason: finalStep.finishReason,
							rawFinishReason: finalStep.rawFinishReason,
							totalUsage,
							usage: finalStep.usage,
							content: finalStep.content,
							text: finalStep.text,
							reasoningText: finalStep.reasoningText,
							reasoning: finalStep.reasoning,
							files: finalStep.files,
							sources: finalStep.sources,
							toolCalls: finalStep.toolCalls,
							staticToolCalls: finalStep.staticToolCalls,
							dynamicToolCalls: finalStep.dynamicToolCalls,
							toolResults: finalStep.toolResults,
							staticToolResults: finalStep.staticToolResults,
							dynamicToolResults: finalStep.dynamicToolResults,
							request: finalStep.request,
							response: finalStep.response,
							warnings: finalStep.warnings,
							providerMetadata: finalStep.providerMetadata,
							steps: recordedSteps
						},
						callbacks: [onFinish, globalTelemetry.onFinish]
					});
					rootSpan.setAttributes(await selectTelemetryAttributes({
						telemetry,
						attributes: {
							"ai.response.finishReason": finishReason,
							"ai.response.text": { output: () => finalStep.text },
							"ai.response.reasoning": { output: () => finalStep.reasoningText },
							"ai.response.toolCalls": { output: () => {
								var _a22;
								return ((_a22 = finalStep.toolCalls) == null ? void 0 : _a22.length) ? JSON.stringify(finalStep.toolCalls) : void 0;
							} },
							"ai.response.providerMetadata": JSON.stringify(finalStep.providerMetadata),
							"ai.usage.inputTokens": totalUsage.inputTokens,
							"ai.usage.inputTokenDetails.noCacheTokens": (_a21 = totalUsage.inputTokenDetails) == null ? void 0 : _a21.noCacheTokens,
							"ai.usage.inputTokenDetails.cacheReadTokens": (_b = totalUsage.inputTokenDetails) == null ? void 0 : _b.cacheReadTokens,
							"ai.usage.inputTokenDetails.cacheWriteTokens": (_c = totalUsage.inputTokenDetails) == null ? void 0 : _c.cacheWriteTokens,
							"ai.usage.outputTokens": totalUsage.outputTokens,
							"ai.usage.outputTokenDetails.textTokens": (_d = totalUsage.outputTokenDetails) == null ? void 0 : _d.textTokens,
							"ai.usage.outputTokenDetails.reasoningTokens": (_e = totalUsage.outputTokenDetails) == null ? void 0 : _e.reasoningTokens,
							"ai.usage.totalTokens": totalUsage.totalTokens,
							"ai.usage.reasoningTokens": (_f = totalUsage.outputTokenDetails) == null ? void 0 : _f.reasoningTokens,
							"ai.usage.cachedInputTokens": (_g = totalUsage.inputTokenDetails) == null ? void 0 : _g.cacheReadTokens
						}
					}));
				} catch (error) {
					controller.error(error);
				} finally {
					rootSpan.end();
				}
			}
		});
		const stitchableStream = createStitchableStream();
		this.addStream = stitchableStream.addStream;
		this.closeStream = stitchableStream.close;
		const reader = stitchableStream.stream.getReader();
		let stream = new ReadableStream({
			async start(controller) {
				controller.enqueue({ type: "start" });
			},
			async pull(controller) {
				function abort() {
					onAbort?.({ steps: recordedSteps });
					controller.enqueue({
						type: "abort",
						...(abortSignal == null ? void 0 : abortSignal.reason) !== void 0 ? { reason: getErrorMessage(abortSignal.reason) } : {}
					});
					controller.close();
				}
				try {
					const { done, value } = await reader.read();
					if (done) {
						controller.close();
						return;
					}
					if (abortSignal == null ? void 0 : abortSignal.aborted) {
						abort();
						return;
					}
					controller.enqueue(value);
				} catch (error) {
					if (isAbortError(error) && (abortSignal == null ? void 0 : abortSignal.aborted)) abort();
					else controller.error(error);
				}
			},
			cancel(reason) {
				return stitchableStream.stream.cancel(reason);
			}
		});
		for (const transform of transforms) stream = stream.pipeThrough(transform({
			tools,
			stopStream() {
				stitchableStream.terminate();
			}
		}));
		this.baseStream = stream.pipeThrough(createOutputTransformStream(output != null ? output : text())).pipeThrough(eventProcessor);
		const { maxRetries, retry } = prepareRetries({
			maxRetries: maxRetriesArg,
			abortSignal
		});
		const tracer = getTracer(telemetry);
		const callSettings = prepareCallSettings(settings);
		const baseTelemetryAttributes = getBaseTelemetryAttributes({
			model,
			telemetry,
			headers,
			settings: {
				...callSettings,
				maxRetries
			}
		});
		const self = this;
		const modelInfo = {
			provider: model.provider,
			modelId: model.modelId
		};
		const callbackTelemetryProps = {
			functionId: telemetry == null ? void 0 : telemetry.functionId,
			metadata: telemetry == null ? void 0 : telemetry.metadata
		};
		recordSpan({
			name: "ai.streamText",
			attributes: selectTelemetryAttributes({
				telemetry,
				attributes: {
					...assembleOperationName({
						operationId: "ai.streamText",
						telemetry
					}),
					...baseTelemetryAttributes,
					"ai.prompt": { input: () => JSON.stringify({
						system,
						prompt,
						messages
					}) }
				}
			}),
			tracer,
			endWhenDone: false,
			fn: async (rootSpanArg) => {
				rootSpan = rootSpanArg;
				const initialPrompt = await standardizePrompt({
					system,
					prompt,
					messages,
					allowSystemInMessages
				});
				await notify({
					event: {
						model: modelInfo,
						system,
						prompt,
						messages,
						tools,
						toolChoice,
						activeTools,
						maxOutputTokens: callSettings.maxOutputTokens,
						temperature: callSettings.temperature,
						topP: callSettings.topP,
						topK: callSettings.topK,
						presencePenalty: callSettings.presencePenalty,
						frequencyPenalty: callSettings.frequencyPenalty,
						stopSequences: callSettings.stopSequences,
						seed: callSettings.seed,
						maxRetries,
						timeout,
						headers,
						providerOptions,
						stopWhen,
						output,
						abortSignal: originalAbortSignal,
						include,
						...callbackTelemetryProps,
						experimental_context
					},
					callbacks: [onStart, globalTelemetry.onStart]
				});
				const initialMessages = initialPrompt.messages;
				const initialResponseMessages = [];
				const { approvedToolApprovals, deniedToolApprovals } = collectToolApprovals({ messages: initialMessages });
				if (deniedToolApprovals.length > 0 || approvedToolApprovals.length > 0) {
					const localApprovedToolApprovals = approvedToolApprovals.filter((toolApproval) => !toolApproval.toolCall.providerExecuted);
					const localDeniedToolApprovals = deniedToolApprovals.filter((toolApproval) => !toolApproval.toolCall.providerExecuted);
					const deniedProviderExecutedToolApprovals = deniedToolApprovals.filter((toolApproval) => toolApproval.toolCall.providerExecuted);
					let toolExecutionStepStreamController;
					const toolExecutionStepStream = new ReadableStream({ start(controller) {
						toolExecutionStepStreamController = controller;
					} });
					self.addStream(toolExecutionStepStream);
					try {
						for (const toolApproval of [...localDeniedToolApprovals, ...deniedProviderExecutedToolApprovals]) toolExecutionStepStreamController?.enqueue({
							type: "tool-output-denied",
							toolCallId: toolApproval.toolCall.toolCallId,
							toolName: toolApproval.toolCall.toolName
						});
						const toolOutputs = [];
						await Promise.all(localApprovedToolApprovals.map(async (toolApproval) => {
							const result = await executeToolCall({
								toolCall: toolApproval.toolCall,
								tools,
								tracer,
								telemetry,
								messages: initialMessages,
								abortSignal,
								experimental_context,
								stepNumber: recordedSteps.length,
								model: modelInfo,
								onToolCallStart: [onToolCallStart, globalTelemetry.onToolCallStart],
								onToolCallFinish: [onToolCallFinish, globalTelemetry.onToolCallFinish],
								onPreliminaryToolResult: (result2) => {
									toolExecutionStepStreamController?.enqueue(result2);
								}
							});
							if (result != null) {
								toolExecutionStepStreamController?.enqueue(result);
								toolOutputs.push(result);
							}
						}));
						if (toolOutputs.length > 0 || localDeniedToolApprovals.length > 0) {
							const localToolContent = [];
							for (const output2 of toolOutputs) localToolContent.push({
								type: "tool-result",
								toolCallId: output2.toolCallId,
								toolName: output2.toolName,
								output: await createToolModelOutput({
									toolCallId: output2.toolCallId,
									input: output2.input,
									tool: tools == null ? void 0 : tools[output2.toolName],
									output: output2.type === "tool-result" ? output2.output : output2.error,
									errorMode: output2.type === "tool-error" ? "text" : "none"
								})
							});
							for (const toolApproval of localDeniedToolApprovals) localToolContent.push({
								type: "tool-result",
								toolCallId: toolApproval.toolCall.toolCallId,
								toolName: toolApproval.toolCall.toolName,
								output: {
									type: "execution-denied",
									reason: toolApproval.approvalResponse.reason
								}
							});
							initialResponseMessages.push({
								role: "tool",
								content: localToolContent
							});
						}
					} finally {
						toolExecutionStepStreamController?.close();
					}
				}
				recordedResponseMessages.push(...initialResponseMessages);
				async function streamStep({ currentStep, responseMessages, usage }) {
					var _a21, _b, _c, _d, _e, _f, _g, _h, _i;
					const includeRawChunks2 = self.includeRawChunks;
					const stepTimeoutId = stepTimeoutMs != null ? setTimeout(() => stepAbortController.abort(), stepTimeoutMs) : void 0;
					let chunkTimeoutId = void 0;
					function resetChunkTimeout() {
						if (chunkTimeoutMs != null) {
							if (chunkTimeoutId != null) clearTimeout(chunkTimeoutId);
							chunkTimeoutId = setTimeout(() => chunkAbortController.abort(), chunkTimeoutMs);
						}
					}
					function clearChunkTimeout() {
						if (chunkTimeoutId != null) {
							clearTimeout(chunkTimeoutId);
							chunkTimeoutId = void 0;
						}
					}
					function clearStepTimeout() {
						if (stepTimeoutId != null) clearTimeout(stepTimeoutId);
					}
					try {
						stepFinish = new DelayedPromise();
						const stepInputMessages = [...initialMessages, ...responseMessages];
						const prepareStepResult = await (prepareStep == null ? void 0 : prepareStep({
							model,
							steps: recordedSteps,
							stepNumber: recordedSteps.length,
							messages: stepInputMessages,
							experimental_context
						}));
						const stepModel = resolveLanguageModel((_a21 = prepareStepResult == null ? void 0 : prepareStepResult.model) != null ? _a21 : model);
						const stepModelInfo = {
							provider: stepModel.provider,
							modelId: stepModel.modelId
						};
						const promptMessages = await convertToLanguageModelPrompt({
							prompt: {
								system: (_b = prepareStepResult == null ? void 0 : prepareStepResult.system) != null ? _b : initialPrompt.system,
								messages: (_c = prepareStepResult == null ? void 0 : prepareStepResult.messages) != null ? _c : stepInputMessages
							},
							supportedUrls: await stepModel.supportedUrls,
							download: download2
						});
						const stepActiveTools = (_d = prepareStepResult == null ? void 0 : prepareStepResult.activeTools) != null ? _d : activeTools;
						const { toolChoice: stepToolChoice, tools: stepTools } = await prepareToolsAndToolChoice({
							tools,
							toolChoice: (_e = prepareStepResult == null ? void 0 : prepareStepResult.toolChoice) != null ? _e : toolChoice,
							activeTools: stepActiveTools
						});
						experimental_context = (_f = prepareStepResult == null ? void 0 : prepareStepResult.experimental_context) != null ? _f : experimental_context;
						const stepMessages = (_g = prepareStepResult == null ? void 0 : prepareStepResult.messages) != null ? _g : stepInputMessages;
						const stepSystem = (_h = prepareStepResult == null ? void 0 : prepareStepResult.system) != null ? _h : initialPrompt.system;
						const stepProviderOptions = mergeObjects(providerOptions, prepareStepResult == null ? void 0 : prepareStepResult.providerOptions);
						await notify({
							event: {
								stepNumber: recordedSteps.length,
								model: stepModelInfo,
								system: stepSystem,
								messages: stepMessages,
								tools,
								toolChoice: stepToolChoice,
								activeTools: stepActiveTools,
								steps: [...recordedSteps],
								providerOptions: stepProviderOptions,
								timeout,
								headers,
								stopWhen,
								output,
								abortSignal: originalAbortSignal,
								include,
								...callbackTelemetryProps,
								experimental_context
							},
							callbacks: [onStepStart, globalTelemetry.onStepStart]
						});
						const { result: { stream: stream2, response, request }, doStreamSpan, startTimestampMs } = await retry(() => recordSpan({
							name: "ai.streamText.doStream",
							attributes: selectTelemetryAttributes({
								telemetry,
								attributes: {
									...assembleOperationName({
										operationId: "ai.streamText.doStream",
										telemetry
									}),
									...baseTelemetryAttributes,
									"ai.model.provider": stepModel.provider,
									"ai.model.id": stepModel.modelId,
									"ai.prompt.messages": { input: () => stringifyForTelemetry(promptMessages) },
									"ai.prompt.tools": { input: () => stepTools == null ? void 0 : stepTools.map((tool2) => JSON.stringify(tool2)) },
									"ai.prompt.toolChoice": { input: () => stepToolChoice != null ? JSON.stringify(stepToolChoice) : void 0 },
									"gen_ai.system": stepModel.provider,
									"gen_ai.request.model": stepModel.modelId,
									"gen_ai.request.frequency_penalty": callSettings.frequencyPenalty,
									"gen_ai.request.max_tokens": callSettings.maxOutputTokens,
									"gen_ai.request.presence_penalty": callSettings.presencePenalty,
									"gen_ai.request.stop_sequences": callSettings.stopSequences,
									"gen_ai.request.temperature": callSettings.temperature,
									"gen_ai.request.top_k": callSettings.topK,
									"gen_ai.request.top_p": callSettings.topP
								}
							}),
							tracer,
							endWhenDone: false,
							fn: async (doStreamSpan2) => ({
								startTimestampMs: now2(),
								doStreamSpan: doStreamSpan2,
								result: await stepModel.doStream({
									...callSettings,
									tools: stepTools,
									toolChoice: stepToolChoice,
									responseFormat: await (output == null ? void 0 : output.responseFormat),
									prompt: promptMessages,
									providerOptions: stepProviderOptions,
									abortSignal,
									headers,
									includeRawChunks: includeRawChunks2
								})
							})
						}));
						const streamWithToolResults = runToolsTransformation({
							tools,
							generatorStream: stream2,
							tracer,
							telemetry,
							system,
							messages: stepInputMessages,
							repairToolCall,
							abortSignal,
							experimental_context,
							generateId: generateId2,
							stepNumber: recordedSteps.length,
							model: stepModelInfo,
							onToolCallStart: [onToolCallStart, globalTelemetry.onToolCallStart],
							onToolCallFinish: [onToolCallFinish, globalTelemetry.onToolCallFinish]
						});
						const stepRequest = ((_i = include == null ? void 0 : include.requestBody) != null ? _i : true) ? request != null ? request : {} : {
							...request,
							body: void 0
						};
						const stepToolCalls = [];
						const stepToolOutputs = [];
						let warnings;
						const activeToolCallToolNames = {};
						let stepFinishReason = "other";
						let stepRawFinishReason = void 0;
						let stepUsage = createNullLanguageModelUsage();
						let stepProviderMetadata;
						let stepFirstChunk = true;
						let stepResponse = {
							id: generateId2(),
							timestamp: /* @__PURE__ */ new Date(),
							modelId: modelInfo.modelId
						};
						let activeText = "";
						self.addStream(streamWithToolResults.pipeThrough(new TransformStream({
							async transform(chunk, controller) {
								var _a22, _b2, _c2, _d2, _e2;
								resetChunkTimeout();
								if (chunk.type === "stream-start") {
									warnings = chunk.warnings;
									return;
								}
								if (stepFirstChunk) {
									const msToFirstChunk = now2() - startTimestampMs;
									stepFirstChunk = false;
									doStreamSpan.addEvent("ai.stream.firstChunk", { "ai.response.msToFirstChunk": msToFirstChunk });
									doStreamSpan.setAttributes({ "ai.response.msToFirstChunk": msToFirstChunk });
									controller.enqueue({
										type: "start-step",
										request: stepRequest,
										warnings: warnings != null ? warnings : []
									});
								}
								const chunkType = chunk.type;
								switch (chunkType) {
									case "tool-approval-request":
									case "text-start":
									case "text-end":
										controller.enqueue(chunk);
										break;
									case "text-delta":
										if (chunk.delta.length > 0) {
											controller.enqueue({
												type: "text-delta",
												id: chunk.id,
												text: chunk.delta,
												providerMetadata: chunk.providerMetadata
											});
											activeText += chunk.delta;
										}
										break;
									case "reasoning-start":
									case "reasoning-end":
										controller.enqueue(chunk);
										break;
									case "reasoning-delta":
										controller.enqueue({
											type: "reasoning-delta",
											id: chunk.id,
											text: chunk.delta,
											providerMetadata: chunk.providerMetadata
										});
										break;
									case "tool-call":
										controller.enqueue(chunk);
										stepToolCalls.push(chunk);
										break;
									case "tool-result":
										controller.enqueue(chunk);
										if (!chunk.preliminary) stepToolOutputs.push(chunk);
										break;
									case "tool-error":
										controller.enqueue(chunk);
										stepToolOutputs.push(chunk);
										break;
									case "response-metadata":
										stepResponse = {
											id: (_a22 = chunk.id) != null ? _a22 : stepResponse.id,
											timestamp: (_b2 = chunk.timestamp) != null ? _b2 : stepResponse.timestamp,
											modelId: (_c2 = chunk.modelId) != null ? _c2 : stepResponse.modelId
										};
										break;
									case "finish": {
										stepUsage = chunk.usage;
										stepFinishReason = chunk.finishReason;
										stepRawFinishReason = chunk.rawFinishReason;
										stepProviderMetadata = chunk.providerMetadata;
										const msToFinish = now2() - startTimestampMs;
										doStreamSpan.addEvent("ai.stream.finish");
										doStreamSpan.setAttributes({
											"ai.response.msToFinish": msToFinish,
											"ai.response.avgOutputTokensPerSecond": 1e3 * ((_d2 = stepUsage.outputTokens) != null ? _d2 : 0) / msToFinish
										});
										break;
									}
									case "file":
										controller.enqueue(chunk);
										break;
									case "source":
										controller.enqueue(chunk);
										break;
									case "tool-input-start": {
										activeToolCallToolNames[chunk.id] = chunk.toolName;
										const tool2 = tools == null ? void 0 : tools[chunk.toolName];
										if ((tool2 == null ? void 0 : tool2.onInputStart) != null) await tool2.onInputStart({
											toolCallId: chunk.id,
											messages: stepInputMessages,
											abortSignal,
											experimental_context
										});
										controller.enqueue({
											...chunk,
											dynamic: (_e2 = chunk.dynamic) != null ? _e2 : (tool2 == null ? void 0 : tool2.type) === "dynamic",
											title: tool2 == null ? void 0 : tool2.title
										});
										break;
									}
									case "tool-input-end":
										delete activeToolCallToolNames[chunk.id];
										controller.enqueue(chunk);
										break;
									case "tool-input-delta": {
										const toolName = activeToolCallToolNames[chunk.id];
										const tool2 = tools == null ? void 0 : tools[toolName];
										if ((tool2 == null ? void 0 : tool2.onInputDelta) != null) await tool2.onInputDelta({
											inputTextDelta: chunk.delta,
											toolCallId: chunk.id,
											messages: stepInputMessages,
											abortSignal,
											experimental_context
										});
										controller.enqueue(chunk);
										break;
									}
									case "error":
										controller.enqueue(chunk);
										stepFinishReason = "error";
										break;
									case "raw":
										if (includeRawChunks2) controller.enqueue(chunk);
										break;
									default: throw new Error(`Unknown chunk type: ${chunkType}`);
								}
							},
							async flush(controller) {
								var _a22, _b2, _c2, _d2, _e2, _f2, _g2;
								const stepToolCallsJson = stepToolCalls.length > 0 ? JSON.stringify(stepToolCalls) : void 0;
								try {
									doStreamSpan.setAttributes(await selectTelemetryAttributes({
										telemetry,
										attributes: {
											"ai.response.finishReason": stepFinishReason,
											"ai.response.toolCalls": { output: () => stepToolCallsJson },
											"ai.response.id": stepResponse.id,
											"ai.response.model": stepResponse.modelId,
											"ai.response.timestamp": stepResponse.timestamp.toISOString(),
											"ai.usage.inputTokens": stepUsage.inputTokens,
											"ai.usage.inputTokenDetails.noCacheTokens": (_a22 = stepUsage.inputTokenDetails) == null ? void 0 : _a22.noCacheTokens,
											"ai.usage.inputTokenDetails.cacheReadTokens": (_b2 = stepUsage.inputTokenDetails) == null ? void 0 : _b2.cacheReadTokens,
											"ai.usage.inputTokenDetails.cacheWriteTokens": (_c2 = stepUsage.inputTokenDetails) == null ? void 0 : _c2.cacheWriteTokens,
											"ai.usage.outputTokens": stepUsage.outputTokens,
											"ai.usage.outputTokenDetails.textTokens": (_d2 = stepUsage.outputTokenDetails) == null ? void 0 : _d2.textTokens,
											"ai.usage.outputTokenDetails.reasoningTokens": (_e2 = stepUsage.outputTokenDetails) == null ? void 0 : _e2.reasoningTokens,
											"ai.usage.totalTokens": stepUsage.totalTokens,
											"ai.usage.reasoningTokens": (_f2 = stepUsage.outputTokenDetails) == null ? void 0 : _f2.reasoningTokens,
											"ai.usage.cachedInputTokens": (_g2 = stepUsage.inputTokenDetails) == null ? void 0 : _g2.cacheReadTokens,
											"gen_ai.response.finish_reasons": [stepFinishReason],
											"gen_ai.response.id": stepResponse.id,
											"gen_ai.response.model": stepResponse.modelId,
											"gen_ai.usage.input_tokens": stepUsage.inputTokens,
											"gen_ai.usage.output_tokens": stepUsage.outputTokens
										}
									}));
								} catch (error) {}
								controller.enqueue({
									type: "finish-step",
									finishReason: stepFinishReason,
									rawFinishReason: stepRawFinishReason,
									usage: stepUsage,
									providerMetadata: stepProviderMetadata,
									response: {
										...stepResponse,
										headers: response == null ? void 0 : response.headers
									}
								});
								const combinedUsage = addLanguageModelUsage(usage, stepUsage);
								await stepFinish.promise;
								const processedStep = recordedSteps[recordedSteps.length - 1];
								try {
									doStreamSpan.setAttributes(await selectTelemetryAttributes({
										telemetry,
										attributes: {
											"ai.response.text": { output: () => processedStep.text },
											"ai.response.reasoning": { output: () => processedStep.reasoningText },
											"ai.response.providerMetadata": JSON.stringify(processedStep.providerMetadata)
										}
									}));
								} catch (error) {} finally {
									doStreamSpan.end();
								}
								const clientToolCalls = stepToolCalls.filter((toolCall) => toolCall.providerExecuted !== true);
								const clientToolOutputs = stepToolOutputs.filter((toolOutput) => toolOutput.providerExecuted !== true);
								for (const toolCall of stepToolCalls) {
									if (toolCall.providerExecuted !== true) continue;
									const tool2 = tools == null ? void 0 : tools[toolCall.toolName];
									if ((tool2 == null ? void 0 : tool2.type) === "provider" && tool2.supportsDeferredResults) {
										if (!stepToolOutputs.some((output2) => (output2.type === "tool-result" || output2.type === "tool-error") && output2.toolCallId === toolCall.toolCallId)) pendingDeferredToolCalls.set(toolCall.toolCallId, { toolName: toolCall.toolName });
									}
								}
								for (const output2 of stepToolOutputs) if (output2.type === "tool-result" || output2.type === "tool-error") pendingDeferredToolCalls.delete(output2.toolCallId);
								clearStepTimeout();
								clearChunkTimeout();
								if ((clientToolCalls.length > 0 && clientToolOutputs.length === clientToolCalls.length || pendingDeferredToolCalls.size > 0) && !await isStopConditionMet({
									stopConditions,
									steps: recordedSteps
								})) {
									responseMessages.push(...await toResponseMessages({
										content: recordedSteps[recordedSteps.length - 1].content,
										tools
									}));
									try {
										await streamStep({
											currentStep: currentStep + 1,
											responseMessages,
											usage: combinedUsage
										});
									} catch (error) {
										controller.enqueue({
											type: "error",
											error
										});
										self.closeStream();
									}
								} else {
									controller.enqueue({
										type: "finish",
										finishReason: stepFinishReason,
										rawFinishReason: stepRawFinishReason,
										totalUsage: combinedUsage
									});
									self.closeStream();
								}
							}
						})));
					} finally {
						clearStepTimeout();
						clearChunkTimeout();
					}
				}
				await streamStep({
					currentStep: 0,
					responseMessages: initialResponseMessages,
					usage: createNullLanguageModelUsage()
				});
			}
		}).catch((error) => {
			self.addStream(new ReadableStream({ start(controller) {
				controller.enqueue({
					type: "error",
					error
				});
				controller.close();
			} }));
			self.closeStream();
		});
	}
	get steps() {
		this.consumeStream();
		return this._steps.promise;
	}
	get finalStep() {
		return this.steps.then((steps) => steps[steps.length - 1]);
	}
	get content() {
		return this.finalStep.then((step) => step.content);
	}
	get warnings() {
		return this.finalStep.then((step) => step.warnings);
	}
	get providerMetadata() {
		return this.finalStep.then((step) => step.providerMetadata);
	}
	get text() {
		return this.finalStep.then((step) => step.text);
	}
	get reasoningText() {
		return this.finalStep.then((step) => step.reasoningText);
	}
	get reasoning() {
		return this.finalStep.then((step) => step.reasoning);
	}
	get sources() {
		return this.finalStep.then((step) => step.sources);
	}
	get files() {
		return this.finalStep.then((step) => step.files);
	}
	get toolCalls() {
		return this.finalStep.then((step) => step.toolCalls);
	}
	get staticToolCalls() {
		return this.finalStep.then((step) => step.staticToolCalls);
	}
	get dynamicToolCalls() {
		return this.finalStep.then((step) => step.dynamicToolCalls);
	}
	get toolResults() {
		return this.finalStep.then((step) => step.toolResults);
	}
	get staticToolResults() {
		return this.finalStep.then((step) => step.staticToolResults);
	}
	get dynamicToolResults() {
		return this.finalStep.then((step) => step.dynamicToolResults);
	}
	get usage() {
		return this.finalStep.then((step) => step.usage);
	}
	get request() {
		return this.finalStep.then((step) => step.request);
	}
	get response() {
		return this.finalStep.then((step) => step.response);
	}
	get totalUsage() {
		this.consumeStream();
		return this._totalUsage.promise;
	}
	get finishReason() {
		this.consumeStream();
		return this._finishReason.promise;
	}
	get rawFinishReason() {
		this.consumeStream();
		return this._rawFinishReason.promise;
	}
	/**
	* Split out a new stream from the original stream.
	* The original stream is replaced to allow for further splitting,
	* since we do not know how many times the stream will be split.
	*
	* Note: this leads to buffering the stream content on the server.
	* However, the LLM results are expected to be small enough to not cause issues.
	*/
	teeStream() {
		const [stream1, stream2] = this.baseStream.tee();
		this.baseStream = stream2;
		return stream1;
	}
	get textStream() {
		return createAsyncIterableStream(this.teeStream().pipeThrough(new TransformStream({ transform({ part }, controller) {
			if (part.type === "text-delta") controller.enqueue(part.text);
		} })));
	}
	get fullStream() {
		return createAsyncIterableStream(this.teeStream().pipeThrough(new TransformStream({ transform({ part }, controller) {
			controller.enqueue(part);
		} })));
	}
	async consumeStream(options) {
		var _a21;
		try {
			await consumeStream({
				stream: this.fullStream,
				onError: options == null ? void 0 : options.onError
			});
		} catch (error) {
			(_a21 = options == null ? void 0 : options.onError) == null || _a21.call(options, error);
		}
	}
	get experimental_partialOutputStream() {
		return this.partialOutputStream;
	}
	get partialOutputStream() {
		return createAsyncIterableStream(this.teeStream().pipeThrough(new TransformStream({ transform({ partialOutput }, controller) {
			if (partialOutput != null) controller.enqueue(partialOutput);
		} })));
	}
	get elementStream() {
		var _a21, _b, _c;
		const transform = (_a21 = this.outputSpecification) == null ? void 0 : _a21.createElementStreamTransform();
		if (transform == null) throw new UnsupportedFunctionalityError({ functionality: `element streams in ${(_c = (_b = this.outputSpecification) == null ? void 0 : _b.name) != null ? _c : "text"} mode` });
		return createAsyncIterableStream(this.teeStream().pipeThrough(transform));
	}
	get output() {
		return this.finalStep.then((step) => {
			var _a21;
			return ((_a21 = this.outputSpecification) != null ? _a21 : text()).parseCompleteOutput({ text: step.text }, {
				response: step.response,
				usage: step.usage,
				finishReason: step.finishReason
			});
		});
	}
	toUIMessageStream({ originalMessages, generateMessageId, onFinish, messageMetadata, sendReasoning = true, sendSources = false, sendStart = true, sendFinish = true, onError = getErrorMessage } = {}) {
		const responseMessageId = generateMessageId != null ? getResponseUIMessageId({
			originalMessages,
			responseMessageId: generateMessageId
		}) : void 0;
		const isDynamic = (part) => {
			var _a21;
			const tool2 = (_a21 = this.tools) == null ? void 0 : _a21[part.toolName];
			if (tool2 == null) return part.dynamic;
			return (tool2 == null ? void 0 : tool2.type) === "dynamic" ? true : void 0;
		};
		return createAsyncIterableStream(handleUIMessageStreamFinish({
			stream: this.fullStream.pipeThrough(new TransformStream({ transform: async (part, controller) => {
				const messageMetadataValue = messageMetadata == null ? void 0 : messageMetadata({ part });
				const partType = part.type;
				switch (partType) {
					case "text-start":
						controller.enqueue({
							type: "text-start",
							id: part.id,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "text-delta":
						controller.enqueue({
							type: "text-delta",
							id: part.id,
							delta: part.text,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "text-end":
						controller.enqueue({
							type: "text-end",
							id: part.id,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "reasoning-start":
					case "reasoning-end":
						if (sendReasoning) controller.enqueue({
							type: partType,
							id: part.id,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "reasoning-delta":
						if (sendReasoning) controller.enqueue({
							type: "reasoning-delta",
							id: part.id,
							delta: part.text,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "file":
						controller.enqueue({
							type: "file",
							mediaType: part.file.mediaType,
							url: `data:${part.file.mediaType};base64,${part.file.base64}`,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "source":
						if (sendSources && part.sourceType === "url") controller.enqueue({
							type: "source-url",
							sourceId: part.id,
							url: part.url,
							title: part.title,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						if (sendSources && part.sourceType === "document") controller.enqueue({
							type: "source-document",
							sourceId: part.id,
							mediaType: part.mediaType,
							title: part.title,
							filename: part.filename,
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {}
						});
						break;
					case "tool-input-start": {
						const dynamic = isDynamic(part);
						controller.enqueue({
							type: "tool-input-start",
							toolCallId: part.id,
							toolName: part.toolName,
							...part.providerExecuted != null ? { providerExecuted: part.providerExecuted } : {},
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {},
							...dynamic != null ? { dynamic } : {},
							...part.title != null ? { title: part.title } : {}
						});
						break;
					}
					case "tool-input-delta":
						controller.enqueue({
							type: "tool-input-delta",
							toolCallId: part.id,
							inputTextDelta: part.delta
						});
						break;
					case "tool-call": {
						const dynamic = isDynamic(part);
						if (part.invalid) controller.enqueue({
							type: "tool-input-error",
							toolCallId: part.toolCallId,
							toolName: part.toolName,
							input: part.input,
							...part.providerExecuted != null ? { providerExecuted: part.providerExecuted } : {},
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {},
							...dynamic != null ? { dynamic } : {},
							errorText: onError(part.error),
							...part.title != null ? { title: part.title } : {}
						});
						else controller.enqueue({
							type: "tool-input-available",
							toolCallId: part.toolCallId,
							toolName: part.toolName,
							input: part.input,
							...part.providerExecuted != null ? { providerExecuted: part.providerExecuted } : {},
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {},
							...dynamic != null ? { dynamic } : {},
							...part.title != null ? { title: part.title } : {}
						});
						break;
					}
					case "tool-approval-request":
						controller.enqueue({
							type: "tool-approval-request",
							approvalId: part.approvalId,
							toolCallId: part.toolCall.toolCallId
						});
						break;
					case "tool-result": {
						const dynamic = isDynamic(part);
						controller.enqueue({
							type: "tool-output-available",
							toolCallId: part.toolCallId,
							output: part.output,
							...part.providerExecuted != null ? { providerExecuted: part.providerExecuted } : {},
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {},
							...part.preliminary != null ? { preliminary: part.preliminary } : {},
							...dynamic != null ? { dynamic } : {}
						});
						break;
					}
					case "tool-error": {
						const dynamic = isDynamic(part);
						controller.enqueue({
							type: "tool-output-error",
							toolCallId: part.toolCallId,
							errorText: part.providerExecuted ? typeof part.error === "string" ? part.error : JSON.stringify(part.error) : onError(part.error),
							...part.providerExecuted != null ? { providerExecuted: part.providerExecuted } : {},
							...part.providerMetadata != null ? { providerMetadata: part.providerMetadata } : {},
							...dynamic != null ? { dynamic } : {}
						});
						break;
					}
					case "tool-output-denied":
						controller.enqueue({
							type: "tool-output-denied",
							toolCallId: part.toolCallId
						});
						break;
					case "error":
						controller.enqueue({
							type: "error",
							errorText: onError(part.error)
						});
						break;
					case "start-step":
						controller.enqueue({ type: "start-step" });
						break;
					case "finish-step":
						controller.enqueue({ type: "finish-step" });
						break;
					case "start":
						if (sendStart) controller.enqueue({
							type: "start",
							...messageMetadataValue != null ? { messageMetadata: messageMetadataValue } : {},
							...responseMessageId != null ? { messageId: responseMessageId } : {}
						});
						break;
					case "finish":
						if (sendFinish) controller.enqueue({
							type: "finish",
							finishReason: part.finishReason,
							...messageMetadataValue != null ? { messageMetadata: messageMetadataValue } : {}
						});
						break;
					case "abort":
						controller.enqueue(part);
						break;
					case "tool-input-end": break;
					case "raw": break;
					default: throw new Error(`Unknown chunk type: ${partType}`);
				}
				if (messageMetadataValue != null && partType !== "start" && partType !== "finish") controller.enqueue({
					type: "message-metadata",
					messageMetadata: messageMetadataValue
				});
			} })),
			messageId: responseMessageId != null ? responseMessageId : generateMessageId == null ? void 0 : generateMessageId(),
			originalMessages,
			onFinish,
			onError
		}));
	}
	pipeUIMessageStreamToResponse(response, { originalMessages, generateMessageId, onFinish, messageMetadata, sendReasoning, sendSources, sendFinish, sendStart, onError, ...init } = {}) {
		pipeUIMessageStreamToResponse({
			response,
			stream: this.toUIMessageStream({
				originalMessages,
				generateMessageId,
				onFinish,
				messageMetadata,
				sendReasoning,
				sendSources,
				sendFinish,
				sendStart,
				onError
			}),
			...init
		});
	}
	pipeTextStreamToResponse(response, init) {
		pipeTextStreamToResponse({
			response,
			textStream: this.textStream,
			...init
		});
	}
	toUIMessageStreamResponse({ originalMessages, generateMessageId, onFinish, messageMetadata, sendReasoning, sendSources, sendFinish, sendStart, onError, ...init } = {}) {
		return createUIMessageStreamResponse({
			stream: this.toUIMessageStream({
				originalMessages,
				generateMessageId,
				onFinish,
				messageMetadata,
				sendReasoning,
				sendSources,
				sendFinish,
				sendStart,
				onError
			}),
			...init
		});
	}
	toTextStreamResponse(init) {
		return createTextStreamResponse({
			textStream: this.textStream,
			...init
		});
	}
};
var ToolLoopAgent = class {
	constructor(settings) {
		this.version = "agent-v1";
		this.settings = settings;
	}
	/**
	* The id of the agent.
	*/
	get id() {
		return this.settings.id;
	}
	/**
	* The tools that the agent can use.
	*/
	get tools() {
		return this.settings.tools;
	}
	async prepareCall(options) {
		var _a21, _b, _c, _d;
		if (this.settings.callOptionsSchema != null && options.options !== void 0) {
			const validatedOptions = await validateTypes({
				value: options.options,
				schema: this.settings.callOptionsSchema,
				context: { field: "options" }
			});
			options = {
				...options,
				options: validatedOptions
			};
		}
		const { onStepFinish: _settingsOnStepFinish, ...settingsWithoutCallback } = this.settings;
		const baseCallArgs = {
			...settingsWithoutCallback,
			stopWhen: (_a21 = this.settings.stopWhen) != null ? _a21 : stepCountIs(20),
			...options
		};
		const { instructions, messages, prompt, ...callArgs } = (_d = await ((_c = (_b = this.settings).prepareCall) == null ? void 0 : _c.call(_b, baseCallArgs))) != null ? _d : baseCallArgs;
		return {
			...callArgs,
			system: instructions,
			messages,
			prompt
		};
	}
	mergeOnStepFinishCallbacks(methodCallback) {
		const constructorCallback = this.settings.onStepFinish;
		if (methodCallback && constructorCallback) return async (stepResult) => {
			await constructorCallback(stepResult);
			await methodCallback(stepResult);
		};
		return methodCallback != null ? methodCallback : constructorCallback;
	}
	/**
	* Generates an output from the agent (non-streaming).
	*/
	async generate({ abortSignal, timeout, onStepFinish, ...options }) {
		return generateText({
			...await this.prepareCall(options),
			abortSignal,
			timeout,
			onStepFinish: this.mergeOnStepFinishCallbacks(onStepFinish)
		});
	}
	/**
	* Streams an output from the agent (streaming).
	*/
	async stream({ abortSignal, timeout, experimental_transform, onStepFinish, ...options }) {
		return streamText({
			...await this.prepareCall(options),
			abortSignal,
			timeout,
			experimental_transform,
			onStepFinish: this.mergeOnStepFinishCallbacks(onStepFinish)
		});
	}
};
function createUIMessageStream({ execute, onError = getErrorMessage$1, originalMessages, onStepFinish, onFinish, generateId: generateId2 = generateId }) {
	let controller;
	const ongoingStreamPromises = [];
	const stream = new ReadableStream({ start(controllerArg) {
		controller = controllerArg;
	} });
	function safeEnqueue(data) {
		try {
			controller.enqueue(data);
		} catch (error) {}
	}
	try {
		const result = execute({ writer: {
			write(part) {
				safeEnqueue(part);
			},
			merge(streamArg) {
				ongoingStreamPromises.push((async () => {
					const reader = streamArg.getReader();
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						safeEnqueue(value);
					}
				})().catch((error) => {
					safeEnqueue({
						type: "error",
						errorText: onError(error)
					});
				}));
			},
			onError
		} });
		if (result) ongoingStreamPromises.push(result.catch((error) => {
			safeEnqueue({
				type: "error",
				errorText: onError(error)
			});
		}));
	} catch (error) {
		safeEnqueue({
			type: "error",
			errorText: onError(error)
		});
	}
	new Promise(async (resolve3) => {
		while (ongoingStreamPromises.length > 0) await ongoingStreamPromises.shift();
		resolve3();
	}).finally(() => {
		try {
			controller.close();
		} catch (error) {}
	});
	return handleUIMessageStreamFinish({
		stream,
		messageId: generateId2(),
		originalMessages,
		onStepFinish,
		onFinish,
		onError
	});
}
function readUIMessageStream({ message, stream, onError, terminateOnError = false }) {
	var _a21;
	let controller;
	let hasErrored = false;
	const outputStream = new ReadableStream({ start(controllerParam) {
		controller = controllerParam;
	} });
	const state = createStreamingUIMessageState({
		messageId: (_a21 = message == null ? void 0 : message.id) != null ? _a21 : "",
		lastMessage: message
	});
	const handleError = (error) => {
		onError?.(error);
		if (!hasErrored && terminateOnError) {
			hasErrored = true;
			controller?.error(error);
		}
	};
	consumeStream({
		stream: processUIMessageStream({
			stream,
			runUpdateMessageJob(job) {
				return job({
					state,
					write: () => {
						controller?.enqueue(structuredClone(state.message));
					}
				});
			},
			onError: handleError
		}),
		onError: handleError
	}).finally(() => {
		if (!hasErrored) controller?.close();
	});
	return createAsyncIterableStream(outputStream);
}
async function convertToModelMessages(messages, options) {
	const modelMessages = [];
	if (options == null ? void 0 : options.ignoreIncompleteToolCalls) messages = messages.map((message) => ({
		...message,
		parts: message.parts.filter((part) => !isToolUIPart(part) || part.state !== "input-streaming" && part.state !== "input-available")
	}));
	for (const message of messages) switch (message.role) {
		case "system": {
			const textParts = message.parts.filter((part) => part.type === "text");
			const providerMetadata = textParts.reduce((acc, part) => {
				if (part.providerMetadata != null) return {
					...acc,
					...part.providerMetadata
				};
				return acc;
			}, {});
			modelMessages.push({
				role: "system",
				content: textParts.map((part) => part.text).join(""),
				...Object.keys(providerMetadata).length > 0 ? { providerOptions: providerMetadata } : {}
			});
			break;
		}
		case "user":
			modelMessages.push({
				role: "user",
				content: message.parts.map((part) => {
					var _a21;
					if (isTextUIPart(part)) return {
						type: "text",
						text: part.text,
						...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
					};
					if (isFileUIPart(part)) return {
						type: "file",
						mediaType: part.mediaType,
						filename: part.filename,
						data: part.url,
						...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
					};
					if (isDataUIPart(part)) return (_a21 = options == null ? void 0 : options.convertDataPart) == null ? void 0 : _a21.call(options, part);
				}).filter(isNonNullable)
			});
			break;
		case "assistant":
			if (message.parts != null) {
				let block = [];
				async function processBlock() {
					var _a21, _b, _c, _d, _e, _f, _g;
					if (block.length === 0) return;
					const content = [];
					for (const part of block) if (isTextUIPart(part)) content.push({
						type: "text",
						text: part.text,
						...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
					});
					else if (isFileUIPart(part)) content.push({
						type: "file",
						mediaType: part.mediaType,
						filename: part.filename,
						data: part.url,
						...part.providerMetadata != null ? { providerOptions: part.providerMetadata } : {}
					});
					else if (isReasoningUIPart(part)) content.push({
						type: "reasoning",
						text: part.text,
						providerOptions: part.providerMetadata
					});
					else if (isToolUIPart(part)) {
						const toolName = getToolName(part);
						if (part.state !== "input-streaming") {
							content.push({
								type: "tool-call",
								toolCallId: part.toolCallId,
								toolName,
								input: part.state === "output-error" ? (_a21 = part.input) != null ? _a21 : "rawInput" in part ? part.rawInput : void 0 : part.input,
								providerExecuted: part.providerExecuted,
								...part.callProviderMetadata != null ? { providerOptions: part.callProviderMetadata } : {}
							});
							if (part.approval != null) content.push({
								type: "tool-approval-request",
								approvalId: part.approval.id,
								toolCallId: part.toolCallId
							});
							if (part.providerExecuted === true && part.state !== "approval-responded" && (part.state === "output-available" || part.state === "output-error")) {
								const resultProviderMetadata = (_b = part.resultProviderMetadata) != null ? _b : part.callProviderMetadata;
								content.push({
									type: "tool-result",
									toolCallId: part.toolCallId,
									toolName,
									output: await createToolModelOutput({
										toolCallId: part.toolCallId,
										input: part.input,
										output: part.state === "output-error" ? part.errorText : part.output,
										tool: (_c = options == null ? void 0 : options.tools) == null ? void 0 : _c[toolName],
										errorMode: part.state === "output-error" ? "json" : "none"
									}),
									...resultProviderMetadata != null ? { providerOptions: resultProviderMetadata } : {}
								});
							}
						}
					} else if (isDataUIPart(part)) {
						const dataPart = (_d = options == null ? void 0 : options.convertDataPart) == null ? void 0 : _d.call(options, part);
						if (dataPart != null) content.push(dataPart);
					} else throw new Error(`Unsupported part: ${part}`);
					modelMessages.push({
						role: "assistant",
						content
					});
					const toolParts = block.filter((part) => {
						var _a22;
						return isToolUIPart(part) && (part.providerExecuted !== true || ((_a22 = part.approval) == null ? void 0 : _a22.approved) != null);
					});
					if (toolParts.length > 0) {
						const content2 = [];
						for (const toolPart of toolParts) {
							if (((_e = toolPart.approval) == null ? void 0 : _e.approved) != null) content2.push({
								type: "tool-approval-response",
								approvalId: toolPart.approval.id,
								approved: toolPart.approval.approved,
								reason: toolPart.approval.reason,
								providerExecuted: toolPart.providerExecuted
							});
							if (toolPart.providerExecuted === true) continue;
							switch (toolPart.state) {
								case "output-denied":
									content2.push({
										type: "tool-result",
										toolCallId: toolPart.toolCallId,
										toolName: getToolName(toolPart),
										output: {
											type: "error-text",
											value: (_f = toolPart.approval.reason) != null ? _f : "Tool execution denied."
										},
										...toolPart.callProviderMetadata != null ? { providerOptions: toolPart.callProviderMetadata } : {}
									});
									break;
								case "output-error":
								case "output-available": {
									const toolName = getToolName(toolPart);
									content2.push({
										type: "tool-result",
										toolCallId: toolPart.toolCallId,
										toolName,
										output: await createToolModelOutput({
											toolCallId: toolPart.toolCallId,
											input: toolPart.input,
											output: toolPart.state === "output-error" ? toolPart.errorText : toolPart.output,
											tool: (_g = options == null ? void 0 : options.tools) == null ? void 0 : _g[toolName],
											errorMode: toolPart.state === "output-error" ? "text" : "none"
										}),
										...toolPart.callProviderMetadata != null ? { providerOptions: toolPart.callProviderMetadata } : {}
									});
									break;
								}
							}
						}
						if (content2.length > 0) modelMessages.push({
							role: "tool",
							content: content2
						});
					}
					block = [];
				}
				for (const part of message.parts) if (isTextUIPart(part) || isReasoningUIPart(part) || isFileUIPart(part) || isToolUIPart(part) || isDataUIPart(part)) block.push(part);
				else if (part.type === "step-start") await processBlock();
				await processBlock();
				break;
			}
			break;
		default: {
			const _exhaustiveCheck = message.role;
			throw new MessageConversionError({
				originalMessage: message,
				message: `Unsupported role: ${_exhaustiveCheck}`
			});
		}
	}
	return modelMessages;
}
var uiMessagesSchema = lazySchema(() => zodSchema(array$1(object$1({
	id: string(),
	role: _enum([
		"system",
		"user",
		"assistant"
	]),
	metadata: unknown().optional(),
	parts: array$1(union([
		object$1({
			type: literal("text"),
			text: string(),
			state: _enum(["streaming", "done"]).optional(),
			providerMetadata: providerMetadataSchema.optional()
		}),
		object$1({
			type: literal("reasoning"),
			text: string(),
			state: _enum(["streaming", "done"]).optional(),
			providerMetadata: providerMetadataSchema.optional()
		}),
		object$1({
			type: literal("source-url"),
			sourceId: string(),
			url: string(),
			title: string().optional(),
			providerMetadata: providerMetadataSchema.optional()
		}),
		object$1({
			type: literal("source-document"),
			sourceId: string(),
			mediaType: string(),
			title: string(),
			filename: string().optional(),
			providerMetadata: providerMetadataSchema.optional()
		}),
		object$1({
			type: literal("file"),
			mediaType: string(),
			filename: string().optional(),
			url: string(),
			providerMetadata: providerMetadataSchema.optional()
		}),
		object$1({ type: literal("step-start") }),
		object$1({
			type: string().startsWith("data-"),
			id: string().optional(),
			data: unknown()
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("input-streaming"),
			input: unknown().optional(),
			providerExecuted: boolean().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			output: never().optional(),
			errorText: never().optional(),
			approval: never().optional()
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("input-available"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: never().optional()
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("approval-requested"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: never().optional(),
				reason: never().optional()
			})
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("approval-responded"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: boolean(),
				reason: string().optional()
			})
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("output-available"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: unknown(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			resultProviderMetadata: providerMetadataSchema.optional(),
			preliminary: boolean().optional(),
			approval: object$1({
				id: string(),
				approved: literal(true),
				reason: string().optional()
			}).optional()
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("output-error"),
			input: unknown(),
			rawInput: unknown().optional(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: string(),
			callProviderMetadata: providerMetadataSchema.optional(),
			resultProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: literal(true),
				reason: string().optional()
			}).optional()
		}),
		object$1({
			type: literal("dynamic-tool"),
			toolName: string(),
			toolCallId: string(),
			state: literal("output-denied"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: literal(false),
				reason: string().optional()
			})
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("input-streaming"),
			providerExecuted: boolean().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			input: unknown().optional(),
			output: never().optional(),
			errorText: never().optional(),
			approval: never().optional()
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("input-available"),
			providerExecuted: boolean().optional(),
			input: unknown(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: never().optional()
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("approval-requested"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: never().optional(),
				reason: never().optional()
			})
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("approval-responded"),
			input: unknown(),
			providerExecuted: boolean().optional(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: boolean(),
				reason: string().optional()
			})
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("output-available"),
			providerExecuted: boolean().optional(),
			input: unknown(),
			output: unknown(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			resultProviderMetadata: providerMetadataSchema.optional(),
			preliminary: boolean().optional(),
			approval: object$1({
				id: string(),
				approved: literal(true),
				reason: string().optional()
			}).optional()
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("output-error"),
			providerExecuted: boolean().optional(),
			input: unknown(),
			rawInput: unknown().optional(),
			output: never().optional(),
			errorText: string(),
			callProviderMetadata: providerMetadataSchema.optional(),
			resultProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: literal(true),
				reason: string().optional()
			}).optional()
		}),
		object$1({
			type: string().startsWith("tool-"),
			toolCallId: string(),
			state: literal("output-denied"),
			providerExecuted: boolean().optional(),
			input: unknown(),
			output: never().optional(),
			errorText: never().optional(),
			callProviderMetadata: providerMetadataSchema.optional(),
			approval: object$1({
				id: string(),
				approved: literal(false),
				reason: string().optional()
			})
		})
	])).nonempty("Message must contain at least one part")
})).nonempty("Messages array must not be empty")));
async function safeValidateUIMessages({ messages, metadataSchema, dataSchemas, tools }) {
	try {
		if (messages == null) return {
			success: false,
			error: new InvalidArgumentError({
				parameter: "messages",
				value: messages,
				message: "messages parameter must be provided"
			})
		};
		const validatedMessages = await validateTypes({
			value: messages,
			schema: uiMessagesSchema
		});
		if (metadataSchema) for (const [msgIdx, message] of validatedMessages.entries()) await validateTypes({
			value: message.metadata,
			schema: metadataSchema,
			context: {
				field: `messages[${msgIdx}].metadata`,
				entityId: message.id
			}
		});
		if (dataSchemas || tools) for (const [msgIdx, message] of validatedMessages.entries()) for (const [partIdx, part] of message.parts.entries()) {
			if (dataSchemas && part.type.startsWith("data-")) {
				const dataPart = part;
				const dataName = dataPart.type.slice(5);
				const dataSchema = dataSchemas[dataName];
				if (!dataSchema) return {
					success: false,
					error: new TypeValidationError({
						value: dataPart.data,
						cause: `No data schema found for data part ${dataName}`,
						context: {
							field: `messages[${msgIdx}].parts[${partIdx}].data`,
							entityName: dataName,
							entityId: dataPart.id
						}
					})
				};
				await validateTypes({
					value: dataPart.data,
					schema: dataSchema,
					context: {
						field: `messages[${msgIdx}].parts[${partIdx}].data`,
						entityName: dataName,
						entityId: dataPart.id
					}
				});
			}
			if (tools && part.type.startsWith("tool-")) {
				const toolPart = part;
				const toolName = toolPart.type.slice(5);
				const tool2 = tools[toolName];
				if (!tool2 && (toolPart.state === "output-available" || toolPart.state === "output-error" || toolPart.state === "output-denied")) continue;
				if (!tool2) return {
					success: false,
					error: new TypeValidationError({
						value: toolPart.input,
						cause: `No tool schema found for tool part ${toolName}`,
						context: {
							field: `messages[${msgIdx}].parts[${partIdx}].input`,
							entityName: toolName,
							entityId: toolPart.toolCallId
						}
					})
				};
				if (toolPart.state === "input-available" || toolPart.state === "output-available" || toolPart.state === "output-error" && toolPart.input !== void 0) await validateTypes({
					value: toolPart.input,
					schema: tool2.inputSchema,
					context: {
						field: `messages[${msgIdx}].parts[${partIdx}].input`,
						entityName: toolName,
						entityId: toolPart.toolCallId
					}
				});
				if (toolPart.state === "output-available" && tool2.outputSchema) await validateTypes({
					value: toolPart.output,
					schema: tool2.outputSchema,
					context: {
						field: `messages[${msgIdx}].parts[${partIdx}].output`,
						entityName: toolName,
						entityId: toolPart.toolCallId
					}
				});
			}
		}
		return {
			success: true,
			data: validatedMessages
		};
	} catch (error) {
		return {
			success: false,
			error
		};
	}
}
async function validateUIMessages({ messages, metadataSchema, dataSchemas, tools }) {
	const response = await safeValidateUIMessages({
		messages,
		metadataSchema,
		dataSchemas,
		tools
	});
	if (!response.success) throw response.error;
	return response.data;
}
async function createAgentUIStream({ agent, uiMessages, options, abortSignal, timeout, experimental_transform, onStepFinish, ...uiMessageStreamOptions }) {
	var _a21;
	const validatedMessages = await validateUIMessages({
		messages: uiMessages,
		tools: agent.tools
	});
	const modelMessages = await convertToModelMessages(validatedMessages, { tools: agent.tools });
	return (await agent.stream({
		prompt: modelMessages,
		options,
		abortSignal,
		timeout,
		experimental_transform,
		onStepFinish
	})).toUIMessageStream({
		...uiMessageStreamOptions,
		originalMessages: (_a21 = uiMessageStreamOptions.originalMessages) != null ? _a21 : validatedMessages
	});
}
async function createAgentUIStreamResponse({ headers, status, statusText, consumeSseStream, ...options }) {
	return createUIMessageStreamResponse({
		headers,
		status,
		statusText,
		consumeSseStream,
		stream: await createAgentUIStream(options)
	});
}
async function pipeAgentUIStreamToResponse({ response, headers, status, statusText, consumeSseStream, ...options }) {
	pipeUIMessageStreamToResponse({
		response,
		headers,
		status,
		statusText,
		consumeSseStream,
		stream: await createAgentUIStream(options)
	});
}
async function embed({ model: modelArg, value, providerOptions, maxRetries: maxRetriesArg, abortSignal, headers, experimental_telemetry: telemetry }) {
	const model = resolveEmbeddingModel(modelArg);
	const { maxRetries, retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const baseTelemetryAttributes = getBaseTelemetryAttributes({
		model,
		telemetry,
		headers: headersWithUserAgent,
		settings: { maxRetries }
	});
	const tracer = getTracer(telemetry);
	return recordSpan({
		name: "ai.embed",
		attributes: selectTelemetryAttributes({
			telemetry,
			attributes: {
				...assembleOperationName({
					operationId: "ai.embed",
					telemetry
				}),
				...baseTelemetryAttributes,
				"ai.value": { input: () => JSON.stringify(value) }
			}
		}),
		tracer,
		fn: async (span) => {
			const { embedding, usage, warnings, response, providerMetadata } = await retry(() => recordSpan({
				name: "ai.embed.doEmbed",
				attributes: selectTelemetryAttributes({
					telemetry,
					attributes: {
						...assembleOperationName({
							operationId: "ai.embed.doEmbed",
							telemetry
						}),
						...baseTelemetryAttributes,
						"ai.values": { input: () => [JSON.stringify(value)] }
					}
				}),
				tracer,
				fn: async (doEmbedSpan) => {
					var _a21;
					const modelResponse = await model.doEmbed({
						values: [value],
						abortSignal,
						headers: headersWithUserAgent,
						providerOptions
					});
					const embedding2 = modelResponse.embeddings[0];
					const usage2 = (_a21 = modelResponse.usage) != null ? _a21 : { tokens: NaN };
					doEmbedSpan.setAttributes(await selectTelemetryAttributes({
						telemetry,
						attributes: {
							"ai.embeddings": { output: () => modelResponse.embeddings.map((embedding3) => JSON.stringify(embedding3)) },
							"ai.usage.tokens": usage2.tokens
						}
					}));
					return {
						embedding: embedding2,
						usage: usage2,
						warnings: modelResponse.warnings,
						providerMetadata: modelResponse.providerMetadata,
						response: modelResponse.response
					};
				}
			}));
			span.setAttributes(await selectTelemetryAttributes({
				telemetry,
				attributes: {
					"ai.embedding": { output: () => JSON.stringify(embedding) },
					"ai.usage.tokens": usage.tokens
				}
			}));
			logWarnings({
				warnings,
				provider: model.provider,
				model: model.modelId
			});
			return new DefaultEmbedResult({
				value,
				embedding,
				usage,
				warnings,
				providerMetadata,
				response
			});
		}
	});
}
var DefaultEmbedResult = class {
	constructor(options) {
		this.value = options.value;
		this.embedding = options.embedding;
		this.usage = options.usage;
		this.warnings = options.warnings;
		this.providerMetadata = options.providerMetadata;
		this.response = options.response;
	}
};
function splitArray(array2, chunkSize) {
	if (chunkSize <= 0) throw new Error("chunkSize must be greater than 0");
	const result = [];
	for (let i = 0; i < array2.length; i += chunkSize) result.push(array2.slice(i, i + chunkSize));
	return result;
}
async function embedMany({ model: modelArg, values, maxParallelCalls = Infinity, maxRetries: maxRetriesArg, abortSignal, headers, providerOptions, experimental_telemetry: telemetry }) {
	const model = resolveEmbeddingModel(modelArg);
	const { maxRetries, retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const baseTelemetryAttributes = getBaseTelemetryAttributes({
		model,
		telemetry,
		headers: headersWithUserAgent,
		settings: { maxRetries }
	});
	const tracer = getTracer(telemetry);
	return recordSpan({
		name: "ai.embedMany",
		attributes: selectTelemetryAttributes({
			telemetry,
			attributes: {
				...assembleOperationName({
					operationId: "ai.embedMany",
					telemetry
				}),
				...baseTelemetryAttributes,
				"ai.values": { input: () => values.map((value) => JSON.stringify(value)) }
			}
		}),
		tracer,
		fn: async (span) => {
			var _a21;
			const [maxEmbeddingsPerCall, supportsParallelCalls] = await Promise.all([model.maxEmbeddingsPerCall, model.supportsParallelCalls]);
			if (maxEmbeddingsPerCall == null || maxEmbeddingsPerCall === Infinity) {
				const { embeddings: embeddings2, usage, warnings: warnings2, response, providerMetadata: providerMetadata2 } = await retry(() => {
					return recordSpan({
						name: "ai.embedMany.doEmbed",
						attributes: selectTelemetryAttributes({
							telemetry,
							attributes: {
								...assembleOperationName({
									operationId: "ai.embedMany.doEmbed",
									telemetry
								}),
								...baseTelemetryAttributes,
								"ai.values": { input: () => values.map((value) => JSON.stringify(value)) }
							}
						}),
						tracer,
						fn: async (doEmbedSpan) => {
							var _a22;
							const modelResponse = await model.doEmbed({
								values,
								abortSignal,
								headers: headersWithUserAgent,
								providerOptions
							});
							const embeddings3 = modelResponse.embeddings;
							const usage2 = (_a22 = modelResponse.usage) != null ? _a22 : { tokens: NaN };
							doEmbedSpan.setAttributes(await selectTelemetryAttributes({
								telemetry,
								attributes: {
									"ai.embeddings": { output: () => embeddings3.map((embedding) => JSON.stringify(embedding)) },
									"ai.usage.tokens": usage2.tokens
								}
							}));
							return {
								embeddings: embeddings3,
								usage: usage2,
								warnings: modelResponse.warnings,
								providerMetadata: modelResponse.providerMetadata,
								response: modelResponse.response
							};
						}
					});
				});
				span.setAttributes(await selectTelemetryAttributes({
					telemetry,
					attributes: {
						"ai.embeddings": { output: () => embeddings2.map((embedding) => JSON.stringify(embedding)) },
						"ai.usage.tokens": usage.tokens
					}
				}));
				logWarnings({
					warnings: warnings2,
					provider: model.provider,
					model: model.modelId
				});
				return new DefaultEmbedManyResult({
					values,
					embeddings: embeddings2,
					usage,
					warnings: warnings2,
					providerMetadata: providerMetadata2,
					responses: [response]
				});
			}
			const valueChunks = splitArray(values, maxEmbeddingsPerCall);
			const embeddings = [];
			const warnings = [];
			const responses = [];
			let tokens = 0;
			let providerMetadata;
			const parallelChunks = splitArray(valueChunks, supportsParallelCalls ? maxParallelCalls : 1);
			for (const parallelChunk of parallelChunks) {
				const results = await Promise.all(parallelChunk.map((chunk) => {
					return retry(() => {
						return recordSpan({
							name: "ai.embedMany.doEmbed",
							attributes: selectTelemetryAttributes({
								telemetry,
								attributes: {
									...assembleOperationName({
										operationId: "ai.embedMany.doEmbed",
										telemetry
									}),
									...baseTelemetryAttributes,
									"ai.values": { input: () => chunk.map((value) => JSON.stringify(value)) }
								}
							}),
							tracer,
							fn: async (doEmbedSpan) => {
								var _a22;
								const modelResponse = await model.doEmbed({
									values: chunk,
									abortSignal,
									headers: headersWithUserAgent,
									providerOptions
								});
								const embeddings2 = modelResponse.embeddings;
								const usage = (_a22 = modelResponse.usage) != null ? _a22 : { tokens: NaN };
								doEmbedSpan.setAttributes(await selectTelemetryAttributes({
									telemetry,
									attributes: {
										"ai.embeddings": { output: () => embeddings2.map((embedding) => JSON.stringify(embedding)) },
										"ai.usage.tokens": usage.tokens
									}
								}));
								return {
									embeddings: embeddings2,
									usage,
									warnings: modelResponse.warnings,
									providerMetadata: modelResponse.providerMetadata,
									response: modelResponse.response
								};
							}
						});
					});
				}));
				for (const result of results) {
					embeddings.push(...result.embeddings);
					warnings.push(...result.warnings);
					responses.push(result.response);
					tokens += result.usage.tokens;
					if (result.providerMetadata) if (!providerMetadata) providerMetadata = { ...result.providerMetadata };
					else for (const [providerName, metadata] of Object.entries(result.providerMetadata)) providerMetadata[providerName] = {
						...(_a21 = providerMetadata[providerName]) != null ? _a21 : {},
						...metadata
					};
				}
			}
			span.setAttributes(await selectTelemetryAttributes({
				telemetry,
				attributes: {
					"ai.embeddings": { output: () => embeddings.map((embedding) => JSON.stringify(embedding)) },
					"ai.usage.tokens": tokens
				}
			}));
			logWarnings({
				warnings,
				provider: model.provider,
				model: model.modelId
			});
			return new DefaultEmbedManyResult({
				values,
				embeddings,
				usage: { tokens },
				warnings,
				providerMetadata,
				responses
			});
		}
	});
}
var DefaultEmbedManyResult = class {
	constructor(options) {
		this.values = options.values;
		this.embeddings = options.embeddings;
		this.usage = options.usage;
		this.warnings = options.warnings;
		this.providerMetadata = options.providerMetadata;
		this.responses = options.responses;
	}
};
async function generateImage({ model: modelArg, prompt: promptArg, n = 1, maxImagesPerCall, size, aspectRatio, seed, providerOptions, maxRetries: maxRetriesArg, abortSignal, headers }) {
	var _a21;
	const model = resolveImageModel(modelArg);
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const { retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const maxImagesPerCallWithDefault = (_a21 = maxImagesPerCall != null ? maxImagesPerCall : await invokeModelMaxImagesPerCall(model)) != null ? _a21 : 1;
	const callCount = Math.ceil(n / maxImagesPerCallWithDefault);
	const callImageCounts = Array.from({ length: callCount }, (_, i) => {
		if (i < callCount - 1) return maxImagesPerCallWithDefault;
		const remainder = n % maxImagesPerCallWithDefault;
		return remainder === 0 ? maxImagesPerCallWithDefault : remainder;
	});
	const results = await Promise.all(callImageCounts.map(async (callImageCount) => retry(() => {
		const { prompt, files, mask } = normalizePrompt(promptArg);
		return model.doGenerate({
			prompt,
			files,
			mask,
			n: callImageCount,
			abortSignal,
			headers: headersWithUserAgent,
			size,
			aspectRatio,
			seed,
			providerOptions: providerOptions != null ? providerOptions : {}
		});
	})));
	const images = [];
	const warnings = [];
	const responses = [];
	const providerMetadata = {};
	let totalUsage = {
		inputTokens: void 0,
		outputTokens: void 0,
		totalTokens: void 0
	};
	for (const result of results) {
		images.push(...result.images.map((image) => {
			var _a22;
			return new DefaultGeneratedFile({
				data: image,
				mediaType: (_a22 = detectMediaType({
					data: image,
					signatures: imageMediaTypeSignatures
				})) != null ? _a22 : "image/png"
			});
		}));
		warnings.push(...result.warnings);
		if (result.usage != null) totalUsage = addImageModelUsage(totalUsage, result.usage);
		if (result.providerMetadata) for (const [providerName, metadata] of Object.entries(result.providerMetadata)) if (providerName === "gateway") {
			const currentEntry = providerMetadata[providerName];
			if (currentEntry != null && typeof currentEntry === "object") providerMetadata[providerName] = {
				...currentEntry,
				...metadata
			};
			else providerMetadata[providerName] = metadata;
			const imagesValue = providerMetadata[providerName].images;
			if (Array.isArray(imagesValue) && imagesValue.length === 0) delete providerMetadata[providerName].images;
		} else {
			providerMetadata[providerName] ?? (providerMetadata[providerName] = { images: [] });
			providerMetadata[providerName].images.push(...result.providerMetadata[providerName].images);
		}
		responses.push(result.response);
	}
	logWarnings({
		warnings,
		provider: model.provider,
		model: model.modelId
	});
	if (!images.length) throw new NoImageGeneratedError({ responses });
	return new DefaultGenerateImageResult({
		images,
		warnings,
		responses,
		providerMetadata,
		usage: totalUsage
	});
}
var DefaultGenerateImageResult = class {
	constructor(options) {
		this.images = options.images;
		this.warnings = options.warnings;
		this.responses = options.responses;
		this.providerMetadata = options.providerMetadata;
		this.usage = options.usage;
	}
	get image() {
		return this.images[0];
	}
};
async function invokeModelMaxImagesPerCall(model) {
	if (!(model.maxImagesPerCall instanceof Function)) return model.maxImagesPerCall;
	return model.maxImagesPerCall({ modelId: model.modelId });
}
function normalizePrompt(prompt) {
	if (typeof prompt === "string") return {
		prompt,
		files: void 0,
		mask: void 0
	};
	return {
		prompt: prompt.text,
		files: prompt.images.map(toImageModelV3File),
		mask: prompt.mask ? toImageModelV3File(prompt.mask) : void 0
	};
}
function toImageModelV3File(dataContent) {
	if (typeof dataContent === "string" && dataContent.startsWith("http")) return {
		type: "url",
		url: dataContent
	};
	if (typeof dataContent === "string" && dataContent.startsWith("data:")) {
		const { mediaType: dataUrlMediaType, base64Content } = splitDataUrl(dataContent);
		if (base64Content != null) {
			const uint8Data2 = convertBase64ToUint8Array(base64Content);
			return {
				type: "file",
				data: uint8Data2,
				mediaType: dataUrlMediaType || detectMediaType({
					data: uint8Data2,
					signatures: imageMediaTypeSignatures
				}) || "image/png"
			};
		}
	}
	const uint8Data = convertDataContentToUint8Array(dataContent);
	return {
		type: "file",
		data: uint8Data,
		mediaType: detectMediaType({
			data: uint8Data,
			signatures: imageMediaTypeSignatures
		}) || "image/png"
	};
}
var experimental_generateImage = generateImage;
var noSchemaOutputStrategy = {
	type: "no-schema",
	jsonSchema: async () => void 0,
	async validatePartialResult({ value, textDelta }) {
		return {
			success: true,
			value: {
				partial: value,
				textDelta
			}
		};
	},
	async validateFinalResult(value, context2) {
		return value === void 0 ? {
			success: false,
			error: new NoObjectGeneratedError({
				message: "No object generated: response did not match schema.",
				text: context2.text,
				response: context2.response,
				usage: context2.usage,
				finishReason: context2.finishReason
			})
		} : {
			success: true,
			value
		};
	},
	createElementStream() {
		throw new UnsupportedFunctionalityError({ functionality: "element streams in no-schema mode" });
	}
};
var objectOutputStrategy = (schema) => ({
	type: "object",
	jsonSchema: async () => await schema.jsonSchema,
	async validatePartialResult({ value, textDelta }) {
		return {
			success: true,
			value: {
				partial: value,
				textDelta
			}
		};
	},
	async validateFinalResult(value) {
		return safeValidateTypes({
			value,
			schema
		});
	},
	createElementStream() {
		throw new UnsupportedFunctionalityError({ functionality: "element streams in object mode" });
	}
});
var arrayOutputStrategy = (schema) => {
	return {
		type: "array",
		jsonSchema: async () => {
			const { $schema, ...itemSchema } = await schema.jsonSchema;
			return {
				$schema: "http://json-schema.org/draft-07/schema#",
				type: "object",
				properties: { elements: {
					type: "array",
					items: itemSchema
				} },
				required: ["elements"],
				additionalProperties: false
			};
		},
		async validatePartialResult({ value, latestObject, isFirstDelta, isFinalDelta }) {
			var _a21;
			if (!isJSONObject(value) || !isJSONArray(value.elements)) return {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be an object that contains an array of elements"
				})
			};
			const inputArray = value.elements;
			const resultArray = [];
			for (let i = 0; i < inputArray.length; i++) {
				const element = inputArray[i];
				const result = await safeValidateTypes({
					value: element,
					schema
				});
				if (i === inputArray.length - 1 && !isFinalDelta) continue;
				if (!result.success) return result;
				resultArray.push(result.value);
			}
			const publishedElementCount = (_a21 = latestObject == null ? void 0 : latestObject.length) != null ? _a21 : 0;
			let textDelta = "";
			if (isFirstDelta) textDelta += "[";
			if (publishedElementCount > 0) textDelta += ",";
			textDelta += resultArray.slice(publishedElementCount).map((element) => JSON.stringify(element)).join(",");
			if (isFinalDelta) textDelta += "]";
			return {
				success: true,
				value: {
					partial: resultArray,
					textDelta
				}
			};
		},
		async validateFinalResult(value) {
			if (!isJSONObject(value) || !isJSONArray(value.elements)) return {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be an object that contains an array of elements"
				})
			};
			const inputArray = value.elements;
			for (const element of inputArray) {
				const result = await safeValidateTypes({
					value: element,
					schema
				});
				if (!result.success) return result;
			}
			return {
				success: true,
				value: inputArray
			};
		},
		createElementStream(originalStream) {
			let publishedElements = 0;
			return createAsyncIterableStream(originalStream.pipeThrough(new TransformStream({ transform(chunk, controller) {
				switch (chunk.type) {
					case "object": {
						const array2 = chunk.object;
						for (; publishedElements < array2.length; publishedElements++) controller.enqueue(array2[publishedElements]);
						break;
					}
					case "text-delta":
					case "finish":
					case "error": break;
					default: throw new Error(`Unsupported chunk type: ${chunk}`);
				}
			} })));
		}
	};
};
var enumOutputStrategy = (enumValues) => {
	return {
		type: "enum",
		jsonSchema: async () => ({
			$schema: "http://json-schema.org/draft-07/schema#",
			type: "object",
			properties: { result: {
				type: "string",
				enum: enumValues
			} },
			required: ["result"],
			additionalProperties: false
		}),
		async validateFinalResult(value) {
			if (!isJSONObject(value) || typeof value.result !== "string") return {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be an object that contains a string in the \"result\" property."
				})
			};
			const result = value.result;
			return enumValues.includes(result) ? {
				success: true,
				value: result
			} : {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be a string in the enum"
				})
			};
		},
		async validatePartialResult({ value, textDelta }) {
			if (!isJSONObject(value) || typeof value.result !== "string") return {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be an object that contains a string in the \"result\" property."
				})
			};
			const result = value.result;
			const possibleEnumValues = enumValues.filter((enumValue) => enumValue.startsWith(result));
			if (value.result.length === 0 || possibleEnumValues.length === 0) return {
				success: false,
				error: new TypeValidationError({
					value,
					cause: "value must be a string in the enum"
				})
			};
			return {
				success: true,
				value: {
					partial: possibleEnumValues.length > 1 ? result : possibleEnumValues[0],
					textDelta
				}
			};
		},
		createElementStream() {
			throw new UnsupportedFunctionalityError({ functionality: "element streams in enum mode" });
		}
	};
};
function getOutputStrategy({ output, schema, enumValues }) {
	switch (output) {
		case "object": return objectOutputStrategy(asSchema(schema));
		case "array": return arrayOutputStrategy(asSchema(schema));
		case "enum": return enumOutputStrategy(enumValues);
		case "no-schema": return noSchemaOutputStrategy;
		default: throw new Error(`Unsupported output: ${output}`);
	}
}
async function parseAndValidateObjectResult(result, outputStrategy, context2) {
	const parseResult = await safeParseJSON({ text: result });
	if (!parseResult.success) throw new NoObjectGeneratedError({
		message: "No object generated: could not parse the response.",
		cause: parseResult.error,
		text: result,
		response: context2.response,
		usage: context2.usage,
		finishReason: context2.finishReason
	});
	const validationResult = await outputStrategy.validateFinalResult(parseResult.value, {
		text: result,
		response: context2.response,
		usage: context2.usage
	});
	if (!validationResult.success) throw new NoObjectGeneratedError({
		message: "No object generated: response did not match schema.",
		cause: validationResult.error,
		text: result,
		response: context2.response,
		usage: context2.usage,
		finishReason: context2.finishReason
	});
	return validationResult.value;
}
async function parseAndValidateObjectResultWithRepair(result, outputStrategy, repairText, context2) {
	try {
		return await parseAndValidateObjectResult(result, outputStrategy, context2);
	} catch (error) {
		if (repairText != null && NoObjectGeneratedError.isInstance(error) && (JSONParseError.isInstance(error.cause) || TypeValidationError.isInstance(error.cause))) {
			const repairedText = await repairText({
				text: result,
				error: error.cause
			});
			if (repairedText === null) throw error;
			return await parseAndValidateObjectResult(repairedText, outputStrategy, context2);
		}
		throw error;
	}
}
function validateObjectGenerationInput({ output, schema, schemaName, schemaDescription, enumValues }) {
	if (output != null && output !== "object" && output !== "array" && output !== "enum" && output !== "no-schema") throw new InvalidArgumentError({
		parameter: "output",
		value: output,
		message: "Invalid output type."
	});
	if (output === "no-schema") {
		if (schema != null) throw new InvalidArgumentError({
			parameter: "schema",
			value: schema,
			message: "Schema is not supported for no-schema output."
		});
		if (schemaDescription != null) throw new InvalidArgumentError({
			parameter: "schemaDescription",
			value: schemaDescription,
			message: "Schema description is not supported for no-schema output."
		});
		if (schemaName != null) throw new InvalidArgumentError({
			parameter: "schemaName",
			value: schemaName,
			message: "Schema name is not supported for no-schema output."
		});
		if (enumValues != null) throw new InvalidArgumentError({
			parameter: "enumValues",
			value: enumValues,
			message: "Enum values are not supported for no-schema output."
		});
	}
	if (output === "object") {
		if (schema == null) throw new InvalidArgumentError({
			parameter: "schema",
			value: schema,
			message: "Schema is required for object output."
		});
		if (enumValues != null) throw new InvalidArgumentError({
			parameter: "enumValues",
			value: enumValues,
			message: "Enum values are not supported for object output."
		});
	}
	if (output === "array") {
		if (schema == null) throw new InvalidArgumentError({
			parameter: "schema",
			value: schema,
			message: "Element schema is required for array output."
		});
		if (enumValues != null) throw new InvalidArgumentError({
			parameter: "enumValues",
			value: enumValues,
			message: "Enum values are not supported for array output."
		});
	}
	if (output === "enum") {
		if (schema != null) throw new InvalidArgumentError({
			parameter: "schema",
			value: schema,
			message: "Schema is not supported for enum output."
		});
		if (schemaDescription != null) throw new InvalidArgumentError({
			parameter: "schemaDescription",
			value: schemaDescription,
			message: "Schema description is not supported for enum output."
		});
		if (schemaName != null) throw new InvalidArgumentError({
			parameter: "schemaName",
			value: schemaName,
			message: "Schema name is not supported for enum output."
		});
		if (enumValues == null) throw new InvalidArgumentError({
			parameter: "enumValues",
			value: enumValues,
			message: "Enum values are required for enum output."
		});
		for (const value of enumValues) if (typeof value !== "string") throw new InvalidArgumentError({
			parameter: "enumValues",
			value,
			message: "Enum values must be strings."
		});
	}
}
var originalGenerateId3 = createIdGenerator({
	prefix: "aiobj",
	size: 24
});
async function generateObject(options) {
	const { model: modelArg, output = "object", system, prompt, messages, allowSystemInMessages, maxRetries: maxRetriesArg, abortSignal, headers, experimental_repairText: repairText, experimental_telemetry: telemetry, experimental_download: download2, providerOptions, _internal: { generateId: generateId2 = originalGenerateId3, currentDate = () => /* @__PURE__ */ new Date() } = {}, ...settings } = options;
	const model = resolveLanguageModel(modelArg);
	const enumValues = "enum" in options ? options.enum : void 0;
	const { schema: inputSchema, schemaDescription, schemaName } = "schema" in options ? options : {};
	validateObjectGenerationInput({
		output,
		schema: inputSchema,
		schemaName,
		schemaDescription,
		enumValues
	});
	const { maxRetries, retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const outputStrategy = getOutputStrategy({
		output,
		schema: inputSchema,
		enumValues
	});
	const callSettings = prepareCallSettings(settings);
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const baseTelemetryAttributes = getBaseTelemetryAttributes({
		model,
		telemetry,
		headers: headersWithUserAgent,
		settings: {
			...callSettings,
			maxRetries
		}
	});
	const tracer = getTracer(telemetry);
	const jsonSchema2 = await outputStrategy.jsonSchema();
	try {
		return await recordSpan({
			name: "ai.generateObject",
			attributes: selectTelemetryAttributes({
				telemetry,
				attributes: {
					...assembleOperationName({
						operationId: "ai.generateObject",
						telemetry
					}),
					...baseTelemetryAttributes,
					"ai.prompt": { input: () => JSON.stringify({
						system,
						prompt,
						messages
					}) },
					"ai.schema": jsonSchema2 != null ? { input: () => JSON.stringify(jsonSchema2) } : void 0,
					"ai.schema.name": schemaName,
					"ai.schema.description": schemaDescription,
					"ai.settings.output": outputStrategy.type
				}
			}),
			tracer,
			fn: async (span) => {
				var _a21;
				let result;
				let finishReason;
				let usage;
				let warnings;
				let response;
				let request;
				let resultProviderMetadata;
				let reasoning;
				const promptMessages = await convertToLanguageModelPrompt({
					prompt: await standardizePrompt({
						system,
						prompt,
						messages,
						allowSystemInMessages
					}),
					supportedUrls: await model.supportedUrls,
					download: download2
				});
				const generateResult = await retry(() => recordSpan({
					name: "ai.generateObject.doGenerate",
					attributes: selectTelemetryAttributes({
						telemetry,
						attributes: {
							...assembleOperationName({
								operationId: "ai.generateObject.doGenerate",
								telemetry
							}),
							...baseTelemetryAttributes,
							"ai.prompt.messages": { input: () => stringifyForTelemetry(promptMessages) },
							"gen_ai.system": model.provider,
							"gen_ai.request.model": model.modelId,
							"gen_ai.request.frequency_penalty": callSettings.frequencyPenalty,
							"gen_ai.request.max_tokens": callSettings.maxOutputTokens,
							"gen_ai.request.presence_penalty": callSettings.presencePenalty,
							"gen_ai.request.temperature": callSettings.temperature,
							"gen_ai.request.top_k": callSettings.topK,
							"gen_ai.request.top_p": callSettings.topP
						}
					}),
					tracer,
					fn: async (span2) => {
						var _a22, _b, _c, _d, _e, _f, _g, _h;
						const result2 = await model.doGenerate({
							responseFormat: {
								type: "json",
								schema: jsonSchema2,
								name: schemaName,
								description: schemaDescription
							},
							...prepareCallSettings(settings),
							prompt: promptMessages,
							providerOptions,
							abortSignal,
							headers: headersWithUserAgent
						});
						const responseData = {
							id: (_b = (_a22 = result2.response) == null ? void 0 : _a22.id) != null ? _b : generateId2(),
							timestamp: (_d = (_c = result2.response) == null ? void 0 : _c.timestamp) != null ? _d : currentDate(),
							modelId: (_f = (_e = result2.response) == null ? void 0 : _e.modelId) != null ? _f : model.modelId,
							headers: (_g = result2.response) == null ? void 0 : _g.headers,
							body: (_h = result2.response) == null ? void 0 : _h.body
						};
						const text2 = extractTextContent(result2.content);
						const reasoning2 = extractReasoningContent(result2.content);
						if (text2 === void 0) throw new NoObjectGeneratedError({
							message: "No object generated: the model did not return a response.",
							response: responseData,
							usage: asLanguageModelUsage(result2.usage),
							finishReason: result2.finishReason.unified
						});
						span2.setAttributes(await selectTelemetryAttributes({
							telemetry,
							attributes: {
								"ai.response.finishReason": result2.finishReason.unified,
								"ai.response.object": { output: () => text2 },
								"ai.response.id": responseData.id,
								"ai.response.model": responseData.modelId,
								"ai.response.timestamp": responseData.timestamp.toISOString(),
								"ai.response.providerMetadata": JSON.stringify(result2.providerMetadata),
								"ai.usage.promptTokens": result2.usage.inputTokens.total,
								"ai.usage.completionTokens": result2.usage.outputTokens.total,
								"gen_ai.response.finish_reasons": [result2.finishReason.unified],
								"gen_ai.response.id": responseData.id,
								"gen_ai.response.model": responseData.modelId,
								"gen_ai.usage.input_tokens": result2.usage.inputTokens.total,
								"gen_ai.usage.output_tokens": result2.usage.outputTokens.total
							}
						}));
						return {
							...result2,
							objectText: text2,
							reasoning: reasoning2,
							responseData
						};
					}
				}));
				result = generateResult.objectText;
				finishReason = generateResult.finishReason.unified;
				usage = asLanguageModelUsage(generateResult.usage);
				warnings = generateResult.warnings;
				resultProviderMetadata = generateResult.providerMetadata;
				request = (_a21 = generateResult.request) != null ? _a21 : {};
				response = generateResult.responseData;
				reasoning = generateResult.reasoning;
				logWarnings({
					warnings,
					provider: model.provider,
					model: model.modelId
				});
				const object2 = await parseAndValidateObjectResultWithRepair(result, outputStrategy, repairText, {
					response,
					usage,
					finishReason
				});
				span.setAttributes(await selectTelemetryAttributes({
					telemetry,
					attributes: {
						"ai.response.finishReason": finishReason,
						"ai.response.object": { output: () => JSON.stringify(object2) },
						"ai.response.providerMetadata": JSON.stringify(resultProviderMetadata),
						"ai.usage.promptTokens": usage.inputTokens,
						"ai.usage.completionTokens": usage.outputTokens
					}
				}));
				return new DefaultGenerateObjectResult({
					object: object2,
					reasoning,
					finishReason,
					usage,
					warnings,
					request,
					response,
					providerMetadata: resultProviderMetadata
				});
			}
		});
	} catch (error) {
		throw wrapGatewayError(error);
	}
}
var DefaultGenerateObjectResult = class {
	constructor(options) {
		this.object = options.object;
		this.finishReason = options.finishReason;
		this.usage = options.usage;
		this.warnings = options.warnings;
		this.providerMetadata = options.providerMetadata;
		this.response = options.response;
		this.request = options.request;
		this.reasoning = options.reasoning;
	}
	toJsonResponse(init) {
		var _a21;
		return new Response(JSON.stringify(this.object), {
			status: (_a21 = init == null ? void 0 : init.status) != null ? _a21 : 200,
			headers: prepareHeaders(init == null ? void 0 : init.headers, { "content-type": "application/json; charset=utf-8" })
		});
	}
};
function cosineSimilarity(vector1, vector2) {
	if (vector1.length !== vector2.length) throw new InvalidArgumentError({
		parameter: "vector1,vector2",
		value: {
			vector1Length: vector1.length,
			vector2Length: vector2.length
		},
		message: `Vectors must have the same length`
	});
	const n = vector1.length;
	if (n === 0) return 0;
	let magnitudeSquared1 = 0;
	let magnitudeSquared2 = 0;
	let dotProduct = 0;
	for (let i = 0; i < n; i++) {
		const value1 = vector1[i];
		const value2 = vector2[i];
		magnitudeSquared1 += value1 * value1;
		magnitudeSquared2 += value2 * value2;
		dotProduct += value1 * value2;
	}
	return magnitudeSquared1 === 0 || magnitudeSquared2 === 0 ? 0 : dotProduct / (Math.sqrt(magnitudeSquared1) * Math.sqrt(magnitudeSquared2));
}
function createDownload(options) {
	return ({ url, abortSignal }) => download({
		url,
		maxBytes: options == null ? void 0 : options.maxBytes,
		abortSignal
	});
}
function getTextFromDataUrl(dataUrl) {
	const [header, base64Content] = dataUrl.split(",");
	if (header.split(";")[0].split(":")[1] == null || base64Content == null) throw new Error("Invalid data URL format");
	try {
		return window.atob(base64Content);
	} catch (error) {
		throw new Error(`Error decoding data URL`);
	}
}
function isDeepEqualData(obj1, obj2) {
	if (obj1 === obj2) return true;
	if (obj1 == null || obj2 == null) return false;
	if (typeof obj1 !== "object" && typeof obj2 !== "object") return obj1 === obj2;
	if (obj1.constructor !== obj2.constructor) return false;
	if (obj1 instanceof Date && obj2 instanceof Date) return obj1.getTime() === obj2.getTime();
	if (Array.isArray(obj1)) {
		if (obj1.length !== obj2.length) return false;
		for (let i = 0; i < obj1.length; i++) if (!isDeepEqualData(obj1[i], obj2[i])) return false;
		return true;
	}
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
	if (keys1.length !== keys2.length) return false;
	for (const key of keys1) {
		if (!keys2.includes(key)) return false;
		if (!isDeepEqualData(obj1[key], obj2[key])) return false;
	}
	return true;
}
var SerialJobExecutor = class {
	constructor() {
		this.queue = [];
		this.isProcessing = false;
	}
	async processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;
		while (this.queue.length > 0) {
			await this.queue[0]();
			this.queue.shift();
		}
		this.isProcessing = false;
	}
	async run(job) {
		return new Promise((resolve3, reject) => {
			this.queue.push(async () => {
				try {
					await job();
					resolve3();
				} catch (error) {
					reject(error);
				}
			});
			this.processQueue();
		});
	}
};
function simulateReadableStream({ chunks, initialDelayInMs = 0, chunkDelayInMs = 0, _internal }) {
	var _a21;
	const delay2 = (_a21 = _internal == null ? void 0 : _internal.delay) != null ? _a21 : delay;
	let index = 0;
	return new ReadableStream({ async pull(controller) {
		if (index < chunks.length) {
			await delay2(index === 0 ? initialDelayInMs : chunkDelayInMs);
			controller.enqueue(chunks[index++]);
		} else controller.close();
	} });
}
var originalGenerateId4 = createIdGenerator({
	prefix: "aiobj",
	size: 24
});
function streamObject(options) {
	const { model, output = "object", system, prompt, messages, allowSystemInMessages, maxRetries, abortSignal, headers, experimental_repairText: repairText, experimental_telemetry: telemetry, experimental_download: download2, providerOptions, onError = ({ error }) => {
		console.error(error);
	}, onFinish, _internal: { generateId: generateId2 = originalGenerateId4, currentDate = () => /* @__PURE__ */ new Date(), now: now2 = now } = {}, ...settings } = options;
	const enumValues = "enum" in options && options.enum ? options.enum : void 0;
	const { schema: inputSchema, schemaDescription, schemaName } = "schema" in options ? options : {};
	validateObjectGenerationInput({
		output,
		schema: inputSchema,
		schemaName,
		schemaDescription,
		enumValues
	});
	return new DefaultStreamObjectResult({
		model,
		telemetry,
		headers,
		settings,
		maxRetries,
		abortSignal,
		outputStrategy: getOutputStrategy({
			output,
			schema: inputSchema,
			enumValues
		}),
		system,
		prompt,
		messages,
		allowSystemInMessages,
		schemaName,
		schemaDescription,
		providerOptions,
		repairText,
		onError,
		onFinish,
		download: download2,
		generateId: generateId2,
		currentDate,
		now: now2
	});
}
var DefaultStreamObjectResult = class {
	constructor({ model: modelArg, headers, telemetry, settings, maxRetries: maxRetriesArg, abortSignal, outputStrategy, system, prompt, messages, allowSystemInMessages, schemaName, schemaDescription, providerOptions, repairText, onError, onFinish, download: download2, generateId: generateId2, currentDate, now: now2 }) {
		this._object = new DelayedPromise();
		this._usage = new DelayedPromise();
		this._providerMetadata = new DelayedPromise();
		this._warnings = new DelayedPromise();
		this._request = new DelayedPromise();
		this._response = new DelayedPromise();
		this._finishReason = new DelayedPromise();
		const model = resolveLanguageModel(modelArg);
		const { maxRetries, retry } = prepareRetries({
			maxRetries: maxRetriesArg,
			abortSignal
		});
		const callSettings = prepareCallSettings(settings);
		const baseTelemetryAttributes = getBaseTelemetryAttributes({
			model,
			telemetry,
			headers,
			settings: {
				...callSettings,
				maxRetries
			}
		});
		const tracer = getTracer(telemetry);
		const self = this;
		const stitchableStream = createStitchableStream();
		const eventProcessor = new TransformStream({ transform(chunk, controller) {
			controller.enqueue(chunk);
			if (chunk.type === "error") onError({ error: wrapGatewayError(chunk.error) });
		} });
		this.baseStream = stitchableStream.stream.pipeThrough(eventProcessor);
		recordSpan({
			name: "ai.streamObject",
			attributes: selectTelemetryAttributes({
				telemetry,
				attributes: {
					...assembleOperationName({
						operationId: "ai.streamObject",
						telemetry
					}),
					...baseTelemetryAttributes,
					"ai.prompt": { input: () => JSON.stringify({
						system,
						prompt,
						messages
					}) },
					"ai.schema": { input: async () => JSON.stringify(await outputStrategy.jsonSchema()) },
					"ai.schema.name": schemaName,
					"ai.schema.description": schemaDescription,
					"ai.settings.output": outputStrategy.type
				}
			}),
			tracer,
			endWhenDone: false,
			fn: async (rootSpan) => {
				const standardizedPrompt = await standardizePrompt({
					system,
					prompt,
					messages,
					allowSystemInMessages
				});
				const callOptions = {
					responseFormat: {
						type: "json",
						schema: await outputStrategy.jsonSchema(),
						name: schemaName,
						description: schemaDescription
					},
					...prepareCallSettings(settings),
					prompt: await convertToLanguageModelPrompt({
						prompt: standardizedPrompt,
						supportedUrls: await model.supportedUrls,
						download: download2
					}),
					providerOptions,
					abortSignal,
					headers,
					includeRawChunks: false
				};
				const transformer = { transform: (chunk, controller) => {
					switch (chunk.type) {
						case "text-delta":
							controller.enqueue(chunk.delta);
							break;
						case "response-metadata":
						case "finish":
						case "error":
						case "stream-start":
							controller.enqueue(chunk);
							break;
					}
				} };
				const { result: { stream, response, request }, doStreamSpan, startTimestampMs } = await retry(() => recordSpan({
					name: "ai.streamObject.doStream",
					attributes: selectTelemetryAttributes({
						telemetry,
						attributes: {
							...assembleOperationName({
								operationId: "ai.streamObject.doStream",
								telemetry
							}),
							...baseTelemetryAttributes,
							"ai.prompt.messages": { input: () => stringifyForTelemetry(callOptions.prompt) },
							"gen_ai.system": model.provider,
							"gen_ai.request.model": model.modelId,
							"gen_ai.request.frequency_penalty": callSettings.frequencyPenalty,
							"gen_ai.request.max_tokens": callSettings.maxOutputTokens,
							"gen_ai.request.presence_penalty": callSettings.presencePenalty,
							"gen_ai.request.temperature": callSettings.temperature,
							"gen_ai.request.top_k": callSettings.topK,
							"gen_ai.request.top_p": callSettings.topP
						}
					}),
					tracer,
					endWhenDone: false,
					fn: async (doStreamSpan2) => ({
						startTimestampMs: now2(),
						doStreamSpan: doStreamSpan2,
						result: await model.doStream(callOptions)
					})
				}));
				self._request.resolve(request != null ? request : {});
				let warnings;
				let usage = createNullLanguageModelUsage();
				let finishReason;
				let providerMetadata;
				let object2;
				let error;
				let accumulatedText = "";
				let textDelta = "";
				let fullResponse = {
					id: generateId2(),
					timestamp: currentDate(),
					modelId: model.modelId
				};
				let latestObjectJson = void 0;
				let latestObject = void 0;
				let isFirstChunk = true;
				let isFirstDelta = true;
				const transformedStream = stream.pipeThrough(new TransformStream(transformer)).pipeThrough(new TransformStream({
					async transform(chunk, controller) {
						var _a21, _b, _c;
						if (typeof chunk === "object" && chunk.type === "stream-start") {
							warnings = chunk.warnings;
							return;
						}
						if (isFirstChunk) {
							const msToFirstChunk = now2() - startTimestampMs;
							isFirstChunk = false;
							doStreamSpan.addEvent("ai.stream.firstChunk", { "ai.stream.msToFirstChunk": msToFirstChunk });
							doStreamSpan.setAttributes({ "ai.stream.msToFirstChunk": msToFirstChunk });
						}
						if (typeof chunk === "string") {
							accumulatedText += chunk;
							textDelta += chunk;
							const { value: currentObjectJson, state: parseState } = await parsePartialJson(accumulatedText);
							if (currentObjectJson !== void 0 && !isDeepEqualData(latestObjectJson, currentObjectJson)) {
								const validationResult = await outputStrategy.validatePartialResult({
									value: currentObjectJson,
									textDelta,
									latestObject,
									isFirstDelta,
									isFinalDelta: parseState === "successful-parse"
								});
								if (validationResult.success && !isDeepEqualData(latestObject, validationResult.value.partial)) {
									latestObjectJson = currentObjectJson;
									latestObject = validationResult.value.partial;
									controller.enqueue({
										type: "object",
										object: latestObject
									});
									controller.enqueue({
										type: "text-delta",
										textDelta: validationResult.value.textDelta
									});
									textDelta = "";
									isFirstDelta = false;
								}
							}
							return;
						}
						switch (chunk.type) {
							case "response-metadata":
								fullResponse = {
									id: (_a21 = chunk.id) != null ? _a21 : fullResponse.id,
									timestamp: (_b = chunk.timestamp) != null ? _b : fullResponse.timestamp,
									modelId: (_c = chunk.modelId) != null ? _c : fullResponse.modelId
								};
								break;
							case "finish":
								if (textDelta !== "") controller.enqueue({
									type: "text-delta",
									textDelta
								});
								finishReason = chunk.finishReason.unified;
								usage = asLanguageModelUsage(chunk.usage);
								providerMetadata = chunk.providerMetadata;
								controller.enqueue({
									...chunk,
									finishReason: chunk.finishReason.unified,
									usage,
									response: fullResponse
								});
								logWarnings({
									warnings: warnings != null ? warnings : [],
									provider: model.provider,
									model: model.modelId
								});
								self._usage.resolve(usage);
								self._providerMetadata.resolve(providerMetadata);
								self._warnings.resolve(warnings);
								self._response.resolve({
									...fullResponse,
									headers: response == null ? void 0 : response.headers
								});
								self._finishReason.resolve(finishReason != null ? finishReason : "other");
								try {
									object2 = await parseAndValidateObjectResultWithRepair(accumulatedText, outputStrategy, repairText, {
										response: fullResponse,
										usage,
										finishReason
									});
									self._object.resolve(object2);
								} catch (e) {
									error = e;
									self._object.reject(e);
								}
								break;
							default:
								controller.enqueue(chunk);
								break;
						}
					},
					async flush(controller) {
						try {
							const finalUsage = usage != null ? usage : {
								promptTokens: NaN,
								completionTokens: NaN,
								totalTokens: NaN
							};
							doStreamSpan.setAttributes(await selectTelemetryAttributes({
								telemetry,
								attributes: {
									"ai.response.finishReason": finishReason,
									"ai.response.object": { output: () => JSON.stringify(object2) },
									"ai.response.id": fullResponse.id,
									"ai.response.model": fullResponse.modelId,
									"ai.response.timestamp": fullResponse.timestamp.toISOString(),
									"ai.response.providerMetadata": JSON.stringify(providerMetadata),
									"ai.usage.inputTokens": finalUsage.inputTokens,
									"ai.usage.outputTokens": finalUsage.outputTokens,
									"ai.usage.totalTokens": finalUsage.totalTokens,
									"ai.usage.reasoningTokens": finalUsage.reasoningTokens,
									"ai.usage.cachedInputTokens": finalUsage.cachedInputTokens,
									"gen_ai.response.finish_reasons": [finishReason],
									"gen_ai.response.id": fullResponse.id,
									"gen_ai.response.model": fullResponse.modelId,
									"gen_ai.usage.input_tokens": finalUsage.inputTokens,
									"gen_ai.usage.output_tokens": finalUsage.outputTokens
								}
							}));
							doStreamSpan.end();
							rootSpan.setAttributes(await selectTelemetryAttributes({
								telemetry,
								attributes: {
									"ai.usage.inputTokens": finalUsage.inputTokens,
									"ai.usage.outputTokens": finalUsage.outputTokens,
									"ai.usage.totalTokens": finalUsage.totalTokens,
									"ai.usage.reasoningTokens": finalUsage.reasoningTokens,
									"ai.usage.cachedInputTokens": finalUsage.cachedInputTokens,
									"ai.response.object": { output: () => JSON.stringify(object2) },
									"ai.response.providerMetadata": JSON.stringify(providerMetadata)
								}
							}));
							await (onFinish == null ? void 0 : onFinish({
								usage: finalUsage,
								object: object2,
								error,
								response: {
									...fullResponse,
									headers: response == null ? void 0 : response.headers
								},
								warnings,
								providerMetadata
							}));
						} catch (error2) {
							controller.enqueue({
								type: "error",
								error: error2
							});
						} finally {
							rootSpan.end();
						}
					}
				}));
				stitchableStream.addStream(transformedStream);
			}
		}).catch((error) => {
			stitchableStream.addStream(new ReadableStream({ start(controller) {
				controller.enqueue({
					type: "error",
					error
				});
				controller.close();
			} }));
		}).finally(() => {
			stitchableStream.close();
		});
		this.outputStrategy = outputStrategy;
	}
	get object() {
		return this._object.promise;
	}
	get usage() {
		return this._usage.promise;
	}
	get providerMetadata() {
		return this._providerMetadata.promise;
	}
	get warnings() {
		return this._warnings.promise;
	}
	get request() {
		return this._request.promise;
	}
	get response() {
		return this._response.promise;
	}
	get finishReason() {
		return this._finishReason.promise;
	}
	get partialObjectStream() {
		return createAsyncIterableStream(this.baseStream.pipeThrough(new TransformStream({ transform(chunk, controller) {
			switch (chunk.type) {
				case "object":
					controller.enqueue(chunk.object);
					break;
				case "text-delta":
				case "finish":
				case "error": break;
				default: throw new Error(`Unsupported chunk type: ${chunk}`);
			}
		} })));
	}
	get elementStream() {
		return this.outputStrategy.createElementStream(this.baseStream);
	}
	get textStream() {
		return createAsyncIterableStream(this.baseStream.pipeThrough(new TransformStream({ transform(chunk, controller) {
			switch (chunk.type) {
				case "text-delta":
					controller.enqueue(chunk.textDelta);
					break;
				case "object":
				case "finish":
				case "error": break;
				default: throw new Error(`Unsupported chunk type: ${chunk}`);
			}
		} })));
	}
	get fullStream() {
		return createAsyncIterableStream(this.baseStream);
	}
	pipeTextStreamToResponse(response, init) {
		pipeTextStreamToResponse({
			response,
			textStream: this.textStream,
			...init
		});
	}
	toTextStreamResponse(init) {
		return createTextStreamResponse({
			textStream: this.textStream,
			...init
		});
	}
};
var DefaultGeneratedAudioFile = class extends DefaultGeneratedFile {
	constructor({ data, mediaType }) {
		super({
			data,
			mediaType
		});
		let format = "mp3";
		if (mediaType) {
			const mediaTypeParts = mediaType.split("/");
			if (mediaTypeParts.length === 2) {
				if (mediaType !== "audio/mpeg") format = mediaTypeParts[1];
			}
		}
		if (!format) throw new Error("Audio format must be provided or determinable from media type");
		this.format = format;
	}
};
async function generateSpeech({ model, text: text2, voice, outputFormat, instructions, speed, language, providerOptions = {}, maxRetries: maxRetriesArg, abortSignal, headers }) {
	var _a21;
	const resolvedModel = resolveSpeechModel(model);
	if (!resolvedModel) throw new Error("Model could not be resolved");
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const { retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const result = await retry(() => resolvedModel.doGenerate({
		text: text2,
		voice,
		outputFormat,
		instructions,
		speed,
		language,
		abortSignal,
		headers: headersWithUserAgent,
		providerOptions
	}));
	if (!result.audio || result.audio.length === 0) throw new NoSpeechGeneratedError({ responses: [result.response] });
	logWarnings({
		warnings: result.warnings,
		provider: resolvedModel.provider,
		model: resolvedModel.modelId
	});
	return new DefaultSpeechResult({
		audio: new DefaultGeneratedAudioFile({
			data: result.audio,
			mediaType: (_a21 = detectMediaType({
				data: result.audio,
				signatures: audioMediaTypeSignatures
			})) != null ? _a21 : "audio/mp3"
		}),
		warnings: result.warnings,
		responses: [result.response],
		providerMetadata: result.providerMetadata
	});
}
var DefaultSpeechResult = class {
	constructor(options) {
		var _a21;
		this.audio = options.audio;
		this.warnings = options.warnings;
		this.responses = options.responses;
		this.providerMetadata = (_a21 = options.providerMetadata) != null ? _a21 : {};
	}
};
function pruneMessages({ messages, reasoning = "none", toolCalls = [], emptyMessages = "remove" }) {
	if (reasoning === "all" || reasoning === "before-last-message") messages = messages.map((message, messageIndex) => {
		if (message.role !== "assistant" || typeof message.content === "string" || reasoning === "before-last-message" && messageIndex === messages.length - 1) return message;
		return {
			...message,
			content: message.content.filter((part) => part.type !== "reasoning")
		};
	});
	if (toolCalls === "none") toolCalls = [];
	else if (toolCalls === "all") toolCalls = [{ type: "all" }];
	else if (toolCalls === "before-last-message") toolCalls = [{ type: "before-last-message" }];
	else if (typeof toolCalls === "string") toolCalls = [{ type: toolCalls }];
	for (const toolCall of toolCalls) {
		const keepLastMessagesCount = toolCall.type === "all" ? void 0 : toolCall.type === "before-last-message" ? 1 : Number(toolCall.type.slice(12).slice(0, -9));
		const keptToolCallIds = /* @__PURE__ */ new Set();
		const keptApprovalIds = /* @__PURE__ */ new Set();
		if (keepLastMessagesCount != null) {
			for (const message of messages.slice(-keepLastMessagesCount)) if ((message.role === "assistant" || message.role === "tool") && typeof message.content !== "string") {
				for (const part of message.content) if (part.type === "tool-call" || part.type === "tool-result") keptToolCallIds.add(part.toolCallId);
				else if (part.type === "tool-approval-request" || part.type === "tool-approval-response") keptApprovalIds.add(part.approvalId);
			}
		}
		messages = messages.map((message, messageIndex) => {
			if (message.role !== "assistant" && message.role !== "tool" || typeof message.content === "string" || keepLastMessagesCount && messageIndex >= messages.length - keepLastMessagesCount) return message;
			const toolCallIdToToolName = {};
			const approvalIdToToolName = {};
			return {
				...message,
				content: message.content.filter((part) => {
					if (part.type !== "tool-call" && part.type !== "tool-result" && part.type !== "tool-approval-request" && part.type !== "tool-approval-response") return true;
					if (part.type === "tool-call") toolCallIdToToolName[part.toolCallId] = part.toolName;
					else if (part.type === "tool-approval-request") approvalIdToToolName[part.approvalId] = toolCallIdToToolName[part.toolCallId];
					if ((part.type === "tool-call" || part.type === "tool-result") && keptToolCallIds.has(part.toolCallId) || (part.type === "tool-approval-request" || part.type === "tool-approval-response") && keptApprovalIds.has(part.approvalId)) return true;
					return toolCall.tools != null && !toolCall.tools.includes(part.type === "tool-call" || part.type === "tool-result" ? part.toolName : approvalIdToToolName[part.approvalId]);
				})
			};
		});
	}
	if (emptyMessages === "remove") messages = messages.filter((message) => message.content.length > 0);
	return messages;
}
var CHUNKING_REGEXPS = {
	word: /\S+\s+/m,
	line: /\n+/m
};
function smoothStream({ delayInMs = 10, chunking = "word", _internal: { delay: delay2 = delay } = {} } = {}) {
	let detectChunk;
	if (chunking != null && typeof chunking === "object" && "segment" in chunking && typeof chunking.segment === "function") {
		const segmenter = chunking;
		detectChunk = (buffer) => {
			if (buffer.length === 0) return null;
			const first = segmenter.segment(buffer)[Symbol.iterator]().next().value;
			return (first == null ? void 0 : first.segment) || null;
		};
	} else if (typeof chunking === "function") detectChunk = (buffer) => {
		const match = chunking(buffer);
		if (match == null) return null;
		if (!match.length) throw new Error(`Chunking function must return a non-empty string.`);
		if (!buffer.startsWith(match)) throw new Error(`Chunking function must return a match that is a prefix of the buffer. Received: "${match}" expected to start with "${buffer}"`);
		return match;
	};
	else {
		const chunkingRegex = typeof chunking === "string" ? CHUNKING_REGEXPS[chunking] : chunking instanceof RegExp ? chunking : void 0;
		if (chunkingRegex == null) throw new InvalidArgumentError$1({
			argument: "chunking",
			message: `Chunking must be "word", "line", a RegExp, an Intl.Segmenter, or a ChunkDetector function. Received: ${chunking}`
		});
		detectChunk = (buffer) => {
			const match = chunkingRegex.exec(buffer);
			if (!match) return null;
			return buffer.slice(0, match.index) + (match == null ? void 0 : match[0]);
		};
	}
	return () => {
		let buffer = "";
		let id = "";
		let type = void 0;
		let providerMetadata = void 0;
		function flushBuffer(controller) {
			if (buffer.length > 0 && type !== void 0) {
				controller.enqueue({
					type,
					text: buffer,
					id,
					...providerMetadata != null ? { providerMetadata } : {}
				});
				buffer = "";
				providerMetadata = void 0;
			}
		}
		return new TransformStream({ async transform(chunk, controller) {
			if (chunk.type !== "text-delta" && chunk.type !== "reasoning-delta") {
				flushBuffer(controller);
				controller.enqueue(chunk);
				return;
			}
			if ((chunk.type !== type || chunk.id !== id) && buffer.length > 0) flushBuffer(controller);
			buffer += chunk.text;
			id = chunk.id;
			type = chunk.type;
			if (chunk.providerMetadata != null) providerMetadata = chunk.providerMetadata;
			let match;
			while ((match = detectChunk(buffer)) != null) {
				controller.enqueue({
					type,
					text: match,
					id
				});
				buffer = buffer.slice(match.length);
				await delay2(delayInMs);
			}
		} });
	};
}
var defaultDownload = createDownload();
async function experimental_generateVideo({ model: modelArg, prompt: promptArg, n = 1, maxVideosPerCall, aspectRatio, resolution, duration, fps, seed, providerOptions, maxRetries: maxRetriesArg, abortSignal, headers, download: downloadFn = defaultDownload }) {
	var _a21;
	const model = resolveVideoModel(modelArg);
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const { retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const { prompt, image } = normalizePrompt2(promptArg);
	const maxVideosPerCallWithDefault = (_a21 = maxVideosPerCall != null ? maxVideosPerCall : await invokeModelMaxVideosPerCall(model)) != null ? _a21 : 1;
	const callCount = Math.ceil(n / maxVideosPerCallWithDefault);
	const callVideoCounts = Array.from({ length: callCount }, (_, index) => {
		const remaining = n - index * maxVideosPerCallWithDefault;
		return Math.min(remaining, maxVideosPerCallWithDefault);
	});
	const results = await Promise.all(callVideoCounts.map(async (callVideoCount) => retry(() => model.doGenerate({
		prompt,
		n: callVideoCount,
		aspectRatio,
		resolution,
		duration,
		fps,
		seed,
		image,
		providerOptions: providerOptions != null ? providerOptions : {},
		headers: headersWithUserAgent,
		abortSignal
	}))));
	const videos = [];
	const warnings = [];
	const responses = [];
	const providerMetadata = {};
	for (const result of results) {
		for (const videoData of result.videos) switch (videoData.type) {
			case "url": {
				const { data, mediaType: downloadedMediaType } = await downloadFn({
					url: new URL(videoData.url),
					abortSignal
				});
				const isUsableMediaType = (type) => !!type && type !== "application/octet-stream";
				const mediaType = isUsableMediaType(videoData.mediaType) && videoData.mediaType || isUsableMediaType(downloadedMediaType) && downloadedMediaType || detectMediaType({
					data,
					signatures: videoMediaTypeSignatures
				}) || "video/mp4";
				videos.push(new DefaultGeneratedFile({
					data,
					mediaType
				}));
				break;
			}
			case "base64":
				videos.push(new DefaultGeneratedFile({
					data: videoData.data,
					mediaType: videoData.mediaType || "video/mp4"
				}));
				break;
			case "binary": {
				const mediaType = videoData.mediaType || detectMediaType({
					data: videoData.data,
					signatures: videoMediaTypeSignatures
				}) || "video/mp4";
				videos.push(new DefaultGeneratedFile({
					data: videoData.data,
					mediaType
				}));
				break;
			}
		}
		warnings.push(...result.warnings);
		responses.push({
			timestamp: result.response.timestamp,
			modelId: result.response.modelId,
			headers: result.response.headers,
			providerMetadata: result.providerMetadata
		});
		if (result.providerMetadata != null) for (const [providerName, metadata] of Object.entries(result.providerMetadata)) {
			const existingMetadata = providerMetadata[providerName];
			if (existingMetadata != null && typeof existingMetadata === "object") {
				providerMetadata[providerName] = {
					...existingMetadata,
					...metadata
				};
				if ("videos" in existingMetadata && Array.isArray(existingMetadata.videos) && "videos" in metadata && Array.isArray(metadata.videos)) providerMetadata[providerName].videos = [...existingMetadata.videos, ...metadata.videos];
			} else providerMetadata[providerName] = metadata;
		}
	}
	if (videos.length === 0) throw new NoVideoGeneratedError({ responses });
	if (warnings.length > 0) logWarnings({
		warnings,
		provider: model.provider,
		model: model.modelId
	});
	return {
		video: videos[0],
		videos,
		warnings,
		responses,
		providerMetadata
	};
}
function normalizePrompt2(promptArg) {
	var _a21, _b;
	if (typeof promptArg === "string") return {
		prompt: promptArg,
		image: void 0
	};
	let image;
	if (promptArg.image != null) {
		const dataContent = promptArg.image;
		if (typeof dataContent === "string") if (dataContent.startsWith("http://") || dataContent.startsWith("https://")) image = {
			type: "url",
			url: dataContent
		};
		else if (dataContent.startsWith("data:")) {
			const { mediaType, base64Content } = splitDataUrl(dataContent);
			image = {
				type: "file",
				mediaType: mediaType != null ? mediaType : "image/png",
				data: convertBase64ToUint8Array(base64Content != null ? base64Content : "")
			};
		} else {
			const bytes = convertBase64ToUint8Array(dataContent);
			image = {
				type: "file",
				mediaType: (_a21 = detectMediaType({
					data: bytes,
					signatures: imageMediaTypeSignatures
				})) != null ? _a21 : "image/png",
				data: bytes
			};
		}
		else if (dataContent instanceof Uint8Array) image = {
			type: "file",
			mediaType: (_b = detectMediaType({
				data: dataContent,
				signatures: imageMediaTypeSignatures
			})) != null ? _b : "image/png",
			data: dataContent
		};
	}
	return {
		prompt: promptArg.text,
		image
	};
}
async function invokeModelMaxVideosPerCall(model) {
	if (typeof model.maxVideosPerCall === "function") return await model.maxVideosPerCall({ modelId: model.modelId });
	return model.maxVideosPerCall;
}
function defaultEmbeddingSettingsMiddleware({ settings }) {
	return {
		specificationVersion: "v3",
		transformParams: async ({ params }) => {
			return mergeObjects(settings, params);
		}
	};
}
function defaultSettingsMiddleware({ settings }) {
	return {
		specificationVersion: "v3",
		transformParams: async ({ params }) => {
			return mergeObjects(settings, params);
		}
	};
}
function defaultTransform(text2) {
	return text2.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
}
function extractJsonMiddleware(options) {
	var _a21;
	const transform = (_a21 = options == null ? void 0 : options.transform) != null ? _a21 : defaultTransform;
	const hasCustomTransform = (options == null ? void 0 : options.transform) !== void 0;
	return {
		specificationVersion: "v3",
		wrapGenerate: async ({ doGenerate }) => {
			const { content, ...rest } = await doGenerate();
			const transformedContent = [];
			for (const part of content) {
				if (part.type !== "text") {
					transformedContent.push(part);
					continue;
				}
				transformedContent.push({
					...part,
					text: transform(part.text)
				});
			}
			return {
				content: transformedContent,
				...rest
			};
		},
		wrapStream: async ({ doStream }) => {
			const { stream, ...rest } = await doStream();
			const textBlocks = {};
			const SUFFIX_BUFFER_SIZE = 12;
			return {
				stream: stream.pipeThrough(new TransformStream({ transform: (chunk, controller) => {
					if (chunk.type === "text-start") {
						textBlocks[chunk.id] = {
							startEvent: chunk,
							phase: hasCustomTransform ? "buffering" : "prefix",
							buffer: "",
							prefixStripped: false
						};
						return;
					}
					if (chunk.type === "text-delta") {
						const block = textBlocks[chunk.id];
						if (!block) {
							controller.enqueue(chunk);
							return;
						}
						block.buffer += chunk.delta;
						if (block.phase === "buffering") return;
						if (block.phase === "prefix") {
							if (block.buffer.length > 0 && !block.buffer.startsWith("`")) {
								block.phase = "streaming";
								controller.enqueue(block.startEvent);
							} else if (block.buffer.startsWith("```")) {
								if (block.buffer.includes("\n")) {
									const prefixMatch = block.buffer.match(/^```(?:json)?\s*\n/);
									if (prefixMatch) {
										block.buffer = block.buffer.slice(prefixMatch[0].length);
										block.prefixStripped = true;
										block.phase = "streaming";
										controller.enqueue(block.startEvent);
									} else {
										block.phase = "streaming";
										controller.enqueue(block.startEvent);
									}
								}
							} else if (block.buffer.length >= 3 && !block.buffer.startsWith("```")) {
								block.phase = "streaming";
								controller.enqueue(block.startEvent);
							}
						}
						if (block.phase === "streaming" && block.buffer.length > SUFFIX_BUFFER_SIZE) {
							const toStream = block.buffer.slice(0, -12);
							block.buffer = block.buffer.slice(-12);
							controller.enqueue({
								type: "text-delta",
								id: chunk.id,
								delta: toStream
							});
						}
						return;
					}
					if (chunk.type === "text-end") {
						const block = textBlocks[chunk.id];
						if (block) {
							if (block.phase === "prefix" || block.phase === "buffering") controller.enqueue(block.startEvent);
							let remaining = block.buffer;
							if (block.phase === "buffering") remaining = transform(remaining);
							else if (block.prefixStripped) remaining = remaining.replace(/\n?```\s*$/, "").trimEnd();
							else remaining = transform(remaining);
							if (remaining.length > 0) controller.enqueue({
								type: "text-delta",
								id: chunk.id,
								delta: remaining
							});
							controller.enqueue(chunk);
							delete textBlocks[chunk.id];
							return;
						}
					}
					controller.enqueue(chunk);
				} })),
				...rest
			};
		}
	};
}
function getPotentialStartIndex(text2, searchedText) {
	if (searchedText.length === 0) return null;
	const directIndex = text2.indexOf(searchedText);
	if (directIndex !== -1) return directIndex;
	for (let i = text2.length - 1; i >= 0; i--) {
		const suffix = text2.substring(i);
		if (searchedText.startsWith(suffix)) return i;
	}
	return null;
}
function extractReasoningMiddleware({ tagName, separator = "\n", startWithReasoning = false }) {
	const openingTag = `<${tagName}>`;
	const closingTag = `</${tagName}>`;
	return {
		specificationVersion: "v3",
		wrapGenerate: async ({ doGenerate }) => {
			const { content, ...rest } = await doGenerate();
			const transformedContent = [];
			for (const part of content) {
				if (part.type !== "text") {
					transformedContent.push(part);
					continue;
				}
				const text2 = startWithReasoning ? openingTag + part.text : part.text;
				const regexp = new RegExp(`${openingTag}(.*?)${closingTag}`, "gs");
				const matches = Array.from(text2.matchAll(regexp));
				if (!matches.length) {
					transformedContent.push(part);
					continue;
				}
				const reasoningText = matches.map((match) => match[1]).join(separator);
				let textWithoutReasoning = text2;
				for (let i = matches.length - 1; i >= 0; i--) {
					const match = matches[i];
					const beforeMatch = textWithoutReasoning.slice(0, match.index);
					const afterMatch = textWithoutReasoning.slice(match.index + match[0].length);
					textWithoutReasoning = beforeMatch + (beforeMatch.length > 0 && afterMatch.length > 0 ? separator : "") + afterMatch;
				}
				transformedContent.push({
					type: "reasoning",
					text: reasoningText
				});
				transformedContent.push({
					type: "text",
					text: textWithoutReasoning
				});
			}
			return {
				content: transformedContent,
				...rest
			};
		},
		wrapStream: async ({ doStream }) => {
			const { stream, ...rest } = await doStream();
			const reasoningExtractions = {};
			let delayedTextStart;
			return {
				stream: stream.pipeThrough(new TransformStream({ transform: (chunk, controller) => {
					if (chunk.type === "text-start") {
						delayedTextStart = chunk;
						return;
					}
					if (chunk.type === "text-end" && delayedTextStart) {
						controller.enqueue(delayedTextStart);
						delayedTextStart = void 0;
					}
					if (chunk.type !== "text-delta") {
						controller.enqueue(chunk);
						return;
					}
					if (reasoningExtractions[chunk.id] == null) reasoningExtractions[chunk.id] = {
						isFirstReasoning: true,
						isFirstText: true,
						afterSwitch: false,
						isReasoning: startWithReasoning,
						buffer: "",
						idCounter: 0,
						textId: chunk.id
					};
					const activeExtraction = reasoningExtractions[chunk.id];
					activeExtraction.buffer += chunk.delta;
					function publish(text2) {
						if (text2.length > 0) {
							const prefix = activeExtraction.afterSwitch && (activeExtraction.isReasoning ? !activeExtraction.isFirstReasoning : !activeExtraction.isFirstText) ? separator : "";
							if (activeExtraction.isReasoning && (activeExtraction.afterSwitch || activeExtraction.isFirstReasoning)) controller.enqueue({
								type: "reasoning-start",
								id: `reasoning-${activeExtraction.idCounter}`
							});
							if (activeExtraction.isReasoning) controller.enqueue({
								type: "reasoning-delta",
								delta: prefix + text2,
								id: `reasoning-${activeExtraction.idCounter}`
							});
							else {
								if (delayedTextStart) {
									controller.enqueue(delayedTextStart);
									delayedTextStart = void 0;
								}
								controller.enqueue({
									type: "text-delta",
									delta: prefix + text2,
									id: activeExtraction.textId
								});
							}
							activeExtraction.afterSwitch = false;
							if (activeExtraction.isReasoning) activeExtraction.isFirstReasoning = false;
							else activeExtraction.isFirstText = false;
						}
					}
					do {
						const nextTag = activeExtraction.isReasoning ? closingTag : openingTag;
						const startIndex = getPotentialStartIndex(activeExtraction.buffer, nextTag);
						if (startIndex == null) {
							publish(activeExtraction.buffer);
							activeExtraction.buffer = "";
							break;
						}
						publish(activeExtraction.buffer.slice(0, startIndex));
						if (startIndex + nextTag.length <= activeExtraction.buffer.length) {
							activeExtraction.buffer = activeExtraction.buffer.slice(startIndex + nextTag.length);
							if (activeExtraction.isReasoning) {
								if (activeExtraction.isFirstReasoning) controller.enqueue({
									type: "reasoning-start",
									id: `reasoning-${activeExtraction.idCounter}`
								});
								controller.enqueue({
									type: "reasoning-end",
									id: `reasoning-${activeExtraction.idCounter++}`
								});
							}
							activeExtraction.isReasoning = !activeExtraction.isReasoning;
							activeExtraction.afterSwitch = true;
						} else {
							activeExtraction.buffer = activeExtraction.buffer.slice(startIndex);
							break;
						}
					} while (true);
				} })),
				...rest
			};
		}
	};
}
function simulateStreamingMiddleware() {
	return {
		specificationVersion: "v3",
		wrapStream: async ({ doGenerate }) => {
			const result = await doGenerate();
			let id = 0;
			return {
				stream: new ReadableStream({ start(controller) {
					controller.enqueue({
						type: "stream-start",
						warnings: result.warnings
					});
					controller.enqueue({
						type: "response-metadata",
						...result.response
					});
					for (const part of result.content) switch (part.type) {
						case "text":
							if (part.text.length > 0) {
								controller.enqueue({
									type: "text-start",
									id: String(id)
								});
								controller.enqueue({
									type: "text-delta",
									id: String(id),
									delta: part.text
								});
								controller.enqueue({
									type: "text-end",
									id: String(id)
								});
								id++;
							}
							break;
						case "reasoning":
							controller.enqueue({
								type: "reasoning-start",
								id: String(id),
								providerMetadata: part.providerMetadata
							});
							controller.enqueue({
								type: "reasoning-delta",
								id: String(id),
								delta: part.text
							});
							controller.enqueue({
								type: "reasoning-end",
								id: String(id)
							});
							id++;
							break;
						default:
							controller.enqueue(part);
							break;
					}
					controller.enqueue({
						type: "finish",
						finishReason: result.finishReason,
						usage: result.usage,
						providerMetadata: result.providerMetadata
					});
					controller.close();
				} }),
				request: result.request,
				response: result.response
			};
		}
	};
}
function defaultFormatExample(example) {
	return JSON.stringify(example.input);
}
function addToolInputExamplesMiddleware({ prefix = "Input Examples:", format = defaultFormatExample, remove = true } = {}) {
	return {
		specificationVersion: "v3",
		transformParams: async ({ params }) => {
			var _a21;
			if (!((_a21 = params.tools) == null ? void 0 : _a21.length)) return params;
			const transformedTools = params.tools.map((tool2) => {
				var _a22;
				if (tool2.type !== "function" || !((_a22 = tool2.inputExamples) == null ? void 0 : _a22.length)) return tool2;
				const examplesSection = `${prefix}
${tool2.inputExamples.map((example, index) => format(example, index)).join("\n")}`;
				const toolDescription = tool2.description ? `${tool2.description}

${examplesSection}` : examplesSection;
				return {
					...tool2,
					description: toolDescription,
					inputExamples: remove ? void 0 : tool2.inputExamples
				};
			});
			return {
				...params,
				tools: transformedTools
			};
		}
	};
}
var wrapLanguageModel = ({ model, middleware: middlewareArg, modelId, providerId }) => {
	return [...asArray(middlewareArg)].reverse().reduce((wrappedModel, middleware) => {
		return doWrap({
			model: wrappedModel,
			middleware,
			modelId,
			providerId
		});
	}, model);
};
var doWrap = ({ model, middleware: { transformParams, wrapGenerate, wrapStream, overrideProvider, overrideModelId, overrideSupportedUrls }, modelId, providerId }) => {
	var _a21, _b, _c;
	async function doTransform({ params, type }) {
		return transformParams ? await transformParams({
			params,
			type,
			model
		}) : params;
	}
	return {
		specificationVersion: "v3",
		provider: (_a21 = providerId != null ? providerId : overrideProvider == null ? void 0 : overrideProvider({ model })) != null ? _a21 : model.provider,
		modelId: (_b = modelId != null ? modelId : overrideModelId == null ? void 0 : overrideModelId({ model })) != null ? _b : model.modelId,
		supportedUrls: (_c = overrideSupportedUrls == null ? void 0 : overrideSupportedUrls({ model })) != null ? _c : model.supportedUrls,
		async doGenerate(params) {
			const transformedParams = await doTransform({
				params,
				type: "generate"
			});
			const doGenerate = async () => model.doGenerate(transformedParams);
			const doStream = async () => model.doStream(transformedParams);
			return wrapGenerate ? wrapGenerate({
				doGenerate,
				doStream,
				params: transformedParams,
				model
			}) : doGenerate();
		},
		async doStream(params) {
			const transformedParams = await doTransform({
				params,
				type: "stream"
			});
			const doGenerate = async () => model.doGenerate(transformedParams);
			const doStream = async () => model.doStream(transformedParams);
			return wrapStream ? wrapStream({
				doGenerate,
				doStream,
				params: transformedParams,
				model
			}) : doStream();
		}
	};
};
var wrapEmbeddingModel = ({ model, middleware: middlewareArg, modelId, providerId }) => {
	return [...asArray(middlewareArg)].reverse().reduce((wrappedModel, middleware) => {
		return doWrap2({
			model: wrappedModel,
			middleware,
			modelId,
			providerId
		});
	}, model);
};
var doWrap2 = ({ model, middleware: { transformParams, wrapEmbed, overrideProvider, overrideModelId, overrideMaxEmbeddingsPerCall, overrideSupportsParallelCalls }, modelId, providerId }) => {
	var _a21, _b, _c, _d;
	async function doTransform({ params }) {
		return transformParams ? await transformParams({
			params,
			model
		}) : params;
	}
	return {
		specificationVersion: "v3",
		provider: (_a21 = providerId != null ? providerId : overrideProvider == null ? void 0 : overrideProvider({ model })) != null ? _a21 : model.provider,
		modelId: (_b = modelId != null ? modelId : overrideModelId == null ? void 0 : overrideModelId({ model })) != null ? _b : model.modelId,
		maxEmbeddingsPerCall: (_c = overrideMaxEmbeddingsPerCall == null ? void 0 : overrideMaxEmbeddingsPerCall({ model })) != null ? _c : model.maxEmbeddingsPerCall,
		supportsParallelCalls: (_d = overrideSupportsParallelCalls == null ? void 0 : overrideSupportsParallelCalls({ model })) != null ? _d : model.supportsParallelCalls,
		async doEmbed(params) {
			const transformedParams = await doTransform({ params });
			const doEmbed = async () => model.doEmbed(transformedParams);
			return wrapEmbed ? wrapEmbed({
				doEmbed,
				params: transformedParams,
				model
			}) : doEmbed();
		}
	};
};
var wrapImageModel = ({ model, middleware: middlewareArg, modelId, providerId }) => {
	return [...asArray(middlewareArg)].reverse().reduce((wrappedModel, middleware) => {
		return doWrap3({
			model: wrappedModel,
			middleware,
			modelId,
			providerId
		});
	}, model);
};
var doWrap3 = ({ model, middleware: { transformParams, wrapGenerate, overrideProvider, overrideModelId, overrideMaxImagesPerCall }, modelId, providerId }) => {
	var _a21, _b, _c;
	async function doTransform({ params }) {
		return transformParams ? await transformParams({
			params,
			model
		}) : params;
	}
	const maxImagesPerCallRaw = (_a21 = overrideMaxImagesPerCall == null ? void 0 : overrideMaxImagesPerCall({ model })) != null ? _a21 : model.maxImagesPerCall;
	const maxImagesPerCall = maxImagesPerCallRaw instanceof Function ? maxImagesPerCallRaw.bind(model) : maxImagesPerCallRaw;
	return {
		specificationVersion: "v3",
		provider: (_b = providerId != null ? providerId : overrideProvider == null ? void 0 : overrideProvider({ model })) != null ? _b : model.provider,
		modelId: (_c = modelId != null ? modelId : overrideModelId == null ? void 0 : overrideModelId({ model })) != null ? _c : model.modelId,
		maxImagesPerCall,
		async doGenerate(params) {
			const transformedParams = await doTransform({ params });
			const doGenerate = async () => model.doGenerate(transformedParams);
			return wrapGenerate ? wrapGenerate({
				doGenerate,
				params: transformedParams,
				model
			}) : doGenerate();
		}
	};
};
function asProviderV3(provider) {
	if ("specificationVersion" in provider && provider.specificationVersion === "v3") return provider;
	const v2Provider = provider;
	return {
		specificationVersion: "v3",
		languageModel: (modelId) => asLanguageModelV3(v2Provider.languageModel(modelId)),
		embeddingModel: (modelId) => asEmbeddingModelV3(v2Provider.textEmbeddingModel(modelId)),
		imageModel: (modelId) => asImageModelV3(v2Provider.imageModel(modelId)),
		transcriptionModel: v2Provider.transcriptionModel ? (modelId) => asTranscriptionModelV3(v2Provider.transcriptionModel(modelId)) : void 0,
		speechModel: v2Provider.speechModel ? (modelId) => asSpeechModelV3(v2Provider.speechModel(modelId)) : void 0,
		rerankingModel: void 0
	};
}
function wrapProvider({ provider, languageModelMiddleware, imageModelMiddleware }) {
	const providerV3 = asProviderV3(provider);
	return {
		specificationVersion: "v3",
		languageModel: (modelId) => wrapLanguageModel({
			model: providerV3.languageModel(modelId),
			middleware: languageModelMiddleware
		}),
		embeddingModel: providerV3.embeddingModel,
		imageModel: (modelId) => {
			let model = providerV3.imageModel(modelId);
			if (imageModelMiddleware != null) model = wrapImageModel({
				model,
				middleware: imageModelMiddleware
			});
			return model;
		},
		transcriptionModel: providerV3.transcriptionModel,
		speechModel: providerV3.speechModel,
		rerankingModel: providerV3.rerankingModel
	};
}
function customProvider({ languageModels, embeddingModels, imageModels, transcriptionModels, speechModels, rerankingModels, videoModels, fallbackProvider: fallbackProviderArg }) {
	const fallbackProvider = fallbackProviderArg ? asProviderV3(fallbackProviderArg) : void 0;
	return {
		specificationVersion: "v3",
		languageModel(modelId) {
			if (languageModels != null && modelId in languageModels) return languageModels[modelId];
			if (fallbackProvider) return fallbackProvider.languageModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "languageModel"
			});
		},
		embeddingModel(modelId) {
			if (embeddingModels != null && modelId in embeddingModels) return embeddingModels[modelId];
			if (fallbackProvider) return fallbackProvider.embeddingModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "embeddingModel"
			});
		},
		imageModel(modelId) {
			if (imageModels != null && modelId in imageModels) return imageModels[modelId];
			if (fallbackProvider == null ? void 0 : fallbackProvider.imageModel) return fallbackProvider.imageModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "imageModel"
			});
		},
		transcriptionModel(modelId) {
			if (transcriptionModels != null && modelId in transcriptionModels) return transcriptionModels[modelId];
			if (fallbackProvider == null ? void 0 : fallbackProvider.transcriptionModel) return fallbackProvider.transcriptionModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "transcriptionModel"
			});
		},
		speechModel(modelId) {
			if (speechModels != null && modelId in speechModels) return speechModels[modelId];
			if (fallbackProvider == null ? void 0 : fallbackProvider.speechModel) return fallbackProvider.speechModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "speechModel"
			});
		},
		rerankingModel(modelId) {
			if (rerankingModels != null && modelId in rerankingModels) return rerankingModels[modelId];
			if (fallbackProvider == null ? void 0 : fallbackProvider.rerankingModel) return fallbackProvider.rerankingModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "rerankingModel"
			});
		},
		videoModel(modelId) {
			if (videoModels != null && modelId in videoModels) return videoModels[modelId];
			const videoModel = fallbackProvider == null ? void 0 : fallbackProvider.videoModel;
			if (videoModel) return videoModel(modelId);
			throw new NoSuchModelError({
				modelId,
				modelType: "videoModel"
			});
		}
	};
}
var experimental_customProvider = customProvider;
var name20 = "AI_NoSuchProviderError";
var marker20 = `vercel.ai.error.${name20}`;
var symbol20 = Symbol.for(marker20);
var _a20;
var NoSuchProviderError = class extends NoSuchModelError {
	constructor({ modelId, modelType, providerId, availableProviders, message = `No such provider: ${providerId} (available providers: ${availableProviders.join()})` }) {
		super({
			errorName: name20,
			modelId,
			modelType,
			message
		});
		this[_a20] = true;
		this.providerId = providerId;
		this.availableProviders = availableProviders;
	}
	static isInstance(error) {
		return AISDKError.hasMarker(error, marker20);
	}
};
_a20 = symbol20;
function createProviderRegistry(providers, { separator = ":", languageModelMiddleware, imageModelMiddleware } = {}) {
	const registry = new DefaultProviderRegistry({
		separator,
		languageModelMiddleware,
		imageModelMiddleware
	});
	for (const [id, provider] of Object.entries(providers)) registry.registerProvider({
		id,
		provider
	});
	return registry;
}
var experimental_createProviderRegistry = createProviderRegistry;
var DefaultProviderRegistry = class {
	constructor({ separator, languageModelMiddleware, imageModelMiddleware }) {
		this.providers = {};
		this.separator = separator;
		this.languageModelMiddleware = languageModelMiddleware;
		this.imageModelMiddleware = imageModelMiddleware;
	}
	registerProvider({ id, provider }) {
		this.providers[id] = provider;
	}
	getProvider(id, modelType) {
		const provider = this.providers[id];
		if (provider == null) throw new NoSuchProviderError({
			modelId: id,
			modelType,
			providerId: id,
			availableProviders: Object.keys(this.providers)
		});
		return provider;
	}
	splitId(id, modelType) {
		const index = id.indexOf(this.separator);
		if (index === -1) throw new NoSuchModelError({
			modelId: id,
			modelType,
			message: `Invalid ${modelType} id for registry: ${id} (must be in the format "providerId${this.separator}modelId")`
		});
		return [id.slice(0, index), id.slice(index + this.separator.length)];
	}
	languageModel(id) {
		var _a21, _b;
		const [providerId, modelId] = this.splitId(id, "languageModel");
		let model = (_b = (_a21 = this.getProvider(providerId, "languageModel")).languageModel) == null ? void 0 : _b.call(_a21, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "languageModel"
		});
		if (this.languageModelMiddleware != null) model = wrapLanguageModel({
			model,
			middleware: this.languageModelMiddleware
		});
		return model;
	}
	embeddingModel(id) {
		var _a21;
		const [providerId, modelId] = this.splitId(id, "embeddingModel");
		const provider = this.getProvider(providerId, "embeddingModel");
		const model = (_a21 = provider.embeddingModel) == null ? void 0 : _a21.call(provider, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "embeddingModel"
		});
		return model;
	}
	imageModel(id) {
		var _a21;
		const [providerId, modelId] = this.splitId(id, "imageModel");
		const provider = this.getProvider(providerId, "imageModel");
		let model = (_a21 = provider.imageModel) == null ? void 0 : _a21.call(provider, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "imageModel"
		});
		if (this.imageModelMiddleware != null) model = wrapImageModel({
			model,
			middleware: this.imageModelMiddleware
		});
		return model;
	}
	transcriptionModel(id) {
		var _a21;
		const [providerId, modelId] = this.splitId(id, "transcriptionModel");
		const provider = this.getProvider(providerId, "transcriptionModel");
		const model = (_a21 = provider.transcriptionModel) == null ? void 0 : _a21.call(provider, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "transcriptionModel"
		});
		return model;
	}
	speechModel(id) {
		var _a21;
		const [providerId, modelId] = this.splitId(id, "speechModel");
		const provider = this.getProvider(providerId, "speechModel");
		const model = (_a21 = provider.speechModel) == null ? void 0 : _a21.call(provider, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "speechModel"
		});
		return model;
	}
	rerankingModel(id) {
		var _a21;
		const [providerId, modelId] = this.splitId(id, "rerankingModel");
		const provider = this.getProvider(providerId, "rerankingModel");
		const model = (_a21 = provider.rerankingModel) == null ? void 0 : _a21.call(provider, modelId);
		if (model == null) throw new NoSuchModelError({
			modelId: id,
			modelType: "rerankingModel"
		});
		return model;
	}
};
async function rerank({ model: modelArg, documents, query, topN, maxRetries: maxRetriesArg, abortSignal, headers, providerOptions, experimental_telemetry: telemetry }) {
	const model = resolveRerankingModel(modelArg);
	if (documents.length === 0) return new DefaultRerankResult({
		originalDocuments: [],
		ranking: [],
		providerMetadata: void 0,
		response: {
			timestamp: /* @__PURE__ */ new Date(),
			modelId: model.modelId
		}
	});
	const { maxRetries, retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const documentsToSend = typeof documents[0] === "string" ? {
		type: "text",
		values: documents
	} : {
		type: "object",
		values: documents
	};
	const baseTelemetryAttributes = getBaseTelemetryAttributes({
		model,
		telemetry,
		headers,
		settings: { maxRetries }
	});
	const tracer = getTracer(telemetry);
	return recordSpan({
		name: "ai.rerank",
		attributes: selectTelemetryAttributes({
			telemetry,
			attributes: {
				...assembleOperationName({
					operationId: "ai.rerank",
					telemetry
				}),
				...baseTelemetryAttributes,
				"ai.documents": { input: () => documents.map((document) => JSON.stringify(document)) }
			}
		}),
		tracer,
		fn: async () => {
			var _a21, _b;
			const { ranking, response, providerMetadata, warnings } = await retry(() => recordSpan({
				name: "ai.rerank.doRerank",
				attributes: selectTelemetryAttributes({
					telemetry,
					attributes: {
						...assembleOperationName({
							operationId: "ai.rerank.doRerank",
							telemetry
						}),
						...baseTelemetryAttributes,
						"ai.documents": { input: () => documents.map((document) => JSON.stringify(document)) }
					}
				}),
				tracer,
				fn: async (doRerankSpan) => {
					const modelResponse = await model.doRerank({
						documents: documentsToSend,
						query,
						topN,
						providerOptions,
						abortSignal,
						headers
					});
					const ranking2 = modelResponse.ranking;
					doRerankSpan.setAttributes(await selectTelemetryAttributes({
						telemetry,
						attributes: {
							"ai.ranking.type": documentsToSend.type,
							"ai.ranking": { output: () => ranking2.map((ranking3) => JSON.stringify(ranking3)) }
						}
					}));
					return {
						ranking: ranking2,
						providerMetadata: modelResponse.providerMetadata,
						response: modelResponse.response,
						warnings: modelResponse.warnings
					};
				}
			}));
			logWarnings({
				warnings: warnings != null ? warnings : [],
				provider: model.provider,
				model: model.modelId
			});
			return new DefaultRerankResult({
				originalDocuments: documents,
				ranking: ranking.map((ranking2) => ({
					originalIndex: ranking2.index,
					score: ranking2.relevanceScore,
					document: documents[ranking2.index]
				})),
				providerMetadata,
				response: {
					id: response == null ? void 0 : response.id,
					timestamp: (_a21 = response == null ? void 0 : response.timestamp) != null ? _a21 : /* @__PURE__ */ new Date(),
					modelId: (_b = response == null ? void 0 : response.modelId) != null ? _b : model.modelId,
					headers: response == null ? void 0 : response.headers,
					body: response == null ? void 0 : response.body
				}
			});
		}
	});
}
var DefaultRerankResult = class {
	constructor(options) {
		this.originalDocuments = options.originalDocuments;
		this.ranking = options.ranking;
		this.response = options.response;
		this.providerMetadata = options.providerMetadata;
	}
	get rerankedDocuments() {
		return this.ranking.map((ranking) => ranking.document);
	}
};
var defaultDownload2 = createDownload();
async function transcribe({ model, audio, providerOptions = {}, maxRetries: maxRetriesArg, abortSignal, headers, download: downloadFn = defaultDownload2 }) {
	const resolvedModel = resolveTranscriptionModel(model);
	if (!resolvedModel) throw new Error("Model could not be resolved");
	const { retry } = prepareRetries({
		maxRetries: maxRetriesArg,
		abortSignal
	});
	const headersWithUserAgent = withUserAgentSuffix(headers != null ? headers : {}, `ai/${VERSION}`);
	const audioData = audio instanceof URL ? (await downloadFn({
		url: audio,
		abortSignal
	})).data : convertDataContentToUint8Array(audio);
	const result = await retry(() => {
		var _a21;
		return resolvedModel.doGenerate({
			audio: audioData,
			abortSignal,
			headers: headersWithUserAgent,
			providerOptions,
			mediaType: (_a21 = detectMediaType({
				data: audioData,
				signatures: audioMediaTypeSignatures
			})) != null ? _a21 : "audio/wav"
		});
	});
	logWarnings({
		warnings: result.warnings,
		provider: resolvedModel.provider,
		model: resolvedModel.modelId
	});
	if (!result.text) throw new NoTranscriptGeneratedError({ responses: [result.response] });
	return new DefaultTranscriptionResult({
		text: result.text,
		segments: result.segments,
		language: result.language,
		durationInSeconds: result.durationInSeconds,
		warnings: result.warnings,
		responses: [result.response],
		providerMetadata: result.providerMetadata
	});
}
var DefaultTranscriptionResult = class {
	constructor(options) {
		var _a21;
		this.text = options.text;
		this.segments = options.segments;
		this.language = options.language;
		this.durationInSeconds = options.durationInSeconds;
		this.warnings = options.warnings;
		this.responses = options.responses;
		this.providerMetadata = (_a21 = options.providerMetadata) != null ? _a21 : {};
	}
};
async function processTextStream({ stream, onTextPart }) {
	const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		await onTextPart(value);
	}
}
var getOriginalFetch = () => fetch;
async function callCompletionApi({ api, prompt, credentials, headers, body, streamProtocol = "data", setCompletion, setLoading, setError, setAbortController, onFinish, onError, fetch: fetch2 = getOriginalFetch() }) {
	var _a21;
	try {
		setLoading(true);
		setError(void 0);
		const abortController = new AbortController();
		setAbortController(abortController);
		setCompletion("");
		const response = await fetch2(api, {
			method: "POST",
			body: JSON.stringify({
				prompt,
				...body
			}),
			credentials,
			headers: withUserAgentSuffix({
				"Content-Type": "application/json",
				...headers
			}, `ai-sdk/${VERSION}`, getRuntimeEnvironmentUserAgent()),
			signal: abortController.signal
		}).catch((err) => {
			throw err;
		});
		if (!response.ok) throw new Error((_a21 = await response.text()) != null ? _a21 : "Failed to fetch the chat response.");
		if (!response.body) throw new Error("The response body is empty.");
		let result = "";
		switch (streamProtocol) {
			case "text":
				await processTextStream({
					stream: response.body,
					onTextPart: (chunk) => {
						result += chunk;
						setCompletion(result);
					}
				});
				break;
			case "data":
				await consumeStream({
					stream: parseJsonEventStream({
						stream: response.body,
						schema: uiMessageChunkSchema
					}).pipeThrough(new TransformStream({ async transform(part) {
						if (!part.success) throw part.error;
						const streamPart = part.value;
						if (streamPart.type === "text-delta") {
							result += streamPart.delta;
							setCompletion(result);
						} else if (streamPart.type === "error") throw new Error(streamPart.errorText);
					} })),
					onError: (error) => {
						throw error;
					}
				});
				break;
			default: throw new Error(`Unknown stream protocol: ${streamProtocol}`);
		}
		if (onFinish) onFinish(prompt, result);
		setAbortController(null);
		return result;
	} catch (err) {
		if (err.name === "AbortError") {
			setAbortController(null);
			return null;
		}
		if (err instanceof Error) {
			if (onError) onError(err);
		}
		setError(err);
	} finally {
		setLoading(false);
	}
}
async function convertFileListToFileUIParts(files) {
	if (files == null) return [];
	if (!globalThis.FileList || !(files instanceof globalThis.FileList)) throw new Error("FileList is not supported in the current environment");
	return Promise.all(Array.from(files).map(async (file) => {
		const { name: name21, type } = file;
		return {
			type: "file",
			mediaType: type,
			filename: name21,
			url: await new Promise((resolve3, reject) => {
				const reader = new FileReader();
				reader.onload = (readerEvent) => {
					var _a21;
					resolve3((_a21 = readerEvent.target) == null ? void 0 : _a21.result);
				};
				reader.onerror = (error) => reject(error);
				reader.readAsDataURL(file);
			})
		};
	}));
}
var HttpChatTransport = class {
	constructor({ api = "/api/chat", credentials, headers, body, fetch: fetch2, prepareSendMessagesRequest, prepareReconnectToStreamRequest }) {
		this.api = api;
		this.credentials = credentials;
		this.headers = headers;
		this.body = body;
		this.fetch = fetch2;
		this.prepareSendMessagesRequest = prepareSendMessagesRequest;
		this.prepareReconnectToStreamRequest = prepareReconnectToStreamRequest;
	}
	async sendMessages({ abortSignal, ...options }) {
		var _a21, _b, _c, _d, _e;
		const resolvedBody = await resolve(this.body);
		const resolvedHeaders = await resolve(this.headers);
		const resolvedCredentials = await resolve(this.credentials);
		const baseHeaders = {
			...normalizeHeaders(resolvedHeaders),
			...normalizeHeaders(options.headers)
		};
		const preparedRequest = await ((_a21 = this.prepareSendMessagesRequest) == null ? void 0 : _a21.call(this, {
			api: this.api,
			id: options.chatId,
			messages: options.messages,
			body: {
				...resolvedBody,
				...options.body
			},
			headers: baseHeaders,
			credentials: resolvedCredentials,
			requestMetadata: options.metadata,
			trigger: options.trigger,
			messageId: options.messageId
		}));
		const api = (_b = preparedRequest == null ? void 0 : preparedRequest.api) != null ? _b : this.api;
		const headers = (preparedRequest == null ? void 0 : preparedRequest.headers) !== void 0 ? normalizeHeaders(preparedRequest.headers) : baseHeaders;
		const body = (preparedRequest == null ? void 0 : preparedRequest.body) !== void 0 ? preparedRequest.body : {
			...resolvedBody,
			...options.body,
			id: options.chatId,
			messages: options.messages,
			trigger: options.trigger,
			messageId: options.messageId
		};
		const credentials = (_c = preparedRequest == null ? void 0 : preparedRequest.credentials) != null ? _c : resolvedCredentials;
		const response = await ((_d = this.fetch) != null ? _d : globalThis.fetch)(api, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers
			},
			body: JSON.stringify(body),
			credentials,
			signal: abortSignal
		});
		if (!response.ok) throw new Error((_e = await response.text()) != null ? _e : "Failed to fetch the chat response.");
		if (!response.body) throw new Error("The response body is empty.");
		return this.processResponseStream(response.body);
	}
	async reconnectToStream(options) {
		var _a21, _b, _c, _d, _e;
		const resolvedBody = await resolve(this.body);
		const resolvedHeaders = await resolve(this.headers);
		const resolvedCredentials = await resolve(this.credentials);
		const baseHeaders = {
			...normalizeHeaders(resolvedHeaders),
			...normalizeHeaders(options.headers)
		};
		const preparedRequest = await ((_a21 = this.prepareReconnectToStreamRequest) == null ? void 0 : _a21.call(this, {
			api: this.api,
			id: options.chatId,
			body: {
				...resolvedBody,
				...options.body
			},
			headers: baseHeaders,
			credentials: resolvedCredentials,
			requestMetadata: options.metadata
		}));
		const api = (_b = preparedRequest == null ? void 0 : preparedRequest.api) != null ? _b : `${this.api}/${options.chatId}/stream`;
		const headers = (preparedRequest == null ? void 0 : preparedRequest.headers) !== void 0 ? normalizeHeaders(preparedRequest.headers) : baseHeaders;
		const credentials = (_c = preparedRequest == null ? void 0 : preparedRequest.credentials) != null ? _c : resolvedCredentials;
		const response = await ((_d = this.fetch) != null ? _d : globalThis.fetch)(api, {
			method: "GET",
			headers,
			credentials
		});
		if (response.status === 204) return null;
		if (!response.ok) throw new Error((_e = await response.text()) != null ? _e : "Failed to fetch the chat response.");
		if (!response.body) throw new Error("The response body is empty.");
		return this.processResponseStream(response.body);
	}
};
var DefaultChatTransport = class extends HttpChatTransport {
	constructor(options = {}) {
		super(options);
	}
	processResponseStream(stream) {
		return parseJsonEventStream({
			stream,
			schema: uiMessageChunkSchema
		}).pipeThrough(new TransformStream({ async transform(chunk, controller) {
			if (!chunk.success) throw chunk.error;
			controller.enqueue(chunk.value);
		} }));
	}
};
var AbstractChat = class {
	constructor({ generateId: generateId2 = generateId, id = generateId2(), transport = new DefaultChatTransport(), messageMetadataSchema, dataPartSchemas, state, onError, onToolCall, onFinish, onData, sendAutomaticallyWhen }) {
		this.activeResponse = void 0;
		this.jobExecutor = new SerialJobExecutor();
		/**
		* Appends or replaces a user message to the chat list. This triggers the API call to fetch
		* the assistant's response.
		*
		* If a messageId is provided, the message will be replaced.
		*/
		this.sendMessage = async (message, options) => {
			var _a21, _b, _c, _d;
			if (message == null) {
				await this.makeRequest({
					trigger: "submit-message",
					messageId: (_a21 = this.lastMessage) == null ? void 0 : _a21.id,
					...options
				});
				return;
			}
			let uiMessage;
			if ("text" in message || "files" in message) uiMessage = { parts: [...Array.isArray(message.files) ? message.files : await convertFileListToFileUIParts(message.files), ..."text" in message && message.text != null ? [{
				type: "text",
				text: message.text
			}] : []] };
			else uiMessage = message;
			if (message.messageId != null) {
				const messageIndex = this.state.messages.findIndex((m) => m.id === message.messageId);
				if (messageIndex === -1) throw new Error(`message with id ${message.messageId} not found`);
				if (this.state.messages[messageIndex].role !== "user") throw new Error(`message with id ${message.messageId} is not a user message`);
				this.state.messages = this.state.messages.slice(0, messageIndex + 1);
				this.state.replaceMessage(messageIndex, {
					...uiMessage,
					id: message.messageId,
					role: (_b = uiMessage.role) != null ? _b : "user",
					metadata: message.metadata
				});
			} else this.state.pushMessage({
				...uiMessage,
				id: (_c = uiMessage.id) != null ? _c : this.generateId(),
				role: (_d = uiMessage.role) != null ? _d : "user",
				metadata: message.metadata
			});
			await this.makeRequest({
				trigger: "submit-message",
				messageId: message.messageId,
				...options
			});
		};
		/**
		* Regenerate the assistant message with the provided message id.
		* If no message id is provided, the last assistant message will be regenerated.
		*/
		this.regenerate = async ({ messageId, ...options } = {}) => {
			const messageIndex = messageId == null ? this.state.messages.length - 1 : this.state.messages.findIndex((message) => message.id === messageId);
			if (messageIndex === -1) throw new Error(`message ${messageId} not found`);
			this.state.messages = this.state.messages.slice(0, this.messages[messageIndex].role === "assistant" ? messageIndex : messageIndex + 1);
			await this.makeRequest({
				trigger: "regenerate-message",
				messageId,
				...options
			});
		};
		/**
		* Attempt to resume an ongoing streaming response.
		*/
		this.resumeStream = async (options = {}) => {
			await this.makeRequest({
				trigger: "resume-stream",
				...options
			});
		};
		/**
		* Clear the error state and set the status to ready if the chat is in an error state.
		*/
		this.clearError = () => {
			if (this.status === "error") {
				this.state.error = void 0;
				this.setStatus({ status: "ready" });
			}
		};
		this.addToolApprovalResponse = async ({ id, approved, reason, options }) => this.jobExecutor.run(async () => {
			const messages = this.state.messages;
			const lastMessage = messages[messages.length - 1];
			const updatePart = (part) => isToolUIPart(part) && part.state === "approval-requested" && part.approval.id === id ? {
				...part,
				state: "approval-responded",
				approval: {
					id,
					approved,
					reason
				}
			} : part;
			this.state.replaceMessage(messages.length - 1, {
				...lastMessage,
				parts: lastMessage.parts.map(updatePart)
			});
			if (this.activeResponse) this.activeResponse.state.message.parts = this.activeResponse.state.message.parts.map(updatePart);
			if (this.status !== "streaming" && this.status !== "submitted" && this.sendAutomaticallyWhen) this.shouldSendAutomatically().then((shouldSend) => {
				var _a21;
				if (shouldSend) this.makeRequest({
					trigger: "submit-message",
					messageId: (_a21 = this.lastMessage) == null ? void 0 : _a21.id,
					...options
				});
			});
		});
		this.addToolOutput = async ({ state = "output-available", toolCallId, output, errorText, options }) => this.jobExecutor.run(async () => {
			const messages = this.state.messages;
			const lastMessage = messages[messages.length - 1];
			const updatePart = (part) => isToolUIPart(part) && part.toolCallId === toolCallId ? {
				...part,
				state,
				output,
				errorText
			} : part;
			this.state.replaceMessage(messages.length - 1, {
				...lastMessage,
				parts: lastMessage.parts.map(updatePart)
			});
			if (this.activeResponse) this.activeResponse.state.message.parts = this.activeResponse.state.message.parts.map(updatePart);
			if (this.status !== "streaming" && this.status !== "submitted" && this.sendAutomaticallyWhen) this.shouldSendAutomatically().then((shouldSend) => {
				var _a21;
				if (shouldSend) this.makeRequest({
					trigger: "submit-message",
					messageId: (_a21 = this.lastMessage) == null ? void 0 : _a21.id,
					...options
				});
			});
		});
		/** @deprecated Use addToolOutput */
		this.addToolResult = this.addToolOutput;
		/**
		* Abort the current request immediately, keep the generated tokens if any.
		*/
		this.stop = async () => {
			var _a21;
			if (this.status !== "streaming" && this.status !== "submitted") return;
			if ((_a21 = this.activeResponse) == null ? void 0 : _a21.abortController) this.activeResponse.abortController.abort();
		};
		this.id = id;
		this.transport = transport;
		this.generateId = generateId2;
		this.messageMetadataSchema = messageMetadataSchema;
		this.dataPartSchemas = dataPartSchemas;
		this.state = state;
		this.onError = onError;
		this.onToolCall = onToolCall;
		this.onFinish = onFinish;
		this.onData = onData;
		this.sendAutomaticallyWhen = sendAutomaticallyWhen;
	}
	/**
	* Hook status:
	*
	* - `submitted`: The message has been sent to the API and we're awaiting the start of the response stream.
	* - `streaming`: The response is actively streaming in from the API, receiving chunks of data.
	* - `ready`: The full response has been received and processed; a new user message can be submitted.
	* - `error`: An error occurred during the API request, preventing successful completion.
	*/
	get status() {
		return this.state.status;
	}
	setStatus({ status, error }) {
		if (this.status === status) return;
		this.state.status = status;
		this.state.error = error;
	}
	get error() {
		return this.state.error;
	}
	get messages() {
		return this.state.messages;
	}
	get lastMessage() {
		return this.state.messages[this.state.messages.length - 1];
	}
	set messages(messages) {
		this.state.messages = messages;
	}
	async shouldSendAutomatically() {
		if (!this.sendAutomaticallyWhen) return false;
		const result = this.sendAutomaticallyWhen({ messages: this.state.messages });
		if (result && typeof result === "object" && "then" in result) return await result;
		return result;
	}
	async makeRequest({ trigger, metadata, headers, body, messageId }) {
		var _a21, _b, _c;
		let resumeStream;
		if (trigger === "resume-stream") try {
			const reconnect = await this.transport.reconnectToStream({
				chatId: this.id,
				metadata,
				headers,
				body
			});
			if (reconnect == null) return;
			resumeStream = reconnect;
		} catch (err) {
			if (this.onError && err instanceof Error) this.onError(err);
			this.setStatus({
				status: "error",
				error: err
			});
			return;
		}
		this.setStatus({
			status: "submitted",
			error: void 0
		});
		const lastMessage = this.lastMessage;
		let isAbort = false;
		let isDisconnect = false;
		let isError = false;
		try {
			const activeResponse = {
				state: createStreamingUIMessageState({
					lastMessage: this.state.snapshot(lastMessage),
					messageId: this.generateId()
				}),
				abortController: new AbortController()
			};
			activeResponse.abortController.signal.addEventListener("abort", () => {
				isAbort = true;
			});
			this.activeResponse = activeResponse;
			let stream;
			if (trigger === "resume-stream") stream = resumeStream;
			else stream = await this.transport.sendMessages({
				chatId: this.id,
				messages: this.state.messages,
				abortSignal: activeResponse.abortController.signal,
				metadata,
				headers,
				body,
				trigger,
				messageId
			});
			const runUpdateMessageJob = (job) => this.jobExecutor.run(() => job({
				state: activeResponse.state,
				write: () => {
					var _a22;
					this.setStatus({ status: "streaming" });
					if (activeResponse.state.message.id === ((_a22 = this.lastMessage) == null ? void 0 : _a22.id)) this.state.replaceMessage(this.state.messages.length - 1, activeResponse.state.message);
					else this.state.pushMessage(activeResponse.state.message);
				}
			}));
			await consumeStream({
				stream: processUIMessageStream({
					stream,
					onToolCall: this.onToolCall,
					onData: this.onData,
					messageMetadataSchema: this.messageMetadataSchema,
					dataPartSchemas: this.dataPartSchemas,
					runUpdateMessageJob,
					onError: (error) => {
						throw error;
					}
				}),
				onError: (error) => {
					throw error;
				}
			});
			this.setStatus({ status: "ready" });
		} catch (err) {
			if (isAbort || err.name === "AbortError") {
				isAbort = true;
				this.setStatus({ status: "ready" });
				return null;
			}
			isError = true;
			if (err instanceof TypeError && (err.message.toLowerCase().includes("fetch") || err.message.toLowerCase().includes("network"))) isDisconnect = true;
			if (this.onError && err instanceof Error) this.onError(err);
			this.setStatus({
				status: "error",
				error: err
			});
		} finally {
			try {
				(_b = this.onFinish) == null || _b.call(this, {
					message: this.activeResponse.state.message,
					messages: this.state.messages,
					isAbort,
					isDisconnect,
					isError,
					finishReason: (_a21 = this.activeResponse) == null ? void 0 : _a21.state.finishReason
				});
			} catch (err) {
				console.error(err);
			}
			this.activeResponse = void 0;
		}
		if (!isError && await this.shouldSendAutomatically()) await this.makeRequest({
			trigger: "submit-message",
			messageId: (_c = this.lastMessage) == null ? void 0 : _c.id,
			metadata,
			headers,
			body
		});
	}
};
var DirectChatTransport = class {
	constructor({ agent, options, ...uiMessageStreamOptions }) {
		this.agent = agent;
		this.agentOptions = options;
		this.uiMessageStreamOptions = uiMessageStreamOptions;
	}
	async sendMessages({ messages, abortSignal }) {
		const modelMessages = await convertToModelMessages(await validateUIMessages({
			messages,
			tools: this.agent.tools
		}), { tools: this.agent.tools });
		return (await this.agent.stream({
			prompt: modelMessages,
			abortSignal,
			...this.agentOptions !== void 0 ? { options: this.agentOptions } : {}
		})).toUIMessageStream(this.uiMessageStreamOptions);
	}
	/**
	* Direct transport does not support reconnection since there is no
	* persistent server-side stream to reconnect to.
	*
	* @returns Always returns `null`
	*/
	async reconnectToStream(_options) {
		return null;
	}
};
function lastAssistantMessageIsCompleteWithApprovalResponses({ messages }) {
	const message = messages[messages.length - 1];
	if (!message) return false;
	if (message.role !== "assistant") return false;
	const lastStepStartIndex = message.parts.reduce((lastIndex, part, index) => {
		return part.type === "step-start" ? index : lastIndex;
	}, -1);
	const lastStepToolInvocations = message.parts.slice(lastStepStartIndex + 1).filter(isToolUIPart);
	return lastStepToolInvocations.filter((part) => part.state === "approval-responded").length > 0 && lastStepToolInvocations.every((part) => part.state === "output-available" || part.state === "output-error" || part.state === "approval-responded");
}
function lastAssistantMessageIsCompleteWithToolCalls({ messages }) {
	const message = messages[messages.length - 1];
	if (!message) return false;
	if (message.role !== "assistant") return false;
	const lastStepStartIndex = message.parts.reduce((lastIndex, part, index) => {
		return part.type === "step-start" ? index : lastIndex;
	}, -1);
	const lastStepToolInvocations = message.parts.slice(lastStepStartIndex + 1).filter(isToolUIPart).filter((part) => !part.providerExecuted);
	return lastStepToolInvocations.length > 0 && lastStepToolInvocations.every((part) => part.state === "output-available" || part.state === "output-error");
}
function transformTextToUiMessageStream({ stream }) {
	return stream.pipeThrough(new TransformStream({
		start(controller) {
			controller.enqueue({ type: "start" });
			controller.enqueue({ type: "start-step" });
			controller.enqueue({
				type: "text-start",
				id: "text-1"
			});
		},
		async transform(part, controller) {
			controller.enqueue({
				type: "text-delta",
				id: "text-1",
				delta: part
			});
		},
		async flush(controller) {
			controller.enqueue({
				type: "text-end",
				id: "text-1"
			});
			controller.enqueue({ type: "finish-step" });
			controller.enqueue({ type: "finish" });
		}
	}));
}
var TextStreamChatTransport = class extends HttpChatTransport {
	constructor(options = {}) {
		super(options);
	}
	processResponseStream(stream) {
		return transformTextToUiMessageStream({ stream: stream.pipeThrough(new TextDecoderStream()) });
	}
};
//#endregion
export { experimental_customProvider as $, UI_MESSAGE_STREAM_HEADERS as A, pruneMessages as At, createAgentUIStream as B, streamText as Bt, RetryError as C, lastAssistantMessageIsCompleteWithToolCalls as Ct, ToolCallRepairError as D, pipeAgentUIStreamToResponse as Dt, ToolCallNotFoundForApprovalError as E, parsePartialJson as Et, callCompletionApi as F, simulateReadableStream as Ft, createUIMessageStream as G, userModelMessageSchema as Gt, createDownload as H, toolModelMessageSchema as Ht, consumeStream as I, simulateStreamingMiddleware as It, defaultEmbeddingSettingsMiddleware as J, wrapImageModel as Jt, createUIMessageStreamResponse as K, validateUIMessages as Kt, convertFileListToFileUIParts as L, smoothStream as Lt, addToolInputExamplesMiddleware as M, registerTelemetryIntegration as Mt, assistantModelMessageSchema as N, rerank as Nt, ToolLoopAgent as O, pipeTextStreamToResponse as Ot, bindTelemetryIntegration as P, safeValidateUIMessages as Pt, experimental_createProviderRegistry as Q, gateway as Qt, convertToModelMessages as R, stepCountIs as Rt, NoVideoGeneratedError as S, lastAssistantMessageIsCompleteWithApprovalResponses as St, TextStreamChatTransport as T, output_exports as Tt, createProviderRegistry as U, transcribe as Ut, createAgentUIStreamResponse as V, systemModelMessageSchema as Vt, createTextStreamResponse as W, uiMessageChunkSchema as Wt, embed as X, wrapProvider as Xt, defaultSettingsMiddleware as Y, wrapLanguageModel as Yt, embedMany as Z, createGatewayProvider as Zt, NoOutputGeneratedError as _, isReasoningUIPart as _t, HttpChatTransport as a, generateObject as at, NoSuchToolError as b, isToolOrDynamicToolUIPart as bt, InvalidMessageRoleError as c, getStaticToolName as ct, InvalidToolInputError as d, getToolOrDynamicToolName as dt, experimental_generateImage as et, JsonToSseTransformStream as f, hasToolCall as ft, NoObjectGeneratedError as g, isLoopFinished as gt, NoImageGeneratedError as h, isFileUIPart as ht, DirectChatTransport as i, generateImage as it, UnsupportedModelVersionError as j, readUIMessageStream as jt, UIMessageStreamError as k, pipeUIMessageStreamToResponse as kt, InvalidStreamPartError as l, getTextFromDataUrl as lt, MissingToolResultsError as m, isDeepEqualData as mt, DefaultChatTransport as n, extractJsonMiddleware as nt, InvalidArgumentError as o, generateSpeech as ot, MessageConversionError as p, isDataUIPart as pt, customProvider as q, wrapEmbeddingModel as qt, DefaultGeneratedFile as r, extractReasoningMiddleware as rt, InvalidDataContentError as s, generateText as st, AbstractChat as t, experimental_generateVideo as tt, InvalidToolApprovalError as u, getToolName as ut, NoSpeechGeneratedError as v, isStaticToolUIPart as vt, SerialJobExecutor as w, modelMessageSchema as wt, NoTranscriptGeneratedError as x, isToolUIPart as xt, NoSuchProviderError as y, isTextUIPart as yt, cosineSimilarity as z, streamObject as zt };
