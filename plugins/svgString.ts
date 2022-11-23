import { promises as fs } from "fs";
import { extname } from "path";
import { Plugin } from "vite";

// https://github.com/cobbcheng/vite-plugin-svgstring

const svgString = (): Plugin => {
	return {
		enforce: "pre",
		name: "svg-string",
		async load(id: string) {
			const path = id.split("?")[0];
			if (!extname(path).startsWith(".svg")) {
				return null;
			}
			const svg = await fs.readFile(path, "utf-8");
			return "export default " + "`" + svg + "`";
		},
	};
};

export default svgString;
