import throttle from "lodash/throttle";
import { createContext, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type Settings = {
	queue: {
		showThumbnail: boolean;
	};
	notification: {
		browser: boolean;
		inApp: boolean;
	};
	discordRpc: boolean;
	appDrawerSize: number;
	overlay: boolean;
	overlayShortcut: string[];
};

const defaultSettings: Settings = {
	queue: {
		showThumbnail: true,
	},
	notification: {
		browser: false,
		inApp: true,
	},
	discordRpc: true,
	appDrawerSize: 256,
	overlay: true,
	overlayShortcut: ["Control", "Shift", "B"],
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

	const setAndSaveSettings = (...v: any) => {
		setSettings(...(v as Parameters<typeof setSettings>));
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
