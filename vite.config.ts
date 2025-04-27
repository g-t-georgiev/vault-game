import { defineConfig } from "vite";

export default defineConfig({
  base: '/vault-gam/',
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
