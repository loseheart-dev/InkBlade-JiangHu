import { defineConfig } from "vite";

const pagesBase = "/InkBlade-JiangHu/";

export default defineConfig({
  plugins: [{
    name: "pages-runtime-assets",
    enforce: "pre",
    apply: (_, { command, mode }) => command === "build" && mode === "pages",
    config: () => ({ base: pagesBase }),
    transform(source, id) {
      if (!id.includes("/src/") || !id.endsWith(".ts") || id.includes("/node_modules/")) return;
      // shortcut: only quoted /assets/ URLs in TypeScript; use a URL helper if paths become computed.
      return source.replace(/(["'`])\/assets\//g, `$1${pagesBase}assets/`);
    }
  }],
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  },
  build: {
    // Phaser remains isolated behind the lazy runtime import; the explicit budget keeps build warnings actionable.
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      input: {
        main: "index.html",
        teach: "teach.html"
      }
    },
    // Keep CSS minification on the safe path for this Codex runtime; lightningcss native loading is not usable here.
    cssMinify: false
  }
});
