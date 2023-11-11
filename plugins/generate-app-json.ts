import { writeFile } from "fs/promises";
import { Plugin } from "vite";
import packageJson from "../package.json";

export const generateAppJson: Plugin = {
	name: "replace-version",
	async buildStart() {
		const { name, version } = packageJson;
		await writeFile("./public/app.json", JSON.stringify({ name, version }));
	},
};
