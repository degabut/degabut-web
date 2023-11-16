/* eslint-disable @typescript-eslint/no-explicit-any */
import { DelayUtil } from "@common/utils";
import { ObjectUtil } from "@common/utils/object.util";
import { useDesktop } from "@desktop/hooks";
import { ParentComponent, createContext } from "solid-js";
import { createStore } from "solid-js/store";

export type Settings = {
	["botIndex"]: number;
	["queue.showThumbnail"]: boolean;
	["notification.browser"]: boolean;
	["notification.inApp"]: boolean;
	["discord.richPresence"]: boolean;
	["discord.rpc"]: boolean;
	["discord.rpcClientId"]: string;
	["discord.rpcClientSecret"]: string;
	["app.drawerSize"]: number;
	["overlay.enabled"]: boolean;
	["overlay.shortcut"]: string[];
};

const defaultSettings: Settings = {
	["botIndex"]: 0,
	["queue.showThumbnail"]: true,
	["notification.browser"]: false,
	["notification.inApp"]: true,
	["discord.richPresence"]: true,
	["discord.rpc"]: false,
	["discord.rpcClientId"]: "",
	["discord.rpcClientSecret"]: "",
	["app.drawerSize"]: 256,
	["overlay.enabled"]: true,
	["overlay.shortcut"]: ["Control", "Shift", "B"],
};

export type SettingsContextStore = {
	settings: Settings;
	setSettings: <K extends keyof Settings>(key: K, value: Settings[K] | ((v: Settings[K]) => Settings[K])) => void;
};

export const SettingsContext = createContext<SettingsContextStore>({
	settings: defaultSettings,
	setSettings: () => {},
});

export const SettingsProvider: ParentComponent = (props) => {
	const desktop = useDesktop();

	let initialSettings = defaultSettings;
	try {
		const storedSettings = localStorage.getItem("settings");
		if (storedSettings) {
			const storedSettingsParsed = JSON.parse(storedSettings);
			initialSettings = ObjectUtil.mergeObjects(defaultSettings, storedSettingsParsed);
		}
	} catch {
		initialSettings = defaultSettings;
	}

	const [settings, _setSettings] = createStore<Settings>(initialSettings);

	function setSettings<K extends keyof Settings>(key: K, value: Settings[K] | ((v: Settings[K]) => Settings[K])) {
		const before = settings[key];
		if (typeof value === "function") value = value(before);

		_setSettings(key, value);
		throttledSaveSettings(settings);

		desktop?.ipc.onSettingsChanged(
			key,
			typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value,
			typeof before === "object" ? JSON.parse(JSON.stringify(before)) : before
		);
	}

	const throttledSaveSettings = DelayUtil.throttle((s: Settings) => {
		localStorage.setItem("settings", JSON.stringify(s));
	}, 500);

	return <SettingsContext.Provider value={{ settings, setSettings }}>{props.children}</SettingsContext.Provider>;
};
