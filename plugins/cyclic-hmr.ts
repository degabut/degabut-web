import { type Plugin } from "vite";

export const cyclicHmr: Plugin = {
	name: "cyclic-hmr",
	handleHotUpdate({ modules }) {
		modules.map((m) => {
			m.clientImportedModules = new Set();
			m.importers = new Set();
		});

		return modules;
	},
};
