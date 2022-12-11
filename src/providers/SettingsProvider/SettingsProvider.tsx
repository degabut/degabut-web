/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, createEffect, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type Settings = {
	notification: boolean;
	discordRpc: boolean;
	appDrawerSize: number;
	memberDrawerSize: number;
};

const defaultSettings: Settings = {
	notification: true,
	discordRpc: true,
	appDrawerSize: 256,
	memberDrawerSize: 256,
};

export type SettingsContextStore = {
	settings: Settings;
	setSettings: SetStoreFunction<Settings>;
};

export const SettingsContext = createContext<SettingsContextStore>({
	settings: defaultSettings,
	setSettings: () => {},
});

export const SettingsProvider: ParentComponent = (props) => {
	const [settings, setSettings] = createStore<Settings>(defaultSettings);

	const storedSettings = localStorage.getItem("settings");
	if (storedSettings) setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
	else setSettings(defaultSettings);

	createEffect(() => {
		localStorage.setItem("settings", JSON.stringify(settings));
	});

	return <SettingsContext.Provider value={{ settings, setSettings }}>{props.children}</SettingsContext.Provider>;
};
