import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import svgString from "./plugins/svgString";

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
	plugins: [solidPlugin(), svgString(), pwa],
	build: {
		target: "esnext",
	},
	server: {
		host: true,
		port: 3000,
	},
	resolve: {
		alias: {
			"@api": path.resolve("./src/api"),
			"@directives": path.resolve("./src/directives"),
			"@hooks": path.resolve("./src/hooks"),
			"@providers": path.resolve("./src/providers"),
			"@components": path.resolve("./src/components"),
			"@stores": path.resolve("./src/stores"),
			"@views": path.resolve("./src/views"),
			"@utils": path.resolve("./src/utils"),
			"@runtime": path.resolve("./src/wailsjs/runtime/runtime"),
			"@go": path.resolve("./src/wailsjs/go"),
			"@constants": path.resolve("./src/constants"),
		},
	},
	optimizeDeps: {
		extensions: ["jsx"],
	},
});
