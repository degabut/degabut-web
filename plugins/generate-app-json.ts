import { writeFile } from "fs/promises";
import type { Plugin } from "vite";
import packageJson from "../package.json";

export const generateAppJson: Plugin = {
	name: "generate-app-json",
	async buildStart() {
		const { name, version } = packageJson;
		await writeFile("./public/app.json", JSON.stringify({ name, version }));
	},
};
