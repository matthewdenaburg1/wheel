/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

const env = process.env.NODE_ENV || "main";

export default defineConfig({
  root: "./src",
  base: "/wheel",

  build: {
    outDir: `../public/${env}`,
    target: "es6",
    cssMinify: false,
    sourcemap: false,
    emptyOutDir: true
  },

  css: {
    devSourcemap: false
  },

  server: {
    open: true
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.tsx"]
  }
});
