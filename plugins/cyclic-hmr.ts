import { type Plugin } from "vite";

export const cyclicHmr: Plugin = {
	name: "cyclic-hmr",
	hotUpdate({ modules }) {
		modules.map((m) => {
			m.importedModules = new Set();
			m.importers = new Set();
		});

		return modules;
	},
};
