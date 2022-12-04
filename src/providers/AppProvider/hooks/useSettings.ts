import { createSignal } from "solid-js";

export type Settings = {
	notification: boolean;
	discordRpc: boolean;
	appDrawerSize: number;
};

export const defaultSettings: Settings = {
	notification: true,
	discordRpc: true,
	appDrawerSize: 256,
};

export const useSettings = () => {
	const [settings, _setSettings] = createSignal<Settings>(defaultSettings);

	const storedSettings = localStorage.getItem("settings");
	if (storedSettings) _setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
	else _setSettings(defaultSettings);

	const setSettings = (partialSettings: Partial<Settings>) => {
		_setSettings((s) => ({ ...s, ...partialSettings }));
		localStorage.setItem("settings", JSON.stringify(settings()));
	};

	return {
		settings,
		setSettings,
	};
};
