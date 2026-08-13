import { i as __toESM, t as __commonJSMin } from "./chunk-2rV9d50f.mjs";
import { t as DetailsManager } from "./ClosedProjectDetailsManager-D3W3KvYw.mjs";
import { t as Settings } from "./ClosedProjectSettings-CDenKQSg.mjs";
import { n as require_react, t as require_react_dom } from "./react-dom-I8_g7zx2.mjs";
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __classPrivateFieldGet$1(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/core.js
var _Resource_rid;
/**
* Invoke your custom commands.
*
* This package is also accessible with `window.__TAURI__.core` when [`app.withGlobalTauri`](https://v2.tauri.app/reference/config/#withglobaltauri) in `tauri.conf.json` is set to `true`.
* @module
*/
/**
* A key to be used to implement a special function
* on your types that define how your type should be serialized
* when passing across the IPC.
* @example
* Given a type in Rust that looks like this
* ```rs
* #[derive(serde::Serialize, serde::Deserialize)
* enum UserId {
*   String(String),
*   Number(u32),
* }
* ```
* `UserId::String("id")` would be serialized into `{ String: "id" }`
* and so we need to pass the same structure back to Rust
* ```ts
* import { SERIALIZE_TO_IPC_FN } from "@tauri-apps/api/core"
*
* class UserIdString {
*   id
*   constructor(id) {
*     this.id = id
*   }
*
*   [SERIALIZE_TO_IPC_FN]() {
*     return { String: this.id }
*   }
* }
*
* class UserIdNumber {
*   id
*   constructor(id) {
*     this.id = id
*   }
*
*   [SERIALIZE_TO_IPC_FN]() {
*     return { Number: this.id }
*   }
* }
*
* type UserId = UserIdString | UserIdNumber
* ```
*
*/
var SERIALIZE_TO_IPC_FN = "__TAURI_TO_IPC_KEY__";
/**
* Stores the callback in a known location, and returns an identifier that can be passed to the backend.
* The backend uses the identifier to `eval()` the callback.
*
* @return An unique identifier associated with the callback function.
*
* @since 1.0.0
*/
function transformCallback(callback, once = false) {
	return window.__TAURI_INTERNALS__.transformCallback(callback, once);
}
/**
* Sends a message to the backend.
* @example
* ```typescript
* import { invoke } from '@tauri-apps/api/core';
* await invoke('login', { user: 'tauri', password: 'poiwe3h4r5ip3yrhtew9ty' });
* ```
*
* @param cmd The command name.
* @param args The optional arguments to pass to the command.
* @param options The request options.
* @return A promise resolving or rejecting to the backend response.
*
* @since 1.0.0
*/
async function invoke(cmd, args = {}, options) {
	return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}
/**
* A rust-backed resource stored through `tauri::Manager::resources_table` API.
*
* The resource lives in the main process and does not exist
* in the Javascript world, and thus will not be cleaned up automatically
* except on application exit. If you want to clean it up early, call {@linkcode Resource.close}
*
* @example
* ```typescript
* import { Resource, invoke } from '@tauri-apps/api/core';
* export class DatabaseHandle extends Resource {
*   static async open(path: string): Promise<DatabaseHandle> {
*     const rid: number = await invoke('open_db', { path });
*     return new DatabaseHandle(rid);
*   }
*
*   async execute(sql: string): Promise<void> {
*     await invoke('execute_sql', { rid: this.rid, sql });
*   }
* }
* ```
*/
var Resource = class {
	get rid() {
		return __classPrivateFieldGet$1(this, _Resource_rid, "f");
	}
	constructor(rid) {
		_Resource_rid.set(this, void 0);
		__classPrivateFieldSet(this, _Resource_rid, rid, "f");
	}
	/**
	* Destroys and cleans up this resource from memory.
	* **You should not call any method on this object anymore and should drop any reference to it.**
	*/
	async close() {
		return invoke("plugin:resources|close", { rid: this.rid });
	}
};
_Resource_rid = /* @__PURE__ */ new WeakMap();
function isTauri() {
	return !!(globalThis || window).isTauri;
}
//#endregion
//#region ../packages/data-structures/src/Cache.ts
/**
* 最近最少使用缓存
* 原理：当缓存满时，删除最早添加的缓存
*/
var LruCache = class extends Map {
	capacity;
	constructor(capacity) {
		super();
		this.capacity = capacity;
	}
	set(key, value) {
		if (this.capacity === 0) return this;
		if (super.has(key)) super.delete(key);
		else if (super.size >= this.capacity) {
			const firstKey = super.keys().next().value;
			if (firstKey !== void 0) super.delete(firstKey);
		}
		super.set(key, value);
		return this;
	}
	get(key) {
		const value = super.get(key);
		if (value !== void 0) {
			super.delete(key);
			super.set(key, value);
		}
		return value;
	}
};
/**
* 一旦缓存达到最大容量，则自动删除全部
*/
var MaxSizeCache = class {
	cache = /* @__PURE__ */ new Map();
	maxSize;
	/**
	* 获取当前缓存的容量状态
	* @returns
	*/
	getCapacityStatus() {
		return [this.cache.size, this.maxSize];
	}
	constructor(maxSize) {
		this.maxSize = maxSize;
	}
	get(key) {
		return this.cache.get(key);
	}
	set(key, value) {
		if (this.cache.size >= this.maxSize) this.cache.clear();
		this.cache.set(key, value);
	}
	has(key) {
		return this.cache.has(key);
	}
	clear() {
		this.cache.clear();
	}
};
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
(/* @__PURE__ */ __commonJSMin((() => {
	var Reflect;
	(function(Reflect) {
		(function(factory) {
			var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
			var exporter = makeExporter(Reflect);
			if (typeof root.Reflect !== "undefined") exporter = makeExporter(root.Reflect, exporter);
			factory(exporter, root);
			if (typeof root.Reflect === "undefined") root.Reflect = Reflect;
			function makeExporter(target, previous) {
				return function(key, value) {
					Object.defineProperty(target, key, {
						configurable: true,
						writable: true,
						value
					});
					if (previous) previous(key, value);
				};
			}
			function functionThis() {
				try {
					return Function("return this;")();
				} catch (_) {}
			}
			function indirectEvalThis() {
				try {
					return (0, eval)("(function() { return this; })()");
				} catch (_) {}
			}
			function sloppyModeThis() {
				return functionThis() || indirectEvalThis();
			}
		})(function(exporter, root) {
			var hasOwn = Object.prototype.hasOwnProperty;
			var supportsSymbol = typeof Symbol === "function";
			var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
			var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
			var supportsCreate = typeof Object.create === "function";
			var supportsProto = { __proto__: [] } instanceof Array;
			var downLevel = !supportsCreate && !supportsProto;
			var HashMap = {
				create: supportsCreate ? function() {
					return MakeDictionary(Object.create(null));
				} : supportsProto ? function() {
					return MakeDictionary({ __proto__: null });
				} : function() {
					return MakeDictionary({});
				},
				has: downLevel ? function(map, key) {
					return hasOwn.call(map, key);
				} : function(map, key) {
					return key in map;
				},
				get: downLevel ? function(map, key) {
					return hasOwn.call(map, key) ? map[key] : void 0;
				} : function(map, key) {
					return map[key];
				}
			};
			var functionPrototype = Object.getPrototypeOf(Function);
			var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
			var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
			var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
			var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
			var metadataRegistry = GetOrCreateMetadataRegistry();
			var metadataProvider = CreateMetadataProvider(metadataRegistry);
			/**
			* Applies a set of decorators to a property of a target object.
			* @param decorators An array of decorators.
			* @param target The target object.
			* @param propertyKey (Optional) The property key to decorate.
			* @param attributes (Optional) The property descriptor for the target key.
			* @remarks Decorators are applied in reverse order.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Example = Reflect.decorate(decoratorsArray, Example);
			*
			*     // property (on constructor)
			*     Reflect.decorate(decoratorsArray, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.decorate(decoratorsArray, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Object.defineProperty(Example, "staticMethod",
			*         Reflect.decorate(decoratorsArray, Example, "staticMethod",
			*             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
			*
			*     // method (on prototype)
			*     Object.defineProperty(Example.prototype, "method",
			*         Reflect.decorate(decoratorsArray, Example.prototype, "method",
			*             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
			*
			*/
			function decorate(decorators, target, propertyKey, attributes) {
				if (!IsUndefined(propertyKey)) {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsObject(target)) throw new TypeError();
					if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
					if (IsNull(attributes)) attributes = void 0;
					propertyKey = ToPropertyKey(propertyKey);
					return DecorateProperty(decorators, target, propertyKey, attributes);
				} else {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsConstructor(target)) throw new TypeError();
					return DecorateConstructor(decorators, target);
				}
			}
			exporter("decorate", decorate);
			/**
			* A default metadata decorator factory that can be used on a class, class member, or parameter.
			* @param metadataKey The key for the metadata entry.
			* @param metadataValue The value for the metadata entry.
			* @returns A decorator function.
			* @remarks
			* If `metadataKey` is already defined for the target and target key, the
			* metadataValue for that key will be overwritten.
			* @example
			*
			*     // constructor
			*     @Reflect.metadata(key, value)
			*     class Example {
			*     }
			*
			*     // property (on constructor, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticProperty;
			*     }
			*
			*     // property (on prototype, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         property;
			*     }
			*
			*     // method (on constructor)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticMethod() { }
			*     }
			*
			*     // method (on prototype)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         method() { }
			*     }
			*
			*/
			function metadata(metadataKey, metadataValue) {
				function decorator(target, propertyKey) {
					if (!IsObject(target)) throw new TypeError();
					if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
					OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
				}
				return decorator;
			}
			exporter("metadata", metadata);
			/**
			* Define a unique metadata entry on the target.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param metadataValue A value that contains attached metadata.
			* @param target The target object on which to define metadata.
			* @param propertyKey (Optional) The property key for the target.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Reflect.defineMetadata("custom:annotation", options, Example);
			*
			*     // property (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
			*
			*     // method (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
			*
			*     // decorator factory as metadata-producing annotation.
			*     function MyAnnotation(options): Decorator {
			*         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
			*     }
			*
			*/
			function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
			}
			exporter("defineMetadata", defineMetadata);
			/**
			* Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasMetadata", hasMetadata);
			/**
			* Gets a value indicating whether the target object has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasOwnMetadata", hasOwnMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object or its prototype chain.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetMetadata(metadataKey, target, propertyKey);
			}
			exporter("getMetadata", getMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("getOwnMetadata", getOwnMetadata);
			/**
			* Gets the metadata keys defined on the target object or its prototype chain.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "method");
			*
			*/
			function getMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryMetadataKeys(target, propertyKey);
			}
			exporter("getMetadataKeys", getMetadataKeys);
			/**
			* Gets the unique metadata keys defined on the target object.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
			*
			*/
			function getOwnMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryOwnMetadataKeys(target, propertyKey);
			}
			exporter("getOwnMetadataKeys", getOwnMetadataKeys);
			/**
			* Deletes the metadata entry from the target object with the provided key.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata entry was found and deleted; otherwise, false.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.deleteMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function deleteMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				var provider = GetMetadataProvider(target, propertyKey, false);
				if (IsUndefined(provider)) return false;
				return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
			}
			exporter("deleteMetadata", deleteMetadata);
			function DecorateConstructor(decorators, target) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsConstructor(decorated)) throw new TypeError();
						target = decorated;
					}
				}
				return target;
			}
			function DecorateProperty(decorators, target, propertyKey, descriptor) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target, propertyKey, descriptor);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsObject(decorated)) throw new TypeError();
						descriptor = decorated;
					}
				}
				return descriptor;
			}
			function OrdinaryHasMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return true;
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
				return false;
			}
			function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return false;
				return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
			}
			function OrdinaryGetMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
			}
			function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return;
				return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
			}
			function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
				GetMetadataProvider(O, P, true).OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
			}
			function OrdinaryMetadataKeys(O, P) {
				var ownKeys = OrdinaryOwnMetadataKeys(O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (parent === null) return ownKeys;
				var parentKeys = OrdinaryMetadataKeys(parent, P);
				if (parentKeys.length <= 0) return ownKeys;
				if (ownKeys.length <= 0) return parentKeys;
				var set = new _Set();
				var keys = [];
				for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
					var key = ownKeys_1[_i];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
					var key = parentKeys_1[_a];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				return keys;
			}
			function OrdinaryOwnMetadataKeys(O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (!provider) return [];
				return provider.OrdinaryOwnMetadataKeys(O, P);
			}
			function Type(x) {
				if (x === null) return 1;
				switch (typeof x) {
					case "undefined": return 0;
					case "boolean": return 2;
					case "string": return 3;
					case "symbol": return 4;
					case "number": return 5;
					case "object": return x === null ? 1 : 6;
					default: return 6;
				}
			}
			function IsUndefined(x) {
				return x === void 0;
			}
			function IsNull(x) {
				return x === null;
			}
			function IsSymbol(x) {
				return typeof x === "symbol";
			}
			function IsObject(x) {
				return typeof x === "object" ? x !== null : typeof x === "function";
			}
			function ToPrimitive(input, PreferredType) {
				switch (Type(input)) {
					case 0: return input;
					case 1: return input;
					case 2: return input;
					case 3: return input;
					case 4: return input;
					case 5: return input;
				}
				var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
				var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
				if (exoticToPrim !== void 0) {
					var result = exoticToPrim.call(input, hint);
					if (IsObject(result)) throw new TypeError();
					return result;
				}
				return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
			}
			function OrdinaryToPrimitive(O, hint) {
				if (hint === "string") {
					var toString_1 = O.toString;
					if (IsCallable(toString_1)) {
						var result = toString_1.call(O);
						if (!IsObject(result)) return result;
					}
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
				} else {
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
					var toString_2 = O.toString;
					if (IsCallable(toString_2)) {
						var result = toString_2.call(O);
						if (!IsObject(result)) return result;
					}
				}
				throw new TypeError();
			}
			function ToBoolean(argument) {
				return !!argument;
			}
			function ToString(argument) {
				return "" + argument;
			}
			function ToPropertyKey(argument) {
				var key = ToPrimitive(argument, 3);
				if (IsSymbol(key)) return key;
				return ToString(key);
			}
			function IsArray(argument) {
				return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
			}
			function IsCallable(argument) {
				return typeof argument === "function";
			}
			function IsConstructor(argument) {
				return typeof argument === "function";
			}
			function IsPropertyKey(argument) {
				switch (Type(argument)) {
					case 3: return true;
					case 4: return true;
					default: return false;
				}
			}
			function SameValueZero(x, y) {
				return x === y || x !== x && y !== y;
			}
			function GetMethod(V, P) {
				var func = V[P];
				if (func === void 0 || func === null) return void 0;
				if (!IsCallable(func)) throw new TypeError();
				return func;
			}
			function GetIterator(obj) {
				var method = GetMethod(obj, iteratorSymbol);
				if (!IsCallable(method)) throw new TypeError();
				var iterator = method.call(obj);
				if (!IsObject(iterator)) throw new TypeError();
				return iterator;
			}
			function IteratorValue(iterResult) {
				return iterResult.value;
			}
			function IteratorStep(iterator) {
				var result = iterator.next();
				return result.done ? false : result;
			}
			function IteratorClose(iterator) {
				var f = iterator["return"];
				if (f) f.call(iterator);
			}
			function OrdinaryGetPrototypeOf(O) {
				var proto = Object.getPrototypeOf(O);
				if (typeof O !== "function" || O === functionPrototype) return proto;
				if (proto !== functionPrototype) return proto;
				var prototype = O.prototype;
				var prototypeProto = prototype && Object.getPrototypeOf(prototype);
				if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
				var constructor = prototypeProto.constructor;
				if (typeof constructor !== "function") return proto;
				if (constructor === O) return proto;
				return constructor;
			}
			/**
			* Creates a registry used to allow multiple `reflect-metadata` providers.
			*/
			function CreateMetadataRegistry() {
				var fallback;
				if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") fallback = CreateFallbackProvider(root.Reflect);
				var first;
				var second;
				var rest;
				var targetProviderMap = new _WeakMap();
				var registry = {
					registerProvider,
					getProvider,
					setProvider
				};
				return registry;
				function registerProvider(provider) {
					if (!Object.isExtensible(registry)) throw new Error("Cannot add provider to a frozen registry.");
					switch (true) {
						case fallback === provider: break;
						case IsUndefined(first):
							first = provider;
							break;
						case first === provider: break;
						case IsUndefined(second):
							second = provider;
							break;
						case second === provider: break;
						default:
							if (rest === void 0) rest = new _Set();
							rest.add(provider);
							break;
					}
				}
				function getProviderNoCache(O, P) {
					if (!IsUndefined(first)) {
						if (first.isProviderFor(O, P)) return first;
						if (!IsUndefined(second)) {
							if (second.isProviderFor(O, P)) return first;
							if (!IsUndefined(rest)) {
								var iterator = GetIterator(rest);
								while (true) {
									var next = IteratorStep(iterator);
									if (!next) return;
									var provider = IteratorValue(next);
									if (provider.isProviderFor(O, P)) {
										IteratorClose(iterator);
										return provider;
									}
								}
							}
						}
					}
					if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) return fallback;
				}
				function getProvider(O, P) {
					var providerMap = targetProviderMap.get(O);
					var provider;
					if (!IsUndefined(providerMap)) provider = providerMap.get(P);
					if (!IsUndefined(provider)) return provider;
					provider = getProviderNoCache(O, P);
					if (!IsUndefined(provider)) {
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return provider;
				}
				function hasProvider(provider) {
					if (IsUndefined(provider)) throw new TypeError();
					return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
				}
				function setProvider(O, P, provider) {
					if (!hasProvider(provider)) throw new Error("Metadata provider not registered.");
					var existingProvider = getProvider(O, P);
					if (existingProvider !== provider) {
						if (!IsUndefined(existingProvider)) return false;
						var providerMap = targetProviderMap.get(O);
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return true;
				}
			}
			/**
			* Gets or creates the shared registry of metadata providers.
			*/
			function GetOrCreateMetadataRegistry() {
				var metadataRegistry;
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) metadataRegistry = root.Reflect[registrySymbol];
				if (IsUndefined(metadataRegistry)) metadataRegistry = CreateMetadataRegistry();
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) Object.defineProperty(root.Reflect, registrySymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: metadataRegistry
				});
				return metadataRegistry;
			}
			function CreateMetadataProvider(registry) {
				var metadata = new _WeakMap();
				var provider = {
					isProviderFor: function(O, P) {
						var targetMetadata = metadata.get(O);
						if (IsUndefined(targetMetadata)) return false;
						return targetMetadata.has(P);
					},
					OrdinaryDefineOwnMetadata,
					OrdinaryHasOwnMetadata,
					OrdinaryGetOwnMetadata,
					OrdinaryOwnMetadataKeys,
					OrdinaryDeleteMetadata
				};
				metadataRegistry.registerProvider(provider);
				return provider;
				function GetOrCreateMetadataMap(O, P, Create) {
					var targetMetadata = metadata.get(O);
					var createdTargetMetadata = false;
					if (IsUndefined(targetMetadata)) {
						if (!Create) return void 0;
						targetMetadata = new _Map();
						metadata.set(O, targetMetadata);
						createdTargetMetadata = true;
					}
					var metadataMap = targetMetadata.get(P);
					if (IsUndefined(metadataMap)) {
						if (!Create) return void 0;
						metadataMap = new _Map();
						targetMetadata.set(P, metadataMap);
						if (!registry.setProvider(O, P, provider)) {
							targetMetadata.delete(P);
							if (createdTargetMetadata) metadata.delete(O);
							throw new Error("Wrong provider for target.");
						}
					}
					return metadataMap;
				}
				function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					return ToBoolean(metadataMap.has(MetadataKey));
				}
				function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return void 0;
					return metadataMap.get(MetadataKey);
				}
				function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
					GetOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
				}
				function OrdinaryOwnMetadataKeys(O, P) {
					var keys = [];
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return keys;
					var iterator = GetIterator(metadataMap.keys());
					var k = 0;
					while (true) {
						var next = IteratorStep(iterator);
						if (!next) {
							keys.length = k;
							return keys;
						}
						var nextValue = IteratorValue(next);
						try {
							keys[k] = nextValue;
						} catch (e) {
							try {
								IteratorClose(iterator);
							} finally {
								throw e;
							}
						}
						k++;
					}
				}
				function OrdinaryDeleteMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					if (!metadataMap.delete(MetadataKey)) return false;
					if (metadataMap.size === 0) {
						var targetMetadata = metadata.get(O);
						if (!IsUndefined(targetMetadata)) {
							targetMetadata.delete(P);
							if (targetMetadata.size === 0) metadata.delete(targetMetadata);
						}
					}
					return true;
				}
			}
			function CreateFallbackProvider(reflect) {
				var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
				var metadataOwner = new _WeakMap();
				return {
					isProviderFor: function(O, P) {
						var metadataPropertySet = metadataOwner.get(O);
						if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) return true;
						if (getOwnMetadataKeys(O, P).length) {
							if (IsUndefined(metadataPropertySet)) {
								metadataPropertySet = new _Set();
								metadataOwner.set(O, metadataPropertySet);
							}
							metadataPropertySet.add(P);
							return true;
						}
						return false;
					},
					OrdinaryDefineOwnMetadata: defineMetadata,
					OrdinaryHasOwnMetadata: hasOwnMetadata,
					OrdinaryGetOwnMetadata: getOwnMetadata,
					OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
					OrdinaryDeleteMetadata: deleteMetadata
				};
			}
			/**
			* Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
			* then this module's metadata provider is assigned to the object.
			*/
			function GetMetadataProvider(O, P, Create) {
				var registeredProvider = metadataRegistry.getProvider(O, P);
				if (!IsUndefined(registeredProvider)) return registeredProvider;
				if (Create) {
					if (metadataRegistry.setProvider(O, P, metadataProvider)) return metadataProvider;
					throw new Error("Illegal state.");
				}
			}
			function CreateMapPolyfill() {
				var cacheSentinel = {};
				var arraySentinel = [];
				var MapIterator = function() {
					function MapIterator(keys, values, selector) {
						this._index = 0;
						this._keys = keys;
						this._values = values;
						this._selector = selector;
					}
					MapIterator.prototype["@@iterator"] = function() {
						return this;
					};
					MapIterator.prototype[iteratorSymbol] = function() {
						return this;
					};
					MapIterator.prototype.next = function() {
						var index = this._index;
						if (index >= 0 && index < this._keys.length) {
							var result = this._selector(this._keys[index], this._values[index]);
							if (index + 1 >= this._keys.length) {
								this._index = -1;
								this._keys = arraySentinel;
								this._values = arraySentinel;
							} else this._index++;
							return {
								value: result,
								done: false
							};
						}
						return {
							value: void 0,
							done: true
						};
					};
					MapIterator.prototype.throw = function(error) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						throw error;
					};
					MapIterator.prototype.return = function(value) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						return {
							value,
							done: true
						};
					};
					return MapIterator;
				}();
				return function() {
					function Map() {
						this._keys = [];
						this._values = [];
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					}
					Object.defineProperty(Map.prototype, "size", {
						get: function() {
							return this._keys.length;
						},
						enumerable: true,
						configurable: true
					});
					Map.prototype.has = function(key) {
						return this._find(key, false) >= 0;
					};
					Map.prototype.get = function(key) {
						var index = this._find(key, false);
						return index >= 0 ? this._values[index] : void 0;
					};
					Map.prototype.set = function(key, value) {
						var index = this._find(key, true);
						this._values[index] = value;
						return this;
					};
					Map.prototype.delete = function(key) {
						var index = this._find(key, false);
						if (index >= 0) {
							var size = this._keys.length;
							for (var i = index + 1; i < size; i++) {
								this._keys[i - 1] = this._keys[i];
								this._values[i - 1] = this._values[i];
							}
							this._keys.length--;
							this._values.length--;
							if (SameValueZero(key, this._cacheKey)) {
								this._cacheKey = cacheSentinel;
								this._cacheIndex = -2;
							}
							return true;
						}
						return false;
					};
					Map.prototype.clear = function() {
						this._keys.length = 0;
						this._values.length = 0;
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					};
					Map.prototype.keys = function() {
						return new MapIterator(this._keys, this._values, getKey);
					};
					Map.prototype.values = function() {
						return new MapIterator(this._keys, this._values, getValue);
					};
					Map.prototype.entries = function() {
						return new MapIterator(this._keys, this._values, getEntry);
					};
					Map.prototype["@@iterator"] = function() {
						return this.entries();
					};
					Map.prototype[iteratorSymbol] = function() {
						return this.entries();
					};
					Map.prototype._find = function(key, insert) {
						if (!SameValueZero(this._cacheKey, key)) {
							this._cacheIndex = -1;
							for (var i = 0; i < this._keys.length; i++) if (SameValueZero(this._keys[i], key)) {
								this._cacheIndex = i;
								break;
							}
						}
						if (this._cacheIndex < 0 && insert) {
							this._cacheIndex = this._keys.length;
							this._keys.push(key);
							this._values.push(void 0);
						}
						return this._cacheIndex;
					};
					return Map;
				}();
				function getKey(key, _) {
					return key;
				}
				function getValue(_, value) {
					return value;
				}
				function getEntry(key, value) {
					return [key, value];
				}
			}
			function CreateSetPolyfill() {
				return function() {
					function Set() {
						this._map = new _Map();
					}
					Object.defineProperty(Set.prototype, "size", {
						get: function() {
							return this._map.size;
						},
						enumerable: true,
						configurable: true
					});
					Set.prototype.has = function(value) {
						return this._map.has(value);
					};
					Set.prototype.add = function(value) {
						return this._map.set(value, value), this;
					};
					Set.prototype.delete = function(value) {
						return this._map.delete(value);
					};
					Set.prototype.clear = function() {
						this._map.clear();
					};
					Set.prototype.keys = function() {
						return this._map.keys();
					};
					Set.prototype.values = function() {
						return this._map.keys();
					};
					Set.prototype.entries = function() {
						return this._map.entries();
					};
					Set.prototype["@@iterator"] = function() {
						return this.keys();
					};
					Set.prototype[iteratorSymbol] = function() {
						return this.keys();
					};
					return Set;
				}();
			}
			function CreateWeakMapPolyfill() {
				var UUID_SIZE = 16;
				var keys = HashMap.create();
				var rootKey = CreateUniqueKey();
				return function() {
					function WeakMap() {
						this._key = CreateUniqueKey();
					}
					WeakMap.prototype.has = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.has(table, this._key) : false;
					};
					WeakMap.prototype.get = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.get(table, this._key) : void 0;
					};
					WeakMap.prototype.set = function(target, value) {
						var table = GetOrCreateWeakMapTable(target, true);
						table[this._key] = value;
						return this;
					};
					WeakMap.prototype.delete = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? delete table[this._key] : false;
					};
					WeakMap.prototype.clear = function() {
						this._key = CreateUniqueKey();
					};
					return WeakMap;
				}();
				function CreateUniqueKey() {
					var key;
					do
						key = "@@WeakMap@@" + CreateUUID();
					while (HashMap.has(keys, key));
					keys[key] = true;
					return key;
				}
				function GetOrCreateWeakMapTable(target, create) {
					if (!hasOwn.call(target, rootKey)) {
						if (!create) return void 0;
						Object.defineProperty(target, rootKey, { value: HashMap.create() });
					}
					return target[rootKey];
				}
				function FillRandomBytes(buffer, size) {
					for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 255 | 0;
					return buffer;
				}
				function GenRandomBytes(size) {
					if (typeof Uint8Array === "function") {
						var array = new Uint8Array(size);
						if (typeof crypto !== "undefined") crypto.getRandomValues(array);
						else if (typeof msCrypto !== "undefined") msCrypto.getRandomValues(array);
						else FillRandomBytes(array, size);
						return array;
					}
					return FillRandomBytes(new Array(size), size);
				}
				function CreateUUID() {
					var data = GenRandomBytes(UUID_SIZE);
					data[6] = data[6] & 79 | 64;
					data[8] = data[8] & 191 | 128;
					var result = "";
					for (var offset = 0; offset < UUID_SIZE; ++offset) {
						var byte = data[offset];
						if (offset === 4 || offset === 6 || offset === 8) result += "-";
						if (byte < 16) result += "0";
						result += byte.toString(16).toLowerCase();
					}
					return result;
				}
			}
			function MakeDictionary(obj) {
				obj.__ = void 0;
				delete obj.__;
				return obj;
			}
		});
	})(Reflect || (Reflect = {}));
})))();
var getOriginalNameOf = (class_) => class_.className ?? class_.name;
/**
* 序列化装饰器
*/
var serializableSymbol = Symbol("serializable");
var lastSerializableIndexSymbol = Symbol("lastSerializableIndex");
var serializable = (target, key) => {
	if (!Reflect.hasMetadata(lastSerializableIndexSymbol, target)) Reflect.defineMetadata(lastSerializableIndexSymbol, 0, target);
	Reflect.defineMetadata(serializableSymbol, Reflect.getMetadata(lastSerializableIndexSymbol, target), target, key);
	Reflect.defineMetadata(lastSerializableIndexSymbol, Reflect.getMetadata(lastSerializableIndexSymbol, target) + 1, target);
	classes.set(getOriginalNameOf(target.constructor), target.constructor);
};
var passExtraAtArg1Symbol = Symbol("passExtraAtArg1");
var passExtraAtArg1 = Reflect.metadata(passExtraAtArg1Symbol, true);
var passExtraAtLastArgSymbol = Symbol("passExtraAtLastArg");
Reflect.metadata(passExtraAtLastArgSymbol, true);
var passObjectSymbol = Symbol("passObject");
var passObject = Reflect.metadata(passObjectSymbol, true);
var idSymbol = Symbol("id");
var id = Reflect.metadata(idSymbol, true);
var classes = /* @__PURE__ */ new Map();
/**
* 将任意类型对象转换为 序列化形式，不包含函数
*/
function serialize(originalObj) {
	const id2path = /* @__PURE__ */ new Map();
	function _serialize(obj, path) {
		if (obj instanceof Array) return obj.map((v, i) => _serialize(v, `${path}/${i}`));
		else if (typeof obj === "string") return obj;
		else if (typeof obj === "number") if (obj % 1 === 0) return obj;
		else return parseFloat(obj.toFixed(2));
		else if (typeof obj === "boolean") return obj;
		else if (obj === null) return null;
		else if (typeof obj === "object") {
			const className = getOriginalNameOf(obj.constructor);
			if (!className) throw TypeError("[Serializer] Cannot determine serialized type for", obj);
			if (className === "Object") return obj;
			const result = { _: className };
			let id;
			for (const key in obj) {
				if (!Reflect.hasMetadata(serializableSymbol, obj, key)) continue;
				if (Reflect.hasMetadata(idSymbol, obj, key)) id = obj[key];
				result[key] = _serialize(obj[key], `${path}/${key}`);
			}
			if (id) if (id2path.has(id)) return { $: id2path.get(id) };
			else id2path.set(id, path);
			return result;
		} else if (typeof obj === "undefined") return;
		else throw TypeError(`[Serializer] Unsupported value type ${obj}`);
	}
	return _serialize(originalObj, "");
}
function deserialize(originalJson, extra) {
	const cache = /* @__PURE__ */ new WeakMap();
	function _deserialize(json, extra) {
		if (json instanceof Array) {
			if (cache.has(json)) return cache.get(json);
			cache.set(json, json);
			for (let i = 0; i < json.length; i++) json[i] = _deserialize(json[i], extra);
			return json;
		}
		if (!isSerializedObject(json)) return json;
		if (cache.has(json)) return cache.get(json);
		const className = json._;
		const class_ = classes.get(className);
		if (!class_) throw TypeError(`[Serializer] Cannot find class ${className} of ${JSON.stringify(json)}`);
		for (const key in json) {
			if (key === "_") continue;
			const value = json[key];
			if (isSerializedObject(value) || value instanceof Array) json[key] = _deserialize(value, extra);
		}
		const args = [];
		if (Reflect.hasMetadata(passExtraAtArg1Symbol, class_)) args.push(extra);
		if (Reflect.hasMetadata(passObjectSymbol, class_)) args.push(json);
		else for (const key in json) {
			if (key === "_") continue;
			args.push(json[key]);
		}
		if (Reflect.hasMetadata(passExtraAtLastArgSymbol, class_)) args.push(extra);
		const instance = new class_(...args);
		cache.set(json, instance);
		return instance;
	}
	return _deserialize(replaceRef(originalJson), extra);
}
function isSerializedObject(obj) {
	return typeof obj === "object" && obj !== null && "_" in obj;
}
function getByPath(obj, path) {
	const segments = path.split("/").filter((s) => s !== "");
	let result = obj;
	for (const segment of segments) {
		if (typeof result !== "object" || result === null) throw TypeError(`[Serializer] Cannot find object at path ${path}`);
		result = result[segment];
	}
	return result;
}
/**
* 将$替换为实际值
* @param obj 要替换的对象
* @param refPathObj obj参数中$的路径所在的对象
*/
function replaceRef(obj, refPathObj = obj) {
	if (obj instanceof Array) return obj.map((v) => replaceRef(v, refPathObj));
	if (typeof obj === "object" && obj !== null) {
		if ("$" in obj) {
			const path = obj.$;
			return getByPath(refPathObj, path);
		}
		for (const key in obj) obj[key] = replaceRef(obj[key], refPathObj);
	}
	return obj;
}
//#endregion
//#region \0@oxc-project+runtime@0.133.0/helpers/esm/decorateMetadata.js
function __decorateMetadata(k, v) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
//#endregion
//#region \0@oxc-project+runtime@0.133.0/helpers/esm/decorate.js
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
//#endregion
//#region ../packages/data-structures/src/Color.ts
/**
* 颜色对象
* 不透明度最大值为1，最小值为0
*/
var Color = class Color {
	static White = new Color(255, 255, 255);
	static Black = new Color(0, 0, 0);
	static Gray = new Color(128, 128, 128);
	static Red = new Color(255, 0, 0);
	static Green = new Color(0, 255, 0);
	static Blue = new Color(0, 0, 255);
	static Yellow = new Color(255, 255, 0);
	static Cyan = new Color(0, 255, 255);
	static Magenta = new Color(255, 0, 255);
	static Transparent = new Color(0, 0, 0, 0);
	r;
	g;
	b;
	a;
	constructor(r, g, b, a = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}
	toHexString() {
		return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}${this.a.toString(16).padStart(2, "0")}`;
	}
	toHexStringWithoutAlpha() {
		return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`;
	}
	clone() {
		return new Color(this.r, this.g, this.b, this.a);
	}
	/**
	* 将字符串十六进制转成颜色对象，注意带井号
	* @param hex
	* @returns
	*/
	static fromHex(hex) {
		hex = hex.replace("#", "");
		hex = hex.toUpperCase();
		if (hex.length === 6) return new Color(parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16));
		else return new Color(parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), parseInt(hex.slice(6, 8), 16));
	}
	static fromCss(color) {
		if (color === "transparent") return this.Transparent;
		if (/^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color)) {
			let hex = color.slice(1);
			if (hex.length <= 4) hex = hex.replace(/(.)/g, "$1$1");
			const value = parseInt(hex, 16);
			switch (hex.length) {
				case 3: return new Color((value >> 8 & 15) * 17, (value >> 4 & 15) * 17, (value & 15) * 17, 1);
				case 4: return new Color((value >> 12 & 15) * 17, (value >> 8 & 15) * 17, (value >> 4 & 15) * 17, (value & 15) / 15);
				case 6: return new Color(value >> 16 & 255, value >> 8 & 255, value & 255, 1);
				case 8: return new Color(value >> 24 & 255, value >> 16 & 255, value >> 8 & 255, (value & 255) / 255);
			}
		}
		const rgbMatch = color.match(/^rgba?\((.*)\)$/i);
		if (rgbMatch) {
			const parts = rgbMatch[1].split(/[,/]\s*/).map((p) => p.trim());
			if (parts.length >= 3) {
				const parseValue = (v, max) => {
					if (v.endsWith("%")) return Math.round(parseFloat(v) * max / 100);
					return parseFloat(v);
				};
				return new Color(parseValue(parts[0], 255), parseValue(parts[1], 255), parseValue(parts[2], 255), parts[3] ? parseFloat(parts[3]) : 1);
			}
		}
		const oklchMatch = color.match(/^oklch\((.*)\)$/i);
		if (oklchMatch) {
			const parts = oklchMatch[1].split(/[,/]\s*|\s+/).map((p) => p.trim()).filter((p) => p !== "");
			if (parts.length >= 3) {
				const parseHue = (hStr) => {
					const hueMatch = hStr.match(/^(-?\d*\.?\d+)(deg|rad|turn)?$/i);
					if (!hueMatch) return 0;
					const value = parseFloat(hueMatch[1]);
					switch (hueMatch[2] ? hueMatch[2].toLowerCase() : "deg") {
						case "deg": return value;
						case "rad": return value * 180 / Math.PI;
						case "turn": return value * 360;
						default: return value;
					}
				};
				const parsePercentOrNumber = (v, max = 1) => {
					if (v.endsWith("%")) return Math.min(max, Math.max(0, parseFloat(v) / 100));
					return Math.min(max, Math.max(0, parseFloat(v)));
				};
				const l = parsePercentOrNumber(parts[0]);
				const c = parsePercentOrNumber(parts[1], Infinity);
				const h = parseHue(parts[2]);
				const alpha = parts.length >= 4 ? parsePercentOrNumber(parts[3]) : 1;
				const hRad = (h % 360 + 360) % 360 * Math.PI / 180;
				const aVal = c * Math.cos(hRad);
				const bVal = c * Math.sin(hRad);
				const lLMS = l + .3963377774 * aVal + .2158037573 * bVal;
				const mLMS = l - .1055613458 * aVal - .0638541728 * bVal;
				const sLMS = l - .0894841775 * aVal - 1.291485548 * bVal;
				const lNonlinear = Math.pow(lLMS, 3);
				const mNonlinear = Math.pow(mLMS, 3);
				const sNonlinear = Math.pow(sLMS, 3);
				const x = 1.2270138511 * lNonlinear - .5577999807 * mNonlinear + .281256149 * sNonlinear;
				const y = -.0405801784 * lNonlinear + 1.1122568696 * mNonlinear - .0716766787 * sNonlinear;
				const z = -.0763812845 * lNonlinear - .4214819784 * mNonlinear + 1.5861632204 * sNonlinear;
				const rLinear = x * 3.2404542 + y * -1.5371385 + z * -.4985314;
				const gLinear = x * -.969266 + y * 1.8760108 + z * .041556;
				const bLinear = x * .0556434 + y * -.2040259 + z * 1.0572252;
				const gammaCorrect = (v) => {
					v = Math.max(0, Math.min(1, v));
					return v <= .0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - .055;
				};
				const sr = gammaCorrect(rLinear);
				const sg = gammaCorrect(gLinear);
				const sb = gammaCorrect(bLinear);
				const toByte = (v) => Math.round(Math.min(255, Math.max(0, v * 255)));
				return new Color(toByte(sr), toByte(sg), toByte(sb), alpha);
			}
		}
		return this.Black;
	}
	/**
	* 将此颜色转换为透明色，
	* 和(0, 0, 0, 0)不一样
	* 因为(0, 0, 0, 0)是黑色的透明色，在颜色线性混合的时候会偏黑
	* @returns
	*/
	toTransparent() {
		return new Color(this.r, this.g, this.b, 0);
	}
	/**
	* 和toTransparent完全相反
	* @returns
	*/
	toSolid() {
		return new Color(this.r, this.g, this.b, 1);
	}
	toNewAlpha(a) {
		return new Color(this.r, this.g, this.b, a);
	}
	/**
	* 判断自己是否和另一个颜色相等
	*/
	equals(color) {
		return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
	}
	toArray() {
		return [
			this.r,
			this.g,
			this.b,
			this.a
		];
	}
	static getRandom() {
		return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
	}
	/**
	* 降低颜色的饱和度
	* @param amount 0 到 1 之间的值，表示去饱和的程度
	*/
	desaturate(amount) {
		const grayScale = Math.round(this.r * .299 + this.g * .587 + this.b * .114);
		return new Color(Math.round(grayScale + (this.r - grayScale) * (1 - amount)), Math.round(grayScale + (this.g - grayScale) * (1 - amount)), Math.round(grayScale + (this.b - grayScale) * (1 - amount)), this.a);
	}
	/**
	* 将颜色转换为冷色调且低饱和度的版本
	* 注意：此方法是基于简单假设实现的，并不能精确地转换颜色空间。
	*/
	toColdLowSaturation() {
		const hsl = this.rgbToHsl();
		hsl.h = Math.max(180, hsl.h);
		hsl.s = Math.min(hsl.s * .5, 1);
		const rgb = this.hslToRgb(hsl);
		return new Color(rgb.r, rgb.g, rgb.b, this.a).desaturate(.3);
	}
	rgbToHsl() {
		const r = this.r / 255;
		const g = this.g / 255;
		const b = this.b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (max + min) / 2;
		if (max !== min) {
			const d = max - min;
			s = l > .5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return {
			h: h * 360,
			s,
			l
		};
	}
	/**
	* 计算颜色的色相
	* @param color
	* @returns 色相值（0-360）
	*/
	static getHue(color) {
		const r = color.r / 255;
		const g = color.g / 255;
		const b = color.b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let hue = 0;
		if (max === min) hue = 0;
		else {
			const diff = max - min;
			if (max === r) hue = (g - b) / diff % 6;
			else if (max === g) hue = (b - r) / diff + 2;
			else if (max === b) hue = (r - g) / diff + 4;
			hue = Math.round(hue * 60);
			if (hue < 0) hue += 360;
		}
		return hue;
	}
	hslToRgb(hsl) {
		let r, g, b;
		const h = hsl.h / 360;
		const s = hsl.s;
		const l = hsl.l;
		if (s === 0) r = g = b = l;
		else {
			const q = l < .5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = this.hueToRgb(p, q, h + 1 / 3);
			g = this.hueToRgb(p, q, h);
			b = this.hueToRgb(p, q, h - 1 / 3);
		}
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		};
	}
	hueToRgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}
	/**
	* 改变色相
	* @param deHue 色相差值(角度)，正数表示顺时针，负数表示逆时针
	*/
	changeHue(deHue) {
		const hsl = this.rgbToHsl();
		hsl.h = ((hsl.h + deHue) % 360 + 360) % 360;
		const { r, g, b } = this.hslToRgb(hsl);
		return new Color(r, g, b, this.a);
	}
};
__decorate([serializable, __decorateMetadata("design:type", Number)], Color.prototype, "r", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], Color.prototype, "g", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], Color.prototype, "b", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], Color.prototype, "a", void 0);
function colorInvert(color) {
	/**
	* 计算背景色的亮度 更精确的人眼感知亮度公式
	* 0.2126 * R + 0.7152 * G + 0.0722 * B，
	* 如果亮度较高，则使用黑色文字，
	* 如果亮度较低，则使用白色文字。
	* 这种方法能够确保无论背景色如何变化，文字都能保持足够的对比度。
	*/
	const r = color.r;
	const g = color.g;
	const b = color.b;
	if (.2126 * r + .7152 * g + .0722 * b > 128) return Color.Black;
	else return Color.White;
}
/**
* 获取两个颜色的中间过渡色（线性混合）
* 根据两个颜色，以及一个 0~1 的权重，返回一个新的颜色
* 0 权重返回 color1，1 权重返回 color2
* @param color1 颜色1
* @param color2 颜色2
*/
function mixColors(color1, color2, weight) {
	const r = Math.round(color1.r * (1 - weight) + color2.r * weight);
	const g = Math.round(color1.g * (1 - weight) + color2.g * weight);
	const b = Math.round(color1.b * (1 - weight) + color2.b * weight);
	const a = color1.a * (1 - weight) + color2.a * weight;
	return new Color(r, g, b, Math.round(a * 100) / 100);
}
/**
* 获取一个颜色列表的平均颜色
*/
function averageColors(colors) {
	const r = Math.round(colors.reduce((acc, cur) => acc + cur.r, 0) / colors.length);
	const g = Math.round(colors.reduce((acc, cur) => acc + cur.g, 0) / colors.length);
	const b = Math.round(colors.reduce((acc, cur) => acc + cur.b, 0) / colors.length);
	let a = 0;
	for (const color of colors) a += color.a;
	a /= colors.length;
	console.log(a);
	return new Color(r, g, b, a);
}
//#endregion
//#region ../packages/data-structures/src/Queue.ts
var Queue = class {
	items = [];
	enqueue(element) {
		this.items.push(element);
	}
	dequeue() {
		if (this.isEmpty()) return;
		return this.items.shift();
	}
	get arrayList() {
		return this.items;
	}
	peek() {
		if (this.isEmpty()) return;
		return this.items[0];
	}
	tail() {
		if (this.isEmpty()) return;
		return this.items[this.items.length - 1];
	}
	clear() {
		this.items = [];
	}
	isEmpty() {
		return this.items.length === 0;
	}
	get length() {
		return this.items.length;
	}
	size() {
		return this.items.length;
	}
	toString() {
		return this.items.toString();
	}
};
//#endregion
//#region ../packages/data-structures/src/LimitLengthQueue.ts
var LimitLengthQueue = class extends Queue {
	limitLength;
	constructor(limitLength) {
		if (limitLength <= 0) throw new Error("限制长度必须是正整数");
		super();
		this.limitLength = limitLength;
	}
	enqueue(element) {
		if (this.items.length === this.limitLength) this.dequeue();
		this.items.push(element);
	}
	/**
	* 获取多个队尾元素，如果长度不足则返回数组长度不足
	* @param multi
	*/
	multiGetTail(multi) {
		if (multi >= this.items.length) return [...this.items];
		else {
			const result = [];
			for (let i = this.items.length - multi; i < this.items.length; i++) result.push(this.items[i]);
			return result;
		}
	}
};
//#endregion
//#region ../packages/data-structures/src/MonoStack.ts
/**
* 单调栈
* 单调递增
*/
var MonoStack = class {
	stack = [];
	constructor() {
		this.stack = [];
	}
	get length() {
		return this.stack.length;
	}
	push(item, level) {
		const stackItem = {
			item,
			level
		};
		while (this.stack.length > 0 && this.stack[this.stack.length - 1].level >= level) this.stack.pop();
		this.stack.push(stackItem);
	}
	pop() {
		const stackItem = this.stack.pop();
		return stackItem ? stackItem.item : void 0;
	}
	peek() {
		const stackItem = this.stack[this.stack.length - 1];
		return stackItem ? stackItem.item : void 0;
	}
	/**
	* 不安全的获取栈顶元素
	* 如果栈为空，则会抛出异常
	*/
	unsafePeek() {
		return this.stack[this.stack.length - 1].item;
	}
	get(index) {
		const stackItem = this.stack[index];
		return stackItem ? stackItem.item : void 0;
	}
	unsafeGet(index) {
		return this.stack[index].item;
	}
	isEmpty() {
		return this.stack.length === 0;
	}
};
//#endregion
//#region ../packages/data-structures/src/ProgressNumber.ts
/**
* 进度条数字类
* 可用于 血量、等等的进度条使用场景
*/
var ProgressNumber = class ProgressNumber {
	curValue;
	maxValue;
	/**
	*
	* @param curValue 当前的值
	* @param maxValue 进度条的最大值
	*/
	constructor(curValue, maxValue) {
		this.curValue = curValue;
		this.maxValue = maxValue;
	}
	/**
	* 返回百分比，0-100
	*/
	get percentage() {
		return this.curValue / this.maxValue * 100;
	}
	/**
	* 返回比率，0-1
	*/
	get rate() {
		return this.curValue / this.maxValue;
	}
	get isFull() {
		return this.curValue == this.maxValue;
	}
	get isEmpty() {
		return this.curValue <= 0;
	}
	setEmpty() {
		this.curValue = 0;
	}
	setFull() {
		this.curValue = this.maxValue;
	}
	add(value) {
		this.curValue += value;
		if (this.curValue > this.maxValue) this.curValue = this.maxValue;
	}
	clone() {
		return new ProgressNumber(this.curValue, this.maxValue);
	}
	subtract(value) {
		this.curValue -= value;
		if (this.curValue < 0) this.curValue = 0;
	}
};
//#endregion
//#region ../packages/data-structures/src/Vector.ts
var Vector = class Vector {
	x;
	y;
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	static getZero() {
		return new Vector(0, 0);
	}
	isZero() {
		return this.x === 0 && this.y === 0;
	}
	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	subtract(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}
	multiply(scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	}
	divide(scalar) {
		if (scalar === 0) return Vector.getZero();
		return new Vector(this.x / scalar, this.y / scalar);
	}
	/**
	* 获得向量的模长
	* @returns
	*/
	magnitude() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	/**
	* 获得向量的单位向量
	* 如果向量的模长为0，则返回(0,0)
	* @returns
	*/
	normalize() {
		const mag = this.magnitude();
		const x = this.x / mag;
		const y = this.y / mag;
		if (Number.isNaN(x) || Number.isNaN(y)) return Vector.getZero();
		return new Vector(x, y);
	}
	dot(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
	/**
	* 获得一个与该向量垂直的单位向量
	*/
	getPerpendicular() {
		return new Vector(-this.y, this.x).normalize();
	}
	/**
	* 将自身向量按顺时针旋转一定角度，获得一个新的向量
	* @param angle 单位：弧度
	*/
	rotate(angle) {
		return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
	}
	/**
	* 将自身向量按逆时针旋转一定角度，获得一个新的向量
	* @param degrees 单位：度
	*/
	rotateDegrees(degrees) {
		return this.rotate(degrees * (Math.PI / 180));
	}
	/**
	* 计算自己向量与另一个向量之间的角度
	* @param vector
	* @returns 单位：弧度
	*/
	angle(vector) {
		const dot = this.dot(vector);
		const mag1 = this.magnitude();
		const mag2 = vector.magnitude();
		return Math.acos(dot / (mag1 * mag2));
	}
	/**
	* 计算自己向量与另一个向量之间的夹角
	* @param vector
	* @returns 单位：度
	*/
	angleTo(vector) {
		return this.angle(vector) * 180 / Math.PI;
	}
	/**
	* 计算自己向量与另一个向量之间的夹角，但带正负号
	* 如果另一个向量相对自己是顺时针，则返回正值，否则返回负值
	* @param vector
	* @returns 单位：度
	*/
	angleToSigned(vector) {
		const angle = this.angleTo(vector);
		if (this.cross(vector) > 0) return angle;
		else return -angle;
	}
	/**
	* 从自己这个向量所指向的点到另一个向量所指向的点的距离
	* @param vector
	* @returns
	*/
	distance(vector) {
		if (vector === null || vector === void 0) throw new Error("vector is null or undefined");
		const dx = this.x - vector.x;
		const dy = this.y - vector.y;
		return Math.sqrt(dx ** 2 + dy ** 2);
	}
	cross(other) {
		return this.x * other.y - this.y * other.x;
	}
	/**
	* 向量之间的分量分别相乘
	* @param other
	*/
	componentMultiply(other) {
		return new Vector(this.x * other.x, this.y * other.y);
	}
	/**
	* 根据角度构造一个单位向量
	* @param angle 单位：弧度
	*/
	static fromAngle(angle) {
		return new Vector(Math.cos(angle), Math.sin(angle));
	}
	/**
	* 根据角度构造一个单位向量
	* @param degrees 单位：度
	*/
	static fromDegrees(degrees) {
		return Vector.fromAngle(degrees * (Math.PI / 180));
	}
	/**
	* 计算两个点之间的向量，让两个点构成一个向量
	* @param p1 起始点
	* @param p2 终止点
	*/
	static fromTwoPoints(p1, p2) {
		return new Vector(p2.x - p1.x, p2.y - p1.y);
	}
	/**
	* 将自己方向的单位向量分解成一堆向量，就像散弹分裂子弹一样
	* 返回的都是单位向量
	*
	* 根据散弹数量和间隔角度，计算出每个散弹的方向单位向量
	* 做法是先依次生成 bulletCount 个向量，每个间隔角度为 bulletIntervalDegrees，顺时针旋转
	* 第一个生成的向量恰好就是攻击方向。
	* 最后再整体 逆时针旋转总角度的一半，得到每个向量最终的方向向量
	*/
	splitVector(splitCount, splitDegrees) {
		let vectors = [];
		const selfNormalized = this.normalize();
		for (let i = 0; i < splitCount; i++) vectors.push(selfNormalized.rotateDegrees(i * splitDegrees));
		const totalOffsetDegrees = (splitCount - 1) * splitDegrees / 2;
		vectors = vectors.map((d) => d.rotateDegrees(-totalOffsetDegrees));
		return vectors;
	}
	/**
	* 计算两个点的中心点
	* @param p1
	* @param p2
	* @returns
	*/
	static fromTwoPointsCenter(p1, p2) {
		return new Vector((p2.x + p1.x) / 2, (p2.y + p1.y) / 2);
	}
	/**
	* 获得两个点的中间连线一点，当rate为0时，返回p1，当rate为1时，返回p2
	* @param p1
	* @param p2
	* @param rate
	*/
	static fromTwoPointsRate(p1, p2, rate) {
		return new Vector(p1.x + (p2.x - p1.x) * rate, p1.y + (p2.y - p1.y) * rate);
	}
	/**
	* 计算两个向量所代表位置的中点
	* @param p1
	* @param p2
	*/
	static average(p1, p2) {
		return new Vector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
	}
	/**
	* 计算多个向量所代表位置的平均点
	* @param vectors 向量数组
	* @returns 平均位置向量
	*/
	static averageMultiple(vectors) {
		if (vectors.length === 0) return Vector.getZero();
		const sumX = vectors.reduce((sum, vec) => sum + vec.x, 0);
		const sumY = vectors.reduce((sum, vec) => sum + vec.y, 0);
		return new Vector(sumX / vectors.length, sumY / vectors.length);
	}
	/**
	* 将自己这个向量转换成角度数字
	* 例如当自己 x=1 y=1 时，返回 45
	*/
	toDegrees() {
		let result = Math.atan2(this.y, this.x) * 180 / Math.PI;
		if (result < 0) result += 360;
		if (result >= 360) result -= 360;
		return result;
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	equals(vector) {
		return this.x === vector.x && this.y === vector.y;
	}
	nearlyEqual(vector, radius) {
		return Math.abs(this.x - vector.x) <= radius && Math.abs(this.y - vector.y) <= radius;
	}
	toString() {
		return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
	}
	limitX(min, max) {
		return new Vector(Math.min(Math.max(this.x, min), max), this.y);
	}
	limitY(min, max) {
		return new Vector(this.x, Math.min(Math.max(this.y, min), max));
	}
	/**
	* 创建x和y相同的向量 (其实就是正方形，从左上到右下)
	*/
	static same(value) {
		return new Vector(value, value);
	}
	static fromTouch(touch) {
		return new Vector(touch.clientX, touch.clientY);
	}
	toInteger() {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}
	toArray() {
		return [this.x, this.y];
	}
	__add__(other) {
		return this.add(other);
	}
};
__decorate([serializable, __decorateMetadata("design:type", Number)], Vector.prototype, "x", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], Vector.prototype, "y", void 0);
//#endregion
//#region ../packages/shapes/src/Shape.ts
/**
* 可交互的 图形抽象类
*/
var Shape = class {};
//#endregion
//#region ../packages/shapes/src/Line.ts
/**
* 线段类
*/
var Line = class extends Shape {
	start;
	end;
	constructor(start, end) {
		super();
		this.start = start;
		this.end = end;
	}
	toString() {
		return `Line(${this.start}, ${this.end})`;
	}
	length() {
		return this.end.subtract(this.start).magnitude();
	}
	midPoint() {
		return new Vector((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
	}
	direction() {
		return this.end.subtract(this.start);
	}
	/**
	* 判断点是否在线段附近
	* @param point
	* @param tolerance 附近容错度
	*/
	isPointNearLine(point, tolerance = 5) {
		const lineVector = this.direction();
		const pointVector = point.subtract(this.start);
		const lineLengthSquared = lineVector.dot(lineVector);
		if (lineLengthSquared === 0) return this.start.subtract(point).magnitude() <= tolerance;
		const t = pointVector.dot(lineVector) / lineLengthSquared;
		return (t < 0 ? this.start : t > 1 ? this.end : new Vector(this.start.x + t * lineVector.x, this.start.y + t * lineVector.y)).subtract(point).magnitude() <= tolerance;
	}
	isPointIn(point) {
		return this.isPointNearLine(point, 12);
	}
	isCollideWithRectangle(rectangle) {
		return rectangle.isCollideWithLine(this);
	}
	isCollideWithLine(line) {
		return this.isIntersecting(line);
	}
	isParallel(other) {
		/** 判断两条线段是否平行 */
		return this.direction().cross(other.direction()) === 0;
	}
	isCollinear(other) {
		/** 判断两条线段是否共线 */
		return this.isParallel(other) && this.start.subtract(other.start).cross(this.direction()) === 0;
	}
	/**
	* 判断该线段是否和一个水平的线段相交
	* @param y 水平线段的y坐标
	* @param xLeft 水平线段的左端点
	* @param xRight 水平线段的右端点
	*/
	isIntersectingWithHorizontalLine(y, xLeft, xRight) {
		if (this.start.y < y && this.end.y < y || this.start.y > y && this.end.y > y) return false;
		if (this.start.x < xLeft && this.end.x < xLeft || this.start.x > xRight && this.end.x > xRight) return false;
		if (this.start.y === y || this.end.y === y) return false;
		const slope = (this.end.x - this.start.x) / (this.end.y - this.start.y);
		const intersectionX = this.start.x + slope * (y - this.start.y);
		return intersectionX >= Math.min(xLeft, xRight) && intersectionX <= Math.max(xLeft, xRight);
	}
	getRectangle() {
		const minX = Math.min(this.start.x, this.end.x);
		const maxX = Math.max(this.start.x, this.end.x);
		const minY = Math.min(this.start.y, this.end.y);
		const maxY = Math.max(this.start.y, this.end.y);
		return new Rectangle(new Vector(minX, minY), new Vector(maxX - minX, maxY - minY));
	}
	/**
	* 判断该线段是否和一个垂直的线段相交
	* @param x 垂直线段的x坐标
	* @param yBottom 垂直线段的下端点
	* @param yTop 垂直线段的上端点
	*/
	isIntersectingWithVerticalLine(x, yBottom, yTop) {
		if (this.start.x < x && this.end.x < x || this.start.x > x && this.end.x > x) return false;
		if (this.start.y > yBottom && this.end.y > yBottom || this.start.y < yTop && this.end.y < yTop) return false;
		if (this.start.x === x || this.end.x === x) return false;
		const inverseSlope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
		const intersectionY = this.start.y + inverseSlope * (x - this.start.x);
		return intersectionY >= Math.min(yBottom, yTop) && intersectionY <= Math.max(yBottom, yTop);
	}
	/**
	* 一个线段是否和一个水平线段相交
	*  this line
	*    xx
	*      x
	*  ├────xxx─────────┤
	*         xxx
	*            xxx
	*  xLeft       xxx  xRight
	*
	* @param y
	* @param xLeft
	* @param xRight
	* @returns
	*/
	getIntersectingWithHorizontalLine(y, xLeft, xRight) {
		if (this.start.y < y && this.end.y < y || this.start.y > y && this.end.y > y) return { intersects: false };
		if (this.start.x < xLeft && this.end.x < xLeft || this.start.x > xRight && this.end.x > xRight) return { intersects: false };
		if (this.start.y === y || this.end.y === y) return { intersects: false };
		const slope = (this.end.x - this.start.x) / (this.end.y - this.start.y);
		const intersectionX = this.start.x + slope * (y - this.start.y);
		if (intersectionX >= Math.min(xLeft, xRight) && intersectionX <= Math.max(xLeft, xRight)) return {
			intersects: true,
			point: new Vector(intersectionX, y)
		};
		return { intersects: false };
	}
	/**
	* 当前线段和垂直线段相交算法
	* start
	* x   │yTop
	*  x  │
	*   x │
	*    x│
	*     x   end
	*     │x
	*     │
	*     │yBottom
	* @param x
	* @param yBottom
	* @param yTop
	* @returns
	*/
	getIntersectingWithVerticalLine(x, yBottom, yTop) {
		if (this.start.x < x && this.end.x < x || this.start.x > x && this.end.x > x) return { intersects: false };
		if (this.start.y > yBottom && this.end.y > yBottom || this.start.y < yTop && this.end.y < yTop) return { intersects: false };
		if (this.start.x === x || this.end.x === x) return { intersects: false };
		const inverseSlope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
		const intersectionY = this.start.y + inverseSlope * (x - this.start.x);
		if (intersectionY >= Math.min(yBottom, yTop) && intersectionY <= Math.max(yBottom, yTop)) return {
			intersects: true,
			point: new Vector(x, intersectionY)
		};
		return { intersects: false };
	}
	isIntersectingWithCircle(circle) {
		if (circle.isPointIn(this.start) || circle.isPointIn(this.end)) return true;
		const A = this.start.y - this.end.y;
		const B = this.end.x - this.start.x;
		const C = this.start.x * this.end.y - this.end.x * this.start.y;
		let dist1 = A * circle.location.x + B * circle.location.y + C;
		dist1 *= dist1;
		const dist2 = (A * A + B * B) * circle.radius * circle.radius;
		if (dist1 > dist2) return false;
		const angle1 = (circle.location.x - this.start.x) * (this.end.x - this.start.x) + (circle.location.y - this.start.y) * (this.end.y - this.start.y);
		const angle2 = (circle.location.x - this.end.x) * (this.start.x - this.end.x) + (circle.location.y - this.end.y) * (this.start.y - this.end.y);
		return angle1 > 0 && angle2 > 0;
	}
	/**
	* 判断两条线段是否相交
	*/
	isIntersecting(other) {
		if (this.isCollinear(other)) return false;
		const onSegment = (p, q, r) => {
			return Math.max(p.x, r.x) >= q.x && q.x >= Math.min(p.x, r.x) && Math.max(p.y, r.y) >= q.y && q.y >= Math.min(p.y, r.y);
		};
		const orientation = (p, q, r) => {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
			if (val === 0) return 0;
			return val > 0 ? 1 : 2;
		};
		const o1 = orientation(this.start, this.end, other.start);
		const o2 = orientation(this.start, this.end, other.end);
		const o3 = orientation(other.start, other.end, this.start);
		const o4 = orientation(other.start, other.end, this.end);
		if (o1 !== o2 && o3 !== o4) return true;
		if (o1 === 0 && onSegment(this.start, other.start, this.end)) return true;
		if (o2 === 0 && onSegment(this.start, other.end, this.end)) return true;
		if (o3 === 0 && onSegment(other.start, this.start, other.end)) return true;
		if (o4 === 0 && onSegment(other.start, this.end, other.end)) return true;
		return false;
	}
	cross(other) {
		/** 计算两条线段方向向量的叉积 */
		return this.direction().cross(other.direction());
	}
	getIntersection(other) {
		/**
		* 计算两条线段的交点
		*/
		if (!this.isIntersecting(other)) return null;
		try {
			const x1 = this.start.x, y1 = this.start.y;
			const x2 = this.end.x, y2 = this.end.y;
			const x3 = other.start.x, y3 = other.start.y;
			const x4 = other.end.x, y4 = other.end.y;
			const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
			if (denom === 0) return null;
			const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
			const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
			if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return new Vector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
			else return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
};
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Line.prototype, "start", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Line.prototype, "end", void 0);
//#endregion
//#region ../packages/shapes/src/Rectangle.ts
var Rectangle = class Rectangle extends Shape {
	location;
	size;
	constructor(location, size) {
		super();
		this.location = location;
		this.size = size;
	}
	/**
	* 构造一个相对于屏幕来说内容居中的矩形
	* 用于UI初始化窗口
	*/
	static inCenter(size) {
		return new Rectangle(new Vector(window.innerWidth, window.innerHeight).divide(2).subtract(size.divide(2)), size);
	}
	get left() {
		return this.location.x;
	}
	get right() {
		return this.location.x + this.size.x;
	}
	get top() {
		return this.location.y;
	}
	get bottom() {
		return this.location.y + this.size.y;
	}
	get center() {
		return this.location.add(this.size.divide(2));
	}
	getInnerLocationByRateVector(rateVector) {
		return this.location.add(new Vector(this.size.x * rateVector.x, this.size.y * rateVector.y));
	}
	get leftCenter() {
		return new Vector(this.left, this.center.y);
	}
	get rightCenter() {
		return new Vector(this.right, this.center.y);
	}
	get topCenter() {
		return new Vector(this.center.x, this.top);
	}
	get bottomCenter() {
		return new Vector(this.center.x, this.bottom);
	}
	get leftTop() {
		return new Vector(this.left, this.top);
	}
	get rightTop() {
		return new Vector(this.right, this.top);
	}
	get leftBottom() {
		return new Vector(this.left, this.bottom);
	}
	get rightBottom() {
		return new Vector(this.right, this.bottom);
	}
	get width() {
		return this.size.x;
	}
	get height() {
		return this.size.y;
	}
	getRectangle() {
		return this.clone();
	}
	/**
	* 以中心点为中心，扩展矩形
	* @param amount
	* @returns
	*/
	expandFromCenter(amount) {
		return Rectangle.fromEdges(this.left - amount, this.top - amount, this.right + amount, this.bottom + amount);
	}
	clone() {
		return new Rectangle(this.location.clone(), this.size.clone());
	}
	/**
	* 通过四条边来创建矩形
	* @param left
	* @param top
	* @param right
	* @param bottom
	* @returns
	*/
	static fromEdges(left, top, right, bottom) {
		return new Rectangle(new Vector(left, top), new Vector(right - left, bottom - top));
	}
	/**
	* 通过两个点来创建矩形，可以用于框选生成矩形
	* @param p1
	* @param p2
	* @returns
	*/
	static fromTwoPoints(p1, p2) {
		const left = Math.min(p1.x, p2.x);
		const top = Math.min(p1.y, p2.y);
		const right = Math.max(p1.x, p2.x);
		const bottom = Math.max(p1.y, p2.y);
		return Rectangle.fromEdges(left, top, right, bottom);
	}
	/**
	* 获取多个矩形的最小外接矩形
	* @param rectangles
	* @returns
	*/
	static getBoundingRectangle(rectangles, padding = 0) {
		if (rectangles.length === 0) throw new Error("rectangles is empty");
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		for (const rect of rectangles) {
			left = Math.min(left, rect.left - padding);
			top = Math.min(top, rect.top - padding);
			right = Math.max(right, rect.right + padding);
			bottom = Math.max(bottom, rect.bottom + padding);
		}
		return Rectangle.fromEdges(left, top, right, bottom);
	}
	/**
	* 按照 上右下左 的顺序返回四条边
	* @returns
	*/
	getBoundingLines() {
		return [
			new Line(new Vector(this.left, this.top), new Vector(this.right, this.top)),
			new Line(new Vector(this.right, this.top), new Vector(this.right, this.bottom)),
			new Line(new Vector(this.right, this.bottom), new Vector(this.left, this.bottom)),
			new Line(new Vector(this.left, this.bottom), new Vector(this.left, this.top))
		];
	}
	getFroePoints() {
		return [
			new Vector(this.left, this.top),
			new Vector(this.right, this.top),
			new Vector(this.right, this.bottom),
			new Vector(this.left, this.bottom)
		];
	}
	/**
	* 和另一个矩形有部分相交（碰到一点点就算）
	*/
	isCollideWith(other) {
		const collision_x = this.right > other.left && this.left < other.right;
		const collision_y = this.bottom > other.top && this.top < other.bottom;
		return collision_x && collision_y;
	}
	/**
	* 判断一个矩形是否完全在某个矩形内部
	* @param otherBig
	*/
	isAbsoluteIn(otherBig) {
		return this.left >= otherBig.left && this.right <= otherBig.right && this.top >= otherBig.top && this.bottom <= otherBig.bottom;
	}
	isCollideWithRectangle(rectangle) {
		return this.isCollideWith(rectangle);
	}
	/**
	* 已知两个矩形必定相交，返回重叠部分的矩形区域
	*/
	static getIntersectionRectangle(rect1, rect2) {
		const left = Math.max(rect1.left, rect2.left);
		const top = Math.max(rect1.top, rect2.top);
		const right = Math.min(rect1.right, rect2.right);
		const bottom = Math.min(rect1.bottom, rect2.bottom);
		return Rectangle.fromEdges(left, top, right, bottom);
	}
	/**
	* 自己这个矩形是否和线段有交点
	* 用于节点切割检测
	*
	* @param line
	*/
	isCollideWithLine(line) {
		if (this.isPointIn(line.start) || this.isPointIn(line.end)) return true;
		if (line.isIntersectingWithHorizontalLine(this.location.y, this.left, this.right)) return true;
		if (line.isIntersectingWithHorizontalLine(this.location.y + this.size.y, this.left, this.right)) return true;
		if (line.isIntersectingWithVerticalLine(this.location.x, this.bottom, this.top)) return true;
		if (line.isIntersectingWithVerticalLine(this.location.x + this.size.x, this.bottom, this.top)) return true;
		return false;
	}
	/**
	* 获取线段和矩形的交点
	* @param line
	*/
	getCollidePointsWithLine(line) {
		const result = [];
		if (this.isPointIn(line.start)) result.push(line.start);
		if (this.isPointIn(line.end)) result.push(line.end);
		const topResult = line.getIntersectingWithHorizontalLine(this.location.y, this.left, this.right);
		if (topResult.intersects) result.push(topResult.point);
		const bottomResult = line.getIntersectingWithHorizontalLine(this.location.y + this.size.y, this.left, this.right);
		if (bottomResult.intersects) result.push(bottomResult.point);
		const leftResult = line.getIntersectingWithVerticalLine(this.location.x, this.bottom, this.top);
		if (leftResult.intersects) result.push(leftResult.point);
		const rightResult = line.getIntersectingWithVerticalLine(this.location.x + this.size.x, this.bottom, this.top);
		if (rightResult.intersects) result.push(rightResult.point);
		return result;
	}
	/**
	* 是否完全在另一个矩形内
	* AI写的，有待测试
	* @param other
	* @returns
	*/
	isInOther(other) {
		const collision_x = this.left > other.left && this.right < other.right;
		const collision_y = this.top > other.top && this.bottom < other.bottom;
		return collision_x && collision_y;
	}
	/**
	* 获取两个矩形的重叠区域的矩形的宽度和高度
	* 如果没有重叠区域，则宽度和高度都是0
	* 返回的x,y 都大于零
	*/
	getOverlapSize(other) {
		if (!this.isCollideWith(other)) return new Vector(0, 0);
		const left = Math.max(this.left, other.left);
		const top = Math.max(this.top, other.top);
		const right = Math.min(this.right, other.right);
		const bottom = Math.min(this.bottom, other.bottom);
		return new Vector(right - left, bottom - top);
	}
	/**
	* 判断点是否在矩形内/边上也算
	* 为什么边上也算，因为节点的位置在左上角上，可以用于判断节点是否存在于某位置
	*/
	isPointIn(point) {
		const collision_x = this.left <= point.x && point.x <= this.right;
		const collision_y = this.top <= point.y && point.y <= this.bottom;
		return collision_x && collision_y;
	}
	/**
	*
	* @param scale
	* @returns
	*/
	multiply(scale) {
		return new Rectangle(this.location.multiply(scale), this.size.multiply(scale));
	}
	toString() {
		return `[${this.location.toString()}, ${this.size.toString()}]`;
	}
	getCenter() {
		return this.location.add(this.size.divide(2));
	}
	static fromPoints(p1, p2) {
		return new Rectangle(p1.clone(), p2.clone().subtract(p1));
	}
	/**
	* 返回一个线段和这个矩形的交点，如果没有交点，就返回这个矩形的中心点
	* 请确保线段和矩形只有一个交点，出现两个交点的情况还未测试
	*/
	getLineIntersectionPoint(line) {
		const topIntersection = new Line(this.location, this.location.add(new Vector(this.size.x, 0))).getIntersection(line);
		if (topIntersection) return topIntersection;
		const bottomIntersection = new Line(this.location.add(new Vector(0, this.size.y)), this.location.add(this.size)).getIntersection(line);
		if (bottomIntersection) return bottomIntersection;
		const leftIntersection = new Line(this.location, this.location.add(new Vector(0, this.size.y))).getIntersection(line);
		if (leftIntersection) return leftIntersection;
		const rightIntersection = new Line(this.location.add(new Vector(this.size.x, 0)), this.location.add(this.size)).getIntersection(line);
		if (rightIntersection) return rightIntersection;
		return this.getCenter();
	}
	/**
	* 获取在this矩形边上的point的单位法向量,若point不在this矩形边上，则该函数可能返回任意向量。
	* @param point
	*/
	getNormalVectorAt(point) {
		if (point.x === this.left) return new Vector(-1, 0);
		else if (point.x === this.right) return new Vector(1, 0);
		else if (point.y === this.top) return new Vector(0, -1);
		else return new Vector(0, 1);
	}
	translate(offset) {
		return new Rectangle(this.location.add(offset), this.size);
	}
	limit(limit) {
		const left = Math.max(limit.left, this.left);
		const top = Math.max(limit.top, this.top);
		const right = Math.min(limit.right, this.right);
		const bottom = Math.min(limit.bottom, this.bottom);
		return Rectangle.fromEdges(left, top, right, bottom);
	}
};
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Rectangle.prototype, "location", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], Rectangle.prototype, "size", void 0);
//#endregion
//#region ../packages/shapes/src/Circle.ts
/**
* 圆形，
* 注意：坐标点location属性是圆心属性
*/
var Circle = class extends Shape {
	location;
	radius;
	constructor(location, radius) {
		super();
		this.location = location;
		this.radius = radius;
	}
	isPointIn(point) {
		return this.location.distance(point) <= this.radius;
	}
	isCollideWithRectangle(rectangle) {
		return rectangle.isPointIn(this.location);
	}
	isCollideWithLine(line) {
		return line.isIntersectingWithCircle(this);
	}
	getRectangle() {
		return new Rectangle(new Vector(this.location.x - this.radius, this.location.y - this.radius), Vector.same(this.radius * 2));
	}
	toString() {
		return `Circle(${this.location.toString()}, ${this.radius})`;
	}
};
//#endregion
//#region ../packages/shapes/src/CubicCatmullRomSpline.ts
/**
* CR曲线形状
*/
var CubicCatmullRomSpline = class extends Shape {
	controlPoints;
	alpha;
	tension;
	constructor(controlPoints, alpha = .5, tension = 0) {
		super();
		if (controlPoints.length < 4) throw new Error("There must be at least 4 control points");
		this.controlPoints = controlPoints;
		this.alpha = alpha;
		this.tension = tension;
	}
	computePath() {
		const result = [this.controlPoints[1]];
		for (const funcs of this.computeFunction()) {
			const s = romberg((t) => funcs.derivative(t).magnitude(), .5);
			const maxLength = 5;
			let num = 1;
			for (; s / num > maxLength; num++);
			for (let i = 0, t0 = 0; i < num - 1; i++) for (let left = t0, right = 1;;) {
				const t = left + (right - left) / 2;
				const point = funcs.equation(t);
				const requiredError = .25;
				const diff = point.distance(result[result.length - 1]) - s / num;
				if (Math.abs(diff) < requiredError) {
					result.push(point);
					t0 = t;
					break;
				} else if (diff < 0) left = t;
				else right = t;
			}
			result.push(funcs.equation(1));
		}
		return result;
	}
	computeLines() {
		const points = this.computePath();
		const result = [];
		for (let i = 1; i < points.length; i++) result.push(new Line(points[i - 1], points[i]));
		return result;
	}
	isPointIn(point) {
		for (const line of this.computeLines()) if (line.isPointIn(point)) return true;
		return false;
	}
	isCollideWithRectangle(rectangle) {
		for (const line of this.computeLines()) if (line.isCollideWithRectangle(rectangle)) return true;
		return false;
	}
	isCollideWithLine(line) {
		for (const l of this.computeLines()) if (l.isCollideWithLine(line)) return true;
		return false;
	}
	getRectangle() {
		const min = this.controlPoints[1].clone();
		const max = min.clone();
		for (const p of this.computePath()) {
			min.x = Math.min(min.x, p.x);
			min.y = Math.min(min.y, p.y);
			max.x = Math.max(max.x, p.x);
			max.y = Math.max(max.y, p.y);
		}
		return new Rectangle(min, max.subtract(min));
	}
	/**
	* 计算控制点所构成的曲线的参数方程和导数
	*/
	computeFunction() {
		const result = [];
		for (let i = 0; i + 4 <= this.controlPoints.length; i++) {
			const p0 = this.controlPoints[i];
			const p1 = this.controlPoints[i + 1];
			const p2 = this.controlPoints[i + 2];
			const p3 = this.controlPoints[i + 3];
			const t01 = Math.pow(p0.distance(p1), this.alpha);
			const t12 = Math.pow(p1.distance(p2), this.alpha);
			const t23 = Math.pow(p2.distance(p3), this.alpha);
			const m1 = p2.subtract(p1).add(p1.subtract(p0).divide(t01).subtract(p2.subtract(p0).divide(t01 + t12)).multiply(t12)).multiply(1 - this.tension);
			const m2 = p2.subtract(p1).add(p3.subtract(p2).divide(t23).subtract(p3.subtract(p1).divide(t12 + t23)).multiply(t12)).multiply(1 - this.tension);
			const a = p1.subtract(p2).multiply(2).add(m1).add(m2);
			const b = p1.subtract(p2).multiply(-3).subtract(m1).subtract(m1).subtract(m2);
			const c = m1;
			const d = p1;
			result.push({
				equation: (t) => a.multiply(t * t * t).add(b.multiply(t * t)).add(c.multiply(t)).add(d),
				derivative: (t) => a.multiply(3 * t * t).add(b.multiply(2 * t)).add(c)
			});
		}
		return result;
	}
};
/**
* 使用romberg算法对函数func在[0, 1]区间上进行数值积分，确保绝对误差小于error
* 参考网址 https://math.fandom.com/zh/wiki/Romberg_%E7%AE%97%E6%B3%95?variant=zh-sg
* @param func 被积函数
* @param error 误差
*/
function romberg(func, error) {
	const t = [[(func(0) + func(1)) / 2]];
	function tJK(t, j, k) {
		return (Math.pow(4, j) * t[j - 1][k + 1] - t[j - 1][k]) / (Math.pow(4, j) - 1);
	}
	function extendsTj(t, j) {
		if (j == 0) {
			const k = t[0].length;
			const twoPowK = Math.pow(2, k);
			let sum = 0;
			for (let j = 1; j <= Math.pow(2, k - 1); j++) sum += func((2 * j - 1) / twoPowK);
			sum = sum / twoPowK + t[0][k - 1] / 2;
			t[0].push(sum);
			return sum;
		} else {
			const val = tJK(t, j, t[j].length);
			t[j].push(val);
			return val;
		}
	}
	extendsTj(t, 0);
	extendsTj(t, 0);
	for (let j = 1;; j++) {
		t.push([]);
		for (let i = 0; i < j; i++) extendsTj(t, i);
		extendsTj(t, j);
		const tj1 = extendsTj(t, j);
		const tj2 = extendsTj(t, j);
		if (Math.abs(tj2 - tj1) < error) return tj1;
	}
}
//#endregion
//#region ../packages/shapes/src/Curve.ts
/**
* 贝塞尔曲线
*/
var CubicBezierCurve = class CubicBezierCurve extends Shape {
	start;
	ctrlPt1;
	ctrlPt2;
	end;
	constructor(start, ctrlPt1, ctrlPt2, end) {
		super();
		this.start = start;
		this.ctrlPt1 = ctrlPt1;
		this.ctrlPt2 = ctrlPt2;
		this.end = end;
	}
	toString() {
		return `CubicBezierCurve(start:${this.start}, ctrlPt1:${this.ctrlPt1}, ctrlPt2:${this.ctrlPt2}, end:${this.end})`;
	}
	/**
	* 根据参数t（范围[0, 1]）获取贝塞尔曲线上的点
	* @param t
	* @returns
	*/
	getPointByT(t) {
		return this.start.multiply(Math.pow(1 - t, 3)).add(this.ctrlPt1.multiply(3 * t * Math.pow(1 - t, 2))).add(this.ctrlPt2.multiply(3 * Math.pow(t, 2) * (1 - t)).add(this.end.multiply(Math.pow(t, 3))));
	}
	static segment = 40;
	isPointIn(point) {
		let lastPoint = this.start;
		for (let i = 1; i <= CubicBezierCurve.segment; i++) {
			const line = new Line(lastPoint, this.getPointByT(i / CubicBezierCurve.segment));
			if (line.isPointIn(point)) return true;
			lastPoint = line.end;
		}
		return false;
	}
	isCollideWithRectangle(rectangle) {
		let lastPoint = this.start;
		for (let i = 1; i <= CubicBezierCurve.segment; i++) {
			const line = new Line(lastPoint, this.getPointByT(i / CubicBezierCurve.segment));
			if (line.isCollideWithRectangle(rectangle)) return true;
			lastPoint = line.end;
		}
		return false;
	}
	isCollideWithLine(l) {
		let lastPoint = this.start;
		for (let i = 1; i <= CubicBezierCurve.segment; i++) {
			const line = new Line(lastPoint, this.getPointByT(i / CubicBezierCurve.segment));
			if (line.isCollideWithLine(l)) return true;
			lastPoint = line.end;
		}
		return false;
	}
	getRectangle() {
		const minX = Math.min(this.start.x, this.ctrlPt1.x, this.ctrlPt2.x, this.end.x);
		const maxX = Math.max(this.start.x, this.ctrlPt1.x, this.ctrlPt2.x, this.end.x);
		const minY = Math.min(this.start.y, this.ctrlPt1.y, this.ctrlPt2.y, this.end.y);
		const maxY = Math.max(this.start.y, this.ctrlPt1.y, this.ctrlPt2.y, this.end.y);
		return new Rectangle(new Vector(minX, minY), new Vector(maxX - minX, maxY - minY));
	}
};
/**
* 对称曲线
*/
var SymmetryCurve = class extends Shape {
	start;
	startDirection;
	end;
	endDirection;
	bending;
	constructor(start, startDirection, end, endDirection, bending) {
		super();
		this.start = start;
		this.startDirection = startDirection;
		this.end = end;
		this.endDirection = endDirection;
		this.bending = bending;
	}
	get bezier() {
		return new CubicBezierCurve(this.start, this.startDirection.normalize().multiply(this.bending).add(this.start), this.endDirection.normalize().multiply(this.bending).add(this.end), this.end);
	}
	isPointIn(point) {
		return this.bezier.isPointIn(point);
	}
	isCollideWithRectangle(rectangle) {
		return this.bezier.isCollideWithRectangle(rectangle);
	}
	isCollideWithLine(line) {
		return this.bezier.isCollideWithLine(line);
	}
	toString() {
		return `SymmetryCurve(start:${this.start}, startDirection:${this.startDirection}, end:${this.end}, endDirection:${this.endDirection}, bending:${this.bending})`;
	}
	getRectangle() {
		const minX = Math.min(this.start.x, this.end.x);
		const maxX = Math.max(this.start.x, this.end.x);
		const minY = Math.min(this.start.y, this.end.y);
		const maxY = Math.max(this.start.y, this.end.y);
		return new Rectangle(new Vector(minX, minY), new Vector(maxX - minX, maxY - minY));
	}
};
//#endregion
//#region ../node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/sonner/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_react_dom();
function __insertCSS(code) {
	if (!code || typeof document == "undefined") return;
	let head = document.head || document.getElementsByTagName("head")[0];
	let style = document.createElement("style");
	style.type = "text/css";
	head.appendChild(style);
	style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
Array(12).fill(0);
var toastsCounter = 1;
var Observer = class {
	constructor() {
		this.subscribe = (subscriber) => {
			this.subscribers.push(subscriber);
			return () => {
				const index = this.subscribers.indexOf(subscriber);
				this.subscribers.splice(index, 1);
			};
		};
		this.publish = (data) => {
			this.subscribers.forEach((subscriber) => subscriber(data));
		};
		this.addToast = (data) => {
			this.publish(data);
			this.toasts = [...this.toasts, data];
		};
		this.create = (data) => {
			var _data_id;
			const { message, ...rest } = data;
			const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
			const alreadyExists = this.toasts.find((toast) => {
				return toast.id === id;
			});
			const dismissible = data.dismissible === void 0 ? true : data.dismissible;
			if (this.dismissedToasts.has(id)) this.dismissedToasts.delete(id);
			if (alreadyExists) this.toasts = this.toasts.map((toast) => {
				if (toast.id === id) {
					this.publish({
						...toast,
						...data,
						id,
						title: message
					});
					return {
						...toast,
						...data,
						id,
						dismissible,
						title: message
					};
				}
				return toast;
			});
			else this.addToast({
				title: message,
				...rest,
				dismissible,
				id
			});
			return id;
		};
		this.dismiss = (id) => {
			if (id) {
				this.dismissedToasts.add(id);
				requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
					id,
					dismiss: true
				})));
			} else this.toasts.forEach((toast) => {
				this.subscribers.forEach((subscriber) => subscriber({
					id: toast.id,
					dismiss: true
				}));
			});
			return id;
		};
		this.message = (message, data) => {
			return this.create({
				...data,
				message
			});
		};
		this.error = (message, data) => {
			return this.create({
				...data,
				message,
				type: "error"
			});
		};
		this.success = (message, data) => {
			return this.create({
				...data,
				type: "success",
				message
			});
		};
		this.info = (message, data) => {
			return this.create({
				...data,
				type: "info",
				message
			});
		};
		this.warning = (message, data) => {
			return this.create({
				...data,
				type: "warning",
				message
			});
		};
		this.loading = (message, data) => {
			return this.create({
				...data,
				type: "loading",
				message
			});
		};
		this.promise = (promise, data) => {
			if (!data) return;
			let id = void 0;
			if (data.loading !== void 0) id = this.create({
				...data,
				promise,
				type: "loading",
				message: data.loading,
				description: typeof data.description !== "function" ? data.description : void 0
			});
			const p = Promise.resolve(promise instanceof Function ? promise() : promise);
			let shouldDismiss = id !== void 0;
			let result;
			const originalPromise = p.then(async (response) => {
				result = ["resolve", response];
				if (import_react.isValidElement(response)) {
					shouldDismiss = false;
					this.create({
						id,
						type: "default",
						message: response
					});
				} else if (isHttpResponse(response) && !response.ok) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
					const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				} else if (response instanceof Error) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
					const description = typeof data.description === "function" ? await data.description(response) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				} else if (data.success !== void 0) {
					shouldDismiss = false;
					const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
					const description = typeof data.description === "function" ? await data.description(response) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "success",
						description,
						...toastSettings
					});
				}
			}).catch(async (error) => {
				result = ["reject", error];
				if (data.error !== void 0) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
					const description = typeof data.description === "function" ? await data.description(error) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				}
			}).finally(() => {
				if (shouldDismiss) {
					this.dismiss(id);
					id = void 0;
				}
				data.finally == null || data.finally.call(data);
			});
			const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
			if (typeof id !== "string" && typeof id !== "number") return { unwrap };
			else return Object.assign(id, { unwrap });
		};
		this.custom = (jsx, data) => {
			const id = (data == null ? void 0 : data.id) || toastsCounter++;
			this.create({
				jsx: jsx(id),
				id,
				...data
			});
			return id;
		};
		this.getActiveToasts = () => {
			return this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id));
		};
		this.subscribers = [];
		this.toasts = [];
		this.dismissedToasts = /* @__PURE__ */ new Set();
	}
};
var ToastState = new Observer();
var toastFunction = (message, data) => {
	const id = (data == null ? void 0 : data.id) || toastsCounter++;
	ToastState.addToast({
		title: message,
		...data,
		id
	});
	return id;
};
var isHttpResponse = (data) => {
	return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
var basicToast = toastFunction;
var getHistory = () => ToastState.toasts;
var getToasts = () => ToastState.getActiveToasts();
var toast = Object.assign(basicToast, {
	success: ToastState.success,
	info: ToastState.info,
	warning: ToastState.warning,
	error: ToastState.error,
	custom: ToastState.custom,
	message: ToastState.message,
	promise: ToastState.promise,
	dismiss: ToastState.dismiss,
	loading: ToastState.loading
}, {
	getHistory,
	getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
//#endregion
//#region src/types/metadata.tsx
/**
* 创建默认的 metadata 对象
* @param version 版本号，默认为最新版本
*/
function createDefaultMetadata(version = "2.0.0") {
	return { version };
}
/**
* 验证 metadata 对象是否有效
* @param metadata 待验证的 metadata
* @returns 是否有效
*/
function isValidMetadata(metadata) {
	return metadata && typeof metadata === "object" && typeof metadata.version === "string";
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/constants.js
var MAX_32_BITS = 4294967295;
var MAX_16_BITS = 65535;
var LOCAL_FILE_HEADER_SIGNATURE = 67324752;
var SPLIT_ZIP_FILE_SIGNATURE = 134695760;
var DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
var CENTRAL_FILE_HEADER_SIGNATURE = 33639248;
var END_OF_CENTRAL_DIR_SIGNATURE = 101010256;
var ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 101075792;
var ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 117853008;
var EXTRAFIELD_TYPE_AES = 39169;
var EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 21589;
var EXTRAFIELD_TYPE_UNICODE_PATH = 28789;
var EXTRAFIELD_TYPE_UNICODE_COMMENT = 25461;
var EXTRAFIELD_TYPE_USDZ = 6534;
var EXTRAFIELD_TYPE_INFOZIP = 30837;
var EXTRAFIELD_TYPE_UNIX = 30805;
var BITFLAG_LANG_ENCODING_FLAG = 2048;
var FILE_ATTR_UNIX_TYPE_MASK = 61440;
var FILE_ATTR_UNIX_TYPE_DIR = 16384;
var FILE_ATTR_UNIX_SETUID_MASK = 2048;
var FILE_ATTR_UNIX_SETGID_MASK = 1024;
var MAX_DATE = new Date(2107, 11, 31);
var MIN_DATE = new Date(1980, 0, 1);
var INFINITY_VALUE = Infinity;
var UNDEFINED_TYPE = "undefined";
var FUNCTION_TYPE = "function";
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/configuration.js
var MINIMUM_CHUNK_SIZE = 64;
var maxWorkers = 2;
try {
	if (typeof navigator != "undefined" && navigator.hardwareConcurrency) maxWorkers = navigator.hardwareConcurrency;
} catch {}
var config = Object.assign({}, {
	workerURI: "./core/web-worker-wasm.js",
	wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
	chunkSize: 64 * 1024,
	maxWorkers,
	terminateWorkerTimeout: 5e3,
	useWebWorkers: true,
	useCompressionStream: true,
	CompressionStream: typeof CompressionStream != "undefined" && CompressionStream,
	DecompressionStream: typeof DecompressionStream != "undefined" && DecompressionStream
});
function getConfiguration() {
	return config;
}
function getChunkSize(config) {
	return Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
}
function configure(configuration) {
	const { baseURI, chunkSize, maxWorkers, terminateWorkerTimeout, useCompressionStream, useWebWorkers, CompressionStream, DecompressionStream, CompressionStreamZlib, DecompressionStreamZlib, workerURI, wasmURI } = configuration;
	setIfDefined("baseURI", baseURI);
	setIfDefined("wasmURI", wasmURI);
	setIfDefined("workerURI", workerURI);
	setIfDefined("chunkSize", chunkSize);
	setIfDefined("maxWorkers", maxWorkers);
	setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
	setIfDefined("useCompressionStream", useCompressionStream);
	setIfDefined("useWebWorkers", useWebWorkers);
	setIfDefined("CompressionStream", CompressionStream);
	setIfDefined("DecompressionStream", DecompressionStream);
	setIfDefined("CompressionStreamZlib", CompressionStreamZlib);
	setIfDefined("DecompressionStreamZlib", DecompressionStreamZlib);
}
function setIfDefined(propertyName, propertyValue) {
	if (propertyValue !== void 0) config[propertyName] = propertyValue;
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/web-worker-inline-wasm.js
function t(t) {
	const e = "(t=>{\"function\"==typeof define&&define.amd?define(t):t()})(function(){\"use strict\";const{Array:t,Object:e,Number:n,Math:s,Error:r,Uint8Array:o,Uint16Array:i,Uint32Array:c,Int32Array:a,Map:h,DataView:f,Promise:l,TextEncoder:u,crypto:w,postMessage:p,TransformStream:d,ReadableStream:y,WritableStream:m,CompressionStream:g,DecompressionStream:S}=self,b=void 0,v=\"undefined\",k=\"function\",z=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;z[t]=e}class C{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,s=0|t.length;s>n;n++)e=e>>>8^z[255&(e^t[n])];this.t=e}get(){return~this.t}}class A extends d{constructor(){let t;const e=new C;super({transform(t,n){e.append(t),n.enqueue(t)},flush(){const n=new o(4);new f(n.buffer).setUint32(0,e.get()),t.value=n}}),t=this}}const x={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],s=x.o(n);return 32===s?t.concat(e):x.i(e,s,0|n,t.slice(0,t.length-1))},h(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+x.o(n)},l(t,e){if(32*t.length<e)return t;const n=(t=t.slice(0,s.ceil(e/32))).length;return e&=31,n>0&&e&&(t[n-1]=x.u(e,t[n-1]&2147483648>>e-1,1)),t},u:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,o:t=>s.round(t/1099511627776)||32,i(t,e,n,s){for(void 0===s&&(s=[]);e>=32;e-=32)s.push(n),n=0;if(0===e)return s.concat(t);for(let r=0;r<t.length;r++)s.push(n|t[r]>>>e),n=t[r]<<32-e;const r=t.length?t[t.length-1]:0,o=x.o(r);return s.push(x.u(e+o&31,e+o>32?n:s.pop(),1)),s}},I={bytes:{p(t){const e=x.h(t)/8,n=new o(e);let s;for(let r=0;e>r;r++)3&r||(s=t[r/4]),n[r]=s>>>24,s<<=8;return n},m(t){const e=[];let n,s=0;for(n=0;n<t.length;n++)s=s<<8|t[n],3&~n||(e.push(s),s=0);return 3&n&&e.push(x.u(8*(3&n),s)),e}}},R=class{constructor(t){const e=this;e.blockSize=512,e.S=[1732584193,4023233417,2562383102,271733878,3285377520],e.v=[1518500249,1859775393,2400959708,3395469782],t?(e.k=t.k.slice(0),e.C=t.C.slice(0),e.A=t.A):e.reset()}reset(){const t=this;return t.k=t.S.slice(0),t.C=[],t.A=0,t}update(t){const e=this;\"string\"==typeof t&&(t=I.I.m(t));const n=e.C=x.concat(e.C,t),s=e.A,o=e.A=s+x.h(t);if(o>9007199254740991)throw new r(\"Cannot hash more than 2^53 - 1 bits\");const i=new c(n);let a=0;for(let t=e.blockSize+s-(e.blockSize+s&e.blockSize-1);o>=t;t+=e.blockSize)e.R(i.subarray(16*a,16*(a+1))),a+=1;return n.splice(0,16*a),e}P(){const t=this;let e=t.C;const n=t.k;e=x.concat(e,[x.u(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(s.floor(t.A/4294967296)),e.push(0|t.A);e.length;)t.R(e.splice(0,16));return t.reset(),n}U(t,e,n,s){return t>19?t>39?t>59?t>79?void 0:e^n^s:e&n|e&s|n&s:e^n^s:e&n|~e&s}V(t,e){return e<<t|e>>>32-t}R(e){const n=this,r=n.k,o=t(80);for(let t=0;16>t;t++)o[t]=e[t];let i=r[0],c=r[1],a=r[2],h=r[3],f=r[4];for(let t=0;79>=t;t++){16>t||(o[t]=n.V(1,o[t-3]^o[t-8]^o[t-14]^o[t-16]));const e=n.V(5,i)+n.U(t,c,a,h)+f+o[t]+n.v[s.floor(t/20)]|0;f=h,h=a,a=n.V(30,c),c=i,i=e}r[0]=r[0]+i|0,r[1]=r[1]+c|0,r[2]=r[2]+a|0,r[3]=r[3]+h|0,r[4]=r[4]+f|0}},P={getRandomValues(t){const e=new c(t.buffer),n=t=>{let e=987654321;const n=4294967295;return()=>(e=36969*(65535&e)+(e>>16)&n,(((e<<16)+(t=18e3*(65535&t)+(t>>16)&n)&n)/4294967296+.5)*(s.random()>.5?1:-1))};for(let r,o=0;o<t.length;o+=4){const t=n(4294967296*(r||s.random()));r=987654071*t(),e[o/4]=4294967296*t()|0}return t}},U={importKey:t=>new U.M(I.bytes.m(t)),_(t,e,n,s){if(n=n||1e4,0>s||0>n)throw new r(\"invalid params to pbkdf2\");const o=1+(s>>5)<<2;let i,c,a,h,l;const u=new ArrayBuffer(o),w=new f(u);let p=0;const d=x;for(e=I.bytes.m(e),l=1;(o||1)>p;l++){for(i=c=t.encrypt(d.concat(e,[l])),a=1;n>a;a++)for(c=t.encrypt(c),h=0;h<c.length;h++)i[h]^=c[h];for(a=0;(o||1)>p&&a<i.length;a++)w.setInt32(p,i[a]),p+=4}return u.slice(0,s/8)},M:class{constructor(t){const e=this,n=e.B=R,s=[[],[]];e.D=[new n,new n];const r=e.D[0].blockSize/32;t.length>r&&(t=(new n).update(t).P());for(let e=0;r>e;e++)s[0][e]=909522486^t[e],s[1][e]=1549556828^t[e];e.D[0].update(s[0]),e.D[1].update(s[1]),e.W=new n(e.D[0])}reset(){const t=this;t.W=new t.B(t.D[0]),t.K=!1}update(t){this.K=!0,this.W.update(t)}digest(){const t=this,e=t.W.P(),n=new t.B(t.D[1]).update(e).P();return t.reset(),n}encrypt(t){if(this.K)throw new r(\"encrypt on already updated hmac called!\");return this.update(t),this.digest(t)}}},V=typeof w!=v&&typeof w.getRandomValues==k,M=\"Invalid password\",_=\"Invalid signature\",B=\"zipjs-abort-check-password\";function D(t){return V?w.getRandomValues(t):P.getRandomValues(t)}const W=16,K={name:\"PBKDF2\"},E=e.assign({hash:{name:\"HMAC\"}},K),L=e.assign({iterations:1e3,hash:{name:\"SHA-1\"}},K),O=[\"deriveBits\"],T=[8,12,16],j=[16,24,32],H=10,Z=[0,0,0,0],F=typeof w!=v,N=F&&w.subtle,q=F&&typeof N!=v,G=I.bytes,J=class{constructor(t){const e=this;e.L=[[[],[],[],[],[]],[[],[],[],[],[]]],e.L[0][0][0]||e.O();const n=e.L[0][4],s=e.L[1],o=t.length;let i,c,a,h=1;if(4!==o&&6!==o&&8!==o)throw new r(\"invalid aes key size\");for(e.v=[c=t.slice(0),a=[]],i=o;4*o+28>i;i++){let t=c[i-1];(i%o===0||8===o&&i%o===4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],i%o===0&&(t=t<<8^t>>>24^h<<24,h=h<<1^283*(h>>7))),c[i]=c[i-o]^t}for(let t=0;i;t++,i--){const e=c[3&t?i:i-4];a[t]=4>=i||4>t?e:s[0][n[e>>>24]]^s[1][n[e>>16&255]]^s[2][n[e>>8&255]]^s[3][n[255&e]]}}encrypt(t){return this.T(t,0)}decrypt(t){return this.T(t,1)}O(){const t=this.L[0],e=this.L[1],n=t[4],s=e[4],r=[],o=[];let i,c,a,h;for(let t=0;256>t;t++)o[(r[t]=t<<1^283*(t>>7))^t]=t;for(let f=i=0;!n[f];f^=c||1,i=o[i]||1){let o=i^i<<1^i<<2^i<<3^i<<4;o=o>>8^255&o^99,n[f]=o,s[o]=f,h=r[a=r[c=r[f]]];let l=16843009*h^65537*a^257*c^16843008*f,u=257*r[o]^16843008*o;for(let n=0;4>n;n++)t[n][f]=u=u<<24^u>>>8,e[n][o]=l=l<<24^l>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}T(t,e){if(4!==t.length)throw new r(\"invalid aes block size\");const n=this.v[e],s=n.length/4-2,o=[0,0,0,0],i=this.L[e],c=i[0],a=i[1],h=i[2],f=i[3],l=i[4];let u,w,p,d=t[0]^n[0],y=t[e?3:1]^n[1],m=t[2]^n[2],g=t[e?1:3]^n[3],S=4;for(let t=0;s>t;t++)u=c[d>>>24]^a[y>>16&255]^h[m>>8&255]^f[255&g]^n[S],w=c[y>>>24]^a[m>>16&255]^h[g>>8&255]^f[255&d]^n[S+1],p=c[m>>>24]^a[g>>16&255]^h[d>>8&255]^f[255&y]^n[S+2],g=c[g>>>24]^a[d>>16&255]^h[y>>8&255]^f[255&m]^n[S+3],S+=4,d=u,y=w,m=p;for(let t=0;4>t;t++)o[e?3&-t:t]=l[d>>>24]<<24^l[y>>16&255]<<16^l[m>>8&255]<<8^l[255&g]^n[S++],u=d,d=y,y=m,m=g,g=u;return o}},Q=class{constructor(t,e){this.j=t,this.H=e,this.Z=e}reset(){this.Z=this.H}update(t){return this.F(this.j,t,this.Z)}N(t){if(255&~(t>>24))t+=1<<24;else{let e=t>>16&255,n=t>>8&255,s=255&t;255===e?(e=0,255===n?(n=0,255===s?s=0:++s):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=s}return t}q(t){0===(t[0]=this.N(t[0]))&&(t[1]=this.N(t[1]))}F(t,e,n){let s;if(!(s=e.length))return[];const r=x.h(e);for(let r=0;s>r;r+=4){this.q(n);const s=t.encrypt(n);e[r]^=s[0],e[r+1]^=s[1],e[r+2]^=s[2],e[r+3]^=s[3]}return x.l(e,r)}},X=U.M;let Y=F&&q&&typeof N.importKey==k,$=F&&q&&typeof N.deriveBits==k;class tt extends d{constructor({password:t,rawPassword:n,signed:s,encryptionStrength:i,checkPasswordOnly:c}){super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),signed:s,J:i-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:i,G:a,ready:h}=n;s?(await(async(t,e,n,s)=>{const o=await st(t,e,n,it(s,0,T[e])),i=it(s,T[e]);if(o[0]!=i[0]||o[1]!=i[1])throw new r(M)})(n,i,s,it(t,0,T[i]+2)),t=it(t,T[i]+2),c?e.error(new r(B)):a()):await h;const f=new o(t.length-H-(t.length-H)%W);e.enqueue(nt(n,t,f,0,H,!0))},async flush(t){const{signed:e,X:n,Y:s,pending:i,ready:c}=this;if(s&&n){await c;const a=it(i,0,i.length-H),h=it(i,i.length-H);let f=new o;if(a.length){const t=at(G,a);s.update(t);const e=n.update(t);f=ct(G,e)}if(e){const t=it(ct(G,s.digest()),0,H);for(let e=0;H>e;e++)if(t[e]!=h[e])throw new r(_)}t.enqueue(f)}}})}}class et extends d{constructor({password:t,rawPassword:n,encryptionStrength:s}){let r;super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),J:s-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:r,G:i,ready:c}=n;let a=new o;s?(a=await(async(t,e,n)=>{const s=D(new o(T[e]));return ot(s,await st(t,e,n,s))})(n,r,s),i()):await c;const h=new o(a.length+t.length-t.length%W);h.set(a,0),e.enqueue(nt(n,t,h,a.length,0))},async flush(t){const{X:e,Y:n,pending:s,ready:i}=this;if(n&&e){await i;let c=new o;if(s.length){const t=e.update(at(G,s));n.update(t),c=ct(G,t)}r.signature=ct(G,n.digest()).slice(0,H),t.enqueue(ot(c,r.signature))}}}),r=this}}function nt(t,e,n,s,r,i){const{X:c,Y:a,pending:h}=t,f=e.length-r;let l;for(h.length&&(e=ot(h,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new o(e)).set(n,0)}return t})(n,f-f%W)),l=0;f-W>=l;l+=W){const t=at(G,it(e,l,l+W));i&&a.update(t);const r=c.update(t);i||a.update(r),n.set(ct(G,r),l+s)}return t.pending=it(e,l),n}async function st(n,s,r,i){n.password=null;const c=await(async(t,e,n,s,r)=>{if(!Y)return U.importKey(e);try{return await N.importKey(\"raw\",e,n,!1,r)}catch{return Y=!1,U.importKey(e)}})(0,r,E,0,O),a=await(async(t,e,n)=>{if(!$)return U._(e,t.salt,L.iterations,n);try{return await N.deriveBits(t,e,n)}catch{return $=!1,U._(e,t.salt,L.iterations,n)}})(e.assign({salt:i},L),c,8*(2*j[s]+2)),h=new o(a),f=at(G,it(h,0,j[s])),l=at(G,it(h,j[s],2*j[s])),u=it(h,2*j[s]);return e.assign(n,{keys:{key:f,$:l,passwordVerification:u},X:new Q(new J(f),t.from(Z)),Y:new X(l)}),u}function rt(t,e){return e===b?(t=>{if(typeof u==v){const e=new o((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new u).encode(t)})(t):e}function ot(t,e){let n=t;return t.length+e.length&&(n=new o(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function it(t,e,n){return t.subarray(e,n)}function ct(t,e){return t.p(e)}function at(t,e){return t.m(e)}class ht extends d{constructor({password:t,passwordVerification:n,checkPasswordOnly:s}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;if(n.password){const e=lt(n,t.subarray(0,12));if(n.password=null,e.at(-1)!=n.passwordVerification)throw new r(M);t=t.subarray(12)}s?e.error(new r(B)):e.enqueue(lt(n,t))}})}}class ft extends d{constructor({password:t,passwordVerification:n}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;let s,r;if(n.password){n.password=null;const e=D(new o(12));e[11]=n.passwordVerification,s=new o(t.length+e.length),s.set(ut(n,e),0),r=12}else s=new o(t.length),r=0;s.set(ut(n,t),r),e.enqueue(s)}})}}function lt(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,n[s]);return n}function ut(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,e[s]);return n}function wt(t,n){const s=[305419896,591751049,878082192];e.assign(t,{keys:s,tt:new C(s[0]),et:new C(s[2])});for(let e=0;e<n.length;e++)pt(t,n.charCodeAt(e))}function pt(t,e){let[n,r,o]=t.keys;t.tt.append([e]),n=~t.tt.get(),r=mt(s.imul(mt(r+yt(n)),134775813)+1),t.et.append([r>>>24]),o=~t.et.get(),t.keys=[n,r,o]}function dt(t){const e=2|t.keys[2];return yt(s.imul(e,1^e)>>>8)}function yt(t){return 255&t}function mt(t){return 4294967295&t}class gt extends d{constructor(t,{chunkSize:e,nt:n,CompressionStream:s}){super({});const{compressed:r,encrypted:o,useCompressionStream:i,zipCrypto:c,signed:a,level:h}=t,l=this;let u,w,p=super.readable;o&&!c||!a||(u=new A,p=kt(p,u)),r&&(p=vt(p,i,{level:h,chunkSize:e},s,n,s)),o&&(c?p=kt(p,new ft(t)):(w=new et(t),p=kt(p,w))),bt(l,p,()=>{let t;o&&!c&&(t=w.signature),o&&!c||!a||(t=new f(u.value.buffer).getUint32(0)),l.signature=t})}}class St extends d{constructor(t,{chunkSize:e,st:n,DecompressionStream:s}){super({});const{zipCrypto:o,encrypted:i,signed:c,signature:a,compressed:h,useCompressionStream:l,rt:u}=t;let w,p,d=super.readable;i&&(o?d=kt(d,new ht(t)):(p=new tt(t),d=kt(d,p))),h&&(d=vt(d,l,{chunkSize:e,rt:u},s,n,s)),i&&!o||!c||(w=new A,d=kt(d,w)),bt(this,d,()=>{if((!i||o)&&c){const t=new f(w.value.buffer);if(a!=t.getUint32(0,!1))throw new r(_)}})}}function bt(t,n,s){n=kt(n,new d({flush:s})),e.defineProperty(t,\"readable\",{get:()=>n})}function vt(t,e,n,s,r,o){const i=e&&s?s:r||o,c=n.rt?\"deflate64-raw\":\"deflate-raw\";try{t=kt(t,new i(c,n))}catch(s){if(!e)throw s;if(r)t=kt(t,new r(c,n));else{if(!o)throw s;t=kt(t,new o(c,n))}}return t}function kt(t,e){return t.pipeThrough(e)}const zt=\"data\",Ct=\"close\";class At extends d{constructor(t,n){super({});const s=this,{codecType:o}=t;let i;o.startsWith(\"deflate\")?i=gt:o.startsWith(\"inflate\")&&(i=St),s.outputSize=0;let c=0;const a=new i(t,n),h=super.readable,f=new d({transform(t,e){t&&t.length&&(c+=t.length,e.enqueue(t))},flush(){e.assign(s,{inputSize:c})}}),l=new d({transform(e,n){if(e&&e.length&&(n.enqueue(e),s.outputSize+=e.length,t.outputSize!==b&&s.outputSize>t.outputSize))throw new r(\"Invalid uncompressed size\")},flush(){const{signature:t}=a;e.assign(s,{signature:t,inputSize:c})}});e.defineProperty(s,\"readable\",{get:()=>h.pipeThrough(f).pipeThrough(a).pipeThrough(l)})}}class xt extends d{constructor(t){let e;super({transform:function n(s,r){if(e){const t=new o(e.length+s.length);t.set(e),t.set(s,e.length),s=t,e=null}s.length>t?(r.enqueue(s.slice(0,t)),n(s.slice(t),r)):e=s},flush(t){e&&e.length&&t.enqueue(e)}})}}const It=new h,Rt=new h;let Pt,Ut,Vt,Mt,_t,Bt=0;async function Dt(t){try{const{options:e,config:s}=t;if(!e.useCompressionStream)try{await self.initModule(t.config)}catch{e.useCompressionStream=!0}s.CompressionStream=self.CompressionStream,s.DecompressionStream=self.DecompressionStream;const r={highWaterMark:1},o=t.readable||new y({async pull(t){const e=new l(t=>It.set(Bt,t));Wt({type:\"pull\",messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER;const{value:s,done:r}=await e;t.enqueue(s),r&&t.close()}},r),i=t.writable||new m({async write(t){let e;const s=new l(t=>e=t);Rt.set(Bt,e),Wt({type:zt,value:t,messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER,await s}},r),c=new At(e,s);Pt=new AbortController;const{signal:a}=Pt;await o.pipeThrough(c).pipeThrough(new xt(s.chunkSize)).pipeTo(i,{signal:a,preventClose:!0,preventAbort:!0}),await i.getWriter().close();const{signature:h,inputSize:f,outputSize:u}=c;Wt({type:Ct,result:{signature:h,inputSize:f,outputSize:u}})}catch(t){t.outputSize=0,Kt(t)}}function Wt(t){let{value:e}=t;if(e)if(e.length)try{e=new o(e),t.value=e.buffer,p(t,[t.value])}catch{p(t)}else p(t);else p(t)}function Kt(t=new r(\"Unknown error\")){const{message:e,stack:n,code:s,name:o,outputSize:i}=t;p({error:{message:e,stack:n,code:s,name:o,outputSize:i}})}function Et(t,e,n={}){const i=\"number\"==typeof n.level?n.level:-1,c=\"number\"==typeof n.ot?n.ot:65536,a=\"number\"==typeof n.it?n.it:65536;return new d({start(){let n;if(this.ct=Vt(c),this.in=Vt(a),this.it=a,this.ht=new o(c),t?(this.ft=Ut.deflate_process,this.lt=Ut.deflate_last_consumed,this.ut=Ut.deflate_end,this.wt=Ut.deflate_new(),n=\"gzip\"===e?Ut.deflate_init_gzip(this.wt,i):\"deflate-raw\"===e?Ut.deflate_init_raw(this.wt,i):Ut.deflate_init(this.wt,i)):\"deflate64-raw\"===e?(this.ft=Ut.inflate9_process,this.lt=Ut.inflate9_last_consumed,this.ut=Ut.inflate9_end,this.wt=Ut.inflate9_new(),n=Ut.inflate9_init_raw(this.wt)):(this.ft=Ut.inflate_process,this.lt=Ut.inflate_last_consumed,this.ut=Ut.inflate_end,this.wt=Ut.inflate_new(),n=\"deflate-raw\"===e?Ut.inflate_init_raw(this.wt):\"gzip\"===e?Ut.inflate_init_gzip(this.wt):Ut.inflate_init(this.wt)),0!==n)throw new r(\"init failed:\"+n)},transform(e,n){try{const i=e,a=new o(_t.buffer),h=this.ft,f=this.lt,l=this.ct,u=this.ht;let w=0;for(;w<i.length;){const e=s.min(i.length-w,32768);this.in&&this.it>=e||(this.in&&Mt&&Mt(this.in),this.in=Vt(e),this.it=e),a.set(i.subarray(w,w+e),this.in);const o=h(this.wt,this.in,e,l,c,0),p=16777215&o;if(p&&(u.set(a.subarray(l,l+p),0),n.enqueue(u.slice(0,p))),!t){const t=o>>24&255,e=128&t?t-256:t;if(0>e)throw new r(\"process error:\"+e)}const d=f(this.wt);if(0===d)break;w+=d}}catch(t){this.ut&&this.wt&&this.ut(this.wt),this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct),n.error(t)}},flush(e){try{const n=new o(_t.buffer),s=this.ft,i=this.ct,a=this.ht;for(;;){const o=s(this.wt,0,0,i,c,4),h=16777215&o,f=o>>24&255;if(!t){const t=128&f?f-256:f;if(0>t)throw new r(\"process error:\"+t)}if(h&&(a.set(n.subarray(i,i+h),0),e.enqueue(a.slice(0,h))),1===f||0===h)break}}catch(t){e.error(t)}finally{if(this.ut&&this.wt){const t=this.ut(this.wt);0!==t&&e.error(new r(\"end error:\"+t))}this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct)}}})}addEventListener(\"message\",({data:t})=>{const{type:e,messageId:n,value:s,done:r}=t;try{if(\"start\"==e&&Dt(t),e==zt){const t=It.get(n);It.delete(n),t({value:new o(s),done:r})}if(\"ack\"==e){const t=Rt.get(n);Rt.delete(n),t()}e==Ct&&Pt.abort()}catch(t){Kt(t)}});class Lt{constructor(t=\"deflate\",e){return Et(!0,t,e)}}class Ot{constructor(t=\"deflate\",e){return Et(!1,t,e)}}let Tt=!1;self.initModule=async t=>{try{const e=await(async(t,{baseURI:e})=>{if(!Tt){let n,s;try{try{s=new URL(t,e)}catch{}const r=await fetch(s);n=await r.arrayBuffer()}catch(e){if(!t.startsWith(\"data:application/wasm;base64,\"))throw e;n=(t=>{const e=t.split(\",\")[1],n=atob(e),s=n.length,r=new o(s);for(let t=0;s>t;++t)r[t]=n.charCodeAt(t);return r.buffer})(t)}(t=>{if(Ut=t,({malloc:Vt,free:Mt,memory:_t}=Ut),\"function\"!=typeof Vt||\"function\"!=typeof Mt||!_t)throw Ut=Vt=Mt=_t=null,new r(\"Invalid WASM module\")})((await WebAssembly.instantiate(n)).instance.exports),Tt=!0}})(t.wasmURI,t);return t.nt=Lt,t.st=Ot,e}catch{}}});\n";
	t({ workerURI: (t) => {
		const n = "text/javascript";
		if (t) {
			const t = new Blob([e], { type: n });
			return URL.createObjectURL(t);
		}
		return "data:text/javascript," + encodeURIComponent(e);
	} });
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codecs/crc32.js
var table$1 = [];
for (let i = 0; i < 256; i++) {
	let t = i;
	for (let j = 0; j < 8; j++) if (t & 1) t = t >>> 1 ^ 3988292384;
	else t = t >>> 1;
	table$1[i] = t;
}
var Crc32 = class {
	constructor(crc) {
		this.crc = crc || -1;
	}
	append(data) {
		let crc = this.crc | 0;
		for (let offset = 0, length = data.length | 0; offset < length; offset++) crc = crc >>> 8 ^ table$1[(crc ^ data[offset]) & 255];
		this.crc = crc;
	}
	get() {
		return ~this.crc;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/crc32-stream.js
var Crc32Stream = class extends TransformStream {
	constructor() {
		let stream;
		const crc32 = new Crc32();
		super({
			transform(chunk, controller) {
				crc32.append(chunk);
				controller.enqueue(chunk);
			},
			flush() {
				const value = new Uint8Array(4);
				new DataView(value.buffer).setUint32(0, crc32.get());
				stream.value = value;
			}
		});
		stream = this;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/encode-text.js
function encodeText(value) {
	if (typeof TextEncoder == "undefined") {
		value = unescape(encodeURIComponent(value));
		const result = new Uint8Array(value.length);
		for (let i = 0; i < result.length; i++) result[i] = value.charCodeAt(i);
		return result;
	} else return new TextEncoder().encode(value);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codecs/sjcl.js
/** @fileOverview Javascript cryptography implementation.
*
* Crush to remove comments, shorten variable names and
* generally reduce transmission size.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
/** @fileOverview Arrays of bits, encoded as arrays of Numbers.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
/**
* Arrays of bits, encoded as arrays of Numbers.
* @namespace
* @description
* <p>
* These objects are the currency accepted by SJCL's crypto functions.
* </p>
*
* <p>
* Most of our crypto primitives operate on arrays of 4-byte words internally,
* but many of them can take arguments that are not a multiple of 4 bytes.
* This library encodes arrays of bits (whose size need not be a multiple of 8
* bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an
* array of words, 32 bits at a time.  Since the words are double-precision
* floating point numbers, they fit some extra data.  We use this (in a private,
* possibly-changing manner) to encode the number of bits actually  present
* in the last word of the array.
* </p>
*
* <p>
* Because bitwise ops clear this out-of-band data, these arrays can be passed
* to ciphers like AES which want arrays of words.
* </p>
*/
var bitArray = {
	/**
	* Concatenate two bit arrays.
	* @param {bitArray} a1 The first array.
	* @param {bitArray} a2 The second array.
	* @return {bitArray} The concatenation of a1 and a2.
	*/
	concat(a1, a2) {
		if (a1.length === 0 || a2.length === 0) return a1.concat(a2);
		const last = a1[a1.length - 1], shift = bitArray.getPartial(last);
		if (shift === 32) return a1.concat(a2);
		else return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
	},
	/**
	* Find the length of an array of bits.
	* @param {bitArray} a The array.
	* @return {Number} The length of a, in bits.
	*/
	bitLength(a) {
		const l = a.length;
		if (l === 0) return 0;
		const x = a[l - 1];
		return (l - 1) * 32 + bitArray.getPartial(x);
	},
	/**
	* Truncate an array.
	* @param {bitArray} a The array.
	* @param {Number} len The length to truncate to, in bits.
	* @return {bitArray} A new array, truncated to len bits.
	*/
	clamp(a, len) {
		if (a.length * 32 < len) return a;
		a = a.slice(0, Math.ceil(len / 32));
		const l = a.length;
		len = len & 31;
		if (l > 0 && len) a[l - 1] = bitArray.partial(len, a[l - 1] & 2147483648 >> len - 1, 1);
		return a;
	},
	/**
	* Make a partial word for a bit array.
	* @param {Number} len The number of bits in the word.
	* @param {Number} x The bits.
	* @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
	* @return {Number} The partial word.
	*/
	partial(len, x, _end) {
		if (len === 32) return x;
		return (_end ? x | 0 : x << 32 - len) + len * 1099511627776;
	},
	/**
	* Get the number of bits used by a partial word.
	* @param {Number} x The partial word.
	* @return {Number} The number of bits used by the partial word.
	*/
	getPartial(x) {
		return Math.round(x / 1099511627776) || 32;
	},
	/** Shift an array right.
	* @param {bitArray} a The array to shift.
	* @param {Number} shift The number of bits to shift.
	* @param {Number} [carry=0] A byte to carry in
	* @param {bitArray} [out=[]] An array to prepend to the output.
	* @private
	*/
	_shiftRight(a, shift, carry, out) {
		if (out === void 0) out = [];
		for (; shift >= 32; shift -= 32) {
			out.push(carry);
			carry = 0;
		}
		if (shift === 0) return out.concat(a);
		for (let i = 0; i < a.length; i++) {
			out.push(carry | a[i] >>> shift);
			carry = a[i] << 32 - shift;
		}
		const last2 = a.length ? a[a.length - 1] : 0;
		const shift2 = bitArray.getPartial(last2);
		out.push(bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
		return out;
	}
};
/** @fileOverview Bit array codec implementations.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
/**
* Arrays of bytes
* @namespace
*/
var codec = { bytes: {
	/** Convert from a bitArray to an array of bytes. */
	fromBits(arr) {
		const byteLength = bitArray.bitLength(arr) / 8;
		const out = new Uint8Array(byteLength);
		let tmp;
		for (let i = 0; i < byteLength; i++) {
			if ((i & 3) === 0) tmp = arr[i / 4];
			out[i] = tmp >>> 24;
			tmp <<= 8;
		}
		return out;
	},
	/** Convert from an array of bytes to a bitArray. */
	toBits(bytes) {
		const out = [];
		let i;
		let tmp = 0;
		for (i = 0; i < bytes.length; i++) {
			tmp = tmp << 8 | bytes[i];
			if ((i & 3) === 3) {
				out.push(tmp);
				tmp = 0;
			}
		}
		if (i & 3) out.push(bitArray.partial(8 * (i & 3), tmp));
		return out;
	}
} };
var hash = {};
/**
* Context for a SHA-1 operation in progress.
* @constructor
*/
hash.sha1 = class {
	constructor(hash) {
		const sha1 = this;
		/**
		* The hash's block size, in bits.
		* @constant
		*/
		sha1.blockSize = 512;
		/**
		* The SHA-1 initialization vector.
		* @private
		*/
		sha1._init = [
			1732584193,
			4023233417,
			2562383102,
			271733878,
			3285377520
		];
		/**
		* The SHA-1 hash key.
		* @private
		*/
		sha1._key = [
			1518500249,
			1859775393,
			2400959708,
			3395469782
		];
		if (hash) {
			sha1._h = hash._h.slice(0);
			sha1._buffer = hash._buffer.slice(0);
			sha1._length = hash._length;
		} else sha1.reset();
	}
	/**
	* Reset the hash state.
	* @return this
	*/
	reset() {
		const sha1 = this;
		sha1._h = sha1._init.slice(0);
		sha1._buffer = [];
		sha1._length = 0;
		return sha1;
	}
	/**
	* Input several words to the hash.
	* @param {bitArray|String} data the data to hash.
	* @return this
	*/
	update(data) {
		const sha1 = this;
		if (typeof data === "string") data = codec.utf8String.toBits(data);
		const b = sha1._buffer = bitArray.concat(sha1._buffer, data);
		const ol = sha1._length;
		const nl = sha1._length = ol + bitArray.bitLength(data);
		if (nl > 9007199254740991) throw new Error("Cannot hash more than 2^53 - 1 bits");
		const c = new Uint32Array(b);
		let j = 0;
		for (let i = sha1.blockSize + ol - (sha1.blockSize + ol & sha1.blockSize - 1); i <= nl; i += sha1.blockSize) {
			sha1._block(c.subarray(16 * j, 16 * (j + 1)));
			j += 1;
		}
		b.splice(0, 16 * j);
		return sha1;
	}
	/**
	* Complete hashing and output the hash value.
	* @return {bitArray} The hash value, an array of 5 big-endian words. TODO
	*/
	finalize() {
		const sha1 = this;
		let b = sha1._buffer;
		const h = sha1._h;
		b = bitArray.concat(b, [bitArray.partial(1, 1)]);
		for (let i = b.length + 2; i & 15; i++) b.push(0);
		b.push(Math.floor(sha1._length / 4294967296));
		b.push(sha1._length | 0);
		while (b.length) sha1._block(b.splice(0, 16));
		sha1.reset();
		return h;
	}
	/**
	* The SHA-1 logical functions f(0), f(1), ..., f(79).
	* @private
	*/
	_f(t, b, c, d) {
		if (t <= 19) return b & c | ~b & d;
		else if (t <= 39) return b ^ c ^ d;
		else if (t <= 59) return b & c | b & d | c & d;
		else if (t <= 79) return b ^ c ^ d;
	}
	/**
	* Circular left-shift operator.
	* @private
	*/
	_S(n, x) {
		return x << n | x >>> 32 - n;
	}
	/**
	* Perform one cycle of SHA-1.
	* @param {Uint32Array|bitArray} words one block of words.
	* @private
	*/
	_block(words) {
		const sha1 = this;
		const h = sha1._h;
		const w = Array(80);
		for (let j = 0; j < 16; j++) w[j] = words[j];
		let a = h[0];
		let b = h[1];
		let c = h[2];
		let d = h[3];
		let e = h[4];
		for (let t = 0; t <= 79; t++) {
			if (t >= 16) w[t] = sha1._S(1, w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]);
			const tmp = sha1._S(5, a) + sha1._f(t, b, c, d) + e + w[t] + sha1._key[Math.floor(t / 20)] | 0;
			e = d;
			d = c;
			c = sha1._S(30, b);
			b = a;
			a = tmp;
		}
		h[0] = h[0] + a | 0;
		h[1] = h[1] + b | 0;
		h[2] = h[2] + c | 0;
		h[3] = h[3] + d | 0;
		h[4] = h[4] + e | 0;
	}
};
/** @fileOverview Low-level AES implementation.
*
* This file contains a low-level implementation of AES, optimized for
* size and for efficiency on several browsers.  It is based on
* OpenSSL's aes_core.c, a public-domain implementation by Vincent
* Rijmen, Antoon Bosselaers and Paulo Barreto.
*
* An older version of this implementation is available in the public
* domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
* Stanford University 2008-2010 and BSD-licensed for liability
* reasons.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
var cipher = {};
/**
* Schedule out an AES key for both encryption and decryption.  This
* is a low-level class.  Use a cipher mode to do bulk encryption.
*
* @constructor
* @param {Array} key The key as an array of 4, 6 or 8 words.
*/
cipher.aes = class {
	constructor(key) {
		/**
		* The expanded S-box and inverse S-box tables.  These will be computed
		* on the client so that we don't have to send them down the wire.
		*
		* There are two tables, _tables[0] is for encryption and
		* _tables[1] is for decryption.
		*
		* The first 4 sub-tables are the expanded S-box with MixColumns.  The
		* last (_tables[01][4]) is the S-box itself.
		*
		* @private
		*/
		const aes = this;
		aes._tables = [[
			[],
			[],
			[],
			[],
			[]
		], [
			[],
			[],
			[],
			[],
			[]
		]];
		if (!aes._tables[0][0][0]) aes._precompute();
		const sbox = aes._tables[0][4];
		const decTable = aes._tables[1];
		const keyLen = key.length;
		let i, encKey, decKey, rcon = 1;
		if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) throw new Error("invalid aes key size");
		aes._key = [encKey = key.slice(0), decKey = []];
		for (i = keyLen; i < 4 * keyLen + 28; i++) {
			let tmp = encKey[i - 1];
			if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
				tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
				if (i % keyLen === 0) {
					tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
					rcon = rcon << 1 ^ (rcon >> 7) * 283;
				}
			}
			encKey[i] = encKey[i - keyLen] ^ tmp;
		}
		for (let j = 0; i; j++, i--) {
			const tmp = encKey[j & 3 ? i : i - 4];
			if (i <= 4 || j < 4) decKey[j] = tmp;
			else decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
		}
	}
	/**
	* Encrypt an array of 4 big-endian words.
	* @param {Array} data The plaintext.
	* @return {Array} The ciphertext.
	*/
	encrypt(data) {
		return this._crypt(data, 0);
	}
	/**
	* Decrypt an array of 4 big-endian words.
	* @param {Array} data The ciphertext.
	* @return {Array} The plaintext.
	*/
	decrypt(data) {
		return this._crypt(data, 1);
	}
	/**
	* Expand the S-box tables.
	*
	* @private
	*/
	_precompute() {
		const encTable = this._tables[0];
		const decTable = this._tables[1];
		const sbox = encTable[4];
		const sboxInv = decTable[4];
		const d = [];
		const th = [];
		let xInv, x2, x4, x8;
		for (let i = 0; i < 256; i++) th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
		for (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
			let s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
			s = s >> 8 ^ s & 255 ^ 99;
			sbox[x] = s;
			sboxInv[s] = x;
			x8 = d[x4 = d[x2 = d[x]]];
			let tDec = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
			let tEnc = d[s] * 257 ^ s * 16843008;
			for (let i = 0; i < 4; i++) {
				encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
				decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
			}
		}
		for (let i = 0; i < 5; i++) {
			encTable[i] = encTable[i].slice(0);
			decTable[i] = decTable[i].slice(0);
		}
	}
	/**
	* Encryption and decryption core.
	* @param {Array} input Four words to be encrypted or decrypted.
	* @param dir The direction, 0 for encrypt and 1 for decrypt.
	* @return {Array} The four encrypted or decrypted words.
	* @private
	*/
	_crypt(input, dir) {
		if (input.length !== 4) throw new Error("invalid aes block size");
		const key = this._key[dir];
		const nInnerRounds = key.length / 4 - 2;
		const out = [
			0,
			0,
			0,
			0
		];
		const table = this._tables[dir];
		const t0 = table[0];
		const t1 = table[1];
		const t2 = table[2];
		const t3 = table[3];
		const sbox = table[4];
		let a = input[0] ^ key[0];
		let b = input[dir ? 3 : 1] ^ key[1];
		let c = input[2] ^ key[2];
		let d = input[dir ? 1 : 3] ^ key[3];
		let kIndex = 4;
		let a2, b2, c2;
		for (let i = 0; i < nInnerRounds; i++) {
			a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
			b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
			c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
			d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
			kIndex += 4;
			a = a2;
			b = b2;
			c = c2;
		}
		for (let i = 0; i < 4; i++) {
			out[dir ? 3 & -i : i] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
			a2 = a;
			a = b;
			b = c;
			c = d;
			d = a2;
		}
		return out;
	}
};
/**
* Random values
* @namespace
*/
var random = { 
/** 
* Generate random words with pure js, cryptographically not as strong & safe as native implementation.
* @param {TypedArray} typedArray The array to fill.
* @return {TypedArray} The random values.
*/
getRandomValues(typedArray) {
	const words = new Uint32Array(typedArray.buffer);
	const r = (m_w) => {
		let m_z = 987654321;
		const mask = 4294967295;
		return function() {
			m_z = 36969 * (m_z & 65535) + (m_z >> 16) & mask;
			m_w = 18e3 * (m_w & 65535) + (m_w >> 16) & mask;
			return (((m_z << 16) + m_w & mask) / 4294967296 + .5) * (Math.random() > .5 ? 1 : -1);
		};
	};
	for (let i = 0, rcache; i < typedArray.length; i += 4) {
		const _r = r((rcache || Math.random()) * 4294967296);
		rcache = _r() * 987654071;
		words[i / 4] = _r() * 4294967296 | 0;
	}
	return typedArray;
} };
/** @fileOverview CTR mode implementation.
*
* Special thanks to Roy Nicholson for pointing out a bug in our
* implementation.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
/** Brian Gladman's CTR Mode.
* @constructor
* @param {Object} _prf The aes instance to generate key.
* @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.
*/
var mode = {};
/**
* Brian Gladman's CTR Mode.
* @namespace
*/
mode.ctrGladman = class {
	constructor(prf, iv) {
		this._prf = prf;
		this._initIv = iv;
		this._iv = iv;
	}
	reset() {
		this._iv = this._initIv;
	}
	/** Input some data to calculate.
	* @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
	*/
	update(data) {
		return this.calculate(this._prf, data, this._iv);
	}
	incWord(word) {
		if ((word >> 24 & 255) === 255) {
			let b1 = word >> 16 & 255;
			let b2 = word >> 8 & 255;
			let b3 = word & 255;
			if (b1 === 255) {
				b1 = 0;
				if (b2 === 255) {
					b2 = 0;
					if (b3 === 255) b3 = 0;
					else ++b3;
				} else ++b2;
			} else ++b1;
			word = 0;
			word += b1 << 16;
			word += b2 << 8;
			word += b3;
		} else word += 1 << 24;
		return word;
	}
	incCounter(counter) {
		if ((counter[0] = this.incWord(counter[0])) === 0) counter[1] = this.incWord(counter[1]);
	}
	calculate(prf, data, iv) {
		let l;
		if (!(l = data.length)) return [];
		const bl = bitArray.bitLength(data);
		for (let i = 0; i < l; i += 4) {
			this.incCounter(iv);
			const e = prf.encrypt(iv);
			data[i] ^= e[0];
			data[i + 1] ^= e[1];
			data[i + 2] ^= e[2];
			data[i + 3] ^= e[3];
		}
		return bitArray.clamp(data, bl);
	}
};
var misc = {
	importKey(password) {
		return new misc.hmacSha1(codec.bytes.toBits(password));
	},
	pbkdf2(prf, salt, count, length) {
		count = count || 1e4;
		if (length < 0 || count < 0) throw new Error("invalid params to pbkdf2");
		const byteLength = (length >> 5) + 1 << 2;
		let u, ui, i, j, k;
		const arrayBuffer = new ArrayBuffer(byteLength);
		const out = new DataView(arrayBuffer);
		let outLength = 0;
		const b = bitArray;
		salt = codec.bytes.toBits(salt);
		for (k = 1; outLength < (byteLength || 1); k++) {
			u = ui = prf.encrypt(b.concat(salt, [k]));
			for (i = 1; i < count; i++) {
				ui = prf.encrypt(ui);
				for (j = 0; j < ui.length; j++) u[j] ^= ui[j];
			}
			for (i = 0; outLength < (byteLength || 1) && i < u.length; i++) {
				out.setInt32(outLength, u[i]);
				outLength += 4;
			}
		}
		return arrayBuffer.slice(0, length / 8);
	}
};
/** @fileOverview HMAC implementation.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
/** HMAC with the specified hash function.
* @constructor
* @param {bitArray} key the key for HMAC.
* @param {Object} [Hash=hash.sha1] The hash function to use.
*/
misc.hmacSha1 = class {
	constructor(key) {
		const hmac = this;
		const Hash = hmac._hash = hash.sha1;
		const exKey = [[], []];
		hmac._baseHash = [new Hash(), new Hash()];
		const bs = hmac._baseHash[0].blockSize / 32;
		if (key.length > bs) key = new Hash().update(key).finalize();
		for (let i = 0; i < bs; i++) {
			exKey[0][i] = key[i] ^ 909522486;
			exKey[1][i] = key[i] ^ 1549556828;
		}
		hmac._baseHash[0].update(exKey[0]);
		hmac._baseHash[1].update(exKey[1]);
		hmac._resultHash = new Hash(hmac._baseHash[0]);
	}
	reset() {
		const hmac = this;
		hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
		hmac._updated = false;
	}
	update(data) {
		const hmac = this;
		hmac._updated = true;
		hmac._resultHash.update(data);
	}
	digest() {
		const hmac = this;
		const w = hmac._resultHash.finalize();
		const result = new hmac._hash(hmac._baseHash[1]).update(w).finalize();
		hmac.reset();
		return result;
	}
	encrypt(data) {
		if (!this._updated) {
			this.update(data);
			return this.digest(data);
		} else throw new Error("encrypt on already updated hmac called!");
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/common-crypto.js
var GET_RANDOM_VALUES_SUPPORTED = typeof crypto != "undefined" && typeof crypto.getRandomValues == "function";
var ERR_INVALID_PASSWORD = "Invalid password";
var ERR_INVALID_SIGNATURE = "Invalid signature";
var ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
function getRandomValues(array) {
	if (GET_RANDOM_VALUES_SUPPORTED) return crypto.getRandomValues(array);
	else return random.getRandomValues(array);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/aes-crypto-stream.js
var BLOCK_LENGTH = 16;
var RAW_FORMAT = "raw";
var PBKDF2_ALGORITHM = { name: "PBKDF2" };
var HASH_ALGORITHM = { name: "HMAC" };
var HASH_FUNCTION = "SHA-1";
var BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
var DERIVED_BITS_ALGORITHM = Object.assign({
	iterations: 1e3,
	hash: { name: HASH_FUNCTION }
}, PBKDF2_ALGORITHM);
var DERIVED_BITS_USAGE = ["deriveBits"];
var SALT_LENGTH = [
	8,
	12,
	16
];
var KEY_LENGTH = [
	16,
	24,
	32
];
var SIGNATURE_LENGTH = 10;
var COUNTER_DEFAULT_VALUE = [
	0,
	0,
	0,
	0
];
var CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
var subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
var SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != "undefined";
var codecBytes = codec.bytes;
var Aes = cipher.aes;
var CtrGladman = mode.ctrGladman;
var HmacSha1 = misc.hmacSha1;
var IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == "function";
var DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == "function";
var AESDecryptionStream = class extends TransformStream {
	constructor({ password, rawPassword, signed, encryptionStrength, checkPasswordOnly }) {
		super({
			start() {
				Object.assign(this, {
					ready: new Promise((resolve) => this.resolveReady = resolve),
					password: encodePassword(password, rawPassword),
					signed,
					strength: encryptionStrength - 1,
					pending: new Uint8Array()
				});
			},
			async transform(chunk, controller) {
				const aesCrypto = this;
				const { password, strength, resolveReady, ready } = aesCrypto;
				if (password) {
					await createDecryptionKeys(aesCrypto, strength, password, subarray(chunk, 0, SALT_LENGTH[strength] + 2));
					chunk = subarray(chunk, SALT_LENGTH[strength] + 2);
					if (checkPasswordOnly) controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
					else resolveReady();
				} else await ready;
				const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - (chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH);
				controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
			},
			async flush(controller) {
				const { signed, ctr, hmac, pending, ready } = this;
				if (hmac && ctr) {
					await ready;
					const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
					const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
					let decryptedChunkArray = new Uint8Array();
					if (chunkToDecrypt.length) {
						const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
						hmac.update(encryptedChunk);
						decryptedChunkArray = fromBits(codecBytes, ctr.update(encryptedChunk));
					}
					if (signed) {
						const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
						for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) if (signature[indexSignature] != originalSignature[indexSignature]) throw new Error(ERR_INVALID_SIGNATURE);
					}
					controller.enqueue(decryptedChunkArray);
				}
			}
		});
	}
};
var AESEncryptionStream = class extends TransformStream {
	constructor({ password, rawPassword, encryptionStrength }) {
		let stream;
		super({
			start() {
				Object.assign(this, {
					ready: new Promise((resolve) => this.resolveReady = resolve),
					password: encodePassword(password, rawPassword),
					strength: encryptionStrength - 1,
					pending: new Uint8Array()
				});
			},
			async transform(chunk, controller) {
				const aesCrypto = this;
				const { password, strength, resolveReady, ready } = aesCrypto;
				let preamble = new Uint8Array();
				if (password) {
					preamble = await createEncryptionKeys(aesCrypto, strength, password);
					resolveReady();
				} else await ready;
				const output = new Uint8Array(preamble.length + chunk.length - chunk.length % BLOCK_LENGTH);
				output.set(preamble, 0);
				controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));
			},
			async flush(controller) {
				const { ctr, hmac, pending, ready } = this;
				if (hmac && ctr) {
					await ready;
					let encryptedChunkArray = new Uint8Array();
					if (pending.length) {
						const encryptedChunk = ctr.update(toBits(codecBytes, pending));
						hmac.update(encryptedChunk);
						encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
					}
					stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
					controller.enqueue(concat(encryptedChunkArray, stream.signature));
				}
			}
		});
		stream = this;
	}
};
function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
	const { ctr, hmac, pending } = aesCrypto;
	const inputLength = input.length - paddingEnd;
	if (pending.length) {
		input = concat(pending, input);
		output = expand(output, inputLength - inputLength % BLOCK_LENGTH);
	}
	let offset;
	for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
		const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
		if (verifySignature) hmac.update(inputChunk);
		const outputChunk = ctr.update(inputChunk);
		if (!verifySignature) hmac.update(outputChunk);
		output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
	}
	aesCrypto.pending = subarray(input, offset);
	return output;
}
async function createDecryptionKeys(decrypt, strength, password, preamble) {
	const passwordVerificationKey = await createKeys$1(decrypt, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
	const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
	if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) throw new Error(ERR_INVALID_PASSWORD);
}
async function createEncryptionKeys(encrypt, strength, password) {
	const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
	return concat(salt, await createKeys$1(encrypt, strength, password, salt));
}
async function createKeys$1(aesCrypto, strength, password, salt) {
	aesCrypto.password = null;
	const baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
	const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * (KEY_LENGTH[strength] * 2 + 2));
	const compositeKey = new Uint8Array(derivedBits);
	const key = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));
	const authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));
	const passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);
	Object.assign(aesCrypto, {
		keys: {
			key,
			authentication,
			passwordVerification
		},
		ctr: new CtrGladman(new Aes(key), Array.from(COUNTER_DEFAULT_VALUE)),
		hmac: new HmacSha1(authentication)
	});
	return passwordVerification;
}
async function importKey(format, password, algorithm, extractable, keyUsages) {
	if (IMPORT_KEY_SUPPORTED) try {
		return await subtle.importKey(format, password, algorithm, extractable, keyUsages);
	} catch {
		IMPORT_KEY_SUPPORTED = false;
		return misc.importKey(password);
	}
	else return misc.importKey(password);
}
async function deriveBits(algorithm, baseKey, length) {
	if (DERIVE_BITS_SUPPORTED) try {
		return await subtle.deriveBits(algorithm, baseKey, length);
	} catch {
		DERIVE_BITS_SUPPORTED = false;
		return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
	}
	else return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
}
function encodePassword(password, rawPassword) {
	if (rawPassword === void 0) return encodeText(password);
	else return rawPassword;
}
function concat(leftArray, rightArray) {
	let array = leftArray;
	if (leftArray.length + rightArray.length) {
		array = new Uint8Array(leftArray.length + rightArray.length);
		array.set(leftArray, 0);
		array.set(rightArray, leftArray.length);
	}
	return array;
}
function expand(inputArray, length) {
	if (length && length > inputArray.length) {
		const array = inputArray;
		inputArray = new Uint8Array(length);
		inputArray.set(array, 0);
	}
	return inputArray;
}
function subarray(array, begin, end) {
	return array.subarray(begin, end);
}
function fromBits(codecBytes, chunk) {
	return codecBytes.fromBits(chunk);
}
function toBits(codecBytes, chunk) {
	return codecBytes.toBits(chunk);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zip-crypto-stream.js
var HEADER_LENGTH = 12;
var ZipCryptoDecryptionStream = class extends TransformStream {
	constructor({ password, passwordVerification, checkPasswordOnly }) {
		super({
			start() {
				Object.assign(this, {
					password,
					passwordVerification
				});
				createKeys(this, password);
			},
			transform(chunk, controller) {
				const zipCrypto = this;
				if (zipCrypto.password) {
					const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
					zipCrypto.password = null;
					if (decryptedHeader.at(-1) != zipCrypto.passwordVerification) throw new Error(ERR_INVALID_PASSWORD);
					chunk = chunk.subarray(HEADER_LENGTH);
				}
				if (checkPasswordOnly) controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
				else controller.enqueue(decrypt(zipCrypto, chunk));
			}
		});
	}
};
var ZipCryptoEncryptionStream = class extends TransformStream {
	constructor({ password, passwordVerification }) {
		super({
			start() {
				Object.assign(this, {
					password,
					passwordVerification
				});
				createKeys(this, password);
			},
			transform(chunk, controller) {
				const zipCrypto = this;
				let output;
				let offset;
				if (zipCrypto.password) {
					zipCrypto.password = null;
					const header = getRandomValues(new Uint8Array(HEADER_LENGTH));
					header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
					output = new Uint8Array(chunk.length + header.length);
					output.set(encrypt(zipCrypto, header), 0);
					offset = HEADER_LENGTH;
				} else {
					output = new Uint8Array(chunk.length);
					offset = 0;
				}
				output.set(encrypt(zipCrypto, chunk), offset);
				controller.enqueue(output);
			}
		});
	}
};
function decrypt(target, input) {
	const output = new Uint8Array(input.length);
	for (let index = 0; index < input.length; index++) {
		output[index] = getByte(target) ^ input[index];
		updateKeys(target, output[index]);
	}
	return output;
}
function encrypt(target, input) {
	const output = new Uint8Array(input.length);
	for (let index = 0; index < input.length; index++) {
		output[index] = getByte(target) ^ input[index];
		updateKeys(target, input[index]);
	}
	return output;
}
function createKeys(target, password) {
	const keys = [
		305419896,
		591751049,
		878082192
	];
	Object.assign(target, {
		keys,
		crcKey0: new Crc32(keys[0]),
		crcKey2: new Crc32(keys[2])
	});
	for (let index = 0; index < password.length; index++) updateKeys(target, password.charCodeAt(index));
}
function updateKeys(target, byte) {
	let [key0, key1, key2] = target.keys;
	target.crcKey0.append([byte]);
	key0 = ~target.crcKey0.get();
	key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
	target.crcKey2.append([key1 >>> 24]);
	key2 = ~target.crcKey2.get();
	target.keys = [
		key0,
		key1,
		key2
	];
}
function getByte(target) {
	const temp = target.keys[2] | 2;
	return getInt8(Math.imul(temp, temp ^ 1) >>> 8);
}
function getInt8(number) {
	return number & 255;
}
function getInt32(number) {
	return number & 4294967295;
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zip-entry-stream.js
var ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
var FORMAT_DEFLATE_RAW = "deflate-raw";
var FORMAT_DEFLATE64_RAW = "deflate64-raw";
var DeflateStream = class extends TransformStream {
	constructor(options, { chunkSize, CompressionStreamZlib, CompressionStream }) {
		super({});
		const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level } = options;
		const stream = this;
		let crc32Stream, encryptionStream;
		let readable = super.readable;
		if ((!encrypted || zipCrypto) && signed) {
			crc32Stream = new Crc32Stream();
			readable = pipeThrough(readable, crc32Stream);
		}
		if (compressed) readable = pipeThroughCommpressionStream(readable, useCompressionStream, {
			level,
			chunkSize
		}, CompressionStream, CompressionStreamZlib, CompressionStream);
		if (encrypted) if (zipCrypto) readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
		else {
			encryptionStream = new AESEncryptionStream(options);
			readable = pipeThrough(readable, encryptionStream);
		}
		setReadable(stream, readable, () => {
			let signature;
			if (encrypted && !zipCrypto) signature = encryptionStream.signature;
			if ((!encrypted || zipCrypto) && signed) signature = new DataView(crc32Stream.value.buffer).getUint32(0);
			stream.signature = signature;
		});
	}
};
var InflateStream = class extends TransformStream {
	constructor(options, { chunkSize, DecompressionStreamZlib, DecompressionStream }) {
		super({});
		const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64 } = options;
		let crc32Stream, decryptionStream;
		let readable = super.readable;
		if (encrypted) if (zipCrypto) readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
		else {
			decryptionStream = new AESDecryptionStream(options);
			readable = pipeThrough(readable, decryptionStream);
		}
		if (compressed) readable = pipeThroughCommpressionStream(readable, useCompressionStream, {
			chunkSize,
			deflate64
		}, DecompressionStream, DecompressionStreamZlib, DecompressionStream);
		if ((!encrypted || zipCrypto) && signed) {
			crc32Stream = new Crc32Stream();
			readable = pipeThrough(readable, crc32Stream);
		}
		setReadable(this, readable, () => {
			if ((!encrypted || zipCrypto) && signed) {
				if (signature != new DataView(crc32Stream.value.buffer).getUint32(0, false)) throw new Error(ERR_INVALID_SIGNATURE);
			}
		});
	}
};
function setReadable(stream, readable, flush) {
	readable = pipeThrough(readable, new TransformStream({ flush }));
	Object.defineProperty(stream, "readable", { get() {
		return readable;
	} });
}
function pipeThroughCommpressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib, CompressionStream) {
	const Stream = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib || CompressionStream;
	const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
	try {
		readable = pipeThrough(readable, new Stream(format, options));
	} catch (error) {
		if (useCompressionStream) if (CompressionStreamZlib) readable = pipeThrough(readable, new CompressionStreamZlib(format, options));
		else if (CompressionStream) readable = pipeThrough(readable, new CompressionStream(format, options));
		else throw error;
		else throw error;
	}
	return readable;
}
function pipeThrough(readable, transformStream) {
	return readable.pipeThrough(transformStream);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codec-stream.js
var MESSAGE_EVENT_TYPE = "message";
var MESSAGE_START = "start";
var MESSAGE_DATA = "data";
var MESSAGE_CLOSE = "close";
var CODEC_DEFLATE = "deflate";
var CODEC_INFLATE = "inflate";
var CodecStream = class extends TransformStream {
	constructor(options, config) {
		super({});
		const codec = this;
		const { codecType } = options;
		let Stream;
		if (codecType.startsWith("deflate")) Stream = DeflateStream;
		else if (codecType.startsWith("inflate")) Stream = InflateStream;
		codec.outputSize = 0;
		let inputSize = 0;
		const stream = new Stream(options, config);
		const readable = super.readable;
		const inputSizeStream = new TransformStream({
			transform(chunk, controller) {
				if (chunk && chunk.length) {
					inputSize += chunk.length;
					controller.enqueue(chunk);
				}
			},
			flush() {
				Object.assign(codec, { inputSize });
			}
		});
		const outputSizeStream = new TransformStream({
			transform(chunk, controller) {
				if (chunk && chunk.length) {
					controller.enqueue(chunk);
					codec.outputSize += chunk.length;
					if (options.outputSize !== void 0 && codec.outputSize > options.outputSize) throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
				}
			},
			flush() {
				const { signature } = stream;
				Object.assign(codec, {
					signature,
					inputSize
				});
			}
		});
		Object.defineProperty(codec, "readable", { get() {
			return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
		} });
	}
};
var ChunkStream = class extends TransformStream {
	constructor(chunkSize) {
		let pendingChunk;
		super({
			transform,
			flush(controller) {
				if (pendingChunk && pendingChunk.length) controller.enqueue(pendingChunk);
			}
		});
		function transform(chunk, controller) {
			if (pendingChunk) {
				const newChunk = new Uint8Array(pendingChunk.length + chunk.length);
				newChunk.set(pendingChunk);
				newChunk.set(chunk, pendingChunk.length);
				chunk = newChunk;
				pendingChunk = null;
			}
			if (chunk.length > chunkSize) {
				controller.enqueue(chunk.slice(0, chunkSize));
				transform(chunk.slice(chunkSize), controller);
			} else pendingChunk = chunk;
		}
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/codec-worker.js
var MODULE_WORKER_OPTIONS = { type: "module" };
var webWorkerSupported, webWorkerURI, webWorkerOptions;
var transferStreamsSupported = true;
try {
	transferStreamsSupported = typeof structuredClone == "function" && structuredClone(new DOMException("", "AbortError")).code !== void 0;
} catch {}
var initModule$1 = () => {};
function configureWorker({ initModule: initModuleFunction }) {
	initModule$1 = initModuleFunction;
}
var CodecWorker = class {
	constructor(workerData, { readable, writable }, { options, config, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
		const { signal } = streamOptions;
		Object.assign(workerData, {
			busy: true,
			readable: readable.pipeThrough(new ChunkStream(config.chunkSize)).pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
			writable,
			options: Object.assign({}, options),
			workerURI,
			transferStreams,
			terminate() {
				return new Promise((resolve) => {
					const { worker, busy } = workerData;
					if (worker) {
						if (busy) workerData.resolveTerminated = resolve;
						else {
							worker.terminate();
							resolve();
						}
						workerData.interface = null;
					} else resolve();
				});
			},
			onTaskFinished() {
				const { resolveTerminated } = workerData;
				if (resolveTerminated) {
					workerData.resolveTerminated = null;
					workerData.terminated = true;
					workerData.worker.terminate();
					resolveTerminated();
				}
				workerData.busy = false;
				onTaskFinished(workerData);
			}
		});
		if (webWorkerSupported === void 0) webWorkerSupported = typeof Worker != UNDEFINED_TYPE;
		return (useWebWorkers && webWorkerSupported ? createWebWorkerInterface : createWorkerInterface)(workerData, config);
	}
};
var ProgressWatcherStream = class extends TransformStream {
	constructor({ onstart, onprogress, size, onend }) {
		let chunkOffset = 0;
		super({
			async start() {
				if (onstart) await callHandler(onstart, size);
			},
			async transform(chunk, controller) {
				chunkOffset += chunk.length;
				if (onprogress) await callHandler(onprogress, chunkOffset, size);
				controller.enqueue(chunk);
			},
			async flush() {
				if (onend) await callHandler(onend, chunkOffset);
			}
		});
	}
};
async function callHandler(handler, ...parameters) {
	try {
		await handler(...parameters);
	} catch {}
}
function createWorkerInterface(workerData, config) {
	return { run: () => runWorker$1(workerData, config) };
}
function createWebWorkerInterface(workerData, config) {
	const { baseURI, chunkSize } = config;
	let { wasmURI } = config;
	if (!workerData.interface) {
		if (typeof wasmURI == "function") wasmURI = wasmURI();
		let worker;
		try {
			worker = getWebWorker(workerData.workerURI, baseURI, workerData);
		} catch {
			webWorkerSupported = false;
			return createWorkerInterface(workerData, config);
		}
		Object.assign(workerData, {
			worker,
			interface: { run: () => runWebWorker(workerData, {
				chunkSize,
				wasmURI,
				baseURI
			}) }
		});
	}
	return workerData.interface;
}
async function runWorker$1({ options, readable, writable, onTaskFinished }, config) {
	let codecStream;
	try {
		if (!options.useCompressionStream) try {
			await initModule$1(config);
		} catch {
			options.useCompressionStream = true;
		}
		codecStream = new CodecStream(options, config);
		await readable.pipeThrough(codecStream).pipeTo(writable, {
			preventClose: true,
			preventAbort: true
		});
		const { signature, inputSize, outputSize } = codecStream;
		return {
			signature,
			inputSize,
			outputSize
		};
	} catch (error) {
		if (codecStream) error.outputSize = codecStream.outputSize;
		throw error;
	} finally {
		onTaskFinished();
	}
}
async function runWebWorker(workerData, config) {
	let resolveResult, rejectResult;
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve;
		rejectResult = reject;
	});
	Object.assign(workerData, {
		reader: null,
		writer: null,
		resolveResult,
		rejectResult,
		result
	});
	const { readable, options } = workerData;
	const { writable, closed } = watchClosedStream(workerData.writable);
	const streamsTransferred = sendMessage({
		type: MESSAGE_START,
		options,
		config,
		readable,
		writable
	}, workerData);
	if (!streamsTransferred) Object.assign(workerData, {
		reader: readable.getReader(),
		writer: writable.getWriter()
	});
	const resultValue = await result;
	if (!streamsTransferred) await writable.getWriter().close();
	await closed;
	return resultValue;
}
function watchClosedStream(writableSource) {
	const { writable, readable } = new TransformStream();
	return {
		writable,
		closed: readable.pipeTo(writableSource, { preventClose: true })
	};
}
function getWebWorker(url, baseURI, workerData, isModuleType, useBlobURI = true) {
	let worker, resolvedURI, resolvedOptions;
	if (webWorkerURI === void 0) {
		const isFunctionURI = typeof url == FUNCTION_TYPE;
		if (isFunctionURI) resolvedURI = url(useBlobURI);
		else resolvedURI = url;
		const isDataURI = resolvedURI.startsWith("data:");
		const isBlobURI = resolvedURI.startsWith("blob:");
		if (isDataURI || isBlobURI) {
			if (isModuleType === void 0) isModuleType = false;
			if (isModuleType) resolvedOptions = MODULE_WORKER_OPTIONS;
			try {
				worker = new Worker(resolvedURI, resolvedOptions);
			} catch (error) {
				if (isBlobURI) try {
					URL.revokeObjectURL(resolvedURI);
				} catch {}
				if (isFunctionURI && isBlobURI) return getWebWorker(url, baseURI, workerData, isModuleType, false);
				else if (!isModuleType) return getWebWorker(url, baseURI, workerData, true, false);
				else throw error;
			}
		} else {
			if (isModuleType === void 0) isModuleType = true;
			if (isModuleType) resolvedOptions = MODULE_WORKER_OPTIONS;
			try {
				resolvedURI = new URL(resolvedURI, baseURI);
			} catch {}
			try {
				worker = new Worker(resolvedURI, resolvedOptions);
			} catch (error) {
				if (!isModuleType) return getWebWorker(url, baseURI, workerData, false, useBlobURI);
				else throw error;
			}
		}
		webWorkerURI = resolvedURI;
		webWorkerOptions = resolvedOptions;
	} else worker = new Worker(webWorkerURI, webWorkerOptions);
	worker.addEventListener(MESSAGE_EVENT_TYPE, (event) => onMessage(event, workerData));
	return worker;
}
function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
	try {
		const { value, readable, writable } = message;
		const transferables = [];
		if (value) {
			message.value = value;
			transferables.push(message.value.buffer);
		}
		if (transferStreams && transferStreamsSupported) {
			if (readable) transferables.push(readable);
			if (writable) transferables.push(writable);
		} else message.readable = message.writable = null;
		if (transferables.length) try {
			worker.postMessage(message, transferables);
			return true;
		} catch {
			transferStreamsSupported = false;
			message.readable = message.writable = null;
			worker.postMessage(message);
		}
		else worker.postMessage(message);
	} catch (error) {
		if (writer) writer.releaseLock();
		onTaskFinished();
		throw error;
	}
}
async function onMessage({ data }, workerData) {
	const { type, value, messageId, result, error } = data;
	const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
	try {
		if (error) {
			const { message, stack, code, name, outputSize } = error;
			const responseError = new Error(message);
			Object.assign(responseError, {
				stack,
				code,
				name,
				outputSize
			});
			close(responseError);
		} else {
			if (type == "pull") {
				const { value, done } = await reader.read();
				sendMessage({
					type: MESSAGE_DATA,
					value,
					done,
					messageId
				}, workerData);
			}
			if (type == "data") {
				await writer.ready;
				await writer.write(new Uint8Array(value));
				sendMessage({
					type: "ack",
					messageId
				}, workerData);
			}
			if (type == "close") close(null, result);
		}
	} catch (error) {
		sendMessage({
			type: MESSAGE_CLOSE,
			messageId
		}, workerData);
		close(error);
	}
	function close(error, result) {
		if (error) rejectResult(error);
		else resolveResult(result);
		if (writer) writer.releaseLock();
		onTaskFinished();
	}
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/codec-pool.js
var pool = [];
var pendingRequests = [];
var indexWorker = 0;
async function runWorker(stream, workerOptions) {
	const { options, config } = workerOptions;
	const { transferStreams, useWebWorkers, useCompressionStream, compressed, signed, encrypted } = options;
	const { workerURI, maxWorkers } = config;
	workerOptions.transferStreams = transferStreams || transferStreams === void 0;
	workerOptions.useWebWorkers = !(!compressed && !signed && !encrypted && !workerOptions.transferStreams) && (useWebWorkers || useWebWorkers === void 0 && config.useWebWorkers);
	workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : void 0;
	options.useCompressionStream = useCompressionStream || useCompressionStream === void 0 && config.useCompressionStream;
	return (await getWorker()).run();
	async function getWorker() {
		const workerData = pool.find((workerData) => !workerData.busy);
		if (workerData) {
			clearTerminateTimeout(workerData);
			return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
		} else if (pool.length < maxWorkers) {
			const workerData = { indexWorker };
			indexWorker++;
			pool.push(workerData);
			return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
		} else return new Promise((resolve) => pendingRequests.push({
			resolve,
			stream,
			workerOptions
		}));
	}
	function onTaskFinished(workerData) {
		if (pendingRequests.length) {
			const [{ resolve, stream, workerOptions }] = pendingRequests.splice(0, 1);
			resolve(new CodecWorker(workerData, stream, workerOptions, onTaskFinished));
		} else if (workerData.worker) {
			clearTerminateTimeout(workerData);
			terminateWorker(workerData, workerOptions);
		} else pool = pool.filter((data) => data != workerData);
	}
}
function terminateWorker(workerData, workerOptions) {
	const { config } = workerOptions;
	const { terminateWorkerTimeout } = config;
	if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) if (workerData.terminated) workerData.terminated = false;
	else workerData.terminateTimeout = setTimeout(async () => {
		pool = pool.filter((data) => data != workerData);
		try {
			await workerData.terminate();
		} catch {}
	}, terminateWorkerTimeout);
}
function clearTerminateTimeout(workerData) {
	const { terminateTimeout } = workerData;
	if (terminateTimeout) {
		clearTimeout(terminateTimeout);
		workerData.terminateTimeout = null;
	}
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/io.js
var ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
var ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";
var HTTP_HEADER_CONTENT_TYPE = "Content-Type";
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var DEFAULT_BUFFER_SIZE = 256 * 1024;
var PROPERTY_NAME_WRITABLE = "writable";
var Stream = class {
	constructor() {
		this.size = 0;
	}
	init() {
		this.initialized = true;
	}
};
var Reader = class extends Stream {
	get readable() {
		const reader = this;
		const { chunkSize = DEFAULT_CHUNK_SIZE } = reader;
		const readable = new ReadableStream({
			start() {
				this.chunkOffset = 0;
			},
			async pull(controller) {
				const { offset = 0, size, diskNumberStart } = readable;
				const { chunkOffset } = this;
				const dataSize = size === void 0 ? chunkSize : Math.min(chunkSize, size - chunkOffset);
				const data = await readUint8Array(reader, offset + chunkOffset, dataSize, diskNumberStart);
				controller.enqueue(data);
				if (chunkOffset + chunkSize > size || size === void 0 && !data.length && dataSize) controller.close();
				else this.chunkOffset += chunkSize;
			}
		});
		return readable;
	}
};
var Writer = class extends Stream {
	constructor() {
		super();
		const writer = this;
		const writable = new WritableStream({ write(chunk) {
			if (!writer.initialized) throw new Error(ERR_WRITER_NOT_INITIALIZED);
			return writer.writeUint8Array(chunk);
		} });
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
			return writable;
		} });
	}
	writeUint8Array() {}
};
var BlobReader = class extends Reader {
	constructor(blob) {
		super();
		Object.assign(this, {
			blob,
			size: blob.size
		});
	}
	async readUint8Array(offset, length) {
		const reader = this;
		const offsetEnd = offset + length;
		let arrayBuffer = await (offset || offsetEnd < reader.size ? reader.blob.slice(offset, offsetEnd) : reader.blob).arrayBuffer();
		if (arrayBuffer.byteLength > length) arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
		return new Uint8Array(arrayBuffer);
	}
};
var BlobWriter = class extends Stream {
	constructor(contentType) {
		super();
		const writer = this;
		const transformStream = new TransformStream();
		const headers = [];
		if (contentType) headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
			return transformStream.writable;
		} });
		writer.blob = new Response(transformStream.readable, { headers }).blob();
	}
	getData() {
		return this.blob;
	}
};
var Uint8ArrayReader = class extends Reader {
	constructor(array) {
		super();
		array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
		Object.assign(this, {
			array,
			size: array.length
		});
	}
	readUint8Array(index, length) {
		return this.array.slice(index, index + length);
	}
};
var Uint8ArrayWriter = class extends Writer {
	constructor(defaultBufferSize) {
		super();
		this.defaultBufferSize = defaultBufferSize || DEFAULT_BUFFER_SIZE;
	}
	init(initSize = 0) {
		Object.assign(this, {
			offset: 0,
			array: new Uint8Array(initSize > 0 ? initSize : this.defaultBufferSize)
		});
		super.init();
	}
	writeUint8Array(array) {
		const writer = this;
		const requiredLength = writer.offset + array.length;
		if (requiredLength > writer.array.length) {
			let newLength = writer.array.length ? writer.array.length * 2 : writer.defaultBufferSize;
			while (newLength < requiredLength) newLength *= 2;
			const previousArray = writer.array;
			writer.array = new Uint8Array(newLength);
			writer.array.set(previousArray);
		}
		writer.array.set(array, writer.offset);
		writer.offset += array.length;
	}
	getData() {
		if (this.offset === this.array.length) return this.array;
		else return this.array.slice(0, this.offset);
	}
};
var SplitDataReader = class extends Reader {
	constructor(readers) {
		super();
		this.readers = readers;
	}
	async init() {
		const reader = this;
		const { readers } = reader;
		reader.lastDiskNumber = 0;
		reader.lastDiskOffset = 0;
		await Promise.all(readers.map(async (diskReader, indexDiskReader) => {
			await diskReader.init();
			if (indexDiskReader != readers.length - 1) reader.lastDiskOffset += diskReader.size;
			reader.size += diskReader.size;
		}));
		super.init();
	}
	async readUint8Array(offset, length, diskNumber = 0) {
		const reader = this;
		const { readers } = this;
		let result;
		let currentDiskNumber = diskNumber;
		if (currentDiskNumber == -1) currentDiskNumber = readers.length - 1;
		let currentReaderOffset = offset;
		while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
			currentReaderOffset -= readers[currentDiskNumber].size;
			currentDiskNumber++;
		}
		const currentReader = readers[currentDiskNumber];
		if (currentReader) {
			const currentReaderSize = currentReader.size;
			if (currentReaderOffset + length <= currentReaderSize) result = await readUint8Array(currentReader, currentReaderOffset, length);
			else {
				const chunkLength = currentReaderSize - currentReaderOffset;
				result = new Uint8Array(length);
				const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
				result.set(firstPart, 0);
				const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber);
				result.set(secondPart, chunkLength);
				if (firstPart.length + secondPart.length < length) result = result.subarray(0, firstPart.length + secondPart.length);
			}
		} else result = new Uint8Array();
		reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
		return result;
	}
};
var SplitDataWriter = class extends Stream {
	constructor(writerGenerator, maxSize = 4294967295) {
		super();
		const writer = this;
		Object.assign(writer, {
			diskNumber: 0,
			diskOffset: 0,
			size: 0,
			maxSize,
			availableSize: maxSize
		});
		let diskSourceWriter, diskWritable, diskWriter;
		const writable = new WritableStream({
			async write(chunk) {
				const { availableSize } = writer;
				if (!diskWriter) {
					const { value, done } = await writerGenerator.next();
					if (done && !value) throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
					else {
						diskSourceWriter = value;
						diskSourceWriter.size = 0;
						if (diskSourceWriter.maxSize) writer.maxSize = diskSourceWriter.maxSize;
						writer.availableSize = writer.maxSize;
						await initStream(diskSourceWriter);
						diskWritable = value.writable;
						diskWriter = diskWritable.getWriter();
					}
					await this.write(chunk);
				} else if (chunk.length >= availableSize) {
					await writeChunk(chunk.subarray(0, availableSize));
					await closeDisk();
					writer.diskOffset += diskSourceWriter.size;
					writer.diskNumber++;
					diskWriter = null;
					await this.write(chunk.subarray(availableSize));
				} else await writeChunk(chunk);
			},
			async close() {
				await diskWriter.ready;
				await closeDisk();
			}
		});
		Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
			return writable;
		} });
		async function writeChunk(chunk) {
			const chunkLength = chunk.length;
			if (chunkLength) {
				await diskWriter.ready;
				await diskWriter.write(chunk);
				diskSourceWriter.size += chunkLength;
				writer.size += chunkLength;
				writer.availableSize -= chunkLength;
			}
		}
		async function closeDisk() {
			await diskWriter.close();
		}
	}
};
var GenericReader = class {
	constructor(reader) {
		if (Array.isArray(reader)) reader = new SplitDataReader(reader);
		if (reader instanceof ReadableStream) reader = { readable: reader };
		return reader;
	}
};
var GenericWriter = class {
	constructor(writer) {
		if (writer.writable === void 0 && typeof writer.next == "function") writer = new SplitDataWriter(writer);
		if (writer instanceof WritableStream) writer = { writable: writer };
		if (writer.size === void 0) writer.size = 0;
		if (!(writer instanceof SplitDataWriter)) Object.assign(writer, {
			diskNumber: 0,
			diskOffset: 0,
			availableSize: INFINITY_VALUE,
			maxSize: INFINITY_VALUE
		});
		return writer;
	}
};
async function initStream(stream, initSize) {
	if (stream.init && !stream.initialized) await stream.init(initSize);
	else return Promise.resolve();
}
function readUint8Array(reader, offset, size, diskNumber) {
	return reader.readUint8Array(offset, size, diskNumber);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/decode-cp437.js
var CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
var VALID_CP437 = CP437.length == 256;
function decodeCP437(stringValue) {
	if (VALID_CP437) {
		let result = "";
		for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) result += CP437[stringValue[indexCharacter]];
		return result;
	} else return new TextDecoder().decode(stringValue);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/decode-text.js
function decodeText(value, encoding) {
	if (encoding && encoding.trim().toLowerCase() == "cp437") return decodeCP437(value);
	else return new TextDecoder(encoding).decode(value);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-entry.js
var PROPERTY_NAME_FILENAME = "filename";
var PROPERTY_NAME_RAW_FILENAME = "rawFilename";
var PROPERTY_NAME_COMMENT = "comment";
var PROPERTY_NAME_RAW_COMMENT = "rawComment";
var PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
var PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
var PROPERTY_NAME_OFFSET = "offset";
var PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
var PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
var PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
var PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
var PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
var PROPERTY_NAME_CREATION_DATE = "creationDate";
var PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
var PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
var PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
var PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW = "msdosAttributesRaw";
var PROPERTY_NAME_MSDOS_ATTRIBUTES = "msdosAttributes";
var PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
var PROPERTY_NAME_ZIP64 = "zip64";
var PROPERTY_NAME_ENCRYPTED = "encrypted";
var PROPERTY_NAME_VERSION = "version";
var PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
var PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
var PROPERTY_NAME_DIRECTORY = "directory";
var PROPERTY_NAME_EXECUTABLE = "executable";
var PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
var PROPERTY_NAME_SIGNATURE = "signature";
var PROPERTY_NAME_EXTRA_FIELD = "extraField";
var PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
var PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
var PROPERTY_NAME_UNIX_MODE = "unixMode";
var PROPERTY_NAME_SETUID = "setuid";
var PROPERTY_NAME_SETGID = "setgid";
var PROPERTY_NAME_STICKY = "sticky";
var PROPERTY_NAMES = [
	PROPERTY_NAME_FILENAME,
	PROPERTY_NAME_RAW_FILENAME,
	PROPERTY_NAME_UNCOMPRESSED_SIZE,
	PROPERTY_NAME_COMPRESSED_SIZE,
	PROPERTY_NAME_LAST_MODIFICATION_DATE,
	PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
	PROPERTY_NAME_COMMENT,
	PROPERTY_NAME_RAW_COMMENT,
	PROPERTY_NAME_LAST_ACCESS_DATE,
	PROPERTY_NAME_CREATION_DATE,
	PROPERTY_NAME_RAW_CREATION_DATE,
	PROPERTY_NAME_OFFSET,
	PROPERTY_NAME_DISK_NUMBER_START,
	PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
	PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
	PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW,
	PROPERTY_NAME_MSDOS_ATTRIBUTES,
	PROPERTY_NAME_MS_DOS_COMPATIBLE,
	PROPERTY_NAME_ZIP64,
	PROPERTY_NAME_ENCRYPTED,
	PROPERTY_NAME_VERSION,
	PROPERTY_NAME_VERSION_MADE_BY,
	PROPERTY_NAME_ZIPCRYPTO,
	PROPERTY_NAME_DIRECTORY,
	PROPERTY_NAME_EXECUTABLE,
	PROPERTY_NAME_COMPRESSION_METHOD,
	PROPERTY_NAME_SIGNATURE,
	PROPERTY_NAME_EXTRA_FIELD,
	PROPERTY_NAME_EXTRA_FIELD_UNIX,
	PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
	"uid",
	"gid",
	PROPERTY_NAME_UNIX_MODE,
	PROPERTY_NAME_SETUID,
	PROPERTY_NAME_SETGID,
	PROPERTY_NAME_STICKY,
	"bitFlag",
	"filenameUTF8",
	"commentUTF8",
	"rawExtraField",
	"extraFieldZip64",
	"extraFieldUnicodePath",
	"extraFieldUnicodeComment",
	"extraFieldAES",
	"extraFieldNTFS",
	"extraFieldExtendedTimestamp"
];
var Entry = class {
	constructor(data) {
		PROPERTY_NAMES.forEach((name) => this[name] = data[name]);
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/options.js
var OPTION_FILENAME_ENCODING = "filenameEncoding";
var OPTION_COMMENT_ENCODING = "commentEncoding";
var OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
var OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
var OPTION_PASSWORD = "password";
var OPTION_RAW_PASSWORD = "rawPassword";
var OPTION_PASS_THROUGH = "passThrough";
var OPTION_SIGNAL = "signal";
var OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
var OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
var OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
var OPTION_USE_WEB_WORKERS = "useWebWorkers";
var OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
var OPTION_TRANSFER_STREAMS = "transferStreams";
var OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
var OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
var OPTION_KEEP_ORDER = "keepOrder";
var OPTION_LEVEL = "level";
var OPTION_BUFFERED_WRITE = "bufferedWrite";
var OPTION_CREATE_TEMP_STREAM = "createTempStream";
var OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
var OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
var OPTION_DATA_DESCRIPTOR = "dataDescriptor";
var OPTION_ENCODE_TEXT = "encodeText";
var OPTION_OFFSET = "offset";
var OPTION_USDZ = "usdz";
var OPTION_UNIX_EXTRA_FIELD_TYPE = "unixExtraFieldType";
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-reader.js
var ERR_BAD_FORMAT = "File format is not recognized";
var ERR_EOCDR_NOT_FOUND = "End of central directory not found";
var ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
var ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
var ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
var ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
var ERR_ENCRYPTED = "File contains encrypted entry";
var ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
var ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
var ERR_SPLIT_ZIP_FILE = "Split zip file";
var ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
var CHARSET_UTF8 = "utf-8";
var PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
var CHARSET_CP437 = "cp437";
var ZIP64_PROPERTIES = [
	[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
	[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
	[PROPERTY_NAME_OFFSET, MAX_32_BITS],
	[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
];
var ZIP64_EXTRACTION = {
	[MAX_16_BITS]: {
		getValue: getUint32,
		bytes: 4
	},
	[MAX_32_BITS]: {
		getValue: getBigUint64,
		bytes: 8
	}
};
var ZipReader = class {
	constructor(reader, options = {}) {
		Object.assign(this, {
			reader: new GenericReader(reader),
			options,
			config: getConfiguration(),
			readRanges: []
		});
	}
	async *getEntriesGenerator(options = {}) {
		const zipReader = this;
		let { reader } = zipReader;
		const { config } = zipReader;
		await initStream(reader);
		if (reader.size === void 0 || !reader.readUint8Array) {
			reader = new BlobReader(await new Response(reader.readable).blob());
			await initStream(reader);
		}
		if (reader.size < 22) throw new Error(ERR_BAD_FORMAT);
		reader.chunkSize = getChunkSize(config);
		const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, 22, MAX_16_BITS * 16);
		if (!endOfDirectoryInfo) if (getUint32(getDataView$1(await readUint8Array(reader, 0, 4))) == 134695760) throw new Error(ERR_SPLIT_ZIP_FILE);
		else throw new Error(ERR_EOCDR_NOT_FOUND);
		const endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
		let directoryDataLength = getUint32(endOfDirectoryView, 12);
		let directoryDataOffset = getUint32(endOfDirectoryView, 16);
		const commentOffset = endOfDirectoryInfo.offset;
		const commentLength = getUint16(endOfDirectoryView, 20);
		const appendedDataOffset = commentOffset + 22 + commentLength;
		let lastDiskNumber = getUint16(endOfDirectoryView, 4);
		const expectedLastDiskNumber = reader.lastDiskNumber || 0;
		let diskNumber = getUint16(endOfDirectoryView, 6);
		let filesLength = getUint16(endOfDirectoryView, 8);
		let prependedDataLength = 0;
		let startOffset = 0;
		if (directoryDataOffset == 4294967295 || directoryDataLength == 4294967295 || filesLength == 65535 || diskNumber == 65535) {
			const endOfDirectoryLocatorView = getDataView$1(await readUint8Array(reader, endOfDirectoryInfo.offset - 20, 20));
			if (getUint32(endOfDirectoryLocatorView, 0) == 117853008) {
				directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
				let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, 56, -1);
				let endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - 20 - 56;
				if (getUint32(endOfDirectoryView, 0) != 101075792 && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
					endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, 56, -1);
					endOfDirectoryView = getDataView$1(endOfDirectoryArray);
				}
				if (getUint32(endOfDirectoryView, 0) != 101075792) throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
				if (lastDiskNumber == 65535) lastDiskNumber = getUint32(endOfDirectoryView, 16);
				if (diskNumber == 65535) diskNumber = getUint32(endOfDirectoryView, 20);
				if (filesLength == 65535) filesLength = getBigUint64(endOfDirectoryView, 32);
				if (directoryDataLength == 4294967295) directoryDataLength = getBigUint64(endOfDirectoryView, 40);
				directoryDataOffset -= directoryDataLength;
			}
		}
		if (directoryDataOffset >= reader.size) {
			prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - 22;
			directoryDataOffset = reader.size - directoryDataLength - 22;
		}
		if (expectedLastDiskNumber != lastDiskNumber) throw new Error(ERR_SPLIT_ZIP_FILE);
		if (directoryDataOffset < 0) throw new Error(ERR_BAD_FORMAT);
		let offset = 0;
		let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
		let directoryView = getDataView$1(directoryArray);
		if (directoryDataLength) {
			const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
			if (getUint32(directoryView, offset) != 33639248 && directoryDataOffset != expectedDirectoryDataOffset) {
				const originalDirectoryDataOffset = directoryDataOffset;
				directoryDataOffset = expectedDirectoryDataOffset;
				if (directoryDataOffset > originalDirectoryDataOffset) prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
				directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
				directoryView = getDataView$1(directoryArray);
			}
		}
		const expectedDirectoryDataLength = endOfDirectoryInfo.offset - directoryDataOffset - (reader.lastDiskOffset || 0);
		if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0) {
			directoryDataLength = expectedDirectoryDataLength;
			directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
			directoryView = getDataView$1(directoryArray);
		}
		if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) throw new Error(ERR_BAD_FORMAT);
		const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
		const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
		for (let indexFile = 0; indexFile < filesLength; indexFile++) {
			const fileEntry = new ZipEntry(reader, config, zipReader.options);
			if (getUint32(directoryView, offset) != 33639248) throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
			readCommonHeader(fileEntry, directoryView, offset + 6);
			const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
			const filenameOffset = offset + 46;
			const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
			const commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
			const versionMadeBy = getUint16(directoryView, offset + 4);
			const msDosCompatible = versionMadeBy >> 8 == 0;
			const unixCompatible = versionMadeBy >> 8 == 3;
			const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
			const commentLength = getUint16(directoryView, offset + 32);
			const endOffset = commentOffset + commentLength;
			const rawComment = directoryArray.subarray(commentOffset, endOffset);
			const filenameUTF8 = languageEncodingFlag;
			const commentUTF8 = languageEncodingFlag;
			const externalFileAttributes = getUint32(directoryView, offset + 38);
			const msdosAttributesRaw = externalFileAttributes & 255;
			const msdosAttributes = {
				readOnly: Boolean(msdosAttributesRaw & 1),
				hidden: Boolean(msdosAttributesRaw & 2),
				system: Boolean(msdosAttributesRaw & 4),
				directory: Boolean(msdosAttributesRaw & 16),
				archive: Boolean(msdosAttributesRaw & 32)
			};
			const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
			const decode = getOptionValue$1(zipReader, options, "decodeText") || decodeText;
			const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
			const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
			let filename = decode(rawFilename, rawFilenameEncoding);
			if (filename === void 0) filename = decodeText(rawFilename, rawFilenameEncoding);
			let comment = decode(rawComment, rawCommentEncoding);
			if (comment === void 0) comment = decodeText(rawComment, rawCommentEncoding);
			Object.assign(fileEntry, {
				versionMadeBy,
				msDosCompatible,
				compressedSize: 0,
				uncompressedSize: 0,
				commentLength,
				offset: offsetFileEntry,
				diskNumberStart: getUint16(directoryView, offset + 34),
				internalFileAttributes: getUint16(directoryView, offset + 36),
				externalFileAttributes,
				msdosAttributesRaw,
				msdosAttributes,
				rawFilename,
				filenameUTF8,
				commentUTF8,
				rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset),
				rawComment,
				filename,
				comment
			});
			startOffset = Math.max(offsetFileEntry, startOffset);
			readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
			const unixExternalUpper = fileEntry.externalFileAttributes >> 16 & MAX_16_BITS;
			if (fileEntry.unixMode === void 0 && (unixExternalUpper & 16877) != 0) fileEntry.unixMode = unixExternalUpper;
			const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
			const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
			const sticky = Boolean(fileEntry.unixMode & 512);
			const executable = fileEntry.unixMode !== void 0 ? (fileEntry.unixMode & 73) != 0 : unixCompatible && (unixExternalUpper & 73) != 0;
			const modeIsDir = fileEntry.unixMode !== void 0 && (fileEntry.unixMode & 61440) == 16384;
			const upperIsDir = (unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR;
			Object.assign(fileEntry, {
				setuid,
				setgid,
				sticky,
				unixExternalUpper,
				internalFileAttribute: fileEntry.internalFileAttributes,
				externalFileAttribute: fileEntry.externalFileAttributes,
				executable,
				directory: modeIsDir || upperIsDir || msDosCompatible && msdosAttributes.directory || filename.endsWith("/") && !fileEntry.uncompressedSize,
				zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
			});
			const entry = new Entry(fileEntry);
			entry.getData = (writer, options) => fileEntry.getData(writer, entry, zipReader.readRanges, options);
			entry.arrayBuffer = async (options) => {
				const writer = new TransformStream();
				const [arrayBuffer] = await Promise.all([new Response(writer.readable).arrayBuffer(), fileEntry.getData(writer, entry, zipReader.readRanges, options)]);
				return arrayBuffer;
			};
			offset = endOffset;
			const { onprogress } = options;
			if (onprogress) try {
				await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
			} catch {}
			yield entry;
		}
		const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
		const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
		if (extractPrependedData) zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
		zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + 22, commentLength) : new Uint8Array();
		if (extractAppendedData) zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
		return true;
	}
	async getEntries(options = {}) {
		const entries = [];
		for await (const entry of this.getEntriesGenerator(options)) entries.push(entry);
		return entries;
	}
	async close() {}
};
var ZipEntry = class {
	constructor(reader, config, options) {
		Object.assign(this, {
			reader,
			config,
			options
		});
	}
	async getData(writer, fileEntry, readRanges, options = {}) {
		const zipEntry = this;
		const { reader, offset, diskNumberStart, extraFieldAES, extraFieldZip64, compressionMethod, config, bitFlag, signature, rawLastModDate, uncompressedSize, compressedSize } = zipEntry;
		const { dataDescriptor } = bitFlag;
		const localDirectory = fileEntry.localDirectory = {};
		const dataView = getDataView$1(await readUint8Array(reader, offset, 30, diskNumberStart));
		let password = getOptionValue$1(zipEntry, options, OPTION_PASSWORD);
		let rawPassword = getOptionValue$1(zipEntry, options, OPTION_RAW_PASSWORD);
		const passThrough = getOptionValue$1(zipEntry, options, OPTION_PASS_THROUGH);
		password = password && password.length && password;
		rawPassword = rawPassword && rawPassword.length && rawPassword;
		if (extraFieldAES) {
			if (extraFieldAES.originalCompressionMethod != 99) throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		}
		if (compressionMethod != 0 && compressionMethod != 8 && compressionMethod != 9 && !passThrough) throw new Error(ERR_UNSUPPORTED_COMPRESSION);
		if (getUint32(dataView, 0) != 67324752) throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
		readCommonHeader(localDirectory, dataView, 4);
		const { extraFieldLength, filenameLength, lastAccessDate, creationDate } = localDirectory;
		localDirectory.rawExtraField = extraFieldLength ? await readUint8Array(reader, offset + 30 + filenameLength, extraFieldLength, diskNumberStart) : new Uint8Array();
		readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
		Object.assign(fileEntry, {
			lastAccessDate,
			creationDate
		});
		const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
		const zipCrypto = encrypted && !extraFieldAES;
		if (!passThrough) fileEntry.zipCrypto = zipCrypto;
		if (encrypted) {
			if (!zipCrypto && extraFieldAES.strength === void 0) throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
			else if (!password && !rawPassword) throw new Error(ERR_ENCRYPTED);
		}
		const dataOffset = offset + 30 + filenameLength + extraFieldLength;
		const size = compressedSize;
		const readable = reader.readable;
		Object.assign(readable, {
			diskNumberStart,
			offset: dataOffset,
			size
		});
		const signal = getOptionValue$1(zipEntry, options, OPTION_SIGNAL);
		const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
		let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
		const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
		if (checkOverlappingEntryOnly) checkOverlappingEntry = true;
		const { onstart, onprogress, onend } = options;
		const deflate64 = compressionMethod == 9;
		let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
		if (deflate64) useCompressionStream = false;
		const workerOptions = {
			options: {
				codecType: CODEC_INFLATE,
				password,
				rawPassword,
				zipCrypto,
				encryptionStrength: extraFieldAES && extraFieldAES.strength,
				signed: getOptionValue$1(zipEntry, options, "checkSignature") && !passThrough,
				passwordVerification: zipCrypto && (dataDescriptor ? rawLastModDate >>> 8 & 255 : signature >>> 24 & 255),
				outputSize: passThrough ? compressedSize : uncompressedSize,
				signature,
				compressed: compressionMethod != 0 && !passThrough,
				encrypted: zipEntry.encrypted && !passThrough,
				useWebWorkers: getOptionValue$1(zipEntry, options, OPTION_USE_WEB_WORKERS),
				useCompressionStream,
				transferStreams: getOptionValue$1(zipEntry, options, OPTION_TRANSFER_STREAMS),
				deflate64,
				checkPasswordOnly
			},
			config,
			streamOptions: {
				signal,
				size,
				onstart,
				onprogress,
				onend
			}
		};
		if (checkOverlappingEntry) await detectOverlappingEntry({
			reader,
			fileEntry,
			offset,
			diskNumberStart,
			signature,
			compressedSize,
			uncompressedSize,
			dataOffset,
			dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
			extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
			readRanges
		});
		let writable;
		try {
			if (!checkOverlappingEntryOnly) {
				if (checkPasswordOnly) writer = new WritableStream();
				writer = new GenericWriter(writer);
				await initStream(writer, passThrough ? compressedSize : uncompressedSize);
				({writable} = writer);
				const { outputSize } = await runWorker({
					readable,
					writable
				}, workerOptions);
				writer.size += outputSize;
				if (outputSize != (passThrough ? compressedSize : uncompressedSize)) throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
			}
		} catch (error) {
			if (error.outputSize !== void 0) writer.size += error.outputSize;
			if (!checkPasswordOnly || error.message != "zipjs-abort-check-password") throw error;
		} finally {
			if (!getOptionValue$1(zipEntry, options, "preventClose") && writable && !writable.locked) await writable.getWriter().close();
		}
		return checkPasswordOnly || checkOverlappingEntryOnly ? void 0 : writer.getData ? writer.getData() : writable;
	}
};
function readCommonHeader(directory, dataView, offset) {
	const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
	const encrypted = (rawBitFlag & 1) == 1;
	const rawLastModDate = getUint32(dataView, offset + 6);
	Object.assign(directory, {
		encrypted,
		version: getUint16(dataView, offset),
		bitFlag: {
			level: (rawBitFlag & 6) >> 1,
			dataDescriptor: (rawBitFlag & 8) == 8,
			languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
		},
		rawLastModDate,
		lastModDate: getDate(rawLastModDate),
		filenameLength: getUint16(dataView, offset + 22),
		extraFieldLength: getUint16(dataView, offset + 24)
	});
}
function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
	const { rawExtraField } = directory;
	const extraField = directory.extraField = /* @__PURE__ */ new Map();
	const rawExtraFieldView = getDataView$1(new Uint8Array(rawExtraField));
	let offsetExtraField = 0;
	try {
		while (offsetExtraField < rawExtraField.length) {
			const type = getUint16(rawExtraFieldView, offsetExtraField);
			const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
			extraField.set(type, {
				type,
				data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
			});
			offsetExtraField += 4 + size;
		}
	} catch {}
	const compressionMethod = getUint16(dataView, offset + 4);
	Object.assign(directory, {
		signature: getUint32(dataView, offset + 10),
		compressedSize: getUint32(dataView, offset + 14),
		uncompressedSize: getUint32(dataView, offset + 18)
	});
	const extraFieldZip64 = extraField.get(1);
	if (extraFieldZip64) {
		readExtraFieldZip64(extraFieldZip64, directory);
		directory.extraFieldZip64 = extraFieldZip64;
	}
	const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
	if (extraFieldUnicodePath) {
		readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
		directory.extraFieldUnicodePath = extraFieldUnicodePath;
	}
	const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
	if (extraFieldUnicodeComment) {
		readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
		directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
	}
	const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
	if (extraFieldAES) {
		readExtraFieldAES(extraFieldAES, directory, compressionMethod);
		directory.extraFieldAES = extraFieldAES;
	} else directory.compressionMethod = compressionMethod;
	const extraFieldNTFS = extraField.get(10);
	if (extraFieldNTFS) {
		readExtraFieldNTFS(extraFieldNTFS, directory);
		directory.extraFieldNTFS = extraFieldNTFS;
	}
	const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
	if (extraFieldUnix) {
		readExtraFieldUnix(extraFieldUnix, directory, false);
		directory.extraFieldUnix = extraFieldUnix;
	} else {
		const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
		if (extraFieldInfoZip) {
			readExtraFieldUnix(extraFieldInfoZip, directory, true);
			directory.extraFieldInfoZip = extraFieldInfoZip;
		}
	}
	const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
	if (extraFieldExtendedTimestamp) {
		readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
		directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
	}
	const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
	if (extraFieldUSDZ) directory.extraFieldUSDZ = extraFieldUSDZ;
}
function readExtraFieldZip64(extraFieldZip64, directory) {
	directory.zip64 = true;
	const extraFieldView = getDataView$1(extraFieldZip64.data);
	const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
	for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
		const [propertyName, max] = missingProperties[indexMissingProperty];
		if (directory[propertyName] == max) {
			const extraction = ZIP64_EXTRACTION[max];
			directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
			offset += extraction.bytes;
		} else if (extraFieldZip64[propertyName]) throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
	}
}
function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
	const extraFieldView = getDataView$1(extraFieldUnicode.data);
	const crc32 = new Crc32();
	crc32.append(fileEntry[rawPropertyName]);
	const dataViewSignature = getDataView$1(new Uint8Array(4));
	dataViewSignature.setUint32(0, crc32.get(), true);
	const signature = getUint32(extraFieldView, 1);
	Object.assign(extraFieldUnicode, {
		version: getUint8(extraFieldView, 0),
		[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
		valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
	});
	if (extraFieldUnicode.valid) {
		directory[propertyName] = extraFieldUnicode[propertyName];
		directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
	}
}
function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
	const extraFieldView = getDataView$1(extraFieldAES.data);
	const strength = getUint8(extraFieldView, 4);
	Object.assign(extraFieldAES, {
		vendorVersion: getUint8(extraFieldView, 0),
		vendorId: getUint8(extraFieldView, 2),
		strength,
		originalCompressionMethod: compressionMethod,
		compressionMethod: getUint16(extraFieldView, 5)
	});
	directory.compressionMethod = extraFieldAES.compressionMethod;
}
function readExtraFieldNTFS(extraFieldNTFS, directory) {
	const extraFieldView = getDataView$1(extraFieldNTFS.data);
	let offsetExtraField = 4;
	let tag1Data;
	try {
		while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
			const tagValue = getUint16(extraFieldView, offsetExtraField);
			const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
			if (tagValue == 1) tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
			offsetExtraField += 4 + attributeSize;
		}
	} catch {}
	try {
		if (tag1Data && tag1Data.length == 24) {
			const tag1View = getDataView$1(tag1Data);
			const rawLastModDate = tag1View.getBigUint64(0, true);
			const rawLastAccessDate = tag1View.getBigUint64(8, true);
			const rawCreationDate = tag1View.getBigUint64(16, true);
			Object.assign(extraFieldNTFS, {
				rawLastModDate,
				rawLastAccessDate,
				rawCreationDate
			});
			const extraFieldData = {
				lastModDate: getDateNTFS(rawLastModDate),
				lastAccessDate: getDateNTFS(rawLastAccessDate),
				creationDate: getDateNTFS(rawCreationDate)
			};
			Object.assign(extraFieldNTFS, extraFieldData);
			Object.assign(directory, extraFieldData);
		}
	} catch {}
}
function readExtraFieldUnix(extraField, directory, isInfoZip) {
	try {
		const view = getDataView$1(new Uint8Array(extraField.data));
		let offset = 0;
		const version = getUint8(view, offset++);
		const uidSize = getUint8(view, offset++);
		const uidBytes = extraField.data.subarray(offset, offset + uidSize);
		offset += uidSize;
		const uid = unpackUnixId(uidBytes);
		const gidSize = getUint8(view, offset++);
		const gidBytes = extraField.data.subarray(offset, offset + gidSize);
		offset += gidSize;
		const gid = unpackUnixId(gidBytes);
		let unixMode = void 0;
		if (!isInfoZip && offset + 2 <= extraField.data.length) {
			const base = extraField.data;
			unixMode = new DataView(base.buffer, base.byteOffset + offset, 2).getUint16(0, true);
		}
		Object.assign(extraField, {
			version,
			uid,
			gid,
			unixMode
		});
		if (uid !== void 0) directory.uid = uid;
		if (gid !== void 0) directory.gid = gid;
		if (unixMode !== void 0) directory.unixMode = unixMode;
	} catch {}
}
function unpackUnixId(bytes) {
	const buffer = new Uint8Array(4);
	buffer.set(bytes, 0);
	return new DataView(buffer.buffer, buffer.byteOffset, 4).getUint32(0, true);
}
function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
	const extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
	const flags = getUint8(extraFieldView, 0);
	const timeProperties = [];
	const timeRawProperties = [];
	if (localDirectory) {
		if ((flags & 1) == 1) {
			timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		}
		if ((flags & 2) == 2) {
			timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
		}
		if ((flags & 4) == 4) {
			timeProperties.push(PROPERTY_NAME_CREATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
		}
	} else if (extraFieldExtendedTimestamp.data.length >= 5) {
		timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
		timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
	}
	let offset = 1;
	timeProperties.forEach((propertyName, indexProperty) => {
		if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
			const time = getUint32(extraFieldView, offset);
			directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = /* @__PURE__ */ new Date(time * 1e3);
			const rawPropertyName = timeRawProperties[indexProperty];
			extraFieldExtendedTimestamp[rawPropertyName] = time;
		}
		offset += 4;
	});
}
async function detectOverlappingEntry({ reader, fileEntry, offset, diskNumberStart, signature, compressedSize, uncompressedSize, dataOffset, dataDescriptor, extraFieldZip64, readRanges }) {
	let diskOffset = 0;
	if (diskNumberStart) for (let indexReader = 0; indexReader < diskNumberStart; indexReader++) {
		const diskReader = reader.readers[indexReader];
		diskOffset += diskReader.size;
	}
	let dataDescriptorLength = 0;
	if (dataDescriptor) if (extraFieldZip64) dataDescriptorLength = 20;
	else dataDescriptorLength = 12;
	if (dataDescriptorLength) {
		const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + 4, diskNumberStart);
		if (getUint32(getDataView$1(dataDescriptorArray), 0) == 134695760) {
			const readSignature = getUint32(getDataView$1(dataDescriptorArray), 4);
			let readCompressedSize;
			let readUncompressedSize;
			if (extraFieldZip64) {
				readCompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 8);
				readUncompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 16);
			} else {
				readCompressedSize = getUint32(getDataView$1(dataDescriptorArray), 8);
				readUncompressedSize = getUint32(getDataView$1(dataDescriptorArray), 12);
			}
			if ((fileEntry.encrypted && !fileEntry.zipCrypto || readSignature == signature) && readCompressedSize == compressedSize && readUncompressedSize == uncompressedSize) dataDescriptorLength += 4;
		}
	}
	const range = {
		start: diskOffset + offset,
		end: diskOffset + dataOffset + compressedSize + dataDescriptorLength,
		fileEntry
	};
	for (const otherRange of readRanges) if (otherRange.fileEntry != fileEntry && range.start >= otherRange.start && range.start < otherRange.end) {
		const error = /* @__PURE__ */ new Error(ERR_OVERLAPPING_ENTRY);
		error.overlappingEntry = otherRange.fileEntry;
		throw error;
	}
	readRanges.push(range);
}
async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
	const signatureArray = new Uint8Array(4);
	setUint32$1(getDataView$1(signatureArray), 0, signature);
	const maximumBytes = minimumBytes + maximumLength;
	return await seek(minimumBytes) || await seek(Math.min(maximumBytes, startOffset));
	async function seek(length) {
		const offset = startOffset - length;
		const bytes = await readUint8Array(reader, offset, length);
		for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] && bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) return {
			offset: offset + indexByte,
			buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
		};
	}
}
function getOptionValue$1(zipReader, options, name) {
	return options[name] === void 0 ? zipReader.options[name] : options[name];
}
function getDate(timeRaw) {
	const date = (timeRaw & 4294901760) >> 16, time = timeRaw & MAX_16_BITS;
	try {
		return new Date(1980 + ((date & 65024) >> 9), ((date & 480) >> 5) - 1, date & 31, (time & 63488) >> 11, (time & 2016) >> 5, (time & 31) * 2, 0);
	} catch {}
}
function getDateNTFS(timeRaw) {
	return new Date(Number(timeRaw / BigInt(1e4) - BigInt(0xa9730b66800)));
}
function getUint8(view, offset) {
	return view.getUint8(offset);
}
function getUint16(view, offset) {
	return view.getUint16(offset, true);
}
function getUint32(view, offset) {
	return view.getUint32(offset, true);
}
function getBigUint64(view, offset) {
	return Number(view.getBigUint64(offset, true));
}
function setUint32$1(view, offset, value) {
	view.setUint32(offset, value, true);
}
function getDataView$1(array) {
	return new DataView(array.buffer);
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-writer.js
var ERR_DUPLICATED_NAME = "File already exists";
var ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
var ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
var ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
var ERR_INVALID_VERSION = "Version exceeds 65535";
var ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
var ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
var ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
var ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (set the 'zip64' option to 'true')";
var ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
var ERR_ZIP_NOT_EMPTY = "Zip file not empty";
var ERR_INVALID_UID = "Invalid uid (must be integer 0..2^32-1)";
var ERR_INVALID_GID = "Invalid gid (must be integer 0..2^32-1)";
var ERR_INVALID_UNIX_MODE = "Invalid UNIX mode (must be integer 0..65535)";
var ERR_INVALID_UNIX_EXTRA_FIELD_TYPE = "Invalid unixExtraFieldType (must be 'infozip' or 'unix')";
var ERR_INVALID_MSDOS_ATTRIBUTES = "Invalid msdosAttributesRaw (must be integer 0..255)";
var ERR_INVALID_MSDOS_DATA = "Invalid msdosAttributes (must be an object with boolean flags)";
var EXTRAFIELD_DATA_AES = new Uint8Array([
	7,
	0,
	2,
	0,
	65,
	69,
	3,
	0,
	0
]);
var INFOZIP_EXTRA_FIELD_TYPE = "infozip";
var UNIX_EXTRA_FIELD_TYPE = "unix";
var workers = 0;
var pendingEntries = [];
var ZipWriter = class {
	constructor(writer, options = {}) {
		writer = new GenericWriter(writer);
		const addSplitZipSignature = writer.availableSize !== void 0 && writer.availableSize > 0 && writer.availableSize !== Infinity && writer.maxSize !== void 0 && writer.maxSize > 0 && writer.maxSize !== Infinity;
		Object.assign(this, {
			writer,
			addSplitZipSignature,
			options,
			config: getConfiguration(),
			files: /* @__PURE__ */ new Map(),
			filenames: /* @__PURE__ */ new Set(),
			offset: options["offset"] === void 0 ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
			pendingEntriesSize: 0,
			pendingAddFileCalls: /* @__PURE__ */ new Set(),
			bufferedWrites: 0
		});
	}
	async prependZip(reader) {
		if (this.filenames.size) throw new Error(ERR_ZIP_NOT_EMPTY);
		reader = new GenericReader(reader);
		const zipReader = new ZipReader(reader.readable);
		const entries = await zipReader.getEntries();
		await zipReader.close();
		await reader.readable.pipeTo(this.writer.writable, {
			preventClose: true,
			preventAbort: true
		});
		this.writer.size = this.offset = reader.size;
		this.filenames = new Set(entries.map((entry) => entry.filename));
		this.files = new Map(entries.map((entry) => {
			const { version, compressionMethod, lastModDate, lastAccessDate, creationDate, rawFilename, bitFlag, encrypted, uncompressedSize, compressedSize, diskOffset, diskNumber, zip64 } = entry;
			let { rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField } = entry;
			const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
			rawExtraFieldZip64 = rawExtraFieldZip64 || new Uint8Array();
			rawExtraFieldAES = rawExtraFieldAES || new Uint8Array();
			rawExtraFieldExtendedTimestamp = rawExtraFieldExtendedTimestamp || new Uint8Array();
			rawExtraFieldNTFS = rawExtraFieldNTFS || new Uint8Array();
			rawExtraFieldUnix = entry.rawExtraFieldUnix || new Uint8Array();
			rawExtraField = rawExtraField || new Uint8Array();
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
			const zip64UncompressedSize = zip64 && uncompressedSize > 4294967295;
			const zip64CompressedSize = zip64 && compressedSize > 4294967295;
			const { headerArray, headerView } = getHeaderArrayData({
				version,
				bitFlag: getBitFlag(level, languageEncodingFlag, dataDescriptor, encrypted, compressionMethod),
				compressionMethod,
				uncompressedSize,
				compressedSize,
				lastModDate,
				rawFilename,
				zip64CompressedSize,
				zip64UncompressedSize,
				extraFieldLength
			});
			Object.assign(entry, {
				zip64UncompressedSize,
				zip64CompressedSize,
				zip64Offset: zip64 && this.offset - diskOffset > 4294967295,
				zip64DiskNumberStart: zip64 && diskNumber > 65535,
				rawExtraFieldZip64,
				rawExtraFieldAES,
				rawExtraFieldExtendedTimestamp,
				rawExtraFieldNTFS,
				rawExtraFieldUnix,
				rawExtraField,
				extendedTimestamp: rawExtraFieldExtendedTimestamp.length > 0 || rawExtraFieldNTFS.length > 0,
				extraFieldExtendedTimestampFlag: 1 + (lastAccessDate ? 2 : 0) + (creationDate ? 4 : 0),
				headerArray,
				headerView
			});
			return [entry.filename, entry];
		}));
	}
	async add(name = "", reader, options = {}) {
		const zipWriter = this;
		const { pendingAddFileCalls, config } = zipWriter;
		if (workers < config.maxWorkers) workers++;
		else await new Promise((resolve) => pendingEntries.push(resolve));
		let promiseAddFile;
		try {
			name = name.trim();
			if (zipWriter.filenames.has(name)) throw new Error(ERR_DUPLICATED_NAME);
			zipWriter.filenames.add(name);
			promiseAddFile = addFile(zipWriter, name, reader, options);
			pendingAddFileCalls.add(promiseAddFile);
			return await promiseAddFile;
		} catch (error) {
			zipWriter.filenames.delete(name);
			throw error;
		} finally {
			pendingAddFileCalls.delete(promiseAddFile);
			const pendingEntry = pendingEntries.shift();
			if (pendingEntry) pendingEntry();
			else workers--;
		}
	}
	remove(entry) {
		const { filenames, files } = this;
		if (typeof entry == "string") entry = files.get(entry);
		if (entry && entry.filename !== void 0) {
			const { filename } = entry;
			if (filenames.has(filename) && files.has(filename)) {
				filenames.delete(filename);
				files.delete(filename);
				return true;
			}
		}
		return false;
	}
	async close(comment = new Uint8Array(), options = {}) {
		const zipWriter = this;
		const { pendingAddFileCalls, writer } = this;
		const { writable } = writer;
		while (pendingAddFileCalls.size) await Promise.allSettled(Array.from(pendingAddFileCalls));
		await closeFile(zipWriter, comment, options);
		if (!getOptionValue(zipWriter, options, "preventClose")) await writable.getWriter().close();
		return writer.getData ? writer.getData() : writable;
	}
};
async function addFile(zipWriter, name, reader, options) {
	name = name.trim();
	let msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
	let versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? 20 : 768);
	const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
	const uid = getOptionValue(zipWriter, options, "uid");
	const gid = getOptionValue(zipWriter, options, "gid");
	let unixMode = getOptionValue(zipWriter, options, PROPERTY_NAME_UNIX_MODE);
	const unixExtraFieldType = getOptionValue(zipWriter, options, OPTION_UNIX_EXTRA_FIELD_TYPE);
	let setuid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETUID);
	let setgid = getOptionValue(zipWriter, options, PROPERTY_NAME_SETGID);
	let sticky = getOptionValue(zipWriter, options, PROPERTY_NAME_STICKY);
	if (uid !== void 0 && (uid < 0 || uid > 4294967295)) throw new Error(ERR_INVALID_UID);
	if (gid !== void 0 && (gid < 0 || gid > 4294967295)) throw new Error(ERR_INVALID_GID);
	if (unixMode !== void 0 && (unixMode < 0 || unixMode > 65535)) throw new Error(ERR_INVALID_UNIX_MODE);
	if (unixExtraFieldType !== void 0 && unixExtraFieldType !== INFOZIP_EXTRA_FIELD_TYPE && unixExtraFieldType !== UNIX_EXTRA_FIELD_TYPE) throw new Error(ERR_INVALID_UNIX_EXTRA_FIELD_TYPE);
	let msdosAttributesRaw = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW);
	let msdosAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_MSDOS_ATTRIBUTES);
	const hasUnixMetadata = uid !== void 0 || gid !== void 0 || unixMode !== void 0 || unixExtraFieldType;
	const hasMsDosProvided = msdosAttributesRaw !== void 0 || msdosAttributes !== void 0;
	if (hasUnixMetadata) {
		msDosCompatible = false;
		versionMadeBy = versionMadeBy & MAX_16_BITS | 768;
	} else if (hasMsDosProvided) {
		msDosCompatible = true;
		versionMadeBy = versionMadeBy & 255;
	}
	if (msdosAttributesRaw !== void 0 && (msdosAttributesRaw < 0 || msdosAttributesRaw > 255)) throw new Error(ERR_INVALID_MSDOS_ATTRIBUTES);
	if (msdosAttributes && typeof msdosAttributes !== "object") throw new Error(ERR_INVALID_MSDOS_DATA);
	if (versionMadeBy > 65535) throw new Error(ERR_INVALID_VERSION);
	let externalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, 0);
	if (!options["directory"] && name.endsWith("/")) options[PROPERTY_NAME_DIRECTORY] = true;
	const directory = getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY);
	if (directory) {
		if (!name.endsWith("/")) name += "/";
		if (externalFileAttributes === 0) {
			externalFileAttributes = 16;
			if (!msDosCompatible) externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | 493) << 16;
		}
	} else if (!msDosCompatible && externalFileAttributes === 0) if (executable) externalFileAttributes = 493 << 16;
	else externalFileAttributes = 420 << 16;
	let unixExternalUpper;
	if (!msDosCompatible) {
		unixExternalUpper = externalFileAttributes >> 16 & MAX_16_BITS;
		unixMode = unixMode === void 0 ? unixExternalUpper : unixMode & MAX_16_BITS;
		if (setuid) unixMode |= FILE_ATTR_UNIX_SETUID_MASK;
		else setuid = Boolean(unixMode & FILE_ATTR_UNIX_SETUID_MASK);
		if (setgid) unixMode |= FILE_ATTR_UNIX_SETGID_MASK;
		else setgid = Boolean(unixMode & FILE_ATTR_UNIX_SETGID_MASK);
		if (sticky) unixMode |= 512;
		else sticky = Boolean(unixMode & 512);
		if (directory) unixMode |= FILE_ATTR_UNIX_TYPE_DIR;
		externalFileAttributes = (unixMode & MAX_16_BITS) << 16 | externalFileAttributes & 255;
	}
	({msdosAttributesRaw, msdosAttributes} = normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes));
	if (hasMsDosProvided) externalFileAttributes = externalFileAttributes & MAX_32_BITS | msdosAttributesRaw & 255;
	const encode = getOptionValue(zipWriter, options, OPTION_ENCODE_TEXT, encodeText);
	let rawFilename = encode(name);
	if (rawFilename === void 0) rawFilename = encodeText(name);
	if (getLength(rawFilename) > 65535) throw new Error(ERR_INVALID_ENTRY_NAME);
	const comment = options["comment"] || "";
	let rawComment = encode(comment);
	if (rawComment === void 0) rawComment = encodeText(comment);
	if (getLength(rawComment) > 65535) throw new Error(ERR_INVALID_ENTRY_COMMENT);
	const version = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION, 20);
	if (version > 65535) throw new Error(ERR_INVALID_VERSION);
	const lastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, /* @__PURE__ */ new Date());
	const lastAccessDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
	const creationDate = getOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
	const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
	const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
	let password, rawPassword;
	if (!passThrough) {
		password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
		rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
	}
	const encryptionStrength = getOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
	const zipCrypto = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
	const extendedTimestamp = getOptionValue(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
	const keepOrder = getOptionValue(zipWriter, options, OPTION_KEEP_ORDER, true);
	const useWebWorkers = getOptionValue(zipWriter, options, OPTION_USE_WEB_WORKERS);
	const transferStreams = getOptionValue(zipWriter, options, OPTION_TRANSFER_STREAMS, true);
	const bufferedWrite = getOptionValue(zipWriter, options, OPTION_BUFFERED_WRITE);
	const createTempStream = getOptionValue(zipWriter, options, OPTION_CREATE_TEMP_STREAM);
	const dataDescriptorSignature = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, false);
	const signal = getOptionValue(zipWriter, options, OPTION_SIGNAL);
	const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES, true);
	const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
	let level = getOptionValue(zipWriter, options, OPTION_LEVEL);
	let useCompressionStream = getOptionValue(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
	let dataDescriptor = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR);
	if (bufferedWrite && dataDescriptor === void 0) dataDescriptor = false;
	if (dataDescriptor === void 0 || zipCrypto) dataDescriptor = true;
	if (level !== void 0 && level != 6) useCompressionStream = false;
	if (!useCompressionStream && zipWriter.config.CompressionStream === void 0 && zipWriter.config.CompressionStreamZlib === void 0) level = 0;
	let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
	if (!zipCrypto && (password !== void 0 || rawPassword !== void 0) && !(encryptionStrength >= 1 && encryptionStrength <= 3)) throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
	let rawExtraField = new Uint8Array();
	const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
	if (extraField) {
		let extraFieldSize = 0;
		let offset = 0;
		extraField.forEach((data) => extraFieldSize += 4 + getLength(data));
		rawExtraField = new Uint8Array(extraFieldSize);
		extraField.forEach((data, type) => {
			if (type > 65535) throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
			if (getLength(data) > 65535) throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
			arraySet(rawExtraField, new Uint16Array([type]), offset);
			arraySet(rawExtraField, new Uint16Array([getLength(data)]), offset + 2);
			arraySet(rawExtraField, data, offset + 4);
			offset += 4 + getLength(data);
		});
	}
	let maximumCompressedSize = 0;
	let maximumEntrySize = 0;
	let uncompressedSize = 0;
	if (passThrough) {
		uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
		if (uncompressedSize === void 0) throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
	}
	const zip64Enabled = zip64 === true;
	if (reader) {
		reader = new GenericReader(reader);
		await initStream(reader);
		if (!passThrough) if (reader.size === void 0) {
			dataDescriptor = true;
			if (zip64 || zip64 === void 0) {
				zip64 = true;
				uncompressedSize = maximumCompressedSize = MAX_32_BITS + 1;
			}
		} else {
			options.uncompressedSize = uncompressedSize = reader.size;
			maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
		}
		else {
			options.uncompressedSize = uncompressedSize;
			maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
		}
	}
	const { diskOffset, diskNumber } = zipWriter.writer;
	const zip64UncompressedSize = zip64Enabled || uncompressedSize > 4294967295;
	const zip64CompressedSize = zip64Enabled || maximumCompressedSize > 4294967295;
	if (zip64UncompressedSize || zip64CompressedSize) if (zip64 === false) throw new Error(ERR_UNSUPPORTED_FORMAT);
	else zip64 = true;
	zip64 = zip64 || false;
	const encrypted = getOptionValue(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
	options = Object.assign({}, options, {
		rawFilename,
		rawComment,
		version,
		versionMadeBy,
		lastModDate,
		lastAccessDate,
		creationDate,
		rawExtraField,
		zip64,
		zip64UncompressedSize,
		zip64CompressedSize,
		password,
		rawPassword,
		level,
		useWebWorkers,
		transferStreams,
		encryptionStrength,
		extendedTimestamp,
		zipCrypto,
		bufferedWrite,
		createTempStream,
		keepOrder,
		useUnicodeFileNames,
		dataDescriptor,
		dataDescriptorSignature,
		signal,
		msDosCompatible,
		internalFileAttribute: internalFileAttributes,
		internalFileAttributes,
		externalFileAttribute: externalFileAttributes,
		externalFileAttributes,
		useCompressionStream,
		passThrough,
		encrypted: Boolean(password && getLength(password) || rawPassword && getLength(rawPassword)) || passThrough && encrypted,
		signature: options[PROPERTY_NAME_SIGNATURE],
		compressionMethod,
		uncompressedSize,
		offset: zipWriter.offset - diskOffset,
		diskNumberStart: diskNumber,
		uid,
		gid,
		setuid,
		setgid,
		sticky,
		unixMode,
		msdosAttributesRaw,
		msdosAttributes,
		unixExternalUpper
	});
	const headerInfo = getHeaderInfo(options);
	const dataDescriptorInfo = getDataDescriptorInfo(options);
	const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
	maximumEntrySize = metadataSize + maximumCompressedSize;
	if (zipWriter.options["usdz"]) maximumEntrySize += maximumEntrySize + 64;
	zipWriter.pendingEntriesSize += maximumEntrySize;
	let fileEntry;
	try {
		fileEntry = await getFileEntry(zipWriter, name, reader, {
			headerInfo,
			dataDescriptorInfo,
			metadataSize
		}, options);
	} finally {
		zipWriter.pendingEntriesSize -= maximumEntrySize;
	}
	Object.assign(fileEntry, {
		name,
		comment,
		extraField
	});
	return new Entry(fileEntry);
}
async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
	const { files, writer } = zipWriter;
	const { keepOrder, dataDescriptor, signal } = options;
	const { headerInfo } = entryInfo;
	const usdz = zipWriter.options[OPTION_USDZ];
	const previousFileEntry = Array.from(files.values()).pop();
	let fileEntry = {};
	let bufferedWrite;
	let releaseLockWriter;
	let releaseLockCurrentFileEntry;
	let writingBufferedEntryData;
	let writingEntryData;
	let fileWriter;
	files.set(name, fileEntry);
	try {
		let lockPreviousFileEntry;
		if (keepOrder) {
			lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
			requestLockCurrentFileEntry();
		}
		if ((options.bufferedWrite || !keepOrder || zipWriter.writerLocked || zipWriter.bufferedWrites || !dataDescriptor) && !usdz) {
			if (options.createTempStream) fileWriter = await options.createTempStream();
			else fileWriter = new TransformStream(void 0, void 0, { highWaterMark: INFINITY_VALUE });
			fileWriter.size = 0;
			bufferedWrite = true;
			zipWriter.bufferedWrites++;
			await initStream(writer);
		} else {
			fileWriter = writer;
			await requestLockWriter();
		}
		await initStream(fileWriter);
		const { writable, diskOffset } = writer;
		if (zipWriter.addSplitZipSignature) {
			delete zipWriter.addSplitZipSignature;
			const signatureArray = new Uint8Array(4);
			setUint32(getDataView(signatureArray), 0, SPLIT_ZIP_FILE_SIGNATURE);
			await writeData(writer, signatureArray);
			zipWriter.offset += 4;
		}
		if (usdz) appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
		const { localHeaderView, localHeaderArray } = headerInfo;
		if (!bufferedWrite) {
			await lockPreviousFileEntry;
			await skipDiskIfNeeded(writable);
		}
		const { diskNumber } = writer;
		fileEntry.diskNumberStart = diskNumber;
		if (!bufferedWrite) {
			writingEntryData = true;
			await writeData(fileWriter, localHeaderArray);
		}
		fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
		if (!bufferedWrite) writingEntryData = false;
		files.set(name, fileEntry);
		fileEntry.filename = name;
		if (bufferedWrite) {
			await Promise.all([fileWriter.writable.getWriter().close(), lockPreviousFileEntry]);
			await requestLockWriter();
			writingBufferedEntryData = true;
			fileEntry.diskNumberStart = writer.diskNumber;
			fileEntry.offset = zipWriter.offset - writer.diskOffset;
			updateLocalHeader(fileEntry, localHeaderView, options);
			await skipDiskIfNeeded(writable);
			await writeData(writer, localHeaderArray);
			await fileWriter.readable.pipeTo(writable, {
				preventClose: true,
				preventAbort: true,
				signal
			});
			writer.size += fileWriter.size;
			writingBufferedEntryData = false;
		} else fileEntry.offset = zipWriter.offset - diskOffset;
		zipWriter.offset += fileEntry.size;
		return fileEntry;
	} catch (error) {
		if (writingBufferedEntryData || writingEntryData) {
			zipWriter.hasCorruptedEntries = true;
			if (error) try {
				error.corruptedEntry = true;
			} catch {}
			if (bufferedWrite) zipWriter.offset += fileWriter.size;
			else zipWriter.offset = fileWriter.size;
		}
		files.delete(name);
		throw error;
	} finally {
		if (bufferedWrite) zipWriter.bufferedWrites--;
		if (releaseLockCurrentFileEntry) releaseLockCurrentFileEntry();
		if (releaseLockWriter) releaseLockWriter();
	}
	function requestLockCurrentFileEntry() {
		fileEntry.lock = new Promise((resolve) => releaseLockCurrentFileEntry = resolve);
	}
	async function requestLockWriter() {
		zipWriter.writerLocked = true;
		const { lockWriter } = zipWriter;
		zipWriter.lockWriter = new Promise((resolve) => releaseLockWriter = () => {
			zipWriter.writerLocked = false;
			resolve();
		});
		await lockWriter;
	}
	async function skipDiskIfNeeded(writable) {
		if (getLength(headerInfo.localHeaderArray) > writer.availableSize) {
			writer.availableSize = 0;
			await writeData(writable, new Uint8Array());
		}
	}
}
async function createFileEntry(reader, writer, { diskNumberStart, lock }, entryInfo, config, options) {
	const { headerInfo, dataDescriptorInfo, metadataSize } = entryInfo;
	const { headerArray, headerView, lastModDate, rawLastModDate, encrypted, compressed, version, compressionMethod, rawExtraFieldZip64, localExtraFieldZip64Length, rawExtraFieldExtendedTimestamp, extraFieldExtendedTimestampFlag, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraFieldAES } = headerInfo;
	const { dataDescriptorArray } = dataDescriptorInfo;
	const { rawFilename, lastAccessDate, creationDate, password, rawPassword, level, zip64, zip64UncompressedSize, zip64CompressedSize, zipCrypto, dataDescriptor, directory, executable, versionMadeBy, rawComment, rawExtraField, useWebWorkers, transferStreams, onstart, onprogress, onend, signal, encryptionStrength, extendedTimestamp, msDosCompatible, internalFileAttributes, externalFileAttributes, uid, gid, unixMode, setuid, setgid, sticky, unixExternalUpper, msdosAttributesRaw, msdosAttributes, useCompressionStream, passThrough } = options;
	const fileEntry = {
		lock,
		versionMadeBy,
		zip64,
		directory: Boolean(directory),
		executable: Boolean(executable),
		filenameUTF8: true,
		rawFilename,
		commentUTF8: true,
		rawComment,
		rawExtraFieldZip64,
		localExtraFieldZip64Length,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldUnix,
		rawExtraFieldAES,
		rawExtraField,
		extendedTimestamp,
		msDosCompatible,
		internalFileAttributes,
		externalFileAttributes,
		diskNumberStart,
		uid,
		gid,
		unixMode,
		setuid,
		setgid,
		sticky,
		unixExternalUpper,
		msdosAttributesRaw,
		msdosAttributes
	};
	let { signature, uncompressedSize } = options;
	let compressedSize = 0;
	if (!passThrough) uncompressedSize = 0;
	const { writable } = writer;
	if (reader) {
		reader.chunkSize = getChunkSize(config);
		const readable = reader.readable;
		const size = reader.size;
		const workerOptions = {
			options: {
				codecType: CODEC_DEFLATE,
				level,
				rawPassword,
				password,
				encryptionStrength,
				zipCrypto: encrypted && zipCrypto,
				passwordVerification: encrypted && zipCrypto && rawLastModDate >> 8 & 255,
				signed: !passThrough,
				compressed: compressed && !passThrough,
				encrypted: encrypted && !passThrough,
				useWebWorkers,
				useCompressionStream,
				transferStreams
			},
			config,
			streamOptions: {
				signal,
				size,
				onstart,
				onprogress,
				onend
			}
		};
		try {
			const result = await runWorker({
				readable,
				writable
			}, workerOptions);
			compressedSize = result.outputSize;
			writer.size += compressedSize;
			if (!passThrough) {
				uncompressedSize = result.inputSize;
				signature = result.signature;
			}
		} catch (error) {
			if (error.outputSize !== void 0) writer.size += error.outputSize;
			throw error;
		}
	}
	setEntryInfo({
		signature,
		compressedSize,
		uncompressedSize,
		headerInfo,
		dataDescriptorInfo
	}, options);
	if (dataDescriptor) await writeData(writer, dataDescriptorArray);
	Object.assign(fileEntry, {
		uncompressedSize,
		compressedSize,
		lastModDate,
		rawLastModDate,
		creationDate,
		lastAccessDate,
		encrypted,
		zipCrypto,
		size: metadataSize + compressedSize,
		compressionMethod,
		version,
		headerArray,
		headerView,
		signature,
		extraFieldExtendedTimestampFlag,
		zip64UncompressedSize,
		zip64CompressedSize
	});
	return fileEntry;
}
function getHeaderInfo(options) {
	const { rawFilename, lastModDate, lastAccessDate, creationDate, level, zip64, zipCrypto, useUnicodeFileNames, dataDescriptor, directory, rawExtraField, encryptionStrength, extendedTimestamp, passThrough, encrypted, zip64UncompressedSize, zip64CompressedSize, uncompressedSize } = options;
	let { version, compressionMethod } = options;
	const compressed = !directory && (level > 0 || level === void 0 && compressionMethod !== 0);
	let rawLocalExtraFieldZip64;
	const uncompressedFile = passThrough || !compressed;
	const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !zip64UncompressedSize && !zip64CompressedSize || uncompressedFile);
	if (zip64) {
		let rawLocalExtraFieldZip64Length = 4;
		if (zip64UncompressedSize) rawLocalExtraFieldZip64Length += 8;
		if (zip64CompressedSize) rawLocalExtraFieldZip64Length += 8;
		rawLocalExtraFieldZip64 = new Uint8Array(rawLocalExtraFieldZip64Length);
		const rawLocalExtraFieldZip64View = getDataView(rawLocalExtraFieldZip64);
		setUint16(rawLocalExtraFieldZip64View, 0, 1);
		setUint16(rawLocalExtraFieldZip64View, 2, getLength(rawLocalExtraFieldZip64) - 4);
		if (zip64ExtraFieldComplete) {
			const rawLocalExtraFieldZip64View = getDataView(rawLocalExtraFieldZip64);
			let rawLocalExtraFieldZip64Offset = 4;
			if (zip64UncompressedSize) {
				setBigUint64(rawLocalExtraFieldZip64View, rawLocalExtraFieldZip64Offset, BigInt(uncompressedSize));
				rawLocalExtraFieldZip64Offset += 8;
			}
			if (zip64CompressedSize && uncompressedFile) {
				setBigUint64(rawLocalExtraFieldZip64View, rawLocalExtraFieldZip64Offset, BigInt(uncompressedSize));
				rawLocalExtraFieldZip64Offset += 8;
			}
			if (rawLocalExtraFieldZip64Offset == 4) rawLocalExtraFieldZip64 = new Uint8Array();
		}
	} else rawLocalExtraFieldZip64 = new Uint8Array();
	let rawExtraFieldAES;
	if (encrypted && !zipCrypto) {
		rawExtraFieldAES = new Uint8Array(getLength(EXTRAFIELD_DATA_AES) + 2);
		const extraFieldAESView = getDataView(rawExtraFieldAES);
		setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
		arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
		setUint8(extraFieldAESView, 8, encryptionStrength);
	} else rawExtraFieldAES = new Uint8Array();
	let rawExtraFieldNTFS;
	let rawExtraFieldExtendedTimestamp;
	let extraFieldExtendedTimestampFlag;
	if (extendedTimestamp) {
		rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
		const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
		setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
		extraFieldExtendedTimestampFlag = 1 + (lastAccessDate ? 2 : 0) + (creationDate ? 4 : 0);
		setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
		let offset = 5;
		setUint32(extraFieldExtendedTimestampView, offset, Math.floor(lastModDate.getTime() / 1e3));
		offset += 4;
		if (lastAccessDate) {
			setUint32(extraFieldExtendedTimestampView, offset, Math.floor(lastAccessDate.getTime() / 1e3));
			offset += 4;
		}
		if (creationDate) setUint32(extraFieldExtendedTimestampView, offset, Math.floor(creationDate.getTime() / 1e3));
		try {
			rawExtraFieldNTFS = new Uint8Array(36);
			const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
			const lastModTimeNTFS = getTimeNTFS(lastModDate);
			setUint16(extraFieldNTFSView, 0, 10);
			setUint16(extraFieldNTFSView, 2, 32);
			setUint16(extraFieldNTFSView, 8, 1);
			setUint16(extraFieldNTFSView, 10, 24);
			setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
			setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
			setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
		} catch {
			rawExtraFieldNTFS = new Uint8Array();
		}
	} else rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
	let rawExtraFieldUnix;
	try {
		const { uid, gid, unixMode, setuid, setgid, sticky, unixExtraFieldType } = options;
		if (unixExtraFieldType && (uid !== void 0 || gid !== void 0 || unixMode !== void 0)) {
			const uidBytes = packUnixId(uid);
			const gidBytes = packUnixId(gid);
			let modeArray = new Uint8Array();
			if (unixExtraFieldType == UNIX_EXTRA_FIELD_TYPE && unixMode !== void 0) {
				let modeToWrite = unixMode & MAX_16_BITS;
				if (setuid) modeToWrite |= FILE_ATTR_UNIX_SETUID_MASK;
				if (setgid) modeToWrite |= FILE_ATTR_UNIX_SETGID_MASK;
				if (sticky) modeToWrite |= 512;
				modeArray = new Uint8Array(2);
				new DataView(modeArray.buffer).setUint16(0, modeToWrite, true);
			}
			const payloadLength = 3 + uidBytes.length + gidBytes.length + modeArray.length;
			rawExtraFieldUnix = new Uint8Array(4 + payloadLength);
			const rawExtraFieldUnixView = getDataView(rawExtraFieldUnix);
			setUint16(rawExtraFieldUnixView, 0, unixExtraFieldType == INFOZIP_EXTRA_FIELD_TYPE ? EXTRAFIELD_TYPE_INFOZIP : EXTRAFIELD_TYPE_UNIX);
			setUint16(rawExtraFieldUnixView, 2, payloadLength);
			setUint8(rawExtraFieldUnixView, 4, 1);
			setUint8(rawExtraFieldUnixView, 5, uidBytes.length);
			let offset = 6;
			arraySet(rawExtraFieldUnix, uidBytes, offset);
			offset += uidBytes.length;
			setUint8(rawExtraFieldUnixView, offset, gidBytes.length);
			offset++;
			arraySet(rawExtraFieldUnix, gidBytes, offset);
			offset += gidBytes.length;
			arraySet(rawExtraFieldUnix, modeArray, offset);
		} else rawExtraFieldUnix = new Uint8Array();
	} catch {
		rawExtraFieldUnix = new Uint8Array();
	}
	if (compressionMethod === void 0) compressionMethod = compressed ? 8 : 0;
	if (zip64) version = version > 45 ? version : 45;
	if (encrypted && !zipCrypto) {
		version = version > 51 ? version : 51;
		rawExtraFieldAES[9] = compressionMethod;
		compressionMethod = 99;
	}
	const localExtraFieldZip64Length = zip64ExtraFieldComplete ? getLength(rawLocalExtraFieldZip64) : 0;
	const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
	const { headerArray, headerView, rawLastModDate } = getHeaderArrayData({
		version,
		bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
		compressionMethod,
		uncompressedSize,
		lastModDate: lastModDate < MIN_DATE ? MIN_DATE : lastModDate > MAX_DATE ? MAX_DATE : lastModDate,
		rawFilename,
		zip64CompressedSize,
		zip64UncompressedSize,
		extraFieldLength
	});
	let localHeaderOffset = 30;
	const localHeaderArray = new Uint8Array(localHeaderOffset + getLength(rawFilename) + extraFieldLength);
	const localHeaderView = getDataView(localHeaderArray);
	setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
	arraySet(localHeaderArray, headerArray, 4);
	arraySet(localHeaderArray, rawFilename, localHeaderOffset);
	localHeaderOffset += getLength(rawFilename);
	if (zip64ExtraFieldComplete) arraySet(localHeaderArray, rawLocalExtraFieldZip64, localHeaderOffset);
	localHeaderOffset += localExtraFieldZip64Length;
	arraySet(localHeaderArray, rawExtraFieldAES, localHeaderOffset);
	localHeaderOffset += getLength(rawExtraFieldAES);
	arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, localHeaderOffset);
	localHeaderOffset += getLength(rawExtraFieldExtendedTimestamp);
	arraySet(localHeaderArray, rawExtraFieldNTFS, localHeaderOffset);
	localHeaderOffset += getLength(rawExtraFieldNTFS);
	arraySet(localHeaderArray, rawExtraFieldUnix, localHeaderOffset);
	localHeaderOffset += getLength(rawExtraFieldUnix);
	arraySet(localHeaderArray, rawExtraField, localHeaderOffset);
	if (dataDescriptor) {
		setUint32(localHeaderView, 18, 0);
		setUint32(localHeaderView, 22, 0);
	}
	return {
		localHeaderArray,
		localHeaderView,
		headerArray,
		headerView,
		lastModDate,
		rawLastModDate,
		encrypted,
		compressed,
		version,
		compressionMethod,
		extraFieldExtendedTimestampFlag,
		rawExtraFieldZip64: new Uint8Array(),
		localExtraFieldZip64Length,
		rawExtraFieldExtendedTimestamp,
		rawExtraFieldNTFS,
		rawExtraFieldUnix,
		rawExtraFieldAES,
		extraFieldLength
	};
}
function appendExtraFieldUSDZ(entryInfo, zipWriterOffset) {
	const { headerInfo } = entryInfo;
	let { localHeaderArray, extraFieldLength } = headerInfo;
	let localHeaderArrayView = getDataView(localHeaderArray);
	let extraBytesLength = 64 - (zipWriterOffset + getLength(localHeaderArray)) % 64;
	if (extraBytesLength < 4) extraBytesLength += 64;
	const rawExtraFieldUSDZ = new Uint8Array(extraBytesLength);
	const extraFieldUSDZView = getDataView(rawExtraFieldUSDZ);
	setUint16(extraFieldUSDZView, 0, EXTRAFIELD_TYPE_USDZ);
	setUint16(extraFieldUSDZView, 2, extraBytesLength - 2);
	const previousLocalHeaderArray = localHeaderArray;
	headerInfo.localHeaderArray = localHeaderArray = new Uint8Array(getLength(previousLocalHeaderArray) + extraBytesLength);
	arraySet(localHeaderArray, previousLocalHeaderArray);
	arraySet(localHeaderArray, rawExtraFieldUSDZ, getLength(previousLocalHeaderArray));
	localHeaderArrayView = getDataView(localHeaderArray);
	setUint16(localHeaderArrayView, 28, extraFieldLength + extraBytesLength);
	entryInfo.metadataSize += extraBytesLength;
}
function packUnixId(id) {
	if (id === void 0) return new Uint8Array();
	else {
		const dataArray = new Uint8Array(4);
		getDataView(dataArray).setUint32(0, id, true);
		let length = 4;
		while (length > 1 && dataArray[length - 1] === 0) length--;
		return dataArray.subarray(0, length);
	}
}
function normalizeMsdosAttributes(msdosAttributesRaw, msdosAttributes) {
	if (msdosAttributesRaw !== void 0) msdosAttributesRaw = msdosAttributesRaw & 255;
	else if (msdosAttributes !== void 0) {
		const { readOnly, hidden, system, directory: msdDir, archive } = msdosAttributes;
		let raw = 0;
		if (readOnly) raw |= 1;
		if (hidden) raw |= 2;
		if (system) raw |= 4;
		if (msdDir) raw |= 16;
		if (archive) raw |= 32;
		msdosAttributesRaw = raw & 255;
	}
	if (msdosAttributes === void 0) msdosAttributes = {
		readOnly: Boolean(msdosAttributesRaw & 1),
		hidden: Boolean(msdosAttributesRaw & 2),
		system: Boolean(msdosAttributesRaw & 4),
		directory: Boolean(msdosAttributesRaw & 16),
		archive: Boolean(msdosAttributesRaw & 32)
	};
	return {
		msdosAttributesRaw,
		msdosAttributes
	};
}
function getDataDescriptorInfo({ zip64, dataDescriptor, dataDescriptorSignature }) {
	let dataDescriptorArray = new Uint8Array();
	let dataDescriptorView, dataDescriptorOffset = 0;
	let dataDescriptorLength = zip64 ? 20 : 12;
	if (dataDescriptorSignature) dataDescriptorLength += 4;
	if (dataDescriptor) {
		dataDescriptorArray = new Uint8Array(dataDescriptorLength);
		dataDescriptorView = getDataView(dataDescriptorArray);
		if (dataDescriptorSignature) {
			dataDescriptorOffset = 4;
			setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
		}
	}
	return {
		dataDescriptorArray,
		dataDescriptorView,
		dataDescriptorOffset
	};
}
function setEntryInfo({ signature, compressedSize, uncompressedSize, headerInfo, dataDescriptorInfo }, { zip64, zipCrypto, dataDescriptor }) {
	const { headerView, encrypted } = headerInfo;
	const { dataDescriptorView, dataDescriptorOffset } = dataDescriptorInfo;
	if ((!encrypted || zipCrypto) && signature !== void 0) {
		setUint32(headerView, 10, signature);
		if (dataDescriptor) setUint32(dataDescriptorView, dataDescriptorOffset, signature);
	}
	if (zip64) {
		if (dataDescriptor) {
			setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
			setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
		}
	} else {
		setUint32(headerView, 14, compressedSize);
		setUint32(headerView, 18, uncompressedSize);
		if (dataDescriptor) {
			setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
			setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
		}
	}
}
function updateLocalHeader({ rawFilename, encrypted, zip64, localExtraFieldZip64Length, signature, compressedSize, uncompressedSize, zip64UncompressedSize, zip64CompressedSize }, localHeaderView, { dataDescriptor }) {
	if (!dataDescriptor) {
		if (!encrypted) setUint32(localHeaderView, 14, signature);
		if (!zip64CompressedSize) setUint32(localHeaderView, 18, compressedSize);
		if (!zip64UncompressedSize) setUint32(localHeaderView, 22, uncompressedSize);
	}
	if (zip64 && localExtraFieldZip64Length) {
		let localHeaderOffset = 30 + getLength(rawFilename) + 4;
		if (zip64UncompressedSize) {
			setBigUint64(localHeaderView, localHeaderOffset, BigInt(uncompressedSize));
			localHeaderOffset += 8;
		}
		if (zip64CompressedSize) {
			setBigUint64(localHeaderView, localHeaderOffset, BigInt(compressedSize));
			localHeaderOffset += 8;
		}
	}
}
async function closeFile(zipWriter, comment, options) {
	const { files, writer } = zipWriter;
	const { diskOffset } = writer;
	let { diskNumber } = writer;
	let offset = 0;
	let directoryDataLength = 0;
	let directoryOffset = zipWriter.offset - diskOffset;
	let filesLength = files.size;
	for (const [, fileEntry] of files) {
		const { rawFilename, rawExtraFieldAES, rawComment, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, extendedTimestamp, extraFieldExtendedTimestampFlag, lastModDate, zip64UncompressedSize, zip64CompressedSize, uncompressedSize, compressedSize } = fileEntry;
		const zip64Offset = fileEntry.offset > MAX_32_BITS;
		const zip64DiskNumberStart = fileEntry.diskNumberStart > MAX_16_BITS;
		let rawExtraFieldZip64;
		if (zip64Offset || zip64DiskNumberStart || zip64UncompressedSize || zip64CompressedSize) {
			let length = 4;
			if (zip64UncompressedSize) length += 8;
			if (zip64CompressedSize) length += 8;
			if (zip64Offset) length += 8;
			if (zip64DiskNumberStart) length += 4;
			rawExtraFieldZip64 = new Uint8Array(length);
			const zip64View = getDataView(rawExtraFieldZip64);
			setUint16(zip64View, 0, 1);
			setUint16(zip64View, 2, length - 4);
			let zip64FieldOffset = 4;
			if (zip64UncompressedSize) {
				setBigUint64(zip64View, zip64FieldOffset, BigInt(uncompressedSize));
				zip64FieldOffset += 8;
			}
			if (zip64CompressedSize) {
				setBigUint64(zip64View, zip64FieldOffset, BigInt(compressedSize));
				zip64FieldOffset += 8;
			}
			if (zip64Offset) {
				setBigUint64(zip64View, zip64FieldOffset, BigInt(fileEntry.offset));
				zip64FieldOffset += 8;
			}
			if (zip64DiskNumberStart) setUint32(zip64View, zip64FieldOffset, fileEntry.diskNumberStart);
		} else rawExtraFieldZip64 = new Uint8Array();
		fileEntry.rawExtraFieldZip64 = rawExtraFieldZip64;
		fileEntry.zip64Offset = zip64Offset;
		fileEntry.zip64DiskNumberStart = zip64DiskNumberStart;
		let rawExtraFieldTimestamp;
		if (extendedTimestamp) {
			rawExtraFieldTimestamp = new Uint8Array(9);
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, 5);
			setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
			setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1e3));
		} else rawExtraFieldTimestamp = new Uint8Array();
		fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
		directoryDataLength += 46 + getLength(rawFilename, rawComment, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraFieldTimestamp, rawExtraField);
	}
	const directoryArray = new Uint8Array(directoryDataLength);
	const directoryView = getDataView(directoryArray);
	await initStream(writer);
	let directoryDiskOffset = 0;
	for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
		const { offset: fileEntryOffset, rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField, rawComment, versionMadeBy, headerArray, headerView, zip64UncompressedSize, zip64CompressedSize, zip64DiskNumberStart, zip64Offset, internalFileAttributes, externalFileAttributes, diskNumberStart, uncompressedSize, compressedSize } = fileEntry;
		const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraFieldUnix, rawExtraField);
		setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
		setUint16(directoryView, offset + 4, versionMadeBy);
		if (!zip64UncompressedSize) setUint32(headerView, 18, uncompressedSize);
		if (!zip64CompressedSize) setUint32(headerView, 14, compressedSize);
		arraySet(directoryArray, headerArray, offset + 6);
		let directoryOffset = offset + 30;
		setUint16(directoryView, directoryOffset, extraFieldLength);
		directoryOffset += 2;
		setUint16(directoryView, directoryOffset, getLength(rawComment));
		directoryOffset += 2;
		setUint16(directoryView, directoryOffset, zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
		directoryOffset += 2;
		setUint16(directoryView, directoryOffset, internalFileAttributes);
		directoryOffset += 2;
		if (externalFileAttributes) setUint32(directoryView, directoryOffset, externalFileAttributes);
		directoryOffset += 4;
		setUint32(directoryView, directoryOffset, zip64Offset ? MAX_32_BITS : fileEntryOffset);
		directoryOffset += 4;
		arraySet(directoryArray, rawFilename, directoryOffset);
		directoryOffset += getLength(rawFilename);
		arraySet(directoryArray, rawExtraFieldZip64, directoryOffset);
		directoryOffset += getLength(rawExtraFieldZip64);
		arraySet(directoryArray, rawExtraFieldAES, directoryOffset);
		directoryOffset += getLength(rawExtraFieldAES);
		arraySet(directoryArray, rawExtraFieldExtendedTimestamp, directoryOffset);
		directoryOffset += getLength(rawExtraFieldExtendedTimestamp);
		arraySet(directoryArray, rawExtraFieldNTFS, directoryOffset);
		directoryOffset += getLength(rawExtraFieldNTFS);
		arraySet(directoryArray, rawExtraFieldUnix, directoryOffset);
		directoryOffset += getLength(rawExtraFieldUnix);
		arraySet(directoryArray, rawExtraField, directoryOffset);
		directoryOffset += getLength(rawExtraField);
		arraySet(directoryArray, rawComment, directoryOffset);
		directoryOffset += getLength(rawComment);
		if (offset - directoryDiskOffset > writer.availableSize) {
			writer.availableSize = 0;
			await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
			directoryDiskOffset = offset;
		}
		offset = directoryOffset;
		if (options.onprogress) try {
			await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
		} catch {}
	}
	await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
	let lastDiskNumber = writer.diskNumber;
	const { availableSize } = writer;
	if (availableSize < 22) lastDiskNumber++;
	let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
	if (directoryOffset > 4294967295 || directoryDataLength > 4294967295 || filesLength > 65535 || lastDiskNumber > 65535) if (zip64 === false) throw new Error(ERR_UNSUPPORTED_FORMAT);
	else zip64 = true;
	const endOfdirectoryArray = new Uint8Array(zip64 ? 98 : 22);
	const endOfdirectoryView = getDataView(endOfdirectoryArray);
	offset = 0;
	if (zip64) {
		setUint32(endOfdirectoryView, 0, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
		setBigUint64(endOfdirectoryView, 4, BigInt(44));
		setUint16(endOfdirectoryView, 12, 45);
		setUint16(endOfdirectoryView, 14, 45);
		setUint32(endOfdirectoryView, 16, lastDiskNumber);
		setUint32(endOfdirectoryView, 20, diskNumber);
		setBigUint64(endOfdirectoryView, 24, BigInt(filesLength));
		setBigUint64(endOfdirectoryView, 32, BigInt(filesLength));
		setBigUint64(endOfdirectoryView, 40, BigInt(directoryDataLength));
		setBigUint64(endOfdirectoryView, 48, BigInt(directoryOffset));
		setUint32(endOfdirectoryView, 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
		setBigUint64(endOfdirectoryView, 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
		setUint32(endOfdirectoryView, 72, lastDiskNumber + 1);
		if (getOptionValue(zipWriter, options, "supportZip64SplitFile", true)) {
			lastDiskNumber = MAX_16_BITS;
			diskNumber = MAX_16_BITS;
		}
		filesLength = MAX_16_BITS;
		directoryOffset = MAX_32_BITS;
		directoryDataLength = MAX_32_BITS;
		offset += 76;
	}
	setUint32(endOfdirectoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
	setUint16(endOfdirectoryView, offset + 4, lastDiskNumber);
	setUint16(endOfdirectoryView, offset + 6, diskNumber);
	setUint16(endOfdirectoryView, offset + 8, filesLength);
	setUint16(endOfdirectoryView, offset + 10, filesLength);
	setUint32(endOfdirectoryView, offset + 12, directoryDataLength);
	setUint32(endOfdirectoryView, offset + 16, directoryOffset);
	const commentLength = getLength(comment);
	if (commentLength) if (commentLength <= 65535) setUint16(endOfdirectoryView, offset + 20, commentLength);
	else throw new Error(ERR_INVALID_COMMENT);
	await writeData(writer, endOfdirectoryArray);
	if (commentLength) await writeData(writer, comment);
}
async function writeData(writer, array) {
	const { writable } = writer;
	const streamWriter = writable.getWriter();
	try {
		await streamWriter.ready;
		writer.size += getLength(array);
		await streamWriter.write(array);
	} finally {
		streamWriter.releaseLock();
	}
}
function getTimeNTFS(date) {
	if (date) return (BigInt(date.getTime()) + BigInt(0xa9730b66800)) * BigInt(1e4);
}
function getOptionValue(zipWriter, options, name, defaultValue) {
	const result = options[name] === void 0 ? zipWriter.options[name] : options[name];
	return result === void 0 ? defaultValue : result;
}
function getMaximumCompressedSize(uncompressedSize) {
	return uncompressedSize + 5 * (Math.floor(uncompressedSize / 16383) + 1);
}
function setUint8(view, offset, value) {
	view.setUint8(offset, value);
}
function setUint16(view, offset, value) {
	view.setUint16(offset, value, true);
}
function setUint32(view, offset, value) {
	view.setUint32(offset, value, true);
}
function setBigUint64(view, offset, value) {
	view.setBigUint64(offset, value, true);
}
function arraySet(array, typedArray, offset) {
	array.set(typedArray, offset);
}
function getDataView(array) {
	return new DataView(array.buffer);
}
function getLength(...arrayLikes) {
	let result = 0;
	arrayLikes.forEach((arrayLike) => arrayLike && (result += arrayLike.length));
	return result;
}
function getHeaderArrayData({ version, bitFlag, compressionMethod, uncompressedSize, compressedSize, lastModDate, rawFilename, zip64CompressedSize, zip64UncompressedSize, extraFieldLength }) {
	const headerArray = new Uint8Array(26);
	const headerView = getDataView(headerArray);
	setUint16(headerView, 0, version);
	setUint16(headerView, 2, bitFlag);
	setUint16(headerView, 4, compressionMethod);
	const dateArray = new Uint32Array(1);
	const dateView = getDataView(dateArray);
	setUint16(dateView, 0, (lastModDate.getHours() << 6 | lastModDate.getMinutes()) << 5 | lastModDate.getSeconds() / 2);
	setUint16(dateView, 2, (lastModDate.getFullYear() - 1980 << 4 | lastModDate.getMonth() + 1) << 5 | lastModDate.getDate());
	const rawLastModDate = dateArray[0];
	setUint32(headerView, 6, rawLastModDate);
	if (zip64CompressedSize || compressedSize !== void 0) setUint32(headerView, 14, zip64CompressedSize ? MAX_32_BITS : compressedSize);
	if (zip64UncompressedSize || uncompressedSize !== void 0) setUint32(headerView, 18, zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
	setUint16(headerView, 22, getLength(rawFilename));
	setUint16(headerView, 24, extraFieldLength);
	return {
		headerArray,
		headerView,
		rawLastModDate
	};
}
function getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod) {
	let bitFlag = 0;
	if (useUnicodeFileNames) bitFlag = bitFlag | BITFLAG_LANG_ENCODING_FLAG;
	if (dataDescriptor) bitFlag = bitFlag | 8;
	if (compressionMethod == 8 || compressionMethod == 9) {
		if (level >= 0 && level <= 3) bitFlag = bitFlag | 6;
		if (level > 3 && level <= 5) bitFlag = bitFlag | 4;
		if (level == 9) bitFlag = bitFlag | 2;
	}
	if (encrypted) bitFlag = bitFlag | 1;
	return bitFlag;
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-core-base.js
try {
	configure({ baseURI: import.meta.url });
} catch {}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zlib-streams-inline.js
var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function g(g) {
	let B;
	g({ wasmURI: () => (B || (B = "data:application/wasm;base64," + ((g) => {
		g = ((g) => {
			const B = (g = (g + "").replace(/[^A-Za-z0-9+/=]/g, "")).length, E = [];
			for (let I = 0; B > I; I += 4) {
				const B = A.indexOf(g[I]) << 18 | A.indexOf(g[I + 1]) << 12 | (63 & A.indexOf(g[I + 2])) << 6 | 63 & A.indexOf(g[I + 3]);
				E.push(B >> 16 & 255), "=" !== g[I + 2] && E.push(B >> 8 & 255), "=" !== g[I + 3] && E.push(255 & B);
			}
			return new Uint8Array(E);
		})(g);
		let B = new Uint8Array(1024), E = 0;
		for (let A = 0; A < g.length;) {
			const C = g[A++];
			if (128 & C) {
				const Q = 3 + (127 & C), D = g[A++] << 8 | g[A++], o = E - D;
				I(E + Q);
				for (let A = 0; Q > A; A++) B[E++] = B[o + A];
			} else {
				const Q = C;
				I(E + Q);
				for (let I = 0; Q > I && A < g.length; I++) B[E++] = g[A++];
			}
		}
		return ((g) => {
			let B = "";
			const E = g.length;
			let I = 0;
			for (; E > I + 2; I += 3) {
				const E = g[I] << 16 | g[I + 1] << 8 | g[I + 2];
				B += A[E >> 18 & 63] + A[E >> 12 & 63] + A[E >> 6 & 63] + A[63 & E];
			}
			const C = E - I;
			if (1 === C) {
				const E = g[I] << 16;
				B += A[E >> 18 & 63] + A[E >> 12 & 63] + "==";
			} else if (2 === C) {
				const E = g[I] << 16 | g[I + 1] << 8;
				B += A[E >> 18 & 63] + A[E >> 12 & 63] + A[E >> 6 & 63] + "=";
			}
			return B;
		})(new Uint8Array(B.buffer.slice(0, E)));
		function I(A) {
			if (B.length < A) {
				let g = 2 * B.length;
				for (; A > g;) g *= 2;
				const I = new Uint8Array(g);
				I.set(B.subarray(0, E)), B = I;
			}
		}
	})("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BAGZgAAEAVmAAAQB2YAABAE5gAAEAbmAAAQBeYAABAH5gAAEAQWAAAQBhYAABAFFgAAEAcWAAAQBJYAABAGlgAAEAWWAAAQB5YAABAEVgAAEAZWAAAQBVYAABAHVgAAEATWAAAQBtYAABAF1gAAEAfWAAAQBDYAABAGNgAAEAU2AAAQBzYAABIARMwIArYAABAFtgAAEAe2AAAQBHYAABAGdgAAEAV2AAAQB3YAABAE9gAAEAb2AAAQBfYAABAH9gAAEAROAAMIFEwEJAJOAAAgBk4AACAFTgAAIAVOAAAgB04AACAHTgAAIATOAAAgBM4AACAGzgAAIAbOAAAgBc4AACAFzgAAIAfOAAAgB84AACAELgAAIgBDagAQCgAAEgAAIAUuAAAgBS4AACAHLgAAIAcuAAAgBK4AACAErgAAIAauAAAgBq4AACAFrgAAIAWuAAAgB64AACAHrgAAIARuAAAgBG4AACAGbgAAIAZuAAAgBW4AACAFbgAAIAduAAAgB24AACAE7gAAIATuAAAgBu4AACAG7gAAIAXuAAAgBe4AACAH7gAAIAfuAAAiBA7YBB4AACAGHgAAIAYeAAAgBR4AACAFHgAAIAceAAAgBx4AACAEngAAIASeAAAgBp4AACAGngAAIAWeAAAgBZ4AACAHngAAIAeeAAAgBF4AACAEXgAAIAZeAAAgBl4AACAFXgAAIAVeAAAgB14AACAHXgAAIATeAAAgBN4AACAG3gAAIAbeAAAgBd4AACAF3gAAIAfeAAAgB94AACAEPgAAIAQ+AAAgBj4AACAGPgAAIAU+AAAgBT4AACAHPgAAIAc+AAAgBL4AACAEvgAAIAa+AAAgBr4AACAFvgAAIAW+AAAgB74AACAHvgAAIAR+AAAgBH4AACAGfgAAIAZ+AAAgBX4AACAFfgAAIAd+AAAgB34AACAE/gAAIAT+AAAgBv4AACAG/gAAIAX+AAAgBf4AACAH/gAAIAf+AAAiBBAoBQIAABAEggAAEAWCAAAQBEIAABAFQgAAEATCAAAQBcIIFVgMHAEiAAAQBKIAABAFogAAEARiAAAQBWIAABAE4gAAEAXiAAAQBBIAABAFEgAAEASSAAAQBZIAABAEUgAAEAVSAAAQBNIAABAF0gAAEAQOAAEIBg4AABAFDgAAEAcOAAAQBI4AABAGjgAAEAWOAAAQB44AABIC+K4AAdIECxgEFgABcAQWCBUoBFIAABAEMgAAEARyAAASAvlaABEQBBYIGBAEaggXqAQWAA9QBBYADuAEFgAOcgE92gAAEARGAAAQBCYAABAEZgAAEgQACARWAAAQBDYAABAEdgAAEgL59gAKkgQZAAQWAAiyBBaYBBYABtAEFgD3fAxsLTYMfuYcABIC+rooABIEHUYkABAEEjAAEAQWKAAQEQbAcC4C9CosAS40AO4UALwEGhAAEgQWIgQAEgQEKgQAEgQGSgQAEgIS2ggAEAQuEAAQBDIQABIAF24FHeQTgHQsjhQBfhQXLAhARgAVtBgcJBgoFC4A6uAQNAg4BgAclBJQeC2mFAJCFAIiFAICFAHiBAGiBAFyBBh8BEIAABAEUgAAEARiAAAQBHIAABAEggAAEASiAAAQBMIAABAE4gAAEAUCAAAQBUIAABIEGvQFwgAAEAYCAAAQBoIAABAHAgAAEAeCAAG8DHwtyjQBvgQBrgQBngQBjgQBfgQBbgQBXgQBTgQBPgQBLgQBHgQBDgQE8AYCvAEGAUc0CC22BAMcBBIAAAgEIgAAEgQEzgQJLARCAAA6DAAyBnqyAqmuEACSBB3OBAE8BCIAACIEAGIUADIEIt4MADAEggQCUgDKEgQBrAYCBCC8BBIMADIA/SAoBABAMAEGRIQv/gCUfgMDAgIKxBQgJCQoKgEk3gAABAQ2AAAEBDoAAAQEPgAABARCEAAEBEYQAAQEShAABAROEAAEBFIwAAQEVjAABARaMAAEBF4wAAQEYnAABARmcAAEBGpwAAQEbmwABARyBffsEBAQFBYHB1QEHgAABAQiEAAGAXSqCAAEBCowAAYAnsooAAYEBMJkAAYEBTJkAAYEBaLkAAYEBpLkAAYIDdYABzoUBvI0BqJ0BkLwBgAIbHLwAAQEdvAABgA9PgH05A9AqAQ==")), B) });
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams.js
var wasm, malloc, free, memory;
function setWasmExports(wasmAPI) {
	wasm = wasmAPI;
	({malloc, free, memory} = wasm);
	if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
		wasm = malloc = free = memory = null;
		throw new Error("Invalid WASM module");
	}
}
function _make(isCompress, type, options = {}) {
	const level = typeof options.level === "number" ? options.level : -1;
	const outBufferSize = typeof options.outBuffer === "number" ? options.outBuffer : 64 * 1024;
	const inBufferSize = typeof options.inBufferSize === "number" ? options.inBufferSize : 64 * 1024;
	return new TransformStream({
		start() {
			let result;
			this.out = malloc(outBufferSize);
			this.in = malloc(inBufferSize);
			this.inBufferSize = inBufferSize;
			this._scratch = new Uint8Array(outBufferSize);
			if (isCompress) {
				this._process = wasm.deflate_process;
				this._last_consumed = wasm.deflate_last_consumed;
				this._end = wasm.deflate_end;
				this.streamHandle = wasm.deflate_new();
				if (type === "gzip") result = wasm.deflate_init_gzip(this.streamHandle, level);
				else if (type === "deflate-raw") result = wasm.deflate_init_raw(this.streamHandle, level);
				else result = wasm.deflate_init(this.streamHandle, level);
			} else if (type === "deflate64-raw") {
				this._process = wasm.inflate9_process;
				this._last_consumed = wasm.inflate9_last_consumed;
				this._end = wasm.inflate9_end;
				this.streamHandle = wasm.inflate9_new();
				result = wasm.inflate9_init_raw(this.streamHandle);
			} else {
				this._process = wasm.inflate_process;
				this._last_consumed = wasm.inflate_last_consumed;
				this._end = wasm.inflate_end;
				this.streamHandle = wasm.inflate_new();
				if (type === "deflate-raw") result = wasm.inflate_init_raw(this.streamHandle);
				else if (type === "gzip") result = wasm.inflate_init_gzip(this.streamHandle);
				else result = wasm.inflate_init(this.streamHandle);
			}
			if (result !== 0) throw new Error("init failed:" + result);
		},
		transform(chunk, controller) {
			try {
				const buffer = chunk;
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const last_consumed = this._last_consumed;
				const out = this.out;
				const scratch = this._scratch;
				let offset = 0;
				while (offset < buffer.length) {
					const toRead = Math.min(buffer.length - offset, 32 * 1024);
					if (!this.in || this.inBufferSize < toRead) {
						if (this.in && free) free(this.in);
						this.in = malloc(toRead);
						this.inBufferSize = toRead;
					}
					heap.set(buffer.subarray(offset, offset + toRead), this.in);
					const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
					const prod = result & 16777215;
					if (prod) {
						scratch.set(heap.subarray(out, out + prod), 0);
						controller.enqueue(scratch.slice(0, prod));
					}
					if (!isCompress) {
						const code = result >> 24 & 255;
						const signedCode = code & 128 ? code - 256 : code;
						if (signedCode < 0) throw new Error("process error:" + signedCode);
					}
					const consumed = last_consumed(this.streamHandle);
					if (consumed === 0) break;
					offset += consumed;
				}
			} catch (error) {
				if (this._end && this.streamHandle) this._end(this.streamHandle);
				if (this.in && free) free(this.in);
				if (this.out && free) free(this.out);
				controller.error(error);
			}
		},
		flush(controller) {
			try {
				const heap = new Uint8Array(memory.buffer);
				const process = this._process;
				const out = this.out;
				const scratch = this._scratch;
				while (true) {
					const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
					const produced = result & 16777215;
					const code = result >> 24 & 255;
					if (!isCompress) {
						const signedCode = code & 128 ? code - 256 : code;
						if (signedCode < 0) throw new Error("process error:" + signedCode);
					}
					if (produced) {
						scratch.set(heap.subarray(out, out + produced), 0);
						controller.enqueue(scratch.slice(0, produced));
					}
					if (code === 1 || produced === 0) break;
				}
			} catch (error) {
				controller.error(error);
			} finally {
				if (this._end && this.streamHandle) {
					const result = this._end(this.streamHandle);
					if (result !== 0) controller.error(/* @__PURE__ */ new Error("end error:" + result));
				}
				if (this.in && free) free(this.in);
				if (this.out && free) free(this.out);
			}
		}
	});
}
var CompressionStreamZlib = class {
	constructor(type = "deflate", options) {
		return _make(true, type, options);
	}
};
var DecompressionStreamZlib = class {
	constructor(type = "deflate", options) {
		return _make(false, type, options);
	}
};
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams-loader.js
var initializedModule = false;
async function initModule(wasmURI, { baseURI }) {
	if (!initializedModule) {
		let arrayBuffer, uri;
		try {
			try {
				uri = new URL(wasmURI, baseURI);
			} catch {}
			arrayBuffer = await (await fetch(uri)).arrayBuffer();
		} catch (error) {
			if (wasmURI.startsWith("data:application/wasm;base64,")) arrayBuffer = arrayBufferFromDataURI(wasmURI);
			else throw error;
		}
		setWasmExports((await WebAssembly.instantiate(arrayBuffer)).instance.exports);
		initializedModule = true;
	}
}
function arrayBufferFromDataURI(dataURI) {
	const base64 = dataURI.split(",")[1];
	const binary = atob(base64);
	const len = binary.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; ++i) bytes[i] = binary.charCodeAt(i);
	return bytes.buffer;
}
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-module-wasm.js
var modulePromise;
g(configure);
configureWorker({ initModule: (config) => {
	if (!modulePromise) {
		let { wasmURI } = config;
		if (typeof wasmURI == "function") wasmURI = wasmURI();
		modulePromise = initModule(wasmURI, config);
	}
	return modulePromise;
} });
configure({
	CompressionStreamZlib,
	DecompressionStreamZlib
});
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/mime-type.js
var table = {
	"application": {
		"andrew-inset": "ez",
		"annodex": "anx",
		"atom+xml": "atom",
		"atomcat+xml": "atomcat",
		"atomserv+xml": "atomsrv",
		"bbolin": "lin",
		"cu-seeme": "cu",
		"davmount+xml": "davmount",
		"dsptype": "tsp",
		"ecmascript": ["es", "ecma"],
		"futuresplash": "spl",
		"hta": "hta",
		"java-archive": "jar",
		"java-serialized-object": "ser",
		"java-vm": "class",
		"m3g": "m3g",
		"mac-binhex40": "hqx",
		"mathematica": [
			"nb",
			"ma",
			"mb"
		],
		"msaccess": "mdb",
		"msword": [
			"doc",
			"dot",
			"wiz"
		],
		"mxf": "mxf",
		"oda": "oda",
		"ogg": "ogx",
		"pdf": "pdf",
		"pgp-keys": "key",
		"pgp-signature": ["asc", "sig"],
		"pics-rules": "prf",
		"postscript": [
			"ps",
			"ai",
			"eps",
			"epsi",
			"epsf",
			"eps2",
			"eps3"
		],
		"rar": "rar",
		"rdf+xml": "rdf",
		"rss+xml": "rss",
		"rtf": "rtf",
		"xhtml+xml": ["xhtml", "xht"],
		"xml": [
			"xml",
			"xsl",
			"xsd",
			"xpdl"
		],
		"xspf+xml": "xspf",
		"zip": "zip",
		"vnd.android.package-archive": "apk",
		"vnd.cinderella": "cdy",
		"vnd.google-earth.kml+xml": "kml",
		"vnd.google-earth.kmz": "kmz",
		"vnd.mozilla.xul+xml": "xul",
		"vnd.ms-excel": [
			"xls",
			"xlb",
			"xlt",
			"xlm",
			"xla",
			"xlc",
			"xlw"
		],
		"vnd.ms-pki.seccat": "cat",
		"vnd.ms-pki.stl": "stl",
		"vnd.ms-powerpoint": [
			"ppt",
			"pps",
			"pot",
			"ppa",
			"pwz"
		],
		"vnd.oasis.opendocument.chart": "odc",
		"vnd.oasis.opendocument.database": "odb",
		"vnd.oasis.opendocument.formula": "odf",
		"vnd.oasis.opendocument.graphics": "odg",
		"vnd.oasis.opendocument.graphics-template": "otg",
		"vnd.oasis.opendocument.image": "odi",
		"vnd.oasis.opendocument.presentation": "odp",
		"vnd.oasis.opendocument.presentation-template": "otp",
		"vnd.oasis.opendocument.spreadsheet": "ods",
		"vnd.oasis.opendocument.spreadsheet-template": "ots",
		"vnd.oasis.opendocument.text": "odt",
		"vnd.oasis.opendocument.text-master": ["odm", "otm"],
		"vnd.oasis.opendocument.text-template": "ott",
		"vnd.oasis.opendocument.text-web": "oth",
		"vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
		"vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
		"vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
		"vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
		"vnd.openxmlformats-officedocument.presentationml.template": "potx",
		"vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
		"vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
		"vnd.smaf": "mmf",
		"vnd.stardivision.calc": "sdc",
		"vnd.stardivision.chart": "sds",
		"vnd.stardivision.draw": "sda",
		"vnd.stardivision.impress": "sdd",
		"vnd.stardivision.math": ["sdf", "smf"],
		"vnd.stardivision.writer": ["sdw", "vor"],
		"vnd.stardivision.writer-global": "sgl",
		"vnd.sun.xml.calc": "sxc",
		"vnd.sun.xml.calc.template": "stc",
		"vnd.sun.xml.draw": "sxd",
		"vnd.sun.xml.draw.template": "std",
		"vnd.sun.xml.impress": "sxi",
		"vnd.sun.xml.impress.template": "sti",
		"vnd.sun.xml.math": "sxm",
		"vnd.sun.xml.writer": "sxw",
		"vnd.sun.xml.writer.global": "sxg",
		"vnd.sun.xml.writer.template": "stw",
		"vnd.symbian.install": ["sis", "sisx"],
		"vnd.visio": [
			"vsd",
			"vst",
			"vss",
			"vsw",
			"vsdx",
			"vssx",
			"vstx",
			"vssm",
			"vstm"
		],
		"vnd.wap.wbxml": "wbxml",
		"vnd.wap.wmlc": "wmlc",
		"vnd.wap.wmlscriptc": "wmlsc",
		"vnd.wordperfect": "wpd",
		"vnd.wordperfect5.1": "wp5",
		"x-123": "wk",
		"x-7z-compressed": "7z",
		"x-abiword": "abw",
		"x-apple-diskimage": "dmg",
		"x-bcpio": "bcpio",
		"x-bittorrent": "torrent",
		"x-cbr": [
			"cbr",
			"cba",
			"cbt",
			"cb7"
		],
		"x-cbz": "cbz",
		"x-cdf": ["cdf", "cda"],
		"x-cdlink": "vcd",
		"x-chess-pgn": "pgn",
		"x-cpio": "cpio",
		"x-csh": "csh",
		"x-director": [
			"dir",
			"dxr",
			"cst",
			"cct",
			"cxt",
			"w3d",
			"fgd",
			"swa"
		],
		"x-dms": "dms",
		"x-doom": "wad",
		"x-dvi": "dvi",
		"x-httpd-eruby": "rhtml",
		"x-font": "pcf.Z",
		"x-freemind": "mm",
		"x-gnumeric": "gnumeric",
		"x-go-sgf": "sgf",
		"x-graphing-calculator": "gcf",
		"x-gtar": ["gtar", "taz"],
		"x-hdf": "hdf",
		"x-httpd-php": [
			"phtml",
			"pht",
			"php"
		],
		"x-httpd-php-source": "phps",
		"x-httpd-php3": "php3",
		"x-httpd-php3-preprocessed": "php3p",
		"x-httpd-php4": "php4",
		"x-httpd-php5": "php5",
		"x-ica": "ica",
		"x-info": "info",
		"x-internet-signup": ["ins", "isp"],
		"x-iphone": "iii",
		"x-iso9660-image": "iso",
		"x-java-jnlp-file": "jnlp",
		"x-jmol": "jmz",
		"x-killustrator": "kil",
		"x-latex": "latex",
		"x-lyx": "lyx",
		"x-lzx": "lzx",
		"x-maker": [
			"frm",
			"fb",
			"fbdoc"
		],
		"x-ms-wmd": "wmd",
		"x-msdos-program": [
			"com",
			"exe",
			"bat",
			"dll"
		],
		"x-netcdf": ["nc"],
		"x-ns-proxy-autoconfig": ["pac", "dat"],
		"x-nwc": "nwc",
		"x-object": "o",
		"x-oz-application": "oza",
		"x-pkcs7-certreqresp": "p7r",
		"x-python-code": ["pyc", "pyo"],
		"x-qgis": [
			"qgs",
			"shp",
			"shx"
		],
		"x-quicktimeplayer": "qtl",
		"x-redhat-package-manager": ["rpm", "rpa"],
		"x-ruby": "rb",
		"x-sh": "sh",
		"x-shar": "shar",
		"x-shockwave-flash": ["swf", "swfl"],
		"x-silverlight": "scr",
		"x-stuffit": "sit",
		"x-sv4cpio": "sv4cpio",
		"x-sv4crc": "sv4crc",
		"x-tar": "tar",
		"x-tex-gf": "gf",
		"x-tex-pk": "pk",
		"x-texinfo": ["texinfo", "texi"],
		"x-trash": [
			"~",
			"%",
			"bak",
			"old",
			"sik"
		],
		"x-ustar": "ustar",
		"x-wais-source": "src",
		"x-wingz": "wz",
		"x-x509-ca-cert": [
			"crt",
			"der",
			"cer"
		],
		"x-xcf": "xcf",
		"x-xfig": "fig",
		"x-xpinstall": "xpi",
		"applixware": "aw",
		"atomsvc+xml": "atomsvc",
		"ccxml+xml": "ccxml",
		"cdmi-capability": "cdmia",
		"cdmi-container": "cdmic",
		"cdmi-domain": "cdmid",
		"cdmi-object": "cdmio",
		"cdmi-queue": "cdmiq",
		"docbook+xml": "dbk",
		"dssc+der": "dssc",
		"dssc+xml": "xdssc",
		"emma+xml": "emma",
		"epub+zip": "epub",
		"exi": "exi",
		"font-tdpfr": "pfr",
		"gml+xml": "gml",
		"gpx+xml": "gpx",
		"gxf": "gxf",
		"hyperstudio": "stk",
		"inkml+xml": ["ink", "inkml"],
		"ipfix": "ipfix",
		"jsonml+json": "jsonml",
		"lost+xml": "lostxml",
		"mads+xml": "mads",
		"marc": "mrc",
		"marcxml+xml": "mrcx",
		"mathml+xml": ["mathml", "mml"],
		"mbox": "mbox",
		"mediaservercontrol+xml": "mscml",
		"metalink+xml": "metalink",
		"metalink4+xml": "meta4",
		"mets+xml": "mets",
		"mods+xml": "mods",
		"mp21": ["m21", "mp21"],
		"mp4": "mp4s",
		"oebps-package+xml": "opf",
		"omdoc+xml": "omdoc",
		"onenote": [
			"onetoc",
			"onetoc2",
			"onetmp",
			"onepkg"
		],
		"oxps": "oxps",
		"patch-ops-error+xml": "xer",
		"pgp-encrypted": "pgp",
		"pkcs10": "p10",
		"pkcs7-mime": ["p7m", "p7c"],
		"pkcs7-signature": "p7s",
		"pkcs8": "p8",
		"pkix-attr-cert": "ac",
		"pkix-crl": "crl",
		"pkix-pkipath": "pkipath",
		"pkixcmp": "pki",
		"pls+xml": "pls",
		"prs.cww": "cww",
		"pskc+xml": "pskcxml",
		"reginfo+xml": "rif",
		"relax-ng-compact-syntax": "rnc",
		"resource-lists+xml": "rl",
		"resource-lists-diff+xml": "rld",
		"rls-services+xml": "rs",
		"rpki-ghostbusters": "gbr",
		"rpki-manifest": "mft",
		"rpki-roa": "roa",
		"rsd+xml": "rsd",
		"sbml+xml": "sbml",
		"scvp-cv-request": "scq",
		"scvp-cv-response": "scs",
		"scvp-vp-request": "spq",
		"scvp-vp-response": "spp",
		"sdp": "sdp",
		"set-payment-initiation": "setpay",
		"set-registration-initiation": "setreg",
		"shf+xml": "shf",
		"sparql-query": "rq",
		"sparql-results+xml": "srx",
		"srgs": "gram",
		"srgs+xml": "grxml",
		"sru+xml": "sru",
		"ssdl+xml": "ssdl",
		"ssml+xml": "ssml",
		"tei+xml": ["tei", "teicorpus"],
		"thraud+xml": "tfi",
		"timestamped-data": "tsd",
		"vnd.3gpp.pic-bw-large": "plb",
		"vnd.3gpp.pic-bw-small": "psb",
		"vnd.3gpp.pic-bw-var": "pvb",
		"vnd.3gpp2.tcap": "tcap",
		"vnd.3m.post-it-notes": "pwn",
		"vnd.accpac.simply.aso": "aso",
		"vnd.accpac.simply.imp": "imp",
		"vnd.acucobol": "acu",
		"vnd.acucorp": ["atc", "acutc"],
		"vnd.adobe.air-application-installer-package+zip": "air",
		"vnd.adobe.formscentral.fcdt": "fcdt",
		"vnd.adobe.fxp": ["fxp", "fxpl"],
		"vnd.adobe.xdp+xml": "xdp",
		"vnd.adobe.xfdf": "xfdf",
		"vnd.ahead.space": "ahead",
		"vnd.airzip.filesecure.azf": "azf",
		"vnd.airzip.filesecure.azs": "azs",
		"vnd.amazon.ebook": "azw",
		"vnd.americandynamics.acc": "acc",
		"vnd.amiga.ami": "ami",
		"vnd.anser-web-certificate-issue-initiation": "cii",
		"vnd.anser-web-funds-transfer-initiation": "fti",
		"vnd.antix.game-component": "atx",
		"vnd.apple.installer+xml": "mpkg",
		"vnd.apple.mpegurl": "m3u8",
		"vnd.aristanetworks.swi": "swi",
		"vnd.astraea-software.iota": "iota",
		"vnd.audiograph": "aep",
		"vnd.blueice.multipass": "mpm",
		"vnd.bmi": "bmi",
		"vnd.businessobjects": "rep",
		"vnd.chemdraw+xml": "cdxml",
		"vnd.chipnuts.karaoke-mmd": "mmd",
		"vnd.claymore": "cla",
		"vnd.cloanto.rp9": "rp9",
		"vnd.clonk.c4group": [
			"c4g",
			"c4d",
			"c4f",
			"c4p",
			"c4u"
		],
		"vnd.cluetrust.cartomobile-config": "c11amc",
		"vnd.cluetrust.cartomobile-config-pkg": "c11amz",
		"vnd.commonspace": "csp",
		"vnd.contact.cmsg": "cdbcmsg",
		"vnd.cosmocaller": "cmc",
		"vnd.crick.clicker": "clkx",
		"vnd.crick.clicker.keyboard": "clkk",
		"vnd.crick.clicker.palette": "clkp",
		"vnd.crick.clicker.template": "clkt",
		"vnd.crick.clicker.wordbank": "clkw",
		"vnd.criticaltools.wbs+xml": "wbs",
		"vnd.ctc-posml": "pml",
		"vnd.cups-ppd": "ppd",
		"vnd.curl.car": "car",
		"vnd.curl.pcurl": "pcurl",
		"vnd.dart": "dart",
		"vnd.data-vision.rdz": "rdz",
		"vnd.dece.data": [
			"uvf",
			"uvvf",
			"uvd",
			"uvvd"
		],
		"vnd.dece.ttml+xml": ["uvt", "uvvt"],
		"vnd.dece.unspecified": ["uvx", "uvvx"],
		"vnd.dece.zip": ["uvz", "uvvz"],
		"vnd.denovo.fcselayout-link": "fe_launch",
		"vnd.dna": "dna",
		"vnd.dolby.mlp": "mlp",
		"vnd.dpgraph": "dpg",
		"vnd.dreamfactory": "dfac",
		"vnd.ds-keypoint": "kpxx",
		"vnd.dvb.ait": "ait",
		"vnd.dvb.service": "svc",
		"vnd.dynageo": "geo",
		"vnd.ecowin.chart": "mag",
		"vnd.enliven": "nml",
		"vnd.epson.esf": "esf",
		"vnd.epson.msf": "msf",
		"vnd.epson.quickanime": "qam",
		"vnd.epson.salt": "slt",
		"vnd.epson.ssf": "ssf",
		"vnd.eszigno3+xml": ["es3", "et3"],
		"vnd.ezpix-album": "ez2",
		"vnd.ezpix-package": "ez3",
		"vnd.fdf": "fdf",
		"vnd.fdsn.mseed": "mseed",
		"vnd.fdsn.seed": ["seed", "dataless"],
		"vnd.flographit": "gph",
		"vnd.fluxtime.clip": "ftc",
		"vnd.framemaker": [
			"fm",
			"frame",
			"maker",
			"book"
		],
		"vnd.frogans.fnc": "fnc",
		"vnd.frogans.ltf": "ltf",
		"vnd.fsc.weblaunch": "fsc",
		"vnd.fujitsu.oasys": "oas",
		"vnd.fujitsu.oasys2": "oa2",
		"vnd.fujitsu.oasys3": "oa3",
		"vnd.fujitsu.oasysgp": "fg5",
		"vnd.fujitsu.oasysprs": "bh2",
		"vnd.fujixerox.ddd": "ddd",
		"vnd.fujixerox.docuworks": "xdw",
		"vnd.fujixerox.docuworks.binder": "xbd",
		"vnd.fuzzysheet": "fzs",
		"vnd.genomatix.tuxedo": "txd",
		"vnd.geogebra.file": "ggb",
		"vnd.geogebra.tool": "ggt",
		"vnd.geometry-explorer": ["gex", "gre"],
		"vnd.geonext": "gxt",
		"vnd.geoplan": "g2w",
		"vnd.geospace": "g3w",
		"vnd.gmx": "gmx",
		"vnd.grafeq": ["gqf", "gqs"],
		"vnd.groove-account": "gac",
		"vnd.groove-help": "ghf",
		"vnd.groove-identity-message": "gim",
		"vnd.groove-injector": "grv",
		"vnd.groove-tool-message": "gtm",
		"vnd.groove-tool-template": "tpl",
		"vnd.groove-vcard": "vcg",
		"vnd.hal+xml": "hal",
		"vnd.handheld-entertainment+xml": "zmm",
		"vnd.hbci": "hbci",
		"vnd.hhe.lesson-player": "les",
		"vnd.hp-hpgl": "hpgl",
		"vnd.hp-hpid": "hpid",
		"vnd.hp-hps": "hps",
		"vnd.hp-jlyt": "jlt",
		"vnd.hp-pcl": "pcl",
		"vnd.hp-pclxl": "pclxl",
		"vnd.hydrostatix.sof-data": "sfd-hdstx",
		"vnd.ibm.minipay": "mpy",
		"vnd.ibm.modcap": [
			"afp",
			"listafp",
			"list3820"
		],
		"vnd.ibm.rights-management": "irm",
		"vnd.ibm.secure-container": "sc",
		"vnd.iccprofile": ["icc", "icm"],
		"vnd.igloader": "igl",
		"vnd.immervision-ivp": "ivp",
		"vnd.immervision-ivu": "ivu",
		"vnd.insors.igm": "igm",
		"vnd.intercon.formnet": ["xpw", "xpx"],
		"vnd.intergeo": "i2g",
		"vnd.intu.qbo": "qbo",
		"vnd.intu.qfx": "qfx",
		"vnd.ipunplugged.rcprofile": "rcprofile",
		"vnd.irepository.package+xml": "irp",
		"vnd.is-xpr": "xpr",
		"vnd.isac.fcs": "fcs",
		"vnd.jam": "jam",
		"vnd.jcp.javame.midlet-rms": "rms",
		"vnd.jisp": "jisp",
		"vnd.joost.joda-archive": "joda",
		"vnd.kahootz": ["ktz", "ktr"],
		"vnd.kde.karbon": "karbon",
		"vnd.kde.kchart": "chrt",
		"vnd.kde.kformula": "kfo",
		"vnd.kde.kivio": "flw",
		"vnd.kde.kontour": "kon",
		"vnd.kde.kpresenter": ["kpr", "kpt"],
		"vnd.kde.kspread": "ksp",
		"vnd.kde.kword": ["kwd", "kwt"],
		"vnd.kenameaapp": "htke",
		"vnd.kidspiration": "kia",
		"vnd.kinar": ["kne", "knp"],
		"vnd.koan": [
			"skp",
			"skd",
			"skt",
			"skm"
		],
		"vnd.kodak-descriptor": "sse",
		"vnd.las.las+xml": "lasxml",
		"vnd.llamagraphics.life-balance.desktop": "lbd",
		"vnd.llamagraphics.life-balance.exchange+xml": "lbe",
		"vnd.lotus-1-2-3": "123",
		"vnd.lotus-approach": "apr",
		"vnd.lotus-freelance": "pre",
		"vnd.lotus-notes": "nsf",
		"vnd.lotus-organizer": "org",
		"vnd.lotus-screencam": "scm",
		"vnd.lotus-wordpro": "lwp",
		"vnd.macports.portpkg": "portpkg",
		"vnd.mcd": "mcd",
		"vnd.medcalcdata": "mc1",
		"vnd.mediastation.cdkey": "cdkey",
		"vnd.mfer": "mwf",
		"vnd.mfmp": "mfm",
		"vnd.micrografx.flo": "flo",
		"vnd.micrografx.igx": "igx",
		"vnd.mif": "mif",
		"vnd.mobius.daf": "daf",
		"vnd.mobius.dis": "dis",
		"vnd.mobius.mbk": "mbk",
		"vnd.mobius.mqy": "mqy",
		"vnd.mobius.msl": "msl",
		"vnd.mobius.plc": "plc",
		"vnd.mobius.txf": "txf",
		"vnd.mophun.application": "mpn",
		"vnd.mophun.certificate": "mpc",
		"vnd.ms-artgalry": "cil",
		"vnd.ms-cab-compressed": "cab",
		"vnd.ms-excel.addin.macroenabled.12": "xlam",
		"vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
		"vnd.ms-excel.sheet.macroenabled.12": "xlsm",
		"vnd.ms-excel.template.macroenabled.12": "xltm",
		"vnd.ms-fontobject": "eot",
		"vnd.ms-htmlhelp": "chm",
		"vnd.ms-ims": "ims",
		"vnd.ms-lrm": "lrm",
		"vnd.ms-officetheme": "thmx",
		"vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
		"vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
		"vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
		"vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
		"vnd.ms-powerpoint.template.macroenabled.12": "potm",
		"vnd.ms-project": ["mpp", "mpt"],
		"vnd.ms-word.document.macroenabled.12": "docm",
		"vnd.ms-word.template.macroenabled.12": "dotm",
		"vnd.ms-works": [
			"wps",
			"wks",
			"wcm",
			"wdb"
		],
		"vnd.ms-wpl": "wpl",
		"vnd.ms-xpsdocument": "xps",
		"vnd.mseq": "mseq",
		"vnd.musician": "mus",
		"vnd.muvee.style": "msty",
		"vnd.mynfc": "taglet",
		"vnd.neurolanguage.nlu": "nlu",
		"vnd.nitf": ["ntf", "nitf"],
		"vnd.noblenet-directory": "nnd",
		"vnd.noblenet-sealer": "nns",
		"vnd.noblenet-web": "nnw",
		"vnd.nokia.n-gage.data": "ngdat",
		"vnd.nokia.n-gage.symbian.install": "n-gage",
		"vnd.nokia.radio-preset": "rpst",
		"vnd.nokia.radio-presets": "rpss",
		"vnd.novadigm.edm": "edm",
		"vnd.novadigm.edx": "edx",
		"vnd.novadigm.ext": "ext",
		"vnd.oasis.opendocument.chart-template": "otc",
		"vnd.oasis.opendocument.formula-template": "odft",
		"vnd.oasis.opendocument.image-template": "oti",
		"vnd.olpc-sugar": "xo",
		"vnd.oma.dd2+xml": "dd2",
		"vnd.openofficeorg.extension": "oxt",
		"vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
		"vnd.osgeo.mapguide.package": "mgp",
		"vnd.osgi.dp": "dp",
		"vnd.osgi.subsystem": "esa",
		"vnd.palm": [
			"pdb",
			"pqa",
			"oprc"
		],
		"vnd.pawaafile": "paw",
		"vnd.pg.format": "str",
		"vnd.pg.osasli": "ei6",
		"vnd.picsel": "efif",
		"vnd.pmi.widget": "wg",
		"vnd.pocketlearn": "plf",
		"vnd.powerbuilder6": "pbd",
		"vnd.previewsystems.box": "box",
		"vnd.proteus.magazine": "mgz",
		"vnd.publishare-delta-tree": "qps",
		"vnd.pvi.ptid1": "ptid",
		"vnd.quark.quarkxpress": [
			"qxd",
			"qxt",
			"qwd",
			"qwt",
			"qxl",
			"qxb"
		],
		"vnd.realvnc.bed": "bed",
		"vnd.recordare.musicxml": "mxl",
		"vnd.recordare.musicxml+xml": "musicxml",
		"vnd.rig.cryptonote": "cryptonote",
		"vnd.rn-realmedia": "rm",
		"vnd.rn-realmedia-vbr": "rmvb",
		"vnd.route66.link66+xml": "link66",
		"vnd.sailingtracker.track": "st",
		"vnd.seemail": "see",
		"vnd.sema": "sema",
		"vnd.semd": "semd",
		"vnd.semf": "semf",
		"vnd.shana.informed.formdata": "ifm",
		"vnd.shana.informed.formtemplate": "itp",
		"vnd.shana.informed.interchange": "iif",
		"vnd.shana.informed.package": "ipk",
		"vnd.simtech-mindmapper": ["twd", "twds"],
		"vnd.smart.teacher": "teacher",
		"vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
		"vnd.spotfire.dxp": "dxp",
		"vnd.spotfire.sfs": "sfs",
		"vnd.stepmania.package": "smzip",
		"vnd.stepmania.stepchart": "sm",
		"vnd.sus-calendar": ["sus", "susp"],
		"vnd.svd": "svd",
		"vnd.syncml+xml": "xsm",
		"vnd.syncml.dm+wbxml": "bdm",
		"vnd.syncml.dm+xml": "xdm",
		"vnd.tao.intent-module-archive": "tao",
		"vnd.tcpdump.pcap": [
			"pcap",
			"cap",
			"dmp"
		],
		"vnd.tmobile-livetv": "tmo",
		"vnd.trid.tpt": "tpt",
		"vnd.triscape.mxs": "mxs",
		"vnd.trueapp": "tra",
		"vnd.ufdl": ["ufd", "ufdl"],
		"vnd.uiq.theme": "utz",
		"vnd.umajin": "umj",
		"vnd.unity": "unityweb",
		"vnd.uoml+xml": "uoml",
		"vnd.vcx": "vcx",
		"vnd.visionary": "vis",
		"vnd.vsf": "vsf",
		"vnd.webturbo": "wtb",
		"vnd.wolfram.player": "nbp",
		"vnd.wqd": "wqd",
		"vnd.wt.stf": "stf",
		"vnd.xara": "xar",
		"vnd.xfdl": "xfdl",
		"vnd.yamaha.hv-dic": "hvd",
		"vnd.yamaha.hv-script": "hvs",
		"vnd.yamaha.hv-voice": "hvp",
		"vnd.yamaha.openscoreformat": "osf",
		"vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
		"vnd.yamaha.smaf-audio": "saf",
		"vnd.yamaha.smaf-phrase": "spf",
		"vnd.yellowriver-custom-menu": "cmp",
		"vnd.zul": ["zir", "zirz"],
		"vnd.zzazz.deck+xml": "zaz",
		"voicexml+xml": "vxml",
		"widget": "wgt",
		"winhlp": "hlp",
		"wsdl+xml": "wsdl",
		"wspolicy+xml": "wspolicy",
		"x-ace-compressed": "ace",
		"x-authorware-bin": [
			"aab",
			"x32",
			"u32",
			"vox"
		],
		"x-authorware-map": "aam",
		"x-authorware-seg": "aas",
		"x-blorb": ["blb", "blorb"],
		"x-bzip": "bz",
		"x-bzip2": ["bz2", "boz"],
		"x-cfs-compressed": "cfs",
		"x-chat": "chat",
		"x-conference": "nsc",
		"x-dgc-compressed": "dgc",
		"x-dtbncx+xml": "ncx",
		"x-dtbook+xml": "dtb",
		"x-dtbresource+xml": "res",
		"x-eva": "eva",
		"x-font-bdf": "bdf",
		"x-font-ghostscript": "gsf",
		"x-font-linux-psf": "psf",
		"x-font-pcf": "pcf",
		"x-font-snf": "snf",
		"x-font-ttf": ["ttf", "ttc"],
		"x-font-type1": [
			"pfa",
			"pfb",
			"pfm",
			"afm"
		],
		"x-freearc": "arc",
		"x-gca-compressed": "gca",
		"x-glulx": "ulx",
		"x-gramps-xml": "gramps",
		"x-install-instructions": "install",
		"x-lzh-compressed": ["lzh", "lha"],
		"x-mie": "mie",
		"x-mobipocket-ebook": ["prc", "mobi"],
		"x-ms-application": "application",
		"x-ms-shortcut": "lnk",
		"x-ms-xbap": "xbap",
		"x-msbinder": "obd",
		"x-mscardfile": "crd",
		"x-msclip": "clp",
		"application/x-ms-installer": "msi",
		"x-msmediaview": [
			"mvb",
			"m13",
			"m14"
		],
		"x-msmetafile": [
			"wmf",
			"wmz",
			"emf",
			"emz"
		],
		"x-msmoney": "mny",
		"x-mspublisher": "pub",
		"x-msschedule": "scd",
		"x-msterminal": "trm",
		"x-mswrite": "wri",
		"x-nzb": "nzb",
		"x-pkcs12": ["p12", "pfx"],
		"x-pkcs7-certificates": ["p7b", "spc"],
		"x-research-info-systems": "ris",
		"x-silverlight-app": "xap",
		"x-sql": "sql",
		"x-stuffitx": "sitx",
		"x-subrip": "srt",
		"x-t3vm-image": "t3",
		"x-tex-tfm": "tfm",
		"x-tgif": "obj",
		"x-xliff+xml": "xlf",
		"x-xz": "xz",
		"x-zmachine": [
			"z1",
			"z2",
			"z3",
			"z4",
			"z5",
			"z6",
			"z7",
			"z8"
		],
		"xaml+xml": "xaml",
		"xcap-diff+xml": "xdf",
		"xenc+xml": "xenc",
		"xml-dtd": "dtd",
		"xop+xml": "xop",
		"xproc+xml": "xpl",
		"xslt+xml": "xslt",
		"xv+xml": [
			"mxml",
			"xhvml",
			"xvml",
			"xvm"
		],
		"yang": "yang",
		"yin+xml": "yin",
		"envoy": "evy",
		"fractals": "fif",
		"internet-property-stream": "acx",
		"olescript": "axs",
		"vnd.ms-outlook": "msg",
		"vnd.ms-pkicertstore": "sst",
		"x-compress": "z",
		"x-perfmon": [
			"pma",
			"pmc",
			"pmr",
			"pmw"
		],
		"ynd.ms-pkipko": "pko",
		"gzip": ["gz", "tgz"],
		"smil+xml": ["smi", "smil"],
		"vnd.debian.binary-package": ["deb", "udeb"],
		"vnd.hzn-3d-crossword": "x3d",
		"vnd.sqlite3": [
			"db",
			"sqlite",
			"sqlite3",
			"db-wal",
			"sqlite-wal",
			"db-shm",
			"sqlite-shm"
		],
		"vnd.wap.sic": "sic",
		"vnd.wap.slc": "slc",
		"x-krita": ["kra", "krz"],
		"x-perl": ["pm", "pl"],
		"yaml": ["yaml", "yml"]
	},
	"audio": {
		"amr": "amr",
		"amr-wb": "awb",
		"annodex": "axa",
		"basic": ["au", "snd"],
		"flac": "flac",
		"midi": [
			"mid",
			"midi",
			"kar",
			"rmi"
		],
		"mpeg": [
			"mpga",
			"mpega",
			"mp3",
			"m4a",
			"mp2a",
			"m2a",
			"m3a"
		],
		"mpegurl": "m3u",
		"ogg": [
			"oga",
			"ogg",
			"spx"
		],
		"prs.sid": "sid",
		"x-aiff": "aifc",
		"x-gsm": "gsm",
		"x-ms-wma": "wma",
		"x-ms-wax": "wax",
		"x-pn-realaudio": "ram",
		"x-realaudio": "ra",
		"x-sd2": "sd2",
		"adpcm": "adp",
		"mp4": "mp4a",
		"s3m": "s3m",
		"silk": "sil",
		"vnd.dece.audio": ["uva", "uvva"],
		"vnd.digital-winds": "eol",
		"vnd.dra": "dra",
		"vnd.dts": "dts",
		"vnd.dts.hd": "dtshd",
		"vnd.lucent.voice": "lvp",
		"vnd.ms-playready.media.pya": "pya",
		"vnd.nuera.ecelp4800": "ecelp4800",
		"vnd.nuera.ecelp7470": "ecelp7470",
		"vnd.nuera.ecelp9600": "ecelp9600",
		"vnd.rip": "rip",
		"webm": "weba",
		"x-caf": "caf",
		"x-matroska": "mka",
		"x-pn-realaudio-plugin": "rmp",
		"xm": "xm",
		"aac": "aac",
		"aiff": [
			"aiff",
			"aif",
			"aff"
		],
		"opus": "opus",
		"wav": "wav"
	},
	"chemical": {
		"x-alchemy": "alc",
		"x-cache": ["cac", "cache"],
		"x-cache-csf": "csf",
		"x-cactvs-binary": [
			"cbin",
			"cascii",
			"ctab"
		],
		"x-cdx": "cdx",
		"x-chem3d": "c3d",
		"x-cif": "cif",
		"x-cmdf": "cmdf",
		"x-cml": "cml",
		"x-compass": "cpa",
		"x-crossfire": "bsd",
		"x-csml": ["csml", "csm"],
		"x-ctx": "ctx",
		"x-cxf": ["cxf", "cef"],
		"x-embl-dl-nucleotide": ["emb", "embl"],
		"x-gamess-input": [
			"inp",
			"gam",
			"gamin"
		],
		"x-gaussian-checkpoint": ["fch", "fchk"],
		"x-gaussian-cube": "cub",
		"x-gaussian-input": [
			"gau",
			"gjc",
			"gjf"
		],
		"x-gaussian-log": "gal",
		"x-gcg8-sequence": "gcg",
		"x-genbank": "gen",
		"x-hin": "hin",
		"x-isostar": ["istr", "ist"],
		"x-jcamp-dx": ["jdx", "dx"],
		"x-kinemage": "kin",
		"x-macmolecule": "mcm",
		"x-macromodel-input": "mmod",
		"x-mdl-molfile": "mol",
		"x-mdl-rdfile": "rd",
		"x-mdl-rxnfile": "rxn",
		"x-mdl-sdfile": "sd",
		"x-mdl-tgf": "tgf",
		"x-mmcif": "mcif",
		"x-mol2": "mol2",
		"x-molconn-Z": "b",
		"x-mopac-graph": "gpt",
		"x-mopac-input": [
			"mop",
			"mopcrt",
			"zmt"
		],
		"x-mopac-out": "moo",
		"x-ncbi-asn1": "asn",
		"x-ncbi-asn1-ascii": ["prt", "ent"],
		"x-ncbi-asn1-binary": "val",
		"x-rosdal": "ros",
		"x-swissprot": "sw",
		"x-vamas-iso14976": "vms",
		"x-vmd": "vmd",
		"x-xtel": "xtel",
		"x-xyz": "xyz"
	},
	"font": {
		"otf": "otf",
		"woff": "woff",
		"woff2": "woff2"
	},
	"image": {
		"gif": "gif",
		"ief": "ief",
		"jpeg": [
			"jpeg",
			"jpg",
			"jpe",
			"jfif",
			"jfif-tbnl",
			"jif"
		],
		"pcx": "pcx",
		"png": "png",
		"svg+xml": ["svg", "svgz"],
		"tiff": ["tiff", "tif"],
		"vnd.djvu": ["djvu", "djv"],
		"vnd.wap.wbmp": "wbmp",
		"x-canon-cr2": "cr2",
		"x-canon-crw": "crw",
		"x-cmu-raster": "ras",
		"x-coreldraw": "cdr",
		"x-coreldrawpattern": "pat",
		"x-coreldrawtemplate": "cdt",
		"x-corelphotopaint": "cpt",
		"x-epson-erf": "erf",
		"x-icon": "ico",
		"x-jg": "art",
		"x-jng": "jng",
		"x-nikon-nef": "nef",
		"x-olympus-orf": "orf",
		"x-portable-anymap": "pnm",
		"x-portable-bitmap": "pbm",
		"x-portable-graymap": "pgm",
		"x-portable-pixmap": "ppm",
		"x-rgb": "rgb",
		"x-xbitmap": "xbm",
		"x-xpixmap": "xpm",
		"x-xwindowdump": "xwd",
		"bmp": "bmp",
		"cgm": "cgm",
		"g3fax": "g3",
		"ktx": "ktx",
		"prs.btif": "btif",
		"sgi": "sgi",
		"vnd.dece.graphic": [
			"uvi",
			"uvvi",
			"uvg",
			"uvvg"
		],
		"vnd.dwg": "dwg",
		"vnd.dxf": "dxf",
		"vnd.fastbidsheet": "fbs",
		"vnd.fpx": "fpx",
		"vnd.fst": "fst",
		"vnd.fujixerox.edmics-mmr": "mmr",
		"vnd.fujixerox.edmics-rlc": "rlc",
		"vnd.ms-modi": "mdi",
		"vnd.ms-photo": "wdp",
		"vnd.net-fpx": "npx",
		"vnd.xiff": "xif",
		"webp": "webp",
		"x-3ds": "3ds",
		"x-cmx": "cmx",
		"x-freehand": [
			"fh",
			"fhc",
			"fh4",
			"fh5",
			"fh7"
		],
		"x-pict": ["pic", "pct"],
		"x-tga": "tga",
		"cis-cod": "cod",
		"avif": "avifs",
		"heic": ["heif", "heic"],
		"pjpeg": ["pjpg"],
		"vnd.adobe.photoshop": "psd",
		"x-adobe-dng": "dng",
		"x-fuji-raf": "raf",
		"x-icns": "icns",
		"x-kodak-dcr": "dcr",
		"x-kodak-k25": "k25",
		"x-kodak-kdc": "kdc",
		"x-minolta-mrw": "mrw",
		"x-panasonic-raw": [
			"raw",
			"rw2",
			"rwl"
		],
		"x-pentax-pef": ["pef", "ptx"],
		"x-sigma-x3f": "x3f",
		"x-sony-arw": "arw",
		"x-sony-sr2": "sr2",
		"x-sony-srf": "srf"
	},
	"message": { "rfc822": [
		"eml",
		"mime",
		"mht",
		"mhtml",
		"nws"
	] },
	"model": {
		"iges": ["igs", "iges"],
		"mesh": [
			"msh",
			"mesh",
			"silo"
		],
		"vrml": ["wrl", "vrml"],
		"x3d+vrml": ["x3dv", "x3dvz"],
		"x3d+xml": "x3dz",
		"x3d+binary": ["x3db", "x3dbz"],
		"vnd.collada+xml": "dae",
		"vnd.dwf": "dwf",
		"vnd.gdl": "gdl",
		"vnd.gtw": "gtw",
		"vnd.mts": "mts",
		"vnd.usdz+zip": "usdz",
		"vnd.vtu": "vtu"
	},
	"text": {
		"cache-manifest": ["manifest", "appcache"],
		"calendar": [
			"ics",
			"icz",
			"ifb"
		],
		"css": "css",
		"csv": "csv",
		"h323": "323",
		"html": [
			"html",
			"htm",
			"shtml",
			"stm"
		],
		"iuls": "uls",
		"plain": [
			"txt",
			"text",
			"brf",
			"conf",
			"def",
			"list",
			"log",
			"in",
			"bas",
			"diff",
			"ksh"
		],
		"richtext": "rtx",
		"scriptlet": ["sct", "wsc"],
		"texmacs": "tm",
		"tab-separated-values": "tsv",
		"vnd.sun.j2me.app-descriptor": "jad",
		"vnd.wap.wml": "wml",
		"vnd.wap.wmlscript": "wmls",
		"x-bibtex": "bib",
		"x-boo": "boo",
		"x-c++hdr": [
			"h++",
			"hpp",
			"hxx",
			"hh"
		],
		"x-c++src": [
			"c++",
			"cpp",
			"cxx",
			"cc"
		],
		"x-component": "htc",
		"x-dsrc": "d",
		"x-diff": "patch",
		"x-haskell": "hs",
		"x-java": "java",
		"x-literate-haskell": "lhs",
		"x-moc": "moc",
		"x-pascal": [
			"p",
			"pas",
			"pp",
			"inc"
		],
		"x-pcs-gcd": "gcd",
		"x-python": "py",
		"x-scala": "scala",
		"x-setext": "etx",
		"x-tcl": ["tcl", "tk"],
		"x-tex": [
			"tex",
			"ltx",
			"sty",
			"cls"
		],
		"x-vcalendar": "vcs",
		"x-vcard": "vcf",
		"n3": "n3",
		"prs.lines.tag": "dsc",
		"sgml": ["sgml", "sgm"],
		"troff": [
			"t",
			"tr",
			"roff",
			"man",
			"me",
			"ms"
		],
		"turtle": "ttl",
		"uri-list": [
			"uri",
			"uris",
			"urls"
		],
		"vcard": "vcard",
		"vnd.curl": "curl",
		"vnd.curl.dcurl": "dcurl",
		"vnd.curl.scurl": "scurl",
		"vnd.curl.mcurl": "mcurl",
		"vnd.dvb.subtitle": "sub",
		"vnd.fly": "fly",
		"vnd.fmi.flexstor": "flx",
		"vnd.graphviz": "gv",
		"vnd.in3d.3dml": "3dml",
		"vnd.in3d.spot": "spot",
		"x-asm": ["s", "asm"],
		"x-c": [
			"c",
			"h",
			"dic"
		],
		"x-fortran": [
			"f",
			"for",
			"f77",
			"f90"
		],
		"x-opml": "opml",
		"x-nfo": "nfo",
		"x-sfv": "sfv",
		"x-uuencode": "uu",
		"webviewhtml": "htt",
		"javascript": "js",
		"json": "json",
		"markdown": [
			"md",
			"markdown",
			"mdown",
			"markdn"
		],
		"vnd.wap.si": "si",
		"vnd.wap.sl": "sl"
	},
	"video": {
		"avif": "avif",
		"3gpp": "3gp",
		"annodex": "axv",
		"dl": "dl",
		"dv": ["dif", "dv"],
		"fli": "fli",
		"gl": "gl",
		"mpeg": [
			"mpeg",
			"mpg",
			"mpe",
			"m1v",
			"m2v",
			"mp2",
			"mpa",
			"mpv2"
		],
		"mp4": [
			"mp4",
			"mp4v",
			"mpg4"
		],
		"quicktime": ["qt", "mov"],
		"ogg": "ogv",
		"vnd.mpegurl": ["mxu", "m4u"],
		"x-flv": "flv",
		"x-la-asf": ["lsf", "lsx"],
		"x-mng": "mng",
		"x-ms-asf": [
			"asf",
			"asx",
			"asr"
		],
		"x-ms-wm": "wm",
		"x-ms-wmv": "wmv",
		"x-ms-wmx": "wmx",
		"x-ms-wvx": "wvx",
		"x-msvideo": "avi",
		"x-sgi-movie": "movie",
		"x-matroska": [
			"mpv",
			"mkv",
			"mk3d",
			"mks"
		],
		"3gpp2": "3g2",
		"h261": "h261",
		"h263": "h263",
		"h264": "h264",
		"jpeg": "jpgv",
		"jpm": ["jpm", "jpgm"],
		"mj2": ["mj2", "mjp2"],
		"vnd.dece.hd": ["uvh", "uvvh"],
		"vnd.dece.mobile": ["uvm", "uvvm"],
		"vnd.dece.pd": ["uvp", "uvvp"],
		"vnd.dece.sd": ["uvs", "uvvs"],
		"vnd.dece.video": ["uvv", "uvvv"],
		"vnd.dvb.file": "dvb",
		"vnd.fvt": "fvt",
		"vnd.ms-playready.media.pyv": "pyv",
		"vnd.uvvu.mp4": ["uvu", "uvvu"],
		"vnd.vivo": "viv",
		"webm": "webm",
		"x-f4v": "f4v",
		"x-m4v": "m4v",
		"x-ms-vob": "vob",
		"x-smv": "smv",
		"mp2t": "ts"
	},
	"x-conference": { "x-cooltalk": "ice" },
	"x-world": { "x-vrml": [
		"vrm",
		"flr",
		"wrz",
		"xaf",
		"xof"
	] }
};
(() => {
	const mimeTypes = {};
	for (const type of Object.keys(table)) for (const subtype of Object.keys(table[type])) {
		const value = table[type][subtype];
		if (typeof value == "string") mimeTypes[value] = type + "/" + subtype;
		else for (let indexMimeType = 0; indexMimeType < value.length; indexMimeType++) mimeTypes[value[indexMimeType]] = type + "/" + subtype;
	}
	return mimeTypes;
})();
//#endregion
//#region ../node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-fs-wasm.js
t(configure);
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/other.js
var types$1 = {
	"application/prs.cww": ["cww"],
	"application/prs.xsf+xml": ["xsf"],
	"application/vnd.1000minds.decision-model+xml": ["1km"],
	"application/vnd.3gpp.pic-bw-large": ["plb"],
	"application/vnd.3gpp.pic-bw-small": ["psb"],
	"application/vnd.3gpp.pic-bw-var": ["pvb"],
	"application/vnd.3gpp2.tcap": ["tcap"],
	"application/vnd.3m.post-it-notes": ["pwn"],
	"application/vnd.accpac.simply.aso": ["aso"],
	"application/vnd.accpac.simply.imp": ["imp"],
	"application/vnd.acucobol": ["acu"],
	"application/vnd.acucorp": ["atc", "acutc"],
	"application/vnd.adobe.air-application-installer-package+zip": ["air"],
	"application/vnd.adobe.formscentral.fcdt": ["fcdt"],
	"application/vnd.adobe.fxp": ["fxp", "fxpl"],
	"application/vnd.adobe.xdp+xml": ["xdp"],
	"application/vnd.adobe.xfdf": ["*xfdf"],
	"application/vnd.age": ["age"],
	"application/vnd.ahead.space": ["ahead"],
	"application/vnd.airzip.filesecure.azf": ["azf"],
	"application/vnd.airzip.filesecure.azs": ["azs"],
	"application/vnd.amazon.ebook": ["azw"],
	"application/vnd.americandynamics.acc": ["acc"],
	"application/vnd.amiga.ami": ["ami"],
	"application/vnd.android.package-archive": ["apk"],
	"application/vnd.anser-web-certificate-issue-initiation": ["cii"],
	"application/vnd.anser-web-funds-transfer-initiation": ["fti"],
	"application/vnd.antix.game-component": ["atx"],
	"application/vnd.apple.installer+xml": ["mpkg"],
	"application/vnd.apple.keynote": ["key"],
	"application/vnd.apple.mpegurl": ["m3u8"],
	"application/vnd.apple.numbers": ["numbers"],
	"application/vnd.apple.pages": ["pages"],
	"application/vnd.apple.pkpass": ["pkpass"],
	"application/vnd.aristanetworks.swi": ["swi"],
	"application/vnd.astraea-software.iota": ["iota"],
	"application/vnd.audiograph": ["aep"],
	"application/vnd.autodesk.fbx": ["fbx"],
	"application/vnd.balsamiq.bmml+xml": ["bmml"],
	"application/vnd.blueice.multipass": ["mpm"],
	"application/vnd.bmi": ["bmi"],
	"application/vnd.businessobjects": ["rep"],
	"application/vnd.chemdraw+xml": ["cdxml"],
	"application/vnd.chipnuts.karaoke-mmd": ["mmd"],
	"application/vnd.cinderella": ["cdy"],
	"application/vnd.citationstyles.style+xml": ["csl"],
	"application/vnd.claymore": ["cla"],
	"application/vnd.cloanto.rp9": ["rp9"],
	"application/vnd.clonk.c4group": [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	],
	"application/vnd.cluetrust.cartomobile-config": ["c11amc"],
	"application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"],
	"application/vnd.commonspace": ["csp"],
	"application/vnd.contact.cmsg": ["cdbcmsg"],
	"application/vnd.cosmocaller": ["cmc"],
	"application/vnd.crick.clicker": ["clkx"],
	"application/vnd.crick.clicker.keyboard": ["clkk"],
	"application/vnd.crick.clicker.palette": ["clkp"],
	"application/vnd.crick.clicker.template": ["clkt"],
	"application/vnd.crick.clicker.wordbank": ["clkw"],
	"application/vnd.criticaltools.wbs+xml": ["wbs"],
	"application/vnd.ctc-posml": ["pml"],
	"application/vnd.cups-ppd": ["ppd"],
	"application/vnd.curl.car": ["car"],
	"application/vnd.curl.pcurl": ["pcurl"],
	"application/vnd.dart": ["dart"],
	"application/vnd.data-vision.rdz": ["rdz"],
	"application/vnd.dbf": ["dbf"],
	"application/vnd.dcmp+xml": ["dcmp"],
	"application/vnd.dece.data": [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	],
	"application/vnd.dece.ttml+xml": ["uvt", "uvvt"],
	"application/vnd.dece.unspecified": ["uvx", "uvvx"],
	"application/vnd.dece.zip": ["uvz", "uvvz"],
	"application/vnd.denovo.fcselayout-link": ["fe_launch"],
	"application/vnd.dna": ["dna"],
	"application/vnd.dolby.mlp": ["mlp"],
	"application/vnd.dpgraph": ["dpg"],
	"application/vnd.dreamfactory": ["dfac"],
	"application/vnd.ds-keypoint": ["kpxx"],
	"application/vnd.dvb.ait": ["ait"],
	"application/vnd.dvb.service": ["svc"],
	"application/vnd.dynageo": ["geo"],
	"application/vnd.ecowin.chart": ["mag"],
	"application/vnd.enliven": ["nml"],
	"application/vnd.epson.esf": ["esf"],
	"application/vnd.epson.msf": ["msf"],
	"application/vnd.epson.quickanime": ["qam"],
	"application/vnd.epson.salt": ["slt"],
	"application/vnd.epson.ssf": ["ssf"],
	"application/vnd.eszigno3+xml": ["es3", "et3"],
	"application/vnd.ezpix-album": ["ez2"],
	"application/vnd.ezpix-package": ["ez3"],
	"application/vnd.fdf": ["*fdf"],
	"application/vnd.fdsn.mseed": ["mseed"],
	"application/vnd.fdsn.seed": ["seed", "dataless"],
	"application/vnd.flographit": ["gph"],
	"application/vnd.fluxtime.clip": ["ftc"],
	"application/vnd.framemaker": [
		"fm",
		"frame",
		"maker",
		"book"
	],
	"application/vnd.frogans.fnc": ["fnc"],
	"application/vnd.frogans.ltf": ["ltf"],
	"application/vnd.fsc.weblaunch": ["fsc"],
	"application/vnd.fujitsu.oasys": ["oas"],
	"application/vnd.fujitsu.oasys2": ["oa2"],
	"application/vnd.fujitsu.oasys3": ["oa3"],
	"application/vnd.fujitsu.oasysgp": ["fg5"],
	"application/vnd.fujitsu.oasysprs": ["bh2"],
	"application/vnd.fujixerox.ddd": ["ddd"],
	"application/vnd.fujixerox.docuworks": ["xdw"],
	"application/vnd.fujixerox.docuworks.binder": ["xbd"],
	"application/vnd.fuzzysheet": ["fzs"],
	"application/vnd.genomatix.tuxedo": ["txd"],
	"application/vnd.geogebra.file": ["ggb"],
	"application/vnd.geogebra.slides": ["ggs"],
	"application/vnd.geogebra.tool": ["ggt"],
	"application/vnd.geometry-explorer": ["gex", "gre"],
	"application/vnd.geonext": ["gxt"],
	"application/vnd.geoplan": ["g2w"],
	"application/vnd.geospace": ["g3w"],
	"application/vnd.gmx": ["gmx"],
	"application/vnd.google-apps.document": ["gdoc"],
	"application/vnd.google-apps.drawing": ["gdraw"],
	"application/vnd.google-apps.form": ["gform"],
	"application/vnd.google-apps.jam": ["gjam"],
	"application/vnd.google-apps.map": ["gmap"],
	"application/vnd.google-apps.presentation": ["gslides"],
	"application/vnd.google-apps.script": ["gscript"],
	"application/vnd.google-apps.site": ["gsite"],
	"application/vnd.google-apps.spreadsheet": ["gsheet"],
	"application/vnd.google-earth.kml+xml": ["kml"],
	"application/vnd.google-earth.kmz": ["kmz"],
	"application/vnd.gov.sk.xmldatacontainer+xml": ["xdcf"],
	"application/vnd.grafeq": ["gqf", "gqs"],
	"application/vnd.groove-account": ["gac"],
	"application/vnd.groove-help": ["ghf"],
	"application/vnd.groove-identity-message": ["gim"],
	"application/vnd.groove-injector": ["grv"],
	"application/vnd.groove-tool-message": ["gtm"],
	"application/vnd.groove-tool-template": ["tpl"],
	"application/vnd.groove-vcard": ["vcg"],
	"application/vnd.hal+xml": ["hal"],
	"application/vnd.handheld-entertainment+xml": ["zmm"],
	"application/vnd.hbci": ["hbci"],
	"application/vnd.hhe.lesson-player": ["les"],
	"application/vnd.hp-hpgl": ["hpgl"],
	"application/vnd.hp-hpid": ["hpid"],
	"application/vnd.hp-hps": ["hps"],
	"application/vnd.hp-jlyt": ["jlt"],
	"application/vnd.hp-pcl": ["pcl"],
	"application/vnd.hp-pclxl": ["pclxl"],
	"application/vnd.hydrostatix.sof-data": ["sfd-hdstx"],
	"application/vnd.ibm.minipay": ["mpy"],
	"application/vnd.ibm.modcap": [
		"afp",
		"listafp",
		"list3820"
	],
	"application/vnd.ibm.rights-management": ["irm"],
	"application/vnd.ibm.secure-container": ["sc"],
	"application/vnd.iccprofile": ["icc", "icm"],
	"application/vnd.igloader": ["igl"],
	"application/vnd.immervision-ivp": ["ivp"],
	"application/vnd.immervision-ivu": ["ivu"],
	"application/vnd.insors.igm": ["igm"],
	"application/vnd.intercon.formnet": ["xpw", "xpx"],
	"application/vnd.intergeo": ["i2g"],
	"application/vnd.intu.qbo": ["qbo"],
	"application/vnd.intu.qfx": ["qfx"],
	"application/vnd.ipunplugged.rcprofile": ["rcprofile"],
	"application/vnd.irepository.package+xml": ["irp"],
	"application/vnd.is-xpr": ["xpr"],
	"application/vnd.isac.fcs": ["fcs"],
	"application/vnd.jam": ["jam"],
	"application/vnd.jcp.javame.midlet-rms": ["rms"],
	"application/vnd.jisp": ["jisp"],
	"application/vnd.joost.joda-archive": ["joda"],
	"application/vnd.kahootz": ["ktz", "ktr"],
	"application/vnd.kde.karbon": ["karbon"],
	"application/vnd.kde.kchart": ["chrt"],
	"application/vnd.kde.kformula": ["kfo"],
	"application/vnd.kde.kivio": ["flw"],
	"application/vnd.kde.kontour": ["kon"],
	"application/vnd.kde.kpresenter": ["kpr", "kpt"],
	"application/vnd.kde.kspread": ["ksp"],
	"application/vnd.kde.kword": ["kwd", "kwt"],
	"application/vnd.kenameaapp": ["htke"],
	"application/vnd.kidspiration": ["kia"],
	"application/vnd.kinar": ["kne", "knp"],
	"application/vnd.koan": [
		"skp",
		"skd",
		"skt",
		"skm"
	],
	"application/vnd.kodak-descriptor": ["sse"],
	"application/vnd.las.las+xml": ["lasxml"],
	"application/vnd.llamagraphics.life-balance.desktop": ["lbd"],
	"application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"],
	"application/vnd.lotus-1-2-3": ["123"],
	"application/vnd.lotus-approach": ["apr"],
	"application/vnd.lotus-freelance": ["pre"],
	"application/vnd.lotus-notes": ["nsf"],
	"application/vnd.lotus-organizer": ["org"],
	"application/vnd.lotus-screencam": ["scm"],
	"application/vnd.lotus-wordpro": ["lwp"],
	"application/vnd.macports.portpkg": ["portpkg"],
	"application/vnd.mapbox-vector-tile": ["mvt"],
	"application/vnd.mcd": ["mcd"],
	"application/vnd.medcalcdata": ["mc1"],
	"application/vnd.mediastation.cdkey": ["cdkey"],
	"application/vnd.mfer": ["mwf"],
	"application/vnd.mfmp": ["mfm"],
	"application/vnd.micrografx.flo": ["flo"],
	"application/vnd.micrografx.igx": ["igx"],
	"application/vnd.mif": ["mif"],
	"application/vnd.mobius.daf": ["daf"],
	"application/vnd.mobius.dis": ["dis"],
	"application/vnd.mobius.mbk": ["mbk"],
	"application/vnd.mobius.mqy": ["mqy"],
	"application/vnd.mobius.msl": ["msl"],
	"application/vnd.mobius.plc": ["plc"],
	"application/vnd.mobius.txf": ["txf"],
	"application/vnd.mophun.application": ["mpn"],
	"application/vnd.mophun.certificate": ["mpc"],
	"application/vnd.mozilla.xul+xml": ["xul"],
	"application/vnd.ms-artgalry": ["cil"],
	"application/vnd.ms-cab-compressed": ["cab"],
	"application/vnd.ms-excel": [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	],
	"application/vnd.ms-excel.addin.macroenabled.12": ["xlam"],
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"],
	"application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"],
	"application/vnd.ms-excel.template.macroenabled.12": ["xltm"],
	"application/vnd.ms-fontobject": ["eot"],
	"application/vnd.ms-htmlhelp": ["chm"],
	"application/vnd.ms-ims": ["ims"],
	"application/vnd.ms-lrm": ["lrm"],
	"application/vnd.ms-officetheme": ["thmx"],
	"application/vnd.ms-outlook": ["msg"],
	"application/vnd.ms-pki.seccat": ["cat"],
	"application/vnd.ms-pki.stl": ["*stl"],
	"application/vnd.ms-powerpoint": [
		"ppt",
		"pps",
		"pot"
	],
	"application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"],
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"],
	"application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"],
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"],
	"application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"],
	"application/vnd.ms-project": ["*mpp", "mpt"],
	"application/vnd.ms-visio.viewer": ["vdx"],
	"application/vnd.ms-word.document.macroenabled.12": ["docm"],
	"application/vnd.ms-word.template.macroenabled.12": ["dotm"],
	"application/vnd.ms-works": [
		"wps",
		"wks",
		"wcm",
		"wdb"
	],
	"application/vnd.ms-wpl": ["wpl"],
	"application/vnd.ms-xpsdocument": ["xps"],
	"application/vnd.mseq": ["mseq"],
	"application/vnd.musician": ["mus"],
	"application/vnd.muvee.style": ["msty"],
	"application/vnd.mynfc": ["taglet"],
	"application/vnd.nato.bindingdataobject+xml": ["bdo"],
	"application/vnd.neurolanguage.nlu": ["nlu"],
	"application/vnd.nitf": ["ntf", "nitf"],
	"application/vnd.noblenet-directory": ["nnd"],
	"application/vnd.noblenet-sealer": ["nns"],
	"application/vnd.noblenet-web": ["nnw"],
	"application/vnd.nokia.n-gage.ac+xml": ["*ac"],
	"application/vnd.nokia.n-gage.data": ["ngdat"],
	"application/vnd.nokia.n-gage.symbian.install": ["n-gage"],
	"application/vnd.nokia.radio-preset": ["rpst"],
	"application/vnd.nokia.radio-presets": ["rpss"],
	"application/vnd.novadigm.edm": ["edm"],
	"application/vnd.novadigm.edx": ["edx"],
	"application/vnd.novadigm.ext": ["ext"],
	"application/vnd.oasis.opendocument.chart": ["odc"],
	"application/vnd.oasis.opendocument.chart-template": ["otc"],
	"application/vnd.oasis.opendocument.database": ["odb"],
	"application/vnd.oasis.opendocument.formula": ["odf"],
	"application/vnd.oasis.opendocument.formula-template": ["odft"],
	"application/vnd.oasis.opendocument.graphics": ["odg"],
	"application/vnd.oasis.opendocument.graphics-template": ["otg"],
	"application/vnd.oasis.opendocument.image": ["odi"],
	"application/vnd.oasis.opendocument.image-template": ["oti"],
	"application/vnd.oasis.opendocument.presentation": ["odp"],
	"application/vnd.oasis.opendocument.presentation-template": ["otp"],
	"application/vnd.oasis.opendocument.spreadsheet": ["ods"],
	"application/vnd.oasis.opendocument.spreadsheet-template": ["ots"],
	"application/vnd.oasis.opendocument.text": ["odt"],
	"application/vnd.oasis.opendocument.text-master": ["odm"],
	"application/vnd.oasis.opendocument.text-template": ["ott"],
	"application/vnd.oasis.opendocument.text-web": ["oth"],
	"application/vnd.olpc-sugar": ["xo"],
	"application/vnd.oma.dd2+xml": ["dd2"],
	"application/vnd.openblox.game+xml": ["obgx"],
	"application/vnd.openofficeorg.extension": ["oxt"],
	"application/vnd.openstreetmap.data+xml": ["osm"],
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"],
	"application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"],
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"],
	"application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"],
	"application/vnd.osgeo.mapguide.package": ["mgp"],
	"application/vnd.osgi.dp": ["dp"],
	"application/vnd.osgi.subsystem": ["esa"],
	"application/vnd.palm": [
		"pdb",
		"pqa",
		"oprc"
	],
	"application/vnd.pawaafile": ["paw"],
	"application/vnd.pg.format": ["str"],
	"application/vnd.pg.osasli": ["ei6"],
	"application/vnd.picsel": ["efif"],
	"application/vnd.pmi.widget": ["wg"],
	"application/vnd.pocketlearn": ["plf"],
	"application/vnd.powerbuilder6": ["pbd"],
	"application/vnd.previewsystems.box": ["box"],
	"application/vnd.procrate.brushset": ["brushset"],
	"application/vnd.procreate.brush": ["brush"],
	"application/vnd.procreate.dream": ["drm"],
	"application/vnd.proteus.magazine": ["mgz"],
	"application/vnd.publishare-delta-tree": ["qps"],
	"application/vnd.pvi.ptid1": ["ptid"],
	"application/vnd.pwg-xhtml-print+xml": ["xhtm"],
	"application/vnd.quark.quarkxpress": [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	],
	"application/vnd.rar": ["rar"],
	"application/vnd.realvnc.bed": ["bed"],
	"application/vnd.recordare.musicxml": ["mxl"],
	"application/vnd.recordare.musicxml+xml": ["musicxml"],
	"application/vnd.rig.cryptonote": ["cryptonote"],
	"application/vnd.rim.cod": ["cod"],
	"application/vnd.rn-realmedia": ["rm"],
	"application/vnd.rn-realmedia-vbr": ["rmvb"],
	"application/vnd.route66.link66+xml": ["link66"],
	"application/vnd.sailingtracker.track": ["st"],
	"application/vnd.seemail": ["see"],
	"application/vnd.sema": ["sema"],
	"application/vnd.semd": ["semd"],
	"application/vnd.semf": ["semf"],
	"application/vnd.shana.informed.formdata": ["ifm"],
	"application/vnd.shana.informed.formtemplate": ["itp"],
	"application/vnd.shana.informed.interchange": ["iif"],
	"application/vnd.shana.informed.package": ["ipk"],
	"application/vnd.simtech-mindmapper": ["twd", "twds"],
	"application/vnd.smaf": ["mmf"],
	"application/vnd.smart.teacher": ["teacher"],
	"application/vnd.software602.filler.form+xml": ["fo"],
	"application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
	"application/vnd.spotfire.dxp": ["dxp"],
	"application/vnd.spotfire.sfs": ["sfs"],
	"application/vnd.stardivision.calc": ["sdc"],
	"application/vnd.stardivision.draw": ["sda"],
	"application/vnd.stardivision.impress": ["sdd"],
	"application/vnd.stardivision.math": ["smf"],
	"application/vnd.stardivision.writer": ["sdw", "vor"],
	"application/vnd.stardivision.writer-global": ["sgl"],
	"application/vnd.stepmania.package": ["smzip"],
	"application/vnd.stepmania.stepchart": ["sm"],
	"application/vnd.sun.wadl+xml": ["wadl"],
	"application/vnd.sun.xml.calc": ["sxc"],
	"application/vnd.sun.xml.calc.template": ["stc"],
	"application/vnd.sun.xml.draw": ["sxd"],
	"application/vnd.sun.xml.draw.template": ["std"],
	"application/vnd.sun.xml.impress": ["sxi"],
	"application/vnd.sun.xml.impress.template": ["sti"],
	"application/vnd.sun.xml.math": ["sxm"],
	"application/vnd.sun.xml.writer": ["sxw"],
	"application/vnd.sun.xml.writer.global": ["sxg"],
	"application/vnd.sun.xml.writer.template": ["stw"],
	"application/vnd.sus-calendar": ["sus", "susp"],
	"application/vnd.svd": ["svd"],
	"application/vnd.symbian.install": ["sis", "sisx"],
	"application/vnd.syncml+xml": ["xsm"],
	"application/vnd.syncml.dm+wbxml": ["bdm"],
	"application/vnd.syncml.dm+xml": ["xdm"],
	"application/vnd.syncml.dmddf+xml": ["ddf"],
	"application/vnd.tao.intent-module-archive": ["tao"],
	"application/vnd.tcpdump.pcap": [
		"pcap",
		"cap",
		"dmp"
	],
	"application/vnd.tmobile-livetv": ["tmo"],
	"application/vnd.trid.tpt": ["tpt"],
	"application/vnd.triscape.mxs": ["mxs"],
	"application/vnd.trueapp": ["tra"],
	"application/vnd.ufdl": ["ufd", "ufdl"],
	"application/vnd.uiq.theme": ["utz"],
	"application/vnd.umajin": ["umj"],
	"application/vnd.unity": ["unityweb"],
	"application/vnd.uoml+xml": ["uoml", "uo"],
	"application/vnd.vcx": ["vcx"],
	"application/vnd.visio": [
		"vsd",
		"vst",
		"vss",
		"vsw",
		"vsdx",
		"vtx"
	],
	"application/vnd.visionary": ["vis"],
	"application/vnd.vsf": ["vsf"],
	"application/vnd.wap.wbxml": ["wbxml"],
	"application/vnd.wap.wmlc": ["wmlc"],
	"application/vnd.wap.wmlscriptc": ["wmlsc"],
	"application/vnd.webturbo": ["wtb"],
	"application/vnd.wolfram.player": ["nbp"],
	"application/vnd.wordperfect": ["wpd"],
	"application/vnd.wqd": ["wqd"],
	"application/vnd.wt.stf": ["stf"],
	"application/vnd.xara": ["xar"],
	"application/vnd.xfdl": ["xfdl"],
	"application/vnd.yamaha.hv-dic": ["hvd"],
	"application/vnd.yamaha.hv-script": ["hvs"],
	"application/vnd.yamaha.hv-voice": ["hvp"],
	"application/vnd.yamaha.openscoreformat": ["osf"],
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"],
	"application/vnd.yamaha.smaf-audio": ["saf"],
	"application/vnd.yamaha.smaf-phrase": ["spf"],
	"application/vnd.yellowriver-custom-menu": ["cmp"],
	"application/vnd.zul": ["zir", "zirz"],
	"application/vnd.zzazz.deck+xml": ["zaz"],
	"application/x-7z-compressed": ["7z"],
	"application/x-abiword": ["abw"],
	"application/x-ace-compressed": ["ace"],
	"application/x-apple-diskimage": ["*dmg"],
	"application/x-arj": ["arj"],
	"application/x-authorware-bin": [
		"aab",
		"x32",
		"u32",
		"vox"
	],
	"application/x-authorware-map": ["aam"],
	"application/x-authorware-seg": ["aas"],
	"application/x-bcpio": ["bcpio"],
	"application/x-bdoc": ["*bdoc"],
	"application/x-bittorrent": ["torrent"],
	"application/x-blender": ["blend"],
	"application/x-blorb": ["blb", "blorb"],
	"application/x-bzip": ["bz"],
	"application/x-bzip2": ["bz2", "boz"],
	"application/x-cbr": [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	],
	"application/x-cdlink": ["vcd"],
	"application/x-cfs-compressed": ["cfs"],
	"application/x-chat": ["chat"],
	"application/x-chess-pgn": ["pgn"],
	"application/x-chrome-extension": ["crx"],
	"application/x-cocoa": ["cco"],
	"application/x-compressed": ["*rar"],
	"application/x-conference": ["nsc"],
	"application/x-cpio": ["cpio"],
	"application/x-csh": ["csh"],
	"application/x-debian-package": ["*deb", "udeb"],
	"application/x-dgc-compressed": ["dgc"],
	"application/x-director": [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	],
	"application/x-doom": ["wad"],
	"application/x-dtbncx+xml": ["ncx"],
	"application/x-dtbook+xml": ["dtb"],
	"application/x-dtbresource+xml": ["res"],
	"application/x-dvi": ["dvi"],
	"application/x-envoy": ["evy"],
	"application/x-eva": ["eva"],
	"application/x-font-bdf": ["bdf"],
	"application/x-font-ghostscript": ["gsf"],
	"application/x-font-linux-psf": ["psf"],
	"application/x-font-pcf": ["pcf"],
	"application/x-font-snf": ["snf"],
	"application/x-font-type1": [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	],
	"application/x-freearc": ["arc"],
	"application/x-futuresplash": ["spl"],
	"application/x-gca-compressed": ["gca"],
	"application/x-glulx": ["ulx"],
	"application/x-gnumeric": ["gnumeric"],
	"application/x-gramps-xml": ["gramps"],
	"application/x-gtar": ["gtar"],
	"application/x-hdf": ["hdf"],
	"application/x-httpd-php": ["php"],
	"application/x-install-instructions": ["install"],
	"application/x-ipynb+json": ["ipynb"],
	"application/x-iso9660-image": ["*iso"],
	"application/x-iwork-keynote-sffkey": ["*key"],
	"application/x-iwork-numbers-sffnumbers": ["*numbers"],
	"application/x-iwork-pages-sffpages": ["*pages"],
	"application/x-java-archive-diff": ["jardiff"],
	"application/x-java-jnlp-file": ["jnlp"],
	"application/x-keepass2": ["kdbx"],
	"application/x-latex": ["latex"],
	"application/x-lua-bytecode": ["luac"],
	"application/x-lzh-compressed": ["lzh", "lha"],
	"application/x-makeself": ["run"],
	"application/x-mie": ["mie"],
	"application/x-mobipocket-ebook": ["*prc", "mobi"],
	"application/x-ms-application": ["application"],
	"application/x-ms-shortcut": ["lnk"],
	"application/x-ms-wmd": ["wmd"],
	"application/x-ms-wmz": ["wmz"],
	"application/x-ms-xbap": ["xbap"],
	"application/x-msaccess": ["mdb"],
	"application/x-msbinder": ["obd"],
	"application/x-mscardfile": ["crd"],
	"application/x-msclip": ["clp"],
	"application/x-msdos-program": ["*exe"],
	"application/x-msdownload": [
		"*exe",
		"*dll",
		"com",
		"bat",
		"*msi"
	],
	"application/x-msmediaview": [
		"mvb",
		"m13",
		"m14"
	],
	"application/x-msmetafile": [
		"*wmf",
		"*wmz",
		"*emf",
		"emz"
	],
	"application/x-msmoney": ["mny"],
	"application/x-mspublisher": ["pub"],
	"application/x-msschedule": ["scd"],
	"application/x-msterminal": ["trm"],
	"application/x-mswrite": ["wri"],
	"application/x-netcdf": ["nc", "cdf"],
	"application/x-ns-proxy-autoconfig": ["pac"],
	"application/x-nzb": ["nzb"],
	"application/x-perl": ["pl", "pm"],
	"application/x-pilot": ["*prc", "*pdb"],
	"application/x-pkcs12": ["p12", "pfx"],
	"application/x-pkcs7-certificates": ["p7b", "spc"],
	"application/x-pkcs7-certreqresp": ["p7r"],
	"application/x-rar-compressed": ["*rar"],
	"application/x-redhat-package-manager": ["rpm"],
	"application/x-research-info-systems": ["ris"],
	"application/x-sea": ["sea"],
	"application/x-sh": ["sh"],
	"application/x-shar": ["shar"],
	"application/x-shockwave-flash": ["swf"],
	"application/x-silverlight-app": ["xap"],
	"application/x-sql": ["*sql"],
	"application/x-stuffit": ["sit"],
	"application/x-stuffitx": ["sitx"],
	"application/x-subrip": ["srt"],
	"application/x-sv4cpio": ["sv4cpio"],
	"application/x-sv4crc": ["sv4crc"],
	"application/x-t3vm-image": ["t3"],
	"application/x-tads": ["gam"],
	"application/x-tar": ["tar"],
	"application/x-tcl": ["tcl", "tk"],
	"application/x-tex": ["tex"],
	"application/x-tex-tfm": ["tfm"],
	"application/x-texinfo": ["texinfo", "texi"],
	"application/x-tgif": ["*obj"],
	"application/x-ustar": ["ustar"],
	"application/x-virtualbox-hdd": ["hdd"],
	"application/x-virtualbox-ova": ["ova"],
	"application/x-virtualbox-ovf": ["ovf"],
	"application/x-virtualbox-vbox": ["vbox"],
	"application/x-virtualbox-vbox-extpack": ["vbox-extpack"],
	"application/x-virtualbox-vdi": ["vdi"],
	"application/x-virtualbox-vhd": ["vhd"],
	"application/x-virtualbox-vmdk": ["vmdk"],
	"application/x-wais-source": ["src"],
	"application/x-web-app-manifest+json": ["webapp"],
	"application/x-x509-ca-cert": [
		"der",
		"crt",
		"pem"
	],
	"application/x-xfig": ["fig"],
	"application/x-xliff+xml": ["*xlf"],
	"application/x-xpinstall": ["xpi"],
	"application/x-xz": ["xz"],
	"application/x-zip-compressed": ["*zip"],
	"application/x-zmachine": [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	],
	"audio/vnd.dece.audio": ["uva", "uvva"],
	"audio/vnd.digital-winds": ["eol"],
	"audio/vnd.dra": ["dra"],
	"audio/vnd.dts": ["dts"],
	"audio/vnd.dts.hd": ["dtshd"],
	"audio/vnd.lucent.voice": ["lvp"],
	"audio/vnd.ms-playready.media.pya": ["pya"],
	"audio/vnd.nuera.ecelp4800": ["ecelp4800"],
	"audio/vnd.nuera.ecelp7470": ["ecelp7470"],
	"audio/vnd.nuera.ecelp9600": ["ecelp9600"],
	"audio/vnd.rip": ["rip"],
	"audio/x-aac": ["*aac"],
	"audio/x-aiff": [
		"aif",
		"aiff",
		"aifc"
	],
	"audio/x-caf": ["caf"],
	"audio/x-flac": ["flac"],
	"audio/x-m4a": ["*m4a"],
	"audio/x-matroska": ["mka"],
	"audio/x-mpegurl": ["m3u"],
	"audio/x-ms-wax": ["wax"],
	"audio/x-ms-wma": ["wma"],
	"audio/x-pn-realaudio": ["ram", "ra"],
	"audio/x-pn-realaudio-plugin": ["rmp"],
	"audio/x-realaudio": ["*ra"],
	"audio/x-wav": ["*wav"],
	"chemical/x-cdx": ["cdx"],
	"chemical/x-cif": ["cif"],
	"chemical/x-cmdf": ["cmdf"],
	"chemical/x-cml": ["cml"],
	"chemical/x-csml": ["csml"],
	"chemical/x-xyz": ["xyz"],
	"image/prs.btif": ["btif", "btf"],
	"image/prs.pti": ["pti"],
	"image/vnd.adobe.photoshop": ["psd"],
	"image/vnd.airzip.accelerator.azv": ["azv"],
	"image/vnd.blockfact.facti": ["facti"],
	"image/vnd.dece.graphic": [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	],
	"image/vnd.djvu": ["djvu", "djv"],
	"image/vnd.dvb.subtitle": ["*sub"],
	"image/vnd.dwg": ["dwg"],
	"image/vnd.dxf": ["dxf"],
	"image/vnd.fastbidsheet": ["fbs"],
	"image/vnd.fpx": ["fpx"],
	"image/vnd.fst": ["fst"],
	"image/vnd.fujixerox.edmics-mmr": ["mmr"],
	"image/vnd.fujixerox.edmics-rlc": ["rlc"],
	"image/vnd.microsoft.icon": ["ico"],
	"image/vnd.ms-dds": ["dds"],
	"image/vnd.ms-modi": ["mdi"],
	"image/vnd.ms-photo": ["wdp"],
	"image/vnd.net-fpx": ["npx"],
	"image/vnd.pco.b16": ["b16"],
	"image/vnd.tencent.tap": ["tap"],
	"image/vnd.valve.source.texture": ["vtf"],
	"image/vnd.wap.wbmp": ["wbmp"],
	"image/vnd.xiff": ["xif"],
	"image/vnd.zbrush.pcx": ["pcx"],
	"image/x-3ds": ["3ds"],
	"image/x-adobe-dng": ["dng"],
	"image/x-cmu-raster": ["ras"],
	"image/x-cmx": ["cmx"],
	"image/x-freehand": [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	],
	"image/x-icon": ["*ico"],
	"image/x-jng": ["jng"],
	"image/x-mrsid-image": ["sid"],
	"image/x-ms-bmp": ["*bmp"],
	"image/x-pcx": ["*pcx"],
	"image/x-pict": ["pic", "pct"],
	"image/x-portable-anymap": ["pnm"],
	"image/x-portable-bitmap": ["pbm"],
	"image/x-portable-graymap": ["pgm"],
	"image/x-portable-pixmap": ["ppm"],
	"image/x-rgb": ["rgb"],
	"image/x-tga": ["tga"],
	"image/x-xbitmap": ["xbm"],
	"image/x-xpixmap": ["xpm"],
	"image/x-xwindowdump": ["xwd"],
	"message/vnd.wfa.wsc": ["wsc"],
	"model/vnd.bary": ["bary"],
	"model/vnd.cld": ["cld"],
	"model/vnd.collada+xml": ["dae"],
	"model/vnd.dwf": ["dwf"],
	"model/vnd.gdl": ["gdl"],
	"model/vnd.gtw": ["gtw"],
	"model/vnd.mts": ["*mts"],
	"model/vnd.opengex": ["ogex"],
	"model/vnd.parasolid.transmit.binary": ["x_b"],
	"model/vnd.parasolid.transmit.text": ["x_t"],
	"model/vnd.pytha.pyox": ["pyo", "pyox"],
	"model/vnd.sap.vds": ["vds"],
	"model/vnd.usda": ["usda"],
	"model/vnd.usdz+zip": ["usdz"],
	"model/vnd.valve.source.compiled-map": ["bsp"],
	"model/vnd.vtu": ["vtu"],
	"text/prs.lines.tag": ["dsc"],
	"text/vnd.curl": ["curl"],
	"text/vnd.curl.dcurl": ["dcurl"],
	"text/vnd.curl.mcurl": ["mcurl"],
	"text/vnd.curl.scurl": ["scurl"],
	"text/vnd.dvb.subtitle": ["sub"],
	"text/vnd.familysearch.gedcom": ["ged"],
	"text/vnd.fly": ["fly"],
	"text/vnd.fmi.flexstor": ["flx"],
	"text/vnd.graphviz": ["gv"],
	"text/vnd.in3d.3dml": ["3dml"],
	"text/vnd.in3d.spot": ["spot"],
	"text/vnd.sun.j2me.app-descriptor": ["jad"],
	"text/vnd.wap.wml": ["wml"],
	"text/vnd.wap.wmlscript": ["wmls"],
	"text/x-asm": ["s", "asm"],
	"text/x-c": [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	],
	"text/x-component": ["htc"],
	"text/x-fortran": [
		"f",
		"for",
		"f77",
		"f90"
	],
	"text/x-handlebars-template": ["hbs"],
	"text/x-java-source": ["java"],
	"text/x-lua": ["lua"],
	"text/x-markdown": ["mkd"],
	"text/x-nfo": ["nfo"],
	"text/x-opml": ["opml"],
	"text/x-org": ["*org"],
	"text/x-pascal": ["p", "pas"],
	"text/x-processing": ["pde"],
	"text/x-sass": ["sass"],
	"text/x-scss": ["scss"],
	"text/x-setext": ["etx"],
	"text/x-sfv": ["sfv"],
	"text/x-suse-ymp": ["ymp"],
	"text/x-uuencode": ["uu"],
	"text/x-vcalendar": ["vcs"],
	"text/x-vcard": ["vcf"],
	"video/vnd.dece.hd": ["uvh", "uvvh"],
	"video/vnd.dece.mobile": ["uvm", "uvvm"],
	"video/vnd.dece.pd": ["uvp", "uvvp"],
	"video/vnd.dece.sd": ["uvs", "uvvs"],
	"video/vnd.dece.video": ["uvv", "uvvv"],
	"video/vnd.dvb.file": ["dvb"],
	"video/vnd.fvt": ["fvt"],
	"video/vnd.mpegurl": ["mxu", "m4u"],
	"video/vnd.ms-playready.media.pyv": ["pyv"],
	"video/vnd.uvvu.mp4": ["uvu", "uvvu"],
	"video/vnd.vivo": ["viv"],
	"video/x-f4v": ["f4v"],
	"video/x-fli": ["fli"],
	"video/x-flv": ["flv"],
	"video/x-m4v": ["m4v"],
	"video/x-matroska": [
		"mkv",
		"mk3d",
		"mks"
	],
	"video/x-mng": ["mng"],
	"video/x-ms-asf": ["asf", "asx"],
	"video/x-ms-vob": ["vob"],
	"video/x-ms-wm": ["wm"],
	"video/x-ms-wmv": ["wmv"],
	"video/x-ms-wmx": ["wmx"],
	"video/x-ms-wvx": ["wvx"],
	"video/x-msvideo": ["avi"],
	"video/x-sgi-movie": ["movie"],
	"video/x-smv": ["smv"],
	"x-conference/x-cooltalk": ["ice"]
};
Object.freeze(types$1);
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/types/standard.js
var types = {
	"application/andrew-inset": ["ez"],
	"application/appinstaller": ["appinstaller"],
	"application/applixware": ["aw"],
	"application/appx": ["appx"],
	"application/appxbundle": ["appxbundle"],
	"application/atom+xml": ["atom"],
	"application/atomcat+xml": ["atomcat"],
	"application/atomdeleted+xml": ["atomdeleted"],
	"application/atomsvc+xml": ["atomsvc"],
	"application/atsc-dwd+xml": ["dwd"],
	"application/atsc-held+xml": ["held"],
	"application/atsc-rsat+xml": ["rsat"],
	"application/automationml-aml+xml": ["aml"],
	"application/automationml-amlx+zip": ["amlx"],
	"application/bdoc": ["bdoc"],
	"application/calendar+xml": ["xcs"],
	"application/ccxml+xml": ["ccxml"],
	"application/cdfx+xml": ["cdfx"],
	"application/cdmi-capability": ["cdmia"],
	"application/cdmi-container": ["cdmic"],
	"application/cdmi-domain": ["cdmid"],
	"application/cdmi-object": ["cdmio"],
	"application/cdmi-queue": ["cdmiq"],
	"application/cpl+xml": ["cpl"],
	"application/cu-seeme": ["cu"],
	"application/cwl": ["cwl"],
	"application/dash+xml": ["mpd"],
	"application/dash-patch+xml": ["mpp"],
	"application/davmount+xml": ["davmount"],
	"application/dicom": ["dcm"],
	"application/docbook+xml": ["dbk"],
	"application/dssc+der": ["dssc"],
	"application/dssc+xml": ["xdssc"],
	"application/ecmascript": ["ecma"],
	"application/emma+xml": ["emma"],
	"application/emotionml+xml": ["emotionml"],
	"application/epub+zip": ["epub"],
	"application/exi": ["exi"],
	"application/express": ["exp"],
	"application/fdf": ["fdf"],
	"application/fdt+xml": ["fdt"],
	"application/font-tdpfr": ["pfr"],
	"application/geo+json": ["geojson"],
	"application/gml+xml": ["gml"],
	"application/gpx+xml": ["gpx"],
	"application/gxf": ["gxf"],
	"application/gzip": ["gz"],
	"application/hjson": ["hjson"],
	"application/hyperstudio": ["stk"],
	"application/inkml+xml": ["ink", "inkml"],
	"application/ipfix": ["ipfix"],
	"application/its+xml": ["its"],
	"application/java-archive": [
		"jar",
		"war",
		"ear"
	],
	"application/java-serialized-object": ["ser"],
	"application/java-vm": ["class"],
	"application/javascript": ["*js"],
	"application/json": ["json", "map"],
	"application/json5": ["json5"],
	"application/jsonml+json": ["jsonml"],
	"application/ld+json": ["jsonld"],
	"application/lgr+xml": ["lgr"],
	"application/lost+xml": ["lostxml"],
	"application/mac-binhex40": ["hqx"],
	"application/mac-compactpro": ["cpt"],
	"application/mads+xml": ["mads"],
	"application/manifest+json": ["webmanifest"],
	"application/marc": ["mrc"],
	"application/marcxml+xml": ["mrcx"],
	"application/mathematica": [
		"ma",
		"nb",
		"mb"
	],
	"application/mathml+xml": ["mathml"],
	"application/mbox": ["mbox"],
	"application/media-policy-dataset+xml": ["mpf"],
	"application/mediaservercontrol+xml": ["mscml"],
	"application/metalink+xml": ["metalink"],
	"application/metalink4+xml": ["meta4"],
	"application/mets+xml": ["mets"],
	"application/mmt-aei+xml": ["maei"],
	"application/mmt-usd+xml": ["musd"],
	"application/mods+xml": ["mods"],
	"application/mp21": ["m21", "mp21"],
	"application/mp4": [
		"*mp4",
		"*mpg4",
		"mp4s",
		"m4p"
	],
	"application/msix": ["msix"],
	"application/msixbundle": ["msixbundle"],
	"application/msword": ["doc", "dot"],
	"application/mxf": ["mxf"],
	"application/n-quads": ["nq"],
	"application/n-triples": ["nt"],
	"application/node": ["cjs"],
	"application/octet-stream": [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	],
	"application/oda": ["oda"],
	"application/oebps-package+xml": ["opf"],
	"application/ogg": ["ogx"],
	"application/omdoc+xml": ["omdoc"],
	"application/onenote": [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg",
		"one",
		"onea"
	],
	"application/oxps": ["oxps"],
	"application/p2p-overlay+xml": ["relo"],
	"application/patch-ops-error+xml": ["xer"],
	"application/pdf": ["pdf"],
	"application/pgp-encrypted": ["pgp"],
	"application/pgp-keys": ["asc"],
	"application/pgp-signature": ["sig", "*asc"],
	"application/pics-rules": ["prf"],
	"application/pkcs10": ["p10"],
	"application/pkcs7-mime": ["p7m", "p7c"],
	"application/pkcs7-signature": ["p7s"],
	"application/pkcs8": ["p8"],
	"application/pkix-attr-cert": ["ac"],
	"application/pkix-cert": ["cer"],
	"application/pkix-crl": ["crl"],
	"application/pkix-pkipath": ["pkipath"],
	"application/pkixcmp": ["pki"],
	"application/pls+xml": ["pls"],
	"application/postscript": [
		"ai",
		"eps",
		"ps"
	],
	"application/provenance+xml": ["provx"],
	"application/pskc+xml": ["pskcxml"],
	"application/raml+yaml": ["raml"],
	"application/rdf+xml": ["rdf", "owl"],
	"application/reginfo+xml": ["rif"],
	"application/relax-ng-compact-syntax": ["rnc"],
	"application/resource-lists+xml": ["rl"],
	"application/resource-lists-diff+xml": ["rld"],
	"application/rls-services+xml": ["rs"],
	"application/route-apd+xml": ["rapd"],
	"application/route-s-tsid+xml": ["sls"],
	"application/route-usd+xml": ["rusd"],
	"application/rpki-ghostbusters": ["gbr"],
	"application/rpki-manifest": ["mft"],
	"application/rpki-roa": ["roa"],
	"application/rsd+xml": ["rsd"],
	"application/rss+xml": ["rss"],
	"application/rtf": ["rtf"],
	"application/sbml+xml": ["sbml"],
	"application/scvp-cv-request": ["scq"],
	"application/scvp-cv-response": ["scs"],
	"application/scvp-vp-request": ["spq"],
	"application/scvp-vp-response": ["spp"],
	"application/sdp": ["sdp"],
	"application/senml+xml": ["senmlx"],
	"application/sensml+xml": ["sensmlx"],
	"application/set-payment-initiation": ["setpay"],
	"application/set-registration-initiation": ["setreg"],
	"application/shf+xml": ["shf"],
	"application/sieve": ["siv", "sieve"],
	"application/smil+xml": ["smi", "smil"],
	"application/sparql-query": ["rq"],
	"application/sparql-results+xml": ["srx"],
	"application/sql": ["sql"],
	"application/srgs": ["gram"],
	"application/srgs+xml": ["grxml"],
	"application/sru+xml": ["sru"],
	"application/ssdl+xml": ["ssdl"],
	"application/ssml+xml": ["ssml"],
	"application/swid+xml": ["swidtag"],
	"application/tei+xml": ["tei", "teicorpus"],
	"application/thraud+xml": ["tfi"],
	"application/timestamped-data": ["tsd"],
	"application/toml": ["toml"],
	"application/trig": ["trig"],
	"application/ttml+xml": ["ttml"],
	"application/ubjson": ["ubj"],
	"application/urc-ressheet+xml": ["rsheet"],
	"application/urc-targetdesc+xml": ["td"],
	"application/voicexml+xml": ["vxml"],
	"application/wasm": ["wasm"],
	"application/watcherinfo+xml": ["wif"],
	"application/widget": ["wgt"],
	"application/winhlp": ["hlp"],
	"application/wsdl+xml": ["wsdl"],
	"application/wspolicy+xml": ["wspolicy"],
	"application/xaml+xml": ["xaml"],
	"application/xcap-att+xml": ["xav"],
	"application/xcap-caps+xml": ["xca"],
	"application/xcap-diff+xml": ["xdf"],
	"application/xcap-el+xml": ["xel"],
	"application/xcap-ns+xml": ["xns"],
	"application/xenc+xml": ["xenc"],
	"application/xfdf": ["xfdf"],
	"application/xhtml+xml": ["xhtml", "xht"],
	"application/xliff+xml": ["xlf"],
	"application/xml": [
		"xml",
		"xsl",
		"xsd",
		"rng"
	],
	"application/xml-dtd": ["dtd"],
	"application/xop+xml": ["xop"],
	"application/xproc+xml": ["xpl"],
	"application/xslt+xml": ["*xsl", "xslt"],
	"application/xspf+xml": ["xspf"],
	"application/xv+xml": [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	],
	"application/yang": ["yang"],
	"application/yin+xml": ["yin"],
	"application/zip": ["zip"],
	"application/zip+dotlottie": ["lottie"],
	"audio/3gpp": ["*3gpp"],
	"audio/aac": ["adts", "aac"],
	"audio/adpcm": ["adp"],
	"audio/amr": ["amr"],
	"audio/basic": ["au", "snd"],
	"audio/midi": [
		"mid",
		"midi",
		"kar",
		"rmi"
	],
	"audio/mobile-xmf": ["mxmf"],
	"audio/mp3": ["*mp3"],
	"audio/mp4": [
		"m4a",
		"mp4a",
		"m4b"
	],
	"audio/mpeg": [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	],
	"audio/ogg": [
		"oga",
		"ogg",
		"spx",
		"opus"
	],
	"audio/s3m": ["s3m"],
	"audio/silk": ["sil"],
	"audio/wav": ["wav"],
	"audio/wave": ["*wav"],
	"audio/webm": ["weba"],
	"audio/xm": ["xm"],
	"font/collection": ["ttc"],
	"font/otf": ["otf"],
	"font/ttf": ["ttf"],
	"font/woff": ["woff"],
	"font/woff2": ["woff2"],
	"image/aces": ["exr"],
	"image/apng": ["apng"],
	"image/avci": ["avci"],
	"image/avcs": ["avcs"],
	"image/avif": ["avif"],
	"image/bmp": ["bmp", "dib"],
	"image/cgm": ["cgm"],
	"image/dicom-rle": ["drle"],
	"image/dpx": ["dpx"],
	"image/emf": ["emf"],
	"image/fits": ["fits"],
	"image/g3fax": ["g3"],
	"image/gif": ["gif"],
	"image/heic": ["heic"],
	"image/heic-sequence": ["heics"],
	"image/heif": ["heif"],
	"image/heif-sequence": ["heifs"],
	"image/hej2k": ["hej2"],
	"image/ief": ["ief"],
	"image/jaii": ["jaii"],
	"image/jais": ["jais"],
	"image/jls": ["jls"],
	"image/jp2": ["jp2", "jpg2"],
	"image/jpeg": [
		"jpg",
		"jpeg",
		"jpe"
	],
	"image/jph": ["jph"],
	"image/jphc": ["jhc"],
	"image/jpm": ["jpm", "jpgm"],
	"image/jpx": ["jpx", "jpf"],
	"image/jxl": ["jxl"],
	"image/jxr": ["jxr"],
	"image/jxra": ["jxra"],
	"image/jxrs": ["jxrs"],
	"image/jxs": ["jxs"],
	"image/jxsc": ["jxsc"],
	"image/jxsi": ["jxsi"],
	"image/jxss": ["jxss"],
	"image/ktx": ["ktx"],
	"image/ktx2": ["ktx2"],
	"image/pjpeg": ["jfif"],
	"image/png": ["png"],
	"image/sgi": ["sgi"],
	"image/svg+xml": ["svg", "svgz"],
	"image/t38": ["t38"],
	"image/tiff": ["tif", "tiff"],
	"image/tiff-fx": ["tfx"],
	"image/webp": ["webp"],
	"image/wmf": ["wmf"],
	"message/disposition-notification": ["disposition-notification"],
	"message/global": ["u8msg"],
	"message/global-delivery-status": ["u8dsn"],
	"message/global-disposition-notification": ["u8mdn"],
	"message/global-headers": ["u8hdr"],
	"message/rfc822": [
		"eml",
		"mime",
		"mht",
		"mhtml"
	],
	"model/3mf": ["3mf"],
	"model/gltf+json": ["gltf"],
	"model/gltf-binary": ["glb"],
	"model/iges": ["igs", "iges"],
	"model/jt": ["jt"],
	"model/mesh": [
		"msh",
		"mesh",
		"silo"
	],
	"model/mtl": ["mtl"],
	"model/obj": ["obj"],
	"model/prc": ["prc"],
	"model/step": [
		"step",
		"stp",
		"stpnc",
		"p21",
		"210"
	],
	"model/step+xml": ["stpx"],
	"model/step+zip": ["stpz"],
	"model/step-xml+zip": ["stpxz"],
	"model/stl": ["stl"],
	"model/u3d": ["u3d"],
	"model/vrml": ["wrl", "vrml"],
	"model/x3d+binary": ["*x3db", "x3dbz"],
	"model/x3d+fastinfoset": ["x3db"],
	"model/x3d+vrml": ["*x3dv", "x3dvz"],
	"model/x3d+xml": ["x3d", "x3dz"],
	"model/x3d-vrml": ["x3dv"],
	"text/cache-manifest": ["appcache", "manifest"],
	"text/calendar": ["ics", "ifb"],
	"text/coffeescript": ["coffee", "litcoffee"],
	"text/css": ["css"],
	"text/csv": ["csv"],
	"text/html": [
		"html",
		"htm",
		"shtml"
	],
	"text/jade": ["jade"],
	"text/javascript": ["js", "mjs"],
	"text/jsx": ["jsx"],
	"text/less": ["less"],
	"text/markdown": ["md", "markdown"],
	"text/mathml": ["mml"],
	"text/mdx": ["mdx"],
	"text/n3": ["n3"],
	"text/plain": [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	],
	"text/richtext": ["rtx"],
	"text/rtf": ["*rtf"],
	"text/sgml": ["sgml", "sgm"],
	"text/shex": ["shex"],
	"text/slim": ["slim", "slm"],
	"text/spdx": ["spdx"],
	"text/stylus": ["stylus", "styl"],
	"text/tab-separated-values": ["tsv"],
	"text/troff": [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	],
	"text/turtle": ["ttl"],
	"text/uri-list": [
		"uri",
		"uris",
		"urls"
	],
	"text/vcard": ["vcard"],
	"text/vtt": ["vtt"],
	"text/wgsl": ["wgsl"],
	"text/xml": ["*xml"],
	"text/yaml": ["yaml", "yml"],
	"video/3gpp": ["3gp", "3gpp"],
	"video/3gpp2": ["3g2"],
	"video/h261": ["h261"],
	"video/h263": ["h263"],
	"video/h264": ["h264"],
	"video/iso.segment": ["m4s"],
	"video/jpeg": ["jpgv"],
	"video/jpm": ["*jpm", "*jpgm"],
	"video/mj2": ["mj2", "mjp2"],
	"video/mp2t": [
		"ts",
		"m2t",
		"m2ts",
		"mts"
	],
	"video/mp4": [
		"mp4",
		"mp4v",
		"mpg4"
	],
	"video/mpeg": [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	],
	"video/ogg": ["ogv"],
	"video/quicktime": ["qt", "mov"],
	"video/webm": ["webm"]
};
Object.freeze(types);
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/Mime.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Mime_extensionToType, _Mime_typeToExtension, _Mime_typeToExtensions;
var Mime = class {
	constructor(...args) {
		_Mime_extensionToType.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtension.set(this, /* @__PURE__ */ new Map());
		_Mime_typeToExtensions.set(this, /* @__PURE__ */ new Map());
		for (const arg of args) this.define(arg);
	}
	define(typeMap, force = false) {
		for (let [type, extensions] of Object.entries(typeMap)) {
			type = type.toLowerCase();
			extensions = extensions.map((ext) => ext.toLowerCase());
			if (!__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").has(type)) __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").set(type, /* @__PURE__ */ new Set());
			const allExtensions = __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type);
			let first = true;
			for (let extension of extensions) {
				const starred = extension.startsWith("*");
				extension = starred ? extension.slice(1) : extension;
				allExtensions?.add(extension);
				if (first) __classPrivateFieldGet(this, _Mime_typeToExtension, "f").set(type, extension);
				first = false;
				if (starred) continue;
				const currentType = __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(extension);
				if (currentType && currentType != type && !force) throw new Error(`"${type} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`);
				__classPrivateFieldGet(this, _Mime_extensionToType, "f").set(extension, type);
			}
		}
		return this;
	}
	getType(path) {
		if (typeof path !== "string") return null;
		const last = path.replace(/^.*[/\\]/s, "").toLowerCase();
		const ext = last.replace(/^.*\./s, "").toLowerCase();
		const hasPath = last.length < path.length;
		if (!(ext.length < last.length - 1) && hasPath) return null;
		return __classPrivateFieldGet(this, _Mime_extensionToType, "f").get(ext) ?? null;
	}
	getExtension(type) {
		if (typeof type !== "string") return null;
		type = type?.split?.(";")[0];
		return (type && __classPrivateFieldGet(this, _Mime_typeToExtension, "f").get(type.trim().toLowerCase())) ?? null;
	}
	getAllExtensions(type) {
		if (typeof type !== "string") return null;
		return __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type.toLowerCase()) ?? null;
	}
	_freeze() {
		this.define = () => {
			throw new Error("define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances");
		};
		Object.freeze(this);
		for (const extensions of __classPrivateFieldGet(this, _Mime_typeToExtensions, "f").values()) Object.freeze(extensions);
		return this;
	}
	_getTestState() {
		return {
			types: __classPrivateFieldGet(this, _Mime_extensionToType, "f"),
			extensions: __classPrivateFieldGet(this, _Mime_typeToExtension, "f")
		};
	}
};
_Mime_extensionToType = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtension = /* @__PURE__ */ new WeakMap(), _Mime_typeToExtensions = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../node_modules/.pnpm/mime@4.1.0/node_modules/mime/dist/src/index.js
var src_default = new Mime(types, types$1)._freeze();
//#endregion
//#region ../node_modules/.pnpm/vscode-uri@3.1.0/node_modules/vscode-uri/lib/esm/index.mjs
var LIB;
(() => {
	"use strict";
	var t = { 975: (t) => {
		function e(t) {
			if ("string" != typeof t) throw new TypeError("Path must be a string. Received " + JSON.stringify(t));
		}
		function r(t, e) {
			for (var r, n = "", i = 0, o = -1, s = 0, h = 0; h <= t.length; ++h) {
				if (h < t.length) r = t.charCodeAt(h);
				else {
					if (47 === r) break;
					r = 47;
				}
				if (47 === r) {
					if (o === h - 1 || 1 === s);
					else if (o !== h - 1 && 2 === s) {
						if (n.length < 2 || 2 !== i || 46 !== n.charCodeAt(n.length - 1) || 46 !== n.charCodeAt(n.length - 2)) {
							if (n.length > 2) {
								var a = n.lastIndexOf("/");
								if (a !== n.length - 1) {
									-1 === a ? (n = "", i = 0) : i = (n = n.slice(0, a)).length - 1 - n.lastIndexOf("/"), o = h, s = 0;
									continue;
								}
							} else if (2 === n.length || 1 === n.length) {
								n = "", i = 0, o = h, s = 0;
								continue;
							}
						}
						e && (n.length > 0 ? n += "/.." : n = "..", i = 2);
					} else n.length > 0 ? n += "/" + t.slice(o + 1, h) : n = t.slice(o + 1, h), i = h - o - 1;
					o = h, s = 0;
				} else 46 === r && -1 !== s ? ++s : s = -1;
			}
			return n;
		}
		var n = {
			resolve: function() {
				for (var t, n = "", i = !1, o = arguments.length - 1; o >= -1 && !i; o--) {
					var s;
					o >= 0 ? s = arguments[o] : (void 0 === t && (t = process.cwd()), s = t), e(s), 0 !== s.length && (n = s + "/" + n, i = 47 === s.charCodeAt(0));
				}
				return n = r(n, !i), i ? n.length > 0 ? "/" + n : "/" : n.length > 0 ? n : ".";
			},
			normalize: function(t) {
				if (e(t), 0 === t.length) return ".";
				var n = 47 === t.charCodeAt(0), i = 47 === t.charCodeAt(t.length - 1);
				return 0 !== (t = r(t, !n)).length || n || (t = "."), t.length > 0 && i && (t += "/"), n ? "/" + t : t;
			},
			isAbsolute: function(t) {
				return e(t), t.length > 0 && 47 === t.charCodeAt(0);
			},
			join: function() {
				if (0 === arguments.length) return ".";
				for (var t, r = 0; r < arguments.length; ++r) {
					var i = arguments[r];
					e(i), i.length > 0 && (void 0 === t ? t = i : t += "/" + i);
				}
				return void 0 === t ? "." : n.normalize(t);
			},
			relative: function(t, r) {
				if (e(t), e(r), t === r) return "";
				if ((t = n.resolve(t)) === (r = n.resolve(r))) return "";
				for (var i = 1; i < t.length && 47 === t.charCodeAt(i); ++i);
				for (var o = t.length, s = o - i, h = 1; h < r.length && 47 === r.charCodeAt(h); ++h);
				for (var a = r.length - h, c = s < a ? s : a, f = -1, u = 0; u <= c; ++u) {
					if (u === c) {
						if (a > c) {
							if (47 === r.charCodeAt(h + u)) return r.slice(h + u + 1);
							if (0 === u) return r.slice(h + u);
						} else s > c && (47 === t.charCodeAt(i + u) ? f = u : 0 === u && (f = 0));
						break;
					}
					var l = t.charCodeAt(i + u);
					if (l !== r.charCodeAt(h + u)) break;
					47 === l && (f = u);
				}
				var g = "";
				for (u = i + f + 1; u <= o; ++u) u !== o && 47 !== t.charCodeAt(u) || (0 === g.length ? g += ".." : g += "/..");
				return g.length > 0 ? g + r.slice(h + f) : (h += f, 47 === r.charCodeAt(h) && ++h, r.slice(h));
			},
			_makeLong: function(t) {
				return t;
			},
			dirname: function(t) {
				if (e(t), 0 === t.length) return ".";
				for (var r = t.charCodeAt(0), n = 47 === r, i = -1, o = !0, s = t.length - 1; s >= 1; --s) if (47 === (r = t.charCodeAt(s))) {
					if (!o) {
						i = s;
						break;
					}
				} else o = !1;
				return -1 === i ? n ? "/" : "." : n && 1 === i ? "//" : t.slice(0, i);
			},
			basename: function(t, r) {
				if (void 0 !== r && "string" != typeof r) throw new TypeError("\"ext\" argument must be a string");
				e(t);
				var n, i = 0, o = -1, s = !0;
				if (void 0 !== r && r.length > 0 && r.length <= t.length) {
					if (r.length === t.length && r === t) return "";
					var h = r.length - 1, a = -1;
					for (n = t.length - 1; n >= 0; --n) {
						var c = t.charCodeAt(n);
						if (47 === c) {
							if (!s) {
								i = n + 1;
								break;
							}
						} else -1 === a && (s = !1, a = n + 1), h >= 0 && (c === r.charCodeAt(h) ? -1 == --h && (o = n) : (h = -1, o = a));
					}
					return i === o ? o = a : -1 === o && (o = t.length), t.slice(i, o);
				}
				for (n = t.length - 1; n >= 0; --n) if (47 === t.charCodeAt(n)) {
					if (!s) {
						i = n + 1;
						break;
					}
				} else -1 === o && (s = !1, o = n + 1);
				return -1 === o ? "" : t.slice(i, o);
			},
			extname: function(t) {
				e(t);
				for (var r = -1, n = 0, i = -1, o = !0, s = 0, h = t.length - 1; h >= 0; --h) {
					var a = t.charCodeAt(h);
					if (47 !== a) -1 === i && (o = !1, i = h + 1), 46 === a ? -1 === r ? r = h : 1 !== s && (s = 1) : -1 !== r && (s = -1);
					else if (!o) {
						n = h + 1;
						break;
					}
				}
				return -1 === r || -1 === i || 0 === s || 1 === s && r === i - 1 && r === n + 1 ? "" : t.slice(r, i);
			},
			format: function(t) {
				if (null === t || "object" != typeof t) throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof t);
				return function(t, e) {
					var r = e.dir || e.root, n = e.base || (e.name || "") + (e.ext || "");
					return r ? r === e.root ? r + n : r + "/" + n : n;
				}(0, t);
			},
			parse: function(t) {
				e(t);
				var r = {
					root: "",
					dir: "",
					base: "",
					ext: "",
					name: ""
				};
				if (0 === t.length) return r;
				var n, i = t.charCodeAt(0), o = 47 === i;
				o ? (r.root = "/", n = 1) : n = 0;
				for (var s = -1, h = 0, a = -1, c = !0, f = t.length - 1, u = 0; f >= n; --f) if (47 !== (i = t.charCodeAt(f))) -1 === a && (c = !1, a = f + 1), 46 === i ? -1 === s ? s = f : 1 !== u && (u = 1) : -1 !== s && (u = -1);
				else if (!c) {
					h = f + 1;
					break;
				}
				return -1 === s || -1 === a || 0 === u || 1 === u && s === a - 1 && s === h + 1 ? -1 !== a && (r.base = r.name = 0 === h && o ? t.slice(1, a) : t.slice(h, a)) : (0 === h && o ? (r.name = t.slice(1, s), r.base = t.slice(1, a)) : (r.name = t.slice(h, s), r.base = t.slice(h, a)), r.ext = t.slice(s, a)), h > 0 ? r.dir = t.slice(0, h - 1) : o && (r.dir = "/"), r;
			},
			sep: "/",
			delimiter: ":",
			win32: null,
			posix: null
		};
		n.posix = n, t.exports = n;
	} }, e = {};
	function r(n) {
		var i = e[n];
		if (void 0 !== i) return i.exports;
		var o = e[n] = { exports: {} };
		return t[n](o, o.exports, r), o.exports;
	}
	r.d = (t, e) => {
		for (var n in e) r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, {
			enumerable: !0,
			get: e[n]
		});
	}, r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), r.r = (t) => {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
	};
	var n = {};
	let i;
	if (r.r(n), r.d(n, {
		URI: () => l,
		Utils: () => I
	}), "object" == typeof process) i = "win32" === process.platform;
	else if ("object" == typeof navigator) i = navigator.userAgent.indexOf("Windows") >= 0;
	const o = /^\w[\w\d+.-]*$/, s = /^\//, h = /^\/\//;
	function a(t, e) {
		if (!t.scheme && e) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${t.authority}", path: "${t.path}", query: "${t.query}", fragment: "${t.fragment}"}`);
		if (t.scheme && !o.test(t.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
		if (t.path) {
			if (t.authority) {
				if (!s.test(t.path)) throw new Error("[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash (\"/\") character");
			} else if (h.test(t.path)) throw new Error("[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters (\"//\")");
		}
	}
	const c = "", f = "/", u = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
	class l {
		static isUri(t) {
			return t instanceof l || !!t && "string" == typeof t.authority && "string" == typeof t.fragment && "string" == typeof t.path && "string" == typeof t.query && "string" == typeof t.scheme && "string" == typeof t.fsPath && "function" == typeof t.with && "function" == typeof t.toString;
		}
		scheme;
		authority;
		path;
		query;
		fragment;
		constructor(t, e, r, n, i, o = !1) {
			"object" == typeof t ? (this.scheme = t.scheme || c, this.authority = t.authority || c, this.path = t.path || c, this.query = t.query || c, this.fragment = t.fragment || c) : (this.scheme = function(t, e) {
				return t || e ? t : "file";
			}(t, o), this.authority = e || c, this.path = function(t, e) {
				switch (t) {
					case "https":
					case "http":
					case "file": e ? e[0] !== f && (e = f + e) : e = f;
				}
				return e;
			}(this.scheme, r || c), this.query = n || c, this.fragment = i || c, a(this, o));
		}
		get fsPath() {
			return v(this, !1);
		}
		with(t) {
			if (!t) return this;
			let { scheme: e, authority: r, path: n, query: i, fragment: o } = t;
			return void 0 === e ? e = this.scheme : null === e && (e = c), void 0 === r ? r = this.authority : null === r && (r = c), void 0 === n ? n = this.path : null === n && (n = c), void 0 === i ? i = this.query : null === i && (i = c), void 0 === o ? o = this.fragment : null === o && (o = c), e === this.scheme && r === this.authority && n === this.path && i === this.query && o === this.fragment ? this : new d(e, r, n, i, o);
		}
		static parse(t, e = !1) {
			const r = u.exec(t);
			return r ? new d(r[2] || c, w(r[4] || c), w(r[5] || c), w(r[7] || c), w(r[9] || c), e) : new d(c, c, c, c, c);
		}
		static file(t) {
			let e = c;
			if (i && (t = t.replace(/\\/g, f)), t[0] === f && t[1] === f) {
				const r = t.indexOf(f, 2);
				-1 === r ? (e = t.substring(2), t = f) : (e = t.substring(2, r), t = t.substring(r) || f);
			}
			return new d("file", e, t, c, c);
		}
		static from(t) {
			const e = new d(t.scheme, t.authority, t.path, t.query, t.fragment);
			return a(e, !0), e;
		}
		toString(t = !1) {
			return b(this, t);
		}
		toJSON() {
			return this;
		}
		static revive(t) {
			if (t) {
				if (t instanceof l) return t;
				{
					const e = new d(t);
					return e._formatted = t.external, e._fsPath = t._sep === g ? t.fsPath : null, e;
				}
			}
			return t;
		}
	}
	const g = i ? 1 : void 0;
	class d extends l {
		_formatted = null;
		_fsPath = null;
		get fsPath() {
			return this._fsPath || (this._fsPath = v(this, !1)), this._fsPath;
		}
		toString(t = !1) {
			return t ? b(this, !0) : (this._formatted || (this._formatted = b(this, !1)), this._formatted);
		}
		toJSON() {
			const t = { $mid: 1 };
			return this._fsPath && (t.fsPath = this._fsPath, t._sep = g), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
		}
	}
	const p = {
		58: "%3A",
		47: "%2F",
		63: "%3F",
		35: "%23",
		91: "%5B",
		93: "%5D",
		64: "%40",
		33: "%21",
		36: "%24",
		38: "%26",
		39: "%27",
		40: "%28",
		41: "%29",
		42: "%2A",
		43: "%2B",
		44: "%2C",
		59: "%3B",
		61: "%3D",
		32: "%20"
	};
	function m(t, e, r) {
		let n, i = -1;
		for (let o = 0; o < t.length; o++) {
			const s = t.charCodeAt(o);
			if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || 45 === s || 46 === s || 95 === s || 126 === s || e && 47 === s || r && 91 === s || r && 93 === s || r && 58 === s) -1 !== i && (n += encodeURIComponent(t.substring(i, o)), i = -1), void 0 !== n && (n += t.charAt(o));
			else {
				void 0 === n && (n = t.substr(0, o));
				const e = p[s];
				void 0 !== e ? (-1 !== i && (n += encodeURIComponent(t.substring(i, o)), i = -1), n += e) : -1 === i && (i = o);
			}
		}
		return -1 !== i && (n += encodeURIComponent(t.substring(i))), void 0 !== n ? n : t;
	}
	function y(t) {
		let e;
		for (let r = 0; r < t.length; r++) {
			const n = t.charCodeAt(r);
			35 === n || 63 === n ? (void 0 === e && (e = t.substr(0, r)), e += p[n]) : void 0 !== e && (e += t[r]);
		}
		return void 0 !== e ? e : t;
	}
	function v(t, e) {
		let r;
		return r = t.authority && t.path.length > 1 && "file" === t.scheme ? `//${t.authority}${t.path}` : 47 === t.path.charCodeAt(0) && (t.path.charCodeAt(1) >= 65 && t.path.charCodeAt(1) <= 90 || t.path.charCodeAt(1) >= 97 && t.path.charCodeAt(1) <= 122) && 58 === t.path.charCodeAt(2) ? e ? t.path.substr(1) : t.path[1].toLowerCase() + t.path.substr(2) : t.path, i && (r = r.replace(/\//g, "\\")), r;
	}
	function b(t, e) {
		const r = e ? y : m;
		let n = "", { scheme: i, authority: o, path: s, query: h, fragment: a } = t;
		if (i && (n += i, n += ":"), (o || "file" === i) && (n += f, n += f), o) {
			let t = o.indexOf("@");
			if (-1 !== t) {
				const e = o.substr(0, t);
				o = o.substr(t + 1), t = e.lastIndexOf(":"), -1 === t ? n += r(e, !1, !1) : (n += r(e.substr(0, t), !1, !1), n += ":", n += r(e.substr(t + 1), !1, !0)), n += "@";
			}
			o = o.toLowerCase(), t = o.lastIndexOf(":"), -1 === t ? n += r(o, !1, !0) : (n += r(o.substr(0, t), !1, !0), n += o.substr(t));
		}
		if (s) {
			if (s.length >= 3 && 47 === s.charCodeAt(0) && 58 === s.charCodeAt(2)) {
				const t = s.charCodeAt(1);
				t >= 65 && t <= 90 && (s = `/${String.fromCharCode(t + 32)}:${s.substr(3)}`);
			} else if (s.length >= 2 && 58 === s.charCodeAt(1)) {
				const t = s.charCodeAt(0);
				t >= 65 && t <= 90 && (s = `${String.fromCharCode(t + 32)}:${s.substr(2)}`);
			}
			n += r(s, !0, !1);
		}
		return h && (n += "?", n += r(h, !1, !1)), a && (n += "#", n += e ? a : m(a, !1, !1)), n;
	}
	function C(t) {
		try {
			return decodeURIComponent(t);
		} catch {
			return t.length > 3 ? t.substr(0, 3) + C(t.substr(3)) : t;
		}
	}
	const A = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
	function w(t) {
		return t.match(A) ? t.replace(A, ((t) => C(t))) : t;
	}
	var x = r(975);
	const P = x.posix || x, _ = "/";
	var I;
	(function(t) {
		t.joinPath = function(t, ...e) {
			return t.with({ path: P.join(t.path, ...e) });
		}, t.resolvePath = function(t, ...e) {
			let r = t.path, n = !1;
			r[0] !== _ && (r = _ + r, n = !0);
			let i = P.resolve(r, ...e);
			return n && i[0] === _ && !t.authority && (i = i.substring(1)), t.with({ path: i });
		}, t.dirname = function(t) {
			if (0 === t.path.length || t.path === _) return t;
			let e = P.dirname(t.path);
			return 1 === e.length && 46 === e.charCodeAt(0) && (e = ""), t.with({ path: e });
		}, t.basename = function(t) {
			return P.basename(t.path);
		}, t.extname = function(t) {
			return P.extname(t.path);
		};
	})(I || (I = {})), LIB = n;
})();
var { URI, Utils } = LIB;
//#endregion
//#region src/core/ProjectFile.ts
var LATEST_PROJECT_VERSION = "2.7.0";
function compareProjectVersions(version1, version2) {
	const version1Parts = version1.split(".").map(Number);
	const version2Parts = version2.split(".").map(Number);
	const maxLength = Math.max(version1Parts.length, version2Parts.length);
	for (let index = 0; index < maxLength; index++) {
		const version1Part = version1Parts[index] || 0;
		const version2Part = version2Parts[index] || 0;
		if (version1Part < version2Part) return -1;
		if (version1Part > version2Part) return 1;
	}
	return 0;
}
async function parseProjectFile(fileContent, decoder, attachments) {
	const entries = await new ZipReader(new Uint8ArrayReader(fileContent)).getEntries();
	let serializedStageObjects = [];
	let tags = [];
	let references = {
		sections: {},
		files: []
	};
	let metadata = createDefaultMetadata("2.0.0");
	let readme;
	for (const entry of entries) {
		if (entry.directory) continue;
		if (entry.filename === "stage.msgpack") {
			const stageRawData = await entry.getData(new Uint8ArrayWriter());
			serializedStageObjects = decoder.decode(stageRawData);
		} else if (entry.filename === "tags.msgpack") {
			const tagsRawData = await entry.getData(new Uint8ArrayWriter());
			tags = decoder.decode(tagsRawData);
		} else if (entry.filename === "reference.msgpack") {
			const referenceRawData = await entry.getData(new Uint8ArrayWriter());
			references = decoder.decode(referenceRawData);
		} else if (entry.filename === "metadata.msgpack") {
			const metadataRawData = await entry.getData(new Uint8ArrayWriter());
			const decodedMetadata = decoder.decode(metadataRawData);
			metadata = isValidMetadata(decodedMetadata) ? decodedMetadata : createDefaultMetadata("2.0.0");
		} else if (entry.filename === "README.md") {
			const readmeRawData = await entry.getData(new Uint8ArrayWriter());
			readme = new TextDecoder().decode(readmeRawData);
		} else if (entry.filename.startsWith("attachments/")) {
			const match = entry.filename.trim().match(/^attachments\/([a-zA-Z0-9-]+)\.([a-zA-Z0-9]+)$/);
			if (!match) {
				console.warn("[Project] 附件文件名不符合规范: %s", entry.filename);
				continue;
			}
			const [, uuid, extension] = match;
			const type = src_default.getType(extension) || "application/octet-stream";
			attachments.set(uuid, await entry.getData(new BlobWriter(type)));
		}
	}
	return {
		serializedStageObjects,
		tags,
		references,
		metadata,
		readme
	};
}
//#endregion
//#region src/types/node.tsx
var Serialized;
(function(_Serialized) {
	function isTextNode(obj) {
		return obj.type === "core:text_node";
	}
	_Serialized.isTextNode = isTextNode;
	function isSection(obj) {
		return obj.type === "core:section";
	}
	_Serialized.isSection = isSection;
	function isConnectPoint(obj) {
		return obj.type === "core:connect_point";
	}
	_Serialized.isConnectPoint = isConnectPoint;
	function isImageNode(obj) {
		return obj.type === "core:image_node";
	}
	_Serialized.isImageNode = isImageNode;
	function isUrlNode(obj) {
		return obj.type === "core:url_node";
	}
	_Serialized.isUrlNode = isUrlNode;
	function isPortalNode(obj) {
		return obj.type === "core:portal_node";
	}
	_Serialized.isPortalNode = isPortalNode;
	function isPenStroke(obj) {
		return obj.type === "core:pen_stroke";
	}
	_Serialized.isPenStroke = isPenStroke;
	function isSvgNode(obj) {
		return obj.type === "core:svg_node";
	}
	_Serialized.isSvgNode = isSvgNode;
	function isMultiTargetUndirectedEdge(obj) {
		return obj.type === "core:multi_target_undirected_edge";
	}
	_Serialized.isMultiTargetUndirectedEdge = isMultiTargetUndirectedEdge;
	function isEdge(obj) {
		return "source" in obj && "target" in obj;
	}
	_Serialized.isEdge = isEdge;
	function isLineEdge(obj) {
		return obj.type === "core:line_edge";
	}
	_Serialized.isLineEdge = isLineEdge;
	function isCubicCatmullRomSplineEdge(obj) {
		return obj.type === "core:cublic_catmull_rom_spline_edge";
	}
	_Serialized.isCubicCatmullRomSplineEdge = isCubicCatmullRomSplineEdge;
	function isCoreEntity(obj) {
		return obj.type.startsWith("core:");
	}
	_Serialized.isCoreEntity = isCoreEntity;
})(Serialized || (Serialized = {}));
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+api@2.11.0/node_modules/@tauri-apps/api/path.js
/**
* The path module provides utilities for working with file and directory paths.
*
* This package is also accessible with `window.__TAURI__.path` when [`app.withGlobalTauri`](https://v2.tauri.app/reference/config/#withglobaltauri) in `tauri.conf.json` is set to `true`.
*
* It is recommended to allowlist only the APIs you use for optimal bundle size and security.
* @module
*/
/**
* @since 2.0.0
*/
var BaseDirectory;
(function(BaseDirectory) {
	/**
	* @see {@link audioDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Audio"] = 1] = "Audio";
	/**
	* @see {@link cacheDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Cache"] = 2] = "Cache";
	/**
	* @see {@link configDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Config"] = 3] = "Config";
	/**
	* @see {@link dataDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Data"] = 4] = "Data";
	/**
	* @see {@link localDataDir} for more information.
	*/
	BaseDirectory[BaseDirectory["LocalData"] = 5] = "LocalData";
	/**
	* @see {@link documentDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Document"] = 6] = "Document";
	/**
	* @see {@link downloadDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Download"] = 7] = "Download";
	/**
	* @see {@link pictureDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Picture"] = 8] = "Picture";
	/**
	* @see {@link publicDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Public"] = 9] = "Public";
	/**
	* @see {@link videoDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Video"] = 10] = "Video";
	/**
	* @see {@link resourceDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Resource"] = 11] = "Resource";
	/**
	* @see {@link tempDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Temp"] = 12] = "Temp";
	/**
	* @see {@link appConfigDir} for more information.
	*/
	BaseDirectory[BaseDirectory["AppConfig"] = 13] = "AppConfig";
	/**
	* @see {@link appDataDir} for more information.
	*/
	BaseDirectory[BaseDirectory["AppData"] = 14] = "AppData";
	/**
	* @see {@link appLocalDataDir} for more information.
	*/
	BaseDirectory[BaseDirectory["AppLocalData"] = 15] = "AppLocalData";
	/**
	* @see {@link appCacheDir} for more information.
	*/
	BaseDirectory[BaseDirectory["AppCache"] = 16] = "AppCache";
	/**
	* @see {@link appLogDir} for more information.
	*/
	BaseDirectory[BaseDirectory["AppLog"] = 17] = "AppLog";
	/**
	* @see {@link desktopDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Desktop"] = 18] = "Desktop";
	/**
	* @see {@link executableDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Executable"] = 19] = "Executable";
	/**
	* @see {@link fontDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Font"] = 20] = "Font";
	/**
	* @see {@link homeDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Home"] = 21] = "Home";
	/**
	* @see {@link runtimeDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Runtime"] = 22] = "Runtime";
	/**
	* @see {@link templateDir} for more information.
	*/
	BaseDirectory[BaseDirectory["Template"] = 23] = "Template";
})(BaseDirectory || (BaseDirectory = {}));
/**
* Returns the path to the suggested directory for your app's data files.
* Resolves to `${dataDir}/${bundleIdentifier}`, where `bundleIdentifier` is the [`identifier`](https://v2.tauri.app/reference/config/#identifier) value configured in `tauri.conf.json`.
* @example
* ```typescript
* import { appDataDir } from '@tauri-apps/api/path';
* const appDataDirPath = await appDataDir();
* ```
*
* @since 1.2.0
*/
async function appDataDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.AppData });
}
/**
* Returns the path to the suggested directory for your app's local data files.
* Resolves to `${localDataDir}/${bundleIdentifier}`, where `bundleIdentifier` is the [`identifier`](https://v2.tauri.app/reference/config/#identifier) value configured in `tauri.conf.json`.
* @example
* ```typescript
* import { appLocalDataDir } from '@tauri-apps/api/path';
* const appLocalDataDirPath = await appLocalDataDir();
* ```
*
* @since 1.2.0
*/
async function appLocalDataDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.AppLocalData });
}
/**
* Returns the path to the suggested directory for your app's cache files.
* Resolves to `${cacheDir}/${bundleIdentifier}`, where `bundleIdentifier` is the [`identifier`](https://v2.tauri.app/reference/config/#identifier) value configured in `tauri.conf.json`.
* @example
* ```typescript
* import { appCacheDir } from '@tauri-apps/api/path';
* const appCacheDirPath = await appCacheDir();
* ```
*
* @since 1.2.0
*/
async function appCacheDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.AppCache });
}
/**
* Returns the path to the user's data directory.
*
* #### Platform-specific
*
* - **Linux:** Resolves to `$XDG_DATA_HOME` or `$HOME/.local/share`.
* - **macOS:** Resolves to `$HOME/Library/Application Support`.
* - **Windows:** Resolves to `{FOLDERID_RoamingAppData}`.
* @example
* ```typescript
* import { dataDir } from '@tauri-apps/api/path';
* const dataDirPath = await dataDir();
* ```
*
* @since 1.0.0
*/
async function dataDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.Data });
}
/**
* Returns the path to the user's home directory.
*
* #### Platform-specific
*
* - **Linux:** Resolves to `$HOME`.
* - **macOS:** Resolves to `$HOME`.
* - **Windows:** Resolves to `{FOLDERID_Profile}`.
* @example
* ```typescript
* import { homeDir } from '@tauri-apps/api/path';
* const homeDirPath = await homeDir();
* ```
*
* @since 1.0.0
*/
async function homeDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.Home });
}
/**
* Returns a temporary directory.
* @example
* ```typescript
* import { tempDir } from '@tauri-apps/api/path';
* const temp = await tempDir();
* ```
*
* @since 2.0.0
*/
async function tempDir() {
	return invoke("plugin:path|resolve_directory", { directory: BaseDirectory.Temp });
}
/**
* Returns the platform-specific path segment separator:
* - `\` on Windows
* - `/` on POSIX
*
* @since 2.0.0
*/
function sep() {
	return window.__TAURI_INTERNALS__.plugins.path.sep;
}
/**
*  Joins all given `path` segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
* @example
* ```typescript
* import { join, appDataDir } from '@tauri-apps/api/path';
* const appDataDirPath = await appDataDir();
* const path = await join(appDataDirPath, 'users', 'tauri', 'avatar.png');
* ```
*
* @since 1.0.0
*/
async function join(...paths) {
	return invoke("plugin:path|join", { paths });
}
/**
* Returns the parent directory of a given `path`. Trailing directory separators are ignored.
* @example
* ```typescript
* import { dirname } from '@tauri-apps/api/path';
* const dir = await dirname('/path/to/somedir/');
* assert(dir === '/path/to');
* ```
*
* @since 1.0.0
*/
async function dirname(path) {
	return invoke("plugin:path|dirname", { path });
}
//#endregion
//#region src/utils/path.tsx
var Path = class Path {
	path;
	static sep = isTauri() ? sep() : "/";
	constructor(pathOrUri) {
		if (typeof pathOrUri === "string") this.path = pathOrUri;
		else this.path = pathOrUri.fsPath;
	}
	get parent() {
		const parts = this.path.split(Path.sep);
		parts.pop();
		return new Path(parts.join(Path.sep));
	}
	get name() {
		const parts = this.path.split(Path.sep);
		return parts[parts.length - 1];
	}
	get ext() {
		const parts = this.path.split(".");
		if (parts.length > 1) return parts[parts.length - 1];
		else return "";
	}
	get nameWithoutExt() {
		const parts = this.name.split(".");
		if (parts.length > 1) parts.pop();
		return parts.join(".");
	}
	join(path) {
		return new Path(this.path + Path.sep + path);
	}
	toUri() {
		return URI.file(this.path);
	}
	toString() {
		return this.path;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@tauri-apps+plugin-fs@2.5.1/node_modules/@tauri-apps/plugin-fs/dist-js/index.js
/**
* Access the file system.
*
* ## iOS security-scoped resources
*
* On iOS, the `fs` plugin automatically manages access to security-scoped resources when a file URL is accessed.
* This is required for files outside the app's sandbox (e.g., from file picker).
*
* @example
* ```typescript
* import { open } from '@tauri-apps/plugin-fs';
*
* const file = await open('file:///path/to/file.txt');
* await file.close();
* ```
*
* ## Security
*
* This module prevents path traversal, not allowing parent directory accessors to be used
* (i.e. "/usr/path/to/../file" or "../path/to/file" paths are not allowed).
* Paths accessed with this API must be either relative to one of the {@link BaseDirectory | base directories}
* or created with the {@link https://v2.tauri.app/reference/javascript/api/namespacepath/ | path API}.
*
* The API has a scope configuration that forces you to restrict the paths that can be accessed using glob patterns.
*
* The scope configuration is an array of glob patterns describing file/directory paths that are allowed.
* For instance, this scope configuration allows **all** enabled `fs` APIs to (only) access files in the
* *databases* directory of the {@link https://v2.tauri.app/reference/javascript/api/namespacepath/#appdatadir | `$APPDATA` directory}:
* ```json
* {
*   "permissions": [
*     {
*       "identifier": "fs:scope",
*       "allow": [{ "path": "$APPDATA/databases/*" }]
*     }
*   ]
* }
* ```
*
* Scopes can also be applied to specific `fs` APIs by using the API's identifier instead of `fs:scope`:
* ```json
* {
*   "permissions": [
*     {
*       "identifier": "fs:allow-exists",
*       "allow": [{ "path": "$APPDATA/databases/*" }]
*     }
*   ]
* }
* ```
*
* Notice the use of the `$APPDATA` variable. The value is injected at runtime, resolving to the {@link https://v2.tauri.app/reference/javascript/api/namespacepath/#appdatadir | app data directory}.
*
* The available variables are:
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#appconfigdir | $APPCONFIG},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#appdatadir | $APPDATA},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#applocaldatadir | $APPLOCALDATA},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#appcachedir | $APPCACHE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#applogdir | $APPLOG},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#audiodir | $AUDIO},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#cachedir | $CACHE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#configdir | $CONFIG},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#datadir | $DATA},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#localdatadir | $LOCALDATA},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#desktopdir | $DESKTOP},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#documentdir | $DOCUMENT},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#downloaddir | $DOWNLOAD},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#executabledir | $EXE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#fontdir | $FONT},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#homedir | $HOME},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#picturedir | $PICTURE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#publicdir | $PUBLIC},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#runtimedir | $RUNTIME},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#templatedir | $TEMPLATE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#videodir | $VIDEO},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#resourcedir | $RESOURCE},
* {@linkcode https://v2.tauri.app/reference/javascript/api/namespacepath/#tempdir | $TEMP}.
*
* Trying to execute any API with a URL not configured on the scope results in a promise rejection due to denied access.
*
* @module
*/
var SeekMode;
(function(SeekMode) {
	SeekMode[SeekMode["Start"] = 0] = "Start";
	SeekMode[SeekMode["Current"] = 1] = "Current";
	SeekMode[SeekMode["End"] = 2] = "End";
})(SeekMode || (SeekMode = {}));
function parseFileInfo(r) {
	return {
		isFile: r.isFile,
		isDirectory: r.isDirectory,
		isSymlink: r.isSymlink,
		size: r.size,
		mtime: r.mtime !== null ? new Date(r.mtime) : null,
		atime: r.atime !== null ? new Date(r.atime) : null,
		birthtime: r.birthtime !== null ? new Date(r.birthtime) : null,
		readonly: r.readonly,
		fileAttributes: r.fileAttributes,
		dev: r.dev,
		ino: r.ino,
		mode: r.mode,
		nlink: r.nlink,
		uid: r.uid,
		gid: r.gid,
		rdev: r.rdev,
		blksize: r.blksize,
		blocks: r.blocks
	};
}
/** Converts a big-endian eight byte array to number  */
function fromBytes(buffer) {
	const bytes = new Uint8ClampedArray(buffer);
	const size = bytes.byteLength;
	let x = 0;
	for (let i = 0; i < size; i++) {
		const byte = bytes[i];
		x *= 256;
		x += byte;
	}
	return x;
}
/**
*  The Tauri abstraction for reading and writing files.
*
* @since 2.0.0
*/
var FileHandle = class extends Resource {
	/**
	* Reads up to `p.byteLength` bytes into `p`. It resolves to the number of
	* bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
	* encountered. Even if `read()` resolves to `n` < `p.byteLength`, it may
	* use all of `p` as scratch space during the call. If some data is
	* available but not `p.byteLength` bytes, `read()` conventionally resolves
	* to what is available instead of waiting for more.
	*
	* When `read()` encounters end-of-file condition, it resolves to EOF
	* (`null`).
	*
	* When `read()` encounters an error, it rejects with an error.
	*
	* Callers should always process the `n` > `0` bytes returned before
	* considering the EOF (`null`). Doing so correctly handles I/O errors that
	* happen after reading some bytes and also both of the allowed EOF
	* behaviors.
	*
	* @example
	* ```typescript
	* import { open, BaseDirectory } from "@tauri-apps/plugin-fs"
	* // if "$APPCONFIG/foo/bar.txt" contains the text "hello world":
	* const file = await open("foo/bar.txt", { baseDir: BaseDirectory.AppConfig });
	* const buf = new Uint8Array(100);
	* const numberOfBytesRead = await file.read(buf); // 11 bytes
	* const text = new TextDecoder().decode(buf);  // "hello world"
	* await file.close();
	* ```
	*
	* @since 2.0.0
	*/
	async read(buffer) {
		if (buffer.byteLength === 0) return 0;
		const data = await invoke("plugin:fs|read", {
			rid: this.rid,
			len: buffer.byteLength
		});
		const nread = fromBytes(data.slice(-8));
		const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
		buffer.set(bytes.slice(0, bytes.length - 8));
		return nread === 0 ? null : nread;
	}
	/**
	* Seek sets the offset for the next `read()` or `write()` to offset,
	* interpreted according to `whence`: `Start` means relative to the
	* start of the file, `Current` means relative to the current offset,
	* and `End` means relative to the end. Seek resolves to the new offset
	* relative to the start of the file.
	*
	* Seeking to an offset before the start of the file is an error. Seeking to
	* any positive offset is legal, but the behavior of subsequent I/O
	* operations on the underlying object is implementation-dependent.
	* It returns the number of cursor position.
	*
	* @example
	* ```typescript
	* import { open, SeekMode, BaseDirectory } from '@tauri-apps/plugin-fs';
	*
	* // Given hello.txt pointing to file with "Hello world", which is 11 bytes long:
	* const file = await open('hello.txt', { read: true, write: true, truncate: true, create: true, baseDir: BaseDirectory.AppLocalData });
	* await file.write(new TextEncoder().encode("Hello world"));
	*
	* // Seek 6 bytes from the start of the file
	* console.log(await file.seek(6, SeekMode.Start)); // "6"
	* // Seek 2 more bytes from the current position
	* console.log(await file.seek(2, SeekMode.Current)); // "8"
	* // Seek backwards 2 bytes from the end of the file
	* console.log(await file.seek(-2, SeekMode.End)); // "9" (e.g. 11-2)
	*
	* await file.close();
	* ```
	*
	* @since 2.0.0
	*/
	async seek(offset, whence) {
		return await invoke("plugin:fs|seek", {
			rid: this.rid,
			offset,
			whence
		});
	}
	/**
	* Returns a {@linkcode FileInfo } for this file.
	*
	* @example
	* ```typescript
	* import { open, BaseDirectory } from '@tauri-apps/plugin-fs';
	* const file = await open("file.txt", { read: true, baseDir: BaseDirectory.AppLocalData });
	* const fileInfo = await file.stat();
	* console.log(fileInfo.isFile); // true
	* await file.close();
	* ```
	*
	* @since 2.0.0
	*/
	async stat() {
		return parseFileInfo(await invoke("plugin:fs|fstat", { rid: this.rid }));
	}
	/**
	* Truncates or extends this file, to reach the specified `len`.
	* If `len` is not specified then the entire file contents are truncated.
	*
	* @example
	* ```typescript
	* import { open, BaseDirectory } from '@tauri-apps/plugin-fs';
	*
	* // truncate the entire file
	* const file = await open("my_file.txt", { read: true, write: true, create: true, baseDir: BaseDirectory.AppLocalData });
	* await file.truncate();
	*
	* // truncate part of the file
	* const file = await open("my_file.txt", { read: true, write: true, create: true, baseDir: BaseDirectory.AppLocalData });
	* await file.write(new TextEncoder().encode("Hello World"));
	* await file.truncate(7);
	* const data = new Uint8Array(32);
	* await file.read(data);
	* console.log(new TextDecoder().decode(data)); // Hello W
	* await file.close();
	* ```
	*
	* @since 2.0.0
	*/
	async truncate(len) {
		await invoke("plugin:fs|ftruncate", {
			rid: this.rid,
			len
		});
	}
	/**
	* Writes `data.byteLength` bytes from `data` to the underlying data stream. It
	* resolves to the number of bytes written from `data` (`0` <= `n` <=
	* `data.byteLength`) or reject with the error encountered that caused the
	* write to stop early. `write()` must reject with a non-null error if
	* would resolve to `n` < `data.byteLength`. `write()` must not modify the
	* slice data, even temporarily.
	*
	* @example
	* ```typescript
	* import { open, write, BaseDirectory } from '@tauri-apps/plugin-fs';
	* const encoder = new TextEncoder();
	* const data = encoder.encode("Hello world");
	* const file = await open("bar.txt", { write: true, baseDir: BaseDirectory.AppLocalData });
	* const bytesWritten = await file.write(data); // 11
	* await file.close();
	* ```
	*
	* @since 2.0.0
	*/
	async write(data) {
		return await invoke("plugin:fs|write", {
			rid: this.rid,
			data
		});
	}
};
/**
* Open a file and resolve to an instance of {@linkcode FileHandle}. The
* file does not need to previously exist if using the `create` or `createNew`
* open options. It is the callers responsibility to close the file when finished
* with it.
*
* @example
* ```typescript
* import { open, BaseDirectory } from "@tauri-apps/plugin-fs"
* const file = await open("foo/bar.txt", { read: true, write: true, baseDir: BaseDirectory.AppLocalData });
* // Do work with file
* await file.close();
* ```
*
* @since 2.0.0
*/
async function open(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	return new FileHandle(await invoke("plugin:fs|open", {
		path: path instanceof URL ? path.toString() : path,
		options
	}));
}
/**
* Creates a new directory with the specified path.
* @example
* ```typescript
* import { mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
* await mkdir('users', { baseDir: BaseDirectory.AppLocalData });
* ```
*
* @since 2.0.0
*/
async function mkdir(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	await invoke("plugin:fs|mkdir", {
		path: path instanceof URL ? path.toString() : path,
		options
	});
}
/**
* Reads the directory given by path and returns an array of `DirEntry`.
* @example
* ```typescript
* import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
* import { join } from '@tauri-apps/api/path';
* const dir = "users"
* const entries = await readDir('users', { baseDir: BaseDirectory.AppLocalData });
* processEntriesRecursively(dir, entries);
* async function processEntriesRecursively(parent, entries) {
*   for (const entry of entries) {
*     console.log(`Entry: ${entry.name}`);
*     if (entry.isDirectory) {
*        const dir = await join(parent, entry.name);
*       processEntriesRecursively(dir, await readDir(dir, { baseDir: BaseDirectory.AppLocalData }))
*     }
*   }
* }
* ```
*
* @since 2.0.0
*/
async function readDir(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	return await invoke("plugin:fs|read_dir", {
		path: path instanceof URL ? path.toString() : path,
		options
	});
}
/**
* Reads and resolves to the entire contents of a file as an array of bytes.
* TextDecoder can be used to transform the bytes to string if required.
* @example
* ```typescript
* import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';
* const contents = await readFile('avatar.png', { baseDir: BaseDirectory.Resource });
* ```
*
* @since 2.0.0
*/
async function readFile(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	const arr = await invoke("plugin:fs|read_file", {
		path: path instanceof URL ? path.toString() : path,
		options
	});
	return arr instanceof ArrayBuffer ? new Uint8Array(arr) : Uint8Array.from(arr);
}
/**
* Removes the named file or directory.
* If the directory is not empty and the `recursive` option isn't set to true, the promise will be rejected.
* @example
* ```typescript
* import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';
* await remove('users/file.txt', { baseDir: BaseDirectory.AppLocalData });
* await remove('users', { baseDir: BaseDirectory.AppLocalData });
* ```
*
* @since 2.0.0
*/
async function remove(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	await invoke("plugin:fs|remove", {
		path: path instanceof URL ? path.toString() : path,
		options
	});
}
/**
* Renames (moves) oldpath to newpath. Paths may be files or directories.
* If newpath already exists and is not a directory, rename() replaces it.
* OS-specific restrictions may apply when oldpath and newpath are in different directories.
*
* On Unix, this operation does not follow symlinks at either path.
*
* @example
* ```typescript
* import { rename, BaseDirectory } from '@tauri-apps/plugin-fs';
* await rename('avatar.png', 'deleted.png', { oldPathBaseDir: BaseDirectory.App, newPathBaseDir: BaseDirectory.AppLocalData });
* ```
*
* @since 2.0.0
*/
async function rename(oldPath, newPath, options) {
	if (oldPath instanceof URL && oldPath.protocol !== "file:" || newPath instanceof URL && newPath.protocol !== "file:") throw new TypeError("Must be a file URL.");
	await invoke("plugin:fs|rename", {
		oldPath: oldPath instanceof URL ? oldPath.toString() : oldPath,
		newPath: newPath instanceof URL ? newPath.toString() : newPath,
		options
	});
}
/**
* Resolves to a {@linkcode FileInfo} for the specified `path`. Will always
* follow symlinks but will reject if the symlink points to a path outside of the scope.
*
* @example
* ```typescript
* import { stat, BaseDirectory } from '@tauri-apps/plugin-fs';
* const fileInfo = await stat("hello.txt", { baseDir: BaseDirectory.AppLocalData });
* console.log(fileInfo.isFile); // true
* ```
*
* @since 2.0.0
*/
async function stat(path, options) {
	return parseFileInfo(await invoke("plugin:fs|stat", {
		path: path instanceof URL ? path.toString() : path,
		options
	}));
}
/**
* Resolves to a {@linkcode FileInfo} for the specified `path`. If `path` is a
* symlink, information for the symlink will be returned instead of what it
* points to.
*
* @example
* ```typescript
* import { lstat, BaseDirectory } from '@tauri-apps/plugin-fs';
* const fileInfo = await lstat("hello.txt", { baseDir: BaseDirectory.AppLocalData });
* console.log(fileInfo.isFile); // true
* ```
*
* @since 2.0.0
*/
async function lstat(path, options) {
	return parseFileInfo(await invoke("plugin:fs|lstat", {
		path: path instanceof URL ? path.toString() : path,
		options
	}));
}
/**
* Write `data` to the given `path`, by default creating a new file if needed, else overwriting.
* @example
* ```typescript
* import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
*
* let encoder = new TextEncoder();
* let data = encoder.encode("Hello World");
* await writeFile('file.txt', data, { baseDir: BaseDirectory.AppLocalData });
* ```
*
* @since 2.0.0
*/
async function writeFile(path, data, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	if (data instanceof ReadableStream) {
		const file = await open(path, {
			read: false,
			create: true,
			write: true,
			...options
		});
		const reader = data.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				await file.write(value);
			}
		} finally {
			reader.releaseLock();
			await file.close();
		}
	} else await invoke("plugin:fs|write_file", data, { headers: {
		path: encodeURIComponent(path instanceof URL ? path.toString() : path),
		options: JSON.stringify(options)
	} });
}
/**
* Check if a path exists.
* @example
* ```typescript
* import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';
* // Check if the `$APPDATA/avatar.png` file exists
* await exists('avatar.png', { baseDir: BaseDirectory.AppData });
* ```
*
* @since 2.0.0
*/
async function exists(path, options) {
	if (path instanceof URL && path.protocol !== "file:") throw new TypeError("Must be a file URL.");
	return await invoke("plugin:fs|exists", {
		path: path instanceof URL ? path.toString() : path,
		options
	});
}
//#endregion
//#region ../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(arr, offset = 0) {
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
//#endregion
//#region ../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist-node/rng.js
var rnds8 = new Uint8Array(16);
function rng() {
	return crypto.getRandomValues(rnds8);
}
//#endregion
//#region ../node_modules/.pnpm/uuid@14.0.0/node_modules/uuid/dist-node/v4.js
function v4(options, buf, offset) {
	if (!buf && !options && crypto.randomUUID) return crypto.randomUUID();
	return _v4(options, buf, offset);
}
function _v4(options, buf, offset) {
	options = options || {};
	const rnds = options.random ?? options.rng?.() ?? rng();
	if (rnds.length < 16) throw new Error("Random bytes length must be >= 16");
	rnds[6] = rnds[6] & 15 | 64;
	rnds[8] = rnds[8] & 63 | 128;
	if (buf) {
		offset = offset || 0;
		if (offset < 0 || offset + 16 > buf.length) throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
		for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
		return buf;
	}
	return unsafeStringify(rnds);
}
//#endregion
//#region src/core/stage/stageObject/abstract/StageObject.tsx
/**
* 注：关于舞台上的东西的这一部分的
* 继承体系是 Rutubet 和 Littlefean 的讨论结果
*
*/
/**
* 一切舞台上的东西
* 都具有碰撞箱，uuid
*/
var StageObject = class {
	/**
	* 是否是"物理存在"的对象（占据画布空间）
	* false 的对象会被排除在框选、劈砍、F键视野重置等交互之外
	* 默认为 true，SyncAssociation 等纯数据关系对象应覆盖为 false
	*/
	get isPhysical() {
		return true;
	}
	_isSelected = false;
	get isSelected() {
		return this._isSelected;
	}
	set isSelected(value) {
		this._isSelected = value;
	}
	/**
	* 防止孪生同步循环触发的标志
	* 当此对象正在被 StageSyncAssociationManager 写入同步内容时为 true，
	* 检测到该标志时跳过向外同步，避免循环同步。
	* 所有舞台对象在未来都有可能被加上同步关系，因此放在基类中。
	*/
	_isSyncing = false;
};
//#endregion
//#region src/core/stage/stageObject/abstract/StageEntity.tsx
/**
* 一切独立存在、能被移动的东西，且放在框里能被连带移动的东西
* 实体
*/
var Entity = class extends StageObject {
	/**
	* 是否忽略自动对齐功能
	* 例如涂鸦就不吸附对齐
	*/
	isAlignExcluded = false;
	/**
	* [
	*  { type: 'p', children: [{ text: 'Serialize just this paragraph.' }] },
	*  { type: 'h1', children: [{ text: 'And this heading.' }] }
	* ]
	*/
	details = [];
	/**
	* 运行时直接父级 Section。
	* 不参与序列化，打开文件后由 `StageManager.updateReferences()` 重建。
	*/
	parentSection = null;
	/**
	* 运行时层级深度。
	* 顶层实体和根 Section 都为 0，嵌套越深数值越大。
	*/
	sectionDepth = 0;
	/**
	* 运行时最近的锁定祖先 Section。
	* 用于后续把锁定判断从全局扫描收敛到沿父链查询。
	*/
	nearestLockedAncestorSection = null;
	/** 用于交互使用，比如鼠标悬浮显示details */
	isMouseHover = false;
	detailsButtonRectangle() {
		return new Rectangle(this.collisionBox.getRectangle().rightTop.subtract(new Vector(10, 10)), new Vector(25, 25));
	}
	isMouseInDetailsButton(mouseWorldLocation) {
		return this.detailsButtonRectangle().isPointIn(mouseWorldLocation);
	}
	referenceButtonCircle() {
		return new Circle(this.collisionBox.getRectangle().leftTop.subtract(new Vector(25, 25)), 25);
	}
	isMouseInReferenceButton(mouseWorldLocation) {
		return this.referenceButtonCircle().isPointIn(mouseWorldLocation);
	}
	/**
	* 由于自身位置的移动，递归的更新所有父级Section的位置和大小。
	* 每次父框 adjustLocationAndSize 后，调用碰撞求解器推开与其重叠的同级分支。
	*/
	updateFatherSectionByMove() {
		let current = this.parentSection;
		while (current) {
			current.adjustLocationAndSize();
			this.project.sectionCollisionSolver.solveOverlaps(current);
			current = current.parentSection;
		}
	}
	/**
	* 由于自身位置的更新，排开所有同级节点的位置
	* 此函数在move函数中被调用，更新
	*/
	updateOtherEntityLocationByMove() {
		if (!Settings.isEnableEntityCollision) return;
		for (const entity of this.project.stageManager.getEntities()) {
			if (entity === this) continue;
			this.collideWithOtherEntity(entity);
		}
	}
	/**
	* 与其他实体碰撞，调整位置；能够递归传递
	* @param other 其他实体
	*/
	collideWithOtherEntity(other) {
		if (!Settings.isEnableEntityCollision) return;
		const selfRectangle = this.collisionBox.getRectangle();
		const otherRectangle = other.collisionBox.getRectangle();
		if (!selfRectangle.isCollideWith(otherRectangle)) return;
		const overlapSize = selfRectangle.getOverlapSize(otherRectangle);
		let moveDelta;
		if (Math.abs(overlapSize.x) < Math.abs(overlapSize.y)) moveDelta = new Vector(overlapSize.x * Math.sign(otherRectangle.center.x - selfRectangle.center.x), 0);
		else moveDelta = new Vector(0, overlapSize.y * Math.sign(otherRectangle.center.y - selfRectangle.center.y));
		other.move(moveDelta);
	}
	detailsManager = new DetailsManager(this);
};
__decorate([serializable, __decorateMetadata("design:type", Object)], Entity.prototype, "details", void 0);
//#endregion
//#region src/core/stage/stageObject/collisionBox/collisionBox.tsx
/**
* 碰撞箱类
*/
var CollisionBox = class {
	shapes = [];
	constructor(shapes) {
		this.shapes = shapes;
	}
	/**
	*
	* @param shapes 更新碰撞箱的形状列表
	*/
	updateShapeList(shapes) {
		this.shapes = shapes;
	}
	isContainsPoint(location) {
		for (const shape of this.shapes) if (shape.isPointIn(location)) return true;
		return false;
	}
	/**
	* 碰撞框选
	* @param rectangle
	* @returns
	*/
	isIntersectsWithRectangle(rectangle) {
		for (const shape of this.shapes) if (shape.isCollideWithRectangle(rectangle)) return true;
		return false;
	}
	/**
	* 完全覆盖框选
	* @param rectangle
	* @returns
	*/
	isContainedByRectangle(rectangle) {
		for (const shape of this.shapes) {
			const shapeRectangle = shape.getRectangle();
			const shapeLeftTop = shapeRectangle.location;
			const shapeRightBottom = new Vector(shapeLeftTop.x + shapeRectangle.size.x, shapeLeftTop.y + shapeRectangle.size.y);
			const rectLeftTop = rectangle.location;
			const rectRightBottom = new Vector(rectLeftTop.x + rectangle.size.x, rectLeftTop.y + rectangle.size.y);
			if (shapeLeftTop.x < rectLeftTop.x || shapeLeftTop.y < rectLeftTop.y || shapeRightBottom.x > rectRightBottom.x || shapeRightBottom.y > rectRightBottom.y) return false;
		}
		return true;
	}
	isIntersectsWithLine(line) {
		for (const shape of this.shapes) if (shape.isCollideWithLine(line)) return true;
		return false;
	}
	/**
	* 获取碰撞箱们的最小外接矩形
	* 如果形状数组为空，则返回00点的无大小矩形
	*/
	getRectangle() {
		if (this.shapes.length === 0) return new Rectangle(Vector.getZero(), Vector.getZero());
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const shape of this.shapes) {
			const rectangle = shape.getRectangle();
			const x = rectangle.location.x, y = rectangle.location.y;
			const width = rectangle.size.x, height = rectangle.size.y;
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x + width > maxX) maxX = x + width;
			if (y + height > maxY) maxY = y + height;
		}
		return new Rectangle(new Vector(minX, minY), new Vector(maxX - minX, maxY - minY));
	}
};
__decorate([serializable, __decorateMetadata("design:type", Array)], CollisionBox.prototype, "shapes", void 0);
//#endregion
//#region src/core/stage/stageObject/entity/PenStroke.tsx
/**
* 一笔画中的某一个小段
* 起始点，结束点，宽度
*/
var PenStrokeSegment = class {
	location;
	pressure;
	constructor(location, pressure) {
		this.location = location;
		this.pressure = pressure;
	}
};
__decorate([serializable, __decorateMetadata("design:type", typeof Vector === "undefined" ? Object : Vector)], PenStrokeSegment.prototype, "location", void 0);
__decorate([serializable, __decorateMetadata("design:type", Number)], PenStrokeSegment.prototype, "pressure", void 0);
var PenStroke = class PenStroke extends Entity {
	project;
	/** 涂鸦不参与吸附对齐 */
	isAlignExcluded = true;
	isHiddenBySectionCollapse = false;
	collisionBox = new CollisionBox([]);
	uuid;
	move(delta) {
		for (const segment of this.segments) segment.location = segment.location.add(delta);
		this.updateCollisionBoxBySegmentList();
	}
	moveTo(location) {
		for (const segment of this.segments) {
			const delta = location.subtract(segment.location);
			segment.location = segment.location.add(delta);
		}
		this.updateCollisionBoxBySegmentList();
	}
	updateCollisionBoxBySegmentList() {
		this.collisionBox.shapes = [];
		for (let i = 1; i < this.segments.length; i++) {
			const segment = this.segments[i];
			const previousSegment = this.segments[i - 1];
			this.collisionBox.shapes.push(new Line(previousSegment.location, segment.location));
		}
	}
	segments = [];
	color = Color.Transparent;
	getPath() {
		return this.segments.map((it) => it.location);
	}
	constructor(project, { uuid = crypto.randomUUID(), segments = [], color = Color.White }) {
		super();
		this.project = project;
		this.uuid = uuid;
		this.segments = segments;
		this.color = color;
		this.updateCollisionBoxBySegmentList();
	}
	getCollisionBoxFromSegmentList(segmentList) {
		const result = new CollisionBox([]);
		for (let i = 1; i < segmentList.length; i++) {
			const segment = segmentList[i];
			const previousSegment = segmentList[i - 1];
			result.shapes.push(new Line(previousSegment.location, segment.location));
		}
		return result;
	}
};
__decorate([
	id,
	serializable,
	__decorateMetadata("design:type", String)
], PenStroke.prototype, "uuid", void 0);
__decorate([serializable, __decorateMetadata("design:type", Array)], PenStroke.prototype, "segments", void 0);
__decorate([serializable, __decorateMetadata("design:type", typeof Color === "undefined" ? Object : Color)], PenStroke.prototype, "color", void 0);
PenStroke = __decorate([
	passExtraAtArg1,
	passObject,
	__decorateMetadata("design:paramtypes", [Object, Object])
], PenStroke);
//#endregion
//#region src/core/stage/ProjectUpgrader.tsx
var ProjectUpgrader;
(function(_ProjectUpgrader) {
	_ProjectUpgrader.NLatestVersion = LATEST_PROJECT_VERSION;
	function upgradeVAnyToVLatest(data) {
		data = convertV1toV2(data);
		data = convertV2toV3(data);
		data = convertV3toV4(data);
		data = convertV4toV5(data);
		data = convertV5toV6(data);
		data = convertV6toV7(data);
		data = convertV7toV8(data);
		data = convertV8toV9(data);
		data = convertV9toV10(data);
		data = convertV10toV11(data);
		data = convertV11toV12(data);
		data = convertV12toV13(data);
		data = convertV13toV14(data);
		data = convertV14toV15(data);
		data = convertV15toV16(data);
		data = convertV16toV17(data);
		return data;
	}
	_ProjectUpgrader.upgradeVAnyToVLatest = upgradeVAnyToVLatest;
	function convertV1toV2(data) {
		if ("version" in data) return data;
		data.version = 2;
		if (!("nodes" in data)) data.nodes = [];
		if (!("links" in data)) data.links = [];
		for (const node of data.nodes) {
			if (!("details" in node)) node.details = {};
			if (!("inner_text" in node)) node.inner_text = "";
			if (!("children" in node)) node.children = [];
			if (!("uuid" in node)) throw new Error("节点缺少uuid字段");
		}
		for (const link of data.links) if (!("inner_text" in link)) link.inner_text = "";
		return data;
	}
	function convertV2toV3(data) {
		if (data.version >= 3) return data;
		data.version = 3;
		for (const node of data.nodes) {
			node.shape = node.body_shape;
			delete node.body_shape;
			node.shape.location = node.shape.location_left_top;
			delete node.shape.location_left_top;
			node.shape.size = [node.shape.width, node.shape.height];
			delete node.shape.width;
			delete node.shape.height;
			node.text = node.inner_text;
			delete node.inner_text;
		}
		data.edges = data.links;
		delete data.links;
		for (const edge of data.edges) {
			edge.source = edge.source_node;
			delete edge.source_node;
			edge.target = edge.target_node;
			delete edge.target_node;
			edge.text = edge.inner_text;
			delete edge.inner_text;
		}
		return data;
	}
	function convertV3toV4(data) {
		if (data.version >= 4) return data;
		data.version = 4;
		for (const node of data.nodes) {
			node.color = [
				0,
				0,
				0,
				0
			];
			node.location = node.shape.location;
			delete node.shape.location;
			node.size = node.shape.size;
			delete node.shape.size;
		}
		return data;
	}
	function convertV4toV5(data) {
		if (data.version >= 5) return data;
		data.version = 5;
		for (const node of data.nodes) if (!node.color) node.color = [
			0,
			0,
			0,
			0
		];
		return data;
	}
	function convertV5toV6(data) {
		if (data.version >= 6) return data;
		data.version = 6;
		for (const node of data.nodes) if (typeof node.children !== "undefined") delete node.children;
		return data;
	}
	function convertV6toV7(data) {
		if (data.version >= 7) return data;
		data.version = 7;
		for (const edge of data.edges) if (typeof edge.uuid === "undefined") edge.uuid = v4();
		return data;
	}
	function convertV7toV8(data) {
		if (data.version >= 8) return data;
		data.version = 8;
		for (const node of data.nodes) node.type = "core:text_node";
		for (const edge of data.edges) edge.type = "core:edge";
		return data;
	}
	function convertV8toV9(data) {
		if (data.version >= 9) return data;
		data.version = 9;
		return data;
	}
	function convertV9toV10(data) {
		if (data.version >= 10) return data;
		data.version = 10;
		data.tags = [];
		return data;
	}
	function convertV10toV11(data) {
		if (data.version >= 11) return data;
		data.version = 11;
		for (const node of data.nodes) if (node.type === "core:section") {
			if (typeof node.details === "undefined") node.details = "";
		} else if (node.type === "core:connect_point") {
			if (typeof node.details === "undefined") node.details = "";
		} else if (node.type === "core:image_node") {
			if (typeof node.details === "undefined") node.details = "";
		}
		return data;
	}
	function convertV11toV12(data) {
		if (data.version >= 12) return data;
		data.version = 12;
		for (const node of data.nodes) if (node.type === "core:image_node") {
			if (typeof node.scale === "undefined") node.scale = 1 / (window.devicePixelRatio || 1);
		}
		return data;
	}
	/**
	* node -> entities
	* edge -> associations
	* @param data
	* @returns
	*/
	function convertV12toV13(data) {
		if (data.version >= 13) return data;
		data.version = 13;
		if ("nodes" in data) {
			data.entities = data.nodes;
			delete data.nodes;
		}
		if ("edges" in data) {
			for (const edge of data.edges) edge.type = "core:line_edge";
			data.associations = data.edges;
			delete data.edges;
		}
		return data;
	}
	/**
	* Edge增加了颜色字段
	* @param data
	*/
	function convertV13toV14(data) {
		if (data.version >= 14) return data;
		data.version = 14;
		for (const edge of data.associations) if (typeof edge.color === "undefined") edge.color = [
			0,
			0,
			0,
			0
		];
		return data;
	}
	/**
	* 涂鸦增加颜色字段
	* @param data
	*/
	function convertV14toV15(data) {
		if (data.version >= 15) return data;
		data.version = 15;
		for (const node of data.entities) if (node.type === "core:pen_stroke") {
			if (typeof node.color === "undefined") node.color = [
				0,
				0,
				0,
				0
			];
		}
		return data;
	}
	/**
	* 文本节点增加自动转换大小/手动转换大小功能
	* @param data
	*/
	function convertV15toV16(data) {
		if (data.version >= 16) return data;
		data.version = 16;
		for (const node of data.entities) if (node.type === "core:text_node") {
			if (typeof node.sizeAdjust === "undefined") node.sizeAdjust = "auto";
		}
		return data;
	}
	/**
	* Edge连线接头增加比率字段
	* @param data
	*/
	function convertV16toV17(data) {
		if (data.version >= 17) return data;
		data.version = 17;
		for (const edge of data.associations) if (Serialized.isEdge(edge) && edge.sourceRectRate === void 0 && edge.targetRectRate === void 0) {
			edge.sourceRectRate = [.5, .5];
			edge.targetRectRate = [.5, .5];
		}
		return data;
	}
	function upgradeNAnyToNLatest(data, metadata) {
		const currentVersion = metadata?.version || "2.0.0";
		if (compareProjectVersions(currentVersion, "2.1.0") < 0) [data, metadata] = convertN1toN2(data, metadata);
		if (compareProjectVersions(currentVersion, "2.2.0") < 0) [data, metadata] = convertN2toN3(data, metadata);
		if (compareProjectVersions(currentVersion, "2.3.0") < 0) [data, metadata] = convertN3toN4(data, metadata);
		if (compareProjectVersions(currentVersion, "2.4.0") < 0) [data, metadata] = convertN4toN5(data, metadata);
		if (compareProjectVersions(currentVersion, "2.5.0") < 0) [data, metadata] = convertN5toN6(data, metadata);
		if (compareProjectVersions(currentVersion, "2.6.0") < 0) [data, metadata] = convertN6toN7(data, metadata);
		if (compareProjectVersions(currentVersion, "2.7.0") < 0) [data, metadata] = convertN7toN8(data, metadata);
		return [data, metadata];
	}
	_ProjectUpgrader.upgradeNAnyToNLatest = upgradeNAnyToNLatest;
	/**
	* 将 2.0.0 版本升级到 2.1.0 版本
	* @param data 2.0.0版本数据
	* @param metadata 2.0.0版本metadata
	* @returns 2.1.0版本数据和metadata
	*/
	function convertN1toN2(data, metadata) {
		for (const item of data) if (item._ === "LineEdge") {
			if (!item.lineType) item.lineType = "solid";
		}
		return [data, {
			...metadata,
			version: "2.1.0"
		}];
	}
	/**
	* 将 2.1.0 版本升级到 2.2.0 版本
	* @param data 2.1.0版本数据
	* @param metadata 2.1.0版本metadata
	* @returns 2.2.0版本数据和metadata
	*/
	function convertN2toN3(data, metadata) {
		for (const item of data) if (item._ === "TextNode") {
			if (item.fontScaleLevel === void 0) item.fontScaleLevel = 0;
		}
		return [data, {
			...metadata,
			version: "2.2.0"
		}];
	}
	/**
	* 将 2.2.0 版本升级到 2.3.0 版本
	* Section 新增 _collisionBoxNormal 字段用于保存空 Section 的位置信息。
	* 旧版本没有此字段，加载时 Section 位置由子元素动态计算（有子元素时行为不变）。
	* 空 Section 在旧版本本就无位置信息，升级时不需要补充，保持兼容即可。
	* @param data 2.2.0版本数据
	* @param metadata 2.2.0版本metadata
	* @returns 2.3.0版本数据和metadata
	*/
	function convertN3toN4(data, metadata) {
		return [data, {
			...metadata,
			version: "2.3.0"
		}];
	}
	/**
	* 将 2.3.0 版本升级到 2.4.0 版本
	* 新增 ArcEdge 弧形连线类型，旧版本无法识别。
	* @param data 2.3.0版本数据
	* @param metadata 2.3.0版本metadata
	* @returns 2.4.0版本数据和metadata
	*/
	function convertN4toN5(data, metadata) {
		return [data, {
			...metadata,
			version: "2.4.0"
		}];
	}
	/**
	* 将 2.4.0 版本升级到 2.5.0 版本
	* LineEdge 和 ArcEdge 新增 arrowType 字段，默认值为 "default"。
	* @param data 2.4.0版本数据
	* @param metadata 2.4.0版本metadata
	* @returns 2.5.0版本数据和metadata
	*/
	function convertN5toN6(data, metadata) {
		for (const item of data) if (item._ === "LineEdge" || item._ === "ArcEdge") {
			if (item.arrowType === void 0) item.arrowType = "default";
		}
		return [data, {
			...metadata,
			version: "2.5.0"
		}];
	}
	/**
	* 将 2.5.0 版本升级到 2.6.0 版本
	* MultiTargetUndirectedEdge 新增 lineType 字段（默认 "solid"）和 arrowType 字段（默认 "default"）。
	* Section 新增 borderStyle 字段（默认 "solid"）。
	* @param data 2.5.0版本数据
	* @param metadata 2.5.0版本metadata
	* @returns 2.6.0版本数据和metadata
	*/
	function convertN6toN7(data, metadata) {
		for (const item of data) {
			if (item._ === "MultiTargetUndirectedEdge") {
				if (item.lineType === void 0) item.lineType = "solid";
				if (item.arrowType === void 0) item.arrowType = "default";
			}
			if (item._ === "Section") {
				if (item.borderStyle === void 0) item.borderStyle = "solid";
			}
		}
		return [data, {
			...metadata,
			version: "2.6.0"
		}];
	}
	/**
	* 将 2.6.0 版本升级到 2.7.0 版本
	* TextNode 新增 borderStyle 字段（默认 "solid"）。
	* @param data 2.6.0版本数据
	* @param metadata 2.6.0版本metadata
	* @returns 2.7.0版本数据和metadata
	*/
	function convertN7toN8(data, metadata) {
		for (const item of data) if (item._ === "TextNode") {
			if (item.borderStyle === void 0) item.borderStyle = "solid";
		}
		return [data, {
			...metadata,
			version: "2.7.0"
		}];
	}
	async function convertVAnyToN1(json, uri) {
		json = ProjectUpgrader.upgradeVAnyToVLatest(json);
		let isHaveImageNode = false;
		const uuidMap = /* @__PURE__ */ new Map();
		const resultStage = [];
		const attachments = /* @__PURE__ */ new Map();
		const basePath = new Path(uri.fsPath).parent;
		const toColor = (colorArr) => {
			if (colorArr && colorArr.length === 4 && colorArr.every((c) => typeof c === "number")) return {
				_: "Color",
				r: colorArr[0],
				g: colorArr[1],
				b: colorArr[2],
				a: colorArr[3]
			};
			else return {
				_: "Color",
				r: 0,
				g: 0,
				b: 0,
				a: 0
			};
		};
		const toVector = (vectorArr) => {
			if (vectorArr && vectorArr.length === 2 && vectorArr.every((c) => typeof c === "number")) return {
				_: "Vector",
				x: vectorArr[0],
				y: vectorArr[1]
			};
			else return {
				_: "Vector",
				x: 0,
				y: 0
			};
		};
		async function convertEntityVAnyToN1(entity, uuidMap, entities) {
			if (uuidMap.has(entity.uuid)) return uuidMap.get(entity.uuid);
			let data;
			switch (entity.type) {
				case "core:text_node":
					data = {
						_: "TextNode",
						uuid: entity.uuid,
						text: entity.text,
						details: DetailsManager.markdownToDetails(entity.details),
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						},
						color: toColor(entity.color),
						sizeAdjust: entity.sizeAdjust
					};
					break;
				case "core:section": {
					const children = [];
					if (entity.children) for (const childUUID of entity.children) {
						let childData = uuidMap.get(childUUID);
						if (!childData) {
							const childEntity = entities.find((e) => e.uuid === childUUID);
							if (childEntity) childData = await convertEntityVAnyToN1(childEntity, uuidMap, entities);
						}
						if (childData) children.push(childData);
					}
					data = {
						_: "Section",
						uuid: entity.uuid,
						text: entity.text,
						details: DetailsManager.markdownToDetails(entity.details),
						isCollapsed: entity.isCollapsed,
						isHidden: entity.isHidden,
						children,
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						},
						color: toColor(entity.color)
					};
					break;
				}
				case "core:pen_stroke": {
					const segments = [];
					const stringParts = entity.content.split("~");
					for (const part of stringParts) {
						const [x, y, pressure] = part.split(",");
						const segment = new PenStrokeSegment(new Vector(Number(x), Number(y)), Number(pressure) / 5);
						segments.push(segment);
					}
					data = {
						_: "PenStroke",
						uuid: entity.uuid,
						color: toColor(entity.color),
						segments
					};
					break;
				}
				case "core:image_node": {
					isHaveImageNode = true;
					const path = entity.path;
					const imageContent = await readFile(basePath.join(path).toString());
					const blob = new Blob([imageContent], { type: "image/png" });
					const attachmentId = crypto.randomUUID();
					attachments.set(attachmentId, blob);
					data = {
						_: "ImageNode",
						uuid: entity.uuid,
						attachmentId,
						details: DetailsManager.markdownToDetails(entity.details),
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						},
						scale: entity.scale || 1
					};
					break;
				}
				case "core:connect_point":
					data = {
						_: "ConnectPoint",
						uuid: entity.uuid,
						details: DetailsManager.markdownToDetails(entity.details),
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector([1, 1])
							}]
						}
					};
					break;
				case "core:url_node":
					data = {
						_: "UrlNode",
						uuid: entity.uuid,
						title: entity.title,
						url: entity.url,
						details: DetailsManager.markdownToDetails(entity.details),
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						},
						color: toColor(entity.color)
					};
					break;
				case "core:portal_node":
					data = {
						_: "TextNode",
						uuid: entity.uuid,
						text: entity.title,
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						}
					};
					break;
				case "core:svg_node": {
					const code = entity.content;
					const attachmentId = crypto.randomUUID();
					const blob = new Blob([code], { type: "image/svg+xml" });
					attachments.set(attachmentId, blob);
					data = {
						_: "SvgNode",
						uuid: entity.uuid,
						attachmentId,
						details: DetailsManager.markdownToDetails(entity.details),
						collisionBox: {
							_: "CollisionBox",
							shapes: [{
								_: "Rectangle",
								location: toVector(entity.location),
								size: toVector(entity.size)
							}]
						},
						scale: entity.scale || 1,
						color: toColor(entity.color)
					};
					break;
				}
				default:
					console.warn(`未知的实体类型${entity.type}`);
					break;
			}
			if (data) uuidMap.set(entity.uuid, data);
			return data;
		}
		for (const entity of json.entities) {
			const data = await convertEntityVAnyToN1(entity, uuidMap, json.entities);
			if (data) resultStage.push(data);
		}
		for (const association of json.associations) switch (association.type) {
			case "core:line_edge": {
				const fromNode = uuidMap.get(association.source);
				const toNode = uuidMap.get(association.target);
				if (!fromNode || !toNode) continue;
				resultStage.push({
					_: "LineEdge",
					uuid: association.uuid,
					associationList: [fromNode, toNode],
					text: association.text,
					color: toColor(association.color),
					sourceRectangleRate: toVector(association.sourceRectRate),
					targetRectangleRate: toVector(association.targetRectRate)
				});
				break;
			}
			case "core:cublic_catmull_rom_spline_edge": {
				const fromNode = uuidMap.get(association.source);
				const toNode = uuidMap.get(association.target);
				if (!fromNode || !toNode) continue;
				resultStage.push({
					_: "LineEdge",
					uuid: association.uuid,
					associationList: [fromNode, toNode],
					text: association.text,
					color: toColor(association.color),
					sourceRectangleRate: toVector(association.sourceRectRate),
					targetRectangleRate: toVector(association.targetRectRate)
				});
				break;
			}
			case "core:multi_target_undirected_edge": break;
			default: break;
		}
		if (isHaveImageNode) toast.warning("有图片节点，请保存当前prg文件后，再用软件重新打开此prg文件，才能正常显示图片。", { duration: 3e4 });
		return {
			data: resultStage,
			attachments
		};
	}
	_ProjectUpgrader.convertVAnyToN1 = convertVAnyToN1;
})(ProjectUpgrader || (ProjectUpgrader = {}));
//#endregion
export { mixColors as $, src_default as A, SymmetryCurve as B, homeDir as C, compareProjectVersions as D, LATEST_PROJECT_VERSION as E, Uint8ArrayReader as F, Vector as G, Circle as H, Uint8ArrayWriter as I, LimitLengthQueue as J, ProgressNumber as K, createDefaultMetadata as L, ZipReader as M, BlobReader as N, parseProjectFile as O, BlobWriter as P, colorInvert as Q, toast as R, dirname as S, tempDir as T, Rectangle as U, CubicCatmullRomSpline as V, Line as W, Color as X, Queue as Y, averageColors as Z, Path as _, Entity as a, passObject as at, appLocalDataDir as b, exists as c, LruCache as ct, readDir as d, SERIALIZE_TO_IPC_FN as dt, __decorate as et, readFile as f, invoke as ft, writeFile as g, stat as h, CollisionBox as i, passExtraAtArg1 as it, ZipWriter as j, URI as k, lstat as l, MaxSizeCache as lt, rename as m, transformCallback as mt, PenStroke as n, deserialize as nt, StageObject as o, serializable as ot, remove as p, isTauri as pt, MonoStack as q, PenStrokeSegment as r, id as rt, v4 as s, serialize as st, ProjectUpgrader as t, __decorateMetadata as tt, mkdir as u, Resource as ut, appCacheDir as v, join as w, dataDir as x, appDataDir as y, CubicBezierCurve as z };
