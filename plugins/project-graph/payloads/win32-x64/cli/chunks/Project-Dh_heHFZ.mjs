import { i as __toESM, t as __commonJSMin } from "./chunk-2rV9d50f.mjs";
import { a as ZodDefault, c as ZodUnion, i as ZodBoolean, o as ZodNumber, s as ZodOptional } from "./v4-DD_PkrNo.mjs";
import { i as createLiveProjectBuiltInToolRuntimeHost, r as classifyBuiltInToolException, s as invokeBuiltInTool } from "./BuiltInToolRegistry-Bc-GWZgp.mjs";
import { t as fetch } from "./ClosedProjectHttp-B1zYjAcG.mjs";
import { n as settingsSchema, t as Settings } from "./ClosedProjectSettings-BauGVxOX.mjs";
import { A as src_default, D as compareProjectVersions, F as Uint8ArrayReader, G as Vector, I as Uint8ArrayWriter, L as createDefaultMetadata, N as BlobReader, O as parseProjectFile, R as toast, U as Rectangle, X as Color, ft as invoke, j as ZipWriter, k as URI, mt as transformCallback, nt as deserialize, pt as isTauri, st as serialize, t as ProjectUpgrader, ut as Resource } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { n as require_react, t as require_react_dom } from "./react-dom-I8_g7zx2.mjs";
import { n as clsx, r as require_jsx_runtime, t as twMerge } from "./bundle-mjs-CFgt2SnT.mjs";
import { n as finalizeRuntimeCleanup } from "./RuntimeCleanup-CKF35Wew.mjs";
import { EventEmitter } from "events";
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/event.js
/**
* The event system allows you to emit events to the backend and listen to events from it.
*
* This package is also accessible with `window.__TAURI__.event` when [`app.withGlobalTauri`](https://v2.tauri.app/reference/config/#withglobaltauri) in `tauri.conf.json` is set to `true`.
* @module
*/
/**
* @since 1.1.0
*/
var TauriEvent;
(function(TauriEvent) {
	TauriEvent["WINDOW_RESIZED"] = "tauri://resize";
	TauriEvent["WINDOW_MOVED"] = "tauri://move";
	TauriEvent["WINDOW_CLOSE_REQUESTED"] = "tauri://close-requested";
	TauriEvent["WINDOW_DESTROYED"] = "tauri://destroyed";
	TauriEvent["WINDOW_FOCUS"] = "tauri://focus";
	TauriEvent["WINDOW_BLUR"] = "tauri://blur";
	TauriEvent["WINDOW_SCALE_FACTOR_CHANGED"] = "tauri://scale-change";
	TauriEvent["WINDOW_THEME_CHANGED"] = "tauri://theme-changed";
	TauriEvent["WINDOW_CREATED"] = "tauri://window-created";
	TauriEvent["WINDOW_SUSPENDED"] = "tauri://suspended";
	TauriEvent["WINDOW_RESUMED"] = "tauri://resumed";
	TauriEvent["WEBVIEW_CREATED"] = "tauri://webview-created";
	TauriEvent["DRAG_ENTER"] = "tauri://drag-enter";
	TauriEvent["DRAG_OVER"] = "tauri://drag-over";
	TauriEvent["DRAG_DROP"] = "tauri://drag-drop";
	TauriEvent["DRAG_LEAVE"] = "tauri://drag-leave";
})(TauriEvent || (TauriEvent = {}));
/**
* Unregister the event listener associated with the given name and id.
*
* @ignore
* @param event The event name
* @param eventId Event identifier
* @returns
*/
async function _unlisten(event, eventId) {
	window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(event, eventId);
	await invoke("plugin:event|unlisten", {
		event,
		eventId
	});
}
/**
* Listen to an emitted event to any {@link EventTarget|target}.
*
* @example
* ```typescript
* import { listen } from '@tauri-apps/api/event';
* const unlisten = await listen<string>('error', (event) => {
*   console.log(`Got error, payload: ${event.payload}`);
* });
*
* // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
* unlisten();
* ```
*
* @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
* @param handler Event handler callback.
* @param options Event listening options.
* @returns A promise resolving to a function to unlisten to the event.
* Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
*
* @since 1.0.0
*/
async function listen(event, handler, options) {
	var _a;
	return invoke("plugin:event|listen", {
		event,
		target: typeof (options === null || options === void 0 ? void 0 : options.target) === "string" ? {
			kind: "AnyLabel",
			label: options.target
		} : (_a = options === null || options === void 0 ? void 0 : options.target) !== null && _a !== void 0 ? _a : { kind: "Any" },
		handler: transformCallback(handler)
	}).then((eventId) => {
		return async () => _unlisten(event, eventId);
	});
}
/**
* Listens once to an emitted event to any {@link EventTarget|target}.
*
* @example
* ```typescript
* import { once } from '@tauri-apps/api/event';
* interface LoadedPayload {
*   loggedIn: boolean,
*   token: string
* }
* const unlisten = await once<LoadedPayload>('loaded', (event) => {
*   console.log(`App is loaded, loggedIn: ${event.payload.loggedIn}, token: ${event.payload.token}`);
* });
*
* // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
* unlisten();
* ```
*
* @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
* @param handler Event handler callback.
* @param options Event listening options.
* @returns A promise resolving to a function to unlisten to the event.
* Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
*
* @since 1.0.0
*/
async function once(event, handler, options) {
	return listen(event, (eventData) => {
		_unlisten(event, eventData.id);
		handler(eventData);
	}, options);
}
/**
* Emits an event to all {@link EventTarget|targets}.
*
* @example
* ```typescript
* import { emit } from '@tauri-apps/api/event';
* await emit('frontend-loaded', { loggedIn: true, token: 'authToken' });
* ```
*
* @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
* @param payload Event payload.
*
* @since 1.0.0
*/
async function emit(event, payload) {
	await invoke("plugin:event|emit", {
		event,
		payload
	});
}
/**
* Emits an event to all {@link EventTarget|targets} matching the given target.
*
* @example
* ```typescript
* import { emitTo } from '@tauri-apps/api/event';
* await emitTo('main', 'frontend-loaded', { loggedIn: true, token: 'authToken' });
* ```
*
* @param target Label of the target Window/Webview/WebviewWindow or raw {@link EventTarget} object.
* @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
* @param payload Event payload.
*
* @since 2.0.0
*/
async function emitTo(target, event, payload) {
	await invoke("plugin:event|emit_to", {
		target: typeof target === "string" ? {
			kind: "AnyLabel",
			label: target
		} : target,
		event,
		payload
	});
}
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+plugin-store@2.4.3/node_modules/@tauri-apps/plugin-store/dist-js/index.js
/**
* Create a new Store or load the existing store with the path.
*
* @example
* ```typescript
* import { Store } from '@tauri-apps/api/store';
* const store = await Store.load('store.json');
* ```
*
* @param path Path to save the store in `app_data_dir`
* @param options Store configuration options
*/
async function load(path, options) {
	return await Store.load(path, options);
}
/**
* A lazy loaded key-value store persisted by the backend layer.
*/
var LazyStore = class {
	get store() {
		if (!this._store) this._store = load(this.path, this.options);
		return this._store;
	}
	/**
	* Note that the options are not applied if someone else already created the store
	* @param path Path to save the store in `app_data_dir`
	* @param options Store configuration options
	*/
	constructor(path, options) {
		this.path = path;
		this.options = options;
	}
	/**
	* Init/load the store if it's not loaded already
	*/
	async init() {
		await this.store;
	}
	async set(key, value) {
		return (await this.store).set(key, value);
	}
	async get(key) {
		return (await this.store).get(key);
	}
	async has(key) {
		return (await this.store).has(key);
	}
	async delete(key) {
		return (await this.store).delete(key);
	}
	async clear() {
		await (await this.store).clear();
	}
	async reset() {
		await (await this.store).reset();
	}
	async keys() {
		return (await this.store).keys();
	}
	async values() {
		return (await this.store).values();
	}
	async entries() {
		return (await this.store).entries();
	}
	async length() {
		return (await this.store).length();
	}
	async reload(options) {
		await (await this.store).reload(options);
	}
	async save() {
		await (await this.store).save();
	}
	async onKeyChange(key, cb) {
		return (await this.store).onKeyChange(key, cb);
	}
	async onChange(cb) {
		return (await this.store).onChange(cb);
	}
	async close() {
		if (this._store) await (await this._store).close();
	}
};
/**
* A key-value store persisted by the backend layer.
*/
var Store = class Store extends Resource {
	constructor(rid) {
		super(rid);
	}
	/**
	* Create a new Store or load the existing store with the path.
	*
	* @example
	* ```typescript
	* import { Store } from '@tauri-apps/api/store';
	* const store = await Store.load('store.json');
	* ```
	*
	* @param path Path to save the store in `app_data_dir`
	* @param options Store configuration options
	*/
	static async load(path, options) {
		return new Store(await invoke("plugin:store|load", {
			path,
			options
		}));
	}
	/**
	* Gets an already loaded store.
	*
	* If the store is not loaded, returns `null`. In this case you must {@link Store.load load} it.
	*
	* This function is more useful when you already know the store is loaded
	* and just need to access its instance. Prefer {@link Store.load} otherwise.
	*
	* @example
	* ```typescript
	* import { Store } from '@tauri-apps/api/store';
	* let store = await Store.get('store.json');
	* if (!store) {
	*   store = await Store.load('store.json');
	* }
	* ```
	*
	* @param path Path of the store.
	*/
	static async get(path) {
		return await invoke("plugin:store|get_store", { path }).then((rid) => rid ? new Store(rid) : null);
	}
	async set(key, value) {
		await invoke("plugin:store|set", {
			rid: this.rid,
			key,
			value
		});
	}
	async get(key) {
		const [value, exists] = await invoke("plugin:store|get", {
			rid: this.rid,
			key
		});
		return exists ? value : void 0;
	}
	async has(key) {
		return await invoke("plugin:store|has", {
			rid: this.rid,
			key
		});
	}
	async delete(key) {
		return await invoke("plugin:store|delete", {
			rid: this.rid,
			key
		});
	}
	async clear() {
		await invoke("plugin:store|clear", { rid: this.rid });
	}
	async reset() {
		await invoke("plugin:store|reset", { rid: this.rid });
	}
	async keys() {
		return await invoke("plugin:store|keys", { rid: this.rid });
	}
	async values() {
		return await invoke("plugin:store|values", { rid: this.rid });
	}
	async entries() {
		return await invoke("plugin:store|entries", { rid: this.rid });
	}
	async length() {
		return await invoke("plugin:store|length", { rid: this.rid });
	}
	async reload(options) {
		await invoke("plugin:store|reload", {
			rid: this.rid,
			...options
		});
	}
	async save() {
		await invoke("plugin:store|save", { rid: this.rid });
	}
	async onKeyChange(key, cb) {
		return await listen("store://change", (event) => {
			if (event.payload.resourceId === this.rid && event.payload.key === key) cb(event.payload.exists ? event.payload.value : void 0);
		});
	}
	async onChange(cb) {
		return await listen("store://change", (event) => {
			if (event.payload.resourceId === this.rid) cb(event.payload.key, event.payload.exists ? event.payload.value : void 0);
		});
	}
};
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+plugin-os@2.3.2/node_modules/@tauri-apps/plugin-os/dist-js/index.js
/**
* Returns a string describing the specific operating system in use.
* The value is set at compile time. Possible values are `'linux'`, `'macos'`, `'ios'`, `'freebsd'`, `'dragonfly'`, `'netbsd'`, `'openbsd'`, `'solaris'`, `'android'`, `'windows'`
*
* @example
* ```typescript
* import { platform } from '@tauri-apps/plugin-os';
* const platformName = platform();
* ```
*
* @since 2.0.0
*
*/
function platform$1() {
	return window.__TAURI_OS_PLUGIN_INTERNALS__.platform;
}
/**
* Returns the current operating system family. Possible values are `'unix'`, `'windows'`.
* @example
* ```typescript
* import { family } from '@tauri-apps/plugin-os';
* const family = family();
* ```
*
* @since 2.0.0
*/
function family$1() {
	return window.__TAURI_OS_PLUGIN_INTERNALS__.family;
}
//#endregion
//#region src/utils/platform.tsx
var isWeb = !("__TAURI_OS_PLUGIN_INTERNALS__" in window);
var isDesktop = !(isWeb ? navigator.userAgent.toLowerCase().includes("mobile") : platform$1() === "android");
var isIpad = isWeb && navigator.userAgent.toLowerCase().includes("mac os");
isWeb && new URLSearchParams(window.location.search).get("frame");
var isMac = !isWeb && platform$1() === "macos";
var isWindows = !isWeb && platform$1() === "windows";
var isLinux = !isWeb && platform$1() === "linux";
function family() {
	if (isWeb) if (navigator.userAgent.toLowerCase().includes("windows")) return "windows";
	else return "unix";
	else return family$1();
}
//#endregion
//#region src/utils/store.tsx
async function createStore$1(name) {
	if (isWeb) return new WebStore(name);
	else return load(name);
}
var WebStore = class {
	name;
	rid = 114514;
	constructor(name) {
		this.name = name;
	}
	async clear() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`${this.name}_`)) localStorage.removeItem(key);
		}
	}
	async close() {}
	async delete(key) {
		localStorage.removeItem(`${this.name}_${key}`);
		return true;
	}
	async entries() {
		const result = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`${this.name}_`)) {
				const value = localStorage.getItem(key);
				if (value) result.push([key.slice(this.name.length + 1), JSON.parse(value)]);
			}
		}
		return result;
	}
	async get(key) {
		const value = localStorage.getItem(`${this.name}_${key}`);
		if (value) return JSON.parse(value);
	}
	async has(key) {
		return localStorage.getItem(`${this.name}_${key}`) !== null;
	}
	async keys() {
		const result = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`${this.name}_`)) result.push(key.slice(this.name.length + 1));
		}
		return result;
	}
	async length() {
		let count = 0;
		for (let i = 0; i < localStorage.length; i++) if (localStorage.key(i)?.startsWith(`${this.name}_`)) count++;
		return count;
	}
	async onChange() {
		return () => {};
	}
	async onKeyChange() {
		return () => {};
	}
	async reload() {}
	async reset() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`${this.name}_`)) localStorage.removeItem(key);
		}
	}
	async save() {}
	async set(key, value) {
		localStorage.setItem(`${this.name}_${key}`, JSON.stringify(value));
	}
	async values() {
		const result = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(`${this.name}_`)) {
				const value = localStorage.getItem(key);
				if (value) result.push(JSON.parse(value));
			}
		}
		return result;
	}
};
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/defaultAttributes.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/context.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LucideContext = (0, import_react.createContext)({});
var useLucideContext = () => (0, import_react.useContext)(LucideContext);
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/Icon.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon$1 = (0, import_react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
	const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
	const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
	return (0, import_react.createElement)("svg", {
		ref,
		...defaultAttributes,
		width: size ?? contextSize ?? defaultAttributes.width,
		height: size ?? contextSize ?? defaultAttributes.height,
		stroke: color ?? contextColor,
		strokeWidth: calculatedStrokeWidth,
		className: mergeClasses("lucide", contextClass, className),
		...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
		...rest
	}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
});
//#endregion
//#region ../node_modules/.pnpm/lucide-react@1.14.0_react@19.2.7/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon$1, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var AlignStartVertical = createLucideIcon("align-start-vertical", [
	["rect", {
		width: "9",
		height: "6",
		x: "6",
		y: "14",
		rx: "2",
		key: "lpm2y7"
	}],
	["rect", {
		width: "16",
		height: "6",
		x: "6",
		y: "4",
		rx: "2",
		key: "rdj6ps"
	}],
	["path", {
		d: "M2 2v20",
		key: "1ivd8o"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var AppWindowMac = createLucideIcon("app-window-mac", [
	["rect", {
		width: "20",
		height: "16",
		x: "2",
		y: "4",
		rx: "2",
		key: "18n3k1"
	}],
	["path", {
		d: "M6 8h.01",
		key: "x9i8wu"
	}],
	["path", {
		d: "M10 8h.01",
		key: "1r9ogq"
	}],
	["path", {
		d: "M14 8h.01",
		key: "1primd"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var AppWindow = createLucideIcon("app-window", [
	["rect", {
		x: "2",
		y: "4",
		width: "20",
		height: "16",
		rx: "2",
		key: "izxlao"
	}],
	["path", {
		d: "M10 4v4",
		key: "pp8u80"
	}],
	["path", {
		d: "M2 8h20",
		key: "d11cs7"
	}],
	["path", {
		d: "M6 4v4",
		key: "1svtjw"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowDownNarrowWide = createLucideIcon("arrow-down-narrow-wide", [
	["path", {
		d: "m3 16 4 4 4-4",
		key: "1co6wj"
	}],
	["path", {
		d: "M7 20V4",
		key: "1yoxec"
	}],
	["path", {
		d: "M11 4h4",
		key: "6d7r33"
	}],
	["path", {
		d: "M11 8h7",
		key: "djye34"
	}],
	["path", {
		d: "M11 12h10",
		key: "1438ji"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowRightFromLine = createLucideIcon("arrow-right-from-line", [
	["path", {
		d: "M3 5v14",
		key: "1nt18q"
	}],
	["path", {
		d: "M21 12H7",
		key: "13ipq5"
	}],
	["path", {
		d: "m15 18 6-6-6-6",
		key: "6tx3qv"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowRight = createLucideIcon("arrow-right", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUpDown = createLucideIcon("arrow-up-down", [
	["path", {
		d: "m21 16-4 4-4-4",
		key: "f6ql7i"
	}],
	["path", {
		d: "M17 20V4",
		key: "1ejh1v"
	}],
	["path", {
		d: "m3 8 4-4 4 4",
		key: "11wl7u"
	}],
	["path", {
		d: "M7 4v16",
		key: "1glfcx"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Blend = createLucideIcon("blend", [["circle", {
	cx: "9",
	cy: "9",
	r: "7",
	key: "p2h5vp"
}], ["circle", {
	cx: "15",
	cy: "15",
	r: "7",
	key: "19ennj"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bug = createLucideIcon("bug", [
	["path", {
		d: "M12 20v-9",
		key: "1qisl0"
	}],
	["path", {
		d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",
		key: "uouzyp"
	}],
	["path", {
		d: "M14.12 3.88 16 2",
		key: "qol33r"
	}],
	["path", {
		d: "M21 21a4 4 0 0 0-3.81-4",
		key: "1b0z45"
	}],
	["path", {
		d: "M21 5a4 4 0 0 1-3.55 3.97",
		key: "5cxbf6"
	}],
	["path", {
		d: "M22 13h-4",
		key: "1jl80f"
	}],
	["path", {
		d: "M3 21a4 4 0 0 1 3.81-4",
		key: "1fjd4g"
	}],
	["path", {
		d: "M3 5a4 4 0 0 0 3.55 3.97",
		key: "1d7oge"
	}],
	["path", {
		d: "M6 13H2",
		key: "82j7cp"
	}],
	["path", {
		d: "m8 2 1.88 1.88",
		key: "fmnt4t"
	}],
	["path", {
		d: "M9 7.13V6a3 3 0 1 1 6 0v1.13",
		key: "1vgav8"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Calculator = createLucideIcon("calculator", [
	["rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		key: "1nb95v"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "6",
		y2: "6",
		key: "x4nwl0"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "14",
		y2: "18",
		key: "wjye3r"
	}],
	["path", {
		d: "M16 10h.01",
		key: "1m94wz"
	}],
	["path", {
		d: "M12 10h.01",
		key: "1nrarc"
	}],
	["path", {
		d: "M8 10h.01",
		key: "19clt8"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CaseSensitive = createLucideIcon("case-sensitive", [
	["path", {
		d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16",
		key: "d5nyq2"
	}],
	["path", {
		d: "M22 9v7",
		key: "pvm9v3"
	}],
	["path", {
		d: "M3.304 13h6.392",
		key: "1q3zxz"
	}],
	["circle", {
		cx: "18.5",
		cy: "12.5",
		r: "3.5",
		key: "z97x68"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronDown = createLucideIcon("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronUp = createLucideIcon("chevron-up", [["path", {
	d: "m18 15-6-6-6 6",
	key: "153udz"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleDot = createLucideIcon("circle-dot", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "1",
	key: "41hilf"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Circle = createLucideIcon("circle", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clipboard = createLucideIcon("clipboard", [["rect", {
	width: "8",
	height: "4",
	x: "8",
	y: "2",
	rx: "1",
	ry: "1",
	key: "tgr4d6"
}], ["path", {
	d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
	key: "116196"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Contrast = createLucideIcon("contrast", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 18a6 6 0 0 0 0-12v12z",
	key: "j4l70d"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Crosshair = createLucideIcon("crosshair", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["line", {
		x1: "22",
		x2: "18",
		y1: "12",
		y2: "12",
		key: "l9bcsi"
	}],
	["line", {
		x1: "6",
		x2: "2",
		y1: "12",
		y2: "12",
		key: "13hhkx"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "6",
		y2: "2",
		key: "10w3f3"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "22",
		y2: "18",
		key: "15g9kq"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Database = createLucideIcon("database", [
	["ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3",
		key: "msslwz"
	}],
	["path", {
		d: "M3 5V19A9 3 0 0 0 21 19V5",
		key: "1wlel7"
	}],
	["path", {
		d: "M3 12A9 3 0 0 0 21 12",
		key: "mv7ke4"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Delete = createLucideIcon("delete", [
	["path", {
		d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
		key: "1yo7s0"
	}],
	["path", {
		d: "m12 9 6 6",
		key: "anjzzh"
	}],
	["path", {
		d: "m18 9-6 6",
		key: "1fp51s"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Eye = createLucideIcon("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FileImage = createLucideIcon("file-image", [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["circle", {
		cx: "10",
		cy: "12",
		r: "2",
		key: "737tya"
	}],
	["path", {
		d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",
		key: "wt3hpn"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var FileStack = createLucideIcon("file-stack", [
	["path", {
		d: "M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1",
		key: "likhh7"
	}],
	["path", {
		d: "M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1",
		key: "17ky3x"
	}],
	["path", {
		d: "M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z",
		key: "1hyeo0"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var File = createLucideIcon("file", [["path", {
	d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
	key: "1oefj6"
}], ["path", {
	d: "M14 2v5a1 1 0 0 0 1 1h5",
	key: "wfsgrz"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Folder = createLucideIcon("folder", [["path", {
	d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
	key: "1kt360"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Fullscreen = createLucideIcon("fullscreen", [
	["path", {
		d: "M3 7V5a2 2 0 0 1 2-2h2",
		key: "aa7l1z"
	}],
	["path", {
		d: "M17 3h2a2 2 0 0 1 2 2v2",
		key: "4qcy5o"
	}],
	["path", {
		d: "M21 17v2a2 2 0 0 1-2 2h-2",
		key: "6vwrx8"
	}],
	["path", {
		d: "M7 21H5a2 2 0 0 1-2-2v-2",
		key: "ioqczr"
	}],
	["rect", {
		width: "10",
		height: "8",
		x: "7",
		y: "8",
		rx: "1",
		key: "vys8me"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Gauge = createLucideIcon("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Grip = createLucideIcon("grip", [
	["circle", {
		cx: "12",
		cy: "5",
		r: "1",
		key: "gxeob9"
	}],
	["circle", {
		cx: "19",
		cy: "5",
		r: "1",
		key: "w8mnmm"
	}],
	["circle", {
		cx: "5",
		cy: "5",
		r: "1",
		key: "lttvr7"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["circle", {
		cx: "19",
		cy: "12",
		r: "1",
		key: "1wjl8i"
	}],
	["circle", {
		cx: "5",
		cy: "12",
		r: "1",
		key: "1pcz8c"
	}],
	["circle", {
		cx: "12",
		cy: "19",
		r: "1",
		key: "lyex9k"
	}],
	["circle", {
		cx: "19",
		cy: "19",
		r: "1",
		key: "shf9b7"
	}],
	["circle", {
		cx: "5",
		cy: "19",
		r: "1",
		key: "bfqh0e"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var HandGrab = createLucideIcon("hand-grab", [
	["path", {
		d: "M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4",
		key: "edstyy"
	}],
	["path", {
		d: "M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
		key: "19wdwo"
	}],
	["path", {
		d: "M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5",
		key: "1lugqo"
	}],
	["path", {
		d: "M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
		key: "1hbeus"
	}],
	["path", {
		d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0",
		key: "1etffm"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var HandMetal = createLucideIcon("hand-metal", [
	["path", {
		d: "M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4",
		key: "wc6myp"
	}],
	["path", {
		d: "M14 11V9a2 2 0 1 0-4 0v2",
		key: "94qvcw"
	}],
	["path", {
		d: "M10 10.5V5a2 2 0 1 0-4 0v9",
		key: "m1ah89"
	}],
	["path", {
		d: "m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5",
		key: "t1skq1"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Hand = createLucideIcon("hand", [
	["path", {
		d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
		key: "1fvzgz"
	}],
	["path", {
		d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
		key: "1kc0my"
	}],
	["path", {
		d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",
		key: "10h0bg"
	}],
	["path", {
		d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
		key: "1s1gnw"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var HardDriveDownload = createLucideIcon("hard-drive-download", [
	["path", {
		d: "M12 2v8",
		key: "1q4o3n"
	}],
	["path", {
		d: "m16 6-4 4-4-4",
		key: "6wukr"
	}],
	["rect", {
		width: "20",
		height: "8",
		x: "2",
		y: "14",
		rx: "2",
		key: "w68u3i"
	}],
	["path", {
		d: "M6 18h.01",
		key: "uhywen"
	}],
	["path", {
		d: "M10 18h.01",
		key: "h775k"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var HardDrive = createLucideIcon("hard-drive", [
	["path", {
		d: "M10 16h.01",
		key: "1bzywj"
	}],
	["path", {
		d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
		key: "18tbho"
	}],
	["path", {
		d: "M21.946 12.013H2.054",
		key: "zqlbp7"
	}],
	["path", {
		d: "M6 16h.01",
		key: "1pmjb7"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Hourglass = createLucideIcon("hourglass", [
	["path", {
		d: "M5 22h14",
		key: "ehvnwv"
	}],
	["path", {
		d: "M5 2h14",
		key: "pdyrp9"
	}],
	["path", {
		d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
		key: "1d314k"
	}],
	["path", {
		d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
		key: "1vvvr6"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ImageMinus = createLucideIcon("image-minus", [
	["path", {
		d: "M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",
		key: "m87ecr"
	}],
	["line", {
		x1: "16",
		x2: "22",
		y1: "5",
		y2: "5",
		key: "ez7e4s"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ImageUpscale = createLucideIcon("image-upscale", [
	["path", {
		d: "M16 3h5v5",
		key: "1806ms"
	}],
	["path", {
		d: "M17 21h2a2 2 0 0 0 2-2",
		key: "130fy9"
	}],
	["path", {
		d: "M21 12v3",
		key: "1wzk3p"
	}],
	["path", {
		d: "m21 3-5 5",
		key: "1g5oa7"
	}],
	["path", {
		d: "M3 7V5a2 2 0 0 1 2-2",
		key: "kk3yz1"
	}],
	["path", {
		d: "m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19",
		key: "fyekpt"
	}],
	["path", {
		d: "M9 3h3",
		key: "d52fa"
	}],
	["rect", {
		x: "3",
		y: "11",
		width: "10",
		height: "10",
		rx: "1",
		key: "1wpmix"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Keyboard = createLucideIcon("keyboard", [
	["path", {
		d: "M10 8h.01",
		key: "1r9ogq"
	}],
	["path", {
		d: "M12 12h.01",
		key: "1mp3jc"
	}],
	["path", {
		d: "M14 8h.01",
		key: "1primd"
	}],
	["path", {
		d: "M16 12h.01",
		key: "1l6xoz"
	}],
	["path", {
		d: "M18 8h.01",
		key: "emo2bl"
	}],
	["path", {
		d: "M6 8h.01",
		key: "x9i8wu"
	}],
	["path", {
		d: "M7 16h10",
		key: "wp8him"
	}],
	["path", {
		d: "M8 12h.01",
		key: "czm47f"
	}],
	["rect", {
		width: "20",
		height: "16",
		x: "2",
		y: "4",
		rx: "2",
		key: "18n3k1"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Languages = createLucideIcon("languages", [
	["path", {
		d: "m5 8 6 6",
		key: "1wu5hv"
	}],
	["path", {
		d: "m4 14 6-6 2-3",
		key: "1k1g8d"
	}],
	["path", {
		d: "M2 5h12",
		key: "or177f"
	}],
	["path", {
		d: "M7 2h1",
		key: "1t2jsx"
	}],
	["path", {
		d: "m22 22-5-10-5 10",
		key: "don7ne"
	}],
	["path", {
		d: "M14 18h6",
		key: "1m8k6r"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Layers = createLucideIcon("layers", [
	["path", {
		d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
		key: "zw3jo"
	}],
	["path", {
		d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
		key: "1wduqc"
	}],
	["path", {
		d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
		key: "kqbvx6"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Lightbulb = createLucideIcon("lightbulb", [
	["path", {
		d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
		key: "1gvzjb"
	}],
	["path", {
		d: "M9 18h6",
		key: "x1upvd"
	}],
	["path", {
		d: "M10 22h4",
		key: "ceow96"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LineSquiggle = createLucideIcon("line-squiggle", [["path", {
	d: "M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2",
	key: "1lrphd"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListCheck = createLucideIcon("list-check", [
	["path", {
		d: "M16 5H3",
		key: "m91uny"
	}],
	["path", {
		d: "M16 12H3",
		key: "1a2rj7"
	}],
	["path", {
		d: "M11 19H3",
		key: "zflm78"
	}],
	["path", {
		d: "m15 18 2 2 4-4",
		key: "1szwhi"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListCollapse = createLucideIcon("list-collapse", [
	["path", {
		d: "M10 5h11",
		key: "1hkqpe"
	}],
	["path", {
		d: "M10 12h11",
		key: "6m4ad9"
	}],
	["path", {
		d: "M10 19h11",
		key: "14g2nv"
	}],
	["path", {
		d: "m3 10 3-3-3-3",
		key: "i7pm08"
	}],
	["path", {
		d: "m3 20 3-3-3-3",
		key: "20gx1n"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListEnd = createLucideIcon("list-end", [
	["path", {
		d: "M16 5H3",
		key: "m91uny"
	}],
	["path", {
		d: "M16 12H3",
		key: "1a2rj7"
	}],
	["path", {
		d: "M9 19H3",
		key: "s61nz1"
	}],
	["path", {
		d: "m16 16-3 3 3 3",
		key: "117b85"
	}],
	["path", {
		d: "M21 5v12a2 2 0 0 1-2 2h-6",
		key: "hey24a"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListMusic = createLucideIcon("list-music", [
	["path", {
		d: "M16 5H3",
		key: "m91uny"
	}],
	["path", {
		d: "M11 12H3",
		key: "51ecnj"
	}],
	["path", {
		d: "M11 19H3",
		key: "zflm78"
	}],
	["path", {
		d: "M21 16V5",
		key: "yxg4q8"
	}],
	["circle", {
		cx: "18",
		cy: "16",
		r: "3",
		key: "1hluhg"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListRestart = createLucideIcon("list-restart", [
	["path", {
		d: "M21 5H3",
		key: "1fi0y6"
	}],
	["path", {
		d: "M7 12H3",
		key: "13ou7f"
	}],
	["path", {
		d: "M7 19H3",
		key: "wbqt3n"
	}],
	["path", {
		d: "M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",
		key: "qth677"
	}],
	["path", {
		d: "M11 10v4h4",
		key: "172dkj"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ListTree = createLucideIcon("list-tree", [
	["path", {
		d: "M8 5h13",
		key: "1pao27"
	}],
	["path", {
		d: "M13 12h8",
		key: "h98zly"
	}],
	["path", {
		d: "M13 19h8",
		key: "c3s6r1"
	}],
	["path", {
		d: "M3 10a2 2 0 0 0 2 2h3",
		key: "1npucw"
	}],
	["path", {
		d: "M3 5v12a2 2 0 0 0 2 2h3",
		key: "x1gjn2"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LoaderPinwheel = createLucideIcon("loader-pinwheel", [
	["path", {
		d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0",
		key: "1lzz15"
	}],
	["path", {
		d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6",
		key: "1gnrpi"
	}],
	["path", {
		d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6",
		key: "u9yy5q"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageSquareText = createLucideIcon("message-square-text", [
	["path", {
		d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
		key: "18887p"
	}],
	["path", {
		d: "M7 11h10",
		key: "1twpyw"
	}],
	["path", {
		d: "M7 15h6",
		key: "d9of3u"
	}],
	["path", {
		d: "M7 7h8",
		key: "af5zfr"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Minus = createLucideIcon("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Moon = createLucideIcon("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MouseLeft = createLucideIcon("mouse-left", [
	["path", {
		d: "M12 7.318V10",
		key: "17s7lh"
	}],
	["path", {
		d: "M5 10v5a7 7 0 0 0 14 0V9c0-3.527-2.608-6.515-6-7",
		key: "imk5ea"
	}],
	["circle", {
		cx: "7",
		cy: "4",
		r: "2",
		key: "ra7k3"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MouseOff = createLucideIcon("mouse-off", [
	["path", {
		d: "M12 6v.343",
		key: "1gyhex"
	}],
	["path", {
		d: "M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218",
		key: "ukzz01"
	}],
	["path", {
		d: "M19 13.343V9A7 7 0 0 0 8.56 2.902",
		key: "104jy9"
	}],
	["path", {
		d: "M22 22 2 2",
		key: "1r8tn9"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MousePointerClick = createLucideIcon("mouse-pointer-click", [
	["path", {
		d: "M14 4.1 12 6",
		key: "ita8i4"
	}],
	["path", {
		d: "m5.1 8-2.9-.8",
		key: "1go3kf"
	}],
	["path", {
		d: "m6 12-1.9 2",
		key: "mnht97"
	}],
	["path", {
		d: "M7.2 2.2 8 5.1",
		key: "1cfko1"
	}],
	["path", {
		d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
		key: "s0h3yz"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MousePointer = createLucideIcon("mouse-pointer", [["path", {
	d: "M12.586 12.586 19 19",
	key: "ea5xo7"
}], ["path", {
	d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",
	key: "277e5u"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MouseRight = createLucideIcon("mouse-right", [
	["path", {
		d: "M12 7.318V10",
		key: "17s7lh"
	}],
	["path", {
		d: "M19 10v5a7 7 0 0 1-14 0V9c0-3.527 2.608-6.515 6-7",
		key: "2es5nn"
	}],
	["circle", {
		cx: "17",
		cy: "4",
		r: "2",
		key: "y5j2s2"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Mouse = createLucideIcon("mouse", [["rect", {
	x: "5",
	y: "2",
	width: "14",
	height: "20",
	rx: "7",
	key: "11ol66"
}], ["path", {
	d: "M12 6v4",
	key: "16clxf"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Move3d = createLucideIcon("move-3d", [
	["path", {
		d: "M5 3v16h16",
		key: "1mqmf9"
	}],
	["path", {
		d: "m5 19 6-6",
		key: "jh6hbb"
	}],
	["path", {
		d: "m2 6 3-3 3 3",
		key: "tkyvxa"
	}],
	["path", {
		d: "m18 16 3 3-3 3",
		key: "1d4glt"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MoveHorizontal = createLucideIcon("move-horizontal", [
	["path", {
		d: "m18 8 4 4-4 4",
		key: "1ak13k"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}],
	["path", {
		d: "m6 8-4 4 4 4",
		key: "15zrgr"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MoveVertical = createLucideIcon("move-vertical", [
	["path", {
		d: "M12 2v20",
		key: "t6zp3m"
	}],
	["path", {
		d: "m8 18 4 4 4-4",
		key: "bh5tu3"
	}],
	["path", {
		d: "m8 6 4-4 4 4",
		key: "ybng9g"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Move = createLucideIcon("move", [
	["path", {
		d: "M12 2v20",
		key: "t6zp3m"
	}],
	["path", {
		d: "m15 19-3 3-3-3",
		key: "11eu04"
	}],
	["path", {
		d: "m19 9 3 3-3 3",
		key: "1mg7y2"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}],
	["path", {
		d: "m5 9-3 3 3 3",
		key: "j64kie"
	}],
	["path", {
		d: "m9 5 3-3 3 3",
		key: "l8vdw6"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Palette = createLucideIcon("palette", [
	["path", {
		d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
		key: "e79jfc"
	}],
	["circle", {
		cx: "13.5",
		cy: "6.5",
		r: ".5",
		fill: "currentColor",
		key: "1okk4w"
	}],
	["circle", {
		cx: "17.5",
		cy: "10.5",
		r: ".5",
		fill: "currentColor",
		key: "f64h9f"
	}],
	["circle", {
		cx: "6.5",
		cy: "12.5",
		r: ".5",
		fill: "currentColor",
		key: "qy21gx"
	}],
	["circle", {
		cx: "8.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "fotxhn"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PanelRightOpen = createLucideIcon("panel-right-open", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "M15 3v18",
		key: "14nvp0"
	}],
	["path", {
		d: "m10 15-3-3 3-3",
		key: "1pgupc"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pause = createLucideIcon("pause", [["rect", {
	x: "14",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "kaeet6"
}], ["rect", {
	x: "5",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "1wsw3u"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pencil = createLucideIcon("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pentagon = createLucideIcon("pentagon", [["path", {
	d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
	key: "2hea0t"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Percent = createLucideIcon("percent", [
	["line", {
		x1: "19",
		x2: "5",
		y1: "5",
		y2: "19",
		key: "1x9vlm"
	}],
	["circle", {
		cx: "6.5",
		cy: "6.5",
		r: "2.5",
		key: "4mh3h7"
	}],
	["circle", {
		cx: "17.5",
		cy: "17.5",
		r: "2.5",
		key: "1mdrzq"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var PictureInPicture2 = createLucideIcon("picture-in-picture-2", [["path", {
	d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",
	key: "daa4of"
}], ["rect", {
	width: "10",
	height: "7",
	x: "12",
	y: "13",
	rx: "2",
	key: "1nb8gs"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Presentation = createLucideIcon("presentation", [
	["path", {
		d: "M2 3h20",
		key: "91anmk"
	}],
	["path", {
		d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",
		key: "2k9sn8"
	}],
	["path", {
		d: "m7 21 5-5 5 5",
		key: "bip4we"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ratio = createLucideIcon("ratio", [["rect", {
	width: "12",
	height: "20",
	x: "6",
	y: "2",
	rx: "2",
	key: "1oxtiu"
}], ["rect", {
	width: "20",
	height: "12",
	x: "2",
	y: "6",
	rx: "2",
	key: "9lu3g6"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RefreshCcw = createLucideIcon("refresh-ccw", [
	["path", {
		d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "14sxne"
	}],
	["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}],
	["path", {
		d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
		key: "1hlbsb"
	}],
	["path", {
		d: "M16 16h5v5",
		key: "ccwih5"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RefreshCcwDot = createLucideIcon("refresh-ccw-dot", [
	["path", {
		d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "14sxne"
	}],
	["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}],
	["path", {
		d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
		key: "1hlbsb"
	}],
	["path", {
		d: "M16 16h5v5",
		key: "ccwih5"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCw = createLucideIcon("rotate-cw", [["path", {
	d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
	key: "1p45f6"
}], ["path", {
	d: "M21 3v5h-5",
	key: "1q7to0"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Scaling = createLucideIcon("scaling", [
	["path", {
		d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
		key: "1m0v6g"
	}],
	["path", {
		d: "M14 15H9v-5",
		key: "pi4jk9"
	}],
	["path", {
		d: "M16 3h5v5",
		key: "1806ms"
	}],
	["path", {
		d: "M21 3 9 15",
		key: "15kdhq"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ScanEye = createLucideIcon("scan-eye", [
	["path", {
		d: "M3 7V5a2 2 0 0 1 2-2h2",
		key: "aa7l1z"
	}],
	["path", {
		d: "M17 3h2a2 2 0 0 1 2 2v2",
		key: "4qcy5o"
	}],
	["path", {
		d: "M21 17v2a2 2 0 0 1-2 2h-2",
		key: "6vwrx8"
	}],
	["path", {
		d: "M7 21H5a2 2 0 0 1-2-2v-2",
		key: "ioqczr"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "1",
		key: "41hilf"
	}],
	["path", {
		d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
		key: "11ak4c"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ScanText = createLucideIcon("scan-text", [
	["path", {
		d: "M3 7V5a2 2 0 0 1 2-2h2",
		key: "aa7l1z"
	}],
	["path", {
		d: "M17 3h2a2 2 0 0 1 2 2v2",
		key: "4qcy5o"
	}],
	["path", {
		d: "M21 17v2a2 2 0 0 1-2 2h-2",
		key: "6vwrx8"
	}],
	["path", {
		d: "M7 21H5a2 2 0 0 1-2-2v-2",
		key: "ioqczr"
	}],
	["path", {
		d: "M7 8h8",
		key: "1jbsf9"
	}],
	["path", {
		d: "M7 12h10",
		key: "b7w52i"
	}],
	["path", {
		d: "M7 16h6",
		key: "1vyc9m"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Shapes = createLucideIcon("shapes", [
	["path", {
		d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
		key: "1bo67w"
	}],
	["rect", {
		x: "3",
		y: "14",
		width: "7",
		height: "7",
		rx: "1",
		key: "1bkyp8"
	}],
	["circle", {
		cx: "17.5",
		cy: "17.5",
		r: "3.5",
		key: "w3z12y"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShieldCheck = createLucideIcon("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Skull = createLucideIcon("skull", [
	["path", {
		d: "m12.5 17-.5-1-.5 1h1z",
		key: "3me087"
	}],
	["path", {
		d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",
		key: "1o5pge"
	}],
	["circle", {
		cx: "15",
		cy: "12",
		r: "1",
		key: "1tmaij"
	}],
	["circle", {
		cx: "9",
		cy: "12",
		r: "1",
		key: "1vctgf"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Slash = createLucideIcon("slash", [["path", {
	d: "M22 2 2 22",
	key: "y4kqgn"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Space = createLucideIcon("space", [["path", {
	d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
	key: "lt2kga"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SplinePointer = createLucideIcon("spline-pointer", [
	["path", {
		d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
		key: "xwnzip"
	}],
	["path", {
		d: "M5 17A12 12 0 0 1 17 5",
		key: "1okkup"
	}],
	["circle", {
		cx: "19",
		cy: "5",
		r: "2",
		key: "mhkx31"
	}],
	["circle", {
		cx: "5",
		cy: "19",
		r: "2",
		key: "v8kfzx"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Spline = createLucideIcon("spline", [
	["circle", {
		cx: "19",
		cy: "5",
		r: "2",
		key: "mhkx31"
	}],
	["circle", {
		cx: "5",
		cy: "19",
		r: "2",
		key: "v8kfzx"
	}],
	["path", {
		d: "M5 17A12 12 0 0 1 17 5",
		key: "1okkup"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SquareArrowDownRight = createLucideIcon("square-arrow-down-right", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "m8 8 8 8",
		key: "1imecy"
	}],
	["path", {
		d: "M16 8v8H8",
		key: "1lbpgo"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SquareArrowUpLeft = createLucideIcon("square-arrow-up-left", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "M8 16V8h8",
		key: "19xb1h"
	}],
	["path", {
		d: "M16 16 8 8",
		key: "1qdy8n"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SquareDashed = createLucideIcon("square-dashed", [
	["path", {
		d: "M5 3a2 2 0 0 0-2 2",
		key: "y57alp"
	}],
	["path", {
		d: "M19 3a2 2 0 0 1 2 2",
		key: "18rm91"
	}],
	["path", {
		d: "M21 19a2 2 0 0 1-2 2",
		key: "1j7049"
	}],
	["path", {
		d: "M5 21a2 2 0 0 1-2-2",
		key: "sbafld"
	}],
	["path", {
		d: "M9 3h1",
		key: "1yesri"
	}],
	["path", {
		d: "M9 21h1",
		key: "15o7lz"
	}],
	["path", {
		d: "M14 3h1",
		key: "1ec4yj"
	}],
	["path", {
		d: "M14 21h1",
		key: "v9vybs"
	}],
	["path", {
		d: "M3 9v1",
		key: "1r0deq"
	}],
	["path", {
		d: "M21 9v1",
		key: "mxsmne"
	}],
	["path", {
		d: "M3 14v1",
		key: "vnatye"
	}],
	["path", {
		d: "M21 14v1",
		key: "169vum"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SquareM = createLucideIcon("square-m", [["path", {
	d: "M8 16V8.5a.5.5 0 0 1 .9-.3l2.7 3.599a.5.5 0 0 0 .8 0l2.7-3.6a.5.5 0 0 1 .9.3V16",
	key: "1ywlsj"
}], ["rect", {
	x: "3",
	y: "3",
	width: "18",
	height: "18",
	rx: "2",
	key: "h1oib"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SquarePen = createLucideIcon("square-pen", [["path", {
	d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
	key: "1m0v6g"
}], ["path", {
	d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
	key: "ohrbg2"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Square = createLucideIcon("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SunMoon = createLucideIcon("sun-moon", [
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715",
		key: "xlf6rm"
	}],
	["path", {
		d: "M16 12a4 4 0 0 0-4-4",
		key: "6vsxu"
	}],
	["path", {
		d: "m19 5-1.256 1.256",
		key: "1yg6a6"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sun = createLucideIcon("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Tag = createLucideIcon("tag", [["path", {
	d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
	key: "vktsd0"
}], ["circle", {
	cx: "7.5",
	cy: "7.5",
	r: ".5",
	fill: "currentColor",
	key: "kqv944"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Tally4 = createLucideIcon("tally-4", [
	["path", {
		d: "M4 4v16",
		key: "6qkkli"
	}],
	["path", {
		d: "M9 4v16",
		key: "81ygyz"
	}],
	["path", {
		d: "M14 4v16",
		key: "12vmem"
	}],
	["path", {
		d: "M19 4v16",
		key: "8ij5ei"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TextAlignJustify = createLucideIcon("text-align-justify", [
	["path", {
		d: "M3 5h18",
		key: "1u36vt"
	}],
	["path", {
		d: "M3 12h18",
		key: "1i2n21"
	}],
	["path", {
		d: "M3 19h18",
		key: "awlh7x"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TextCursorInput = createLucideIcon("text-cursor-input", [
	["path", {
		d: "M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6",
		key: "1528k5"
	}],
	["path", {
		d: "M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7",
		key: "13ksps"
	}],
	["path", {
		d: "M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1",
		key: "1n9rhb"
	}],
	["path", {
		d: "M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1",
		key: "1mj8rg"
	}],
	["path", {
		d: "M9 6v12",
		key: "velyjx"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Timer = createLucideIcon("timer", [
	["line", {
		x1: "10",
		x2: "14",
		y1: "2",
		y2: "2",
		key: "14vaq8"
	}],
	["line", {
		x1: "12",
		x2: "15",
		y1: "14",
		y2: "11",
		key: "17fdiu"
	}],
	["circle", {
		cx: "12",
		cy: "14",
		r: "8",
		key: "1e1u0o"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TrendingUpDown = createLucideIcon("trending-up-down", [
	["path", {
		d: "M14.828 14.828 21 21",
		key: "ar5fw7"
	}],
	["path", {
		d: "M21 16v5h-5",
		key: "1ck2sf"
	}],
	["path", {
		d: "m21 3-9 9-4-4-6 6",
		key: "1h02xo"
	}],
	["path", {
		d: "M21 8V3h-5",
		key: "1qoq8a"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Turtle = createLucideIcon("turtle", [
	["path", {
		d: "m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",
		key: "1lbbv7"
	}],
	["path", {
		d: "M4.82 7.9 8 10",
		key: "m9wose"
	}],
	["path", {
		d: "M15.18 7.9 12 10",
		key: "p8dp2u"
	}],
	["path", {
		d: "M16.93 10H20a2 2 0 0 1 0 4H2",
		key: "12nsm7"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Undo = createLucideIcon("undo", [["path", {
	d: "M3 7v6h6",
	key: "1v2h90"
}], ["path", {
	d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",
	key: "1r6uu6"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Ungroup = createLucideIcon("ungroup", [["rect", {
	width: "8",
	height: "6",
	x: "5",
	y: "4",
	rx: "1",
	key: "nzclkv"
}], ["rect", {
	width: "8",
	height: "6",
	x: "11",
	y: "14",
	rx: "1",
	key: "4tytwb"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Unlink = createLucideIcon("unlink", [
	["path", {
		d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
		key: "yqzxt4"
	}],
	["path", {
		d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
		key: "4qinb0"
	}],
	["line", {
		x1: "8",
		x2: "8",
		y1: "2",
		y2: "5",
		key: "1041cp"
	}],
	["line", {
		x1: "2",
		x2: "5",
		y1: "8",
		y2: "8",
		key: "14m1p5"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "19",
		y2: "22",
		key: "rzdirn"
	}],
	["line", {
		x1: "19",
		x2: "22",
		y1: "16",
		y2: "16",
		key: "ox905f"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var VenetianMask = createLucideIcon("venetian-mask", [
	["path", {
		d: "M18 11c-1.5 0-2.5.5-3 2",
		key: "1fod00"
	}],
	["path", {
		d: "M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z",
		key: "d70hit"
	}],
	["path", {
		d: "M6 11c1.5 0 2.5.5 3 2",
		key: "136fht"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Waypoints = createLucideIcon("waypoints", [
	["path", {
		d: "m10.586 5.414-5.172 5.172",
		key: "4mc350"
	}],
	["path", {
		d: "m18.586 13.414-5.172 5.172",
		key: "8c96vv"
	}],
	["path", {
		d: "M6 12h12",
		key: "8npq4p"
	}],
	["circle", {
		cx: "12",
		cy: "20",
		r: "2",
		key: "144qzu"
	}],
	["circle", {
		cx: "12",
		cy: "4",
		r: "2",
		key: "muu5ef"
	}],
	["circle", {
		cx: "20",
		cy: "12",
		r: "2",
		key: "1xzzfp"
	}],
	["circle", {
		cx: "4",
		cy: "12",
		r: "2",
		key: "1hvhnz"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var WholeWord = createLucideIcon("whole-word", [
	["circle", {
		cx: "7",
		cy: "12",
		r: "3",
		key: "12clwm"
	}],
	["path", {
		d: "M10 9v6",
		key: "17i7lo"
	}],
	["circle", {
		cx: "17",
		cy: "12",
		r: "3",
		key: "gl7c2s"
	}],
	["path", {
		d: "M14 7v8",
		key: "dl84cr"
	}],
	["path", {
		d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
		key: "lt2kga"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ZoomIn = createLucideIcon("zoom-in", [
	["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}],
	["line", {
		x1: "21",
		x2: "16.65",
		y1: "21",
		y2: "16.65",
		key: "13gj7c"
	}],
	["line", {
		x1: "11",
		x2: "11",
		y1: "8",
		y2: "14",
		key: "1vmskp"
	}],
	["line", {
		x1: "8",
		x2: "14",
		y1: "11",
		y2: "11",
		key: "durymu"
	}]
]);
/**
* @license lucide-react v1.14.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ZoomOut = createLucideIcon("zoom-out", [
	["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}],
	["line", {
		x1: "21",
		x2: "16.65",
		y1: "21",
		y2: "16.65",
		key: "13gj7c"
	}],
	["line", {
		x1: "8",
		x2: "14",
		y1: "11",
		y2: "11",
		key: "durymu"
	}]
]);
//#endregion
//#region src/core/service/SettingsIcons.tsx
var settingsIcons = {
	hideCursorInPenMode: MouseOff,
	penPressureCurve: Spline,
	autoNamerTemplate: Tag,
	autoNamerSectionTemplate: Tag,
	autoNamerDetailsTemplate: Tag,
	autoNamerTreeNodeTemplate: Tag,
	autoSaveWhenClose: HardDriveDownload,
	autoSave: HardDrive,
	autoSaveInterval: Hourglass,
	autoBackup: Database,
	autoBackupInterval: Hourglass,
	autoBackupLimitCount: FileStack,
	autoBackupCustomPath: Folder,
	autoBackupCustomPath2: Folder,
	autoBackupStrategy: ListTree,
	mouseRightDragBackground: MouseRight,
	mouseLeftMode: MouseLeft,
	doubleClickEmptySpaceAction: MousePointerClick,
	enableDragAutoAlign: AlignStartVertical,
	reverseTreeMoveMode: Move,
	uiScalePercent: Scaling,
	mouseWheelMode: LoaderPinwheel,
	mouseWheelModeReverse: ArrowUpDown,
	mouseWheelWithShiftMode: LoaderPinwheel,
	mouseWheelWithShiftModeReverse: ArrowUpDown,
	mouseWheelWithCtrlMode: LoaderPinwheel,
	mouseWheelWithCtrlModeReverse: ArrowUpDown,
	mouseWheelWithAltMode: LoaderPinwheel,
	mouseWheelWithAltModeReverse: ArrowUpDown,
	hideArrowWhenPointingToConnectPoint: CircleDot,
	doubleClickMiddleMouseButton: Circle,
	doubleClickMiddleMouseButtonOnEntity: Circle,
	mouseSideWheelMode: HandGrab,
	macMouseWheelIsSmoothed: Mouse,
	enableWindowsTouchPad: Hand,
	macTrackpadAndMouseWheelDifference: Hand,
	macTrackpadScaleSensitivity: HandMetal,
	macEnableControlToCut: ChevronUp,
	allowGlobalHotKeys: Keyboard,
	enableSpaceKeyMouseLeftDrag: Space,
	cameraFollowsSelectedNodeOnArrowKeys: Crosshair,
	moveAmplitude: Move,
	moveFriction: Move,
	scaleExponent: ScanEye,
	cameraZoomInLimitBehavior: ZoomIn,
	cameraZoomOutLimitBehavior: ZoomOut,
	cameraResetViewPaddingRate: Fullscreen,
	cameraResetMaxScale: Fullscreen,
	scaleCameraByMouseLocation: ScanEye,
	cameraKeyboardScaleRate: ScanEye,
	rectangleSelectWhenRight: SquareArrowDownRight,
	rectangleSelectWhenLeft: SquareArrowUpLeft,
	textNodeStartEditMode: ListRestart,
	textNodeContentLineBreak: ListEnd,
	textNodeExitEditMode: ListCheck,
	textNodeExitEditModeOnWheel: LoaderPinwheel,
	textNodeSelectAllWhenStartEditByMouseClick: TextCursorInput,
	textNodeSelectAllWhenStartEditByKeyboard: TextCursorInput,
	textNodeBackspaceDeleteWhenEmpty: Delete,
	textNodeBigContentThresholdWhenPaste: ArrowDownNarrowWide,
	textNodePasteSizeAdjustMode: Scaling,
	textNodeManualDefaultCharWidth: Scaling,
	allowAddCycleEdge: RotateCw,
	enableDragNodeShakeDetachFromEdge: Unlink,
	enableDragEdgeRotateStructure: SplinePointer,
	enableCtrlWheelRotateStructure: RefreshCcw,
	autoLayoutWhenTreeGenerate: ListTree,
	autoLayoutWhenSectionCollapseToggle: ListTree,
	enableTreeGenerateConnectByProbe: ArrowRightFromLine,
	treeGenerateInheritParentColor: Palette,
	enableTabGenerateNodeInInput: Keyboard,
	enableBackslashGenerateNodeInInput: Keyboard,
	gamepadDeadzone: Skull,
	historySize: Undo,
	clipboardPasteMode: Clipboard,
	resizePastedImages: ImageMinus,
	compressImageToWebp: Palette,
	webpQuality: Percent,
	compressImageToBlackAndWhite: Contrast,
	blackAndWhiteThreshold: Gauge,
	wrapImageInGroup: SquareDashed,
	maxPastedImageSize: ImageUpscale,
	autoRefreshStageByMouseAction: RefreshCcwDot,
	isPauseRenderWhenManipulateOvertime: Hourglass,
	pauseRenderWhenTabUnfocused: Pause,
	renderOverTimeWhenNoManipulateTime: Hourglass,
	ignoreTextNodeTextRenderLessThanFontSize: ScanText,
	textIntegerLocationAndSizeRender: WholeWord,
	antialiasing: Calculator,
	defaultFontFamily: CaseSensitive,
	compatibilityMode: Turtle,
	isEnableEntityCollision: Ungroup,
	language: Languages,
	showTipsOnUI: AppWindow,
	useNativeTitleBar: AppWindowMac,
	isClassroomMode: Presentation,
	viewerMode: Eye,
	showQuickSettingsToolbar: PanelRightOpen,
	showRecentFilesThumbnails: FileImage,
	windowBackgroundAlpha: PictureInPicture2,
	windowBackgroundOpacityAfterOpenClickThrough: PictureInPicture2,
	windowBackgroundOpacityAfterCloseClickThrough: PictureInPicture2,
	isRenderCenterPointer: Crosshair,
	centerCrosshairColor: Palette,
	centerCrosshairShape: Shapes,
	centerCrosshairAlpha: Blend,
	showBackgroundHorizontalLines: TextAlignJustify,
	showBackgroundVerticalLines: Tally4,
	showBackgroundDots: Grip,
	showBackgroundCartesian: Move3d,
	enableTagTextNodesBigDisplay: Tag,
	forceHideTextNodeBorder: Square,
	textNodeInitBorderStyle: SquareDashed,
	newNodeScaleByCamera: Scaling,
	newNodeScaleByCameraOffset: Scaling,
	showTreeDirectionHint: TrendingUpDown,
	lineStyle: Spline,
	sectionBitTitleRenderType: SquareM,
	sectionBigTitleThresholdRatio: Ratio,
	sectionBigTitleCameraScaleThreshold: ScanEye,
	sectionBigTitleOpacity: Blend,
	hideSectionContentsWhenBigTitleActive: Layers,
	sectionBackgroundFillMode: Layers,
	sectionInitBorderStyle: SquareDashed,
	autoEnterSectionEditMode: SquarePen,
	nodeDetailsPanel: AppWindow,
	alwaysShowDetails: ListCollapse,
	entityDetailsFontSize: CaseSensitive,
	entityDetailsLinesLimit: ArrowDownNarrowWide,
	entityDetailsWidthLimit: Space,
	showDebug: Bug,
	protectingPrivacy: VenetianMask,
	protectingPrivacyMode: VenetianMask,
	windowCollapsingWidth: MoveHorizontal,
	windowCollapsingHeight: MoveVertical,
	autoAdjustLineEndpointsByMouseTrack: LineSquiggle,
	autoAdjustLineEndpointsWhenRightDragToBlank: Spline,
	enableRightClickConnect: MousePointerClick,
	rightClickConnectEdgeType: Spline,
	defaultEdgeLineType: Slash,
	defaultEdgeArrowType: ArrowRight,
	isStealthModeEnabled: Crosshair,
	stealthModeScopeRadius: ScanEye,
	stealthModeReverseMask: CircleDot,
	clearHistoryWhenManualSave: Undo,
	historyManagerMode: Undo,
	soundPitchVariationRange: ListMusic,
	textNodeAutoFormatTreeWhenInput: ListTree,
	treeGenerateCameraBehavior: Fullscreen,
	autoImportTxtFileWhenOpenPrg: File,
	imageImportOrder: ArrowDownNarrowWide,
	stealthModeMaskShape: Pentagon,
	themeMode: SunMoon,
	lightTheme: Sun,
	darkTheme: Moon,
	arrowKeySelectOnlyInViewport: ScanEye,
	enableAutoEdgeWidth: Minus,
	showKeyBindHint: Lightbulb,
	showEditModeHint: MessageSquareText,
	textNodeEditModeOutlineOpacity: SquareDashed,
	colorPanelMouseEnterPreview: Mouse,
	enableOCR: ScanText,
	maxFps: Timer,
	maxFpsUnfocused: Timer,
	aiContextWindow: Gauge,
	aiAutoApproveMcpTools: ShieldCheck
};
//#endregion
//#region src/core/service/QuickSettingsManager.tsx
var QuickSettingsManager;
(function(_QuickSettingsManager) {
	let store;
	/**
	* 默认的快捷设置项列表（8个布尔类型的设置项）
	*/
	const DEFAULT_QUICK_SETTINGS = [
		{ settingKey: "isStealthModeEnabled" },
		{ settingKey: "stealthModeReverseMask" },
		{ settingKey: "forceHideTextNodeBorder" },
		{ settingKey: "alwaysShowDetails" },
		{ settingKey: "showDebug" },
		{ settingKey: "enableDragAutoAlign" },
		{ settingKey: "reverseTreeMoveMode" },
		{ settingKey: "textIntegerLocationAndSizeRender" }
	];
	async function init() {
		store = await createStore$1("quick-settings.json");
		if ((await getQuickSettings()).length === 0) await setQuickSettings(DEFAULT_QUICK_SETTINGS);
		await store.save();
	}
	_QuickSettingsManager.init = init;
	async function getQuickSettings() {
		return await store.get("quickSettings") || [];
	}
	_QuickSettingsManager.getQuickSettings = getQuickSettings;
	async function setQuickSettings(items) {
		await store.set("quickSettings", items);
		await store.save();
	}
	_QuickSettingsManager.setQuickSettings = setQuickSettings;
	async function addQuickSetting(item) {
		const existingItems = await getQuickSettings();
		if (!existingItems.some((it) => it.settingKey === item.settingKey)) {
			existingItems.push(item);
			await setQuickSettings(existingItems);
		}
	}
	_QuickSettingsManager.addQuickSetting = addQuickSetting;
	async function removeQuickSetting(settingKey) {
		await setQuickSettings((await getQuickSettings()).filter((it) => it.settingKey !== settingKey));
	}
	_QuickSettingsManager.removeQuickSetting = removeQuickSetting;
	async function reorderQuickSettings(newOrder) {
		await setQuickSettings(newOrder);
	}
	_QuickSettingsManager.reorderQuickSettings = reorderQuickSettings;
	/**
	* 解包 Zod schema（处理 ZodDefault / ZodOptional 包装）
	*/
	function unwrapSchema(schema) {
		if (schema instanceof ZodDefault) return unwrapSchema(schema._def.innerType);
		if (schema instanceof ZodOptional) return unwrapSchema(schema._def.innerType);
		return schema;
	}
	function getSettingType(settingKey) {
		const schema = settingsSchema.shape[settingKey];
		if (!schema) return "unknown";
		const inner = unwrapSchema(schema);
		if (inner instanceof ZodBoolean) return "boolean";
		if (inner instanceof ZodUnion) return "enum";
		if (inner instanceof ZodNumber) return "number";
		return "unknown";
	}
	_QuickSettingsManager.getSettingType = getSettingType;
	function isValidBooleanSetting(settingKey) {
		return getSettingType(settingKey) === "boolean";
	}
	_QuickSettingsManager.isValidBooleanSetting = isValidBooleanSetting;
	function isValidEnumSetting(settingKey) {
		return getSettingType(settingKey) === "enum";
	}
	_QuickSettingsManager.isValidEnumSetting = isValidEnumSetting;
	function isValidNumberSetting(settingKey) {
		return getSettingType(settingKey) === "number";
	}
	_QuickSettingsManager.isValidNumberSetting = isValidNumberSetting;
	function isValidQuickSetting(settingKey) {
		if (getSettingType(settingKey) === "unknown") return false;
		return settingKey in settingsIcons;
	}
	_QuickSettingsManager.isValidQuickSetting = isValidQuickSetting;
	function getAllAvailableBooleanSettings() {
		const schema = settingsSchema.shape;
		return Object.keys(schema).filter((key) => isValidBooleanSetting(key));
	}
	_QuickSettingsManager.getAllAvailableBooleanSettings = getAllAvailableBooleanSettings;
	function getAllAvailableSettings() {
		const schema = settingsSchema.shape;
		return Object.keys(schema).filter((key) => isValidQuickSetting(key));
	}
	_QuickSettingsManager.getAllAvailableSettings = getAllAvailableSettings;
	function getEnumOptions(settingKey) {
		const schema = settingsSchema.shape[settingKey];
		if (!schema) return [];
		const inner = unwrapSchema(schema);
		if (!(inner instanceof ZodUnion)) return [];
		return inner._def.options.map((opt) => opt._def.values[0]);
	}
	_QuickSettingsManager.getEnumOptions = getEnumOptions;
	function getNumberRange(settingKey) {
		const schema = settingsSchema.shape[settingKey];
		if (!schema) return {
			min: null,
			max: null,
			step: .01,
			hasRange: false
		};
		const inner = unwrapSchema(schema);
		if (!(inner instanceof ZodNumber)) return {
			min: null,
			max: null,
			step: .01,
			hasRange: false
		};
		const bag = inner._zod?.bag ?? {};
		const min = bag.minimum ?? null;
		const max = bag.maximum ?? null;
		return {
			min,
			max,
			step: bag.format === "safeint" ? 1 : .01,
			hasRange: min !== null && max !== null
		};
	}
	_QuickSettingsManager.getNumberRange = getNumberRange;
})(QuickSettingsManager || (QuickSettingsManager = {}));
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-compose-ref_8d4ebc958ddbd125c5bf83db2f1688b3/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef(refs[i], null);
			}
		};
	};
}
function useComposedRefs(...refs) {
	return import_react.useCallback(composeRefs(...refs), refs);
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.14_react@19.2.7/node_modules/@radix-ui/react-slot/dist/index.mjs
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use$2 = import_react[" use ".trim().toString()];
function isPromiseLike$2(value) {
	return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
	return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike$2(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot$1(ownerName) {
	const SlotClone = /* @__PURE__ */ createSlotClone$1(ownerName);
	const Slot2 = import_react.forwardRef((props, forwardedRef) => {
		let { children, ...slotProps } = props;
		if (isLazyComponent(children) && typeof use$2 === "function") children = use$2(children._payload);
		const childrenArray = import_react.Children.toArray(children);
		const slottable = childrenArray.find(isSlottable$1);
		if (slottable) {
			const newElement = slottable.props.children;
			const newChildren = childrenArray.map((child) => {
				if (child === slottable) {
					if (import_react.Children.count(newElement) > 1) return import_react.Children.only(null);
					return import_react.isValidElement(newElement) ? newElement.props.children : null;
				} else return child;
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, {
				...slotProps,
				ref: forwardedRef,
				children: import_react.isValidElement(newElement) ? import_react.cloneElement(newElement, void 0, newChildren) : null
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, {
			...slotProps,
			ref: forwardedRef,
			children
		});
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
var Slot$4 = /* @__PURE__ */ createSlot$1("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone$1(ownerName) {
	const SlotClone = import_react.forwardRef((props, forwardedRef) => {
		let { children, ...slotProps } = props;
		if (isLazyComponent(children) && typeof use$2 === "function") children = use$2(children._payload);
		if (import_react.isValidElement(children)) {
			const childrenRef = getElementRef$2(children);
			const props2 = mergeProps$1(slotProps, children.props);
			if (children.type !== import_react.Fragment) props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
			return import_react.cloneElement(children, props2);
		}
		return import_react.Children.count(children) > 1 ? import_react.Children.only(null) : null;
	});
	SlotClone.displayName = `${ownerName}.SlotClone`;
	return SlotClone;
}
var SLOTTABLE_IDENTIFIER$1 = Symbol("radix.slottable");
function isSlottable$1(child) {
	return import_react.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER$1;
}
function mergeProps$1(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
function getElementRef$2(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region ../node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
/**
* Copyright 2022 Joe Bell. All rights reserved.
*
* This file is licensed to you under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with the
* License. You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/ var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
var cx = clsx;
var cva = (base, config) => (props) => {
	var _config_compoundVariants;
	if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
	const { variants, defaultVariants } = config;
	const getVariantClassNames = Object.keys(variants).map((variant) => {
		const variantProp = props === null || props === void 0 ? void 0 : props[variant];
		const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
		if (variantProp === null) return null;
		const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
		return variants[variant][variantKey];
	});
	const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
		let [key, value] = param;
		if (value === void 0) return acc;
		acc[key] = value;
		return acc;
	}, {});
	return cx(base, getVariantClassNames, config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
		let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
		return Object.entries(compoundVariantOptions).every((param) => {
			let [key, value] = param;
			return Array.isArray(value) ? value.includes({
				...defaultVariants,
				...propsWithoutUndefined
			}[key]) : {
				...defaultVariants,
				...propsWithoutUndefined
			}[key] === value;
		}) ? [
			...acc,
			cvClass,
			cvClassName
		] : acc;
	}, []), props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
//#endregion
//#region src/utils/cn.tsx
/**
* 将多个 tailwindcss 的 class 名合并为一个字符串
* @param inputs
* @returns
*/
var cn = (...inputs) => {
	return twMerge(clsx(inputs));
};
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
			destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot$4 : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
typeof window !== "undefined" && window.document && window.document.createElement;
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-context@1.1_0d68f911224a04975a0f1034803cab4b/node_modules/@radix-ui/react-context/dist/index.mjs
function createContext2(rootComponentName, defaultContext) {
	const Context = import_react.createContext(defaultContext);
	const Provider = (props) => {
		const { children, ...context } = props;
		const value = import_react.useMemo(() => context, Object.values(context));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
			value,
			children
		});
	};
	Provider.displayName = rootComponentName + "Provider";
	function useContext2(consumerName) {
		const context = import_react.useContext(Context);
		if (context) return context;
		if (defaultContext !== void 0) return defaultContext;
		throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
	}
	return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = import_react.createContext(defaultContext);
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = (props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = import_react.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
				value,
				children
			});
		};
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope) {
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = import_react.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		return [Provider, useContext2];
	}
	const createScope = () => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return import_react.createContext(defaultContext);
		});
		return function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return import_react.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		};
	};
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = () => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return import_react.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		};
	};
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-layout-_5e626f9674b1e7d83ed984620465dbe6/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? import_react.useLayoutEffect : () => {};
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-control_b811159ace60e612a085717f1479d78b/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var useInsertionEffect = import_react[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = () => {}, caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	const value = isControlled ? prop : uncontrolledProp;
	{
		const isControlledRef = import_react.useRef(prop !== void 0);
		import_react.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	return [value, import_react.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = import_react.useState(defaultProp);
	const prevValueRef = import_react.useRef(value);
	const onChangeRef = import_react.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	import_react.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
function isFunction(value) {
	return typeof value === "function";
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-previou_f59bc615cd0bb5654f2da08a2895c24a/node_modules/@radix-ui/react-use-previous/dist/index.mjs
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		previous: value
	});
	return import_react.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-size@1._d2b27dd2eff29dc941a85d080140d930/node_modules/@radix-ui/react-use-size/dist/index.mjs
function useSize(element) {
	const [size, setSize] = import_react.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width;
				let height;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry["borderBoxSize"];
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width = borderSize["inlineSize"];
					height = borderSize["blockSize"];
				} else {
					width = element.offsetWidth;
					height = element.offsetHeight;
				}
				setSize({
					width,
					height
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => resizeObserver.unobserve(element);
		} else setSize(void 0);
	}, [element]);
	return size;
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@19.2.14_react@19.2.7/node_modules/@radix-ui/react-slot/dist/index.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
	const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
	const Slot2 = import_react.forwardRef((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		const childrenArray = import_react.Children.toArray(children);
		const slottable = childrenArray.find(isSlottable);
		if (slottable) {
			const newElement = slottable.props.children;
			const newChildren = childrenArray.map((child) => {
				if (child === slottable) {
					if (import_react.Children.count(newElement) > 1) return import_react.Children.only(null);
					return import_react.isValidElement(newElement) ? newElement.props.children : null;
				} else return child;
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, {
				...slotProps,
				ref: forwardedRef,
				children: import_react.isValidElement(newElement) ? import_react.cloneElement(newElement, void 0, newChildren) : null
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotClone, {
			...slotProps,
			ref: forwardedRef,
			children
		});
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
var Slot$3 = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
	const SlotClone = import_react.forwardRef((props, forwardedRef) => {
		const { children, ...slotProps } = props;
		if (import_react.isValidElement(children)) {
			const childrenRef = getElementRef$1(children);
			const props2 = mergeProps(slotProps, children.props);
			if (children.type !== import_react.Fragment) props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
			return import_react.cloneElement(children, props2);
		}
		return import_react.Children.count(children) > 1 ? import_react.Children.only(null) : null;
	});
	SlotClone.displayName = `${ownerName}.SlotClone`;
	return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
	const Slottable2 = ({ children }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	};
	Slottable2.displayName = `${ownerName}.Slottable`;
	Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
	return Slottable2;
}
function isSlottable(child) {
	return import_react.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
function getElementRef$1(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-primitive@2_09e6e0ccf209aa4bd9af72ae117fe802/node_modules/@radix-ui/react-primitive/dist/index.mjs
var Primitive$1 = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) import_react_dom.flushSync(() => target.dispatchEvent(event));
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-switch@1.2._a76824b15b11898d0912c422600b7d91/node_modules/@radix-ui/react-switch/dist/index.mjs
var SWITCH_NAME = "Switch";
var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, name, checked: checkedProp, defaultChecked, required, disabled, value = "on", onCheckedChange, form, ...switchProps } = props;
	const [button, setButton] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
	const hasConsumerStoppedPropagationRef = import_react.useRef(false);
	const isFormControl = button ? form || !!button.closest("form") : true;
	const [checked, setChecked] = useControllableState({
		prop: checkedProp,
		defaultProp: defaultChecked ?? false,
		onChange: onCheckedChange,
		caller: SWITCH_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SwitchProvider, {
		scope: __scopeSwitch,
		checked,
		disabled,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
			type: "button",
			role: "switch",
			"aria-checked": checked,
			"aria-required": required,
			"data-state": getState$1(checked),
			"data-disabled": disabled ? "" : void 0,
			disabled,
			value,
			...switchProps,
			ref: composedRefs,
			onClick: composeEventHandlers(props.onClick, (event) => {
				setChecked((prevChecked) => !prevChecked);
				if (isFormControl) {
					hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
					if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
				}
			})
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchBubbleInput, {
			control: button,
			bubbles: !hasConsumerStoppedPropagationRef.current,
			name,
			value,
			checked,
			required,
			disabled,
			form,
			style: { transform: "translateX(-100%)" }
		})]
	});
});
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME$1 = "SwitchThumb";
var SwitchThumb = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, ...thumbProps } = props;
	const context = useSwitchContext(THUMB_NAME$1, __scopeSwitch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		"data-state": getState$1(context.checked),
		"data-disabled": context.disabled ? "" : void 0,
		...thumbProps,
		ref: forwardedRef
	});
});
SwitchThumb.displayName = THUMB_NAME$1;
var BUBBLE_INPUT_NAME$2 = "SwitchBubbleInput";
var SwitchBubbleInput = import_react.forwardRef(({ __scopeSwitch, control, checked, bubbles = true, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(ref, forwardedRef);
	const prevChecked = usePrevious(checked);
	const controlSize = useSize(control);
	import_react.useEffect(() => {
		const input = ref.current;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		if (prevChecked !== checked && setChecked) {
			const event = new Event("click", { bubbles });
			setChecked.call(input, checked);
			input.dispatchEvent(event);
		}
	}, [
		prevChecked,
		checked,
		bubbles
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "checkbox",
		"aria-hidden": true,
		defaultChecked: checked,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0
		}
	});
});
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME$2;
function getState$1(checked) {
	return checked ? "checked" : "unchecked";
}
var Root$7 = Switch$1;
var Thumb$1 = SwitchThumb;
//#endregion
//#region src/components/ui/switch.tsx
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$7, {
		"data-slot": "switch",
		className: cn("data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 shadow-xs peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb$1, {
			"data-slot": "switch-thumb",
			className: cn("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
		})
	});
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-collection@_4fb09693843e1dddd86a3a2e9767284a/node_modules/@radix-ui/react-collection/dist/index.mjs
function createCollection(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	});
	const CollectionProvider = (props) => {
		const { scope, children } = props;
		const ref = import_react.useRef(null);
		const itemMap = import_react.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			scope,
			itemMap,
			collectionRef: ref,
			children
		});
	};
	CollectionProvider.displayName = PROVIDER_NAME;
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionSlotImpl, {
			ref: useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef),
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = import_react.useRef(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context = useCollectionContext(ITEM_SLOT_NAME, scope);
		import_react.useEffect(() => {
			context.itemMap.set(ref, {
				ref,
				...itemData
			});
			return () => void context.itemMap.delete(ref);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useCollection(scope) {
		const context = useCollectionContext(name + "CollectionConsumer", scope);
		return import_react.useCallback(() => {
			const collectionNode = context.collectionRef.current;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
		}, [context.collectionRef, context.itemMap]);
	}
	return [
		{
			Provider: CollectionProvider,
			Slot: CollectionSlot,
			ItemSlot: CollectionItemSlot
		},
		useCollection,
		createCollectionScope
	];
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-id@1.1.1_@types+react@19.2.14_react@19.2.7/node_modules/@radix-ui/react-id/dist/index.mjs
var useReactId = import_react[" useId ".trim().toString()] || (() => void 0);
var count$1 = 0;
function useId(deterministicId) {
	const [id, setId] = import_react.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count$1++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-callbac_c3a44e8d92fdae520f880eb4c04ae39d/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
function useCallbackRef$1(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-direction@1_98c2493bcd84dd5b7d27cb152366d4f3/node_modules/@radix-ui/react-direction/dist/index.mjs
var DirectionContext = import_react.createContext(void 0);
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-roving-focu_9d797d2bb0e1cabb88451b302d91a28f/node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS$1 = {
	bubbles: false,
	cancelable: true
};
var GROUP_NAME$3 = "RovingFocusGroup";
var [Collection$3, useCollection$3, createCollectionScope$3] = createCollection(GROUP_NAME$3);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME$3, [createCollectionScope$3]);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$3);
var RovingFocusGroup = import_react.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.Provider, {
		scope: props.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.Slot, {
			scope: props.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroupImpl, {
				...props,
				ref: forwardedRef
			})
		})
	});
});
RovingFocusGroup.displayName = GROUP_NAME$3;
var RovingFocusGroupImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const direction = useDirection(dir);
	const [currentTabStopId, setCurrentTabStopId] = useControllableState({
		prop: currentTabStopIdProp,
		defaultProp: defaultCurrentTabStopId ?? null,
		onChange: onCurrentTabStopIdChange,
		caller: GROUP_NAME$3
	});
	const [isTabbingBackOut, setIsTabbingBackOut] = import_react.useState(false);
	const handleEntryFocus = useCallbackRef$1(onEntryFocus);
	const getItems = useCollection$3(__scopeRovingFocusGroup);
	const isClickFocusRef = import_react.useRef(false);
	const [focusableItemsCount, setFocusableItemsCount] = import_react.useState(0);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
			return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
		}
	}, [handleEntryFocus]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusProvider, {
		scope: __scopeRovingFocusGroup,
		orientation,
		dir: direction,
		loop,
		currentTabStopId,
		onItemFocus: import_react.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
		onItemShiftTab: import_react.useCallback(() => setIsTabbingBackOut(true), []),
		onFocusableItemAdd: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), []),
		onFocusableItemRemove: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
			tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
			"data-orientation": orientation,
			...groupProps,
			ref: composedRefs,
			style: {
				outline: "none",
				...props.style
			},
			onMouseDown: composeEventHandlers(props.onMouseDown, () => {
				isClickFocusRef.current = true;
			}),
			onFocus: composeEventHandlers(props.onFocus, (event) => {
				const isKeyboardFocus = !isClickFocusRef.current;
				if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
					const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS$1);
					event.currentTarget.dispatchEvent(entryFocusEvent);
					if (!entryFocusEvent.defaultPrevented) {
						const items = getItems().filter((item) => item.focusable);
						focusFirst$2([
							items.find((item) => item.active),
							items.find((item) => item.id === currentTabStopId),
							...items
						].filter(Boolean).map((item) => item.ref.current), preventScrollOnEntryFocus);
					}
				}
				isClickFocusRef.current = false;
			}),
			onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
		})
	});
});
var ITEM_NAME$4 = "RovingFocusGroupItem";
var RovingFocusGroupItem = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
	const autoId = useId();
	const id = tabStopId || autoId;
	const context = useRovingFocusContext(ITEM_NAME$4, __scopeRovingFocusGroup);
	const isCurrentTabStop = context.currentTabStopId === id;
	const getItems = useCollection$3(__scopeRovingFocusGroup);
	const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
	import_react.useEffect(() => {
		if (focusable) {
			onFocusableItemAdd();
			return () => onFocusableItemRemove();
		}
	}, [
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.ItemSlot, {
		scope: __scopeRovingFocusGroup,
		id,
		focusable,
		active,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
			tabIndex: isCurrentTabStop ? 0 : -1,
			"data-orientation": context.orientation,
			...itemProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!focusable) event.preventDefault();
				else context.onItemFocus(id);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === "Tab" && event.shiftKey) {
					context.onItemShiftTab();
					return;
				}
				if (event.target !== event.currentTarget) return;
				const focusIntent = getFocusIntent(event, context.orientation, context.dir);
				if (focusIntent !== void 0) {
					if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
					event.preventDefault();
					let candidateNodes = getItems().filter((item) => item.focusable).map((item) => item.ref.current);
					if (focusIntent === "last") candidateNodes.reverse();
					else if (focusIntent === "prev" || focusIntent === "next") {
						if (focusIntent === "prev") candidateNodes.reverse();
						const currentIndex = candidateNodes.indexOf(event.currentTarget);
						candidateNodes = context.loop ? wrapArray$2(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
					}
					setTimeout(() => focusFirst$2(candidateNodes));
				}
			}),
			children: typeof children === "function" ? children({
				isCurrentTabStop,
				hasTabStop: currentTabStopId != null
			}) : children
		})
	});
});
RovingFocusGroupItem.displayName = ITEM_NAME$4;
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== "rtl") return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
	if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst$2(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function wrapArray$2(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root$6 = RovingFocusGroup;
var Item$1 = RovingFocusGroupItem;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-separator@1_6f7d5dfdac93a29b994219c165aeab8b/node_modules/@radix-ui/react-separator/dist/index.mjs
var NAME$4 = "Separator";
var DEFAULT_ORIENTATION$1 = "horizontal";
var ORIENTATIONS$1 = ["horizontal", "vertical"];
var Separator$3 = import_react.forwardRef((props, forwardedRef) => {
	const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION$1, ...domProps } = props;
	const orientation = isValidOrientation$1(orientationProp) ? orientationProp : DEFAULT_ORIENTATION$1;
	const semanticProps = decorative ? { role: "none" } : {
		"aria-orientation": orientation === "vertical" ? orientation : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		"data-orientation": orientation,
		...semanticProps,
		...domProps,
		ref: forwardedRef
	});
});
Separator$3.displayName = NAME$4;
function isValidOrientation$1(orientation) {
	return ORIENTATIONS$1.includes(orientation);
}
var Root$5 = Separator$3;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-toggle@1.1._dff5d789a9c4f2cb53dcdc079af5435e/node_modules/@radix-ui/react-toggle/dist/index.mjs
var NAME$3 = "Toggle";
var Toggle = import_react.forwardRef((props, forwardedRef) => {
	const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;
	const [pressed, setPressed] = useControllableState({
		prop: pressedProp,
		onChange: onPressedChange,
		defaultProp: defaultPressed ?? false,
		caller: NAME$3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
		type: "button",
		"aria-pressed": pressed,
		"data-state": pressed ? "on" : "off",
		"data-disabled": props.disabled ? "" : void 0,
		...buttonProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => {
			if (!props.disabled) setPressed(!pressed);
		})
	});
});
Toggle.displayName = NAME$3;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-toggle-grou_67be5b56b565ffded4942ad0ff14ef83/node_modules/@radix-ui/react-toggle-group/dist/index.mjs
var TOGGLE_GROUP_NAME$1 = "ToggleGroup";
var [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME$1, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope$2 = createRovingFocusGroupScope();
var ToggleGroup = import_react.forwardRef((props, forwardedRef) => {
	const { type, ...toggleGroupProps } = props;
	if (type === "single") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplSingle, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	if (type === "multiple") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImplMultiple, {
		...toggleGroupProps,
		ref: forwardedRef
	});
	throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME$1}\``);
});
ToggleGroup.displayName = TOGGLE_GROUP_NAME$1;
var [ToggleGroupValueProvider, useToggleGroupValueContext] = createToggleGroupContext(TOGGLE_GROUP_NAME$1);
var ToggleGroupImplSingle = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupSingleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? "",
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME$1
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "single",
		value: import_react.useMemo(() => value ? [value] : [], [value]),
		onItemActivate: setValue,
		onItemDeactivate: import_react.useCallback(() => setValue(""), [setValue]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupSingleProps,
			ref: forwardedRef
		})
	});
});
var ToggleGroupImplMultiple = import_react.forwardRef((props, forwardedRef) => {
	const { value: valueProp, defaultValue, onValueChange = () => {}, ...toggleGroupMultipleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? [],
		onChange: onValueChange,
		caller: TOGGLE_GROUP_NAME$1
	});
	const handleButtonActivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]), [setValue]);
	const handleButtonDeactivate = import_react.useCallback((itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)), [setValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupValueProvider, {
		scope: props.__scopeToggleGroup,
		type: "multiple",
		value,
		onItemActivate: handleButtonActivate,
		onItemDeactivate: handleButtonDeactivate,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupImpl, {
			...toggleGroupMultipleProps,
			ref: forwardedRef
		})
	});
});
ToggleGroup.displayName = TOGGLE_GROUP_NAME$1;
var [ToggleGroupContext, useToggleGroupContext] = createToggleGroupContext(TOGGLE_GROUP_NAME$1);
var ToggleGroupImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, disabled = false, rovingFocus = true, orientation, dir, loop = true, ...toggleGroupProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope$2(__scopeToggleGroup);
	const direction = useDirection(dir);
	const commonProps = {
		role: "group",
		dir: direction,
		...toggleGroupProps
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext, {
		scope: __scopeToggleGroup,
		rovingFocus,
		disabled,
		children: rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$6, {
			asChild: true,
			...rovingFocusGroupScope,
			orientation,
			dir: direction,
			loop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				...commonProps,
				ref: forwardedRef
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
			...commonProps,
			ref: forwardedRef
		})
	});
});
var ITEM_NAME$3 = "ToggleGroupItem";
var ToggleGroupItem = import_react.forwardRef((props, forwardedRef) => {
	const valueContext = useToggleGroupValueContext(ITEM_NAME$3, props.__scopeToggleGroup);
	const context = useToggleGroupContext(ITEM_NAME$3, props.__scopeToggleGroup);
	const rovingFocusGroupScope = useRovingFocusGroupScope$2(props.__scopeToggleGroup);
	const pressed = valueContext.value.includes(props.value);
	const disabled = context.disabled || props.disabled;
	const commonProps = {
		...props,
		pressed,
		disabled
	};
	const ref = import_react.useRef(null);
	return context.rovingFocus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: pressed,
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
			...commonProps,
			ref: forwardedRef
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItemImpl, {
		...commonProps,
		ref: forwardedRef
	});
});
ToggleGroupItem.displayName = ITEM_NAME$3;
var ToggleGroupItemImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToggleGroup, value, ...itemProps } = props;
	const valueContext = useToggleGroupValueContext(ITEM_NAME$3, __scopeToggleGroup);
	const singleProps = {
		role: "radio",
		"aria-checked": props.pressed,
		"aria-pressed": void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
		...valueContext.type === "single" ? singleProps : void 0,
		...itemProps,
		ref: forwardedRef,
		onPressedChange: (pressed) => {
			if (pressed) valueContext.onItemActivate(value);
			else valueContext.onItemDeactivate(value);
		}
	});
});
var Root2$3 = ToggleGroup;
var Item2$2 = ToggleGroupItem;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-toolbar@1.1_d4f9c261e7f8b095e6f1a9ba884f01a3/node_modules/@radix-ui/react-toolbar/dist/index.mjs
var TOOLBAR_NAME = "Toolbar";
var [createToolbarContext, createToolbarScope] = createContextScope(TOOLBAR_NAME, [createRovingFocusGroupScope, createToggleGroupScope]);
var useRovingFocusGroupScope$1 = createRovingFocusGroupScope();
var useToggleGroupScope = createToggleGroupScope();
var [ToolbarProvider, useToolbarContext] = createToolbarContext(TOOLBAR_NAME);
var Toolbar$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, orientation = "horizontal", dir, loop = true, ...toolbarProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeToolbar);
	const direction = useDirection(dir);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarProvider, {
		scope: __scopeToolbar,
		orientation,
		dir: direction,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$6, {
			asChild: true,
			...rovingFocusGroupScope,
			orientation,
			dir: direction,
			loop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				role: "toolbar",
				"aria-orientation": orientation,
				dir: direction,
				...toolbarProps,
				ref: forwardedRef
			})
		})
	});
});
Toolbar$1.displayName = TOOLBAR_NAME;
var SEPARATOR_NAME$3 = "ToolbarSeparator";
var ToolbarSeparator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, ...separatorProps } = props;
	const context = useToolbarContext(SEPARATOR_NAME$3, __scopeToolbar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$5, {
		orientation: context.orientation === "horizontal" ? "vertical" : "horizontal",
		...separatorProps,
		ref: forwardedRef
	});
});
ToolbarSeparator.displayName = SEPARATOR_NAME$3;
var BUTTON_NAME = "ToolbarButton";
var ToolbarButton$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, ...buttonProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeToolbar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !props.disabled,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
			type: "button",
			...buttonProps,
			ref: forwardedRef
		})
	});
});
ToolbarButton$1.displayName = BUTTON_NAME;
var LINK_NAME = "ToolbarLink";
var ToolbarLink = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, ...linkProps } = props;
	const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeToolbar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.a, {
			...linkProps,
			ref: forwardedRef,
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === " ") event.currentTarget.click();
			})
		})
	});
});
ToolbarLink.displayName = LINK_NAME;
var TOGGLE_GROUP_NAME = "ToolbarToggleGroup";
var ToolbarToggleGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, ...toggleGroupProps } = props;
	const context = useToolbarContext(TOGGLE_GROUP_NAME, __scopeToolbar);
	const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$3, {
		"data-orientation": context.orientation,
		dir: context.dir,
		...toggleGroupScope,
		...toggleGroupProps,
		ref: forwardedRef,
		rovingFocus: false
	});
});
ToolbarToggleGroup$1.displayName = TOGGLE_GROUP_NAME;
var TOGGLE_ITEM_NAME = "ToolbarToggleItem";
var ToolbarToggleItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeToolbar, ...toggleItemProps } = props;
	const toggleGroupScope = useToggleGroupScope(__scopeToolbar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton$1, {
		asChild: true,
		__scopeToolbar: props.__scopeToolbar,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2$2, {
			...toggleGroupScope,
			...toggleItemProps,
			ref: forwardedRef
		})
	});
});
ToolbarToggleItem$1.displayName = TOGGLE_ITEM_NAME;
var Root4 = Toolbar$1;
var Button = ToolbarButton$1;
var ToggleItem = ToolbarToggleItem$1;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-use-escape-_cb2c772111dd3561ead91adae309c8bd/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
	const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "Escape") onEscapeKeyDown(event);
		};
		ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [onEscapeKeyDown, ownerDocument]);
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-dismissable_79ac7923fbbaa70dde2128695a66e4d1/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = import_react.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = import_react.forwardRef((props, forwardedRef) => {
	const { disableOutsidePointerEvents = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
	const context = import_react.useContext(DismissableLayerContext);
	const [node, setNode] = import_react.useState(null);
	const ownerDocument = node?.ownerDocument ?? globalThis?.document;
	const [, force] = import_react.useState({});
	const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
	const layers = Array.from(context.layers);
	const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
	const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
	const index = node ? layers.indexOf(node) : -1;
	const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
	const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
	const pointerDownOutside = usePointerDownOutside((event) => {
		const target = event.target;
		const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
		if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
		onPointerDownOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	const focusOutside = useFocusOutside((event) => {
		const target = event.target;
		if ([...context.branches].some((branch) => branch.contains(target))) return;
		onFocusOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	useEscapeKeydown((event) => {
		if (!(index === context.layers.size - 1)) return;
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented && onDismiss) {
			event.preventDefault();
			onDismiss();
		}
	}, ownerDocument);
	import_react.useEffect(() => {
		if (!node) return;
		if (disableOutsidePointerEvents) {
			if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
				originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
				ownerDocument.body.style.pointerEvents = "none";
			}
			context.layersWithOutsidePointerEventsDisabled.add(node);
		}
		context.layers.add(node);
		dispatchUpdate();
		return () => {
			if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
		};
	}, [
		node,
		ownerDocument,
		disableOutsidePointerEvents,
		context
	]);
	import_react.useEffect(() => {
		return () => {
			if (!node) return;
			context.layers.delete(node);
			context.layersWithOutsidePointerEventsDisabled.delete(node);
			dispatchUpdate();
		};
	}, [node, context]);
	import_react.useEffect(() => {
		const handleUpdate = () => force({});
		document.addEventListener(CONTEXT_UPDATE, handleUpdate);
		return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		...layerProps,
		ref: composedRefs,
		style: {
			pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
			...props.style
		},
		onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
		onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
	});
});
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = import_react.forwardRef((props, forwardedRef) => {
	const context = import_react.useContext(DismissableLayerContext);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			context.branches.add(node);
			return () => {
				context.branches.delete(node);
			};
		}
	}, [context.branches]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		...props,
		ref: composedRefs
	});
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
	const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
	const isPointerInsideReactTreeRef = import_react.useRef(false);
	const handleClickRef = import_react.useRef(() => {});
	import_react.useEffect(() => {
		const handlePointerDown = (event) => {
			if (event.target && !isPointerInsideReactTreeRef.current) {
				let handleAndDispatchPointerDownOutsideEvent2 = function() {
					handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
				};
				const eventDetail = { originalEvent: event };
				if (event.pointerType === "touch") {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
					ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
				} else handleAndDispatchPointerDownOutsideEvent2();
			} else ownerDocument.removeEventListener("click", handleClickRef.current);
			isPointerInsideReactTreeRef.current = false;
		};
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.current);
		};
	}, [ownerDocument, handlePointerDownOutside]);
	return { onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
	const handleFocusOutside = useCallbackRef$1(onFocusOutside);
	const isFocusInsideReactTreeRef = import_react.useRef(false);
	import_react.useEffect(() => {
		const handleFocus = (event) => {
			if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
		};
		ownerDocument.addEventListener("focusin", handleFocus);
		return () => ownerDocument.removeEventListener("focusin", handleFocus);
	}, [ownerDocument, handleFocusOutside]);
	return {
		onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
		onBlurCapture: () => isFocusInsideReactTreeRef.current = false
	};
}
function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(target, event);
	else target.dispatchEvent(event);
}
//#endregion
//#region ../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp$1(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...padding
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region ../node_modules/.pnpm/@floating-ui+core@1.7.5/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	switch (getAlignment(placement)) {
		case "start":
			coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
			break;
		case "end":
			coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
			break;
	}
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	} : {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$3 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const min$1 = minPadding;
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp$1(min$1, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$2 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(getSide(placement));
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			if (checkMainAxis) {
				const minSide = mainAxis === "y" ? "top" : "left";
				const maxSide = mainAxis === "y" ? "bottom" : "right";
				const min = mainAxisCoord + overflow[minSide];
				const max = mainAxisCoord - overflow[maxSide];
				mainAxisCoord = clamp$1(min, mainAxisCoord, max);
			}
			if (checkCrossAxis) {
				const minSide = crossAxis === "y" ? "top" : "left";
				const maxSide = crossAxis === "y" ? "bottom" : "right";
				const min = crossAxisCoord + overflow[minSide];
				const max = crossAxisCoord - overflow[maxSide];
				crossAxisCoord = clamp$1(min, crossAxisCoord, max);
			}
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: 0,
				crossAxis: 0,
				...rawOffset
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			var _state$middlewareData, _state$middlewareData2;
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const noShift = !state.middlewareData.shift;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) availableWidth = maximumClippingWidth;
			if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				const xMin = max(overflow.left, 0);
				const xMax = max(overflow.right, 0);
				const yMin = max(overflow.top, 0);
				const yMax = max(overflow.bottom, 0);
				if (isYAxis) availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
				else availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region ../node_modules/.pnpm/@floating-ui+utils@0.2.11/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return node.ownerDocument ? node.ownerDocument.body : node.body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region ../node_modules/.pnpm/@floating-ui+dom@1.7.6/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) return false;
	return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement) {
		const win = getWindow(domElement);
		const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetParent && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
	const html = getDocumentElement(element);
	const scroll = getNodeScroll(element);
	const body = element.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(element);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		const visualViewportBased = isWebKit();
		if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	const windowScrollbarX = getWindowScrollBarX(html);
	if (windowScrollbarX <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) width -= clippingStableScrollbarWidth;
	} else if (windowScrollbarX <= SCROLLBAR_MAX) width += windowScrollbarX;
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport") rect = getViewportRect(element, strategy);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
	const parentNode = getParentNode(element);
	if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) return false;
	return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let currentContainingBlockComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		if (!currentNodeIsContaining && computedStyle.position === "fixed") currentContainingBlockComputedStyle = null;
		if (elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode)) result = result.filter((ancestor) => ancestor !== currentNode);
		else currentContainingBlockComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	function setLeftRTLScrollbarOffset() {
		offsets.x = getWindowScrollBarX(documentElement);
	}
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		} else if (documentElement) setLeftRTLScrollbarOffset();
	}
	if (isFixed && !isOffsetParentAnElement && documentElement) setLeftRTLScrollbarOffset();
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) refresh();
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	refresh(true);
	return cleanup;
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update, { passive: true });
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = offset$2;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = shift$2;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = flip$2;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = size$2;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = hide$2;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$2 = arrow$3;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = limitShift$2;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = {
		platform,
		...options
	};
	const platformWithCache = {
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region ../node_modules/.pnpm/@floating-ui+react-dom@2.1._742a720a5438b09002865e43c266a603/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var index = typeof document !== "undefined" ? import_react.useLayoutEffect : function noop() {};
function deepEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && a.toString() === b.toString()) return true;
	let length;
	let i;
	let keys;
	if (a && b && typeof a === "object") {
		if (Array.isArray(a)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key === "_owner" && a.$$typeof) continue;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
	const ref = import_react.useRef(value);
	index(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Provides data to position a floating element.
* @see https://floating-ui.com/docs/useFloating
*/
function useFloating(options) {
	if (options === void 0) options = {};
	const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
	const [data, setData] = import_react.useState({
		x: 0,
		y: 0,
		strategy,
		placement,
		middlewareData: {},
		isPositioned: false
	});
	const [latestMiddleware, setLatestMiddleware] = import_react.useState(middleware);
	if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
	const [_reference, _setReference] = import_react.useState(null);
	const [_floating, _setFloating] = import_react.useState(null);
	const setReference = import_react.useCallback((node) => {
		if (node !== referenceRef.current) {
			referenceRef.current = node;
			_setReference(node);
		}
	}, []);
	const setFloating = import_react.useCallback((node) => {
		if (node !== floatingRef.current) {
			floatingRef.current = node;
			_setFloating(node);
		}
	}, []);
	const referenceEl = externalReference || _reference;
	const floatingEl = externalFloating || _floating;
	const referenceRef = import_react.useRef(null);
	const floatingRef = import_react.useRef(null);
	const dataRef = import_react.useRef(data);
	const hasWhileElementsMounted = whileElementsMounted != null;
	const whileElementsMountedRef = useLatestRef(whileElementsMounted);
	const platformRef = useLatestRef(platform);
	const openRef = useLatestRef(open);
	const update = import_react.useCallback(() => {
		if (!referenceRef.current || !floatingRef.current) return;
		const config = {
			placement,
			strategy,
			middleware: latestMiddleware
		};
		if (platformRef.current) config.platform = platformRef.current;
		computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
			const fullData = {
				...data,
				isPositioned: openRef.current !== false
			};
			if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
				dataRef.current = fullData;
				import_react_dom.flushSync(() => {
					setData(fullData);
				});
			}
		});
	}, [
		latestMiddleware,
		placement,
		strategy,
		platformRef,
		openRef
	]);
	index(() => {
		if (open === false && dataRef.current.isPositioned) {
			dataRef.current.isPositioned = false;
			setData((data) => ({
				...data,
				isPositioned: false
			}));
		}
	}, [open]);
	const isMountedRef = import_react.useRef(false);
	index(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	index(() => {
		if (referenceEl) referenceRef.current = referenceEl;
		if (floatingEl) floatingRef.current = floatingEl;
		if (referenceEl && floatingEl) {
			if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
			update();
		}
	}, [
		referenceEl,
		floatingEl,
		update,
		whileElementsMountedRef,
		hasWhileElementsMounted
	]);
	const refs = import_react.useMemo(() => ({
		reference: referenceRef,
		floating: floatingRef,
		setReference,
		setFloating
	}), [setReference, setFloating]);
	const elements = import_react.useMemo(() => ({
		reference: referenceEl,
		floating: floatingEl
	}), [referenceEl, floatingEl]);
	const floatingStyles = import_react.useMemo(() => {
		const initialStyles = {
			position: strategy,
			left: 0,
			top: 0
		};
		if (!elements.floating) return initialStyles;
		const x = roundByDPR(elements.floating, data.x);
		const y = roundByDPR(elements.floating, data.y);
		if (transform) return {
			...initialStyles,
			transform: "translate(" + x + "px, " + y + "px)",
			...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: x,
			top: y
		};
	}, [
		strategy,
		transform,
		elements.floating,
		data.x,
		data.y
	]);
	return import_react.useMemo(() => ({
		...data,
		update,
		refs,
		elements,
		floatingStyles
	}), [
		data,
		update,
		refs,
		elements,
		floatingStyles
	]);
}
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = (options) => {
	function isRef(value) {
		return {}.hasOwnProperty.call(value, "current");
	}
	return {
		name: "arrow",
		options,
		fn(state) {
			const { element, padding } = typeof options === "function" ? options(state) : options;
			if (element && isRef(element)) {
				if (element.current != null) return arrow$2({
					element: element.current,
					padding
				}).fn(state);
				return {};
			}
			if (element) return arrow$2({
				element,
				padding
			}).fn(state);
			return {};
		}
	};
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = (options, deps) => {
	const result = offset$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = (options, deps) => {
	const result = shift$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = (options, deps) => {
	return {
		fn: limitShift$1(options).fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = (options, deps) => {
	const result = flip$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = (options, deps) => {
	const result = size$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = (options, deps) => {
	const result = hide$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow = (options, deps) => {
	const result = arrow$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-arrow@1.1.7_d62890c567682a598b3e026b4a1be435/node_modules/@radix-ui/react-arrow/dist/index.mjs
var NAME$2 = "Arrow";
var Arrow$1 = import_react.forwardRef((props, forwardedRef) => {
	const { children, width = 10, height = 5, ...arrowProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.svg, {
		...arrowProps,
		ref: forwardedRef,
		width,
		height,
		viewBox: "0 0 30 10",
		preserveAspectRatio: "none",
		children: props.asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "0,0 30,0 15,10" })
	});
});
Arrow$1.displayName = NAME$2;
var Root$4 = Arrow$1;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-popper@1.2._8fba32ba52522a8383d9c6e1d4587da6/node_modules/@radix-ui/react-popper/dist/index.mjs
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
	const { __scopePopper, children } = props;
	const [anchor, setAnchor] = import_react.useState(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperProvider, {
		scope: __scopePopper,
		anchor,
		onAnchorChange: setAnchor,
		children
	});
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME$1 = "PopperAnchor";
var PopperAnchor = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopper, virtualRef, ...anchorProps } = props;
	const context = usePopperContext(ANCHOR_NAME$1, __scopePopper);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const anchorRef = import_react.useRef(null);
	import_react.useEffect(() => {
		const previousAnchor = anchorRef.current;
		anchorRef.current = virtualRef?.current || ref.current;
		if (previousAnchor !== anchorRef.current) context.onAnchorChange(anchorRef.current);
	});
	return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		...anchorProps,
		ref: composedRefs
	});
});
PopperAnchor.displayName = ANCHOR_NAME$1;
var CONTENT_NAME$5 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$5);
var PopperContent = import_react.forwardRef((props, forwardedRef) => {
	const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, updatePositionStrategy = "optimized", onPlaced, ...contentProps } = props;
	const context = usePopperContext(CONTENT_NAME$5, __scopePopper);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const [arrow$4, setArrow] = import_react.useState(null);
	const arrowSize = useSize(arrow$4);
	const arrowWidth = arrowSize?.width ?? 0;
	const arrowHeight = arrowSize?.height ?? 0;
	const desiredPlacement = side + (align !== "center" ? "-" + align : "");
	const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...collisionPaddingProp
	};
	const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	const hasExplicitBoundaries = boundary.length > 0;
	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		altBoundary: hasExplicitBoundaries
	};
	const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
		strategy: "fixed",
		placement: desiredPlacement,
		whileElementsMounted: (...args) => {
			return autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" });
		},
		elements: { reference: context.anchor },
		middleware: [
			offset({
				mainAxis: sideOffset + arrowHeight,
				alignmentAxis: alignOffset
			}),
			avoidCollisions && shift({
				mainAxis: true,
				crossAxis: false,
				limiter: sticky === "partial" ? limitShift() : void 0,
				...detectOverflowOptions
			}),
			avoidCollisions && flip({ ...detectOverflowOptions }),
			size({
				...detectOverflowOptions,
				apply: ({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
					contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
					contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
				}
			}),
			arrow$4 && arrow({
				element: arrow$4,
				padding: arrowPadding
			}),
			transformOrigin({
				arrowWidth,
				arrowHeight
			}),
			hideWhenDetached && hide({
				strategy: "referenceHidden",
				...detectOverflowOptions
			})
		]
	});
	const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
	const handlePlaced = useCallbackRef$1(onPlaced);
	useLayoutEffect2(() => {
		if (isPositioned) handlePlaced?.();
	}, [isPositioned, handlePlaced]);
	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: refs.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...floatingStyles,
			transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: contentZIndex,
			["--radix-popper-transform-origin"]: [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
			...middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: props.dir,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				"data-side": placedSide,
				"data-align": placedAlign,
				...contentProps,
				ref: composedRefs,
				style: {
					...contentProps.style,
					animation: !isPositioned ? "none" : void 0
				}
			})
		})
	});
});
PopperContent.displayName = CONTENT_NAME$5;
var ARROW_NAME$4 = "PopperArrow";
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var PopperArrow = import_react.forwardRef(function PopperArrow2(props, forwardedRef) {
	const { __scopePopper, ...arrowProps } = props;
	const contentContext = useContentContext(ARROW_NAME$4, __scopePopper);
	const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref: contentContext.onArrowChange,
		style: {
			position: "absolute",
			left: contentContext.arrowX,
			top: contentContext.arrowY,
			[baseSide]: 0,
			transformOrigin: {
				top: "",
				right: "0 0",
				bottom: "center 0",
				left: "100% 0"
			}[contentContext.placedSide],
			transform: {
				top: "translateY(100%)",
				right: "translateY(50%) rotate(90deg) translateX(-50%)",
				bottom: `rotate(180deg)`,
				left: "translateY(50%) rotate(-90deg) translateX(50%)"
			}[contentContext.placedSide],
			visibility: contentContext.shouldHideArrow ? "hidden" : void 0
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$4, {
			...arrowProps,
			ref: forwardedRef,
			style: {
				...arrowProps.style,
				display: "block"
			}
		})
	});
});
PopperArrow.displayName = ARROW_NAME$4;
function isNotNull(value) {
	return value !== null;
}
var transformOrigin = (options) => ({
	name: "transformOrigin",
	options,
	fn(data) {
		const { placement, rects, middlewareData } = data;
		const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
		const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
		const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
		const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
		const noArrowAlign = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[placedAlign];
		const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
		const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
		let x = "";
		let y = "";
		if (placedSide === "bottom") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${-arrowHeight}px`;
		} else if (placedSide === "top") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${rects.floating.height + arrowHeight}px`;
		} else if (placedSide === "right") {
			x = `${-arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		} else if (placedSide === "left") {
			x = `${rects.floating.width + arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		}
		return { data: {
			x,
			y
		} };
	}
});
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
var Root2$2 = Popper;
var Anchor = PopperAnchor;
var Content$1 = PopperContent;
var Arrow = PopperArrow;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-portal@1.1._92e223af8b4a901db213297dcfb30a72/node_modules/@radix-ui/react-portal/dist/index.mjs
var PORTAL_NAME$5 = "Portal";
var Portal$4 = import_react.forwardRef((props, forwardedRef) => {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = import_react.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
});
Portal$4.displayName = PORTAL_NAME$5;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-presence@1._b0fb3a84d7d9ee8e6a4b5e4cb53ac68e/node_modules/@radix-ui/react-presence/dist/index.mjs
function useStateMachine(initialState, machine) {
	return import_react.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
var Presence = (props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : import_react.Children.only(children);
	const ref = useComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? import_react.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
	const [node, setNode] = import_react.useState();
	const stylesRef = import_react.useRef(null);
	const prevPresentRef = import_react.useRef(present);
	const prevAnimationNameRef = import_react.useRef("none");
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	import_react.useEffect(() => {
		const currentAnimationName = getAnimationName(stylesRef.current);
		prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) send("MOUNT");
			else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = (event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			};
			const handleAnimationStart = (event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			};
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: import_react.useCallback((node2) => {
			stylesRef.current = node2 ? getComputedStyle(node2) : null;
			setNode(node2);
		}, [])
	};
}
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-visually-hi_e259c0452f588d18e39ec76b2bae3d97/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var VISUALLY_HIDDEN_STYLES = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
});
var NAME$1 = "VisuallyHidden";
var VisuallyHidden = import_react.forwardRef((props, forwardedRef) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		...props,
		ref: forwardedRef,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		}
	});
});
VisuallyHidden.displayName = NAME$1;
var Root$3 = VisuallyHidden;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-tooltip@1.2_c11abd87b741576dd78c968e2f900814/node_modules/@radix-ui/react-tooltip/dist/index.mjs
var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [createPopperScope]);
var usePopperScope$2 = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
	const { __scopeTooltip, delayDuration = DEFAULT_DELAY_DURATION, skipDelayDuration = 300, disableHoverableContent = false, children } = props;
	const isOpenDelayedRef = import_react.useRef(true);
	const isPointerInTransitRef = import_react.useRef(false);
	const skipDelayTimerRef = import_react.useRef(0);
	import_react.useEffect(() => {
		const skipDelayTimer = skipDelayTimerRef.current;
		return () => window.clearTimeout(skipDelayTimer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProviderContextProvider, {
		scope: __scopeTooltip,
		isOpenDelayedRef,
		delayDuration,
		onOpen: import_react.useCallback(() => {
			window.clearTimeout(skipDelayTimerRef.current);
			isOpenDelayedRef.current = false;
		}, []),
		onClose: import_react.useCallback(() => {
			window.clearTimeout(skipDelayTimerRef.current);
			skipDelayTimerRef.current = window.setTimeout(() => isOpenDelayedRef.current = true, skipDelayDuration);
		}, [skipDelayDuration]),
		isPointerInTransitRef,
		onPointerInTransitChange: import_react.useCallback((inTransit) => {
			isPointerInTransitRef.current = inTransit;
		}, []),
		disableHoverableContent,
		children
	});
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
	const { __scopeTooltip, children, open: openProp, defaultOpen, onOpenChange, disableHoverableContent: disableHoverableContentProp, delayDuration: delayDurationProp } = props;
	const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
	const popperScope = usePopperScope$2(__scopeTooltip);
	const [trigger, setTrigger] = import_react.useState(null);
	const contentId = useId();
	const openTimerRef = import_react.useRef(0);
	const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
	const delayDuration = delayDurationProp ?? providerContext.delayDuration;
	const wasOpenDelayedRef = import_react.useRef(false);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: (open2) => {
			if (open2) {
				providerContext.onOpen();
				document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
			} else providerContext.onClose();
			onOpenChange?.(open2);
		},
		caller: TOOLTIP_NAME
	});
	const stateAttribute = import_react.useMemo(() => {
		return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
	}, [open]);
	const handleOpen = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = 0;
		wasOpenDelayedRef.current = false;
		setOpen(true);
	}, [setOpen]);
	const handleClose = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = 0;
		setOpen(false);
	}, [setOpen]);
	const handleDelayedOpen = import_react.useCallback(() => {
		window.clearTimeout(openTimerRef.current);
		openTimerRef.current = window.setTimeout(() => {
			wasOpenDelayedRef.current = true;
			setOpen(true);
			openTimerRef.current = 0;
		}, delayDuration);
	}, [delayDuration, setOpen]);
	import_react.useEffect(() => {
		return () => {
			if (openTimerRef.current) {
				window.clearTimeout(openTimerRef.current);
				openTimerRef.current = 0;
			}
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$2, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContextProvider, {
			scope: __scopeTooltip,
			contentId,
			open,
			stateAttribute,
			trigger,
			onTriggerChange: setTrigger,
			onTriggerEnter: import_react.useCallback(() => {
				if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
				else handleOpen();
			}, [
				providerContext.isOpenDelayedRef,
				handleDelayedOpen,
				handleOpen
			]),
			onTriggerLeave: import_react.useCallback(() => {
				if (disableHoverableContent) handleClose();
				else {
					window.clearTimeout(openTimerRef.current);
					openTimerRef.current = 0;
				}
			}, [handleClose, disableHoverableContent]),
			onOpen: handleOpen,
			onClose: handleClose,
			disableHoverableContent,
			children
		})
	});
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME$3 = "TooltipTrigger";
var TooltipTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, ...triggerProps } = props;
	const context = useTooltipContext(TRIGGER_NAME$3, __scopeTooltip);
	const providerContext = useTooltipProviderContext(TRIGGER_NAME$3, __scopeTooltip);
	const popperScope = usePopperScope$2(__scopeTooltip);
	const composedRefs = useComposedRefs(forwardedRef, import_react.useRef(null), context.onTriggerChange);
	const isPointerDownRef = import_react.useRef(false);
	const hasPointerMoveOpenedRef = import_react.useRef(false);
	const handlePointerUp = import_react.useCallback(() => isPointerDownRef.current = false, []);
	import_react.useEffect(() => {
		return () => document.removeEventListener("pointerup", handlePointerUp);
	}, [handlePointerUp]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
			"aria-describedby": context.open ? context.contentId : void 0,
			"data-state": context.stateAttribute,
			...triggerProps,
			ref: composedRefs,
			onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
				if (event.pointerType === "touch") return;
				if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
					context.onTriggerEnter();
					hasPointerMoveOpenedRef.current = true;
				}
			}),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
				context.onTriggerLeave();
				hasPointerMoveOpenedRef.current = false;
			}),
			onPointerDown: composeEventHandlers(props.onPointerDown, () => {
				if (context.open) context.onClose();
				isPointerDownRef.current = true;
				document.addEventListener("pointerup", handlePointerUp, { once: true });
			}),
			onFocus: composeEventHandlers(props.onFocus, () => {
				if (!isPointerDownRef.current) context.onOpen();
			}),
			onBlur: composeEventHandlers(props.onBlur, context.onClose),
			onClick: composeEventHandlers(props.onClick, context.onClose)
		})
	});
});
TooltipTrigger$1.displayName = TRIGGER_NAME$3;
var PORTAL_NAME$4 = "TooltipPortal";
var [PortalProvider$2, usePortalContext$2] = createTooltipContext(PORTAL_NAME$4, { forceMount: void 0 });
var TooltipPortal = (props) => {
	const { __scopeTooltip, forceMount, children, container } = props;
	const context = useTooltipContext(PORTAL_NAME$4, __scopeTooltip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider$2, {
		scope: __scopeTooltip,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$4, {
				asChild: true,
				container,
				children
			})
		})
	});
};
TooltipPortal.displayName = PORTAL_NAME$4;
var CONTENT_NAME$4 = "TooltipContent";
var TooltipContent$2 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$2(CONTENT_NAME$4, props.__scopeTooltip);
	const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
	const context = useTooltipContext(CONTENT_NAME$4, props.__scopeTooltip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.disableHoverableContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentImpl, {
			side,
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentHoverable, {
			side,
			...contentProps,
			ref: forwardedRef
		})
	});
});
var TooltipContentHoverable = import_react.forwardRef((props, forwardedRef) => {
	const context = useTooltipContext(CONTENT_NAME$4, props.__scopeTooltip);
	const providerContext = useTooltipProviderContext(CONTENT_NAME$4, props.__scopeTooltip);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const [pointerGraceArea, setPointerGraceArea] = import_react.useState(null);
	const { trigger, onClose } = context;
	const content = ref.current;
	const { onPointerInTransitChange } = providerContext;
	const handleRemoveGraceArea = import_react.useCallback(() => {
		setPointerGraceArea(null);
		onPointerInTransitChange(false);
	}, [onPointerInTransitChange]);
	const handleCreateGraceArea = import_react.useCallback((event, hoverTarget) => {
		const currentTarget = event.currentTarget;
		const exitPoint = {
			x: event.clientX,
			y: event.clientY
		};
		const paddedExitPoints = getPaddedExitPoints(exitPoint, getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect()));
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		setPointerGraceArea(getHull([...paddedExitPoints, ...hoverTargetPoints]));
		onPointerInTransitChange(true);
	}, [onPointerInTransitChange]);
	import_react.useEffect(() => {
		return () => handleRemoveGraceArea();
	}, [handleRemoveGraceArea]);
	import_react.useEffect(() => {
		if (trigger && content) {
			const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
			const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
			trigger.addEventListener("pointerleave", handleTriggerLeave);
			content.addEventListener("pointerleave", handleContentLeave);
			return () => {
				trigger.removeEventListener("pointerleave", handleTriggerLeave);
				content.removeEventListener("pointerleave", handleContentLeave);
			};
		}
	}, [
		trigger,
		content,
		handleCreateGraceArea,
		handleRemoveGraceArea
	]);
	import_react.useEffect(() => {
		if (pointerGraceArea) {
			const handleTrackPointerGrace = (event) => {
				const target = event.target;
				const pointerPosition = {
					x: event.clientX,
					y: event.clientY
				};
				const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
				const isPointerOutsideGraceArea = !isPointInPolygon$1(pointerPosition, pointerGraceArea);
				if (hasEnteredTarget) handleRemoveGraceArea();
				else if (isPointerOutsideGraceArea) {
					handleRemoveGraceArea();
					onClose();
				}
			};
			document.addEventListener("pointermove", handleTrackPointerGrace);
			return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
		}
	}, [
		trigger,
		content,
		pointerGraceArea,
		onClose,
		handleRemoveGraceArea
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContentImpl, {
		...props,
		ref: composedRefs
	});
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = /* @__PURE__ */ createSlottable("TooltipContent");
var TooltipContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, children, "aria-label": ariaLabel, onEscapeKeyDown, onPointerDownOutside, ...contentProps } = props;
	const context = useTooltipContext(CONTENT_NAME$4, __scopeTooltip);
	const popperScope = usePopperScope$2(__scopeTooltip);
	const { onClose } = context;
	import_react.useEffect(() => {
		document.addEventListener(TOOLTIP_OPEN, onClose);
		return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
	}, [onClose]);
	import_react.useEffect(() => {
		if (context.trigger) {
			const handleScroll = (event) => {
				if (event.target?.contains(context.trigger)) onClose();
			};
			window.addEventListener("scroll", handleScroll, { capture: true });
			return () => window.removeEventListener("scroll", handleScroll, { capture: true });
		}
	}, [context.trigger, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
		asChild: true,
		disableOutsidePointerEvents: false,
		onEscapeKeyDown,
		onPointerDownOutside,
		onFocusOutside: (event) => event.preventDefault(),
		onDismiss: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content$1, {
			"data-state": context.stateAttribute,
			...popperScope,
			...contentProps,
			ref: forwardedRef,
			style: {
				...contentProps.style,
				"--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
				"--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
				"--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slottable, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisuallyHiddenContentContextProvider, {
				scope: __scopeTooltip,
				isInside: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$3, {
					id: context.contentId,
					role: "tooltip",
					children: ariaLabel || children
				})
			})]
		})
	});
});
TooltipContent$2.displayName = CONTENT_NAME$4;
var ARROW_NAME$3 = "TooltipArrow";
var TooltipArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeTooltip, ...arrowProps } = props;
	const popperScope = usePopperScope$2(__scopeTooltip);
	return useVisuallyHiddenContentContext(ARROW_NAME$3, __scopeTooltip).isInside ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	});
});
TooltipArrow.displayName = ARROW_NAME$3;
function getExitSideFromRect(point, rect) {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);
	switch (Math.min(top, bottom, right, left)) {
		case left: return "left";
		case right: return "right";
		case top: return "top";
		case bottom: return "bottom";
		default: throw new Error("unreachable");
	}
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
	const paddedExitPoints = [];
	switch (exitSide) {
		case "top":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "bottom":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			});
			break;
		case "left":
			paddedExitPoints.push({
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			});
			break;
		case "right":
			paddedExitPoints.push({
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			}, {
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			});
			break;
	}
	return paddedExitPoints;
}
function getPointsFromRect(rect) {
	const { top, right, bottom, left } = rect;
	return [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		}
	];
}
function isPointInPolygon$1(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const ii = polygon[i];
		const jj = polygon[j];
		const xi = ii.x;
		const yi = ii.y;
		const xj = jj.x;
		const yj = jj.y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function getHull(points) {
	const newPoints = points.slice();
	newPoints.sort((a, b) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return 1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return 1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
	if (points.length <= 1) return points.slice();
	const upperHull = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		while (upperHull.length >= 2) {
			const q = upperHull[upperHull.length - 1];
			const r = upperHull[upperHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();
	const lowerHull = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (lowerHull.length >= 2) {
			const q = lowerHull[lowerHull.length - 1];
			const r = lowerHull[lowerHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();
	if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
	else return upperHull.concat(lowerHull);
}
var Provider = TooltipProvider$1;
var Root3$1 = Tooltip$1;
var Trigger$3 = TooltipTrigger$1;
var Portal$3 = TooltipPortal;
var Content2$3 = TooltipContent$2;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-focus-guard_9da9cc280db08da8f000078792c3b361/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var count = 0;
function useFocusGuards() {
	import_react.useEffect(() => {
		const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
		document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
		document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
		count++;
		return () => {
			if (count === 1) document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
			count--;
		};
	}, []);
}
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-radix-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-focus-scope_07eb8840b0faf9d9959e59dd270a4cf7/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = import_react.forwardRef((props, forwardedRef) => {
	const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
	const [container, setContainer] = import_react.useState(null);
	const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
	const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
	const lastFocusedElementRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
	const focusScope = import_react.useRef({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		}
	}).current;
	import_react.useEffect(() => {
		if (trapped) {
			let handleFocusIn2 = function(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.current = target;
				else focus(lastFocusedElementRef.current, { select: true });
			}, handleFocusOut2 = function(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
			}, handleMutations2 = function(mutations) {
				if (document.activeElement !== document.body) return;
				for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
			};
			document.addEventListener("focusin", handleFocusIn2);
			document.addEventListener("focusout", handleFocusOut2);
			const mutationObserver = new MutationObserver(handleMutations2);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			return () => {
				document.removeEventListener("focusin", handleFocusIn2);
				document.removeEventListener("focusout", handleFocusOut2);
				mutationObserver.disconnect();
			};
		}
	}, [
		trapped,
		container,
		focusScope.paused
	]);
	import_react.useEffect(() => {
		if (container) {
			focusScopesStack.add(focusScope);
			const previouslyFocusedElement = document.activeElement;
			if (!container.contains(previouslyFocusedElement)) {
				const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
				container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				container.dispatchEvent(mountEvent);
				if (!mountEvent.defaultPrevented) {
					focusFirst$1(removeLinks(getTabbableCandidates(container)), { select: true });
					if (document.activeElement === previouslyFocusedElement) focus(container);
				}
			}
			return () => {
				container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				setTimeout(() => {
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					container.dispatchEvent(unmountEvent);
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					focusScopesStack.remove(focusScope);
				}, 0);
			};
		}
	}, [
		container,
		onMountAutoFocus,
		onUnmountAutoFocus,
		focusScope
	]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;
		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;
		if (isTabKey && focusedElement) {
			const container2 = event.currentTarget;
			const [first, last] = getTabbableEdges(container2);
			if (!(first && last)) {
				if (focusedElement === container2) event.preventDefault();
			} else if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) focus(first, { select: true });
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) focus(last, { select: true });
			}
		}
	}, [
		loop,
		trapped,
		focusScope.paused
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		tabIndex: -1,
		...scopeProps,
		ref: composedRefs,
		onKeyDown: handleKeyDown
	});
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst$1(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
}
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
function findVisible(elements, container) {
	for (const element of elements) if (!isHidden(element, { upTo: container })) return element;
}
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
	let stack = [];
	return {
		add(focusScope) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		}
	};
}
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
//#endregion
//#region ../node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
//#endregion
//#region ../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll-bar@2.3_6e4d7bbd897d1a5ebe5ee8a8c5c5c756/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
/**
* Name of a CSS variable containing the amount of "hidden" scrollbar
* ! might be undefined ! use will fallback!
*/
var removedBarSizeVariable = "--removed-body-scroll-bar-size";
//#endregion
//#region ../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.7/node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
* Assigns a value for a given ref, no matter of the ref format
* @param {RefObject} ref - a callback function or ref object
* @param value - a new value
*
* @see https://github.com/theKashey/use-callback-ref#assignref
* @example
* const refObject = useRef();
* const refFn = (ref) => {....}
*
* assignRef(refObject, "refValue");
* assignRef(refFn, "refValue");
*/
function assignRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
	return ref;
}
//#endregion
//#region ../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useRef.js
/**
* creates a MutableRef with ref change callback
* @param initialValue - initial ref value
* @param {Function} callback - a callback to run when value changes
*
* @example
* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
* ref.current = 1;
* // prints 0 -> 1
*
* @see https://reactjs.org/docs/hooks-reference.html#useref
* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
* @returns {MutableRefObject}
*/
function useCallbackRef(initialValue, callback) {
	var ref = (0, import_react.useState)(function() {
		return {
			value: initialValue,
			callback,
			facade: {
				get current() {
					return ref.value;
				},
				set current(value) {
					var last = ref.value;
					if (last !== value) {
						ref.value = value;
						ref.callback(value, last);
					}
				}
			}
		};
	})[0];
	ref.callback = callback;
	return ref.facade;
}
//#endregion
//#region ../node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@19.2.14_react@19.2.7/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
/**
* Merges two or more refs together providing a single interface to set their value
* @param {RefObject|Ref} refs
* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
*
* @see {@link mergeRefs} a version without buit-in memoization
* @see https://github.com/theKashey/use-callback-ref#usemergerefs
* @example
* const Component = React.forwardRef((props, ref) => {
*   const ownRef = useRef();
*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
*   return <div ref={domRef}>...</div>
* }
*/
function useMergeRefs(refs, defaultValue) {
	var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
		return refs.forEach(function(ref) {
			return assignRef(ref, newValue);
		});
	});
	useIsomorphicLayoutEffect(function() {
		var oldValue = currentValues.get(callbackRef);
		if (oldValue) {
			var prevRefs_1 = new Set(oldValue);
			var nextRefs_1 = new Set(refs);
			var current_1 = callbackRef.current;
			prevRefs_1.forEach(function(ref) {
				if (!nextRefs_1.has(ref)) assignRef(ref, null);
			});
			nextRefs_1.forEach(function(ref) {
				if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
			});
		}
		currentValues.set(callbackRef, refs);
	}, [refs]);
	return callbackRef;
}
//#endregion
//#region ../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.7/node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
	return a;
}
function innerCreateMedium(defaults, middleware) {
	if (middleware === void 0) middleware = ItoI;
	var buffer = [];
	var assigned = false;
	return {
		read: function() {
			if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			if (buffer.length) return buffer[buffer.length - 1];
			return defaults;
		},
		useMedium: function(data) {
			var item = middleware(data, assigned);
			buffer.push(item);
			return function() {
				buffer = buffer.filter(function(x) {
					return x !== item;
				});
			};
		},
		assignSyncMedium: function(cb) {
			assigned = true;
			while (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
			}
			buffer = {
				push: function(x) {
					return cb(x);
				},
				filter: function() {
					return buffer;
				}
			};
		},
		assignMedium: function(cb) {
			assigned = true;
			var pendingQueue = [];
			if (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
				pendingQueue = buffer;
			}
			var executeQueue = function() {
				var cbs = pendingQueue;
				pendingQueue = [];
				cbs.forEach(cb);
			};
			var cycle = function() {
				return Promise.resolve().then(executeQueue);
			};
			cycle();
			buffer = {
				push: function(x) {
					pendingQueue.push(x);
					cycle();
				},
				filter: function(filter) {
					pendingQueue = pendingQueue.filter(filter);
					return buffer;
				}
			};
		}
	};
}
function createSidecarMedium(options) {
	if (options === void 0) options = {};
	var medium = innerCreateMedium(null);
	medium.options = __assign({
		async: true,
		ssr: false
	}, options);
	return medium;
}
//#endregion
//#region ../node_modules/.pnpm/use-sidecar@1.1.3_@types+react@19.2.14_react@19.2.7/node_modules/use-sidecar/dist/es2015/exports.js
var SideCar = function(_a) {
	var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
	if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
	var Target = sideCar.read();
	if (!Target) throw new Error("Sidecar medium not found");
	return import_react.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
	medium.useMedium(exported);
	return SideCar;
}
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {};
/**
* Removes scrollbar from the page and contain the scroll within the Lock
*/
var RemoveScroll = import_react.forwardRef(function(props, parentRef) {
	var ref = import_react.useRef(null);
	var _a = import_react.useState({
		onScrollCapture: nothing,
		onWheelCapture: nothing,
		onTouchMoveCapture: nothing
	}), callbacks = _a[0], setCallbacks = _a[1];
	var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]);
	var SideCar = sideCar;
	var containerRef = useMergeRefs([ref, parentRef]);
	var containerProps = __assign(__assign({}, rest), callbacks);
	return import_react.createElement(import_react.Fragment, null, enabled && import_react.createElement(SideCar, {
		sideCar: effectCar,
		removeScrollBar,
		shards,
		noRelative,
		noIsolation,
		inert,
		setCallbacks,
		allowPinchZoom: !!allowPinchZoom,
		lockRef: ref,
		gapMode
	}), forwardProps ? import_react.cloneElement(import_react.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : import_react.createElement(Container, __assign({}, containerProps, {
		className,
		ref: containerRef
	}), children));
});
RemoveScroll.defaultProps = {
	enabled: true,
	removeScrollBar: true,
	inert: false
};
RemoveScroll.classNames = {
	fullWidth: fullWidthClassName,
	zeroRight: zeroRightClassName
};
//#endregion
//#region ../node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
	if (currentNonce) return currentNonce;
	if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
};
//#endregion
//#region ../node_modules/.pnpm/react-style-singleton@2.2.3_e10cfdb7f729e60eeab9c007add944d2/node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
	if (!document) return null;
	var tag = document.createElement("style");
	tag.type = "text/css";
	var nonce = getNonce();
	if (nonce) tag.setAttribute("nonce", nonce);
	return tag;
}
function injectStyles(tag, css) {
	if (tag.styleSheet) tag.styleSheet.cssText = css;
	else tag.appendChild(document.createTextNode(css));
}
function insertStyleTag(tag) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
}
var stylesheetSingleton = function() {
	var counter = 0;
	var stylesheet = null;
	return {
		add: function(style) {
			if (counter == 0) {
				if (stylesheet = makeStyleTag()) {
					injectStyles(stylesheet, style);
					insertStyleTag(stylesheet);
				}
			}
			counter++;
		},
		remove: function() {
			counter--;
			if (!counter && stylesheet) {
				stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
				stylesheet = null;
			}
		}
	};
};
//#endregion
//#region ../node_modules/.pnpm/react-style-singleton@2.2.3_e10cfdb7f729e60eeab9c007add944d2/node_modules/react-style-singleton/dist/es2015/hook.js
/**
* creates a hook to control style singleton
* @see {@link styleSingleton} for a safer component version
* @example
* ```tsx
* const useStyle = styleHookSingleton();
* ///
* useStyle('body { overflow: hidden}');
*/
var styleHookSingleton = function() {
	var sheet = stylesheetSingleton();
	return function(styles, isDynamic) {
		import_react.useEffect(function() {
			sheet.add(styles);
			return function() {
				sheet.remove();
			};
		}, [styles && isDynamic]);
	};
};
//#endregion
//#region ../node_modules/.pnpm/react-style-singleton@2.2.3_e10cfdb7f729e60eeab9c007add944d2/node_modules/react-style-singleton/dist/es2015/component.js
/**
* create a Component to add styles on demand
* - styles are added when first instance is mounted
* - styles are removed when the last instance is unmounted
* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
*/
var styleSingleton = function() {
	var useStyle = styleHookSingleton();
	var Sheet = function(_a) {
		var styles = _a.styles, dynamic = _a.dynamic;
		useStyle(styles, dynamic);
		return null;
	};
	return Sheet;
};
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll-bar@2.3_6e4d7bbd897d1a5ebe5ee8a8c5c5c756/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
};
var parse = function(x) {
	return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
	var cs = window.getComputedStyle(document.body);
	var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
	var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
	var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
	return [
		parse(left),
		parse(top),
		parse(right)
	];
};
var getGapWidth = function(gapMode) {
	if (gapMode === void 0) gapMode = "margin";
	if (typeof window === "undefined") return zeroGap;
	var offsets = getOffset(gapMode);
	var documentWidth = document.documentElement.clientWidth;
	var windowWidth = window.innerWidth;
	return {
		left: offsets[0],
		top: offsets[1],
		right: offsets[2],
		gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
	};
};
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll-bar@2.3_6e4d7bbd897d1a5ebe5ee8a8c5c5c756/node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
	var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
	if (gapMode === void 0) gapMode = "margin";
	return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
		allowRelative && "position: relative ".concat(important, ";"),
		gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
		gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
	].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
	var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
	import_react.useEffect(function() {
		document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
		return function() {
			var newCounter = getCurrentUseCounter() - 1;
			if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
			else document.body.setAttribute(lockAttribute, newCounter.toString());
		};
	}, []);
};
/**
* Removes page scrollbar and blocks page scroll when mounted
*/
var RemoveScrollBar = function(_a) {
	var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
	useLockAttribute();
	var gap = import_react.useMemo(function() {
		return getGapWidth(gapMode);
	}, [gapMode]);
	return import_react.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") try {
	var options = Object.defineProperty({}, "passive", { get: function() {
		passiveSupported = true;
		return true;
	} });
	window.addEventListener("test", options, options);
	window.removeEventListener("test", options, options);
} catch (err) {
	passiveSupported = false;
}
var nonPassive = passiveSupported ? { passive: false } : false;
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
	return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
	if (!(node instanceof Element)) return false;
	var styles = window.getComputedStyle(node);
	return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
};
var elementCouldBeVScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
	var ownerDocument = node.ownerDocument;
	var current = node;
	do {
		if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
		if (elementCouldBeScrolled(axis, current)) {
			var _a = getScrollVariables(axis, current);
			if (_a[1] > _a[2]) return true;
		}
		current = current.parentNode;
	} while (current && current !== ownerDocument.body);
	return false;
};
var getVScrollVariables = function(_a) {
	return [
		_a.scrollTop,
		_a.scrollHeight,
		_a.clientHeight
	];
};
var getHScrollVariables = function(_a) {
	return [
		_a.scrollLeft,
		_a.scrollWidth,
		_a.clientWidth
	];
};
var elementCouldBeScrolled = function(axis, node) {
	return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
	return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
	/**
	* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
	* and then increasingly negative as you scroll towards the end of the content.
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	*/
	return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
	var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
	var delta = directionFactor * sourceDelta;
	var target = event.target;
	var targetInLock = endTarget.contains(target);
	var shouldCancelScroll = false;
	var isDeltaPositive = delta > 0;
	var availableScroll = 0;
	var availableScrollTop = 0;
	do {
		if (!target) break;
		var _a = getScrollVariables(axis, target), position = _a[0];
		var elementScroll = _a[1] - _a[2] - directionFactor * position;
		if (position || elementScroll) {
			if (elementCouldBeScrolled(axis, target)) {
				availableScroll += elementScroll;
				availableScrollTop += position;
			}
		}
		var parent_1 = target.parentNode;
		target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
	} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
	if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
	else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
	return shouldCancelScroll;
};
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
	return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
	return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
	return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
	return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
	return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
	var shouldPreventQueue = import_react.useRef([]);
	var touchStartRef = import_react.useRef([0, 0]);
	var activeAxis = import_react.useRef();
	var id = import_react.useState(idCounter++)[0];
	var Style = import_react.useState(styleSingleton)[0];
	var lastProps = import_react.useRef(props);
	import_react.useEffect(function() {
		lastProps.current = props;
	}, [props]);
	import_react.useEffect(function() {
		if (props.inert) {
			document.body.classList.add("block-interactivity-".concat(id));
			var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
			allow_1.forEach(function(el) {
				return el.classList.add("allow-interactivity-".concat(id));
			});
			return function() {
				document.body.classList.remove("block-interactivity-".concat(id));
				allow_1.forEach(function(el) {
					return el.classList.remove("allow-interactivity-".concat(id));
				});
			};
		}
	}, [
		props.inert,
		props.lockRef.current,
		props.shards
	]);
	var shouldCancelEvent = import_react.useCallback(function(event, parent) {
		if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
		var touch = getTouchXY(event);
		var touchStart = touchStartRef.current;
		var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
		var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
		var currentAxis;
		var target = event.target;
		var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
		if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
		var selection = window.getSelection();
		var anchorNode = selection && selection.anchorNode;
		if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
		var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		if (!canBeScrolledInMainDirection) return true;
		if (canBeScrolledInMainDirection) currentAxis = moveDirection;
		else {
			currentAxis = moveDirection === "v" ? "h" : "v";
			canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		}
		if (!canBeScrolledInMainDirection) return false;
		if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
		if (!currentAxis) return true;
		var cancelingAxis = activeAxis.current || currentAxis;
		return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
	}, []);
	var shouldPrevent = import_react.useCallback(function(_event) {
		var event = _event;
		if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
		var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
		var sourceEvent = shouldPreventQueue.current.filter(function(e) {
			return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
		})[0];
		if (sourceEvent && sourceEvent.should) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!sourceEvent) {
			var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
				return node.contains(event.target);
			});
			if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
				if (event.cancelable) event.preventDefault();
			}
		}
	}, []);
	var shouldCancel = import_react.useCallback(function(name, delta, target, should) {
		var event = {
			name,
			delta,
			target,
			should,
			shadowParent: getOutermostShadowParent(target)
		};
		shouldPreventQueue.current.push(event);
		setTimeout(function() {
			shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
				return e !== event;
			});
		}, 1);
	}, []);
	var scrollTouchStart = import_react.useCallback(function(event) {
		touchStartRef.current = getTouchXY(event);
		activeAxis.current = void 0;
	}, []);
	var scrollWheel = import_react.useCallback(function(event) {
		shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	var scrollTouchMove = import_react.useCallback(function(event) {
		shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	import_react.useEffect(function() {
		lockStack.push(Style);
		props.setCallbacks({
			onScrollCapture: scrollWheel,
			onWheelCapture: scrollWheel,
			onTouchMoveCapture: scrollTouchMove
		});
		document.addEventListener("wheel", shouldPrevent, nonPassive);
		document.addEventListener("touchmove", shouldPrevent, nonPassive);
		document.addEventListener("touchstart", scrollTouchStart, nonPassive);
		return function() {
			lockStack = lockStack.filter(function(inst) {
				return inst !== Style;
			});
			document.removeEventListener("wheel", shouldPrevent, nonPassive);
			document.removeEventListener("touchmove", shouldPrevent, nonPassive);
			document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
		};
	}, []);
	var removeScrollBar = props.removeScrollBar, inert = props.inert;
	return import_react.createElement(import_react.Fragment, null, inert ? import_react.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? import_react.createElement(RemoveScrollBar, {
		noRelative: props.noRelative,
		gapMode: props.gapMode
	}) : null);
}
function getOutermostShadowParent(node) {
	var shadowParent = null;
	while (node !== null) {
		if (node instanceof ShadowRoot) {
			shadowParent = node.host;
			node = node.host;
		}
		node = node.parentNode;
	}
	return shadowParent;
}
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
//#endregion
//#region ../node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@19.2.14_react@19.2.7/node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = import_react.forwardRef(function(props, ref) {
	return import_react.createElement(RemoveScroll, __assign({}, props, {
		ref,
		sideCar: sidecar_default
	}));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-menu@2.1.16_d69fe6d7c13da483b04d9ee39f060823/node_modules/@radix-ui/react-menu/dist/index.mjs
var SELECTION_KEYS$1 = ["Enter", " "];
var FIRST_KEYS = [
	"ArrowDown",
	"PageUp",
	"Home"
];
var LAST_KEYS = [
	"ArrowUp",
	"PageDown",
	"End"
];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
	ltr: [...SELECTION_KEYS$1, "ArrowRight"],
	rtl: [...SELECTION_KEYS$1, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
	ltr: ["ArrowLeft"],
	rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
	createCollectionScope$2,
	createPopperScope,
	createRovingFocusGroupScope
]);
var usePopperScope$1 = createPopperScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = (props) => {
	const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
	const popperScope = usePopperScope$1(__scopeMenu);
	const [content, setContent] = import_react.useState(null);
	const isUsingKeyboardRef = import_react.useRef(false);
	const handleOpenChange = useCallbackRef$1(onOpenChange);
	const direction = useDirection(dir);
	import_react.useEffect(() => {
		const handleKeyDown = () => {
			isUsingKeyboardRef.current = true;
			document.addEventListener("pointerdown", handlePointer, {
				capture: true,
				once: true
			});
			document.addEventListener("pointermove", handlePointer, {
				capture: true,
				once: true
			});
		};
		const handlePointer = () => isUsingKeyboardRef.current = false;
		document.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			document.removeEventListener("keydown", handleKeyDown, { capture: true });
			document.removeEventListener("pointerdown", handlePointer, { capture: true });
			document.removeEventListener("pointermove", handlePointer, { capture: true });
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$2, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuProvider, {
			scope: __scopeMenu,
			open,
			onOpenChange: handleOpenChange,
			content,
			onContentChange: setContent,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootProvider, {
				scope: __scopeMenu,
				onClose: import_react.useCallback(() => handleOpenChange(false), [handleOpenChange]),
				isUsingKeyboardRef,
				dir: direction,
				modal,
				children
			})
		})
	});
};
Menu.displayName = MENU_NAME;
var ANCHOR_NAME = "MenuAnchor";
var MenuAnchor = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...anchorProps } = props;
	const popperScope = usePopperScope$1(__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		...popperScope,
		...anchorProps,
		ref: forwardedRef
	});
});
MenuAnchor.displayName = ANCHOR_NAME;
var PORTAL_NAME$3 = "MenuPortal";
var [PortalProvider$1, usePortalContext$1] = createMenuContext(PORTAL_NAME$3, { forceMount: void 0 });
var MenuPortal = (props) => {
	const { __scopeMenu, forceMount, children, container } = props;
	const context = useMenuContext(PORTAL_NAME$3, __scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider$1, {
		scope: __scopeMenu,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$4, {
				asChild: true,
				container,
				children
			})
		})
	});
};
MenuPortal.displayName = PORTAL_NAME$3;
var CONTENT_NAME$3 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$3);
var MenuContent = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$1(CONTENT_NAME$3, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, props.__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Slot, {
				scope: props.__scopeMenu,
				children: rootContext.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootContentModal, {
					...contentProps,
					ref: forwardedRef
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootContentNonModal, {
					...contentProps,
					ref: forwardedRef
				})
			})
		})
	});
});
var MenuRootContentModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	import_react.useEffect(() => {
		const content = ref.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		disableOutsideScroll: true,
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false }),
		onDismiss: () => context.onOpenChange(false)
	});
});
var MenuRootContentNonModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		disableOutsideScroll: false,
		onDismiss: () => context.onOpenChange(false)
	});
});
var Slot$2 = /* @__PURE__ */ createSlot("MenuContent.ScrollLock");
var MenuContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, loop = false, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEntryFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, disableOutsideScroll, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, __scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, __scopeMenu);
	const popperScope = usePopperScope$1(__scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
	const getItems = useCollection$2(__scopeMenu);
	const [currentItemId, setCurrentItemId] = import_react.useState(null);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
	const timerRef = import_react.useRef(0);
	const searchRef = import_react.useRef("");
	const pointerGraceTimerRef = import_react.useRef(0);
	const pointerGraceIntentRef = import_react.useRef(null);
	const pointerDirRef = import_react.useRef("right");
	const lastPointerXRef = import_react.useRef(0);
	const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : import_react.Fragment;
	const scrollLockWrapperProps = disableOutsideScroll ? {
		as: Slot$2,
		allowPinchZoom: true
	} : void 0;
	const handleTypeaheadSearch = (key) => {
		const search = searchRef.current + key;
		const items = getItems().filter((item) => !item.disabled);
		const currentItem = document.activeElement;
		const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
		const nextMatch = getNextMatch(items.map((item) => item.textValue), search, currentMatch);
		const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
		(function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		})(search);
		if (newItem) setTimeout(() => newItem.focus());
	};
	import_react.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	useFocusGuards();
	const isPointerMovingToSubmenu = import_react.useCallback((event) => {
		return pointerDirRef.current === pointerGraceIntentRef.current?.side && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentProvider, {
		scope: __scopeMenu,
		searchRef,
		onItemEnter: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		onItemLeave: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) return;
			contentRef.current?.focus();
			setCurrentItemId(null);
		}, [isPointerMovingToSubmenu]),
		onTriggerLeave: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		pointerGraceTimerRef,
		onPointerGraceIntentChange: import_react.useCallback((intent) => {
			pointerGraceIntentRef.current = intent;
		}, []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollLockWrapper, {
			...scrollLockWrapperProps,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
				asChild: true,
				trapped: trapFocus,
				onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
					event.preventDefault();
					contentRef.current?.focus({ preventScroll: true });
				}),
				onUnmountAutoFocus: onCloseAutoFocus,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside,
					onInteractOutside,
					onDismiss,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$6, {
						asChild: true,
						...rovingFocusGroupScope,
						dir: rootContext.dir,
						orientation: "vertical",
						loop,
						currentTabStopId: currentItemId,
						onCurrentTabStopIdChange: setCurrentItemId,
						onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
							if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
						}),
						preventScrollOnEntryFocus: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content$1, {
							role: "menu",
							"aria-orientation": "vertical",
							"data-state": getOpenState(context.open),
							"data-radix-menu-content": "",
							dir: rootContext.dir,
							...popperScope,
							...contentProps,
							ref: composedRefs,
							style: {
								outline: "none",
								...contentProps.style
							},
							onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
								const isKeyDownInside = event.target.closest("[data-radix-menu-content]") === event.currentTarget;
								const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
								const isCharacterKey = event.key.length === 1;
								if (isKeyDownInside) {
									if (event.key === "Tab") event.preventDefault();
									if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
								}
								const content = contentRef.current;
								if (event.target !== content) return;
								if (!FIRST_LAST_KEYS.includes(event.key)) return;
								event.preventDefault();
								const candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
								focusFirst(candidateNodes);
							}),
							onBlur: composeEventHandlers(props.onBlur, (event) => {
								if (!event.currentTarget.contains(event.target)) {
									window.clearTimeout(timerRef.current);
									searchRef.current = "";
								}
							}),
							onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
								const target = event.target;
								const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
								if (event.currentTarget.contains(target) && pointerXHasChanged) {
									pointerDirRef.current = event.clientX > lastPointerXRef.current ? "right" : "left";
									lastPointerXRef.current = event.clientX;
								}
							}))
						})
					})
				})
			})
		})
	});
});
MenuContent.displayName = CONTENT_NAME$3;
var GROUP_NAME$2 = "MenuGroup";
var MenuGroup = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...groupProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		role: "group",
		...groupProps,
		ref: forwardedRef
	});
});
MenuGroup.displayName = GROUP_NAME$2;
var LABEL_NAME$2 = "MenuLabel";
var MenuLabel = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...labelProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		...labelProps,
		ref: forwardedRef
	});
});
MenuLabel.displayName = LABEL_NAME$2;
var ITEM_NAME$2 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = import_react.forwardRef((props, forwardedRef) => {
	const { disabled = false, onSelect, ...itemProps } = props;
	const ref = import_react.useRef(null);
	const rootContext = useMenuRootContext(ITEM_NAME$2, props.__scopeMenu);
	const contentContext = useMenuContentContext(ITEM_NAME$2, props.__scopeMenu);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const isPointerDownRef = import_react.useRef(false);
	const handleSelect = () => {
		const menuItem = ref.current;
		if (!disabled && menuItem) {
			const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
				bubbles: true,
				cancelable: true
			});
			menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
			dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
			if (itemSelectEvent.defaultPrevented) isPointerDownRef.current = false;
			else rootContext.onClose();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItemImpl, {
		...itemProps,
		ref: composedRefs,
		disabled,
		onClick: composeEventHandlers(props.onClick, handleSelect),
		onPointerDown: (event) => {
			props.onPointerDown?.(event);
			isPointerDownRef.current = true;
		},
		onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
			if (!isPointerDownRef.current) event.currentTarget?.click();
		}),
		onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
			const isTypingAhead = contentContext.searchRef.current !== "";
			if (disabled || isTypingAhead && event.key === " ") return;
			if (SELECTION_KEYS$1.includes(event.key)) {
				event.currentTarget.click();
				event.preventDefault();
			}
		})
	});
});
MenuItem.displayName = ITEM_NAME$2;
var MenuItemImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
	const contentContext = useMenuContentContext(ITEM_NAME$2, __scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const [isFocused, setIsFocused] = import_react.useState(false);
	const [textContent, setTextContent] = import_react.useState("");
	import_react.useEffect(() => {
		const menuItem = ref.current;
		if (menuItem) setTextContent((menuItem.textContent ?? "").trim());
	}, [itemProps.children]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.ItemSlot, {
		scope: __scopeMenu,
		disabled,
		textValue: textValue ?? textContent,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
			asChild: true,
			...rovingFocusGroupScope,
			focusable: !disabled,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				role: "menuitem",
				"data-highlighted": isFocused ? "" : void 0,
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				...itemProps,
				ref: composedRefs,
				onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
					if (disabled) contentContext.onItemLeave(event);
					else {
						contentContext.onItemEnter(event);
						if (!event.defaultPrevented) event.currentTarget.focus({ preventScroll: true });
					}
				})),
				onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => contentContext.onItemLeave(event))),
				onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
			})
		})
	});
});
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = import_react.forwardRef((props, forwardedRef) => {
	const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
			role: "menuitemcheckbox",
			"aria-checked": isIndeterminate(checked) ? "mixed" : checked,
			...checkboxItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(checkboxItemProps.onSelect, () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked), { checkForDefaultPrevented: false })
		})
	});
});
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(RADIO_GROUP_NAME$1, {
	value: void 0,
	onValueChange: () => {}
});
var MenuRadioGroup = import_react.forwardRef((props, forwardedRef) => {
	const { value, onValueChange, ...groupProps } = props;
	const handleValueChange = useCallbackRef$1(onValueChange);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupProvider, {
		scope: props.__scopeMenu,
		value,
		onValueChange: handleValueChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuGroup, {
			...groupProps,
			ref: forwardedRef
		})
	});
});
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = import_react.forwardRef((props, forwardedRef) => {
	const { value, ...radioItemProps } = props;
	const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
	const checked = value === context.value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
			role: "menuitemradio",
			"aria-checked": checked,
			...radioItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(radioItemProps.onSelect, () => context.onValueChange?.(value), { checkForDefaultPrevented: false })
		})
	});
});
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME$1 = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(ITEM_INDICATOR_NAME$1, { checked: false });
var MenuItemIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
	const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME$1, __scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
			...itemIndicatorProps,
			ref: forwardedRef,
			"data-state": getCheckedState(indicatorContext.checked)
		})
	});
});
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME$1;
var SEPARATOR_NAME$2 = "MenuSeparator";
var MenuSeparator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...separatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		role: "separator",
		"aria-orientation": "horizontal",
		...separatorProps,
		ref: forwardedRef
	});
});
MenuSeparator.displayName = SEPARATOR_NAME$2;
var ARROW_NAME$2 = "MenuArrow";
var MenuArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeMenu, ...arrowProps } = props;
	const popperScope = usePopperScope$1(__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	});
});
MenuArrow.displayName = ARROW_NAME$2;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var MenuSub = (props) => {
	const { __scopeMenu, children, open = false, onOpenChange } = props;
	const parentMenuContext = useMenuContext(SUB_NAME, __scopeMenu);
	const popperScope = usePopperScope$1(__scopeMenu);
	const [trigger, setTrigger] = import_react.useState(null);
	const [content, setContent] = import_react.useState(null);
	const handleOpenChange = useCallbackRef$1(onOpenChange);
	import_react.useEffect(() => {
		if (parentMenuContext.open === false) handleOpenChange(false);
		return () => handleOpenChange(false);
	}, [parentMenuContext.open, handleOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$2, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuProvider, {
			scope: __scopeMenu,
			open,
			onOpenChange: handleOpenChange,
			content,
			onContentChange: setContent,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSubProvider, {
				scope: __scopeMenu,
				contentId: useId(),
				triggerId: useId(),
				trigger,
				onTriggerChange: setTrigger,
				children
			})
		})
	});
};
MenuSub.displayName = SUB_NAME;
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = import_react.forwardRef((props, forwardedRef) => {
	const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
	const openTimerRef = import_react.useRef(null);
	const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
	const scope = { __scopeMenu: props.__scopeMenu };
	const clearOpenTimer = import_react.useCallback(() => {
		if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
		openTimerRef.current = null;
	}, []);
	import_react.useEffect(() => clearOpenTimer, [clearOpenTimer]);
	import_react.useEffect(() => {
		const pointerGraceTimer = pointerGraceTimerRef.current;
		return () => {
			window.clearTimeout(pointerGraceTimer);
			onPointerGraceIntentChange(null);
		};
	}, [pointerGraceTimerRef, onPointerGraceIntentChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAnchor, {
		asChild: true,
		...scope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItemImpl, {
			id: subContext.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": subContext.contentId,
			"data-state": getOpenState(context.open),
			...props,
			ref: composeRefs(forwardedRef, subContext.onTriggerChange),
			onClick: (event) => {
				props.onClick?.(event);
				if (props.disabled || event.defaultPrevented) return;
				event.currentTarget.focus();
				if (!context.open) context.onOpenChange(true);
			},
			onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
				contentContext.onItemEnter(event);
				if (event.defaultPrevented) return;
				if (!props.disabled && !context.open && !openTimerRef.current) {
					contentContext.onPointerGraceIntentChange(null);
					openTimerRef.current = window.setTimeout(() => {
						context.onOpenChange(true);
						clearOpenTimer();
					}, 100);
				}
			})),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => {
				clearOpenTimer();
				const contentRect = context.content?.getBoundingClientRect();
				if (contentRect) {
					const side = context.content?.dataset.side;
					const rightSide = side === "right";
					const bleed = rightSide ? -5 : 5;
					const contentNearEdge = contentRect[rightSide ? "left" : "right"];
					const contentFarEdge = contentRect[rightSide ? "right" : "left"];
					contentContext.onPointerGraceIntentChange({
						area: [
							{
								x: event.clientX + bleed,
								y: event.clientY
							},
							{
								x: contentNearEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.bottom
							},
							{
								x: contentNearEdge,
								y: contentRect.bottom
							}
						],
						side
					});
					window.clearTimeout(pointerGraceTimerRef.current);
					pointerGraceTimerRef.current = window.setTimeout(() => contentContext.onPointerGraceIntentChange(null), 300);
				} else {
					contentContext.onTriggerLeave(event);
					if (event.defaultPrevented) return;
					contentContext.onPointerGraceIntentChange(null);
				}
			})),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				const isTypingAhead = contentContext.searchRef.current !== "";
				if (props.disabled || isTypingAhead && event.key === " ") return;
				if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
					context.onOpenChange(true);
					context.content?.focus();
					event.preventDefault();
				}
			})
		})
	});
});
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext$1(CONTENT_NAME$3, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, ...subContentProps } = props;
	const context = useMenuContext(CONTENT_NAME$3, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$3, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Slot, {
				scope: props.__scopeMenu,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
					id: subContext.contentId,
					"aria-labelledby": subContext.triggerId,
					...subContentProps,
					ref: composedRefs,
					align: "start",
					side: rootContext.dir === "rtl" ? "left" : "right",
					disableOutsidePointerEvents: false,
					disableOutsideScroll: false,
					trapFocus: false,
					onOpenAutoFocus: (event) => {
						if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
						event.preventDefault();
					},
					onCloseAutoFocus: (event) => event.preventDefault(),
					onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
						if (event.target !== subContext.trigger) context.onOpenChange(false);
					}),
					onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
						rootContext.onClose();
						event.preventDefault();
					}),
					onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
						const isKeyDownInside = event.currentTarget.contains(event.target);
						const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
						if (isKeyDownInside && isCloseKey) {
							context.onOpenChange(false);
							subContext.trigger?.focus();
							event.preventDefault();
						}
					})
				})
			})
		})
	});
});
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
	return open ? "open" : "closed";
}
function isIndeterminate(checked) {
	return checked === "indeterminate";
}
function getCheckedState(checked) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus();
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
function wrapArray$1(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray$1(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const ii = polygon[i];
		const jj = polygon[j];
		const xi = ii.x;
		const yi = ii.y;
		const xj = jj.x;
		const yj = jj.y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function isPointerInGraceArea(event, area) {
	if (!area) return false;
	return isPointInPolygon({
		x: event.clientX,
		y: event.clientY
	}, area);
}
function whenMouse(handler) {
	return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal$2 = MenuPortal;
var Content2$2 = MenuContent;
var Group$1 = MenuGroup;
var Label = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator$1 = MenuItemIndicator;
var Separator$2 = MenuSeparator;
var Arrow2 = MenuArrow;
var Sub = MenuSub;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-dropdown-me_6cd9b771d1286a070fa3179e8cb914be/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs
var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(DROPDOWN_MENU_NAME, [createMenuScope]);
var useMenuScope = createMenuScope();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu$1 = (props) => {
	const { __scopeDropdownMenu, children, dir, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const triggerRef = import_react.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DROPDOWN_MENU_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuProvider, {
		scope: __scopeDropdownMenu,
		triggerId: useId(),
		triggerRef,
		contentId: useId(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, {
			...menuScope,
			open,
			onOpenChange: setOpen,
			dir,
			modal,
			children
		})
	});
};
DropdownMenu$1.displayName = DROPDOWN_MENU_NAME;
var TRIGGER_NAME$2 = "DropdownMenuTrigger";
var DropdownMenuTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
	const context = useDropdownMenuContext(TRIGGER_NAME$2, __scopeDropdownMenu);
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor2, {
		asChild: true,
		...menuScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
			type: "button",
			id: context.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": context.open ? context.contentId : void 0,
			"data-state": context.open ? "open" : "closed",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			...triggerProps,
			ref: composeRefs(forwardedRef, context.triggerRef),
			onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) {
					context.onOpenToggle();
					if (!context.open) event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (disabled) return;
				if (["Enter", " "].includes(event.key)) context.onOpenToggle();
				if (event.key === "ArrowDown") context.onOpenChange(true);
				if ([
					"Enter",
					" ",
					"ArrowDown"
				].includes(event.key)) event.preventDefault();
			})
		})
	});
});
DropdownMenuTrigger$1.displayName = TRIGGER_NAME$2;
var PORTAL_NAME$2 = "DropdownMenuPortal";
var DropdownMenuPortal$1 = (props) => {
	const { __scopeDropdownMenu, ...portalProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$2, {
		...menuScope,
		...portalProps
	});
};
DropdownMenuPortal$1.displayName = PORTAL_NAME$2;
var CONTENT_NAME$2 = "DropdownMenuContent";
var DropdownMenuContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...contentProps } = props;
	const context = useDropdownMenuContext(CONTENT_NAME$2, __scopeDropdownMenu);
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const hasInteractedOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$2, {
		id: context.contentId,
		"aria-labelledby": context.triggerId,
		...menuScope,
		...contentProps,
		ref: forwardedRef,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
			hasInteractedOutsideRef.current = false;
			event.preventDefault();
		}),
		onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
			if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
		}),
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
DropdownMenuContent$1.displayName = CONTENT_NAME$2;
var GROUP_NAME$1 = "DropdownMenuGroup";
var DropdownMenuGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...groupProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group$1, {
		...menuScope,
		...groupProps,
		ref: forwardedRef
	});
});
DropdownMenuGroup$1.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "DropdownMenuLabel";
var DropdownMenuLabel$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...labelProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		...menuScope,
		...labelProps,
		ref: forwardedRef
	});
});
DropdownMenuLabel$1.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "DropdownMenuItem";
var DropdownMenuItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...itemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2$1, {
		...menuScope,
		...itemProps,
		ref: forwardedRef
	});
});
DropdownMenuItem$1.displayName = ITEM_NAME$1;
var CHECKBOX_ITEM_NAME = "DropdownMenuCheckboxItem";
var DropdownMenuCheckboxItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...checkboxItemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxItem, {
		...menuScope,
		...checkboxItemProps,
		ref: forwardedRef
	});
});
DropdownMenuCheckboxItem$1.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "DropdownMenuRadioGroup";
var DropdownMenuRadioGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...radioGroupProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
		...menuScope,
		...radioGroupProps,
		ref: forwardedRef
	});
});
DropdownMenuRadioGroup$1.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "DropdownMenuRadioItem";
var DropdownMenuRadioItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...radioItemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioItem, {
		...menuScope,
		...radioItemProps,
		ref: forwardedRef
	});
});
DropdownMenuRadioItem$1.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "DropdownMenuItemIndicator";
var DropdownMenuItemIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator$1, {
		...menuScope,
		...itemIndicatorProps,
		ref: forwardedRef
	});
});
DropdownMenuItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME$1 = "DropdownMenuSeparator";
var DropdownMenuSeparator$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...separatorProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$2, {
		...menuScope,
		...separatorProps,
		ref: forwardedRef
	});
});
DropdownMenuSeparator$1.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$1 = "DropdownMenuArrow";
var DropdownMenuArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...arrowProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow2, {
		...menuScope,
		...arrowProps,
		ref: forwardedRef
	});
});
DropdownMenuArrow.displayName = ARROW_NAME$1;
var DropdownMenuSub$1 = (props) => {
	const { __scopeDropdownMenu, children, open: openProp, onOpenChange, defaultOpen } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: "DropdownMenuSub"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sub, {
		...menuScope,
		open,
		onOpenChange: setOpen,
		children
	});
};
var SUB_TRIGGER_NAME = "DropdownMenuSubTrigger";
var DropdownMenuSubTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...subTriggerProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubTrigger, {
		...menuScope,
		...subTriggerProps,
		ref: forwardedRef
	});
});
DropdownMenuSubTrigger$1.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "DropdownMenuSubContent";
var DropdownMenuSubContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDropdownMenu, ...subContentProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent, {
		...menuScope,
		...subContentProps,
		ref: forwardedRef,
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
DropdownMenuSubContent$1.displayName = SUB_CONTENT_NAME;
var Root2$1 = DropdownMenu$1;
var Trigger$2 = DropdownMenuTrigger$1;
var Portal2 = DropdownMenuPortal$1;
var Content2$1 = DropdownMenuContent$1;
var Group2 = DropdownMenuGroup$1;
var Label2 = DropdownMenuLabel$1;
var Item2 = DropdownMenuItem$1;
var CheckboxItem2 = DropdownMenuCheckboxItem$1;
var RadioGroup2 = DropdownMenuRadioGroup$1;
var RadioItem2 = DropdownMenuRadioItem$1;
var ItemIndicator2 = DropdownMenuItemIndicator;
var Separator2 = DropdownMenuSeparator$1;
var Sub2 = DropdownMenuSub$1;
var SubTrigger2 = DropdownMenuSubTrigger$1;
var SubContent2 = DropdownMenuSubContent$1;
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function DropdownMenu({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$1, {
		"data-slot": "dropdown-menu",
		...props
	});
}
function DropdownMenuPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, {
		"data-slot": "dropdown-menu-portal",
		...props
	});
}
function DropdownMenuTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$2, {
		"data-slot": "dropdown-menu-trigger",
		...props
	});
}
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		"data-slot": "dropdown-menu-content",
		sideOffset,
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border p-1 shadow-md", className),
		...props
	}) });
}
function DropdownMenuGroup({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group2, {
		"data-slot": "dropdown-menu-group",
		...props
	});
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		"data-slot": "dropdown-menu-item",
		"data-inset": inset,
		"data-variant": variant,
		className: cn("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
		...props
	});
}
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
		"data-slot": "dropdown-menu-checkbox-item",
		className: cn("focus:bg-accent focus:text-accent-foreground outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
		checked,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), children]
	});
}
function DropdownMenuRadioGroup({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup2, {
		"data-slot": "dropdown-menu-radio-group",
		...props
	});
}
function DropdownMenuRadioItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
		"data-slot": "dropdown-menu-radio-item",
		className: cn("focus:bg-accent focus:text-accent-foreground outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-2 fill-current" }) })
		}), children]
	});
}
function DropdownMenuLabel({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
		"data-slot": "dropdown-menu-label",
		"data-inset": inset,
		className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		"data-slot": "dropdown-menu-separator",
		className: cn("bg-border -mx-1 my-1 h-px", className),
		...props
	});
}
function DropdownMenuSub({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sub2, {
		"data-slot": "dropdown-menu-sub",
		...props
	});
}
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
		"data-slot": "dropdown-menu-sub-trigger",
		"data-inset": inset,
		className: cn("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-hidden flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm data-[inset]:pl-8", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4" })]
	});
}
function DropdownMenuSubContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
		"data-slot": "dropdown-menu-sub-content",
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin) z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg", className),
		...props
	});
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-primitive@2_79f9cc29726bbcca5df2cac469f5e931/node_modules/@radix-ui/react-primitive/dist/index.mjs
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot$1(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-separator@1_35c53c555750bc91a5b469d5f137708e/node_modules/@radix-ui/react-separator/dist/index.mjs
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = import_react.forwardRef((props, forwardedRef) => {
	const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
	const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
	const semanticProps = decorative ? { role: "none" } : {
		"aria-orientation": orientation === "vertical" ? orientation : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-orientation": orientation,
		...semanticProps,
		...domProps,
		ref: forwardedRef
	});
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
	return ORIENTATIONS.includes(orientation);
}
var Root$2 = Separator$1;
//#endregion
//#region src/components/ui/separator.tsx
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		"data-slot": "separator",
		decorative,
		orientation,
		className: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px", className),
		...props
	});
}
//#endregion
//#region src/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3$1, {
		"data-slot": "tooltip",
		...props
	}) });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$3, {
		"data-slot": "tooltip-trigger",
		asChild: true,
		...props
	});
}
function TooltipContent$1({ className, sideOffset = 24, children, ...props }) {
	const contentRef = import_react.useRef(null);
	const [offset, setOffset] = import_react.useState({
		left: 0,
		top: 0
	});
	import_react.useEffect(() => {
		const handleMouseMove = (event) => {
			const x = event.clientX;
			const y = event.clientY;
			if (contentRef.current) {
				const { width, height } = contentRef.current.getBoundingClientRect();
				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;
				let left = x + sideOffset;
				let top = y + sideOffset;
				if (left + width > viewportWidth) left = x - width - sideOffset;
				if (top + height > viewportHeight) top = y - height - sideOffset;
				left = Math.max(0, Math.min(left, viewportWidth - width));
				top = Math.max(0, Math.min(top, viewportHeight - height));
				setOffset({
					left,
					top
				});
			}
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [sideOffset]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$3, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$3, {
		ref: contentRef,
		"data-slot": "tooltip-content",
		hideWhenDetached: true,
		className: cn("bg-primary/75 border-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 pointer-events-none fixed z-50 w-max rounded-md border px-3 py-1.5 text-xs text-balance", className),
		style: {
			...props.style,
			left: offset.left,
			top: offset.top
		},
		...props,
		children
	}) });
}
//#endregion
//#region src/components/ui/toolbar.tsx
function Toolbar({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root4, {
		className: cn("relative flex select-none items-center", className),
		...props
	});
}
function ToolbarToggleGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarToggleGroup$1, {
		className: cn("flex items-center", className),
		...props
	});
}
var toolbarButtonVariants = cva("inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-checked:bg-accent aria-checked:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	defaultVariants: {
		size: "default",
		variant: "default"
	},
	variants: {
		size: {
			default: "h-9 min-w-9 px-2",
			lg: "h-10 min-w-10 px-2.5",
			sm: "h-8 min-w-8 px-1.5"
		},
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
		}
	}
});
var dropdownArrowVariants = cva(cn("inline-flex items-center justify-center rounded-r-md text-sm font-medium text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50"), {
	defaultVariants: {
		size: "sm",
		variant: "default"
	},
	variants: {
		size: {
			default: "h-9 w-6",
			lg: "h-10 w-8",
			sm: "h-8 w-4"
		},
		variant: {
			default: "bg-transparent hover:bg-muted hover:text-muted-foreground aria-checked:bg-accent aria-checked:text-accent-foreground",
			outline: "border border-l-0 border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
		}
	}
});
var ToolbarButton = withTooltip(function ToolbarButton({ children, className, isDropdown, pressed, size = "sm", variant, ...props }) {
	return typeof pressed === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarToggleGroup, {
		disabled: props.disabled,
		value: "single",
		type: "single",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarToggleItem, {
			className: cn(toolbarButtonVariants({
				size,
				variant
			}), isDropdown && "justify-between gap-1 pr-1", className),
			value: pressed ? "single" : "",
			...props,
			children: isDropdown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center gap-2 whitespace-nowrap",
				children
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				className: "text-muted-foreground size-3.5",
				"data-icon": true
			}) })] }) : children
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: cn(toolbarButtonVariants({
			size,
			variant
		}), isDropdown && "pr-1", className),
		...props,
		children
	});
});
function ToolbarSplitButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarButton, {
		className: cn("group flex gap-0 px-0 hover:bg-transparent", className),
		...props
	});
}
function ToolbarSplitButtonPrimary({ children, className, size = "sm", variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(toolbarButtonVariants({
			size,
			variant
		}), "rounded-r-none", "group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground", className),
		...props,
		children
	});
}
function ToolbarSplitButtonSecondary({ className, size, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(dropdownArrowVariants({
			size,
			variant
		}), "group-data-[pressed=true]:bg-accent group-data-[pressed=true]:text-accent-foreground", className),
		onClick: (e) => e.stopPropagation(),
		role: "button",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			className: "text-muted-foreground size-3.5",
			"data-icon": true
		})
	});
}
function ToolbarToggleItem({ className, size = "sm", variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleItem, {
		className: cn(toolbarButtonVariants({
			size,
			variant
		}), className),
		...props
	});
}
function ToolbarGroup({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group/toolbar-group", "relative hidden has-[button]:flex", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "group-last/toolbar-group:hidden! mx-1.5 py-0.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { orientation: "vertical" })
		})]
	});
}
function withTooltip(Component) {
	return function ExtendComponent({ tooltip, tooltipContentProps, tooltipProps, tooltipTriggerProps, ...props }) {
		const [mounted, setMounted] = import_react.useState(false);
		import_react.useEffect(() => {
			setMounted(true);
		}, []);
		const component = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { ...props });
		if (tooltip && mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, {
			...tooltipProps,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
				asChild: true,
				...tooltipTriggerProps,
				children: component
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
				...tooltipContentProps,
				children: tooltip
			})]
		});
		return component;
	};
}
function TooltipContent({ children, className, sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$3, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$3, {
		className: cn("origin-(--radix-tooltip-content-transform-origin) bg-primary text-primary-foreground z-50 w-fit text-balance rounded-md px-3 py-1.5 text-xs", className),
		"data-slot": "tooltip-content",
		sideOffset,
		...props,
		children
	}) });
}
function ToolbarMenuGroup({ children, className, label, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: cn("hidden", "mb-0 shrink-0 peer-has-[[role=menuitem]]/menu-group:block peer-has-[[role=menuitemradio]]/menu-group:block peer-has-[[role=option]]/menu-group:block") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioGroup, {
		...props,
		className: cn("hidden", "peer/menu-group group/menu-group my-1.5 has-[[role=menuitem]]:block has-[[role=menuitemradio]]:block has-[[role=option]]:block", className),
		children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
			className: "text-muted-foreground select-none text-xs font-semibold",
			children: label
		}), children]
	})] });
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-dialog@1.1._397f5e87696b226e9b39529c4b058b0d/node_modules/@radix-ui/react-dialog/dist/index.mjs
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = import_react.useRef(null);
	const contentRef = import_react.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId(),
		titleId: useId(),
		descriptionId: useId(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children
	});
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME$1 = "DialogTrigger";
var DialogTrigger = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...triggerProps } = props;
	const context = useDialogContext(TRIGGER_NAME$1, __scopeDialog);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.contentId,
		"data-state": getState(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
});
DialogTrigger.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME$1, { forceMount: void 0 });
var DialogPortal$1 = (props) => {
	const { __scopeDialog, forceMount, children, container } = props;
	const context = useDialogContext(PORTAL_NAME$1, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
		scope: __scopeDialog,
		forceMount,
		children: import_react.Children.map(children, (child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$4, {
				asChild: true,
				container,
				children: child
			})
		}))
	});
};
DialogPortal$1.displayName = PORTAL_NAME$1;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
});
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot$1 = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot$1,
		allowPinchZoom: true,
		shards: [context.contentRef],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
			"data-state": getState(context.open),
			...overlayProps,
			ref: forwardedRef,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
});
var CONTENT_NAME$1 = "DialogContent";
var DialogContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
});
DialogContent$1.displayName = CONTENT_NAME$1;
var DialogContentModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: true,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
});
var DialogContentNonModal = import_react.forwardRef((props, forwardedRef) => {
	const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
});
var DialogContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$1, __scopeDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
			role: "dialog",
			id: context.contentId,
			"aria-describedby": context.descriptionId,
			"aria-labelledby": context.titleId,
			"data-state": getState(context.open),
			...contentProps,
			ref: composedRefs,
			onDismiss: () => context.onOpenChange(false)
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleWarning, { titleId: context.titleId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescriptionWarning, {
		contentRef,
		descriptionId: context.descriptionId
	})] })] });
});
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...titleProps } = props;
	const context = useDialogContext(TITLE_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.h2, {
		id: context.titleId,
		...titleProps,
		ref: forwardedRef
	});
});
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...descriptionProps } = props;
	const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.p, {
		id: context.descriptionId,
		...descriptionProps,
		ref: forwardedRef
	});
});
DialogDescription$1.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeDialog, ...closeProps } = props;
	const context = useDialogContext(CLOSE_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
});
DialogClose$1.displayName = CLOSE_NAME;
function getState(open) {
	return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
	contentName: CONTENT_NAME$1,
	titleName: TITLE_NAME,
	docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
	const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
	const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
	import_react.useEffect(() => {
		if (titleId) {
			if (!document.getElementById(titleId)) console.error(MESSAGE);
		}
	}, [MESSAGE, titleId]);
	return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
	const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${useWarningContext(DESCRIPTION_WARNING_NAME).contentName}}.`;
	import_react.useEffect(() => {
		const describedById = contentRef.current?.getAttribute("aria-describedby");
		if (descriptionId && describedById) {
			if (!document.getElementById(descriptionId)) console.warn(MESSAGE);
		}
	}, [
		MESSAGE,
		contentRef,
		descriptionId
	]);
	return null;
};
var Root$1 = Dialog$1;
var Trigger$1 = DialogTrigger;
var Portal$1 = DialogPortal$1;
var Overlay = DialogOverlay$1;
var Content = DialogContent$1;
var Title = DialogTitle$1;
var Description = DialogDescription$1;
var Close = DialogClose$1;
//#endregion
//#region \0virtual:original-class-name
var getOriginalNameOf = (value) => value.name;
//#endregion
//#region src/core/service/FeatureFlags.tsx
var hasApiBaseUrl = "".trim() !== "";
var FeatureFlags;
(function(_FeatureFlags) {
	_FeatureFlags.USER = hasApiBaseUrl;
	_FeatureFlags.AI = hasApiBaseUrl;
	_FeatureFlags.TELEMETRY = hasApiBaseUrl;
})(FeatureFlags || (FeatureFlags = {}));
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/image.js
/** An RGBA Image in row-major order from top to bottom. */
var Image = class Image extends Resource {
	/**
	* Creates an Image from a resource ID. For internal use only.
	*
	* @ignore
	*/
	constructor(rid) {
		super(rid);
	}
	/** Creates a new Image using RGBA data, in row-major order from top to bottom, and with specified width and height. */
	static async new(rgba, width, height) {
		return invoke("plugin:image|new", {
			rgba: transformImage(rgba),
			width,
			height
		}).then((rid) => new Image(rid));
	}
	/**
	* Creates a new image using the provided bytes by inferring the file format.
	* If the format is known, prefer [@link Image.fromPngBytes] or [@link Image.fromIcoBytes].
	*
	* Only `ico` and `png` are supported (based on activated feature flag).
	*
	* Note that you need the `image-ico` or `image-png` Cargo features to use this API.
	* To enable it, change your Cargo.toml file:
	* ```toml
	* [dependencies]
	* tauri = { version = "...", features = ["...", "image-png"] }
	* ```
	*/
	static async fromBytes(bytes) {
		return invoke("plugin:image|from_bytes", { bytes: transformImage(bytes) }).then((rid) => new Image(rid));
	}
	/**
	* Creates a new image using the provided path.
	*
	* Only `ico` and `png` are supported (based on activated feature flag).
	*
	* Note that you need the `image-ico` or `image-png` Cargo features to use this API.
	* To enable it, change your Cargo.toml file:
	* ```toml
	* [dependencies]
	* tauri = { version = "...", features = ["...", "image-png"] }
	* ```
	*/
	static async fromPath(path) {
		return invoke("plugin:image|from_path", { path }).then((rid) => new Image(rid));
	}
	/** Returns the RGBA data for this image, in row-major order from top to bottom.  */
	async rgba() {
		return invoke("plugin:image|rgba", { rid: this.rid }).then((buffer) => new Uint8Array(buffer));
	}
	/** Returns the size of this image.  */
	async size() {
		return invoke("plugin:image|size", { rid: this.rid });
	}
};
/**
* Transforms image from various types into a type acceptable by Rust.
*
* See [tauri::image::JsImage](https://docs.rs/tauri/2/tauri/image/enum.JsImage.html) for more information.
* Note the API signature is not stable and might change.
*/
function transformImage(image) {
	return image == null ? null : typeof image === "string" ? image : image instanceof Image ? image.rid : image;
}
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/app.js
/**
* Bundle type of the current application.
*/
var BundleType;
(function(BundleType) {
	/** Windows NSIS */
	BundleType["Nsis"] = "nsis";
	/** Windows MSI */
	BundleType["Msi"] = "msi";
	/** Linux Debian package */
	BundleType["Deb"] = "deb";
	/** Linux RPM */
	BundleType["Rpm"] = "rpm";
	/** Linux AppImage */
	BundleType["AppImage"] = "appimage";
	/** macOS app bundle */
	BundleType["App"] = "app";
})(BundleType || (BundleType = {}));
/**
* Application metadata and related APIs.
*
* @module
*/
/**
* Gets the application version.
* @example
* ```typescript
* import { getVersion } from '@tauri-apps/api/app';
* const appVersion = await getVersion();
* ```
*
* @since 1.0.0
*/
async function getVersion() {
	return invoke("plugin:app|version");
}
//#endregion
//#region src/utils/otherApi.tsx
async function getAppVersion() {
	if (isWeb) return "0.0.0-web";
	else return getVersion();
}
async function getDeviceId() {
	if (isWeb) return "web";
	else return invoke("get_device_id");
}
//#endregion
//#region src/core/service/Telemetry.tsx
var Telemetry;
(function(_Telemetry) {
	let deviceId = "";
	async function event(event, data = {}) {
		if (!FeatureFlags.TELEMETRY) return;
		if (!Settings.telemetry) return;
		if (!deviceId) deviceId = await getDeviceId();
		try {
			await fetch("undefined/api/telemetry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					event,
					user: deviceId,
					data
				})
			});
		} catch (e) {
			console.warn(e);
		}
	}
	_Telemetry.event = event;
})(Telemetry || (Telemetry = {}));
//#endregion
//#region src/core/Tab.tsx
var Tab = class extends import_react.Component {
	id = crypto.randomUUID();
	layout = "docked";
	floatingRect = new Rectangle(Vector.getZero(), Vector.same(100));
	zIndex = 0;
	closing = false;
	canDock = true;
	closable = true;
	closeOnEscape = true;
	closeWhenClickOutside = false;
	closeWhenClickInside = false;
	titleBarOverlay = false;
	eventEmitter = new EventEmitter();
	services = /* @__PURE__ */ new Map();
	fileSystemProviders = /* @__PURE__ */ new Map();
	tickableServices = [];
	rafHandle = -1;
	lastTickTime = 0;
	get title() {
		return this.constructor.name;
	}
	get icon() {
		return null;
	}
	constructor(props) {
		super(props);
	}
	/**
	* 注册一个文件管理器
	* @param scheme 目前有 "file" | "draft"， 以后可能有其他的协议
	*/
	registerFileSystemProvider(scheme, provider) {
		this.fileSystemProviders.set(scheme, new provider(this));
	}
	get fs() {
		return this.fileSystemProviders.get(this.uri.scheme);
	}
	on(event, listener) {
		this.eventEmitter.on(event, listener);
		return this;
	}
	off(event, listener) {
		this.eventEmitter.off(event, listener);
		return this;
	}
	emit(event, ...args) {
		return this.eventEmitter.emit(event, ...args);
	}
	removeAllListeners(event) {
		if (event === void 0) this.eventEmitter.removeAllListeners();
		else this.eventEmitter.removeAllListeners(event);
		return this;
	}
	/**
	* 立刻加载一个新的服务
	*/
	loadService(service) {
		if (!service.id) {
			service.id = crypto.randomUUID();
			console.warn("[Tab] 服务 %o 未指定 ID，自动生成：%s", service, service.id);
		}
		const inst = new service(this);
		this.services.set(service.id, inst);
		if ("tick" in inst) this.tickableServices.push(inst);
		this[service.id] = inst;
	}
	/**
	* 立刻销毁一个服务
	*/
	disposeService(serviceId) {
		const service = this.services.get(serviceId);
		if (service) {
			service.dispose?.();
			this.services.delete(serviceId);
			const index = this.tickableServices.indexOf(service);
			if (index !== -1) this.tickableServices.splice(index, 1);
		}
	}
	/**
	* 获取某个服务的实例
	*/
	getService(serviceId) {
		return this.services.get(serviceId);
	}
	async init() {}
	loop() {
		if (this.rafHandle !== -1) return;
		const startTime = performance.now();
		let ticksExecuted = 0;
		const animationFrame = (time) => {
			const isFocused = document.hasFocus();
			const timeStep = 1e3 / Math.max(1, isFocused ? Settings.maxFps : Settings.maxFpsUnfocused);
			const totalElapsed = time - startTime;
			const expectedTicks = Math.floor(totalElapsed / timeStep);
			let ticksNeeded = expectedTicks - ticksExecuted;
			if (ticksNeeded > 10) {
				ticksExecuted = expectedTicks;
				ticksNeeded = 0;
			}
			while (ticksNeeded > 0) {
				this.tick();
				ticksExecuted++;
				ticksNeeded--;
			}
			this.rafHandle = requestAnimationFrame(animationFrame);
		};
		this.rafHandle = requestAnimationFrame(animationFrame);
	}
	pause() {
		if (this.rafHandle === -1) return;
		cancelAnimationFrame(this.rafHandle);
		this.rafHandle = -1;
	}
	tick() {
		for (const service of this.tickableServices) try {
			service.tick?.();
		} catch (e) {
			console.error("[%s] %o", service, e);
			const index = this.tickableServices.indexOf(service);
			if (index !== -1) this.tickableServices.splice(index, 1);
			Dialog.buttons(`${getOriginalNameOf(service.constructor)} 发生未知错误`, String(e), [{
				id: "cancel",
				label: "取消",
				variant: "ghost"
			}, {
				id: "ok",
				label: "确定"
			}]);
			if (e !== null && typeof e === "object" && "message" in e && e.message === "test") continue;
			toast.promise(Telemetry.event("服务tick方法报错", {
				service: getOriginalNameOf(service.constructor),
				error: String(e)
			}), {
				loading: "正在上报错误",
				success: "错误信息已发送给开发者",
				error: "上报失败"
			});
		}
	}
	async dispose() {
		this.pause();
		const cleanupTasks = [];
		for (const service of this.services.values()) try {
			cleanupTasks.push(Promise.resolve(service.dispose?.()));
		} catch (error) {
			cleanupTasks.push(Promise.reject(error));
		}
		const cleanupResults = await Promise.allSettled(cleanupTasks);
		this.services.clear();
		this.fileSystemProviders.clear();
		this.tickableServices.length = 0;
		this.removeAllListeners();
		const cleanupErrors = cleanupResults.filter((result) => result.status === "rejected").map(({ reason }) => reason);
		if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, "Tab cleanup failed");
	}
	get isRunning() {
		return this.rafHandle !== -1;
	}
	render() {
		return null;
	}
};
function isResourceTab(tab) {
	return "uri" in tab;
}
var ComponentTab = class extends Tab {
	tabTitle;
	tabIcon;
	contextTarget;
	contextResourceTab;
	children;
	component;
	constructor(options) {
		super({});
		this.tabTitle = options.title ?? "";
		this.tabIcon = options.icon ?? null;
		this.contextTarget = options.contextTarget;
		this.contextResourceTab = options.contextResourceTab;
		this.children = options.children;
		this.layout = options.layout ?? "floating";
		this.floatingRect = options.rect ?? this.floatingRect;
		this.canDock = options.canDock ?? true;
		this.closable = options.closable ?? true;
		this.closeOnEscape = options.closeOnEscape ?? true;
		this.closeWhenClickOutside = options.closeWhenClickOutside ?? false;
		this.closeWhenClickInside = options.closeWhenClickInside ?? false;
		this.titleBarOverlay = options.titleBarOverlay ?? false;
		this.component = () => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentTabContext.Provider, {
				value: this,
				children: typeof this.children === "function" ? this.children(this) : this.children
			});
		};
	}
	get title() {
		return this.tabTitle;
	}
	get icon() {
		return this.tabIcon;
	}
	getComponent() {
		return this.component;
	}
};
var ComponentTabContext = import_react.createContext(void 0);
//#endregion
//#region src/core/TabGroup.ts
/** Stable group ids for default left/right docked panels. Empty groups still collapse; ids are recreated on next open. */
var FIXED_SIDE_GROUP_IDS = {
	left: "pg-side-left",
	right: "pg-side-right"
};
function isFixedSideGroupId(id) {
	return id === FIXED_SIDE_GROUP_IDS.left || id === FIXED_SIDE_GROUP_IDS.right;
}
function createTabGroup(tabIds = [], id = crypto.randomUUID()) {
	return {
		id,
		type: "group",
		tabIds,
		activeTabId: tabIds.at(-1)
	};
}
function getTabGroups(root) {
	if (!root) return [];
	if (root.type === "group") return [root];
	return [...getTabGroups(root.children[0]), ...getTabGroups(root.children[1])];
}
function findTabGroup(root, groupId) {
	return getTabGroups(root).find((group) => group.id === groupId);
}
function findTabGroupByTabId(root, tabId) {
	return getTabGroups(root).find((group) => group.tabIds.includes(tabId));
}
function updateTabGroup(root, groupId, update) {
	if (!root) return null;
	if (root.type === "group") return root.id === groupId ? update(root) : root;
	const first = updateTabGroup(root.children[0], groupId, update);
	const second = updateTabGroup(root.children[1], groupId, update);
	if (!first || !second) return first ?? second;
	if (first === root.children[0] && second === root.children[1]) return root;
	return {
		...root,
		children: [first, second]
	};
}
function insertTabIntoGroup(root, groupId, tabId, index) {
	return updateTabGroup(root, groupId, (group) => {
		const tabIds = group.tabIds.filter((candidate) => candidate !== tabId);
		tabIds.splice(Math.max(0, Math.min(index ?? tabIds.length, tabIds.length)), 0, tabId);
		return {
			...group,
			tabIds,
			activeTabId: tabId
		};
	});
}
function removeTabFromGroups(root, tabId) {
	const source = findTabGroupByTabId(root, tabId);
	if (!source) return { root };
	const removedIndex = source.tabIds.indexOf(tabId);
	const remaining = source.tabIds.filter((candidate) => candidate !== tabId);
	const nextActiveTabId = source.activeTabId === tabId ? remaining[Math.min(removedIndex, remaining.length - 1)] : source.activeTabId && remaining.includes(source.activeTabId) ? source.activeTabId : remaining.at(-1);
	const remove = (node) => {
		if (node.type === "group") {
			if (node.id !== source.id) return node;
			return remaining.length > 0 ? {
				...node,
				tabIds: remaining,
				activeTabId: nextActiveTabId
			} : null;
		}
		const first = remove(node.children[0]);
		const second = remove(node.children[1]);
		if (!first) return second;
		if (!second) return first;
		if (first === node.children[0] && second === node.children[1]) return node;
		return {
			...node,
			children: [first, second]
		};
	};
	return {
		root: root ? remove(root) : null,
		sourceGroupId: source.id,
		nextActiveTabId
	};
}
function splitTabGroup(root, targetGroupId, newGroup, edge, splitId = crypto.randomUUID(), sizes) {
	if (!root) return newGroup;
	const direction = edge === "left" || edge === "right" ? "horizontal" : "vertical";
	const newGroupFirst = edge === "left" || edge === "top";
	const resolvedSizes = sizes ?? (direction === "horizontal" ? newGroupFirst ? [20, 80] : [80, 20] : [50, 50]);
	const replace = (node) => {
		if (node.type === "group") {
			if (node.id !== targetGroupId) return node;
			return {
				id: splitId,
				type: "split",
				direction,
				children: newGroupFirst ? [newGroup, node] : [node, newGroup],
				sizes: resolvedSizes
			};
		}
		const first = replace(node.children[0]);
		const second = replace(node.children[1]);
		if (first === node.children[0] && second === node.children[1]) return node;
		return {
			...node,
			children: [first, second]
		};
	};
	return replace(root);
}
function updateTabSplitSizes(root, splitId, sizes) {
	if (!root || root.type === "group") return root;
	if (root.id === splitId) return {
		...root,
		sizes
	};
	const first = updateTabSplitSizes(root.children[0], splitId, sizes);
	const second = updateTabSplitSizes(root.children[1], splitId, sizes);
	if (!first || !second || first === root.children[0] && second === root.children[1]) return root;
	return {
		...root,
		children: [first, second]
	};
}
//#endregion
//#region ../node_modules/.pnpm/jotai@2.20.1_@babel+core@7._2fd289d4de4e7145b9da18fd397d5fc1/node_modules/jotai/esm/vanilla/internals.mjs
function hasInitialValue(atom) {
	return "init" in atom;
}
function isActuallyWritableAtom(atom) {
	return typeof atom.write === "function";
}
function hasOnMount(atom) {
	return !!atom.onMount;
}
function isAtomStateInitialized(atomState) {
	return "v" in atomState || "e" in atomState;
}
function returnAtomValue(atomState) {
	if ("e" in atomState) throw atomState.e;
	return atomState.v;
}
function isPromiseLike$1(p) {
	return typeof (p == null ? void 0 : p.then) === "function";
}
function shouldThrowSynchronously(error) {
	if (!(error instanceof Error)) return false;
	const name = error.name;
	const message = error.message.toLowerCase();
	return (name === "RangeError" || name === "InternalError") && (message.includes("call stack") || message.includes("too much recursion") || message.includes("stack overflow"));
}
function addPendingPromiseToDependency(atom, promise, dependencyAtomState) {
	if (!dependencyAtomState.p.has(atom)) {
		dependencyAtomState.p.add(atom);
		const cleanup = () => dependencyAtomState.p.delete(atom);
		promise.then(cleanup, cleanup);
	}
}
function getMountedOrPendingDependents(atom, atomState, mountedMap) {
	const mounted = mountedMap.get(atom);
	const mountedDependents = mounted == null ? void 0 : mounted.t;
	const pendingDependents = atomState.p;
	if (!(mountedDependents == null ? void 0 : mountedDependents.size)) return pendingDependents;
	if (!pendingDependents.size) return mountedDependents;
	const dependents = new Set(mountedDependents);
	for (const a of pendingDependents) dependents.add(a);
	return dependents;
}
function hasOnInit(atom) {
	return !!atom.INTERNAL_onInit;
}
var BUILDING_BLOCK_atomRead = (_buildingBlocks, _store, atom, ...params) => atom.read(...params);
var BUILDING_BLOCK_atomWrite = (_buildingBlocks, _store, atom, ...params) => atom.write(...params);
var BUILDING_BLOCK_atomOnInit = (_buildingBlocks, store, atom) => atom.INTERNAL_onInit(store);
var BUILDING_BLOCK_atomOnMount = (_buildingBlocks, _store, atom, setAtom) => {
	var _a;
	return (_a = atom.onMount) == null ? void 0 : _a.call(atom, setAtom);
};
var BUILDING_BLOCK_ensureAtomState = (buildingBlocks, store, atom) => {
	var _a;
	const atomStateMap = buildingBlocks[0];
	let atomState = atomStateMap.get(atom);
	if (!atomState) {
		const storeHooks = buildingBlocks[6];
		const atomOnInit = buildingBlocks[9];
		atomState = {
			d: /* @__PURE__ */ new Map(),
			p: /* @__PURE__ */ new Set(),
			n: 0
		};
		atomStateMap.set(atom, atomState);
		(_a = storeHooks.i) == null || _a.call(storeHooks, atom);
		if (hasOnInit(atom)) atomOnInit(buildingBlocks, store, atom);
	}
	return atomState;
};
var BUILDING_BLOCK_flushCallbacks = (buildingBlocks, store) => {
	var _a;
	const mountedMap = buildingBlocks[1];
	const changedAtoms = buildingBlocks[3];
	const mountCallbacks = buildingBlocks[4];
	const unmountCallbacks = buildingBlocks[5];
	const storeHooks = buildingBlocks[6];
	const recomputeInvalidatedAtoms = buildingBlocks[13];
	if (!storeHooks.f && !changedAtoms.size && !mountCallbacks.size && !unmountCallbacks.size) return;
	const errors = [];
	const call = (fn) => {
		try {
			fn();
		} catch (e) {
			errors.push(e);
		}
	};
	do {
		if (storeHooks.f) call(storeHooks.f);
		const callbacks = /* @__PURE__ */ new Set();
		for (const atom of changedAtoms) {
			const listeners = (_a = mountedMap.get(atom)) == null ? void 0 : _a.l;
			if (listeners) for (const listener of listeners) callbacks.add(listener);
		}
		changedAtoms.clear();
		for (const fn of unmountCallbacks) callbacks.add(fn);
		unmountCallbacks.clear();
		for (const fn of mountCallbacks) callbacks.add(fn);
		mountCallbacks.clear();
		for (const fn of callbacks) call(fn);
		if (changedAtoms.size) recomputeInvalidatedAtoms(buildingBlocks, store);
	} while (changedAtoms.size || unmountCallbacks.size || mountCallbacks.size);
	if (errors.length) throw new AggregateError(errors);
};
var BUILDING_BLOCK_recomputeInvalidatedAtoms = (buildingBlocks, store) => {
	const mountedMap = buildingBlocks[1];
	const invalidatedAtoms = buildingBlocks[2];
	const changedAtoms = buildingBlocks[3];
	const ensureAtomState = buildingBlocks[11];
	const readAtomState = buildingBlocks[14];
	const mountDependencies = buildingBlocks[17];
	if (!changedAtoms.size) return;
	const sortedReversedAtoms = [];
	const sortedReversedStates = [];
	const visiting = /* @__PURE__ */ new WeakSet();
	const visited = /* @__PURE__ */ new WeakSet();
	const stackAtoms = [];
	const stackStates = [];
	for (const atom of changedAtoms) {
		stackAtoms.push(atom);
		stackStates.push(ensureAtomState(buildingBlocks, store, atom));
	}
	while (stackAtoms.length) {
		const top = stackAtoms.length - 1;
		const a = stackAtoms[top];
		const aState = stackStates[top];
		if (visited.has(a)) {
			stackAtoms.pop();
			stackStates.pop();
			continue;
		}
		if (visiting.has(a)) {
			if (invalidatedAtoms.get(a) === aState.n) {
				sortedReversedAtoms.push(a);
				sortedReversedStates.push(aState);
			}
			visited.add(a);
			stackAtoms.pop();
			stackStates.pop();
			continue;
		}
		visiting.add(a);
		for (const d of getMountedOrPendingDependents(a, aState, mountedMap)) if (!visiting.has(d)) {
			stackAtoms.push(d);
			stackStates.push(ensureAtomState(buildingBlocks, store, d));
		}
	}
	for (let i = sortedReversedAtoms.length - 1; i >= 0; --i) {
		const a = sortedReversedAtoms[i];
		const aState = sortedReversedStates[i];
		let hasChangedDeps = false;
		for (const dep of aState.d.keys()) if (dep !== a && changedAtoms.has(dep)) {
			hasChangedDeps = true;
			break;
		}
		if (hasChangedDeps) {
			invalidatedAtoms.set(a, aState.n);
			readAtomState(buildingBlocks, store, a);
			mountDependencies(buildingBlocks, store, a);
		}
		invalidatedAtoms.delete(a);
	}
};
var BUILDING_BLOCK_readAtomState = (buildingBlocks, store, atom) => {
	var _a, _b;
	const mountedMap = buildingBlocks[1];
	const invalidatedAtoms = buildingBlocks[2];
	const changedAtoms = buildingBlocks[3];
	const storeHooks = buildingBlocks[6];
	const atomRead = buildingBlocks[7];
	const ensureAtomState = buildingBlocks[11];
	const flushCallbacks = buildingBlocks[12];
	const recomputeInvalidatedAtoms = buildingBlocks[13];
	const readAtomState = buildingBlocks[14];
	const writeAtomState = buildingBlocks[16];
	const mountDependencies = buildingBlocks[17];
	const setAtomStateValueOrPromise = buildingBlocks[20];
	const registerAbortHandler = buildingBlocks[26];
	const storeEpochHolder = buildingBlocks[28];
	const atomState = ensureAtomState(buildingBlocks, store, atom);
	const storeEpochNumber = storeEpochHolder[0];
	if (isAtomStateInitialized(atomState)) {
		if (mountedMap.has(atom) && invalidatedAtoms.get(atom) !== atomState.n || atomState.m === storeEpochNumber) {
			atomState.m = storeEpochNumber;
			return atomState;
		}
		let hasChangedDeps = false;
		for (const [a, n] of atomState.d) if (readAtomState(buildingBlocks, store, a).n !== n) {
			hasChangedDeps = true;
			break;
		}
		if (!hasChangedDeps) {
			atomState.m = storeEpochNumber;
			return atomState;
		}
	}
	let isSync = true;
	const prevDeps = new Set(atomState.d.keys());
	const pruneDependencies = () => {
		for (const a of prevDeps) atomState.d.delete(a);
	};
	const mountDependenciesIfAsync = () => {
		if (mountedMap.has(atom)) {
			const shouldRecompute = !changedAtoms.size;
			mountDependencies(buildingBlocks, store, atom);
			if (shouldRecompute) {
				recomputeInvalidatedAtoms(buildingBlocks, store);
				flushCallbacks(buildingBlocks, store);
			}
		}
	};
	const getter = (a) => {
		var _a2;
		if (a === atom) {
			const aState2 = ensureAtomState(buildingBlocks, store, a);
			if (!isAtomStateInitialized(aState2)) if (hasInitialValue(a)) setAtomStateValueOrPromise(buildingBlocks, store, a, a.init);
			else throw new Error("no atom init");
			return returnAtomValue(aState2);
		}
		const aState = readAtomState(buildingBlocks, store, a);
		try {
			return returnAtomValue(aState);
		} finally {
			prevDeps.delete(a);
			atomState.d.set(a, aState.n);
			if (isPromiseLike$1(atomState.v)) addPendingPromiseToDependency(atom, atomState.v, aState);
			if (mountedMap.has(atom)) (_a2 = mountedMap.get(a)) == null || _a2.t.add(atom);
			if (!isSync) mountDependenciesIfAsync();
		}
	};
	let controller;
	let setSelf;
	const options = {
		get signal() {
			if (!controller) controller = new AbortController();
			return controller.signal;
		},
		get setSelf() {
			if (!setSelf && isActuallyWritableAtom(atom)) setSelf = (...args) => {
				if (!isSync) try {
					return writeAtomState(buildingBlocks, store, atom, args);
				} finally {
					recomputeInvalidatedAtoms(buildingBlocks, store);
					flushCallbacks(buildingBlocks, store);
				}
			};
			return setSelf;
		}
	};
	const prevEpochNumber = atomState.n;
	const prevInvalidated = invalidatedAtoms.get(atom) === prevEpochNumber;
	try {
		const valueOrPromise = atomRead(buildingBlocks, store, atom, getter, options);
		setAtomStateValueOrPromise(buildingBlocks, store, atom, valueOrPromise);
		if (isPromiseLike$1(valueOrPromise)) {
			registerAbortHandler(buildingBlocks, store, valueOrPromise, () => controller == null ? void 0 : controller.abort());
			const settle = () => {
				pruneDependencies();
				mountDependenciesIfAsync();
			};
			valueOrPromise.then(settle, settle);
		} else pruneDependencies();
		(_a = storeHooks.r) == null || _a.call(storeHooks, atom);
		atomState.m = storeEpochNumber;
		return atomState;
	} catch (error) {
		if (shouldThrowSynchronously(error)) throw error;
		delete atomState.v;
		atomState.e = error;
		++atomState.n;
		atomState.m = storeEpochNumber;
		return atomState;
	} finally {
		isSync = false;
		if (atomState.n !== prevEpochNumber && prevInvalidated) {
			invalidatedAtoms.set(atom, atomState.n);
			changedAtoms.add(atom);
			(_b = storeHooks.c) == null || _b.call(storeHooks, atom);
		}
	}
};
var BUILDING_BLOCK_invalidateDependents = (buildingBlocks, store, atom) => {
	const mountedMap = buildingBlocks[1];
	const invalidatedAtoms = buildingBlocks[2];
	const ensureAtomState = buildingBlocks[11];
	const stack = [atom];
	while (stack.length) {
		const a = stack.pop();
		const aState = ensureAtomState(buildingBlocks, store, a);
		for (const d of getMountedOrPendingDependents(a, aState, mountedMap)) {
			const dState = ensureAtomState(buildingBlocks, store, d);
			if (invalidatedAtoms.get(d) !== dState.n) {
				invalidatedAtoms.set(d, dState.n);
				stack.push(d);
			}
		}
	}
};
var BUILDING_BLOCK_writeAtomState = (buildingBlocks, store, atom, args) => {
	const changedAtoms = buildingBlocks[3];
	const storeHooks = buildingBlocks[6];
	const atomWrite = buildingBlocks[8];
	const ensureAtomState = buildingBlocks[11];
	const flushCallbacks = buildingBlocks[12];
	const recomputeInvalidatedAtoms = buildingBlocks[13];
	const readAtomState = buildingBlocks[14];
	const invalidateDependents = buildingBlocks[15];
	const writeAtomState = buildingBlocks[16];
	const mountDependencies = buildingBlocks[17];
	const setAtomStateValueOrPromise = buildingBlocks[20];
	const storeEpochHolder = buildingBlocks[28];
	let isSync = true;
	const getter = (a) => returnAtomValue(readAtomState(buildingBlocks, store, a));
	const setter = (a, ...args2) => {
		var _a;
		const aState = ensureAtomState(buildingBlocks, store, a);
		try {
			if (a === atom) {
				if (!hasInitialValue(a)) throw new Error("atom not writable");
				const prevEpochNumber = aState.n;
				const v = args2[0];
				setAtomStateValueOrPromise(buildingBlocks, store, a, v);
				mountDependencies(buildingBlocks, store, a);
				if (prevEpochNumber !== aState.n) {
					++storeEpochHolder[0];
					changedAtoms.add(a);
					invalidateDependents(buildingBlocks, store, a);
					(_a = storeHooks.c) == null || _a.call(storeHooks, a);
				}
				return;
			} else return writeAtomState(buildingBlocks, store, a, args2);
		} finally {
			if (!isSync) {
				recomputeInvalidatedAtoms(buildingBlocks, store);
				flushCallbacks(buildingBlocks, store);
			}
		}
	};
	try {
		return atomWrite(buildingBlocks, store, atom, getter, setter, ...args);
	} finally {
		isSync = false;
	}
};
var BUILDING_BLOCK_mountDependencies = (buildingBlocks, store, atom) => {
	var _a;
	const mountedMap = buildingBlocks[1];
	const changedAtoms = buildingBlocks[3];
	const storeHooks = buildingBlocks[6];
	const ensureAtomState = buildingBlocks[11];
	const invalidateDependents = buildingBlocks[15];
	const mountAtom = buildingBlocks[18];
	const unmountAtom = buildingBlocks[19];
	const atomState = ensureAtomState(buildingBlocks, store, atom);
	const mounted = mountedMap.get(atom);
	if (mounted && atomState.d.size > 0) {
		for (const [a, n] of atomState.d) if (!mounted.d.has(a)) {
			const aState = ensureAtomState(buildingBlocks, store, a);
			mountAtom(buildingBlocks, store, a).t.add(atom);
			mounted.d.add(a);
			if (n !== aState.n) {
				changedAtoms.add(a);
				invalidateDependents(buildingBlocks, store, a);
				(_a = storeHooks.c) == null || _a.call(storeHooks, a);
			}
		}
		for (const a of mounted.d) if (!atomState.d.has(a)) {
			mounted.d.delete(a);
			unmountAtom(buildingBlocks, store, a)?.t.delete(atom);
		}
	}
};
var BUILDING_BLOCK_mountAtom = (buildingBlocks, store, atom) => {
	var _a;
	const mountedMap = buildingBlocks[1];
	const mountCallbacks = buildingBlocks[4];
	const storeHooks = buildingBlocks[6];
	const atomOnMount = buildingBlocks[10];
	const ensureAtomState = buildingBlocks[11];
	const flushCallbacks = buildingBlocks[12];
	const recomputeInvalidatedAtoms = buildingBlocks[13];
	const readAtomState = buildingBlocks[14];
	const writeAtomState = buildingBlocks[16];
	const mountAtom = buildingBlocks[18];
	const atomState = ensureAtomState(buildingBlocks, store, atom);
	let mounted = mountedMap.get(atom);
	if (!mounted) {
		readAtomState(buildingBlocks, store, atom);
		for (const a of atomState.d.keys()) mountAtom(buildingBlocks, store, a).t.add(atom);
		mounted = {
			l: /* @__PURE__ */ new Set(),
			d: new Set(atomState.d.keys()),
			t: /* @__PURE__ */ new Set()
		};
		mountedMap.set(atom, mounted);
		if (isActuallyWritableAtom(atom) && hasOnMount(atom)) {
			const processOnMount = () => {
				let isSync = true;
				const setAtom = (...args) => {
					try {
						return writeAtomState(buildingBlocks, store, atom, args);
					} finally {
						if (!isSync) {
							recomputeInvalidatedAtoms(buildingBlocks, store);
							flushCallbacks(buildingBlocks, store);
						}
					}
				};
				try {
					const onUnmount = atomOnMount(buildingBlocks, store, atom, setAtom);
					if (onUnmount) mounted.u = () => {
						isSync = true;
						try {
							onUnmount();
						} finally {
							isSync = false;
						}
					};
				} finally {
					isSync = false;
				}
			};
			mountCallbacks.add(processOnMount);
		}
		(_a = storeHooks.m) == null || _a.call(storeHooks, atom);
	}
	return mounted;
};
var BUILDING_BLOCK_unmountAtom = (buildingBlocks, store, atom) => {
	var _a, _b;
	const mountedMap = buildingBlocks[1];
	const unmountCallbacks = buildingBlocks[5];
	const storeHooks = buildingBlocks[6];
	const ensureAtomState = buildingBlocks[11];
	const unmountAtom = buildingBlocks[19];
	const atomState = ensureAtomState(buildingBlocks, store, atom);
	let mounted = mountedMap.get(atom);
	if (!mounted || mounted.l.size) return mounted;
	let isDependent = false;
	for (const a of mounted.t) if ((_a = mountedMap.get(a)) == null ? void 0 : _a.d.has(atom)) {
		isDependent = true;
		break;
	}
	if (!isDependent) {
		if (mounted.u) unmountCallbacks.add(mounted.u);
		mounted = void 0;
		mountedMap.delete(atom);
		for (const a of atomState.d.keys()) unmountAtom(buildingBlocks, store, a)?.t.delete(atom);
		(_b = storeHooks.u) == null || _b.call(storeHooks, atom);
		return;
	}
	return mounted;
};
var BUILDING_BLOCK_setAtomStateValueOrPromise = (buildingBlocks, store, atom, valueOrPromise) => {
	const ensureAtomState = buildingBlocks[11];
	const abortPromise = buildingBlocks[27];
	const atomState = ensureAtomState(buildingBlocks, store, atom);
	const hasPrevValue = "v" in atomState;
	const prevValue = atomState.v;
	if (isPromiseLike$1(valueOrPromise)) for (const a of atomState.d.keys()) addPendingPromiseToDependency(atom, valueOrPromise, ensureAtomState(buildingBlocks, store, a));
	atomState.v = valueOrPromise;
	delete atomState.e;
	if (!hasPrevValue || !Object.is(prevValue, atomState.v)) {
		++atomState.n;
		if (isPromiseLike$1(prevValue)) abortPromise(buildingBlocks, store, prevValue);
	}
};
var BUILDING_BLOCK_storeGet = (buildingBlocks, store, atom) => {
	const readAtomState = buildingBlocks[14];
	return returnAtomValue(readAtomState(buildingBlocks, store, atom));
};
var BUILDING_BLOCK_storeSet = (buildingBlocks, store, atom, ...args) => {
	const changedAtoms = buildingBlocks[3];
	const flushCallbacks = buildingBlocks[12];
	const recomputeInvalidatedAtoms = buildingBlocks[13];
	const writeAtomState = buildingBlocks[16];
	const prevChangedAtomsSize = changedAtoms.size;
	try {
		return writeAtomState(buildingBlocks, store, atom, args);
	} finally {
		if (changedAtoms.size !== prevChangedAtomsSize) {
			recomputeInvalidatedAtoms(buildingBlocks, store);
			flushCallbacks(buildingBlocks, store);
		}
	}
};
var BUILDING_BLOCK_storeSub = (buildingBlocks, store, atom, listener) => {
	const flushCallbacks = buildingBlocks[12];
	const mountAtom = buildingBlocks[18];
	const unmountAtom = buildingBlocks[19];
	const listeners = mountAtom(buildingBlocks, store, atom).l;
	listeners.add(listener);
	flushCallbacks(buildingBlocks, store);
	return () => {
		listeners.delete(listener);
		unmountAtom(buildingBlocks, store, atom);
		flushCallbacks(buildingBlocks, store);
	};
};
var BUILDING_BLOCK_registerAbortHandler = (buildingBlocks, _store, promise, abortHandler) => {
	const abortHandlersMap = buildingBlocks[25];
	let abortHandlers = abortHandlersMap.get(promise);
	if (!abortHandlers) {
		abortHandlers = /* @__PURE__ */ new Set();
		abortHandlersMap.set(promise, abortHandlers);
		const cleanup = () => abortHandlersMap.delete(promise);
		promise.then(cleanup, cleanup);
	}
	abortHandlers.add(abortHandler);
};
var BUILDING_BLOCK_abortPromise = (buildingBlocks, _store, promise) => {
	buildingBlocks[25].get(promise)?.forEach((fn) => fn());
};
var buildingBlockMap = /* @__PURE__ */ new WeakMap();
function getBuildingBlocks(store) {
	const buildingBlocks = buildingBlockMap.get(store);
	const enhanceBuildingBlocks = buildingBlocks[24];
	if (enhanceBuildingBlocks) return enhanceBuildingBlocks(buildingBlocks, store);
	return buildingBlocks;
}
function buildStore(...partialBuildingBlocks) {
	const store = {
		get(atom) {
			return storeGet(buildingBlocks, store, atom);
		},
		set(atom, ...args) {
			return storeSet(buildingBlocks, store, atom, ...args);
		},
		sub(atom, listener) {
			return storeSub(buildingBlocks, store, atom, listener);
		}
	};
	const buildingBlocks = [
		/* @__PURE__ */ new WeakMap(),
		/* @__PURE__ */ new WeakMap(),
		/* @__PURE__ */ new WeakMap(),
		/* @__PURE__ */ new Set(),
		/* @__PURE__ */ new Set(),
		/* @__PURE__ */ new Set(),
		{},
		BUILDING_BLOCK_atomRead,
		BUILDING_BLOCK_atomWrite,
		BUILDING_BLOCK_atomOnInit,
		BUILDING_BLOCK_atomOnMount,
		BUILDING_BLOCK_ensureAtomState,
		BUILDING_BLOCK_flushCallbacks,
		BUILDING_BLOCK_recomputeInvalidatedAtoms,
		BUILDING_BLOCK_readAtomState,
		BUILDING_BLOCK_invalidateDependents,
		BUILDING_BLOCK_writeAtomState,
		BUILDING_BLOCK_mountDependencies,
		BUILDING_BLOCK_mountAtom,
		BUILDING_BLOCK_unmountAtom,
		BUILDING_BLOCK_setAtomStateValueOrPromise,
		BUILDING_BLOCK_storeGet,
		BUILDING_BLOCK_storeSet,
		BUILDING_BLOCK_storeSub,
		void 0,
		/* @__PURE__ */ new WeakMap(),
		BUILDING_BLOCK_registerAbortHandler,
		BUILDING_BLOCK_abortPromise,
		[0]
	].map((fn, i) => partialBuildingBlocks[i] || fn);
	buildingBlockMap.set(store, Object.freeze(buildingBlocks));
	const storeGet = buildingBlocks[21];
	const storeSet = buildingBlocks[22];
	const storeSub = buildingBlocks[23];
	return store;
}
//#endregion
//#region ../node_modules/.pnpm/jotai@2.20.1_@babel+core@7._2fd289d4de4e7145b9da18fd397d5fc1/node_modules/jotai/esm/vanilla.mjs
var keyCount = 0;
function atom(read, write) {
	const key = `atom${++keyCount}`;
	const config = { toString() {
		return key;
	} };
	if (typeof read === "function") config.read = read;
	else {
		config.init = read;
		config.read = defaultRead;
		config.write = defaultWrite;
	}
	if (write) config.write = write;
	return config;
}
function defaultRead(get) {
	return get(this);
}
function defaultWrite(get, set, arg) {
	return set(this, typeof arg === "function" ? arg(get(this)) : arg);
}
var overriddenCreateStore;
function createStore() {
	if (overriddenCreateStore) return overriddenCreateStore();
	return buildStore();
}
var defaultStore;
function getDefaultStore() {
	if (!defaultStore) defaultStore = createStore();
	return defaultStore;
}
//#endregion
//#region ../node_modules/.pnpm/jotai@2.20.1_@babel+core@7._2fd289d4de4e7145b9da18fd397d5fc1/node_modules/jotai/esm/react.mjs
var StoreContext = (0, import_react.createContext)(void 0);
function useStore(options) {
	const store = (0, import_react.useContext)(StoreContext);
	return (options == null ? void 0 : options.store) || store || getDefaultStore();
}
var isPromiseLike = (x) => typeof (x == null ? void 0 : x.then) === "function";
var attachPromiseStatus = (promise) => {
	if (!promise.status) {
		promise.status = "pending";
		promise.then((v) => {
			promise.status = "fulfilled";
			promise.value = v;
		}, (e) => {
			promise.status = "rejected";
			promise.reason = e;
		});
	}
};
var use$1 = import_react.use || ((promise) => {
	if (promise.status === "pending") throw promise;
	else if (promise.status === "fulfilled") return promise.value;
	else if (promise.status === "rejected") throw promise.reason;
	else {
		attachPromiseStatus(promise);
		throw promise;
	}
});
var continuablePromiseMap = /* @__PURE__ */ new WeakMap();
var createContinuablePromise = (store, promise, getValue) => {
	const buildingBlocks = getBuildingBlocks(store);
	const registerAbortHandler = buildingBlocks[26];
	let continuablePromise = continuablePromiseMap.get(promise);
	if (!continuablePromise) {
		continuablePromise = new Promise((resolve, reject) => {
			let curr = promise;
			const onFulfilled = (me) => (v) => {
				if (curr === me) resolve(v);
			};
			const onRejected = (me) => (e) => {
				if (curr === me) reject(e);
			};
			const onAbort = () => {
				try {
					const nextValue = getValue();
					if (isPromiseLike(nextValue)) {
						continuablePromiseMap.set(nextValue, continuablePromise);
						curr = nextValue;
						nextValue.then(onFulfilled(nextValue), onRejected(nextValue));
						registerAbortHandler(buildingBlocks, store, nextValue, onAbort);
					} else resolve(nextValue);
				} catch (e) {
					reject(e);
				}
			};
			promise.then(onFulfilled(promise), onRejected(promise));
			registerAbortHandler(buildingBlocks, store, promise, onAbort);
		});
		continuablePromiseMap.set(promise, continuablePromise);
	}
	return continuablePromise;
};
function useAtomValue(atom, options) {
	const { delay, unstable_promiseStatus: promiseStatus = !import_react.use } = options || {};
	const store = useStore(options);
	const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] = (0, import_react.useReducer)((prev) => {
		const nextValue = store.get(atom);
		if (Object.is(prev[0], nextValue) && prev[1] === store && prev[2] === atom) return prev;
		return [
			nextValue,
			store,
			atom
		];
	}, void 0, () => [
		store.get(atom),
		store,
		atom
	]);
	let value = valueFromReducer;
	if (storeFromReducer !== store || atomFromReducer !== atom) {
		rerender();
		value = store.get(atom);
	}
	(0, import_react.useEffect)(() => {
		const unsub = store.sub(atom, () => {
			if (promiseStatus) try {
				const value2 = store.get(atom);
				if (isPromiseLike(value2)) attachPromiseStatus(createContinuablePromise(store, value2, () => store.get(atom)));
			} catch (e) {}
			if (typeof delay === "number") {
				console.warn(`[DEPRECATED] delay option is deprecated and will be removed in v3.

Migration guide:

Create a custom hook like the following.

function useAtomValueWithDelay<Value>(
  atom: Atom<Value>,
  options: { delay: number },
): Value {
  const { delay } = options
  const store = useStore(options)
  const [value, setValue] = useState(() => store.get(atom))
  useEffect(() => {
    const unsub = store.sub(atom, () => {
      setTimeout(() => setValue(store.get(atom)), delay)
    })
    return unsub
  }, [store, atom, delay])
  return value
}
`);
				setTimeout(rerender, delay);
				return;
			}
			rerender();
		});
		rerender();
		return unsub;
	}, [
		store,
		atom,
		delay,
		promiseStatus
	]);
	(0, import_react.useDebugValue)(value);
	if (isPromiseLike(value)) {
		const promise = createContinuablePromise(store, value, () => store.get(atom));
		if (promiseStatus) attachPromiseStatus(promise);
		return use$1(promise);
	}
	return value;
}
function useSetAtom(atom, options) {
	const store = useStore(options);
	return (0, import_react.useCallback)((...args) => {
		return store.set(atom, ...args);
	}, [store, atom]);
}
function useAtom(atom, options) {
	return [useAtomValue(atom, options), useSetAtom(atom, options)];
}
//#endregion
//#region src/state.tsx
var store = createStore();
var tabsAtom = atom([]);
var activeTabAtom = atom(void 0);
var tabGroupRootAtom = atom(null);
var activeGroupIdAtom = atom(void 0);
var tabDropTargetAtom = atom(null);
var lastActiveDockedTabAtom = atom(void 0);
var activeDockedTabAtom = atom((get) => {
	const activeTab = get(activeTabAtom);
	const root = get(tabGroupRootAtom);
	if (activeTab?.layout === "docked" && findTabGroupByTabId(root, activeTab.id)) return activeTab;
	const dockedTabs = get(tabsAtom).filter((tab) => tab.layout === "docked");
	const activeGroup = findTabGroup(root, get(activeGroupIdAtom) ?? "");
	const groupTab = dockedTabs.find((tab) => tab.id === activeGroup?.activeTabId);
	if (groupTab) return groupTab;
	const lastActive = get(lastActiveDockedTabAtom);
	return lastActive && dockedTabs.includes(lastActive) ? lastActive : dockedTabs.at(-1);
}, (_get, set, tab) => set(lastActiveDockedTabAtom, tab));
var resourceTabsAtom = atom((get) => get(tabsAtom).filter(isResourceTab));
var lastActiveResourceTabAtom = atom(void 0);
var activeResourceTabAtom = atom((get) => {
	const activeTab = get(activeTabAtom);
	if (activeTab && isResourceTab(activeTab)) return activeTab;
	const resources = get(resourceTabsAtom);
	const lastActive = get(lastActiveResourceTabAtom);
	return lastActive && resources.includes(lastActive) ? lastActive : resources.at(-1);
}, (_get, set, tab) => set(lastActiveResourceTabAtom, tab));
var isClassroomModeAtom = atom(false);
var nextProjectIdAtom = atom(1);
atom(false);
var isWindowMaxsizedAtom = atom(false);
atom(false);
var isDevAtom = atom(false);
var currentUserAtom = atom(null);
atom(true);
var commandPaletteVisibleAtom = atom(false);
//#endregion
//#region src/components/overlay-host.tsx
var overlaysAtom = atom([]);
var OverlayHost;
(function(_OverlayHost) {
	function open(children) {
		const entry = {
			id: crypto.randomUUID(),
			children
		};
		store.set(overlaysAtom, [...store.get(overlaysAtom), entry]);
		return entry;
	}
	_OverlayHost.open = open;
	function close(id) {
		store.set(overlaysAtom, store.get(overlaysAtom).filter((entry) => entry.id !== id));
	}
	_OverlayHost.close = close;
})(OverlayHost || (OverlayHost = {}));
//#endregion
//#region src/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
		...props
	});
}
//#endregion
//#region src/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content shadow-xs flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+plugin-clipboard-manager@2.3.2/node_modules/@tauri-apps/plugin-clipboard-manager/dist-js/index.js
/**
* Read and write to the system clipboard.
*
* @module
*/
/**
* Writes plain text to the clipboard.
* @example
* ```typescript
* import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';
* await writeText('Tauri is awesome!');
* assert(await readText(), 'Tauri is awesome!');
* ```
*
* @returns A promise indicating the success or failure of the operation.
*
* @since 2.0.0
*/
async function writeText(text, opts) {
	await invoke("plugin:clipboard-manager|write_text", {
		label: opts?.label,
		text
	});
}
/**
* Gets the clipboard content as plain text.
* @example
* ```typescript
* import { readText } from '@tauri-apps/plugin-clipboard-manager';
* const clipboardText = await readText();
* ```
* @since 2.0.0
*/
async function readText() {
	return await invoke("plugin:clipboard-manager|read_text");
}
/**
* Writes image buffer to the clipboard.
*
* #### Platform-specific
*
* - **Android / iOS:** Not supported.
*
* @example
* ```typescript
* import { writeImage } from '@tauri-apps/plugin-clipboard-manager';
* const buffer = [
*   // A red pixel
*   255, 0, 0, 255,
*
*  // A green pixel
*   0, 255, 0, 255,
* ];
* await writeImage(buffer);
* ```
*
* @returns A promise indicating the success or failure of the operation.
*
* @since 2.0.0
*/
async function writeImage(image) {
	await invoke("plugin:clipboard-manager|write_image", { image: transformImage(image) });
}
/**
* Gets the clipboard content as Uint8Array image.
*
* #### Platform-specific
*
* - **Android / iOS:** Not supported.
*
* @example
* ```typescript
* import { readImage } from '@tauri-apps/plugin-clipboard-manager';
*
* const clipboardImage = await readImage();
* const blob = new Blob([await clipboardImage.rgba()], { type: 'image' })
* const url = URL.createObjectURL(blob)
* ```
* @since 2.0.0
*/
async function readImage() {
	return await invoke("plugin:clipboard-manager|read_image").then((rid) => new Image(rid));
}
//#endregion
//#region src/components/ui/dialog.tsx
function Dialog({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogClose({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
		"data-slot": "dialog-close",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
		"data-slot": "dialog-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
			"data-slot": "dialog-content",
			className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
			...props,
			children: [children, showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
				"data-slot": "dialog-close",
				className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
		"data-slot": "dialog-title",
		className: cn("text-lg leading-none font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
		"data-slot": "dialog-description",
		className: cn("text-muted-foreground max-h-[50vh] overflow-y-auto text-sm break-words", className),
		...props
	});
}
Dialog.confirm = (title = "你确定？", description = "", { destructive = false } = {}) => {
	return new Promise((resolve) => {
		function Component({ overlayId }) {
			const [open, setOpen] = import_react.useState(true);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					showCloseButton: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description.split("\n").map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: it })) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "outline",
							onClick: () => {
								resolve(false);
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: "取消"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: destructive ? "destructive" : "default",
							onClick: () => {
								resolve(true);
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: "确定"
						})] })
					] })
				})
			});
		}
		OverlayHost.open(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {}));
	});
};
Dialog.input = (title = "请输入文本", description = "", { defaultValue = "", placeholder = "...", destructive = false, multiline = false } = {}) => {
	return new Promise((resolve) => {
		function Component({ overlayId }) {
			const [open, setOpen] = import_react.useState(true);
			const [value, setValue] = import_react.useState(defaultValue);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					showCloseButton: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(multiline ? Textarea : Input, {
							value,
							onChange: (e) => setValue(e.target.value),
							placeholder,
							onKeyDown: (e) => {
								if (e.key === "Enter" && e.shiftKey) {
									e.preventDefault();
									e.stopPropagation();
									resolve(value);
									setOpen(false);
									setTimeout(() => {
										OverlayHost.close(overlayId);
									}, 500);
								} else if (e.key === "Escape") {
									e.preventDefault();
									e.stopPropagation();
									resolve(void 0);
									setOpen(false);
									setTimeout(() => {
										OverlayHost.close(overlayId);
									}, 500);
								}
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "outline",
							onClick: () => {
								resolve(void 0);
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: "取消（Esc）"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: destructive ? "destructive" : "default",
							onClick: () => {
								resolve(value);
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: "确定（Shift+Enter）"
						})] })
					] })
				})
			});
		}
		OverlayHost.open(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {}));
	});
};
Dialog.buttons = (title, description, buttons) => {
	return new Promise((resolve) => {
		function Component({ overlayId }) {
			const [open, setOpen] = import_react.useState(true);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					showCloseButton: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description.split("\n").map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: it })) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: buttons.map(({ id, label, variant = "default" }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant,
							onClick: () => {
								resolve(id);
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: label
						}, id)) })
					] })
				})
			});
		}
		OverlayHost.open(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {}));
	});
};
Dialog.copy = (title = "导出成功", description = "", value = "") => {
	return new Promise((resolve) => {
		function Component({ overlayId }) {
			const [open, setOpen] = import_react.useState(true);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					showCloseButton: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "max-h-64 max-w-96 overflow-y-auto rounded-md border p-2 select-text",
							children: value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "outline",
							onClick: async () => {
								await writeText(value);
								toast.success("已复制到剪贴板 ~");
							},
							children: "复制"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							onClick: () => {
								resolve();
								setOpen(false);
								setTimeout(() => {
									OverlayHost.close(overlayId);
								}, 500);
							},
							children: "确定"
						})] })
					] })
				})
			});
		}
		OverlayHost.open(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {}));
	});
};
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+number@1.1.1/node_modules/@radix-ui/number/dist/index.mjs
function clamp(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-select@2.2._96fd28d0ecd291ba74019e1d2a4857c5/node_modules/@radix-ui/react-select/dist/index.mjs
var OPEN_KEYS = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [createCollectionScope$1, createPopperScope]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
	const { __scopeSelect, children, open: openProp, defaultOpen, onOpenChange, value: valueProp, defaultValue, onValueChange, dir, name, autoComplete, disabled, required, form } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const [trigger, setTrigger] = import_react.useState(null);
	const [valueNode, setValueNode] = import_react.useState(null);
	const [valueNodeHasChildren, setValueNodeHasChildren] = import_react.useState(false);
	const direction = useDirection(dir);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: SELECT_NAME
	});
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue,
		onChange: onValueChange,
		caller: SELECT_NAME
	});
	const triggerPointerDownPosRef = import_react.useRef(null);
	const isFormControl = trigger ? form || !!trigger.closest("form") : true;
	const [nativeOptionsSet, setNativeOptionsSet] = import_react.useState(/* @__PURE__ */ new Set());
	const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$2, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectProvider, {
			required,
			scope: __scopeSelect,
			trigger,
			onTriggerChange: setTrigger,
			valueNode,
			onValueNodeChange: setValueNode,
			valueNodeHasChildren,
			onValueNodeHasChildrenChange: setValueNodeHasChildren,
			contentId: useId(),
			value,
			onValueChange: setValue,
			open,
			onOpenChange: setOpen,
			dir: direction,
			triggerPointerDownPosRef,
			disabled,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Provider, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectNativeOptionsProvider, {
					scope: props.__scopeSelect,
					onNativeOptionAdd: import_react.useCallback((option) => {
						setNativeOptionsSet((prev) => new Set(prev).add(option));
					}, []),
					onNativeOptionRemove: import_react.useCallback((option) => {
						setNativeOptionsSet((prev) => {
							const optionsSet = new Set(prev);
							optionsSet.delete(option);
							return optionsSet;
						});
					}, []),
					children
				})
			}), isFormControl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectBubbleInput, {
				"aria-hidden": true,
				required,
				tabIndex: -1,
				name,
				autoComplete,
				value,
				onChange: (event) => setValue(event.target.value),
				disabled,
				form,
				children: [value === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "" }) : null, Array.from(nativeOptionsSet)]
			}, nativeSelectKey) : null]
		})
	});
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME = "SelectTrigger";
var SelectTrigger$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, disabled = false, ...triggerProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
	const isDisabled = context.disabled || disabled;
	const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
	const getItems = useCollection$1(__scopeSelect);
	const pointerTypeRef = import_react.useRef("touch");
	const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.value === context.value));
		if (nextItem !== void 0) context.onValueChange(nextItem.value);
	});
	const handleOpen = (pointerEvent) => {
		if (!isDisabled) {
			context.onOpenChange(true);
			resetTypeahead();
		}
		if (pointerEvent) context.triggerPointerDownPosRef.current = {
			x: Math.round(pointerEvent.pageX),
			y: Math.round(pointerEvent.pageY)
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.button, {
			type: "button",
			role: "combobox",
			"aria-controls": context.contentId,
			"aria-expanded": context.open,
			"aria-required": context.required,
			"aria-autocomplete": "none",
			dir: context.dir,
			"data-state": context.open ? "open" : "closed",
			disabled: isDisabled,
			"data-disabled": isDisabled ? "" : void 0,
			"data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
			...triggerProps,
			ref: composedRefs,
			onClick: composeEventHandlers(triggerProps.onClick, (event) => {
				event.currentTarget.focus();
				if (pointerTypeRef.current !== "mouse") handleOpen(event);
			}),
			onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
				pointerTypeRef.current = event.pointerType;
				const target = event.target;
				if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
				if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
					handleOpen(event);
					event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
				const isTypingAhead = searchRef.current !== "";
				if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) handleTypeaheadSearch(event.key);
				if (isTypingAhead && event.key === " ") return;
				if (OPEN_KEYS.includes(event.key)) {
					handleOpen();
					event.preventDefault();
				}
			})
		})
	});
});
SelectTrigger$1.displayName = TRIGGER_NAME;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
	const context = useSelectContext(VALUE_NAME, __scopeSelect);
	const { onValueNodeHasChildrenChange } = context;
	const hasChildren = children !== void 0;
	const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
	useLayoutEffect2(() => {
		onValueNodeHasChildrenChange(hasChildren);
	}, [onValueNodeHasChildrenChange, hasChildren]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		...valueProps,
		ref: composedRefs,
		style: { pointerEvents: "none" },
		children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: placeholder }) : children
	});
});
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, children, ...iconProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		"aria-hidden": true,
		...iconProps,
		ref: forwardedRef,
		children: children || "▼"
	});
});
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$4, {
		asChild: true,
		...props
	});
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "SelectContent";
var SelectContent$1 = import_react.forwardRef((props, forwardedRef) => {
	const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
	const [fragment, setFragment] = import_react.useState();
	useLayoutEffect2(() => {
		setFragment(new DocumentFragment());
	}, []);
	if (!context.open) {
		const frag = fragment;
		return frag ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
			scope: props.__scopeSelect,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Slot, {
				scope: props.__scopeSelect,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: props.children })
			})
		}), frag) : null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentImpl, {
		...props,
		ref: forwardedRef
	});
});
SelectContent$1.displayName = CONTENT_NAME;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = /* @__PURE__ */ createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, position = "item-aligned", onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, side, sideOffset, align, alignOffset, arrowPadding, collisionBoundary, collisionPadding, sticky, hideWhenDetached, avoidCollisions, ...contentProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const [content, setContent] = import_react.useState(null);
	const [viewport, setViewport] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const [selectedItem, setSelectedItem] = import_react.useState(null);
	const [selectedItemText, setSelectedItemText] = import_react.useState(null);
	const getItems = useCollection$1(__scopeSelect);
	const [isPositioned, setIsPositioned] = import_react.useState(false);
	const firstValidItemFoundRef = import_react.useRef(false);
	import_react.useEffect(() => {
		if (content) return hideOthers(content);
	}, [content]);
	useFocusGuards();
	const focusFirst = import_react.useCallback((candidates) => {
		const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
		const [lastItem] = restItems.slice(-1);
		const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
		for (const candidate of candidates) {
			if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			if (candidate === firstItem && viewport) viewport.scrollTop = 0;
			if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
			candidate?.focus();
			if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
		}
	}, [getItems, viewport]);
	const focusSelectedItem = import_react.useCallback(() => focusFirst([selectedItem, content]), [
		focusFirst,
		selectedItem,
		content
	]);
	import_react.useEffect(() => {
		if (isPositioned) focusSelectedItem();
	}, [isPositioned, focusSelectedItem]);
	const { onOpenChange, triggerPointerDownPosRef } = context;
	import_react.useEffect(() => {
		if (content) {
			let pointerMoveDelta = {
				x: 0,
				y: 0
			};
			const handlePointerMove = (event) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
					y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
				};
			};
			const handlePointerUp = (event) => {
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
				else if (!content.contains(event.target)) onOpenChange(false);
				document.removeEventListener("pointermove", handlePointerMove);
				triggerPointerDownPosRef.current = null;
			};
			if (triggerPointerDownPosRef.current !== null) {
				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true
				});
			}
			return () => {
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp, { capture: true });
			};
		}
	}, [
		content,
		onOpenChange,
		triggerPointerDownPosRef
	]);
	import_react.useEffect(() => {
		const close = () => onOpenChange(false);
		window.addEventListener("blur", close);
		window.addEventListener("resize", close);
		return () => {
			window.removeEventListener("blur", close);
			window.removeEventListener("resize", close);
		};
	}, [onOpenChange]);
	const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.ref.current === document.activeElement));
		if (nextItem) setTimeout(() => nextItem.ref.current.focus());
	});
	const itemRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) {
			setSelectedItem(node);
			if (isFirstValidItem) firstValidItemFoundRef.current = true;
		}
	}, [context.value]);
	const handleItemLeave = import_react.useCallback(() => content?.focus(), [content]);
	const itemTextRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) setSelectedItemText(node);
	}, [context.value]);
	const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
	const popperContentProps = SelectPosition === SelectPopperPosition ? {
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		avoidCollisions
	} : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
		scope: __scopeSelect,
		content,
		viewport,
		onViewportChange: setViewport,
		itemRefCallback,
		selectedItem,
		onItemLeave: handleItemLeave,
		itemTextRefCallback,
		focusSelectedItem,
		selectedItemText,
		position,
		isPositioned,
		searchRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
			as: Slot,
			allowPinchZoom: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
				asChild: true,
				trapped: context.open,
				onMountAutoFocus: (event) => {
					event.preventDefault();
				},
				onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
					context.trigger?.focus({ preventScroll: true });
					event.preventDefault();
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents: true,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside: (event) => event.preventDefault(),
					onDismiss: () => context.onOpenChange(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPosition, {
						role: "listbox",
						id: context.contentId,
						"data-state": context.open ? "open" : "closed",
						dir: context.dir,
						onContextMenu: (event) => event.preventDefault(),
						...contentProps,
						...popperContentProps,
						onPlaced: () => setIsPositioned(true),
						ref: composedRefs,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none",
							...contentProps.style
						},
						onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
							const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
							if (event.key === "Tab") event.preventDefault();
							if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
							if ([
								"ArrowUp",
								"ArrowDown",
								"Home",
								"End"
							].includes(event.key)) {
								let candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
								if (["ArrowUp", "ArrowDown"].includes(event.key)) {
									const currentElement = event.target;
									const currentIndex = candidateNodes.indexOf(currentElement);
									candidateNodes = candidateNodes.slice(currentIndex + 1);
								}
								setTimeout(() => focusFirst(candidateNodes));
								event.preventDefault();
							}
						})
					})
				})
			})
		})
	});
});
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onPlaced, ...popperProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
	const [contentWrapper, setContentWrapper] = import_react.useState(null);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const getItems = useCollection$1(__scopeSelect);
	const shouldExpandOnScrollRef = import_react.useRef(false);
	const shouldRepositionRef = import_react.useRef(true);
	const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
	const position = import_react.useCallback(() => {
		if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
			const triggerRect = context.trigger.getBoundingClientRect();
			const contentRect = content.getBoundingClientRect();
			const valueNodeRect = context.valueNode.getBoundingClientRect();
			const itemTextRect = selectedItemText.getBoundingClientRect();
			if (context.dir !== "rtl") {
				const itemTextOffset = itemTextRect.left - contentRect.left;
				const left = valueNodeRect.left - itemTextOffset;
				const leftDelta = triggerRect.left - left;
				const minContentWidth = triggerRect.width + leftDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const rightEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedLeft = clamp(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.left = clampedLeft + "px";
			} else {
				const itemTextOffset = contentRect.right - itemTextRect.right;
				const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
				const rightDelta = window.innerWidth - triggerRect.right - right;
				const minContentWidth = triggerRect.width + rightDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const leftEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedRight = clamp(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.right = clampedRight + "px";
			}
			const items = getItems();
			const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
			const itemsHeight = viewport.scrollHeight;
			const contentStyles = window.getComputedStyle(content);
			const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
			const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
			const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
			const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
			const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
			const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
			const viewportStyles = window.getComputedStyle(viewport);
			const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
			const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
			const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
			const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
			const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
			const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
			const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
			const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
			if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
				const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
				contentWrapper.style.bottom = "0px";
				const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
				const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
				contentWrapper.style.height = height + "px";
			} else {
				const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
				contentWrapper.style.top = "0px";
				const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
				contentWrapper.style.height = height + "px";
				viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
			}
			contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
			contentWrapper.style.minHeight = minContentHeight + "px";
			contentWrapper.style.maxHeight = availableHeight + "px";
			onPlaced?.();
			requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
		}
	}, [
		getItems,
		context.trigger,
		context.valueNode,
		contentWrapper,
		content,
		viewport,
		selectedItem,
		selectedItemText,
		context.dir,
		onPlaced
	]);
	useLayoutEffect2(() => position(), [position]);
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewportProvider, {
		scope: __scopeSelect,
		contentWrapper,
		shouldExpandOnScrollRef,
		onScrollButtonChange: import_react.useCallback((node) => {
			if (node && shouldRepositionRef.current === true) {
				position();
				focusSelectedItem?.();
				shouldRepositionRef.current = false;
			}
		}, [position, focusSelectedItem]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: setContentWrapper,
			style: {
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: contentZIndex
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				...popperProps,
				ref: composedRefs,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
					...popperProps.style
				}
			})
		})
	});
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, align = "start", collisionPadding = CONTENT_MARGIN, ...popperProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content$1, {
		...popperScope,
		...popperProps,
		ref: forwardedRef,
		align,
		collisionPadding,
		style: {
			boxSizing: "border-box",
			...popperProps.style,
			"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-select-content-available-width": "var(--radix-popper-available-width)",
			"--radix-select-content-available-height": "var(--radix-popper-available-height)",
			"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, nonce, ...viewportProps } = props;
	const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
	const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
	const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
	const prevScrollTopRef = import_react.useRef(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
		dangerouslySetInnerHTML: { __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}` },
		nonce
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Slot, {
		scope: __scopeSelect,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
			"data-radix-select-viewport": "",
			role: "presentation",
			...viewportProps,
			ref: composedRefs,
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto",
				...viewportProps.style
			},
			onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
				const viewport = event.currentTarget;
				const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
				if (shouldExpandOnScrollRef?.current && contentWrapper) {
					const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
					if (scrolledBy > 0) {
						const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
						const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
						const cssHeight = parseFloat(contentWrapper.style.height);
						const prevHeight = Math.max(cssMinHeight, cssHeight);
						if (prevHeight < availableHeight) {
							const nextHeight = prevHeight + scrolledBy;
							const clampedNextHeight = Math.min(availableHeight, nextHeight);
							const heightDiff = nextHeight - clampedNextHeight;
							contentWrapper.style.height = clampedNextHeight + "px";
							if (contentWrapper.style.bottom === "0px") {
								viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
								contentWrapper.style.justifyContent = "flex-end";
							}
						}
					}
				}
				prevScrollTopRef.current = viewport.scrollTop;
			})
		})
	})] });
});
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
var SelectGroup$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...groupProps } = props;
	const groupId = useId();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectGroupContextProvider, {
		scope: __scopeSelect,
		id: groupId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
			role: "group",
			"aria-labelledby": groupId,
			...groupProps,
			ref: forwardedRef
		})
	});
});
SelectGroup$1.displayName = GROUP_NAME;
var LABEL_NAME = "SelectLabel";
var SelectLabel = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...labelProps } = props;
	const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		id: groupContext.id,
		...labelProps,
		ref: forwardedRef
	});
});
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
var SelectItem$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props;
	const context = useSelectContext(ITEM_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
	const isSelected = context.value === value;
	const [textValue, setTextValue] = import_react.useState(textValueProp ?? "");
	const [isFocused, setIsFocused] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, (node) => contentContext.itemRefCallback?.(node, value, disabled));
	const textId = useId();
	const pointerTypeRef = import_react.useRef("touch");
	const handleSelect = () => {
		if (!disabled) {
			context.onValueChange(value);
			context.onOpenChange(false);
		}
	};
	if (value === "") throw new Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemContextProvider, {
		scope: __scopeSelect,
		value,
		disabled,
		textId,
		isSelected,
		onItemTextChange: import_react.useCallback((node) => {
			setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
		}, []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.ItemSlot, {
			scope: __scopeSelect,
			value,
			disabled,
			textValue,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
				role: "option",
				"aria-labelledby": textId,
				"data-highlighted": isFocused ? "" : void 0,
				"aria-selected": isSelected && isFocused,
				"data-state": isSelected ? "checked" : "unchecked",
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				tabIndex: disabled ? void 0 : -1,
				...itemProps,
				ref: composedRefs,
				onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
				onClick: composeEventHandlers(itemProps.onClick, () => {
					if (pointerTypeRef.current !== "mouse") handleSelect();
				}),
				onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
					if (pointerTypeRef.current === "mouse") handleSelect();
				}),
				onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
					pointerTypeRef.current = event.pointerType;
				}),
				onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
					pointerTypeRef.current = event.pointerType;
					if (disabled) contentContext.onItemLeave?.();
					else if (pointerTypeRef.current === "mouse") event.currentTarget.focus({ preventScroll: true });
				}),
				onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
					if (event.currentTarget === document.activeElement) contentContext.onItemLeave?.();
				}),
				onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
					if (contentContext.searchRef?.current !== "" && event.key === " ") return;
					if (SELECTION_KEYS.includes(event.key)) handleSelect();
					if (event.key === " ") event.preventDefault();
				})
			})
		})
	});
});
SelectItem$1.displayName = ITEM_NAME;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, ...itemTextProps } = props;
	const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
	const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
	const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
	const [itemTextNode, setItemTextNode] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setItemTextNode(node), itemContext.onItemTextChange, (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled));
	const textContent = itemTextNode?.textContent;
	const nativeOption = import_react.useMemo(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
		value: itemContext.value,
		disabled: itemContext.disabled,
		children: textContent
	}, itemContext.value), [
		itemContext.disabled,
		itemContext.value,
		textContent
	]);
	const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
	useLayoutEffect2(() => {
		onNativeOptionAdd(nativeOption);
		return () => onNativeOptionRemove(nativeOption);
	}, [
		onNativeOptionAdd,
		onNativeOptionRemove,
		nativeOption
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		id: itemContext.textId,
		...itemTextProps,
		ref: composedRefs
	}), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? import_react_dom.createPortal(itemTextProps.children, context.valueNode) : null] });
});
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...itemIndicatorProps } = props;
	return useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect).isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		"aria-hidden": true,
		...itemIndicatorProps,
		ref: forwardedRef
	}) : null;
});
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = import_react.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const [canScrollUp, setCanScrollUp] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				setCanScrollUp(viewport.scrollTop > 0);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = import_react.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const [canScrollDown, setCanScrollDown] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				const maxScroll = viewport.scrollHeight - viewport.clientHeight;
				setCanScrollDown(Math.ceil(viewport.scrollTop) < maxScroll);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
	const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
	const autoScrollTimerRef = import_react.useRef(null);
	const getItems = useCollection$1(__scopeSelect);
	const clearAutoScrollTimer = import_react.useCallback(() => {
		if (autoScrollTimerRef.current !== null) {
			window.clearInterval(autoScrollTimerRef.current);
			autoScrollTimerRef.current = null;
		}
	}, []);
	import_react.useEffect(() => {
		return () => clearAutoScrollTimer();
	}, [clearAutoScrollTimer]);
	useLayoutEffect2(() => {
		getItems().find((item) => item.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
	}, [getItems]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		"aria-hidden": true,
		...scrollIndicatorProps,
		ref: forwardedRef,
		style: {
			flexShrink: 0,
			...scrollIndicatorProps.style
		},
		onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
			contentContext.onItemLeave?.();
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
			clearAutoScrollTimer();
		})
	});
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...separatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.div, {
		"aria-hidden": true,
		...separatorProps,
		ref: forwardedRef
	});
});
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...arrowProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(ARROW_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
	return context.open && contentContext.position === "popper" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	}) : null;
});
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME$1 = "SelectBubbleInput";
var SelectBubbleInput = import_react.forwardRef(({ __scopeSelect, value, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const prevValue = usePrevious(value);
	import_react.useEffect(() => {
		const select = ref.current;
		if (!select) return;
		const selectProto = window.HTMLSelectElement.prototype;
		const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
		if (prevValue !== value && setValue) {
			const event = new Event("change", { bubbles: true });
			setValue.call(select, value);
			select.dispatchEvent(event);
		}
	}, [prevValue, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.select, {
		...props,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		},
		ref: composedRefs,
		defaultValue: value
	});
});
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
function shouldShowPlaceholder(value) {
	return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
	const handleSearchChange = useCallbackRef$1(onSearchChange);
	const searchRef = import_react.useRef("");
	const timerRef = import_react.useRef(0);
	const handleTypeaheadSearch = import_react.useCallback((key) => {
		const search = searchRef.current + key;
		handleSearchChange(search);
		(function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		})(search);
	}, [handleSearchChange]);
	const resetTypeahead = import_react.useCallback(() => {
		searchRef.current = "";
		window.clearTimeout(timerRef.current);
	}, []);
	import_react.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	return [
		searchRef,
		handleTypeaheadSearch,
		resetTypeahead
	];
}
function findNextItem(items, search, currentItem) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
	let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
	if (normalizedSearch.length === 1) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
	const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2 = Select$1;
var Trigger = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent$1;
var Viewport = SelectViewport;
var Group = SelectGroup$1;
var Item = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;
//#endregion
//#region src/components/ui/select.tsx
function Select({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "select",
		...props
	});
}
function SelectGroup({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
		"data-slot": "select-group",
		...props
	});
}
function SelectValue({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Value, {
		"data-slot": "select-value",
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 shadow-xs flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 opacity-50" })
		})]
	});
}
function SelectContent({ className, children, position = "popper", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
		"data-slot": "select-content",
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) relative z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
		position,
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
				className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
		]
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item, {
		"data-slot": "select-item",
		className: cn("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground outline-hidden *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemText, { children })]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollUpButton, {
		"data-slot": "select-scroll-up-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollDownButton, {
		"data-slot": "select-scroll-down-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
	});
}
//#endregion
//#region ../node_modules/.pnpm/@radix-ui+react-slider@1.3._d75abfc68867073f4a4486ead5a2f669/node_modules/@radix-ui/react-slider/dist/index.mjs
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
];
var BACK_KEYS = {
	"from-left": [
		"Home",
		"PageDown",
		"ArrowDown",
		"ArrowLeft"
	],
	"from-right": [
		"Home",
		"PageDown",
		"ArrowDown",
		"ArrowRight"
	],
	"from-bottom": [
		"Home",
		"PageDown",
		"ArrowDown",
		"ArrowLeft"
	],
	"from-top": [
		"Home",
		"PageDown",
		"ArrowUp",
		"ArrowLeft"
	]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME, [createCollectionScope]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = import_react.forwardRef((props, forwardedRef) => {
	const { name, min = 0, max = 100, step = 1, orientation = "horizontal", disabled = false, minStepsBetweenThumbs = 0, defaultValue = [min], value, onValueChange = () => {}, onValueCommit = () => {}, inverted = false, form, ...sliderProps } = props;
	const thumbRefs = import_react.useRef(/* @__PURE__ */ new Set());
	const valueIndexToChangeRef = import_react.useRef(0);
	const SliderOrientation = orientation === "horizontal" ? SliderHorizontal : SliderVertical;
	const [values = [], setValues] = useControllableState({
		prop: value,
		defaultProp: defaultValue,
		onChange: (value2) => {
			[...thumbRefs.current][valueIndexToChangeRef.current]?.focus();
			onValueChange(value2);
		}
	});
	const valuesBeforeSlideStartRef = import_react.useRef(values);
	function handleSlideStart(value2) {
		updateValues(value2, getClosestValueIndex(values, value2));
	}
	function handleSlideMove(value2) {
		updateValues(value2, valueIndexToChangeRef.current);
	}
	function handleSlideEnd() {
		const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
		if (values[valueIndexToChangeRef.current] !== prevValue) onValueCommit(values);
	}
	function updateValues(value2, atIndex, { commit } = { commit: false }) {
		const decimalCount = getDecimalCount(step);
		const nextValue = clamp(roundValue(Math.round((value2 - min) / step) * step + min, decimalCount), [min, max]);
		setValues((prevValues = []) => {
			const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
			if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
				valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
				const hasChanged = String(nextValues) !== String(prevValues);
				if (hasChanged && commit) onValueCommit(nextValues);
				return hasChanged ? nextValues : prevValues;
			} else return prevValues;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderProvider, {
		scope: props.__scopeSlider,
		name,
		disabled,
		min,
		max,
		valueIndexToChangeRef,
		thumbs: thumbRefs.current,
		values,
		orientation,
		form,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
			scope: props.__scopeSlider,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
				scope: props.__scopeSlider,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderOrientation, {
					"aria-disabled": disabled,
					"data-disabled": disabled ? "" : void 0,
					...sliderProps,
					ref: forwardedRef,
					onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
						if (!disabled) valuesBeforeSlideStartRef.current = values;
					}),
					min,
					max,
					inverted,
					onSlideStart: disabled ? void 0 : handleSlideStart,
					onSlideMove: disabled ? void 0 : handleSlideMove,
					onSlideEnd: disabled ? void 0 : handleSlideEnd,
					onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
					onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
					onStepKeyDown: ({ event, direction: stepDirection }) => {
						if (!disabled) {
							const multiplier = PAGE_KEYS.includes(event.key) || event.shiftKey && ARROW_KEYS.includes(event.key) ? 10 : 1;
							const atIndex = valueIndexToChangeRef.current;
							const value2 = values[atIndex];
							updateValues(value2 + step * multiplier * stepDirection, atIndex, { commit: true });
						}
					}
				})
			})
		})
	});
});
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
	startEdge: "left",
	endEdge: "right",
	size: "width",
	direction: 1
});
var SliderHorizontal = import_react.forwardRef((props, forwardedRef) => {
	const { min, max, dir, inverted, onSlideStart, onSlideMove, onSlideEnd, onStepKeyDown, ...sliderProps } = props;
	const [slider, setSlider] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
	const rectRef = import_react.useRef(void 0);
	const direction = useDirection(dir);
	const isDirectionLTR = direction === "ltr";
	const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
	function getValueFromPointer(pointerPosition) {
		const rect = rectRef.current || slider.getBoundingClientRect();
		const value = linearScale([0, rect.width], isSlidingFromLeft ? [min, max] : [max, min]);
		rectRef.current = rect;
		return value(pointerPosition - rect.left);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderOrientationProvider, {
		scope: props.__scopeSlider,
		startEdge: isSlidingFromLeft ? "left" : "right",
		endEdge: isSlidingFromLeft ? "right" : "left",
		direction: isSlidingFromLeft ? 1 : -1,
		size: "width",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderImpl, {
			dir: direction,
			"data-orientation": "horizontal",
			...sliderProps,
			ref: composedRefs,
			style: {
				...sliderProps.style,
				["--radix-slider-thumb-transform"]: "translateX(-50%)"
			},
			onSlideStart: (event) => {
				const value = getValueFromPointer(event.clientX);
				onSlideStart?.(value);
			},
			onSlideMove: (event) => {
				const value = getValueFromPointer(event.clientX);
				onSlideMove?.(value);
			},
			onSlideEnd: () => {
				rectRef.current = void 0;
				onSlideEnd?.();
			},
			onStepKeyDown: (event) => {
				const isBackKey = BACK_KEYS[isSlidingFromLeft ? "from-left" : "from-right"].includes(event.key);
				onStepKeyDown?.({
					event,
					direction: isBackKey ? -1 : 1
				});
			}
		})
	});
});
var SliderVertical = import_react.forwardRef((props, forwardedRef) => {
	const { min, max, inverted, onSlideStart, onSlideMove, onSlideEnd, onStepKeyDown, ...sliderProps } = props;
	const sliderRef = import_react.useRef(null);
	const ref = useComposedRefs(forwardedRef, sliderRef);
	const rectRef = import_react.useRef(void 0);
	const isSlidingFromBottom = !inverted;
	function getValueFromPointer(pointerPosition) {
		const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
		const value = linearScale([0, rect.height], isSlidingFromBottom ? [max, min] : [min, max]);
		rectRef.current = rect;
		return value(pointerPosition - rect.top);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderOrientationProvider, {
		scope: props.__scopeSlider,
		startEdge: isSlidingFromBottom ? "bottom" : "top",
		endEdge: isSlidingFromBottom ? "top" : "bottom",
		size: "height",
		direction: isSlidingFromBottom ? 1 : -1,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderImpl, {
			"data-orientation": "vertical",
			...sliderProps,
			ref,
			style: {
				...sliderProps.style,
				["--radix-slider-thumb-transform"]: "translateY(50%)"
			},
			onSlideStart: (event) => {
				const value = getValueFromPointer(event.clientY);
				onSlideStart?.(value);
			},
			onSlideMove: (event) => {
				const value = getValueFromPointer(event.clientY);
				onSlideMove?.(value);
			},
			onSlideEnd: () => {
				rectRef.current = void 0;
				onSlideEnd?.();
			},
			onStepKeyDown: (event) => {
				const isBackKey = BACK_KEYS[isSlidingFromBottom ? "from-bottom" : "from-top"].includes(event.key);
				onStepKeyDown?.({
					event,
					direction: isBackKey ? -1 : 1
				});
			}
		})
	});
});
var SliderImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSlider, onSlideStart, onSlideMove, onSlideEnd, onHomeKeyDown, onEndKeyDown, onStepKeyDown, ...sliderProps } = props;
	const context = useSliderContext(SLIDER_NAME, __scopeSlider);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		...sliderProps,
		ref: forwardedRef,
		onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
			if (event.key === "Home") {
				onHomeKeyDown(event);
				event.preventDefault();
			} else if (event.key === "End") {
				onEndKeyDown(event);
				event.preventDefault();
			} else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
				onStepKeyDown(event);
				event.preventDefault();
			}
		}),
		onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
			const target = event.target;
			target.setPointerCapture(event.pointerId);
			event.preventDefault();
			if (context.thumbs.has(target)) target.focus();
			else onSlideStart(event);
		}),
		onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
			if (event.target.hasPointerCapture(event.pointerId)) onSlideMove(event);
		}),
		onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
			const target = event.target;
			if (target.hasPointerCapture(event.pointerId)) {
				target.releasePointerCapture(event.pointerId);
				onSlideEnd(event);
			}
		})
	});
});
var TRACK_NAME = "SliderTrack";
var SliderTrack = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSlider, ...trackProps } = props;
	const context = useSliderContext(TRACK_NAME, __scopeSlider);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		"data-disabled": context.disabled ? "" : void 0,
		"data-orientation": context.orientation,
		...trackProps,
		ref: forwardedRef
	});
});
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSlider, ...rangeProps } = props;
	const context = useSliderContext(RANGE_NAME, __scopeSlider);
	const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
	const composedRefs = useComposedRefs(forwardedRef, import_react.useRef(null));
	const valuesCount = context.values.length;
	const percentages = context.values.map((value) => convertValueToPercentage(value, context.min, context.max));
	const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
	const offsetEnd = 100 - Math.max(...percentages);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
		"data-orientation": context.orientation,
		"data-disabled": context.disabled ? "" : void 0,
		...rangeProps,
		ref: composedRefs,
		style: {
			...props.style,
			[orientation.startEdge]: offsetStart + "%",
			[orientation.endEdge]: offsetEnd + "%"
		}
	});
});
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = import_react.forwardRef((props, forwardedRef) => {
	const getItems = useCollection(props.__scopeSlider);
	const [thumb, setThumb] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
	const index = import_react.useMemo(() => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1, [getItems, thumb]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumbImpl, {
		...props,
		ref: composedRefs,
		index
	});
});
var SliderThumbImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSlider, index, name, ...thumbProps } = props;
	const context = useSliderContext(THUMB_NAME, __scopeSlider);
	const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
	const [thumb, setThumb] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
	const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
	const size = useSize(thumb);
	const value = context.values[index];
	const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
	const label = getLabel(index, context.values.length);
	const orientationSize = size?.[orientation.size];
	const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
	import_react.useEffect(() => {
		if (thumb) {
			context.thumbs.add(thumb);
			return () => {
				context.thumbs.delete(thumb);
			};
		}
	}, [thumb, context.thumbs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		style: {
			transform: "var(--radix-slider-thumb-transform)",
			position: "absolute",
			[orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
			scope: props.__scopeSlider,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.span, {
				role: "slider",
				"aria-label": props["aria-label"] || label,
				"aria-valuemin": context.min,
				"aria-valuenow": value,
				"aria-valuemax": context.max,
				"aria-orientation": context.orientation,
				"data-orientation": context.orientation,
				"data-disabled": context.disabled ? "" : void 0,
				tabIndex: context.disabled ? void 0 : 0,
				...thumbProps,
				ref: composedRefs,
				style: value === void 0 ? { display: "none" } : props.style,
				onFocus: composeEventHandlers(props.onFocus, () => {
					context.valueIndexToChangeRef.current = index;
				})
			})
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderBubbleInput, {
			name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
			form: context.form,
			value
		}, index)]
	});
});
SliderThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var SliderBubbleInput = import_react.forwardRef(({ __scopeSlider, value, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(ref, forwardedRef);
	const prevValue = usePrevious(value);
	import_react.useEffect(() => {
		const input = ref.current;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setValue = Object.getOwnPropertyDescriptor(inputProto, "value").set;
		if (prevValue !== value && setValue) {
			const event = new Event("input", { bubbles: true });
			setValue.call(input, value);
			input.dispatchEvent(event);
		}
	}, [prevValue, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive$1.input, {
		style: { display: "none" },
		...props,
		ref: composedRefs,
		defaultValue: value
	});
});
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
	const nextValues = [...prevValues];
	nextValues[atIndex] = nextValue;
	return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
	return clamp(100 / (max - min) * (value - min), [0, 100]);
}
function getLabel(index, totalValues) {
	if (totalValues > 2) return `Value ${index + 1} of ${totalValues}`;
	else if (totalValues === 2) return ["Minimum", "Maximum"][index];
	else return;
}
function getClosestValueIndex(values, nextValue) {
	if (values.length === 1) return 0;
	const distances = values.map((value) => Math.abs(value - nextValue));
	const closestDistance = Math.min(...distances);
	return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
	const halfWidth = width / 2;
	return (halfWidth - linearScale([0, 50], [0, halfWidth])(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
	return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
	if (minStepsBetweenValues > 0) {
		const stepsBetweenValues = getStepsBetweenValues(values);
		return Math.min(...stepsBetweenValues) >= minStepsBetweenValues;
	}
	return true;
}
function linearScale(input, output) {
	return (value) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}
function getDecimalCount(value) {
	return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
	const rounder = Math.pow(10, decimalCount);
	return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
//#endregion
//#region src/components/ui/slider.tsx
function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }) {
	const _values = import_react.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max], [
		value,
		defaultValue,
		min,
		max
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		"data-slot": "slider",
		defaultValue,
		value,
		min,
		max,
		className: cn("relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Track, {
			"data-slot": "slider-track",
			className: cn("bg-muted relative grow rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Range, {
				"data-slot": "slider-range",
				className: cn("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
			})
		}), Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, {
			"data-slot": "slider-thumb",
			className: "border-primary bg-background ring-ring/50 focus-visible:outline-hidden block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
		}, index))]
	});
}
//#endregion
//#region ../node_modules/.pnpm/i18next@26.0.8_typescript@5.9.2/node_modules/i18next/dist/esm/i18next.js
var isString$1 = (obj) => typeof obj === "string";
var defer = () => {
	let res;
	let rej;
	const promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});
	promise.resolve = res;
	promise.reject = rej;
	return promise;
};
var makeString = (object) => {
	if (object == null) return "";
	return String(object);
};
var copy = (a, s, t) => {
	a.forEach((m) => {
		if (s[m]) t[m] = s[m];
	});
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.includes("###") ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString$1(object);
var getLastOfPath = (object, path, Empty) => {
	const stack = !isString$1(path) ? path : path.split(".");
	let stackIndex = 0;
	while (stackIndex < stack.length - 1) {
		if (canNotTraverseDeeper(object)) return {};
		const key = cleanKey(stack[stackIndex]);
		if (!object[key] && Empty) object[key] = new Empty();
		if (Object.prototype.hasOwnProperty.call(object, key)) object = object[key];
		else object = {};
		++stackIndex;
	}
	if (canNotTraverseDeeper(object)) return {};
	return {
		obj: object,
		k: cleanKey(stack[stackIndex])
	};
};
var setPath = (object, path, newValue) => {
	const { obj, k } = getLastOfPath(object, path, Object);
	if (obj !== void 0 || path.length === 1) {
		obj[k] = newValue;
		return;
	}
	let e = path[path.length - 1];
	let p = path.slice(0, path.length - 1);
	let last = getLastOfPath(object, p, Object);
	while (last.obj === void 0 && p.length) {
		e = `${p[p.length - 1]}.${e}`;
		p = p.slice(0, p.length - 1);
		last = getLastOfPath(object, p, Object);
		if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") last.obj = void 0;
	}
	last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path, newValue, concat) => {
	const { obj, k } = getLastOfPath(object, path, Object);
	obj[k] = obj[k] || [];
	obj[k].push(newValue);
};
var getPath = (object, path) => {
	const { obj, k } = getLastOfPath(object, path);
	if (!obj) return void 0;
	if (!Object.prototype.hasOwnProperty.call(obj, k)) return void 0;
	return obj[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
	const value = getPath(data, key);
	if (value !== void 0) return value;
	return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
	for (const prop in source) if (prop !== "__proto__" && prop !== "constructor") if (prop in target) if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
		if (overwrite) target[prop] = source[prop];
	} else deepExtend(target[prop], source[prop], overwrite);
	else target[prop] = source[prop];
	return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;",
	"/": "&#x2F;"
};
var escape$2 = (data) => {
	if (isString$1(data)) return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
	return data;
};
var RegExpCache = class {
	constructor(capacity) {
		this.capacity = capacity;
		this.regExpMap = /* @__PURE__ */ new Map();
		this.regExpQueue = [];
	}
	getRegExp(pattern) {
		const regExpFromCache = this.regExpMap.get(pattern);
		if (regExpFromCache !== void 0) return regExpFromCache;
		const regExpNew = new RegExp(pattern);
		if (this.regExpQueue.length === this.capacity) this.regExpMap.delete(this.regExpQueue.shift());
		this.regExpMap.set(pattern, regExpNew);
		this.regExpQueue.push(pattern);
		return regExpNew;
	}
};
var chars = [
	" ",
	",",
	"?",
	"!",
	";"
];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
	nsSeparator = nsSeparator || "";
	keySeparator = keySeparator || "";
	const possibleChars = chars.filter((c) => !nsSeparator.includes(c) && !keySeparator.includes(c));
	if (possibleChars.length === 0) return true;
	const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
	let matched = !r.test(key);
	if (!matched) {
		const ki = key.indexOf(keySeparator);
		if (ki > 0 && !r.test(key.substring(0, ki))) matched = true;
	}
	return matched;
};
var deepFind = (obj, path, keySeparator = ".") => {
	if (!obj) return void 0;
	if (obj[path]) {
		if (!Object.prototype.hasOwnProperty.call(obj, path)) return void 0;
		return obj[path];
	}
	const tokens = path.split(keySeparator);
	let current = obj;
	for (let i = 0; i < tokens.length;) {
		if (!current || typeof current !== "object") return;
		let next;
		let nextPath = "";
		for (let j = i; j < tokens.length; ++j) {
			if (j !== i) nextPath += keySeparator;
			nextPath += tokens[j];
			next = current[nextPath];
			if (next !== void 0) {
				if ([
					"string",
					"number",
					"boolean"
				].includes(typeof next) && j < tokens.length - 1) continue;
				i += j - i + 1;
				break;
			}
		}
		current = next;
	}
	return current;
};
var getCleanedCode = (code) => code?.replace(/_/g, "-");
var consoleLogger = {
	type: "logger",
	log(args) {
		this.output("log", args);
	},
	warn(args) {
		this.output("warn", args);
	},
	error(args) {
		this.output("error", args);
	},
	output(type, args) {
		console?.[type]?.apply?.(console, args);
	}
};
var baseLogger = new class Logger {
	constructor(concreteLogger, options = {}) {
		this.init(concreteLogger, options);
	}
	init(concreteLogger, options = {}) {
		this.prefix = options.prefix || "i18next:";
		this.logger = concreteLogger || consoleLogger;
		this.options = options;
		this.debug = options.debug;
	}
	log(...args) {
		return this.forward(args, "log", "", true);
	}
	warn(...args) {
		return this.forward(args, "warn", "", true);
	}
	error(...args) {
		return this.forward(args, "error", "");
	}
	deprecate(...args) {
		return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
	}
	forward(args, lvl, prefix, debugOnly) {
		if (debugOnly && !this.debug) return null;
		args = args.map((a) => isString$1(a) ? a.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : a);
		if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
		return this.logger[lvl](args);
	}
	create(moduleName) {
		return new Logger(this.logger, {
			prefix: `${this.prefix}:${moduleName}:`,
			...this.options
		});
	}
	clone(options) {
		options = options || this.options;
		options.prefix = options.prefix || this.prefix;
		return new Logger(this.logger, options);
	}
}();
var EventEmitter$2 = class {
	constructor() {
		this.observers = {};
	}
	on(events, listener) {
		events.split(" ").forEach((event) => {
			if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
			const numListeners = this.observers[event].get(listener) || 0;
			this.observers[event].set(listener, numListeners + 1);
		});
		return this;
	}
	off(event, listener) {
		if (!this.observers[event]) return;
		if (!listener) {
			delete this.observers[event];
			return;
		}
		this.observers[event].delete(listener);
	}
	once(event, listener) {
		const wrapper = (...args) => {
			listener(...args);
			this.off(event, wrapper);
		};
		this.on(event, wrapper);
		return this;
	}
	emit(event, ...args) {
		if (this.observers[event]) Array.from(this.observers[event].entries()).forEach(([observer, numTimesAdded]) => {
			for (let i = 0; i < numTimesAdded; i++) observer(...args);
		});
		if (this.observers["*"]) Array.from(this.observers["*"].entries()).forEach(([observer, numTimesAdded]) => {
			for (let i = 0; i < numTimesAdded; i++) observer(event, ...args);
		});
	}
};
var ResourceStore = class extends EventEmitter$2 {
	constructor(data, options = {
		ns: ["translation"],
		defaultNS: "translation"
	}) {
		super();
		this.data = data || {};
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		if (this.options.ignoreJSONStructure === void 0) this.options.ignoreJSONStructure = true;
	}
	addNamespaces(ns) {
		if (!this.options.ns.includes(ns)) this.options.ns.push(ns);
	}
	removeNamespaces(ns) {
		const index = this.options.ns.indexOf(ns);
		if (index > -1) this.options.ns.splice(index, 1);
	}
	getResource(lng, ns, key, options = {}) {
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
		let path;
		if (lng.includes(".")) path = lng.split(".");
		else {
			path = [lng, ns];
			if (key) if (Array.isArray(key)) path.push(...key);
			else if (isString$1(key) && keySeparator) path.push(...key.split(keySeparator));
			else path.push(key);
		}
		const result = getPath(this.data, path);
		if (!result && !ns && !key && lng.includes(".")) {
			lng = path[0];
			ns = path[1];
			key = path.slice(2).join(".");
		}
		if (result || !ignoreJSONStructure || !isString$1(key)) return result;
		return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
	}
	addResource(lng, ns, key, value, options = { silent: false }) {
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		let path = [lng, ns];
		if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
		if (lng.includes(".")) {
			path = lng.split(".");
			value = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		setPath(this.data, path, value);
		if (!options.silent) this.emit("added", lng, ns, key, value);
	}
	addResources(lng, ns, resources, options = { silent: false }) {
		for (const m in resources) if (isString$1(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], { silent: true });
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	addResourceBundle(lng, ns, resources, deep, overwrite, options = {
		silent: false,
		skipCopy: false
	}) {
		let path = [lng, ns];
		if (lng.includes(".")) {
			path = lng.split(".");
			deep = resources;
			resources = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		let pack = getPath(this.data, path) || {};
		if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
		if (deep) deepExtend(pack, resources, overwrite);
		else pack = {
			...pack,
			...resources
		};
		setPath(this.data, path, pack);
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	removeResourceBundle(lng, ns) {
		if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
		this.removeNamespaces(ns);
		this.emit("removed", lng, ns);
	}
	hasResourceBundle(lng, ns) {
		return this.getResource(lng, ns) !== void 0;
	}
	getResourceBundle(lng, ns) {
		if (!ns) ns = this.options.defaultNS;
		return this.getResource(lng, ns);
	}
	getDataByLanguage(lng) {
		return this.data[lng];
	}
	hasLanguageSomeTranslations(lng) {
		const data = this.getDataByLanguage(lng);
		return !!(data && Object.keys(data) || []).find((v) => data[v] && Object.keys(data[v]).length > 0);
	}
	toJSON() {
		return this.data;
	}
};
var postProcessor = {
	processors: {},
	addPostProcessor(module) {
		this.processors[module.name] = module;
	},
	handle(processors, value, key, options, translator) {
		processors.forEach((processor) => {
			value = this.processors[processor]?.process(value, key, options, translator) ?? value;
		});
		return value;
	}
};
var PATH_KEY = Symbol("i18next/PATH_KEY");
function createProxy() {
	const state = [];
	const handler = Object.create(null);
	let proxy;
	handler.get = (target, key) => {
		proxy?.revoke?.();
		if (key === PATH_KEY) return state;
		state.push(key);
		proxy = Proxy.revocable(target, handler);
		return proxy.proxy;
	};
	return Proxy.revocable(Object.create(null), handler).proxy;
}
function keysFromSelector(selector, opts) {
	const { [PATH_KEY]: path } = selector(createProxy());
	const keySeparator = opts?.keySeparator ?? ".";
	const nsSeparator = opts?.nsSeparator ?? ":";
	if (path.length > 1 && nsSeparator) {
		const ns = opts?.ns;
		const nsArray = Array.isArray(ns) ? ns : null;
		if (nsArray && nsArray.length > 1 && nsArray.slice(1).includes(path[0])) return `${path[0]}${nsSeparator}${path.slice(1).join(keySeparator)}`;
	}
	return path.join(keySeparator);
}
var shouldHandleAsObject = (res) => !isString$1(res) && typeof res !== "boolean" && typeof res !== "number";
var Translator = class Translator extends EventEmitter$2 {
	constructor(services, options = {}) {
		super();
		copy([
			"resourceStore",
			"languageUtils",
			"pluralResolver",
			"interpolator",
			"backendConnector",
			"i18nFormat",
			"utils"
		], services, this);
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		this.logger = baseLogger.create("translator");
		this.checkedLoadedFor = {};
	}
	changeLanguage(lng) {
		if (lng) this.language = lng;
	}
	exists(key, o = { interpolation: {} }) {
		const opt = { ...o };
		if (key == null) return false;
		const resolved = this.resolve(key, opt);
		if (resolved?.res === void 0) return false;
		const isObject = shouldHandleAsObject(resolved.res);
		if (opt.returnObjects === false && isObject) return false;
		return true;
	}
	extractFromKey(key, opt) {
		let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
		if (nsSeparator === void 0) nsSeparator = ":";
		const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
		let namespaces = opt.ns || this.options.defaultNS || [];
		const wouldCheckForNsInKey = nsSeparator && key.includes(nsSeparator);
		const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
		if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
			const m = key.match(this.interpolator.nestingRegexp);
			if (m && m.length > 0) return {
				key,
				namespaces: isString$1(namespaces) ? [namespaces] : namespaces
			};
			const parts = key.split(nsSeparator);
			if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.includes(parts[0])) namespaces = parts.shift();
			key = parts.join(keySeparator);
		}
		return {
			key,
			namespaces: isString$1(namespaces) ? [namespaces] : namespaces
		};
	}
	translate(keys, o, lastKey) {
		let opt = typeof o === "object" ? { ...o } : o;
		if (typeof opt !== "object" && this.options.overloadTranslationOptionHandler) opt = this.options.overloadTranslationOptionHandler(arguments);
		if (typeof opt === "object") opt = { ...opt };
		if (!opt) opt = {};
		if (keys == null) return "";
		if (typeof keys === "function") keys = keysFromSelector(keys, {
			...this.options,
			...opt
		});
		if (!Array.isArray(keys)) keys = [String(keys)];
		keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
			...this.options,
			...opt
		}) : String(k));
		const returnDetails = opt.returnDetails !== void 0 ? opt.returnDetails : this.options.returnDetails;
		const keySeparator = opt.keySeparator !== void 0 ? opt.keySeparator : this.options.keySeparator;
		const { key, namespaces } = this.extractFromKey(keys[keys.length - 1], opt);
		const namespace = namespaces[namespaces.length - 1];
		let nsSeparator = opt.nsSeparator !== void 0 ? opt.nsSeparator : this.options.nsSeparator;
		if (nsSeparator === void 0) nsSeparator = ":";
		const lng = opt.lng || this.language;
		const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
		if (lng?.toLowerCase() === "cimode") {
			if (appendNamespaceToCIMode) {
				if (returnDetails) return {
					res: `${namespace}${nsSeparator}${key}`,
					usedKey: key,
					exactUsedKey: key,
					usedLng: lng,
					usedNS: namespace,
					usedParams: this.getUsedParamsDetails(opt)
				};
				return `${namespace}${nsSeparator}${key}`;
			}
			if (returnDetails) return {
				res: key,
				usedKey: key,
				exactUsedKey: key,
				usedLng: lng,
				usedNS: namespace,
				usedParams: this.getUsedParamsDetails(opt)
			};
			return key;
		}
		const resolved = this.resolve(keys, opt);
		let res = resolved?.res;
		const resUsedKey = resolved?.usedKey || key;
		const resExactUsedKey = resolved?.exactUsedKey || key;
		const noObject = [
			"[object Number]",
			"[object Function]",
			"[object RegExp]"
		];
		const joinArrays = opt.joinArrays !== void 0 ? opt.joinArrays : this.options.joinArrays;
		const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
		const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
		const hasDefaultValue = Translator.hasDefaultValue(opt);
		const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : "";
		const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, { ordinal: false }) : "";
		const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
		const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
		let resForObjHndl = res;
		if (handleAsObjectInI18nFormat && !res && hasDefaultValue) resForObjHndl = defaultValue;
		const handleAsObject = shouldHandleAsObject(resForObjHndl);
		const resType = Object.prototype.toString.apply(resForObjHndl);
		if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && !noObject.includes(resType) && !(isString$1(joinArrays) && Array.isArray(resForObjHndl))) {
			if (!opt.returnObjects && !this.options.returnObjects) {
				if (!this.options.returnedObjectHandler) this.logger.warn("accessing an object - but returnObjects options is not enabled!");
				const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
					...opt,
					ns: namespaces
				}) : `key '${key} (${this.language})' returned an object instead of string.`;
				if (returnDetails) {
					resolved.res = r;
					resolved.usedParams = this.getUsedParamsDetails(opt);
					return resolved;
				}
				return r;
			}
			if (keySeparator) {
				const resTypeIsArray = Array.isArray(resForObjHndl);
				const copy = resTypeIsArray ? [] : {};
				const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
				for (const m in resForObjHndl) if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
					const deepKey = `${newKeyToUse}${keySeparator}${m}`;
					if (hasDefaultValue && !res) copy[m] = this.translate(deepKey, {
						...opt,
						defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : void 0,
						joinArrays: false,
						ns: namespaces
					});
					else copy[m] = this.translate(deepKey, {
						...opt,
						joinArrays: false,
						ns: namespaces
					});
					if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
				}
				res = copy;
			}
		} else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
			res = res.join(joinArrays);
			if (res) res = this.extendTranslation(res, keys, opt, lastKey);
		} else {
			let usedDefault = false;
			let usedKey = false;
			if (!this.isValidLookup(res) && hasDefaultValue) {
				usedDefault = true;
				res = defaultValue;
			}
			if (!this.isValidLookup(res)) {
				usedKey = true;
				res = key;
			}
			const resForMissing = (opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && usedKey ? void 0 : res;
			const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
			if (usedKey || usedDefault || updateMissing) {
				this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, needsPluralHandling && !updateMissing ? `${key}${this.pluralResolver.getSuffix(lng, opt.count, opt)}` : key, updateMissing ? defaultValue : res);
				if (keySeparator) {
					const fk = this.resolve(key, {
						...opt,
						keySeparator: false
					});
					if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
				}
				let lngs = [];
				const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
				if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (let i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
				else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
				else lngs.push(opt.lng || this.language);
				const send = (l, k, specificDefaultValue) => {
					const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
					if (this.options.missingKeyHandler) this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
					else if (this.backendConnector?.saveMissing) this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
					this.emit("missingKey", l, namespace, k, res);
				};
				if (this.options.saveMissing) if (this.options.saveMissingPlurals && needsPluralHandling) lngs.forEach((language) => {
					const suffixes = this.pluralResolver.getSuffixes(language, opt);
					if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && !suffixes.includes(`${this.options.pluralSeparator}zero`)) suffixes.push(`${this.options.pluralSeparator}zero`);
					suffixes.forEach((suffix) => {
						send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
					});
				});
				else send(lngs, key, defaultValue);
			}
			res = this.extendTranslation(res, keys, opt, resolved, lastKey);
			if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}${nsSeparator}${key}`;
			if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : void 0, opt);
		}
		if (returnDetails) {
			resolved.res = res;
			resolved.usedParams = this.getUsedParamsDetails(opt);
			return resolved;
		}
		return res;
	}
	extendTranslation(res, key, opt, resolved, lastKey) {
		if (this.i18nFormat?.parse) res = this.i18nFormat.parse(res, {
			...this.options.interpolation.defaultVariables,
			...opt
		}, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
		else if (!opt.skipInterpolation) {
			if (opt.interpolation) this.interpolator.init({
				...opt,
				interpolation: {
					...this.options.interpolation,
					...opt.interpolation
				}
			});
			const skipOnVariables = isString$1(res) && (opt?.interpolation?.skipOnVariables !== void 0 ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
			let nestBef;
			if (skipOnVariables) {
				const nb = res.match(this.interpolator.nestingRegexp);
				nestBef = nb && nb.length;
			}
			let data = opt.replace && !isString$1(opt.replace) ? opt.replace : opt;
			if (this.options.interpolation.defaultVariables) data = {
				...this.options.interpolation.defaultVariables,
				...data
			};
			res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
			if (skipOnVariables) {
				const na = res.match(this.interpolator.nestingRegexp);
				const nestAft = na && na.length;
				if (nestBef < nestAft) opt.nest = false;
			}
			if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
			if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
				if (lastKey?.[0] === args[0] && !opt.context) {
					this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
					return null;
				}
				return this.translate(...args, key);
			}, opt);
			if (opt.interpolation) this.interpolator.reset();
		}
		const postProcess = opt.postProcess || this.options.postProcess;
		const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
		if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
			i18nResolved: {
				...resolved,
				usedParams: this.getUsedParamsDetails(opt)
			},
			...opt
		} : opt, this);
		return res;
	}
	resolve(keys, opt = {}) {
		let found;
		let usedKey;
		let exactUsedKey;
		let usedLng;
		let usedNS;
		if (isString$1(keys)) keys = [keys];
		if (Array.isArray(keys)) keys = keys.map((k) => typeof k === "function" ? keysFromSelector(k, {
			...this.options,
			...opt
		}) : k);
		keys.forEach((k) => {
			if (this.isValidLookup(found)) return;
			const extracted = this.extractFromKey(k, opt);
			const key = extracted.key;
			usedKey = key;
			let namespaces = extracted.namespaces;
			if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
			const needsPluralHandling = opt.count !== void 0 && !isString$1(opt.count);
			const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
			const needsContextHandling = opt.context !== void 0 && (isString$1(opt.context) || typeof opt.context === "number") && opt.context !== "";
			const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
			namespaces.forEach((ns) => {
				if (this.isValidLookup(found)) return;
				usedNS = ns;
				if (!this.checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
					this.checkedLoadedFor[`${codes[0]}-${ns}`] = true;
					this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
				}
				codes.forEach((code) => {
					if (this.isValidLookup(found)) return;
					usedLng = code;
					const finalKeys = [key];
					if (this.i18nFormat?.addLookupKeys) this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
					else {
						let pluralSuffix;
						if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
						const zeroSuffix = `${this.options.pluralSeparator}zero`;
						const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
						if (needsPluralHandling) {
							if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
							finalKeys.push(key + pluralSuffix);
							if (needsZeroSuffixLookup) finalKeys.push(key + zeroSuffix);
						}
						if (needsContextHandling) {
							const contextKey = `${key}${this.options.contextSeparator || "_"}${opt.context}`;
							finalKeys.push(contextKey);
							if (needsPluralHandling) {
								if (opt.ordinal && pluralSuffix.startsWith(ordinalPrefix)) finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
								finalKeys.push(contextKey + pluralSuffix);
								if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
							}
						}
					}
					let possibleKey;
					while (possibleKey = finalKeys.pop()) if (!this.isValidLookup(found)) {
						exactUsedKey = possibleKey;
						found = this.getResource(code, ns, possibleKey, opt);
					}
				});
			});
		});
		return {
			res: found,
			usedKey,
			exactUsedKey,
			usedLng,
			usedNS
		};
	}
	isValidLookup(res) {
		return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
	}
	getResource(code, ns, key, options = {}) {
		if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
		return this.resourceStore.getResource(code, ns, key, options);
	}
	getUsedParamsDetails(options = {}) {
		const optionsKeys = [
			"defaultValue",
			"ordinal",
			"context",
			"replace",
			"lng",
			"lngs",
			"fallbackLng",
			"ns",
			"keySeparator",
			"nsSeparator",
			"returnObjects",
			"returnDetails",
			"joinArrays",
			"postProcess",
			"interpolation"
		];
		const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
		let data = useOptionsReplaceForData ? options.replace : options;
		if (useOptionsReplaceForData && typeof options.count !== "undefined") data.count = options.count;
		if (this.options.interpolation.defaultVariables) data = {
			...this.options.interpolation.defaultVariables,
			...data
		};
		if (!useOptionsReplaceForData) {
			data = { ...data };
			for (const key of optionsKeys) delete data[key];
		}
		return data;
	}
	static hasDefaultValue(options) {
		const prefix = "defaultValue";
		for (const option in options) if (Object.prototype.hasOwnProperty.call(options, option) && option.startsWith(prefix) && void 0 !== options[option]) return true;
		return false;
	}
};
var LanguageUtil = class {
	constructor(options) {
		this.options = options;
		this.supportedLngs = this.options.supportedLngs || false;
		this.logger = baseLogger.create("languageUtils");
	}
	getScriptPartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || !code.includes("-")) return null;
		const p = code.split("-");
		if (p.length === 2) return null;
		p.pop();
		if (p[p.length - 1].toLowerCase() === "x") return null;
		return this.formatLanguageCode(p.join("-"));
	}
	getLanguagePartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || !code.includes("-")) return code;
		const p = code.split("-");
		return this.formatLanguageCode(p[0]);
	}
	formatLanguageCode(code) {
		if (isString$1(code) && code.includes("-")) {
			let formattedCode;
			try {
				formattedCode = Intl.getCanonicalLocales(code)[0];
			} catch (e) {}
			if (formattedCode && this.options.lowerCaseLng) formattedCode = formattedCode.toLowerCase();
			if (formattedCode) return formattedCode;
			if (this.options.lowerCaseLng) return code.toLowerCase();
			return code;
		}
		return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
	}
	isSupportedCode(code) {
		if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) code = this.getLanguagePartFromCode(code);
		return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(code);
	}
	getBestMatchFromCodes(codes) {
		if (!codes) return null;
		let found;
		codes.forEach((code) => {
			if (found) return;
			const cleanedLng = this.formatLanguageCode(code);
			if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
		});
		if (!found && this.options.supportedLngs) codes.forEach((code) => {
			if (found) return;
			const lngScOnly = this.getScriptPartFromCode(code);
			if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
			const lngOnly = this.getLanguagePartFromCode(code);
			if (this.isSupportedCode(lngOnly)) return found = lngOnly;
			found = this.options.supportedLngs.find((supportedLng) => {
				if (supportedLng === lngOnly) return true;
				if (!supportedLng.includes("-") && !lngOnly.includes("-")) return false;
				if (supportedLng.includes("-") && !lngOnly.includes("-") && supportedLng.slice(0, supportedLng.indexOf("-")) === lngOnly) return true;
				if (supportedLng.startsWith(lngOnly) && lngOnly.length > 1) return true;
				return false;
			});
		});
		if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
		return found;
	}
	getFallbackCodes(fallbacks, code) {
		if (!fallbacks) return [];
		if (typeof fallbacks === "function") fallbacks = fallbacks(code);
		if (isString$1(fallbacks)) fallbacks = [fallbacks];
		if (Array.isArray(fallbacks)) return fallbacks;
		if (!code) return fallbacks.default || [];
		let found = fallbacks[code];
		if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
		if (!found) found = fallbacks[this.formatLanguageCode(code)];
		if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
		if (!found) found = fallbacks.default;
		return found || [];
	}
	toResolveHierarchy(code, fallbackCode) {
		const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
		const codes = [];
		const addCode = (c) => {
			if (!c) return;
			if (this.isSupportedCode(c)) codes.push(c);
			else this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
		};
		if (isString$1(code) && (code.includes("-") || code.includes("_"))) {
			if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
			if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
			if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
		} else if (isString$1(code)) addCode(this.formatLanguageCode(code));
		fallbackCodes.forEach((fc) => {
			if (!codes.includes(fc)) addCode(this.formatLanguageCode(fc));
		});
		return codes;
	}
};
var suffixesOrder = {
	zero: 0,
	one: 1,
	two: 2,
	few: 3,
	many: 4,
	other: 5
};
var dummyRule = {
	select: (count) => count === 1 ? "one" : "other",
	resolvedOptions: () => ({ pluralCategories: ["one", "other"] })
};
var PluralResolver = class {
	constructor(languageUtils, options = {}) {
		this.languageUtils = languageUtils;
		this.options = options;
		this.logger = baseLogger.create("pluralResolver");
		this.pluralRulesCache = {};
	}
	clearCache() {
		this.pluralRulesCache = {};
	}
	getRule(code, options = {}) {
		const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
		const type = options.ordinal ? "ordinal" : "cardinal";
		const cacheKey = JSON.stringify({
			cleanedCode,
			type
		});
		if (cacheKey in this.pluralRulesCache) return this.pluralRulesCache[cacheKey];
		let rule;
		try {
			rule = new Intl.PluralRules(cleanedCode, { type });
		} catch (err) {
			if (typeof Intl === "undefined") {
				this.logger.error("No Intl support, please use an Intl polyfill!");
				return dummyRule;
			}
			if (!code.match(/-|_/)) return dummyRule;
			const lngPart = this.languageUtils.getLanguagePartFromCode(code);
			rule = this.getRule(lngPart, options);
		}
		this.pluralRulesCache[cacheKey] = rule;
		return rule;
	}
	needsPlural(code, options = {}) {
		let rule = this.getRule(code, options);
		if (!rule) rule = this.getRule("dev", options);
		return rule?.resolvedOptions().pluralCategories.length > 1;
	}
	getPluralFormsOfKey(code, key, options = {}) {
		return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
	}
	getSuffixes(code, options = {}) {
		let rule = this.getRule(code, options);
		if (!rule) rule = this.getRule("dev", options);
		if (!rule) return [];
		return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
	}
	getSuffix(code, count, options = {}) {
		const rule = this.getRule(code, options);
		if (rule) return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
		this.logger.warn(`no plural rule found for: ${code}`);
		return this.getSuffix("dev", count, options);
	}
};
var deepFindWithDefaults = (data, defaultData, key, keySeparator = ".", ignoreJSONStructure = true) => {
	let path = getPathWithDefaults(data, defaultData, key);
	if (!path && ignoreJSONStructure && isString$1(key)) {
		path = deepFind(data, key, keySeparator);
		if (path === void 0) path = deepFind(defaultData, key, keySeparator);
	}
	return path;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
	constructor(options = {}) {
		this.logger = baseLogger.create("interpolator");
		this.options = options;
		this.format = options?.interpolation?.format || ((value) => value);
		this.init(options);
	}
	init(options = {}) {
		if (!options.interpolation) options.interpolation = { escapeValue: true };
		const { escape: escape$1, escapeValue, useRawValueToEscape, prefix, prefixEscaped, suffix, suffixEscaped, formatSeparator, unescapeSuffix, unescapePrefix, nestingPrefix, nestingPrefixEscaped, nestingSuffix, nestingSuffixEscaped, nestingOptionsSeparator, maxReplaces, alwaysFormat } = options.interpolation;
		this.escape = escape$1 !== void 0 ? escape$1 : escape$2;
		this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
		this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
		this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
		this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
		this.formatSeparator = formatSeparator || ",";
		this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix ? regexEscape(unescapePrefix) : "-";
		this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix ? regexEscape(unescapeSuffix) : "";
		this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
		this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
		this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
		this.maxReplaces = maxReplaces || 1e3;
		this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
		this.resetRegExp();
	}
	reset() {
		if (this.options) this.init(this.options);
	}
	resetRegExp() {
		const getOrResetRegExp = (existingRegExp, pattern) => {
			if (existingRegExp?.source === pattern) {
				existingRegExp.lastIndex = 0;
				return existingRegExp;
			}
			return new RegExp(pattern, "g");
		};
		this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
		this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
		this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
	}
	interpolate(str, data, lng, options) {
		let match;
		let value;
		let replaces;
		const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
		const handleFormat = (key) => {
			if (!key.includes(this.formatSeparator)) {
				const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
				return this.alwaysFormat ? this.format(path, void 0, lng, {
					...options,
					...data,
					interpolationkey: key
				}) : path;
			}
			const p = key.split(this.formatSeparator);
			const k = p.shift().trim();
			const f = p.join(this.formatSeparator).trim();
			return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
				...options,
				...data,
				interpolationkey: k
			});
		};
		this.resetRegExp();
		if (!this.escapeValue && typeof str === "string" && /\$t\([^)]*\{[^}]*\{\{/.test(str)) this.logger.warn("nesting options string contains interpolated variables with escapeValue: false — if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
		const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
		const skipOnVariables = options?.interpolation?.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
		[{
			regex: this.regexpUnescape,
			safeValue: (val) => regexSafe(val)
		}, {
			regex: this.regexp,
			safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
		}].forEach((todo) => {
			replaces = 0;
			while (match = todo.regex.exec(str)) {
				const matchedVar = match[1].trim();
				value = handleFormat(matchedVar);
				if (value === void 0) if (typeof missingInterpolationHandler === "function") {
					const temp = missingInterpolationHandler(str, match, options);
					value = isString$1(temp) ? temp : "";
				} else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) value = "";
				else if (skipOnVariables) {
					value = match[0];
					continue;
				} else {
					this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
					value = "";
				}
				else if (!isString$1(value) && !this.useRawValueToEscape) value = makeString(value);
				const safeValue = todo.safeValue(value);
				str = str.replace(match[0], safeValue);
				if (skipOnVariables) {
					todo.regex.lastIndex += value.length;
					todo.regex.lastIndex -= match[0].length;
				} else todo.regex.lastIndex = 0;
				replaces++;
				if (replaces >= this.maxReplaces) break;
			}
		});
		return str;
	}
	nest(str, fc, options = {}) {
		let match;
		let value;
		let clonedOptions;
		const handleHasOptions = (key, inheritedOptions) => {
			const sep = this.nestingOptionsSeparator;
			if (!key.includes(sep)) return key;
			const c = key.split(new RegExp(`${regexEscape(sep)}[ ]*{`));
			let optionsString = `{${c[1]}`;
			key = c[0];
			optionsString = this.interpolate(optionsString, clonedOptions);
			const matchedSingleQuotes = optionsString.match(/'/g);
			const matchedDoubleQuotes = optionsString.match(/"/g);
			if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || (matchedDoubleQuotes?.length ?? 0) % 2 !== 0) optionsString = optionsString.replace(/'/g, "\"");
			try {
				clonedOptions = JSON.parse(optionsString);
				if (inheritedOptions) clonedOptions = {
					...inheritedOptions,
					...clonedOptions
				};
			} catch (e) {
				this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
				return `${key}${sep}${optionsString}`;
			}
			if (clonedOptions.defaultValue && clonedOptions.defaultValue.includes(this.prefix)) delete clonedOptions.defaultValue;
			return key;
		};
		while (match = this.nestingRegexp.exec(str)) {
			let formatters = [];
			clonedOptions = { ...options };
			clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
			clonedOptions.applyPostProcessor = false;
			delete clonedOptions.defaultValue;
			const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf("}") + 1 : match[1].indexOf(this.formatSeparator);
			if (keyEndIndex !== -1) {
				formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map((elem) => elem.trim()).filter(Boolean);
				match[1] = match[1].slice(0, keyEndIndex);
			}
			value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
			if (value && match[0] === str && !isString$1(value)) return value;
			if (!isString$1(value)) value = makeString(value);
			if (!value) {
				this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
				value = "";
			}
			if (formatters.length) value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
				...options,
				interpolationkey: match[1].trim()
			}), value.trim());
			str = str.replace(match[0], value);
			this.regexp.lastIndex = 0;
		}
		return str;
	}
};
var parseFormatStr = (formatStr) => {
	let formatName = formatStr.toLowerCase().trim();
	const formatOptions = {};
	if (formatStr.includes("(")) {
		const p = formatStr.split("(");
		formatName = p[0].toLowerCase().trim();
		const optStr = p[1].slice(0, -1);
		if (formatName === "currency" && !optStr.includes(":")) {
			if (!formatOptions.currency) formatOptions.currency = optStr.trim();
		} else if (formatName === "relativetime" && !optStr.includes(":")) {
			if (!formatOptions.range) formatOptions.range = optStr.trim();
		} else optStr.split(";").forEach((opt) => {
			if (opt) {
				const [key, ...rest] = opt.split(":");
				const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
				const trimmedKey = key.trim();
				if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
				if (val === "false") formatOptions[trimmedKey] = false;
				if (val === "true") formatOptions[trimmedKey] = true;
				if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
			}
		});
	}
	return {
		formatName,
		formatOptions
	};
};
var createCachedFormatter = (fn) => {
	const cache = {};
	return (v, l, o) => {
		let optForCache = o;
		if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) optForCache = {
			...optForCache,
			[o.interpolationkey]: void 0
		};
		const key = l + JSON.stringify(optForCache);
		let frm = cache[key];
		if (!frm) {
			frm = fn(getCleanedCode(l), o);
			cache[key] = frm;
		}
		return frm(v);
	};
};
var createNonCachedFormatter = (fn) => (v, l, o) => fn(getCleanedCode(l), o)(v);
var Formatter = class {
	constructor(options = {}) {
		this.logger = baseLogger.create("formatter");
		this.options = options;
		this.init(options);
	}
	init(services, options = { interpolation: {} }) {
		this.formatSeparator = options.interpolation.formatSeparator || ",";
		const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
		this.formats = {
			number: cf((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			currency: cf((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, {
					...opt,
					style: "currency"
				});
				return (val) => formatter.format(val);
			}),
			datetime: cf((lng, opt) => {
				const formatter = new Intl.DateTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			relativetime: cf((lng, opt) => {
				const formatter = new Intl.RelativeTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val, opt.range || "day");
			}),
			list: cf((lng, opt) => {
				const formatter = new Intl.ListFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			})
		};
	}
	add(name, fc) {
		this.formats[name.toLowerCase().trim()] = fc;
	}
	addCached(name, fc) {
		this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
	}
	format(value, format, lng, options = {}) {
		if (!format) return value;
		if (value == null) return value;
		const formats = format.split(this.formatSeparator);
		if (formats.length > 1 && formats[0].indexOf("(") > 1 && !formats[0].includes(")") && formats.find((f) => f.includes(")"))) {
			const lastIndex = formats.findIndex((f) => f.includes(")"));
			formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
		}
		return formats.reduce((mem, f) => {
			const { formatName, formatOptions } = parseFormatStr(f);
			if (this.formats[formatName]) {
				let formatted = mem;
				try {
					const valOptions = options?.formatParams?.[options.interpolationkey] || {};
					const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
					formatted = this.formats[formatName](mem, l, {
						...formatOptions,
						...options,
						...valOptions
					});
				} catch (error) {
					this.logger.warn(error);
				}
				return formatted;
			} else this.logger.warn(`there was no format function for ${formatName}`);
			return mem;
		}, value);
	}
};
var removePending = (q, name) => {
	if (q.pending[name] !== void 0) {
		delete q.pending[name];
		q.pendingCount--;
	}
};
var Connector = class extends EventEmitter$2 {
	constructor(backend, store, services, options = {}) {
		super();
		this.backend = backend;
		this.store = store;
		this.services = services;
		this.languageUtils = services.languageUtils;
		this.options = options;
		this.logger = baseLogger.create("backendConnector");
		this.waitingReads = [];
		this.maxParallelReads = options.maxParallelReads || 10;
		this.readingCalls = 0;
		this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
		this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
		this.state = {};
		this.queue = [];
		this.backend?.init?.(services, options.backend, options);
	}
	queueLoad(languages, namespaces, options, callback) {
		const toLoad = {};
		const pending = {};
		const toLoadLanguages = {};
		const toLoadNamespaces = {};
		languages.forEach((lng) => {
			let hasAllNamespaces = true;
			namespaces.forEach((ns) => {
				const name = `${lng}|${ns}`;
				if (!options.reload && this.store.hasResourceBundle(lng, ns)) this.state[name] = 2;
				else if (this.state[name] < 0);
				else if (this.state[name] === 1) {
					if (pending[name] === void 0) pending[name] = true;
				} else {
					this.state[name] = 1;
					hasAllNamespaces = false;
					if (pending[name] === void 0) pending[name] = true;
					if (toLoad[name] === void 0) toLoad[name] = true;
					if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
				}
			});
			if (!hasAllNamespaces) toLoadLanguages[lng] = true;
		});
		if (Object.keys(toLoad).length || Object.keys(pending).length) this.queue.push({
			pending,
			pendingCount: Object.keys(pending).length,
			loaded: {},
			errors: [],
			callback
		});
		return {
			toLoad: Object.keys(toLoad),
			pending: Object.keys(pending),
			toLoadLanguages: Object.keys(toLoadLanguages),
			toLoadNamespaces: Object.keys(toLoadNamespaces)
		};
	}
	loaded(name, err, data) {
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		if (err) this.emit("failedLoading", lng, ns, err);
		if (!err && data) this.store.addResourceBundle(lng, ns, data, void 0, void 0, { skipCopy: true });
		this.state[name] = err ? -1 : 2;
		if (err && data) this.state[name] = 0;
		const loaded = {};
		this.queue.forEach((q) => {
			pushPath(q.loaded, [lng], ns);
			removePending(q, name);
			if (err) q.errors.push(err);
			if (q.pendingCount === 0 && !q.done) {
				Object.keys(q.loaded).forEach((l) => {
					if (!loaded[l]) loaded[l] = {};
					const loadedKeys = q.loaded[l];
					if (loadedKeys.length) loadedKeys.forEach((n) => {
						if (loaded[l][n] === void 0) loaded[l][n] = true;
					});
				});
				q.done = true;
				if (q.errors.length) q.callback(q.errors);
				else q.callback();
			}
		});
		this.emit("loaded", loaded);
		this.queue = this.queue.filter((q) => !q.done);
	}
	read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
		if (!lng.length) return callback(null, {});
		if (this.readingCalls >= this.maxParallelReads) {
			this.waitingReads.push({
				lng,
				ns,
				fcName,
				tried,
				wait,
				callback
			});
			return;
		}
		this.readingCalls++;
		const resolver = (err, data) => {
			this.readingCalls--;
			if (this.waitingReads.length > 0) {
				const next = this.waitingReads.shift();
				this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
			}
			if (err && data && tried < this.maxRetries) {
				setTimeout(() => {
					this.read(lng, ns, fcName, tried + 1, wait * 2, callback);
				}, wait);
				return;
			}
			callback(err, data);
		};
		const fc = this.backend[fcName].bind(this.backend);
		if (fc.length === 2) {
			try {
				const r = fc(lng, ns);
				if (r && typeof r.then === "function") r.then((data) => resolver(null, data)).catch(resolver);
				else resolver(null, r);
			} catch (err) {
				resolver(err);
			}
			return;
		}
		return fc(lng, ns, resolver);
	}
	prepareLoading(languages, namespaces, options = {}, callback) {
		if (!this.backend) {
			this.logger.warn("No backend was added via i18next.use. Will not load resources.");
			return callback && callback();
		}
		if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
		if (isString$1(namespaces)) namespaces = [namespaces];
		const toLoad = this.queueLoad(languages, namespaces, options, callback);
		if (!toLoad.toLoad.length) {
			if (!toLoad.pending.length) callback();
			return null;
		}
		toLoad.toLoad.forEach((name) => {
			this.loadOne(name);
		});
	}
	load(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, {}, callback);
	}
	reload(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, { reload: true }, callback);
	}
	loadOne(name, prefix = "") {
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		this.read(lng, ns, "read", void 0, void 0, (err, data) => {
			if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
			if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
			this.loaded(name, err, data);
		});
	}
	saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {}) {
		if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
			this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
			return;
		}
		if (key === void 0 || key === null || key === "") return;
		if (this.backend?.create) {
			const opts = {
				...options,
				isUpdate
			};
			const fc = this.backend.create.bind(this.backend);
			if (fc.length < 6) try {
				let r;
				if (fc.length === 5) r = fc(languages, namespace, key, fallbackValue, opts);
				else r = fc(languages, namespace, key, fallbackValue);
				if (r && typeof r.then === "function") r.then((data) => clb(null, data)).catch(clb);
				else clb(null, r);
			} catch (err) {
				clb(err);
			}
			else fc(languages, namespace, key, fallbackValue, clb, opts);
		}
		if (!languages || !languages[0]) return;
		this.store.addResource(languages[0], namespace, key, fallbackValue);
	}
};
var get = () => ({
	debug: false,
	initAsync: true,
	ns: ["translation"],
	defaultNS: ["translation"],
	fallbackLng: ["dev"],
	fallbackNS: false,
	supportedLngs: false,
	nonExplicitSupportedLngs: false,
	load: "all",
	preload: false,
	keySeparator: ".",
	nsSeparator: ":",
	pluralSeparator: "_",
	contextSeparator: "_",
	partialBundledLanguages: false,
	saveMissing: false,
	updateMissing: false,
	saveMissingTo: "fallback",
	saveMissingPlurals: true,
	missingKeyHandler: false,
	missingInterpolationHandler: false,
	postProcess: false,
	postProcessPassResolved: false,
	returnNull: false,
	returnEmptyString: true,
	returnObjects: false,
	joinArrays: false,
	returnedObjectHandler: false,
	parseMissingKeyHandler: false,
	appendNamespaceToMissingKey: false,
	appendNamespaceToCIMode: false,
	overloadTranslationOptionHandler: (args) => {
		let ret = {};
		if (typeof args[1] === "object") ret = args[1];
		if (isString$1(args[1])) ret.defaultValue = args[1];
		if (isString$1(args[2])) ret.tDescription = args[2];
		if (typeof args[2] === "object" || typeof args[3] === "object") {
			const options = args[3] || args[2];
			Object.keys(options).forEach((key) => {
				ret[key] = options[key];
			});
		}
		return ret;
	},
	interpolation: {
		escapeValue: true,
		prefix: "{{",
		suffix: "}}",
		formatSeparator: ",",
		unescapePrefix: "-",
		nestingPrefix: "$t(",
		nestingSuffix: ")",
		nestingOptionsSeparator: ",",
		maxReplaces: 1e3,
		skipOnVariables: true
	},
	cacheInBuiltFormats: true
});
var transformOptions = (options) => {
	if (isString$1(options.ns)) options.ns = [options.ns];
	if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
	if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
	if (options.supportedLngs && !options.supportedLngs.includes("cimode")) options.supportedLngs = options.supportedLngs.concat(["cimode"]);
	return options;
};
var noop = () => {};
var bindMemberFunctions = (inst) => {
	Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach((mem) => {
		if (typeof inst[mem] === "function") inst[mem] = inst[mem].bind(inst);
	});
};
var instance = class I18n extends EventEmitter$2 {
	constructor(options = {}, callback) {
		super();
		this.options = transformOptions(options);
		this.services = {};
		this.logger = baseLogger;
		this.modules = { external: [] };
		bindMemberFunctions(this);
		if (callback && !this.isInitialized && !options.isClone) {
			if (!this.options.initAsync) {
				this.init(options, callback);
				return this;
			}
			setTimeout(() => {
				this.init(options, callback);
			}, 0);
		}
	}
	init(options = {}, callback) {
		this.isInitializing = true;
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		if (options.defaultNS == null && options.ns) {
			if (isString$1(options.ns)) options.defaultNS = options.ns;
			else if (!options.ns.includes("translation")) options.defaultNS = options.ns[0];
		}
		const defOpts = get();
		this.options = {
			...defOpts,
			...this.options,
			...transformOptions(options)
		};
		this.options.interpolation = {
			...defOpts.interpolation,
			...this.options.interpolation
		};
		if (options.keySeparator !== void 0) this.options.userDefinedKeySeparator = options.keySeparator;
		if (options.nsSeparator !== void 0) this.options.userDefinedNsSeparator = options.nsSeparator;
		if (typeof this.options.overloadTranslationOptionHandler !== "function") this.options.overloadTranslationOptionHandler = defOpts.overloadTranslationOptionHandler;
		const createClassOnDemand = (ClassOrObject) => {
			if (!ClassOrObject) return null;
			if (typeof ClassOrObject === "function") return new ClassOrObject();
			return ClassOrObject;
		};
		if (!this.options.isClone) {
			if (this.modules.logger) baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
			else baseLogger.init(null, this.options);
			let formatter;
			if (this.modules.formatter) formatter = this.modules.formatter;
			else formatter = Formatter;
			const lu = new LanguageUtil(this.options);
			this.store = new ResourceStore(this.options.resources, this.options);
			const s = this.services;
			s.logger = baseLogger;
			s.resourceStore = this.store;
			s.languageUtils = lu;
			s.pluralResolver = new PluralResolver(lu, { prepend: this.options.pluralSeparator });
			if (formatter) {
				s.formatter = createClassOnDemand(formatter);
				if (s.formatter.init) s.formatter.init(s, this.options);
				this.options.interpolation.format = s.formatter.format.bind(s.formatter);
			}
			s.interpolator = new Interpolator(this.options);
			s.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
			s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
			s.backendConnector.on("*", (event, ...args) => {
				this.emit(event, ...args);
			});
			if (this.modules.languageDetector) {
				s.languageDetector = createClassOnDemand(this.modules.languageDetector);
				if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
			}
			if (this.modules.i18nFormat) {
				s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
				if (s.i18nFormat.init) s.i18nFormat.init(this);
			}
			this.translator = new Translator(this.services, this.options);
			this.translator.on("*", (event, ...args) => {
				this.emit(event, ...args);
			});
			this.modules.external.forEach((m) => {
				if (m.init) m.init(this);
			});
		}
		this.format = this.options.interpolation.format;
		if (!callback) callback = noop;
		if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
			const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
			if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
		}
		if (!this.services.languageDetector && !this.options.lng) this.logger.warn("init: no languageDetector is used and no lng is defined");
		[
			"getResource",
			"hasResourceBundle",
			"getResourceBundle",
			"getDataByLanguage"
		].forEach((fcName) => {
			this[fcName] = (...args) => this.store[fcName](...args);
		});
		[
			"addResource",
			"addResources",
			"addResourceBundle",
			"removeResourceBundle"
		].forEach((fcName) => {
			this[fcName] = (...args) => {
				this.store[fcName](...args);
				return this;
			};
		});
		const deferred = defer();
		const load = () => {
			const finish = (err, t) => {
				this.isInitializing = false;
				if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
				this.isInitialized = true;
				if (!this.options.isClone) this.logger.log("initialized", this.options);
				this.emit("initialized", this.options);
				deferred.resolve(t);
				callback(err, t);
			};
			if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return finish(null, this.t.bind(this));
			this.changeLanguage(this.options.lng, finish);
		};
		if (this.options.resources || !this.options.initAsync) load();
		else setTimeout(load, 0);
		return deferred;
	}
	loadResources(language, callback = noop) {
		let usedCallback = callback;
		const usedLng = isString$1(language) ? language : this.language;
		if (typeof language === "function") usedCallback = language;
		if (!this.options.resources || this.options.partialBundledLanguages) {
			if (usedLng?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
			const toLoad = [];
			const append = (lng) => {
				if (!lng) return;
				if (lng === "cimode") return;
				this.services.languageUtils.toResolveHierarchy(lng).forEach((l) => {
					if (l === "cimode") return;
					if (!toLoad.includes(l)) toLoad.push(l);
				});
			};
			if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l) => append(l));
			else append(usedLng);
			this.options.preload?.forEach?.((l) => append(l));
			this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
				if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
				usedCallback(e);
			});
		} else usedCallback(null);
	}
	reloadResources(lngs, ns, callback) {
		const deferred = defer();
		if (typeof lngs === "function") {
			callback = lngs;
			lngs = void 0;
		}
		if (typeof ns === "function") {
			callback = ns;
			ns = void 0;
		}
		if (!lngs) lngs = this.languages;
		if (!ns) ns = this.options.ns;
		if (!callback) callback = noop;
		this.services.backendConnector.reload(lngs, ns, (err) => {
			deferred.resolve();
			callback(err);
		});
		return deferred;
	}
	use(module) {
		if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
		if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
		if (module.type === "backend") this.modules.backend = module;
		if (module.type === "logger" || module.log && module.warn && module.error) this.modules.logger = module;
		if (module.type === "languageDetector") this.modules.languageDetector = module;
		if (module.type === "i18nFormat") this.modules.i18nFormat = module;
		if (module.type === "postProcessor") postProcessor.addPostProcessor(module);
		if (module.type === "formatter") this.modules.formatter = module;
		if (module.type === "3rdParty") this.modules.external.push(module);
		return this;
	}
	setResolvedLanguage(l) {
		if (!l || !this.languages) return;
		if (["cimode", "dev"].includes(l)) return;
		for (let li = 0; li < this.languages.length; li++) {
			const lngInLngs = this.languages[li];
			if (["cimode", "dev"].includes(lngInLngs)) continue;
			if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
				this.resolvedLanguage = lngInLngs;
				break;
			}
		}
		if (!this.resolvedLanguage && !this.languages.includes(l) && this.store.hasLanguageSomeTranslations(l)) {
			this.resolvedLanguage = l;
			this.languages.unshift(l);
		}
	}
	changeLanguage(lng, callback) {
		this.isLanguageChangingTo = lng;
		const deferred = defer();
		this.emit("languageChanging", lng);
		const setLngProps = (l) => {
			this.language = l;
			this.languages = this.services.languageUtils.toResolveHierarchy(l);
			this.resolvedLanguage = void 0;
			this.setResolvedLanguage(l);
		};
		const done = (err, l) => {
			if (l) {
				if (this.isLanguageChangingTo === lng) {
					setLngProps(l);
					this.translator.changeLanguage(l);
					this.isLanguageChangingTo = void 0;
					this.emit("languageChanged", l);
					this.logger.log("languageChanged", l);
				}
			} else this.isLanguageChangingTo = void 0;
			deferred.resolve((...args) => this.t(...args));
			if (callback) callback(err, (...args) => this.t(...args));
		};
		const setLng = (lngs) => {
			if (!lng && !lngs && this.services.languageDetector) lngs = [];
			const fl = isString$1(lngs) ? lngs : lngs && lngs[0];
			const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString$1(lngs) ? [lngs] : lngs);
			if (l) {
				if (!this.language) setLngProps(l);
				if (!this.translator.language) this.translator.changeLanguage(l);
				this.services.languageDetector?.cacheUserLanguage?.(l);
			}
			this.loadResources(l, (err) => {
				done(err, l);
			});
		};
		if (!lng && this.services.languageDetector && !this.services.languageDetector.async) setLng(this.services.languageDetector.detect());
		else if (!lng && this.services.languageDetector && this.services.languageDetector.async) if (this.services.languageDetector.detect.length === 0) this.services.languageDetector.detect().then(setLng);
		else this.services.languageDetector.detect(setLng);
		else setLng(lng);
		return deferred;
	}
	getFixedT(lng, ns, keyPrefix) {
		const fixedT = (key, opts, ...rest) => {
			let o;
			if (typeof opts !== "object") o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
			else o = { ...opts };
			o.lng = o.lng || fixedT.lng;
			o.lngs = o.lngs || fixedT.lngs;
			o.ns = o.ns || fixedT.ns;
			if (o.keyPrefix !== "") o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
			const selectorOpts = {
				...this.options,
				...o
			};
			if (typeof o.keyPrefix === "function") o.keyPrefix = keysFromSelector(o.keyPrefix, selectorOpts);
			const keySeparator = this.options.keySeparator || ".";
			let resultKey;
			if (o.keyPrefix && Array.isArray(key)) resultKey = key.map((k) => {
				if (typeof k === "function") k = keysFromSelector(k, selectorOpts);
				return `${o.keyPrefix}${keySeparator}${k}`;
			});
			else {
				if (typeof key === "function") key = keysFromSelector(key, selectorOpts);
				resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
			}
			return this.t(resultKey, o);
		};
		if (isString$1(lng)) fixedT.lng = lng;
		else fixedT.lngs = lng;
		fixedT.ns = ns;
		fixedT.keyPrefix = keyPrefix;
		return fixedT;
	}
	t(...args) {
		return this.translator?.translate(...args);
	}
	exists(...args) {
		return this.translator?.exists(...args);
	}
	setDefaultNamespace(ns) {
		this.options.defaultNS = ns;
	}
	hasLoadedNamespace(ns, options = {}) {
		if (!this.isInitialized) {
			this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
			return false;
		}
		if (!this.languages || !this.languages.length) {
			this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
			return false;
		}
		const lng = options.lng || this.resolvedLanguage || this.languages[0];
		const fallbackLng = this.options ? this.options.fallbackLng : false;
		const lastLng = this.languages[this.languages.length - 1];
		if (lng.toLowerCase() === "cimode") return true;
		const loadNotPending = (l, n) => {
			const loadState = this.services.backendConnector.state[`${l}|${n}`];
			return loadState === -1 || loadState === 0 || loadState === 2;
		};
		if (options.precheck) {
			const preResult = options.precheck(this, loadNotPending);
			if (preResult !== void 0) return preResult;
		}
		if (this.hasResourceBundle(lng, ns)) return true;
		if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
		if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
		return false;
	}
	loadNamespaces(ns, callback) {
		const deferred = defer();
		if (!this.options.ns) {
			if (callback) callback();
			return Promise.resolve();
		}
		if (isString$1(ns)) ns = [ns];
		ns.forEach((n) => {
			if (!this.options.ns.includes(n)) this.options.ns.push(n);
		});
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	loadLanguages(lngs, callback) {
		const deferred = defer();
		if (isString$1(lngs)) lngs = [lngs];
		const preloaded = this.options.preload || [];
		const newLngs = lngs.filter((lng) => !preloaded.includes(lng) && this.services.languageUtils.isSupportedCode(lng));
		if (!newLngs.length) {
			if (callback) callback();
			return Promise.resolve();
		}
		this.options.preload = preloaded.concat(newLngs);
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	dir(lng) {
		if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
		if (!lng) return "rtl";
		try {
			const l = new Intl.Locale(lng);
			if (l && l.getTextInfo) {
				const ti = l.getTextInfo();
				if (ti && ti.direction) return ti.direction;
			}
		} catch (e) {}
		const rtlLngs = [
			"ar",
			"shu",
			"sqr",
			"ssh",
			"xaa",
			"yhd",
			"yud",
			"aao",
			"abh",
			"abv",
			"acm",
			"acq",
			"acw",
			"acx",
			"acy",
			"adf",
			"ads",
			"aeb",
			"aec",
			"afb",
			"ajp",
			"apc",
			"apd",
			"arb",
			"arq",
			"ars",
			"ary",
			"arz",
			"auz",
			"avl",
			"ayh",
			"ayl",
			"ayn",
			"ayp",
			"bbz",
			"pga",
			"he",
			"iw",
			"ps",
			"pbt",
			"pbu",
			"pst",
			"prp",
			"prd",
			"ug",
			"ur",
			"ydd",
			"yds",
			"yih",
			"ji",
			"yi",
			"hbo",
			"men",
			"xmn",
			"fa",
			"jpr",
			"peo",
			"pes",
			"prs",
			"dv",
			"sam",
			"ckb"
		];
		const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
		if (lng.toLowerCase().indexOf("-latn") > 1) return "ltr";
		return rtlLngs.includes(languageUtils.getLanguagePartFromCode(lng)) || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
	}
	static createInstance(options = {}, callback) {
		const instance = new I18n(options, callback);
		instance.createInstance = I18n.createInstance;
		return instance;
	}
	cloneInstance(options = {}, callback = noop) {
		const forkResourceStore = options.forkResourceStore;
		if (forkResourceStore) delete options.forkResourceStore;
		const mergedOptions = {
			...this.options,
			...options,
			isClone: true
		};
		const clone = new I18n(mergedOptions);
		if (options.debug !== void 0 || options.prefix !== void 0) clone.logger = clone.logger.clone(options);
		[
			"store",
			"services",
			"language"
		].forEach((m) => {
			clone[m] = this[m];
		});
		clone.services = { ...this.services };
		clone.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		if (forkResourceStore) {
			clone.store = new ResourceStore(Object.keys(this.store.data).reduce((prev, l) => {
				prev[l] = { ...this.store.data[l] };
				prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
					acc[n] = { ...prev[l][n] };
					return acc;
				}, prev[l]);
				return prev;
			}, {}), mergedOptions);
			clone.services.resourceStore = clone.store;
		}
		if (options.interpolation) {
			const mergedInterpolation = {
				...get().interpolation,
				...this.options.interpolation,
				...options.interpolation
			};
			const mergedForInterpolator = {
				...mergedOptions,
				interpolation: mergedInterpolation
			};
			clone.services.interpolator = new Interpolator(mergedForInterpolator);
		}
		clone.translator = new Translator(clone.services, mergedOptions);
		clone.translator.on("*", (event, ...args) => {
			clone.emit(event, ...args);
		});
		clone.init(mergedOptions, callback);
		clone.translator.options = mergedOptions;
		clone.translator.backendConnector.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		return clone;
	}
	toJSON() {
		return {
			options: this.options,
			store: this.store,
			language: this.language,
			languages: this.languages,
			resolvedLanguage: this.resolvedLanguage
		};
	}
}.createInstance();
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/utils.js
var warn = (i18n, code, msg, rest) => {
	const args = [msg, {
		code,
		...rest || {}
	}];
	if (i18n?.services?.logger?.forward) return i18n.services.logger.forward(args, "warn", "react-i18next::", true);
	if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
	if (i18n?.services?.logger?.warn) i18n.services.logger.warn(...args);
	else if (console?.warn) console.warn(...args);
};
var alreadyWarned = {};
var warnOnce = (i18n, code, msg, rest) => {
	if (isString(msg) && alreadyWarned[msg]) return;
	if (isString(msg)) alreadyWarned[msg] = /* @__PURE__ */ new Date();
	warn(i18n, code, msg, rest);
};
var loadedClb = (i18n, cb) => () => {
	if (i18n.isInitialized) cb();
	else {
		const initialized = () => {
			setTimeout(() => {
				i18n.off("initialized", initialized);
			}, 0);
			cb();
		};
		i18n.on("initialized", initialized);
	}
};
var loadNamespaces = (i18n, ns, cb) => {
	i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
var loadLanguages = (i18n, lng, ns, cb) => {
	if (isString(ns)) ns = [ns];
	if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
	ns.forEach((n) => {
		if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
	});
	i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
var hasLoadedNamespace = (ns, i18n, options = {}) => {
	if (!i18n.languages || !i18n.languages.length) {
		warnOnce(i18n, "NO_LANGUAGES", "i18n.languages were undefined or empty", { languages: i18n.languages });
		return true;
	}
	return i18n.hasLoadedNamespace(ns, {
		lng: options.lng,
		precheck: (i18nInstance, loadNotPending) => {
			if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
		}
	});
};
var isString = (obj) => typeof obj === "string";
var isObject = (obj) => typeof obj === "object" && obj !== null;
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/unescape.js
var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
var htmlEntities = {
	"&amp;": "&",
	"&#38;": "&",
	"&lt;": "<",
	"&#60;": "<",
	"&gt;": ">",
	"&#62;": ">",
	"&apos;": "'",
	"&#39;": "'",
	"&quot;": "\"",
	"&#34;": "\"",
	"&nbsp;": " ",
	"&#160;": " ",
	"&copy;": "©",
	"&#169;": "©",
	"&reg;": "®",
	"&#174;": "®",
	"&hellip;": "…",
	"&#8230;": "…",
	"&#x2F;": "/",
	"&#47;": "/"
};
var unescapeHtmlEntity = (m) => htmlEntities[m];
var unescape$1 = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/defaults.js
var defaultOptions = {
	bindI18n: "languageChanged",
	bindI18nStore: "",
	transEmptyNodeValue: "",
	transSupportBasicHtmlNodes: true,
	transWrapTextNodes: "",
	transKeepBasicHtmlNodesFor: [
		"br",
		"strong",
		"i",
		"p"
	],
	useSuspense: true,
	unescape: unescape$1,
	transDefaultProps: void 0
};
var getDefaults = () => defaultOptions;
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/i18nInstance.js
var i18nInstance;
var getI18n = () => i18nInstance;
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/context.js
var I18nContext = (0, import_react.createContext)();
var ReportNamespaces = class {
	constructor() {
		this.usedNamespaces = {};
	}
	addUsedNamespaces(namespaces) {
		namespaces.forEach((ns) => {
			if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
		});
	}
	getUsedNamespaces() {
		return Object.keys(this.usedNamespaces);
	}
};
//#endregion
//#region ../node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
//#endregion
//#region ../node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
/**
* @license React
* use-sync-external-store-shim.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	"production" !== process.env.NODE_ENV && (function() {
		function is(x, y) {
			return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
		}
		function useSyncExternalStore$2(subscribe, getSnapshot) {
			didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
			var value = getSnapshot();
			if (!didWarnUncachedGetSnapshot) {
				var cachedValue = getSnapshot();
				objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
			}
			cachedValue = useState({ inst: {
				value,
				getSnapshot
			} });
			var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
			useLayoutEffect(function() {
				inst.value = value;
				inst.getSnapshot = getSnapshot;
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			}, [
				subscribe,
				value,
				getSnapshot
			]);
			useEffect(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				return subscribe(function() {
					checkIfSnapshotChanged(inst) && forceUpdate({ inst });
				});
			}, [subscribe]);
			useDebugValue(value);
			return value;
		}
		function checkIfSnapshotChanged(inst) {
			var latestGetSnapshot = inst.getSnapshot;
			inst = inst.value;
			try {
				var nextValue = latestGetSnapshot();
				return !objectIs(inst, nextValue);
			} catch (error) {
				return !0;
			}
		}
		function useSyncExternalStore$1(subscribe, getSnapshot) {
			return getSnapshot();
		}
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var React = require_react(), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
		exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
		"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
}));
//#endregion
//#region ../node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.7/node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (process.env.NODE_ENV === "production") module.exports = require_use_sync_external_store_shim_production();
	else module.exports = require_use_sync_external_store_shim_development();
}));
//#endregion
//#region ../node_modules/.pnpm/react-i18next@17.0.6_i18nex_dcdb429b9fcfa3a1e093c1b33442f499/node_modules/react-i18next/dist/es/useTranslation.js
var import_shim = require_shim();
var notReadyT = (k, optsOrDefaultValue) => {
	if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
	if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
	if (typeof k === "function") return "";
	if (Array.isArray(k)) {
		const last = k[k.length - 1];
		return typeof last === "function" ? "" : last;
	}
	return k;
};
var notReadySnapshot = {
	t: notReadyT,
	ready: false
};
var dummySubscribe = () => () => {};
var useTranslation = (ns, props = {}) => {
	const { i18n: i18nFromProps } = props;
	const { i18n: i18nFromContext, defaultNS: defaultNSFromContext } = (0, import_react.useContext)(I18nContext) || {};
	const i18n = i18nFromProps || i18nFromContext || getI18n();
	if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
	if (!i18n) warnOnce(i18n, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
	const i18nOptions = (0, import_react.useMemo)(() => ({
		...getDefaults(),
		...i18n?.options?.react,
		...props
	}), [i18n, props]);
	const { useSuspense, keyPrefix } = i18nOptions;
	const nsOrContext = ns || defaultNSFromContext || i18n?.options?.defaultNS;
	const unstableNamespaces = isString(nsOrContext) ? [nsOrContext] : nsOrContext || ["translation"];
	const namespaces = (0, import_react.useMemo)(() => unstableNamespaces, unstableNamespaces);
	i18n?.reportNamespaces?.addUsedNamespaces?.(namespaces);
	const revisionRef = (0, import_react.useRef)(0);
	const subscribe = (0, import_react.useCallback)((callback) => {
		if (!i18n) return dummySubscribe;
		const { bindI18n, bindI18nStore } = i18nOptions;
		const wrappedCallback = () => {
			revisionRef.current += 1;
			callback();
		};
		if (bindI18n) i18n.on(bindI18n, wrappedCallback);
		if (bindI18nStore) i18n.store.on(bindI18nStore, wrappedCallback);
		return () => {
			if (bindI18n) bindI18n.split(" ").forEach((e) => i18n.off(e, wrappedCallback));
			if (bindI18nStore) bindI18nStore.split(" ").forEach((e) => i18n.store.off(e, wrappedCallback));
		};
	}, [i18n, i18nOptions]);
	const snapshotRef = (0, import_react.useRef)();
	const getSnapshot = (0, import_react.useCallback)(() => {
		if (!i18n) return notReadySnapshot;
		const calculatedReady = !!(i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every((n) => hasLoadedNamespace(n, i18n, i18nOptions));
		const currentLng = props.lng || i18n.language;
		const currentRevision = revisionRef.current;
		const lastSnapshot = snapshotRef.current;
		if (lastSnapshot && lastSnapshot.ready === calculatedReady && lastSnapshot.lng === currentLng && lastSnapshot.keyPrefix === keyPrefix && lastSnapshot.revision === currentRevision) return lastSnapshot;
		const newSnapshot = {
			t: i18n.getFixedT(currentLng, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix),
			ready: calculatedReady,
			lng: currentLng,
			keyPrefix,
			revision: currentRevision
		};
		snapshotRef.current = newSnapshot;
		return newSnapshot;
	}, [
		i18n,
		namespaces,
		keyPrefix,
		i18nOptions,
		props.lng
	]);
	const [loadCount, setLoadCount] = (0, import_react.useState)(0);
	const { t, ready } = (0, import_shim.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
	(0, import_react.useEffect)(() => {
		if (i18n && !ready && !useSuspense) {
			const onLoaded = () => setLoadCount((c) => c + 1);
			if (props.lng) loadLanguages(i18n, props.lng, namespaces, onLoaded);
			else loadNamespaces(i18n, namespaces, onLoaded);
		}
	}, [
		i18n,
		props.lng,
		namespaces,
		ready,
		useSuspense,
		loadCount
	]);
	const finalI18n = i18n || {};
	const wrapperRef = (0, import_react.useRef)(null);
	const wrapperLangRef = (0, import_react.useRef)();
	const createI18nWrapper = (original) => {
		const descriptors = Object.getOwnPropertyDescriptors(original);
		if (descriptors.__original) delete descriptors.__original;
		const wrapper = Object.create(Object.getPrototypeOf(original), descriptors);
		if (!Object.prototype.hasOwnProperty.call(wrapper, "__original")) try {
			Object.defineProperty(wrapper, "__original", {
				value: original,
				writable: false,
				enumerable: false,
				configurable: false
			});
		} catch (_) {}
		return wrapper;
	};
	const ret = (0, import_react.useMemo)(() => {
		const original = finalI18n;
		const lang = original?.language;
		let i18nWrapper = original;
		if (original) if (wrapperRef.current && wrapperRef.current.__original === original) if (wrapperLangRef.current !== lang) {
			i18nWrapper = createI18nWrapper(original);
			wrapperRef.current = i18nWrapper;
			wrapperLangRef.current = lang;
		} else i18nWrapper = wrapperRef.current;
		else {
			i18nWrapper = createI18nWrapper(original);
			wrapperRef.current = i18nWrapper;
			wrapperLangRef.current = lang;
		}
		const effectiveT = !ready && !useSuspense ? (...args) => {
			warnOnce(i18n, "USE_T_BEFORE_READY", "useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.");
			return t(...args);
		} : t;
		const arr = [
			effectiveT,
			i18nWrapper,
			ready
		];
		arr.t = effectiveT;
		arr.i18n = i18nWrapper;
		arr.ready = ready;
		return arr;
	}, [
		t,
		finalI18n,
		ready,
		finalI18n.resolvedLanguage,
		finalI18n.language,
		finalI18n.languages
	]);
	if (i18n && useSuspense && !ready) throw new Promise((resolve) => {
		const onLoaded = () => resolve();
		if (props.lng) loadLanguages(i18n, props.lng, namespaces, onLoaded);
		else loadNamespaces(i18n, namespaces, onLoaded);
	});
	return ret;
};
//#endregion
//#region src/components/right-toolbar.tsx
/**
* Boolean 类型的快捷设置项
*/
function BooleanQuickSettingControl({ settingKey, isHovered }) {
	const [value, setValue] = (0, import_react.useState)(Settings[settingKey]);
	(0, import_react.useEffect)(() => {
		return Settings.watch(settingKey, (newValue) => {
			if (typeof newValue === "boolean") setValue(newValue);
		});
	}, [settingKey]);
	const handleToggle = () => {
		const currentValue = Settings[settingKey];
		if (typeof currentValue === "boolean") Settings[settingKey] = !currentValue;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden transition-all duration-200", isHovered ? "w-10 opacity-100" : "w-0 opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: value,
			onCheckedChange: handleToggle
		})
	});
}
/**
* Enum 类型的快捷设置项（下拉菜单）
*/
function EnumQuickSettingControl({ settingKey, isHovered }) {
	const { t } = useTranslation("settings");
	const [value, setValue] = (0, import_react.useState)(Settings[settingKey]);
	const options = QuickSettingsManager.getEnumOptions(settingKey);
	(0, import_react.useEffect)(() => {
		return Settings.watch(settingKey, (newValue) => {
			if (typeof newValue === "string") setValue(newValue);
		});
	}, [settingKey]);
	const handleChange = (newValue) => {
		setValue(newValue);
		Settings[settingKey] = newValue;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden transition-all duration-200", isHovered ? "w-28 opacity-100" : "w-0 opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value,
			onValueChange: handleChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				size: "sm",
				className: "h-7 w-28 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: opt,
				className: "text-xs",
				children: t(`${settingKey}.options.${opt}`, { defaultValue: opt })
			}, opt)) })]
		})
	});
}
/**
* Number 类型的快捷设置项（滑块 或 数字输入框）
*/
function NumberQuickSettingControl({ settingKey, isHovered }) {
	const [value, setValue] = (0, import_react.useState)(Settings[settingKey]);
	const { min, max, step, hasRange } = QuickSettingsManager.getNumberRange(settingKey);
	(0, import_react.useEffect)(() => {
		return Settings.watch(settingKey, (newValue) => {
			if (typeof newValue === "number") setValue(newValue);
		});
	}, [settingKey]);
	const handleChange = (newValue) => {
		setValue(newValue);
		Settings[settingKey] = newValue;
	};
	if (hasRange && min !== null && max !== null) {
		const displayValue = step >= 1 ? String(value) : value.toFixed(2);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("transition-all duration-200", isHovered ? "max-w-36 opacity-100" : "max-w-0 opacity-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-36 items-center gap-1.5 py-1 pr-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					value: [value],
					onValueChange: ([v]) => handleChange(v),
					min,
					max,
					step,
					className: "w-24 flex-shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground w-10 flex-shrink-0 text-right text-xs tabular-nums",
					children: displayValue
				})]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden transition-all duration-200", isHovered ? "w-20 opacity-100" : "w-0 opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			value,
			onChange: (e) => {
				const parsed = e.target.valueAsNumber;
				if (!Number.isNaN(parsed)) handleChange(parsed);
			},
			className: "h-7 w-20 text-xs"
		})
	});
}
/**
* 单个快捷设置项按钮
*/
function QuickSettingButton({ settingKey, isHovered }) {
	const { t } = useTranslation("settings");
	const [showDialog, setShowDialog] = (0, import_react.useState)(false);
	const settingType = QuickSettingsManager.getSettingType(settingKey);
	const [boolValue, setBoolValue] = (0, import_react.useState)(settingType === "boolean" ? Settings[settingKey] : false);
	(0, import_react.useEffect)(() => {
		if (settingType !== "boolean") return;
		return Settings.watch(settingKey, (newValue) => {
			if (typeof newValue === "boolean") setBoolValue(newValue);
		});
	}, [settingKey, settingType]);
	const Icon = settingsIcons[settingKey] ?? import_react.Fragment;
	const title = t(`${settingKey}.title`);
	const description = t(`${settingKey}.description`);
	if (Icon === import_react.Fragment) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					className: settingType === "boolean" ? cn("opacity-50 transition-opacity hover:opacity-100", boolValue && "opacity-100") : "opacity-70 transition-opacity hover:opacity-100",
					variant: "ghost",
					size: "icon",
					onClick: () => setShowDialog(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {})
				}),
				settingType === "boolean" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BooleanQuickSettingControl, {
					settingKey,
					isHovered
				}),
				settingType === "enum" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnumQuickSettingControl, {
					settingKey,
					isHovered
				}),
				settingType === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberQuickSettingControl, {
					settingKey,
					isHovered
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, {
		side: "left",
		children: title
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: showDialog,
		onOpenChange: setShowDialog,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
			className: "pt-2",
			children: description
		})] }) })
	})] });
}
/**
* 右侧工具栏
* 显示用户自定义的快捷设置项（支持开关、下拉菜单、数值调整）
*/
function RightToolbar() {
	const [quickSettings, setQuickSettings] = (0, import_react.useState)([]);
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	const [isClassroomMode] = useAtom(isClassroomModeAtom);
	const loadQuickSettings = async () => {
		setQuickSettings(await QuickSettingsManager.getQuickSettings());
	};
	(0, import_react.useEffect)(() => {
		loadQuickSettings();
		const interval = setInterval(() => {
			loadQuickSettings();
		}, 5e3);
		const handleFocus = () => {
			loadQuickSettings();
		};
		window.addEventListener("focus", handleFocus);
		return () => {
			clearInterval(interval);
			window.removeEventListener("focus", handleFocus);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("absolute top-1/2 right-2 flex -translate-y-1/2 transform flex-col items-center justify-center transition-all hover:opacity-100", isClassroomMode && "opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
			className: "bg-popover/95 supports-backdrop-blur:bg-popover/80 border-border/50 flex-col gap-0.5 rounded-lg border px-1 py-1.5 shadow-xl backdrop-blur-md",
			onMouseEnter: () => setIsHovered(true),
			onMouseLeave: () => setIsHovered(false),
			children: quickSettings.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickSettingButton, {
				settingKey: item.settingKey,
				isHovered
			}, item.settingKey))
		})
	});
}
//#endregion
//#region src/core/service/feedbackService/ColorManager.tsx
var ColorManager;
(function(_ColorManager) {
	let store;
	const changeListeners = /* @__PURE__ */ new Set();
	function subscribe(listener) {
		changeListeners.add(listener);
		return () => changeListeners.delete(listener);
	}
	_ColorManager.subscribe = subscribe;
	function notifyChange() {
		changeListeners.forEach((fn) => fn());
	}
	async function init() {
		store = await createStore$1("colors.json");
		store.save();
	}
	_ColorManager.init = init;
	async function getUserEntityFillColors() {
		const data = await store.get("entityFillColors") || [];
		const result = [];
		for (const colorData of data) {
			const color = new Color(colorData.r, colorData.g, colorData.b, colorData.a);
			result.push(color);
		}
		return result;
	}
	_ColorManager.getUserEntityFillColors = getUserEntityFillColors;
	function colorToColorData(colors) {
		const result = [];
		for (const color of colors) {
			const colorData = {
				r: color.r,
				g: color.g,
				b: color.b,
				a: color.a
			};
			result.push(colorData);
		}
		return result;
	}
	async function addUserEntityFillColor(color) {
		const colorData = await getUserEntityFillColors();
		for (const c of colorData) if (c.equals(color)) return false;
		colorData.push(color);
		await store.set("entityFillColors", colorToColorData(colorData));
		store.save();
		notifyChange();
		return true;
	}
	_ColorManager.addUserEntityFillColor = addUserEntityFillColor;
	async function removeUserEntityFillColor(color) {
		const colors = await getUserEntityFillColors();
		const colorData = colorToColorData(colors);
		let index = -1;
		for (let i = 0; i < colorData.length; i++) if (new Color(colorData[i].r, colorData[i].g, colorData[i].b, colorData[i].a).equals(color)) {
			index = i;
			break;
		}
		if (index >= 0) {
			colors.splice(index, 1);
			store.set("entityFillColors", colorToColorData(colors));
			store.save();
			notifyChange();
			return true;
		}
		return false;
	}
	_ColorManager.removeUserEntityFillColor = removeUserEntityFillColor;
	async function organizeUserEntityFillColors() {
		const sortedColors = sortColorsByHue(await getUserEntityFillColors());
		await store.set("entityFillColors", colorToColorData(sortedColors));
		store.save();
		notifyChange();
	}
	_ColorManager.organizeUserEntityFillColors = organizeUserEntityFillColors;
	/**
	* 按照色相环的顺序排序颜色（黑白最前，纯红其次，其他按色相）
	* @param colors
	*/
	function sortColorsByHue(colors) {
		return colors.sort((a, b) => {
			const isGrayA = isGrayscale(a);
			if (isGrayA !== isGrayscale(b)) return isGrayA ? -1 : 1;
			if (isGrayA) return getGrayscaleBrightness(b) - getGrayscaleBrightness(a);
			else return getColorHue(a) - getColorHue(b);
		});
	}
	/**
	* 判断是否是灰度颜色
	*/
	function isGrayscale(color) {
		const rgb = color;
		return rgb.r === rgb.g && rgb.g === rgb.b;
	}
	/**
	* 获取灰度颜色的亮度（0-255）
	*/
	function getGrayscaleBrightness(color) {
		return color.r;
	}
	/**
	* 计算颜色的色相
	* @param color
	* @returns 色相值（0-360）
	*/
	function getColorHue(color) {
		return Color.getHue(color);
	}
})(ColorManager || (ColorManager = {}));
/**
json数据格式
{
"entityFillColors": [
[r, g, b, a],
[r, g, b, a],
]
}
*
*/
//#endregion
//#region src/components/toolbar-content.tsx
/**
* 底部工具栏
* @returns
*/
function ToolbarContent() {
	const { t } = useTranslation("keyBinds");
	const [isClassroomMode] = useAtom(isClassroomModeAtom);
	const [leftMouseMode, setLeftMouseMode] = (0, import_react.useState)(Settings.mouseLeftMode);
	(0, import_react.useEffect)(() => {
		setLeftMouseMode(Settings.mouseLeftMode);
	}, [Settings.mouseLeftMode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("absolute bottom-0 left-1/2 flex -translate-x-1/2 transform flex-col items-center justify-center transition-all hover:opacity-100", isClassroomMode && "opacity-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toolbar, {
			className: "bg-popover/95 supports-backdrop-blur:bg-popover/80 border-border/50 rounded-t-lg border-t px-2 py-1.5 shadow-xl backdrop-blur-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					className: cn("opacity-50", leftMouseMode === "selectAndMove" && "opacity-100"),
					variant: "ghost",
					size: "icon",
					onClick: () => {
						setLeftMouseMode("connectAndCut");
						Settings.mouseLeftMode = "selectAndMove";
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer, {})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, { children: t("checkoutLeftMouseToSelectAndMove.title") })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					className: cn("opacity-50", leftMouseMode === "draw" && "opacity-100"),
					variant: "ghost",
					size: "icon",
					onClick: () => {
						setLeftMouseMode("draw");
						Settings.mouseLeftMode = "draw";
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, { children: t("checkoutLeftMouseToDrawing.title") })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					className: cn("opacity-50", leftMouseMode === "connectAndCut" && "opacity-100"),
					variant: "ghost",
					size: "icon",
					onClick: () => {
						setLeftMouseMode("connectAndCut");
						Settings.mouseLeftMode = "connectAndCut";
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, {})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, { children: t("checkoutLeftMouseToConnectAndCutting.title") })] })
			]
		}), leftMouseMode === "draw" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawingColorLine, {}) })]
	});
}
var DrawingColorLine = () => {
	const [userColorList, setUserColorList] = (0, import_react.useState)([]);
	const [currentDrawColor, setCurrentDrawColor] = (0, import_react.useState)(Color.Transparent);
	(0, import_react.useEffect)(() => {
		ColorManager.getUserEntityFillColors().then((colors) => {
			setUserColorList(colors);
		});
		setCurrentDrawColor(new Color(...Settings.autoFillPenStrokeColor));
	}, []);
	const handleChangeColor = (color) => {
		Settings.autoFillPenStrokeColor = color.toArray();
		setCurrentDrawColor(color.clone());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex max-w-64 overflow-x-auto",
		children: userColorList.map((color) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("outline-accent-foreground size-4 cursor-pointer hover:outline-3 hover:-outline-offset-3", currentDrawColor.equals(color) && "outline-2 -outline-offset-2"),
				style: { backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` },
				onClick: () => {
					handleChangeColor(color);
				}
			}, color.toString());
		})
	});
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
function utf8Count(str) {
	const strLength = str.length;
	let byteLength = 0;
	let pos = 0;
	while (pos < strLength) {
		let value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			byteLength++;
			continue;
		} else if ((value & 4294965248) === 0) byteLength += 2;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					const extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) byteLength += 3;
			else byteLength += 4;
		}
	}
	return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
	const strLength = str.length;
	let offset = outputOffset;
	let pos = 0;
	while (pos < strLength) {
		let value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			output[offset++] = value;
			continue;
		} else if ((value & 4294965248) === 0) output[offset++] = value >> 6 & 31 | 192;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					const extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) {
				output[offset++] = value >> 12 & 15 | 224;
				output[offset++] = value >> 6 & 63 | 128;
			} else {
				output[offset++] = value >> 18 & 7 | 240;
				output[offset++] = value >> 12 & 63 | 128;
				output[offset++] = value >> 6 & 63 | 128;
			}
		}
		output[offset++] = value & 63 | 128;
	}
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
	sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
	if (str.length > TEXT_ENCODER_THRESHOLD) utf8EncodeTE(str, output, outputOffset);
	else utf8EncodeJs(str, output, outputOffset);
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
	let offset = inputOffset;
	const end = offset + byteLength;
	const units = [];
	let result = "";
	while (offset < end) {
		const byte1 = bytes[offset++];
		if ((byte1 & 128) === 0) units.push(byte1);
		else if ((byte1 & 224) === 192) {
			const byte2 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 6 | byte2);
		} else if ((byte1 & 240) === 224) {
			const byte2 = bytes[offset++] & 63;
			const byte3 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
		} else if ((byte1 & 248) === 240) {
			const byte2 = bytes[offset++] & 63;
			const byte3 = bytes[offset++] & 63;
			const byte4 = bytes[offset++] & 63;
			let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
			if (unit > 65535) {
				unit -= 65536;
				units.push(unit >>> 10 & 1023 | 55296);
				unit = 56320 | unit & 1023;
			}
			units.push(unit);
		} else units.push(byte1);
		if (units.length >= CHUNK_SIZE) {
			result += String.fromCharCode(...units);
			units.length = 0;
		}
	}
	if (units.length > 0) result += String.fromCharCode(...units);
	return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
	const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
	return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
	if (byteLength > TEXT_DECODER_THRESHOLD) return utf8DecodeTD(bytes, inputOffset, byteLength);
	else return utf8DecodeJs(bytes, inputOffset, byteLength);
}
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
/**
* ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
*/
var ExtData = class {
	type;
	data;
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
var DecodeError = class DecodeError extends Error {
	constructor(message) {
		super(message);
		const proto = Object.create(DecodeError.prototype);
		Object.setPrototypeOf(this, proto);
		Object.defineProperty(this, "name", {
			configurable: true,
			enumerable: false,
			value: DecodeError.name
		});
	}
};
function setUint64(view, offset, value) {
	const high = value / 4294967296;
	const low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
	const high = Math.floor(value / 4294967296);
	const low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
	const high = view.getInt32(offset);
	const low = view.getUint32(offset + 4);
	return high * 4294967296 + low;
}
function getUint64(view, offset) {
	const high = view.getUint32(offset);
	const low = view.getUint32(offset + 4);
	return high * 4294967296 + low;
}
var TIMESTAMP32_MAX_SEC = 4294967295;
var TIMESTAMP64_MAX_SEC = 17179869183;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
	if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
		const rv = new Uint8Array(4);
		new DataView(rv.buffer).setUint32(0, sec);
		return rv;
	} else {
		const secHigh = sec / 4294967296;
		const secLow = sec & 4294967295;
		const rv = new Uint8Array(8);
		const view = new DataView(rv.buffer);
		view.setUint32(0, nsec << 2 | secHigh & 3);
		view.setUint32(4, secLow);
		return rv;
	}
	else {
		const rv = new Uint8Array(12);
		const view = new DataView(rv.buffer);
		view.setUint32(0, nsec);
		setInt64(view, 4, sec);
		return rv;
	}
}
function encodeDateToTimeSpec(date) {
	const msec = date.getTime();
	const sec = Math.floor(msec / 1e3);
	const nsec = (msec - sec * 1e3) * 1e6;
	const nsecInSec = Math.floor(nsec / 1e9);
	return {
		sec: sec + nsecInSec,
		nsec: nsec - nsecInSec * 1e9
	};
}
function encodeTimestampExtension(object) {
	if (object instanceof Date) return encodeTimeSpecToTimestamp(encodeDateToTimeSpec(object));
	else return null;
}
function decodeTimestampToTimeSpec(data) {
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	switch (data.byteLength) {
		case 4: return {
			sec: view.getUint32(0),
			nsec: 0
		};
		case 8: {
			const nsec30AndSecHigh2 = view.getUint32(0);
			const secLow32 = view.getUint32(4);
			return {
				sec: (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32,
				nsec: nsec30AndSecHigh2 >>> 2
			};
		}
		case 12: return {
			sec: getInt64(view, 4),
			nsec: view.getUint32(0)
		};
		default: throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
	}
}
function decodeTimestampExtension(data) {
	const timeSpec = decodeTimestampToTimeSpec(data);
	return /* @__PURE__ */ new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
	type: -1,
	encode: encodeTimestampExtension,
	decode: decodeTimestampExtension
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
var ExtensionCodec = class ExtensionCodec {
	static defaultCodec = new ExtensionCodec();
	__brand;
	builtInEncoders = [];
	builtInDecoders = [];
	encoders = [];
	decoders = [];
	constructor() {
		this.register(timestampExtension);
	}
	register({ type, encode, decode }) {
		if (type >= 0) {
			this.encoders[type] = encode;
			this.decoders[type] = decode;
		} else {
			const index = -1 - type;
			this.builtInEncoders[index] = encode;
			this.builtInDecoders[index] = decode;
		}
	}
	tryToEncode(object, context) {
		for (let i = 0; i < this.builtInEncoders.length; i++) {
			const encodeExt = this.builtInEncoders[i];
			if (encodeExt != null) {
				const data = encodeExt(object, context);
				if (data != null) return new ExtData(-1 - i, data);
			}
		}
		for (let i = 0; i < this.encoders.length; i++) {
			const encodeExt = this.encoders[i];
			if (encodeExt != null) {
				const data = encodeExt(object, context);
				if (data != null) return new ExtData(i, data);
			}
		}
		if (object instanceof ExtData) return object;
		return null;
	}
	decode(data, type, context) {
		const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
		if (decodeExt) return decodeExt(data, type, context);
		else return new ExtData(type, data);
	}
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
function isArrayBufferLike(buffer) {
	return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
	if (buffer instanceof Uint8Array) return buffer;
	else if (ArrayBuffer.isView(buffer)) return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	else if (isArrayBufferLike(buffer)) return new Uint8Array(buffer);
	else return Uint8Array.from(buffer);
}
var Encoder = class Encoder {
	extensionCodec;
	context;
	useBigInt64;
	maxDepth;
	initialBufferSize;
	sortKeys;
	forceFloat32;
	ignoreUndefined;
	forceIntegerToFloat;
	pos;
	view;
	bytes;
	entered = false;
	constructor(options) {
		this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
		this.context = options?.context;
		this.useBigInt64 = options?.useBigInt64 ?? false;
		this.maxDepth = options?.maxDepth ?? 100;
		this.initialBufferSize = options?.initialBufferSize ?? 2048;
		this.sortKeys = options?.sortKeys ?? false;
		this.forceFloat32 = options?.forceFloat32 ?? false;
		this.ignoreUndefined = options?.ignoreUndefined ?? false;
		this.forceIntegerToFloat = options?.forceIntegerToFloat ?? false;
		this.pos = 0;
		this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
		this.bytes = new Uint8Array(this.view.buffer);
	}
	clone() {
		return new Encoder({
			extensionCodec: this.extensionCodec,
			context: this.context,
			useBigInt64: this.useBigInt64,
			maxDepth: this.maxDepth,
			initialBufferSize: this.initialBufferSize,
			sortKeys: this.sortKeys,
			forceFloat32: this.forceFloat32,
			ignoreUndefined: this.ignoreUndefined,
			forceIntegerToFloat: this.forceIntegerToFloat
		});
	}
	reinitializeState() {
		this.pos = 0;
	}
	/**
	* This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
	*
	* @returns Encodes the object and returns a shared reference the encoder's internal buffer.
	*/
	encodeSharedRef(object) {
		if (this.entered) return this.clone().encodeSharedRef(object);
		try {
			this.entered = true;
			this.reinitializeState();
			this.doEncode(object, 1);
			return this.bytes.subarray(0, this.pos);
		} finally {
			this.entered = false;
		}
	}
	/**
	* @returns Encodes the object and returns a copy of the encoder's internal buffer.
	*/
	encode(object) {
		if (this.entered) return this.clone().encode(object);
		try {
			this.entered = true;
			this.reinitializeState();
			this.doEncode(object, 1);
			return this.bytes.slice(0, this.pos);
		} finally {
			this.entered = false;
		}
	}
	doEncode(object, depth) {
		if (depth > this.maxDepth) throw new Error(`Too deep objects in depth ${depth}`);
		if (object == null) this.encodeNil();
		else if (typeof object === "boolean") this.encodeBoolean(object);
		else if (typeof object === "number") if (!this.forceIntegerToFloat) this.encodeNumber(object);
		else this.encodeNumberAsFloat(object);
		else if (typeof object === "string") this.encodeString(object);
		else if (this.useBigInt64 && typeof object === "bigint") this.encodeBigInt64(object);
		else this.encodeObject(object, depth);
	}
	ensureBufferSizeToWrite(sizeToWrite) {
		const requiredSize = this.pos + sizeToWrite;
		if (this.view.byteLength < requiredSize) this.resizeBuffer(requiredSize * 2);
	}
	resizeBuffer(newSize) {
		const newBuffer = new ArrayBuffer(newSize);
		const newBytes = new Uint8Array(newBuffer);
		const newView = new DataView(newBuffer);
		newBytes.set(this.bytes);
		this.view = newView;
		this.bytes = newBytes;
	}
	encodeNil() {
		this.writeU8(192);
	}
	encodeBoolean(object) {
		if (object === false) this.writeU8(194);
		else this.writeU8(195);
	}
	encodeNumber(object) {
		if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) if (object >= 0) if (object < 128) this.writeU8(object);
		else if (object < 256) {
			this.writeU8(204);
			this.writeU8(object);
		} else if (object < 65536) {
			this.writeU8(205);
			this.writeU16(object);
		} else if (object < 4294967296) {
			this.writeU8(206);
			this.writeU32(object);
		} else if (!this.useBigInt64) {
			this.writeU8(207);
			this.writeU64(object);
		} else this.encodeNumberAsFloat(object);
		else if (object >= -32) this.writeU8(224 | object + 32);
		else if (object >= -128) {
			this.writeU8(208);
			this.writeI8(object);
		} else if (object >= -32768) {
			this.writeU8(209);
			this.writeI16(object);
		} else if (object >= -2147483648) {
			this.writeU8(210);
			this.writeI32(object);
		} else if (!this.useBigInt64) {
			this.writeU8(211);
			this.writeI64(object);
		} else this.encodeNumberAsFloat(object);
		else this.encodeNumberAsFloat(object);
	}
	encodeNumberAsFloat(object) {
		if (this.forceFloat32) {
			this.writeU8(202);
			this.writeF32(object);
		} else {
			this.writeU8(203);
			this.writeF64(object);
		}
	}
	encodeBigInt64(object) {
		if (object >= BigInt(0)) {
			this.writeU8(207);
			this.writeBigUint64(object);
		} else {
			this.writeU8(211);
			this.writeBigInt64(object);
		}
	}
	writeStringHeader(byteLength) {
		if (byteLength < 32) this.writeU8(160 + byteLength);
		else if (byteLength < 256) {
			this.writeU8(217);
			this.writeU8(byteLength);
		} else if (byteLength < 65536) {
			this.writeU8(218);
			this.writeU16(byteLength);
		} else if (byteLength < 4294967296) {
			this.writeU8(219);
			this.writeU32(byteLength);
		} else throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
	}
	encodeString(object) {
		const maxHeaderSize = 5;
		const byteLength = utf8Count(object);
		this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
		this.writeStringHeader(byteLength);
		utf8Encode(object, this.bytes, this.pos);
		this.pos += byteLength;
	}
	encodeObject(object, depth) {
		const ext = this.extensionCodec.tryToEncode(object, this.context);
		if (ext != null) this.encodeExtension(ext);
		else if (Array.isArray(object)) this.encodeArray(object, depth);
		else if (ArrayBuffer.isView(object)) this.encodeBinary(object);
		else if (typeof object === "object") this.encodeMap(object, depth);
		else throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
	}
	encodeBinary(object) {
		const size = object.byteLength;
		if (size < 256) {
			this.writeU8(196);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(197);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(198);
			this.writeU32(size);
		} else throw new Error(`Too large binary: ${size}`);
		const bytes = ensureUint8Array(object);
		this.writeU8a(bytes);
	}
	encodeArray(object, depth) {
		const size = object.length;
		if (size < 16) this.writeU8(144 + size);
		else if (size < 65536) {
			this.writeU8(220);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(221);
			this.writeU32(size);
		} else throw new Error(`Too large array: ${size}`);
		for (const item of object) this.doEncode(item, depth + 1);
	}
	countWithoutUndefined(object, keys) {
		let count = 0;
		for (const key of keys) if (object[key] !== void 0) count++;
		return count;
	}
	encodeMap(object, depth) {
		const keys = Object.keys(object);
		if (this.sortKeys) keys.sort();
		const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
		if (size < 16) this.writeU8(128 + size);
		else if (size < 65536) {
			this.writeU8(222);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(223);
			this.writeU32(size);
		} else throw new Error(`Too large map object: ${size}`);
		for (const key of keys) {
			const value = object[key];
			if (!(this.ignoreUndefined && value === void 0)) {
				this.encodeString(key);
				this.doEncode(value, depth + 1);
			}
		}
	}
	encodeExtension(ext) {
		if (typeof ext.data === "function") {
			const data = ext.data(this.pos + 6);
			const size = data.length;
			if (size >= 4294967296) throw new Error(`Too large extension object: ${size}`);
			this.writeU8(201);
			this.writeU32(size);
			this.writeI8(ext.type);
			this.writeU8a(data);
			return;
		}
		const size = ext.data.length;
		if (size === 1) this.writeU8(212);
		else if (size === 2) this.writeU8(213);
		else if (size === 4) this.writeU8(214);
		else if (size === 8) this.writeU8(215);
		else if (size === 16) this.writeU8(216);
		else if (size < 256) {
			this.writeU8(199);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(200);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(201);
			this.writeU32(size);
		} else throw new Error(`Too large extension object: ${size}`);
		this.writeI8(ext.type);
		this.writeU8a(ext.data);
	}
	writeU8(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setUint8(this.pos, value);
		this.pos++;
	}
	writeU8a(values) {
		const size = values.length;
		this.ensureBufferSizeToWrite(size);
		this.bytes.set(values, this.pos);
		this.pos += size;
	}
	writeI8(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setInt8(this.pos, value);
		this.pos++;
	}
	writeU16(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setUint16(this.pos, value);
		this.pos += 2;
	}
	writeI16(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setInt16(this.pos, value);
		this.pos += 2;
	}
	writeU32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setUint32(this.pos, value);
		this.pos += 4;
	}
	writeI32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setInt32(this.pos, value);
		this.pos += 4;
	}
	writeF32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setFloat32(this.pos, value);
		this.pos += 4;
	}
	writeF64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setFloat64(this.pos, value);
		this.pos += 8;
	}
	writeU64(value) {
		this.ensureBufferSizeToWrite(8);
		setUint64(this.view, this.pos, value);
		this.pos += 8;
	}
	writeI64(value) {
		this.ensureBufferSizeToWrite(8);
		setInt64(this.view, this.pos, value);
		this.pos += 8;
	}
	writeBigUint64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigUint64(this.pos, value);
		this.pos += 8;
	}
	writeBigInt64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigInt64(this.pos, value);
		this.pos += 8;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
function prettyByte(byte) {
	return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = class {
	hit = 0;
	miss = 0;
	caches;
	maxKeyLength;
	maxLengthPerKey;
	constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
		this.maxKeyLength = maxKeyLength;
		this.maxLengthPerKey = maxLengthPerKey;
		this.caches = [];
		for (let i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
	}
	canBeCached(byteLength) {
		return byteLength > 0 && byteLength <= this.maxKeyLength;
	}
	find(bytes, inputOffset, byteLength) {
		const records = this.caches[byteLength - 1];
		FIND_CHUNK: for (const record of records) {
			const recordBytes = record.bytes;
			for (let j = 0; j < byteLength; j++) if (recordBytes[j] !== bytes[inputOffset + j]) continue FIND_CHUNK;
			return record.str;
		}
		return null;
	}
	store(bytes, value) {
		const records = this.caches[bytes.length - 1];
		const record = {
			bytes,
			str: value
		};
		if (records.length >= this.maxLengthPerKey) records[Math.random() * records.length | 0] = record;
		else records.push(record);
	}
	decode(bytes, inputOffset, byteLength) {
		const cachedValue = this.find(bytes, inputOffset, byteLength);
		if (cachedValue != null) {
			this.hit++;
			return cachedValue;
		}
		this.miss++;
		const str = utf8DecodeJs(bytes, inputOffset, byteLength);
		const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
		this.store(slicedCopyOfBytes, str);
		return str;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@msgpack+msgpack@3.1.3/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var mapKeyConverter = (key) => {
	if (typeof key === "string" || typeof key === "number") return key;
	throw new DecodeError("The type of key must be string or number but " + typeof key);
};
var StackPool = class {
	stack = [];
	stackHeadPosition = -1;
	get length() {
		return this.stackHeadPosition + 1;
	}
	top() {
		return this.stack[this.stackHeadPosition];
	}
	pushArrayState(size) {
		const state = this.getUninitializedStateFromPool();
		state.type = STATE_ARRAY;
		state.position = 0;
		state.size = size;
		state.array = new Array(size);
	}
	pushMapState(size) {
		const state = this.getUninitializedStateFromPool();
		state.type = STATE_MAP_KEY;
		state.readCount = 0;
		state.size = size;
		state.map = {};
	}
	getUninitializedStateFromPool() {
		this.stackHeadPosition++;
		if (this.stackHeadPosition === this.stack.length) this.stack.push({
			type: void 0,
			size: 0,
			array: void 0,
			position: 0,
			readCount: 0,
			map: void 0,
			key: null
		});
		return this.stack[this.stackHeadPosition];
	}
	release(state) {
		if (this.stack[this.stackHeadPosition] !== state) throw new Error("Invalid stack state. Released state is not on top of the stack.");
		if (state.type === STATE_ARRAY) {
			const partialState = state;
			partialState.size = 0;
			partialState.array = void 0;
			partialState.position = 0;
			partialState.type = void 0;
		}
		if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
			const partialState = state;
			partialState.size = 0;
			partialState.map = void 0;
			partialState.readCount = 0;
			partialState.type = void 0;
		}
		this.stackHeadPosition--;
	}
	reset() {
		this.stack.length = 0;
		this.stackHeadPosition = -1;
	}
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
	EMPTY_VIEW.getInt8(0);
} catch (e) {
	if (!(e instanceof RangeError)) throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
}
var MORE_DATA = /* @__PURE__ */ new RangeError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = class Decoder {
	extensionCodec;
	context;
	useBigInt64;
	rawStrings;
	maxStrLength;
	maxBinLength;
	maxArrayLength;
	maxMapLength;
	maxExtLength;
	keyDecoder;
	mapKeyConverter;
	totalPos = 0;
	pos = 0;
	view = EMPTY_VIEW;
	bytes = EMPTY_BYTES;
	headByte = HEAD_BYTE_REQUIRED;
	stack = new StackPool();
	entered = false;
	constructor(options) {
		this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
		this.context = options?.context;
		this.useBigInt64 = options?.useBigInt64 ?? false;
		this.rawStrings = options?.rawStrings ?? false;
		this.maxStrLength = options?.maxStrLength ?? 4294967295;
		this.maxBinLength = options?.maxBinLength ?? 4294967295;
		this.maxArrayLength = options?.maxArrayLength ?? 4294967295;
		this.maxMapLength = options?.maxMapLength ?? 4294967295;
		this.maxExtLength = options?.maxExtLength ?? 4294967295;
		this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
		this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
	}
	clone() {
		return new Decoder({
			extensionCodec: this.extensionCodec,
			context: this.context,
			useBigInt64: this.useBigInt64,
			rawStrings: this.rawStrings,
			maxStrLength: this.maxStrLength,
			maxBinLength: this.maxBinLength,
			maxArrayLength: this.maxArrayLength,
			maxMapLength: this.maxMapLength,
			maxExtLength: this.maxExtLength,
			keyDecoder: this.keyDecoder
		});
	}
	reinitializeState() {
		this.totalPos = 0;
		this.headByte = HEAD_BYTE_REQUIRED;
		this.stack.reset();
	}
	setBuffer(buffer) {
		const bytes = ensureUint8Array(buffer);
		this.bytes = bytes;
		this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		this.pos = 0;
	}
	appendBuffer(buffer) {
		if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) this.setBuffer(buffer);
		else {
			const remainingData = this.bytes.subarray(this.pos);
			const newData = ensureUint8Array(buffer);
			const newBuffer = new Uint8Array(remainingData.length + newData.length);
			newBuffer.set(remainingData);
			newBuffer.set(newData, remainingData.length);
			this.setBuffer(newBuffer);
		}
	}
	hasRemaining(size) {
		return this.view.byteLength - this.pos >= size;
	}
	createExtraByteError(posToShow) {
		const { view, pos } = this;
		return /* @__PURE__ */ new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
	}
	/**
	* @throws {@link DecodeError}
	* @throws {@link RangeError}
	*/
	decode(buffer) {
		if (this.entered) return this.clone().decode(buffer);
		try {
			this.entered = true;
			this.reinitializeState();
			this.setBuffer(buffer);
			const object = this.doDecodeSync();
			if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
			return object;
		} finally {
			this.entered = false;
		}
	}
	*decodeMulti(buffer) {
		if (this.entered) {
			yield* this.clone().decodeMulti(buffer);
			return;
		}
		try {
			this.entered = true;
			this.reinitializeState();
			this.setBuffer(buffer);
			while (this.hasRemaining(1)) yield this.doDecodeSync();
		} finally {
			this.entered = false;
		}
	}
	async decodeAsync(stream) {
		if (this.entered) return this.clone().decodeAsync(stream);
		try {
			this.entered = true;
			let decoded = false;
			let object;
			for await (const buffer of stream) {
				if (decoded) {
					this.entered = false;
					throw this.createExtraByteError(this.totalPos);
				}
				this.appendBuffer(buffer);
				try {
					object = this.doDecodeSync();
					decoded = true;
				} catch (e) {
					if (!(e instanceof RangeError)) throw e;
				}
				this.totalPos += this.pos;
			}
			if (decoded) {
				if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
				return object;
			}
			const { headByte, pos, totalPos } = this;
			throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
		} finally {
			this.entered = false;
		}
	}
	decodeArrayStream(stream) {
		return this.decodeMultiAsync(stream, true);
	}
	decodeStream(stream) {
		return this.decodeMultiAsync(stream, false);
	}
	async *decodeMultiAsync(stream, isArray) {
		if (this.entered) {
			yield* this.clone().decodeMultiAsync(stream, isArray);
			return;
		}
		try {
			this.entered = true;
			let isArrayHeaderRequired = isArray;
			let arrayItemsLeft = -1;
			for await (const buffer of stream) {
				if (isArray && arrayItemsLeft === 0) throw this.createExtraByteError(this.totalPos);
				this.appendBuffer(buffer);
				if (isArrayHeaderRequired) {
					arrayItemsLeft = this.readArraySize();
					isArrayHeaderRequired = false;
					this.complete();
				}
				try {
					while (true) {
						yield this.doDecodeSync();
						if (--arrayItemsLeft === 0) break;
					}
				} catch (e) {
					if (!(e instanceof RangeError)) throw e;
				}
				this.totalPos += this.pos;
			}
		} finally {
			this.entered = false;
		}
	}
	doDecodeSync() {
		DECODE: while (true) {
			const headByte = this.readHeadByte();
			let object;
			if (headByte >= 224) object = headByte - 256;
			else if (headByte < 192) if (headByte < 128) object = headByte;
			else if (headByte < 144) {
				const size = headByte - 128;
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte < 160) {
				const size = headByte - 144;
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else {
				const byteLength = headByte - 160;
				object = this.decodeString(byteLength, 0);
			}
			else if (headByte === 192) object = null;
			else if (headByte === 194) object = false;
			else if (headByte === 195) object = true;
			else if (headByte === 202) object = this.readF32();
			else if (headByte === 203) object = this.readF64();
			else if (headByte === 204) object = this.readU8();
			else if (headByte === 205) object = this.readU16();
			else if (headByte === 206) object = this.readU32();
			else if (headByte === 207) if (this.useBigInt64) object = this.readU64AsBigInt();
			else object = this.readU64();
			else if (headByte === 208) object = this.readI8();
			else if (headByte === 209) object = this.readI16();
			else if (headByte === 210) object = this.readI32();
			else if (headByte === 211) if (this.useBigInt64) object = this.readI64AsBigInt();
			else object = this.readI64();
			else if (headByte === 217) {
				const byteLength = this.lookU8();
				object = this.decodeString(byteLength, 1);
			} else if (headByte === 218) {
				const byteLength = this.lookU16();
				object = this.decodeString(byteLength, 2);
			} else if (headByte === 219) {
				const byteLength = this.lookU32();
				object = this.decodeString(byteLength, 4);
			} else if (headByte === 220) {
				const size = this.readU16();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 221) {
				const size = this.readU32();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 222) {
				const size = this.readU16();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 223) {
				const size = this.readU32();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 196) {
				const size = this.lookU8();
				object = this.decodeBinary(size, 1);
			} else if (headByte === 197) {
				const size = this.lookU16();
				object = this.decodeBinary(size, 2);
			} else if (headByte === 198) {
				const size = this.lookU32();
				object = this.decodeBinary(size, 4);
			} else if (headByte === 212) object = this.decodeExtension(1, 0);
			else if (headByte === 213) object = this.decodeExtension(2, 0);
			else if (headByte === 214) object = this.decodeExtension(4, 0);
			else if (headByte === 215) object = this.decodeExtension(8, 0);
			else if (headByte === 216) object = this.decodeExtension(16, 0);
			else if (headByte === 199) {
				const size = this.lookU8();
				object = this.decodeExtension(size, 1);
			} else if (headByte === 200) {
				const size = this.lookU16();
				object = this.decodeExtension(size, 2);
			} else if (headByte === 201) {
				const size = this.lookU32();
				object = this.decodeExtension(size, 4);
			} else throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
			this.complete();
			const stack = this.stack;
			while (stack.length > 0) {
				const state = stack.top();
				if (state.type === STATE_ARRAY) {
					state.array[state.position] = object;
					state.position++;
					if (state.position === state.size) {
						object = state.array;
						stack.release(state);
					} else continue DECODE;
				} else if (state.type === STATE_MAP_KEY) {
					if (object === "__proto__") throw new DecodeError("The key __proto__ is not allowed");
					state.key = this.mapKeyConverter(object);
					state.type = STATE_MAP_VALUE;
					continue DECODE;
				} else {
					state.map[state.key] = object;
					state.readCount++;
					if (state.readCount === state.size) {
						object = state.map;
						stack.release(state);
					} else {
						state.key = null;
						state.type = STATE_MAP_KEY;
						continue DECODE;
					}
				}
			}
			return object;
		}
	}
	readHeadByte() {
		if (this.headByte === HEAD_BYTE_REQUIRED) this.headByte = this.readU8();
		return this.headByte;
	}
	complete() {
		this.headByte = HEAD_BYTE_REQUIRED;
	}
	readArraySize() {
		const headByte = this.readHeadByte();
		switch (headByte) {
			case 220: return this.readU16();
			case 221: return this.readU32();
			default: if (headByte < 160) return headByte - 144;
			else throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
		}
	}
	pushMapState(size) {
		if (size > this.maxMapLength) throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
		this.stack.pushMapState(size);
	}
	pushArrayState(size) {
		if (size > this.maxArrayLength) throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
		this.stack.pushArrayState(size);
	}
	decodeString(byteLength, headerOffset) {
		if (!this.rawStrings || this.stateIsMapKey()) return this.decodeUtf8String(byteLength, headerOffset);
		return this.decodeBinary(byteLength, headerOffset);
	}
	/**
	* @throws {@link RangeError}
	*/
	decodeUtf8String(byteLength, headerOffset) {
		if (byteLength > this.maxStrLength) throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
		if (this.bytes.byteLength < this.pos + headerOffset + byteLength) throw MORE_DATA;
		const offset = this.pos + headerOffset;
		let object;
		if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) object = this.keyDecoder.decode(this.bytes, offset, byteLength);
		else object = utf8Decode(this.bytes, offset, byteLength);
		this.pos += headerOffset + byteLength;
		return object;
	}
	stateIsMapKey() {
		if (this.stack.length > 0) return this.stack.top().type === STATE_MAP_KEY;
		return false;
	}
	/**
	* @throws {@link RangeError}
	*/
	decodeBinary(byteLength, headOffset) {
		if (byteLength > this.maxBinLength) throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
		if (!this.hasRemaining(byteLength + headOffset)) throw MORE_DATA;
		const offset = this.pos + headOffset;
		const object = this.bytes.subarray(offset, offset + byteLength);
		this.pos += headOffset + byteLength;
		return object;
	}
	decodeExtension(size, headOffset) {
		if (size > this.maxExtLength) throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
		const extType = this.view.getInt8(this.pos + headOffset);
		const data = this.decodeBinary(size, headOffset + 1);
		return this.extensionCodec.decode(data, extType, this.context);
	}
	lookU8() {
		return this.view.getUint8(this.pos);
	}
	lookU16() {
		return this.view.getUint16(this.pos);
	}
	lookU32() {
		return this.view.getUint32(this.pos);
	}
	readU8() {
		const value = this.view.getUint8(this.pos);
		this.pos++;
		return value;
	}
	readI8() {
		const value = this.view.getInt8(this.pos);
		this.pos++;
		return value;
	}
	readU16() {
		const value = this.view.getUint16(this.pos);
		this.pos += 2;
		return value;
	}
	readI16() {
		const value = this.view.getInt16(this.pos);
		this.pos += 2;
		return value;
	}
	readU32() {
		const value = this.view.getUint32(this.pos);
		this.pos += 4;
		return value;
	}
	readI32() {
		const value = this.view.getInt32(this.pos);
		this.pos += 4;
		return value;
	}
	readU64() {
		const value = getUint64(this.view, this.pos);
		this.pos += 8;
		return value;
	}
	readI64() {
		const value = getInt64(this.view, this.pos);
		this.pos += 8;
		return value;
	}
	readU64AsBigInt() {
		const value = this.view.getBigUint64(this.pos);
		this.pos += 8;
		return value;
	}
	readI64AsBigInt() {
		const value = this.view.getBigInt64(this.pos);
		this.pos += 8;
		return value;
	}
	readF32() {
		const value = this.view.getFloat32(this.pos);
		this.pos += 4;
		return value;
	}
	readF64() {
		const value = this.view.getFloat64(this.pos);
		this.pos += 8;
		return value;
	}
};
//#endregion
//#region ../node_modules/.pnpm/crypt@0.0.2/node_modules/crypt/crypt.js
var require_crypt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt = {
			rotl: function(n, b) {
				return n << b | n >>> 32 - b;
			},
			rotr: function(n, b) {
				return n << 32 - b | n >>> b;
			},
			endian: function(n) {
				if (n.constructor == Number) return crypt.rotl(n, 8) & 16711935 | crypt.rotl(n, 24) & 4278255360;
				for (var i = 0; i < n.length; i++) n[i] = crypt.endian(n[i]);
				return n;
			},
			randomBytes: function(n) {
				for (var bytes = []; n > 0; n--) bytes.push(Math.floor(Math.random() * 256));
				return bytes;
			},
			bytesToWords: function(bytes) {
				for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) words[b >>> 5] |= bytes[i] << 24 - b % 32;
				return words;
			},
			wordsToBytes: function(words) {
				for (var bytes = [], b = 0; b < words.length * 32; b += 8) bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
				return bytes;
			},
			bytesToHex: function(bytes) {
				for (var hex = [], i = 0; i < bytes.length; i++) {
					hex.push((bytes[i] >>> 4).toString(16));
					hex.push((bytes[i] & 15).toString(16));
				}
				return hex.join("");
			},
			hexToBytes: function(hex) {
				for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
				return bytes;
			},
			bytesToBase64: function(bytes) {
				for (var base64 = [], i = 0; i < bytes.length; i += 3) {
					var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
					for (var j = 0; j < 4; j++) if (i * 8 + j * 6 <= bytes.length * 8) base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
					else base64.push("=");
				}
				return base64.join("");
			},
			base64ToBytes: function(base64) {
				base64 = base64.replace(/[^A-Z0-9+\/]/gi, "");
				for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
					if (imod4 == 0) continue;
					bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
				}
				return bytes;
			}
		};
		module.exports = crypt;
	})();
}));
//#endregion
//#region ../node_modules/.pnpm/charenc@0.0.2/node_modules/charenc/charenc.js
var require_charenc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var charenc = {
		utf8: {
			stringToBytes: function(str) {
				return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
			},
			bytesToString: function(bytes) {
				return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
			}
		},
		bin: {
			stringToBytes: function(str) {
				for (var bytes = [], i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i) & 255);
				return bytes;
			},
			bytesToString: function(bytes) {
				for (var str = [], i = 0; i < bytes.length; i++) str.push(String.fromCharCode(bytes[i]));
				return str.join("");
			}
		}
	};
	module.exports = charenc;
}));
//#endregion
//#region ../node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js
var require_is_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Determine if an object is a Buffer
	*
	* @author   Feross Aboukhadijeh <https://feross.org>
	* @license  MIT
	*/
	module.exports = function(obj) {
		return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
	};
	function isBuffer(obj) {
		return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
	}
	function isSlowBuffer(obj) {
		return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
	}
}));
//#endregion
//#region ../node_modules/.pnpm/md5@2.3.0/node_modules/md5/md5.js
var require_md5 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function() {
		var crypt = require_crypt(), utf8 = require_charenc().utf8, isBuffer = require_is_buffer(), bin = require_charenc().bin, md5 = function(message, options) {
			if (message.constructor == String) if (options && options.encoding === "binary") message = bin.stringToBytes(message);
			else message = utf8.stringToBytes(message);
			else if (isBuffer(message)) message = Array.prototype.slice.call(message, 0);
			else if (!Array.isArray(message) && message.constructor !== Uint8Array) message = message.toString();
			var m = crypt.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
			for (var i = 0; i < m.length; i++) m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
			m[l >>> 5] |= 128 << l % 32;
			m[(l + 64 >>> 9 << 4) + 14] = l;
			var FF = md5._ff, GG = md5._gg, HH = md5._hh, II = md5._ii;
			for (var i = 0; i < m.length; i += 16) {
				var aa = a, bb = b, cc = c, dd = d;
				a = FF(a, b, c, d, m[i + 0], 7, -680876936);
				d = FF(d, a, b, c, m[i + 1], 12, -389564586);
				c = FF(c, d, a, b, m[i + 2], 17, 606105819);
				b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
				a = FF(a, b, c, d, m[i + 4], 7, -176418897);
				d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
				c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
				b = FF(b, c, d, a, m[i + 7], 22, -45705983);
				a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
				d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
				c = FF(c, d, a, b, m[i + 10], 17, -42063);
				b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
				a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
				d = FF(d, a, b, c, m[i + 13], 12, -40341101);
				c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
				b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
				a = GG(a, b, c, d, m[i + 1], 5, -165796510);
				d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
				c = GG(c, d, a, b, m[i + 11], 14, 643717713);
				b = GG(b, c, d, a, m[i + 0], 20, -373897302);
				a = GG(a, b, c, d, m[i + 5], 5, -701558691);
				d = GG(d, a, b, c, m[i + 10], 9, 38016083);
				c = GG(c, d, a, b, m[i + 15], 14, -660478335);
				b = GG(b, c, d, a, m[i + 4], 20, -405537848);
				a = GG(a, b, c, d, m[i + 9], 5, 568446438);
				d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
				c = GG(c, d, a, b, m[i + 3], 14, -187363961);
				b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
				a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
				d = GG(d, a, b, c, m[i + 2], 9, -51403784);
				c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
				b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
				a = HH(a, b, c, d, m[i + 5], 4, -378558);
				d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
				c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
				b = HH(b, c, d, a, m[i + 14], 23, -35309556);
				a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
				d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
				c = HH(c, d, a, b, m[i + 7], 16, -155497632);
				b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
				a = HH(a, b, c, d, m[i + 13], 4, 681279174);
				d = HH(d, a, b, c, m[i + 0], 11, -358537222);
				c = HH(c, d, a, b, m[i + 3], 16, -722521979);
				b = HH(b, c, d, a, m[i + 6], 23, 76029189);
				a = HH(a, b, c, d, m[i + 9], 4, -640364487);
				d = HH(d, a, b, c, m[i + 12], 11, -421815835);
				c = HH(c, d, a, b, m[i + 15], 16, 530742520);
				b = HH(b, c, d, a, m[i + 2], 23, -995338651);
				a = II(a, b, c, d, m[i + 0], 6, -198630844);
				d = II(d, a, b, c, m[i + 7], 10, 1126891415);
				c = II(c, d, a, b, m[i + 14], 15, -1416354905);
				b = II(b, c, d, a, m[i + 5], 21, -57434055);
				a = II(a, b, c, d, m[i + 12], 6, 1700485571);
				d = II(d, a, b, c, m[i + 3], 10, -1894986606);
				c = II(c, d, a, b, m[i + 10], 15, -1051523);
				b = II(b, c, d, a, m[i + 1], 21, -2054922799);
				a = II(a, b, c, d, m[i + 8], 6, 1873313359);
				d = II(d, a, b, c, m[i + 15], 10, -30611744);
				c = II(c, d, a, b, m[i + 6], 15, -1560198380);
				b = II(b, c, d, a, m[i + 13], 21, 1309151649);
				a = II(a, b, c, d, m[i + 4], 6, -145523070);
				d = II(d, a, b, c, m[i + 11], 10, -1120210379);
				c = II(c, d, a, b, m[i + 2], 15, 718787259);
				b = II(b, c, d, a, m[i + 9], 21, -343485551);
				a = a + aa >>> 0;
				b = b + bb >>> 0;
				c = c + cc >>> 0;
				d = d + dd >>> 0;
			}
			return crypt.endian([
				a,
				b,
				c,
				d
			]);
		};
		md5._ff = function(a, b, c, d, x, s, t) {
			var n = a + (b & c | ~b & d) + (x >>> 0) + t;
			return (n << s | n >>> 32 - s) + b;
		};
		md5._gg = function(a, b, c, d, x, s, t) {
			var n = a + (b & d | c & ~d) + (x >>> 0) + t;
			return (n << s | n >>> 32 - s) + b;
		};
		md5._hh = function(a, b, c, d, x, s, t) {
			var n = a + (b ^ c ^ d) + (x >>> 0) + t;
			return (n << s | n >>> 32 - s) + b;
		};
		md5._ii = function(a, b, c, d, x, s, t) {
			var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
			return (n << s | n >>> 32 - s) + b;
		};
		md5._blocksize = 16;
		md5._digestsize = 16;
		module.exports = function(message, options) {
			if (message === void 0 || message === null) throw new Error("Illegal argument " + message);
			var digestbytes = crypt.wordsToBytes(md5(message, options));
			return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
		};
	})();
}));
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+plugin-dialog@2.7.1/node_modules/@tauri-apps/plugin-dialog/dist-js/index.js
var import_md5 = /* @__PURE__ */ __toESM(require_md5(), 1);
/**
* Open a file/directory selection dialog.
*
* The selected paths are added to the filesystem and asset protocol scopes.
* When security is more important than the easy of use of this API,
* prefer writing a dedicated command instead.
*
* Note that the scope change is not persisted, so the values are cleared when the application is restarted.
* You can save it to the filesystem using [tauri-plugin-persisted-scope](https://github.com/tauri-apps/tauri-plugin-persisted-scope).
* @example
* ```typescript
* import { open } from '@tauri-apps/plugin-dialog';
* // Open a selection dialog for image files
* const selected = await open({
*   multiple: true,
*   filters: [{
*     name: 'Image',
*     extensions: ['png', 'jpeg']
*   }]
* });
* if (Array.isArray(selected)) {
*   // user selected multiple files
* } else if (selected === null) {
*   // user cancelled the selection
* } else {
*   // user selected a single file
* }
* ```
*
* @example
* ```typescript
* import { open } from '@tauri-apps/plugin-dialog';
* import { appDir } from '@tauri-apps/api/path';
* // Open a selection dialog for directories
* const selected = await open({
*   directory: true,
*   multiple: true,
*   defaultPath: await appDir(),
* });
* if (Array.isArray(selected)) {
*   // user selected multiple directories
* } else if (selected === null) {
*   // user cancelled the selection
* } else {
*   // user selected a single directory
* }
* ```
*
* @returns A promise resolving to the selected path(s)
*
* @since 2.0.0
*/
async function open(options = {}) {
	if (typeof options === "object") Object.freeze(options);
	return await invoke("plugin:dialog|open", { options });
}
/**
* Open a file/directory save dialog.
*
* The selected path is added to the filesystem and asset protocol scopes.
* When security is more important than the easy of use of this API,
* prefer writing a dedicated command instead.
*
* Note that the scope change is not persisted, so the values are cleared when the application is restarted.
* You can save it to the filesystem using [tauri-plugin-persisted-scope](https://github.com/tauri-apps/tauri-plugin-persisted-scope).
* @example
* ```typescript
* import { save } from '@tauri-apps/plugin-dialog';
* const filePath = await save({
*   filters: [{
*     name: 'Image',
*     extensions: ['png', 'jpeg']
*   }]
* });
* ```
*
* @returns A promise resolving to the selected path.
*
* @since 2.0.0
*/
async function save(options = {}) {
	if (typeof options === "object") Object.freeze(options);
	return await invoke("plugin:dialog|save", { options });
}
//#endregion
//#region src/utils/sleep.tsx
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//#endregion
//#region src/core/service/dataGenerateService/generateThumbnail.tsx
var THUMBNAIL_MAX_DIMENSION = 256;
/** 极端宽高比，超过这个比例视为极端 */
var EXTREME_ASPECT_RATIO = 6;
/**
* 给一个矩形增加padding
* @param rect
* @param padding
* @returns
*/
function padRectangle(rect, padding) {
	const padVec = new Vector(padding, padding);
	return new Rectangle(rect.leftTop.subtract(padVec), rect.size.add(padVec.multiply(2)));
}
function getStageContentRectangle(project) {
	const rectangles = [];
	for (const entity of project.stageManager.getEntities()) if ("collisionBox" in entity && entity.collisionBox && typeof entity.collisionBox.getRectangle === "function") rectangles.push(entity.collisionBox.getRectangle());
	for (const association of project.stageManager.getAssociations()) if ("collisionBox" in association && association.collisionBox && typeof association.collisionBox.getRectangle === "function") rectangles.push(association.collisionBox.getRectangle());
	if (rectangles.length === 0) return void 0;
	return Rectangle.getBoundingRectangle(rectangles);
}
/**
* 为已加载的 Project 生成缩略图 PNG Blob（整个项目概览）。
* 会临时调整相机和 Canvas，完成后恢复原状。
* 如果舞台为空则返回 undefined。
*/
async function generateThumbnail(project) {
	const contentRect = getStageContentRectangle(project);
	if (!contentRect) return void 0;
	const contentMaxDim = Math.max(contentRect.width, contentRect.height);
	if (contentMaxDim === 0) return void 0;
	const paddedRect = padRectangle(contentRect, Math.max(20, contentMaxDim * .05));
	const w = paddedRect.width;
	const h = paddedRect.height;
	const useSquare = (w === 0 || h === 0 ? Infinity : Math.max(w / h, h / w)) >= EXTREME_ASPECT_RATIO;
	if (useSquare) toast.warning(`舞台上全部内容的外接矩形比例过于极端，超过1:${EXTREME_ASPECT_RATIO}，开始生成正方形缩略图\n建议排查异常内容，可能是在很远的地方创建了节点。可尝试ctrl+A全选后, F键重制视野观察选中的内容`);
	const squareDim = Math.max(paddedRect.width, paddedRect.height);
	const rect = useSquare ? new Rectangle(paddedRect.center.subtract(new Vector(squareDim / 2, squareDim / 2)), new Vector(squareDim, squareDim)) : paddedRect;
	let scaleFactor = 1;
	if (rect.width > THUMBNAIL_MAX_DIMENSION || rect.height > THUMBNAIL_MAX_DIMENSION) {
		const widthRatio = THUMBNAIL_MAX_DIMENSION / rect.width;
		const heightRatio = THUMBNAIL_MAX_DIMENSION / rect.height;
		scaleFactor = Math.min(widthRatio, heightRatio);
	}
	const originalLocation = project.camera.location.clone();
	const originalCurrentScale = project.camera.currentScale;
	const originalTargetScale = project.camera.targetScale;
	project.camera.currentScale = scaleFactor;
	project.camera.targetScale = scaleFactor;
	project.camera.location = rect.center;
	const tempCanvas = document.createElement("canvas");
	const deviceScale = window.devicePixelRatio;
	const canvasWidth = Math.min(rect.width * scaleFactor + 2, 258);
	const canvasHeight = Math.min(rect.height * scaleFactor + 2, 258);
	tempCanvas.width = canvasWidth * deviceScale;
	tempCanvas.height = canvasHeight * deviceScale;
	tempCanvas.style.width = `${canvasWidth}px`;
	tempCanvas.style.height = `${canvasHeight}px`;
	const tempCtx = tempCanvas.getContext("2d");
	tempCtx.scale(deviceScale, deviceScale);
	const originalCanvas = project.canvas.element;
	const originalCtx = project.canvas.ctx;
	const originalRendererWidth = project.renderer.w;
	const originalRendererHeight = project.renderer.h;
	try {
		project.canvas.element = tempCanvas;
		project.canvas.ctx = tempCtx;
		project.renderer.w = canvasWidth;
		project.renderer.h = canvasHeight;
		project.loop();
		await sleep(200);
		project.pause();
		return await new Promise((resolve) => {
			tempCanvas.toBlob((b) => {
				resolve(b ?? new Blob());
			}, "image/png");
		});
	} finally {
		project.canvas.element = originalCanvas;
		project.canvas.ctx = originalCtx;
		project.renderer.w = originalRendererWidth;
		project.renderer.h = originalRendererHeight;
		project.camera.location = originalLocation;
		project.camera.currentScale = originalCurrentScale;
		project.camera.targetScale = originalTargetScale;
		tempCanvas.remove();
	}
}
//#endregion
//#region src/core/service/dataManageService/aiEngine/AIProjectReferenceStore.ts
var writeQueue = Promise.resolve();
function isAIObjectReferenceSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const references = value;
	return Array.isArray(references.entries) && typeof references.nextNodeRef === "number" && Number.isInteger(references.nextNodeRef) && references.nextNodeRef >= 1 && typeof references.nextEdgeRef === "number" && Number.isInteger(references.nextEdgeRef) && references.nextEdgeRef >= 1;
}
var AIProjectReferenceStore;
(function(_AIProjectReferenceStore) {
	async function load(projectUri) {
		const value = await invoke("load_project_reference_snapshot", { projectUri });
		if (value === void 0 || value === null) return null;
		if (!isAIObjectReferenceSnapshot(value)) throw new Error("保存的 AI 项目引用格式无效");
		return value;
	}
	_AIProjectReferenceStore.load = load;
	async function save(projectUri, references) {
		const result = writeQueue.then(() => invoke("save_project_reference_snapshot", {
			projectUri,
			references
		}), () => invoke("save_project_reference_snapshot", {
			projectUri,
			references
		}));
		writeQueue = result;
		return result;
	}
	_AIProjectReferenceStore.save = save;
})(AIProjectReferenceStore || (AIProjectReferenceStore = {}));
//#endregion
//#region src/core/service/dataManageService/aiEngine/BuiltInToolRuntimeError.ts
var messages = {
	invalid_ref_format: "Project Object Reference format is invalid.",
	unknown_ref: "Project Object Reference does not exist.",
	stale_ref: "Project Object Reference points to a deleted object.",
	wrong_ref_kind: "Project Object Reference has the wrong object kind."
};
function classifyBuiltInToolRuntimeError(error) {
	const classified = classifyBuiltInToolException(error);
	if (!classified) return void 0;
	return {
		code: classified.code,
		message: messages[classified.code],
		details: { ref: classified.ref }
	};
}
//#endregion
//#region src/core/OpenProjectRuntimeHost.ts
var unavailableResponse = () => ({
	ok: false,
	error: {
		code: "RUNTIME_HOST_UNAVAILABLE",
		message: "Open Project Runtime Host is unavailable."
	}
});
var cancelledResponse = () => ({
	ok: false,
	error: {
		code: "CANCELLED",
		message: "Project Graph CLI invocation was cancelled."
	}
});
function failedInvocationResponse(error, abortSignal) {
	if (abortSignal.aborted) return cancelledResponse();
	const referenceError = classifyBuiltInToolRuntimeError(error);
	return referenceError ? {
		ok: false,
		error: referenceError
	} : {
		ok: false,
		error: {
			code: "TOOL_EXECUTION_FAILED",
			message: "Built-in tool execution failed."
		}
	};
}
var OpenProjectRuntimeHost = class {
	project;
	activeInvocations = /* @__PURE__ */ new Set();
	activeAbortControllers = /* @__PURE__ */ new Set();
	invocationQueue = Promise.resolve();
	referencesNeedSave = false;
	closing = false;
	constructor(project) {
		this.project = project;
	}
	invoke(toolName, input, abortSignal) {
		if (this.closing) return Promise.resolve(unavailableResponse());
		const abortController = new AbortController();
		const abort = () => abortController.abort(abortSignal?.reason);
		if (abortSignal?.aborted) abort();
		else abortSignal?.addEventListener("abort", abort, { once: true });
		this.activeAbortControllers.add(abortController);
		const invocation = this.invocationQueue.then(() => abortController.signal.aborted ? cancelledResponse() : this.invokeLiveProject(toolName, input, abortController.signal));
		this.invocationQueue = invocation.then(() => void 0);
		this.activeInvocations.add(invocation);
		invocation.finally(() => {
			abortSignal?.removeEventListener("abort", abort);
			this.activeAbortControllers.delete(abortController);
			this.activeInvocations.delete(invocation);
		});
		return invocation;
	}
	async dispose() {
		this.closing = true;
		for (const controller of this.activeAbortControllers) controller.abort();
		await Promise.allSettled(this.activeInvocations);
	}
	async invokeLiveProject(toolName, input, abortSignal) {
		let unsubscribe;
		let response;
		try {
			if (abortSignal.aborted) return cancelledResponse();
			const references = await this.project.aiEngine.prepareProjectReferences(this.project);
			if (abortSignal.aborted) return cancelledResponse();
			const host = createLiveProjectBuiltInToolRuntimeHost(this.project, references);
			unsubscribe = references.subscribe(() => {
				this.referencesNeedSave = true;
			});
			try {
				const value = await invokeBuiltInTool(toolName, input, host, { abortSignal });
				response = abortSignal.aborted ? cancelledResponse() : {
					ok: true,
					value: value === void 0 ? null : value
				};
			} catch (error) {
				response = failedInvocationResponse(error, abortSignal);
			}
			const after = references.exportSnapshot();
			if (this.referencesNeedSave) try {
				await AIProjectReferenceStore.save(this.project.aiEngine.getProjectReferenceStoreUri(this.project), after);
				this.referencesNeedSave = false;
			} catch {
				response = {
					ok: false,
					error: {
						code: "PROJECT_REFERENCE_SAVE_FAILED",
						message: "Project Object References could not be saved."
					}
				};
			}
		} catch (error) {
			response = failedInvocationResponse(error, abortSignal);
		}
		return finalizeRuntimeCleanup(response, [() => unsubscribe?.()]);
	}
};
var runtimeHosts = /* @__PURE__ */ new Map();
var bridgeInvocationControllers = /* @__PURE__ */ new Map();
var bridgeListenerPromise;
function ensureOpenProjectRuntimeBridgeListener() {
	bridgeListenerPromise ??= listen("project-runtime-invocation", async ({ payload }) => {
		try {
			if (payload.kind === "cancel") {
				bridgeInvocationControllers.get(payload.requestId)?.abort();
				return;
			}
			const host = runtimeHosts.get(payload.projectPath);
			const abortController = new AbortController();
			bridgeInvocationControllers.set(payload.requestId, abortController);
			let response;
			try {
				response = host ? await host.invoke(payload.toolName, payload.input, abortController.signal) : unavailableResponse();
			} finally {
				bridgeInvocationControllers.delete(payload.requestId);
			}
			if (!await invoke("respond_project_runtime_bridge", {
				requestId: payload.requestId,
				response
			})) return;
		} catch (error) {
			window.dispatchEvent(new ErrorEvent("error", { error }));
		}
	}).then(() => void 0);
	return bridgeListenerPromise;
}
function registerOpenProjectRuntimeHost(project) {
	const initialCanonicalPath = project.canonicalProjectPath;
	if (!initialCanonicalPath) throw new Error("Open Project Runtime Host requires a canonical Project Path");
	let canonicalPath = initialCanonicalPath;
	const host = new OpenProjectRuntimeHost(project);
	const existingHost = runtimeHosts.get(canonicalPath);
	if (existingHost && existingHost !== host) throw new Error("Open Project Runtime Host already exists for this path");
	runtimeHosts.set(canonicalPath, host);
	return {
		rebind(nextCanonicalPath) {
			if (nextCanonicalPath === canonicalPath) return;
			const nextHost = runtimeHosts.get(nextCanonicalPath);
			if (nextHost && nextHost !== host) throw new Error("Open Project Runtime Host already exists for this path");
			if (runtimeHosts.get(canonicalPath) === host) runtimeHosts.delete(canonicalPath);
			runtimeHosts.set(nextCanonicalPath, host);
			canonicalPath = nextCanonicalPath;
		},
		async dispose() {
			if (runtimeHosts.get(canonicalPath) === host) runtimeHosts.delete(canonicalPath);
			await host.dispose();
		}
	};
}
//#endregion
//#region src/core/ProjectOwnership.ts
var ProjectOwnershipError = class extends Error {
	code;
	owner;
	name = "ProjectOwnershipError";
	constructor(code, owner) {
		super(code === "PROJECT_NOT_FOUND" ? instance.t("projectOwnership.notFound") : code === "PROJECT_BUSY" ? instance.t("projectOwnership.busy") : instance.t("projectOwnership.loadFailed"));
		this.code = code;
		this.owner = owner;
	}
};
var ProjectOwnershipLease = class {
	ownershipId;
	canonicalPath;
	disposePromise;
	disposed = false;
	constructor(ownershipId, canonicalPath) {
		this.ownershipId = ownershipId;
		this.canonicalPath = canonicalPath;
	}
	async makeConnectable() {
		try {
			await invoke("make_desktop_project_ownership_connectable", { ownershipId: this.ownershipId });
		} catch (error) {
			throw toProjectOwnershipError(error);
		}
	}
	dispose() {
		if (this.disposed) return Promise.resolve();
		this.disposePromise ??= invoke("release_desktop_project_ownership", { ownershipId: this.ownershipId }).then(() => {
			this.disposed = true;
		}).catch((error) => {
			this.disposePromise = void 0;
			throw toProjectOwnershipError(error);
		});
		return this.disposePromise;
	}
};
async function releaseProjectOwnershipWithRetry(ownership) {
	for (;;) try {
		await ownership.dispose();
		return;
	} catch (error) {
		await Dialog.buttons(instance.t("projectOwnership.releaseFailedTitle"), instance.t("projectOwnership.releaseFailedMessage", { error: String(error) }), [{
			id: "retry",
			label: instance.t("projectOwnership.retry")
		}]);
	}
}
async function reserveProjectOwnershipForSave(projectPath) {
	if (!isTauri()) return {
		status: "reserved",
		ownership: void 0
	};
	let acquisition;
	try {
		await ensureOpenProjectRuntimeBridgeListener();
		acquisition = await invoke("acquire_desktop_project_ownership_for_save", { projectPath });
	} catch (error) {
		throw toProjectOwnershipError(error);
	}
	if (acquisition.status === "already_owned") return {
		status: "already_open",
		ownershipId: acquisition.ownershipId,
		canonicalPath: acquisition.canonicalPath
	};
	return {
		status: "reserved",
		ownership: new ProjectOwnershipLease(acquisition.ownershipId, acquisition.canonicalPath)
	};
}
async function loadWithProjectOwnership(projectPath, load) {
	if (!isTauri()) return {
		status: "opened",
		value: await load(void 0)
	};
	let acquisition;
	try {
		await ensureOpenProjectRuntimeBridgeListener();
		acquisition = await invoke("acquire_desktop_project_ownership", { projectPath });
	} catch (error) {
		throw toProjectOwnershipError(error);
	}
	if (acquisition.status === "already_owned") return {
		status: "already_open",
		ownershipId: acquisition.ownershipId,
		canonicalPath: acquisition.canonicalPath
	};
	const ownership = new ProjectOwnershipLease(acquisition.ownershipId, acquisition.canonicalPath);
	try {
		return {
			status: "opened",
			value: await load(ownership)
		};
	} catch (error) {
		await releaseProjectOwnershipWithRetry(ownership);
		throw error;
	}
}
function toProjectOwnershipError(error) {
	if (typeof error === "object" && error !== null && "code" in error) {
		const code = error.code;
		if (code === "PROJECT_NOT_FOUND" || code === "PROJECT_LOAD_FAILED" || code === "PROJECT_BUSY") return new ProjectOwnershipError(code, "owner" in error ? error.owner : void 0);
	}
	return new ProjectOwnershipError("PROJECT_LOAD_FAILED");
}
//#endregion
//#region src/core/Project.tsx
var ProjectState = /* @__PURE__ */ function(ProjectState) {
	/**
	* “已保存”
	* 已写入到原始文件中
	* 已上传到云端
	*/
	ProjectState[ProjectState["Saved"] = 0] = "Saved";
	/**
	* "已暂存"
	* 未写入到原始文件中，但是已经暂存到数据目录
	* 未上传到云端，但是已经暂存到本地
	*/
	ProjectState[ProjectState["Stashed"] = 1] = "Stashed";
	/**
	* “未保存”
	* 未写入到原始文件中，也未暂存到数据目录（真·未保存）
	* 未上传到云端，也未暂存到本地
	*/
	ProjectState[ProjectState["Unsaved"] = 2] = "Unsaved";
	return ProjectState;
}({});
/**
* “工程”
* 一个标签页对应一个工程，一个工程只能对应一个URI
* 一个工程可以加载不同的服务，类似vscode的扩展（Extensions）机制
*/
var Project = class Project extends Tab {
	static latestVersion = 18;
	/**
	* 工程文件的URI
	* key: 服务ID
	* value: 服务实例
	*/
	_uri;
	_projectState = 2;
	_isSaving = false;
	projectOwnership;
	openRuntimeHost;
	stage = [];
	tags = [];
	/**
	* string：UUID
	* value: Blob
	*/
	attachments = /* @__PURE__ */ new Map();
	/**
	* 创建Encoder对象比直接用encode()快
	* @see https://github.com/msgpack/msgpack-javascript#reusing-encoder-and-decoder-instances
	*/
	encoder = new Encoder();
	decoder = new Decoder();
	/**
	* 创建一个项目
	* @param uri 工程文件的URI
	* 之所以从“路径”改为了“URI”，是因为要为后面的云同步功能做铺垫。
	* 普通的“路径”无法表示云盘中的文件，而URI可以。
	* 同时，草稿文件也从硬编码的“Project Graph”特殊文件路径改为了协议为draft、内容为UUID的URI。
	* @see https://code.visualstudio.com/api/references/vscode-api#workspace.workspaceFile
	*/
	constructor(uri) {
		super({});
		this._uri = uri;
	}
	attachProjectOwnership(ownership) {
		this.projectOwnership = ownership;
	}
	get projectOwnerIdentity() {
		return this.projectOwnership?.ownershipId;
	}
	get canonicalProjectPath() {
		return this.projectOwnership?.canonicalPath;
	}
	activateOpenRuntimeHost() {
		if (this.projectOwnership) this.openRuntimeHost ??= registerOpenProjectRuntimeHost(this);
	}
	/**
	* 创建一个草稿工程
	* URI为draft:UUID
	*/
	static newDraft() {
		if (store.get(tabsAtom).length === 0) store.set(nextProjectIdAtom, 1);
		const num = store.get(nextProjectIdAtom);
		const uri = URI.parse("draft:" + num);
		store.set(nextProjectIdAtom, num + 1);
		return new Project(uri);
	}
	/**
	* 检查是否需要升级，如果需要则显示确认对话框
	* @param currentVersion 当前文件版本
	* @param latestVersion 最新版本
	*/
	async checkAndConfirmUpgrade(currentVersion, latestVersion) {
		const versionDiff = compareProjectVersions(currentVersion, latestVersion);
		if (versionDiff > 0) {
			await Dialog.buttons("文件版本过新，无法打开", `该文件由更新版本的软件保存（prg文件版本 ${currentVersion}，当前软件支持的prg最高版本 ${latestVersion}）。\n\n请升级软件后再打开此文件，以避免数据损坏。`, [{
				id: "ok",
				label: "确定"
			}]);
			return false;
		}
		if (versionDiff === 0) return true;
		if (await Dialog.buttons("检测到旧版本项目文件", `当前文件版本为 ${currentVersion}，需要升级到 ${latestVersion} (是prg文件版本,非软件版本)。\n\n升级过程不可逆且可能存在风险，特别是对于大型文件，建议提前备份。是否继续升级？`, [{
			id: "cancel",
			label: "取消",
			variant: "ghost"
		}, {
			id: "upgrade",
			label: "确认升级"
		}]) === "cancel") return false;
		await new Promise((resolve) => setTimeout(resolve, 500));
		return true;
	}
	/**
	* 服务加载完成后再调用
	*/
	async init() {
		if (!await this.fs.exists(this.uri)) return;
		try {
			const { serializedStageObjects, tags, references, metadata, readme } = await parseProjectFile(await this.fs.read(this.uri), this.decoder, this.attachments);
			const currentVersion = metadata?.version || "2.0.0";
			const latestVersion = ProjectUpgrader.NLatestVersion;
			if (!await this.checkAndConfirmUpgrade(currentVersion, latestVersion)) return;
			const [upgradedStageObjects, upgradedMetadata] = ProjectUpgrader.upgradeNAnyToNLatest(serializedStageObjects, metadata);
			this.stage = deserialize(upgradedStageObjects, this);
			this.tags = tags;
			this.references = references;
			this.metadata = upgradedMetadata;
			this.readme = readme;
			if (this.getService("stageManager")) this.stageManager.updateReferences();
			this.wasUpgraded = currentVersion !== latestVersion;
		} catch (e) {
			console.warn(e);
			const errorMessage = `打开文件时发生错误，文件内容可能已损坏或与当前软件版本不兼容。\n\n错误信息：${e}`;
			if (await Dialog.buttons("文件解析失败", errorMessage, [{
				id: "ok",
				label: "确定"
			}, {
				id: "copy",
				label: "复制错误信息"
			}]) === "copy") navigator.clipboard.writeText(errorMessage);
			return;
		}
		this.projectState = 0;
	}
	get isDraft() {
		return this.uri.scheme === "draft";
	}
	get isCollab() {
		return this.uri.scheme === "collab";
	}
	get title() {
		return this.uri.scheme === "draft" ? `临时草稿 (${this.uri.path})` : this.uri.scheme === "collab" ? `协作 (${this.uri.path})` : this.uri.scheme === "file" ? this.uri.path.split("/").pop() : this.uri.toString();
	}
	get icon() {
		return File;
	}
	get uri() {
		return this._uri;
	}
	set uri(uri) {
		this._uri = uri;
		this.projectState = 2;
	}
	/**
	* 将文件暂存到数据目录中（通常为~/.local/share）
	* ~/.local/share/liren.project-graph/stash/<normalizedUri>
	* @see https://code.visualstudio.com/blogs/2016/11/30/hot-exit-in-insiders
	*
	* 频繁用msgpack序列化不会卡吗？
	* 虽然JSON.stringify()在V8上面速度和msgpack差不多
	* 但是要考虑跨平台，目前linux和macos用的都是webkit，目前还没有JavaScriptCore相关的benchmark
	* 而且考虑到以后会把图片也放进文件里面，JSON肯定不合适了
	* @see https://github.com/msgpack/msgpack-javascript#benchmark
	*/
	async stash() {}
	async save(options = {}) {
		if (this.isDraft || this.isCollab) {
			const path = await save({
				title: this.isDraft ? "保存草稿" : "保存协作工程",
				filters: [{
					name: "Project Graph",
					extensions: ["prg"]
				}]
			});
			if (!path) throw new Error("未选择路径");
			await this.saveAs(URI.file(path), options);
			return;
		}
		try {
			this.isSaving = true;
			await this.fs.write(this.uri, await this.getFileContent(options));
			this.projectState = 0;
		} finally {
			this.isSaving = false;
		}
	}
	async saveAs(targetUri, options = {}) {
		if (targetUri.scheme !== "file") throw new Error("Project Save As requires a file URI");
		const fileSystemProvider = this.fileSystemProviders.get("file");
		if (!fileSystemProvider) throw new Error("File Project provider is not registered");
		try {
			this.isSaving = true;
			const content = await this.getFileContent(options);
			const reservation = await reserveProjectOwnershipForSave(targetUri.fsPath);
			if (reservation.status === "already_open") {
				if (reservation.ownershipId !== this.projectOwnerIdentity) throw new ProjectOwnershipError("PROJECT_BUSY");
				await fileSystemProvider.write(targetUri, content);
				this._uri = targetUri;
				this.projectState = 0;
				return;
			}
			const nextOwnership = reservation.ownership;
			try {
				await fileSystemProvider.write(targetUri, content);
			} catch (error) {
				if (nextOwnership) await releaseProjectOwnershipWithRetry(nextOwnership);
				throw error;
			}
			if (!nextOwnership) {
				this._uri = targetUri;
				this.projectState = 0;
				return;
			}
			const previousUri = this._uri;
			const previousOwnership = this.projectOwnership;
			const previousRuntimeHost = this.openRuntimeHost;
			let createdRuntimeHost = false;
			this._uri = targetUri;
			this.projectOwnership = nextOwnership;
			try {
				if (previousRuntimeHost) previousRuntimeHost.rebind(nextOwnership.canonicalPath);
				else {
					this.openRuntimeHost = registerOpenProjectRuntimeHost(this);
					createdRuntimeHost = true;
				}
				await nextOwnership.makeConnectable();
			} catch (error) {
				if (createdRuntimeHost) {
					await this.openRuntimeHost?.dispose();
					this.openRuntimeHost = void 0;
				} else if (previousRuntimeHost && previousOwnership) previousRuntimeHost.rebind(previousOwnership.canonicalPath);
				this._uri = previousUri;
				this.projectOwnership = previousOwnership;
				await releaseProjectOwnershipWithRetry(nextOwnership);
				throw error;
			}
			if (previousOwnership) await releaseProjectOwnershipWithRetry(previousOwnership);
			this.projectState = 0;
		} finally {
			this.isSaving = false;
		}
	}
	references = {
		sections: {},
		files: []
	};
	metadata = createDefaultMetadata(ProjectUpgrader.NLatestVersion);
	readme;
	wasUpgraded = false;
	async getFileContent(options = {}) {
		const includeThumbnail = options.includeThumbnail !== false;
		const serializedStage = serialize(this.stage);
		const encodedStage = this.encoder.encode(serializedStage);
		const uwriter = new Uint8ArrayWriter();
		const writer = new ZipWriter(uwriter, { level: 0 });
		await writer.add("stage.msgpack", new Uint8ArrayReader(encodedStage), { level: 0 });
		await writer.add("tags.msgpack", new Uint8ArrayReader(this.encoder.encode(this.tags)), { level: 0 });
		await writer.add("reference.msgpack", new Uint8ArrayReader(this.encoder.encode(this.references)), { level: 0 });
		await writer.add("metadata.msgpack", new Uint8ArrayReader(this.encoder.encode(this.metadata)), { level: 0 });
		if (this.readme) await writer.add("README.md", new Uint8ArrayReader(new TextEncoder().encode(this.readme)), { level: 0 });
		for (const [uuid, attachment] of this.attachments.entries()) await writer.add(`attachments/${uuid}.${src_default.getExtension(attachment.type)}`, new BlobReader(attachment), { level: 0 });
		if (includeThumbnail) try {
			const thumbnailBlob = await generateThumbnail(this);
			if (thumbnailBlob) await writer.add("thumbnail.png", new BlobReader(thumbnailBlob), { level: 0 });
		} catch {}
		await writer.close();
		return await uwriter.getData();
	}
	/**
	* 备份用：生成项目内容的哈希值，用于检测内容是否发生变化
	*/
	get stageHash() {
		const serializedStage = serialize(this.stage);
		return (0, import_md5.default)(new Encoder().encode(serializedStage));
	}
	/**
	* 注册一个文件管理器
	* @param scheme 目前有 "file" | "draft"， 以后可能有其他的协议
	*/
	addAttachment(data, id = crypto.randomUUID()) {
		const uuid = id;
		this.attachments.set(uuid, data);
		this.emit("attachment-add", {
			id: uuid,
			data
		});
		return uuid;
	}
	set projectState(state) {
		if (state === this._projectState) return;
		this._projectState = state;
		this.emit("state-change", state);
	}
	get projectState() {
		return this._projectState;
	}
	set isSaving(isSaving) {
		if (isSaving === this._isSaving) return;
		this._isSaving = isSaving;
		this.emit("state-change", this._projectState);
	}
	get isSaving() {
		return this._isSaving;
	}
	containerRef = import_react.createRef();
	/**
	* 立刻加载一个新的服务
	*/
	loadService(service) {
		super.loadService(service);
		if (service.id === "canvas" && this._lastContainer) this.canvas.mount(this._lastContainer);
	}
	componentDidMount() {}
	currentComponent = null;
	getComponent() {
		if (this.currentComponent) return this.currentComponent;
		const self = this;
		this.currentComponent = class extends import_react.Component {
			displayName = "ProjectContainer";
			containerRef = import_react.createRef();
			unwatchShowQuickSettingsToolbar;
			state = { showQuickSettingsToolbar: Settings.showQuickSettingsToolbar };
			componentDidMount() {
				self._lastContainer = this.containerRef.current;
				if (this.containerRef.current && self.getService("canvas")) self.canvas.mount(this.containerRef.current);
				this.unwatchShowQuickSettingsToolbar = Settings.watch("showQuickSettingsToolbar", (value) => {
					this.setState({ showQuickSettingsToolbar: value });
				});
			}
			componentWillUnmount() {
				this.unwatchShowQuickSettingsToolbar?.();
			}
			render() {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 overflow-hidden",
							ref: this.containerRef
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarContent, {}),
						this.state.showQuickSettingsToolbar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightToolbar, {})
					]
				});
			}
		};
		return this.currentComponent;
	}
	render() {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 overflow-hidden",
					ref: this.containerRef
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolbarContent, {}),
				Settings.showQuickSettingsToolbar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightToolbar, {})
			]
		});
	}
	async dispose() {
		const ownership = this.projectOwnership;
		const cleanupErrors = [];
		try {
			try {
				await this.openRuntimeHost?.dispose();
			} catch (error) {
				cleanupErrors.push(error);
			} finally {
				this.openRuntimeHost = void 0;
			}
			try {
				await super.dispose();
			} catch (error) {
				cleanupErrors.push(error);
			}
			const stageCleanupTasks = this.stage.map((stageObject) => {
				try {
					return Promise.resolve(stageObject.dispose?.());
				} catch (error) {
					return Promise.reject(error);
				}
			});
			const stageCleanupResults = await Promise.allSettled(stageCleanupTasks);
			cleanupErrors.push(...stageCleanupResults.filter((result) => result.status === "rejected").map(({ reason }) => reason));
			this.stage.length = 0;
		} finally {
			if (ownership) {
				await releaseProjectOwnershipWithRetry(ownership);
				if (this.projectOwnership === ownership) this.projectOwnership = void 0;
			}
		}
		if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, "Project cleanup failed");
	}
};
/**
* 装饰器
*/
var service = (id) => (target) => {
	target.id = id;
	return target;
};
//#endregion
export { createTabGroup as $, Check as $i, composeEventHandlers as $n, Pause as $r, DropdownMenuSubTrigger as $t, DialogHeader as A, HardDrive as Ai, createPopperScope as An, SquareM as Ar, Toolbar as At, activeResourceTabAtom as B, FileStack as Bi, useDirection as Bn, Shapes as Br, TooltipTrigger as Bt, SelectTrigger as C, emitTo as Ca, Lightbulb as Ci, useFocusGuards as Cn, TextAlignJustify as Cr, Overlay as Ct, DialogClose as D, ImageUpscale as Di, Arrow as Dn, SunMoon as Dr, Trigger$1 as Dt, Dialog as E, Keyboard as Ei, Anchor as En, Sun as Er, Title as Et, writeText as F, Grip as Fi, isElement as Fn, SplinePointer as Fr, ToolbarSplitButtonPrimary as Ft, isWindowMaxsizedAtom as G, Crosshair as Gi, Slot$3 as Gn, RefreshCcwDot as Gr, DropdownMenuContent as Gt, commandPaletteVisibleAtom as H, Eye as Hi, useId as Hn, ScanEye as Hr, Primitive as Ht, Textarea as I, Gauge as Ii, DismissableLayer as In, Space as Ir, ToolbarSplitButtonSecondary as It, tabGroupRootAtom as J, Circle as Ji, useSize as Jn, Presentation as Jr, DropdownMenuPortal as Jt, store as K, Contrast as Ki, createSlot as Kn, RefreshCcw as Kr, DropdownMenuGroup as Kt, Input as L, Fullscreen as Li, Item$1 as Ln, Slash as Lr, Tooltip as Lt, readImage as M, Hand as Mi, offset as Mn, SquareArrowUpLeft as Mr, ToolbarGroup as Mt, readText as N, HandMetal as Ni, useFloating as Nn, SquareArrowDownRight as Nr, ToolbarMenuGroup as Nt, DialogContent as O, ImageMinus as Oi, Content$1 as On, Square as Or, WarningProvider as Ot, writeImage as P, HandGrab as Pi, autoUpdate as Pn, Spline as Pr, ToolbarSplitButton as Pt, FIXED_SIDE_GROUP_IDS as Q, ChevronDown as Qi, createContextScope as Qn, Pencil as Qr, DropdownMenuSubContent as Qt, activeDockedTabAtom as R, Folder as Ri, Root$6 as Rn, Skull as Rr, TooltipContent$1 as Rt, SelectItem as S, emit as Sa, LineSquiggle as Si, FocusScope as Sn, TextCursorInput as Sr, Description as St, clamp as T, once as Ta, Languages as Ti, Portal$4 as Tn, Tag as Tr, Root$1 as Tt, currentUserAtom as U, Delete as Ui, Switch as Un, Scaling as Ur, DropdownMenu as Ut, activeTabAtom as V, FileImage as Vi, useCallbackRef$1 as Vn, ScanText as Vr, Separator as Vt, isDevAtom as W, Database as Wi, Primitive$1 as Wn, RotateCw as Wr, DropdownMenuCheckboxItem as Wt, useAtom as X, ChevronUp as Xi, useControllableState as Xn, Percent as Xr, DropdownMenuRadioItem as Xt, tabsAtom as Y, CircleDot as Yi, usePrevious as Yn, PictureInPicture2 as Yr, DropdownMenuRadioGroup as Yt, useAtomValue as Z, ChevronRight as Zi, useLayoutEffect2 as Zn, Pentagon as Zr, DropdownMenuSub as Zt, instance as _, isMac as _a, ListRestart as _i, SubTrigger as _n, Ungroup as _r, transformImage as _t, loadWithProjectOwnership as a, ArrowRight as aa, Move3d as ai, Content2$2 as an, Slot$4 as ar, removeTabFromGroups as at, SelectContent as b, LazyStore as ba, ListCollapse as bi, __awaiter as bn, TrendingUpDown as br, Close as bt, sleep as c, AppWindow as ca, MousePointer as ci, ItemIndicator$1 as cn, QuickSettingsManager as cr, updateTabSplitSizes as ct, require_md5 as d, createLucideIcon as da, MouseLeft as di, RadioGroup as dn, ZoomIn as dr, isResourceTab as dt, CaseSensitive as ea, PanelRightOpen as ei, DropdownMenuTrigger as en, Button$1 as er, findTabGroup as et, Decoder as f, createStore$1 as fa, Moon as fi, RadioItem as fn, X as fr, Telemetry as ft, require_shim as g, isLinux as ga, ListTree as gi, SubContent as gn, Unlink as gr, Image as gt, useTranslation as h, isIpad as ha, LoaderPinwheel as hi, Sub as hn, VenetianMask as hr, getVersion as ht, ProjectOwnershipError as i, ArrowUpDown as ia, MoveHorizontal as ii, CheckboxItem as in, cx as ir, isFixedSideGroupId as it, DialogTitle as j, HardDriveDownload as ji, flip as jn, SquareDashed as jr, ToolbarButton as jt, DialogDescription as k, Hourglass as ki, Root2$2 as kn, SquarePen as kr, createDialogScope as kt, open as l, AppWindowMac as la, MousePointerClick as li, Label as ln, settingsIcons as lr, ComponentTab as lt, ColorManager as m, isDesktop as ma, MessageSquareText as mi, Separator$2 as mn, Waypoints as mr, getDeviceId as mt, ProjectState as n, Bug as na, Move as ni, Anchor2 as nn, cn as nr, getTabGroups as nt, classifyBuiltInToolRuntimeError as o, ArrowRightFromLine as oa, Mouse as oi, Group$1 as on, composeRefs as or, splitTabGroup as ot, Encoder as p, family as pa, Minus as pi, Root3 as pn, WholeWord as pr, getAppVersion as pt, tabDropTargetAtom as q, Clipboard as qi, createSlottable as qn, Ratio as qr, DropdownMenuItem as qt, service as r, Blend as ra, MoveVertical as ri, Arrow2 as rn, cva as rr, insertTabIntoGroup as rt, AIProjectReferenceStore as s, ArrowDownNarrowWide as sa, MouseRight as si, Item2$1 as sn, useComposedRefs as sr, updateTabGroup as st, Project as t, Calculator as ta, Palette as ti, DropdownMenuItemIndicator as tn, buttonVariants as tr, findTabGroupByTabId as tt, save as u, AlignStartVertical as ua, MouseOff as ui, Portal$2 as un, ZoomOut as ur, Tab as ut, Slider as v, isWeb as va, ListMusic as vi, createMenuScope as vn, Undo as vr, FeatureFlags as vt, SelectValue as w, listen as wa, Layers as wi, Presence as wn, Tally4 as wr, Portal$1 as wt, SelectGroup as x, TauriEvent as xa, ListCheck as xi, hideOthers as xn, Timer as xr, Content as xt, Select as y, isWindows as ya, ListEnd as yi, ReactRemoveScroll as yn, Turtle as yr, getOriginalNameOf as yt, activeGroupIdAtom as z, File as zi, createRovingFocusGroupScope as zn, ShieldCheck as zr, TooltipProvider as zt };
