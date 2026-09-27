globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
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
	"/assets/analysis-DSr2Cvif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"40fa-9MpknBU5jrO1dO15S8mY3Jg83I0\"",
		"mtime": "2026-09-27T10:58:14.803Z",
		"size": 16634,
		"path": "../public/assets/analysis-DSr2Cvif.js"
	},
	"/assets/app-shell-DEJvwTr7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3ebe-gMYLFeoW2W2gcC06C7J4LSEgTGk\"",
		"mtime": "2026-09-27T10:58:14.804Z",
		"size": 16062,
		"path": "../public/assets/app-shell-DEJvwTr7.js"
	},
	"/assets/LineChart-B2jDXDkR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6043a-qDyfGijOMiT38dQ3X3w5K9Md6+g\"",
		"mtime": "2026-09-27T10:58:14.803Z",
		"size": 394298,
		"path": "../public/assets/LineChart-B2jDXDkR.js"
	},
	"/assets/aurora-background-B0LYNixu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-+D2wrpZNMQSrXHwuL/IGUXh5Lh4\"",
		"mtime": "2026-09-27T10:58:14.804Z",
		"size": 2086,
		"path": "../public/assets/aurora-background-B0LYNixu.js"
	},
	"/assets/auth-DlEmdOHk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"314c-p/CHcYiOIpz7utxd7nLfptLm7/Y\"",
		"mtime": "2026-09-27T10:58:14.804Z",
		"size": 12620,
		"path": "../public/assets/auth-DlEmdOHk.js"
	},
	"/assets/brain-CAFit6o5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"242-mMYpYmPIlnIwxCIfexad9iAXDRw\"",
		"mtime": "2026-09-27T10:58:14.804Z",
		"size": 578,
		"path": "../public/assets/brain-CAFit6o5.js"
	},
	"/assets/chat-CWp9eEHx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"349d-LwYF3ScVwB9vYXcqHbSV7SDLQ3U\"",
		"mtime": "2026-09-27T10:58:14.804Z",
		"size": 13469,
		"path": "../public/assets/chat-CWp9eEHx.js"
	},
	"/assets/dashboard-1WYSi1QU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b61-+PuquQdvPOPAf0tknidIAsHUH4o\"",
		"mtime": "2026-09-27T10:58:14.805Z",
		"size": 23393,
		"path": "../public/assets/dashboard-1WYSi1QU.js"
	},
	"/assets/documents-BRxpgGIl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1572f-VoYbUspAPwgQtpt/VV0r6Rywc4s\"",
		"mtime": "2026-09-27T10:58:14.805Z",
		"size": 87855,
		"path": "../public/assets/documents-BRxpgGIl.js"
	},
	"/assets/fa-DHN_REm8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e7-3ntGc+VXykwzHtjhNmEDyqD24I8\"",
		"mtime": "2026-09-27T10:58:14.805Z",
		"size": 999,
		"path": "../public/assets/fa-DHN_REm8.js"
	},
	"/assets/finance-BaoV1JAY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2dd-BzBmLRWTv8fbNoS2QKeIifqAev4\"",
		"mtime": "2026-09-27T10:58:14.806Z",
		"size": 733,
		"path": "../public/assets/finance-BaoV1JAY.js"
	},
	"/assets/iconBase-BExxeub5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ac-uQ8RgY+ykhKX6Gscg9llow1Oy3U\"",
		"mtime": "2026-09-27T10:58:14.806Z",
		"size": 2476,
		"path": "../public/assets/iconBase-BExxeub5.js"
	},
	"/assets/loader-circle-DjlblENv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91-LPA9FLumhtTbaKDPUnc4r0ciXmo\"",
		"mtime": "2026-09-27T10:58:14.807Z",
		"size": 145,
		"path": "../public/assets/loader-circle-DjlblENv.js"
	},
	"/assets/logo-BMTWufte.jpg": {
		"type": "image/jpeg",
		"etag": "\"d75b-DzXU96HRzWVw+5ouZaOoTSEFEI8\"",
		"mtime": "2026-09-27T10:58:14.818Z",
		"size": 55131,
		"path": "../public/assets/logo-BMTWufte.jpg"
	},
	"/assets/prop-types-BbALVsmo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"328-PAKlDQRCn03dFFLx9qVF7SQes4c\"",
		"mtime": "2026-09-27T10:58:14.811Z",
		"size": 808,
		"path": "../public/assets/prop-types-BbALVsmo.js"
	},
	"/assets/recommendations-Bz6L_F1l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c9-fK5s3Uht9DWeOfq3QlQngB2mygg\"",
		"mtime": "2026-09-27T10:58:14.812Z",
		"size": 4553,
		"path": "../public/assets/recommendations-Bz6L_F1l.js"
	},
	"/assets/reports-vyNiQvTi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11b8-KtZGwi/w1NByuNgLmvWGynFXEHc\"",
		"mtime": "2026-09-27T10:58:14.813Z",
		"size": 4536,
		"path": "../public/assets/reports-vyNiQvTi.js"
	},
	"/assets/reset-password-BN9pIIaU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6e-0oNxAlhqd9e0boy5B8V0ZOXLUA0\"",
		"mtime": "2026-09-27T10:58:14.813Z",
		"size": 2926,
		"path": "../public/assets/reset-password-BN9pIIaU.js"
	},
	"/assets/route-DApEFSs7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-vKvWEzgHIXS8R+ZVM9IK3zo0s0s\"",
		"mtime": "2026-09-27T10:58:14.813Z",
		"size": 139,
		"path": "../public/assets/route-DApEFSs7.js"
	},
	"/assets/routes-BLA8sk9K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1573-eVculY0JcD1kHtGDai9TVOCblrg\"",
		"mtime": "2026-09-27T10:58:14.814Z",
		"size": 5491,
		"path": "../public/assets/routes-BLA8sk9K.js"
	},
	"/assets/send-azF4bx-L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-oASaIdab6qDxLWuV5UdaM1RPjg8\"",
		"mtime": "2026-09-27T10:58:14.815Z",
		"size": 291,
		"path": "../public/assets/send-azF4bx-L.js"
	},
	"/assets/settings-DH8uXvxl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"143d-eUTZQZIYqcuv9Sef5Sk/vrNwZXA\"",
		"mtime": "2026-09-27T10:58:14.816Z",
		"size": 5181,
		"path": "../public/assets/settings-DH8uXvxl.js"
	},
	"/assets/sparkles-BfN6Ld5I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35f-rsD+U3okf9mHwT/GLxwH3Jd7gXw\"",
		"mtime": "2026-09-27T10:58:14.816Z",
		"size": 863,
		"path": "../public/assets/sparkles-BfN6Ld5I.js"
	},
	"/assets/styles-DIP6yM2s.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18a41-XQR9rzy47lslVucIkK6y81BKX0w\"",
		"mtime": "2026-09-27T10:58:14.818Z",
		"size": 100929,
		"path": "../public/assets/styles-DIP6yM2s.css"
	},
	"/assets/index-CgpfvaYn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ea8c-ARjf8Hl5rc4zjXFnkP6wE9byzxI\"",
		"mtime": "2026-09-27T10:58:14.802Z",
		"size": 584332,
		"path": "../public/assets/index-CgpfvaYn.js"
	},
	"/assets/trash-2-NVkVGz7a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"149-YIT3v0J8wubxWoWgvLJHWTli+Ok\"",
		"mtime": "2026-09-27T10:58:14.817Z",
		"size": 329,
		"path": "../public/assets/trash-2-NVkVGz7a.js"
	},
	"/assets/upload-CYiordlP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e7-g4J934M53QcQXKvOK+ZHkcHC5VQ\"",
		"mtime": "2026-09-27T10:58:14.817Z",
		"size": 231,
		"path": "../public/assets/upload-CYiordlP.js"
	},
	"/assets/useRouter-B64lGpJS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21c3-zzmYM01eKBeLDXNG1KZYTLnsRQs\"",
		"mtime": "2026-09-27T10:58:14.817Z",
		"size": 8643,
		"path": "../public/assets/useRouter-B64lGpJS.js"
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
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
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
