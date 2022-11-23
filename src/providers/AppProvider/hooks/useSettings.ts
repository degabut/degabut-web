import { createSignal, onMount } from "solid-js";

export type Settings = {
	notification: boolean;
	discordRpc: boolean;
};

export const defaultSettings: Settings = {
	notification: true,
	discordRpc: true,
};

export const useSettings = () => {
	const [settings, _setSettings] = createSignal<Settings>(defaultSettings);

	onMount(() => {
		const settings = localStorage.getItem("settings");
		if (settings) _setSettings(JSON.parse(settings));
		else _setSettings(defaultSettings);
	});

	const setSettings = (settings: Partial<Settings>) => {
		_setSettings((d) => ({ ...d, ...settings }));
		localStorage.setItem("settings", JSON.stringify(settings));
	};

	return {
		settings,
		setSettings,
	};
};
