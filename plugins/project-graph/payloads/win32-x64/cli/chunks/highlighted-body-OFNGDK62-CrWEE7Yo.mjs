import { i as __toESM } from "./chunk-2rV9d50f.mjs";
import { n as require_react } from "./react-dom-I8_g7zx2.mjs";
import { r as require_jsx_runtime } from "./bundle-mjs-CFgt2SnT.mjs";
import { i as R$1, n as Li, t as At } from "./chunk-BO2N2NFS-DgXbpqxe.mjs";
//#region ../node_modules/.pnpm/streamdown@2.5.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/streamdown/dist/highlighted-body-OFNGDK62.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var R = ({ code: s, language: e, raw: t, className: h, startLine: d, lineNumbers: m, ...p }) => {
	let { shikiTheme: l } = (0, import_react.useContext)(R$1), o = Li(), [a, i] = (0, import_react.useState)(t);
	return (0, import_react.useEffect)(() => {
		if (!o) {
			i(t);
			return;
		}
		let r = o.highlight({
			code: s,
			language: e,
			themes: l
		}, (c) => {
			i(c);
		});
		r && i(r);
	}, [
		s,
		e,
		l,
		o,
		t
	]), (0, import_jsx_runtime.jsx)(At, {
		className: h,
		language: e,
		lineNumbers: m,
		result: a,
		startLine: d,
		...p
	});
};
//#endregion
export { R as HighlightedCodeBlockBody };
