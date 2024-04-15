import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import packageJson from "./package.json";
import { cyclicHmr, generateAppJson, svgString } from "./plugins";

const pwa = VitePWA({
	registerType: "autoUpdate",
	injectRegister: "auto",
	devOptions: {
		enabled: true,
	},
	workbox: {
		clientsClaim: true,
		skipWaiting: true,
		cleanupOutdatedCaches: true,
		globPatterns: ["**/*.{js,css,ico,png,svg}"],
		navigateFallback: null,
	},
});

export default defineConfig({
	plugins: [solidPlugin(), svgString, pwa, generateAppJson, cyclicHmr],
	build: {
		target: "es6",
		rollupOptions: {
			output: {
				manualChunks: {
					"discord-embedded-app-sdk": ["@discord/embedded-app-sdk"],
				},
			},
		},
	},
	define: {
		"import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
	},
	server: {
		host: true,
		port: 3000,
	},
	resolve: {
		alias: {
			"@root": path.resolve("./src/apps/root"),
			"@app": path.resolve("./src/apps/app"),
			"@desktop-overlay": path.resolve("./src/apps/desktop-overlay"),
			"@recap": path.resolve("./src/apps/recap"),
			"@login": path.resolve("./src/apps/login"),
			"@auth": path.resolve("./src/libs/auth"),
			"@common": path.resolve("./src/libs/common"),
			"@desktop": path.resolve("./src/libs/desktop"),
			"@playlist": path.resolve("./src/libs/playlist"),
			"@youtube": path.resolve("./src/libs/youtube"),
			"@queue": path.resolve("./src/libs/queue"),
			"@user": path.resolve("./src/libs/user"),
			"@settings": path.resolve("./src/libs/settings"),
			"@constants": path.resolve("./src/constants"),
			"@media-source": path.resolve("./src/libs/media-source"),
			"@spotify": path.resolve("./src/libs/spotify"),
			"@discord/embedded-app-sdk": "@discord/embedded-app-sdk",
			"@discord": path.resolve("./src/libs/discord"),
		},
	},
});
