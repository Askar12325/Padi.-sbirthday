import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin as EsbuildPlugin } from "esbuild";

const HLS_STUB_CONTENT = `
export const Events = {};
export const ErrorTypes = {};
export const ErrorDetails = {};
export const DefaultConfig = {};
export default null;
`;

/** Intercepts hls.js at the esbuild (dep pre-bundle) level */
const esbuildHlsStub: EsbuildPlugin = {
  name: "hls-stub",
  setup(build) {
    build.onResolve({ filter: /^hls\.js$/ }, () => ({
      path: "hls-stub",
      namespace: "hls-stub-ns",
    }));
    build.onLoad({ filter: /.*/, namespace: "hls-stub-ns" }, () => ({
      contents: HLS_STUB_CONTENT,
      loader: "js",
    }));
  },
};

/** Intercepts hls.js at the Rollup level (production build) */
function hlsRollupPlugin(): Plugin {
  const STUB_ID = "\0hls-stub";
  return {
    name: "hls-rollup-stub",
    enforce: "pre",
    resolveId(id: string) {
      if (id === "hls.js") return STUB_ID;
      return undefined;
    },
    load(id: string) {
      if (id === STUB_ID) return HLS_STUB_CONTENT;
      return undefined;
    },
  };
}

export default defineConfig({
  plugins: [hlsRollupPlugin(), react(), tailwindcss()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildHlsStub],
    },
  },
});
