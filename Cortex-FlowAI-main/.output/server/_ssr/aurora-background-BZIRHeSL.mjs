import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aurora-background-BZIRHeSL.js
var import_jsx_runtime = require_jsx_runtime();
var logo_default = "/assets/logo-BMTWufte.jpg";
function Brand({ size = "md", showText = true }) {
	const dim = size === "sm" ? 32 : size === "lg" ? 56 : 44;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo_default,
			alt: "Cortex Flow",
			className: "shrink-0 rounded-lg object-contain",
			style: {
				width: dim,
				height: dim
			}
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-display font-bold tracking-tight ${size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg"}`,
			children: "Cortex Flow"
		})]
	});
}
function AuroraBackground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "orb orb-violet",
				style: {
					width: 520,
					height: 520,
					top: "-10%",
					left: "-10%"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "orb orb-cyan",
				style: {
					width: 460,
					height: 460,
					bottom: "-15%",
					right: "-10%"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "orb orb-rose",
				style: {
					width: 360,
					height: 360,
					top: "40%",
					right: "30%",
					opacity: .25
				}
			})
		]
	});
}
//#endregion
export { Brand as n, AuroraBackground as t };
