import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {

	const env = loadEnv(mode, process.cwd(), '');
	const BASE_URL = env.VITE_BASE_URL ?? (mode == 'production' ? '/vault-game/' : '/');

	return {
		base: BASE_URL,
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
	}
});
