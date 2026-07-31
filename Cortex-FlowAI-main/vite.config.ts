import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// De-Lovable'd vite config.
// This replaces @lovable.dev/vite-tanstack-config with the plain equivalents
// it used to wire up automatically: Tailwind v4, TanStack Start (SSR entry at
// src/server.ts), tsconfig path aliases, and the React plugin. Lovable's
// sandbox-only plugins (component tagger, HMR gate, dev-server bridge, error
// overlays) are intentionally dropped since they only apply inside the
// Lovable editor and do nothing for a normal local/deployed app.
export default defineConfig({
  css: {
    // Match build & dev CSS pipelines (both use Lightning CSS).
    transformer: "lightningcss",
  },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts
      // (our SSR error wrapper).
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    viteReact(),
    // Lets Vercel (and other hosts) build/serve this app. Vercel auto-detects
    // TanStack Start + Nitro and picks the right preset — no extra config
    // needed for a standard Vercel deployment.
    nitro(),
  ],
});
