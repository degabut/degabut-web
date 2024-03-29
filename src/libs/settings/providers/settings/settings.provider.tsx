import { createPersistedStore } from "@common/hooks";
import { bots } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { IRichPresenceTemplate, defaultRichPresenceIdleTemplate, defaultRichPresenceTemplate } from "@discord/hooks";
import { ParentComponent, createContext } from "solid-js";

export type Settings = {
	["botIndex"]: number;
	["botVolumes"]: Record<string, number>;
	["queue.showThumbnail"]: boolean;
	["notification.browser"]: boolean;
	["notification.inApp"]: boolean;
	["discord.richPresence.template"]: IRichPresenceTemplate;
	["discord.richPresence.idleTemplate"]: IRichPresenceTemplate;
	["discord.richPresence"]: boolean;
	["discord.rpc"]: boolean;
	["discord.rpcClientId"]: string;
	["discord.rpcClientSecret"]: string;
	["app.drawerSize"]: number;
	["app.textSize"]: number;
	["app.snowfall.enabled"]: boolean;
	["app.snowfall.amount"]: number;
	["app.snowfall.speed"]: number;
	["overlay.enabled"]: boolean;
	["overlay.shortcut"]: string[];
	["spotify.enabled"]: boolean;
	["spotify.clientId"]: string;
};

const defaultSettings: Settings = {
	["botIndex"]: 0,
	["botVolumes"]: bots.reduce((acc, bot) => ({ ...acc, [bot.id]: 25 }), {}),
	["queue.showThumbnail"]: true,
	["notification.browser"]: false,
	["notification.inApp"]: true,
	["discord.richPresence.template"]: { ...defaultRichPresenceTemplate },
	["discord.richPresence.idleTemplate"]: { ...defaultRichPresenceIdleTemplate },
	["discord.richPresence"]: true,
	["discord.rpc"]: false,
	["discord.rpcClientId"]: "",
	["discord.rpcClientSecret"]: "",
	["app.drawerSize"]: 256,
	["app.textSize"]: 16,
	["app.snowfall.enabled"]: true,
	["app.snowfall.amount"]: 10,
	["app.snowfall.speed"]: 50,
	["overlay.enabled"]: true,
	["overlay.shortcut"]: ["Control", "Shift", "B"],
	["spotify.enabled"]: false,
	["spotify.clientId"]: "",
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

	const [settings, setSettings] = createPersistedStore(defaultSettings, {
		key: "settings",
		onChange: (key, value, before) => {
			desktop?.ipc.onSettingsChanged?.(
				key,
				typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value,
				typeof before === "object" ? JSON.parse(JSON.stringify(before)) : before
			);
		},
	});

	return <SettingsContext.Provider value={{ settings, setSettings }}>{props.children}</SettingsContext.Provider>;
};
