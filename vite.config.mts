import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import { svgString } from "./plugins";

const pwa = VitePWA({
	registerType: "autoUpdate",
	injectRegister: "auto",
	devOptions: {
		enabled: true,
	},
	workbox: {
		clientsClaim: true,
		skipWaiting: true,
		globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
	},
});

export default defineConfig({
	plugins: [solidPlugin(), svgString, pwa],
	build: {
		target: "es6",
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
			"@auth": path.resolve("./src/libs/auth"),
			"@common": path.resolve("./src/libs/common"),
			"@desktop": path.resolve("./src/libs/desktop"),
			"@playlist": path.resolve("./src/libs/playlist"),
			"@youtube": path.resolve("./src/libs/youtube"),
			"@queue": path.resolve("./src/libs/queue"),
			"@user": path.resolve("./src/libs/user"),
			"@settings": path.resolve("./src/libs/settings"),
			"@constants": path.resolve("./src/constants"),
		},
	},
	optimizeDeps: {
		extensions: ["jsx"],
	},
});
