import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {

	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: env.VITE_BASE_URL == 'production' ? '/vault-game/' : '/',
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
