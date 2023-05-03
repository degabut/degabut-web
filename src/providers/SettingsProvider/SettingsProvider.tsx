import throttle from "lodash/throttle";
import { createContext, ParentComponent } from "solid-js";
import { createStore, StoreSetter } from "solid-js/store";

type Settings = {
	notification: boolean;
	discordRpc: boolean;
	appDrawerSize: number;
	memberDrawerSize: number;
	overlay: boolean;
	overlayShortcut: string[];
};

const defaultSettings: Settings = {
	notification: false,
	discordRpc: true,
	appDrawerSize: 256,
	memberDrawerSize: 256,
	overlay: true,
	overlayShortcut: ["Control", "Shift", "B"],
};

export type SettingsContextStore = {
	settings: Settings;
	setSettings: (store: StoreSetter<Settings>) => void;
};

export const SettingsContext = createContext<SettingsContextStore>({
	settings: defaultSettings,
	setSettings: () => {},
});

export const SettingsProvider: ParentComponent = (props) => {
	const [settings, setSettings] = createStore<Settings>(defaultSettings);

	const setAndSaveSettings = (...v: Parameters<typeof setSettings>) => {
		setSettings(...v);
		throttledSaveSettings();
	};

	const throttledSaveSettings = throttle(() => localStorage.setItem("settings", JSON.stringify(settings)), 500);

	try {
		const storedSettings = localStorage.getItem("settings");
		if (storedSettings) setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
		else setSettings(defaultSettings);
	} catch {
		setSettings(defaultSettings);
	}

	return (
		<SettingsContext.Provider value={{ settings, setSettings: setAndSaveSettings }}>
			{props.children}
		</SettingsContext.Provider>
	);
};
