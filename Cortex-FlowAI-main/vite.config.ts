// Plain Vite + TanStack Start config (no Lovable platform dependency).
// This replaces @lovable.dev/vite-tanstack-config with the equivalent
// stack it was wrapping: TanStack Start, React, Tailwind v4, tsconfig
// path aliases, and Nitro (the piece that turns the build into an
// actual deployable server — without it, `vite build` only produces a
// raw JS bundle with no server for a host like Vercel to run, which is
// why the first Vercel deploy 404'd on every route).
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    // Nitro auto-detects the right output for wherever it's building:
    // a Vercel serverless function when VERCEL=1 is set (i.e. on Vercel),
    // or a plain Node server at .output/server/index.mjs when built locally.
    nitro(),
    viteReact(),
  ],
});
