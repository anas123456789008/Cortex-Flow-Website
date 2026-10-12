globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/LineChart-Bph_vhw4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60f86-6+6mtJS5llDGfmleYTijURGJ5K4\"",
		"mtime": "2026-10-12T15:22:02.850Z",
		"size": 397190,
		"path": "../public/assets/LineChart-Bph_vhw4.js"
	},
	"/assets/analysis-BPmnenfn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4118-InYbCRQUWgy/MAG4kBJVnnimOAk\"",
		"mtime": "2026-10-12T15:22:02.850Z",
		"size": 16664,
		"path": "../public/assets/analysis-BPmnenfn.js"
	},
	"/assets/app-shell-d3rUyuNu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b81-WjaHPIsF0RGq/R7ofE5O9mNuX0Y\"",
		"mtime": "2026-10-12T15:22:02.851Z",
		"size": 15233,
		"path": "../public/assets/app-shell-d3rUyuNu.js"
	},
	"/assets/aurora-background-DXz6U91N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-OSrGcNv1OM7lpFmJgmy00JllLQo\"",
		"mtime": "2026-10-12T15:22:02.851Z",
		"size": 2086,
		"path": "../public/assets/aurora-background-DXz6U91N.js"
	},
	"/assets/auth-CsazESVm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cd98-Xf1N3VMBaLDL0+X/cOXOQPgcz6k\"",
		"mtime": "2026-10-12T15:22:02.851Z",
		"size": 52632,
		"path": "../public/assets/auth-CsazESVm.js"
	},
	"/assets/brain-DLZQVTHN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"242-DEt6NM8+dmfBLkWoOGtomMwg9R4\"",
		"mtime": "2026-10-12T15:22:02.852Z",
		"size": 578,
		"path": "../public/assets/brain-DLZQVTHN.js"
	},
	"/assets/chat-xCkbEMll.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36f6-WUVnzkTnF4i7c7GCnKvF1dori/Q\"",
		"mtime": "2026-10-12T15:22:02.852Z",
		"size": 14070,
		"path": "../public/assets/chat-xCkbEMll.js"
	},
	"/assets/clsx-CjueKrWZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"170-hIN6XMVOMUzluNGmYPaM/SbauwQ\"",
		"mtime": "2026-10-12T15:22:02.852Z",
		"size": 368,
		"path": "../public/assets/clsx-CjueKrWZ.js"
	},
	"/assets/dashboard-Dkau4s8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b95-7qy6PjKma1nUkM6Bfi+n8ErWqCk\"",
		"mtime": "2026-10-12T15:22:02.853Z",
		"size": 23445,
		"path": "../public/assets/dashboard-Dkau4s8J.js"
	},
	"/assets/documents-D3dOqRbd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154c5-3BZz4sw3o7NbUgGA07/hp/K3qX8\"",
		"mtime": "2026-10-12T15:22:02.853Z",
		"size": 87237,
		"path": "../public/assets/documents-D3dOqRbd.js"
	},
	"/assets/fa-CC2Fhm0W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e7-NLaC05VgW4AUSEWsEUG81/xYG+0\"",
		"mtime": "2026-10-12T15:22:02.853Z",
		"size": 999,
		"path": "../public/assets/fa-CC2Fhm0W.js"
	},
	"/assets/finance-BytQQGiR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2dd-ilC0Bj0FQyBf3DTGQhUq4cWPL5I\"",
		"mtime": "2026-10-12T15:22:02.854Z",
		"size": 733,
		"path": "../public/assets/finance-BytQQGiR.js"
	},
	"/assets/iconBase-B0NfLqgy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9af-lZEmyjCYSWGCvy2ixrLKELKShG0\"",
		"mtime": "2026-10-12T15:22:02.854Z",
		"size": 2479,
		"path": "../public/assets/iconBase-B0NfLqgy.js"
	},
	"/assets/loader-circle-VwB8uHe2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91-2ST2PXAEFQsaqvAil4PfVfeoU44\"",
		"mtime": "2026-10-12T15:22:02.854Z",
		"size": 145,
		"path": "../public/assets/loader-circle-VwB8uHe2.js"
	},
	"/assets/logo-BMTWufte.jpg": {
		"type": "image/jpeg",
		"etag": "\"d75b-DzXU96HRzWVw+5ouZaOoTSEFEI8\"",
		"mtime": "2026-10-12T15:22:02.858Z",
		"size": 55131,
		"path": "../public/assets/logo-BMTWufte.jpg"
	},
	"/assets/prop-types-Bs_MEp11.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"328-CbvyPayRRs5PKI2F5lpYBs9eSLE\"",
		"mtime": "2026-10-12T15:22:02.854Z",
		"size": 808,
		"path": "../public/assets/prop-types-Bs_MEp11.js"
	},
	"/assets/recommendations-vtW4BFeH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c9-yT8pRvNT0EOsR60LRRMMAyB+rco\"",
		"mtime": "2026-10-12T15:22:02.855Z",
		"size": 4553,
		"path": "../public/assets/recommendations-vtW4BFeH.js"
	},
	"/assets/reports-Ccluh1tD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11b8-KgCU+RHZjA7/M9VZ97ileoHZe2c\"",
		"mtime": "2026-10-12T15:22:02.855Z",
		"size": 4536,
		"path": "../public/assets/reports-Ccluh1tD.js"
	},
	"/assets/reset-password-DcyRlxhS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6e-fmLIEbIfwzPj9dLY4HDEmuG2Uvk\"",
		"mtime": "2026-10-12T15:22:02.855Z",
		"size": 2926,
		"path": "../public/assets/reset-password-DcyRlxhS.js"
	},
	"/assets/route-CWwCnEnu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-oZMF6d30n94NVXsX1HcSQ7ul5iI\"",
		"mtime": "2026-10-12T15:22:02.855Z",
		"size": 139,
		"path": "../public/assets/route-CWwCnEnu.js"
	},
	"/assets/routes-DER7vj9W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1573-LvMGIdBv4cxz+rGZHTs+YXZ1Rhs\"",
		"mtime": "2026-10-12T15:22:02.856Z",
		"size": 5491,
		"path": "../public/assets/routes-DER7vj9W.js"
	},
	"/assets/send-BkLKlfCI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-gyIm431M/+Vp5TGEu/RD6HUg6Ng\"",
		"mtime": "2026-10-12T15:22:02.856Z",
		"size": 291,
		"path": "../public/assets/send-BkLKlfCI.js"
	},
	"/assets/settings-De52HhzD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143d-A3+dy2nlCY4kOzLsHsVVIsydOUo\"",
		"mtime": "2026-10-12T15:22:02.856Z",
		"size": 5181,
		"path": "../public/assets/settings-De52HhzD.js"
	},
	"/assets/sparkles-D8SA2JVx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35f-rACdAb6Y+cpHBWTu7oKzL74FSsc\"",
		"mtime": "2026-10-12T15:22:02.857Z",
		"size": 863,
		"path": "../public/assets/sparkles-D8SA2JVx.js"
	},
	"/assets/index-B9bT3W2U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95de4-k/dMWzItlNgn757l2x+tfF4qutA\"",
		"mtime": "2026-10-12T15:22:02.849Z",
		"size": 613860,
		"path": "../public/assets/index-B9bT3W2U.js"
	},
	"/assets/styles-JXvX0j8S.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18028-fRzlQOuvl++0xnfzcygBx7pPdcc\"",
		"mtime": "2026-10-12T15:22:02.859Z",
		"size": 98344,
		"path": "../public/assets/styles-JXvX0j8S.css"
	},
	"/assets/trash-2-TtBE8tkp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"149-CFdDN7ytbgeiKZDq4cdWKdvmoag\"",
		"mtime": "2026-10-12T15:22:02.857Z",
		"size": 329,
		"path": "../public/assets/trash-2-TtBE8tkp.js"
	},
	"/assets/upload-CuUBfBNU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e7-cS2zh0mROWcXN88Er+MmyiF0HAA\"",
		"mtime": "2026-10-12T15:22:02.858Z",
		"size": 231,
		"path": "../public/assets/upload-CuUBfBNU.js"
	},
	"/assets/useRouter-BvlQtcpd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2305-Sz8fQMoE7s4Diu+sfXNz6HGiCbo\"",
		"mtime": "2026-10-12T15:22:02.858Z",
		"size": 8965,
		"path": "../public/assets/useRouter-BvlQtcpd.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_nPdh3e = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_nPdh3e
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
