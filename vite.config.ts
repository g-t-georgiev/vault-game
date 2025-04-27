import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV == 'production' ? '/vault-game/' : '/',
  build: {
    target: "esnext",
    rollupOptions: {
      external: /\.skel$/,
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    host: true,
    port: 8080,
  },
});
