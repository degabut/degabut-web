import { type IRichPresenceTemplate } from "../hooks";

export const defaultRichPresenceTemplate: IRichPresenceTemplate = {
	details: "{title}",
	state: "{creator}",
	smallImageKey: "{listenerKey}",
	smallImageText: "{listenerText}",
	largeImageKey: "{imageUrl}",
	largeImageText: "{title}",
};

export const defaultRichPresenceIdleTemplate: IRichPresenceTemplate = {
	details: "Not listening to anything",
	state: "💤",
	smallImageKey: "",
	smallImageText: "",
	largeImageText: "Degabut",
	largeImageKey: "degabut",
};
