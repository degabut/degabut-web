import { createPersistedStore } from "@common";
import { bots } from "@constants";
import { useDesktop } from "@desktop";
import { defaultRichPresenceIdleTemplate, defaultRichPresenceTemplate, type IRichPresenceTemplate } from "@discord";
import { createContext, type ParentComponent } from "solid-js";

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
	["discord.pip.interactive"]: boolean;
	["discord.pip.lyrics"]: boolean;
	["app.drawerSize"]: number;
	["app.catJam.enabled"]: boolean;
	["app.player.size"]: number;
	["app.player.minimized"]: boolean;
	["app.textSize"]: number;
	["app.snowfall.enabled"]: boolean;
	["app.snowfall.amount"]: number;
	["app.snowfall.speed"]: number;
	["app.mediaSession.enabled"]: boolean;
	["overlay.enabled"]: boolean;
	["overlay.shortcut"]: string[];
	["overlay.nowPlaying.enabled"]: boolean;
	["overlay.nowPlaying.opacity"]: number;
	["overlay.nowPlaying.position"]: "tl" | "tr" | "bl" | "br";
	["overlay.nowPlaying.size"]: "sm" | "md" | "lg";
	["overlay.catJam.enabled"]: boolean;
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
	["discord.pip.interactive"]: true,
	["discord.pip.lyrics"]: false,
	["app.drawerSize"]: 256,
	["app.catJam.enabled"]: true,
	["app.player.size"]: 360,
	["app.player.minimized"]: false,
	["app.textSize"]: 16,
	["app.snowfall.enabled"]: true,
	["app.snowfall.amount"]: 25,
	["app.snowfall.speed"]: 50,
	["app.mediaSession.enabled"]: true,
	["overlay.enabled"]: true,
	["overlay.shortcut"]: ["Control", "Shift", "B"],
	["overlay.nowPlaying.enabled"]: false,
	["overlay.nowPlaying.opacity"]: 75,
	["overlay.nowPlaying.position"]: "tr",
	["overlay.nowPlaying.size"]: "md",
	["overlay.catJam.enabled"]: true,
	["spotify.enabled"]: false,
	["spotify.clientId"]: "",
};

export type SettingsContextStore = {
	settings: Settings;
	setSettings: <K extends keyof Settings>(key: K, value: Settings[K] | ((v: Settings[K]) => Settings[K])) => void;
};

export const SettingsContext = createContext<SettingsContextStore>({} as SettingsContextStore);

export const SettingsProvider: ParentComponent = (props) => {
	const desktop = useDesktop();

	const [settings, setSettings] = createPersistedStore(defaultSettings, {
		key: "settings",
		persistThrottle: 250,
		onChange: (key, value, before) => {
			desktop?.ipc.emit?.("settings-changed", {
				key,
				value: typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value,
				previous: typeof before === "object" ? JSON.parse(JSON.stringify(before)) : before,
			});
		},
	});

	return <SettingsContext.Provider value={{ settings, setSettings }}>{props.children}</SettingsContext.Provider>;
};
