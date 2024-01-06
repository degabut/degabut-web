import { TimeUtil } from "@common/utils";
import { IS_BROWSER } from "@constants";
import { RichPresenceUtil } from "@desktop/utils/rich-presence.util";
import { IQueue } from "@queue/apis";
import { useSettings } from "@settings/hooks";
import { createEffect, onMount } from "solid-js";
import { useDesktop } from "./desktop.hook";

export type IRichPresenceAsset = {
	id: string;
	name: string;
	url: string;
};

export type IRichPresenceTemplate = {
	details: string;
	state: string;
	smallImageKey: string;
	smallImageText: string;
	largeImageKey: string;
	largeImageText: string;
};

type RichPresencePlaceholderKey = "title" | "creator" | "imageUrl" | "duration" | "listenerKey" | "listenerText";
export type IRichPresencePlaceholder = Partial<Record<RichPresencePlaceholderKey, string>>;

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

export const useRichPresence = (queue: IQueue) => {
	if (IS_BROWSER) return;

	const desktop = useDesktop();
	const { settings } = useSettings();
	let currentActivity = "";

	onMount(() => updateListeningActivity());

	createEffect(() => {
		if (settings["discord.richPresence"]) updateListeningActivity();
		else desktop?.ipc.clearActivity?.();
	});

	const updateListeningActivity = async () => {
		if (!settings["discord.richPresence"]) return;

		const nowPlaying = queue.nowPlaying;
		const voiceChannel = queue.voiceChannel;

		let data;
		if (!nowPlaying?.playedAt || !voiceChannel) {
			data = { ...settings["discord.richPresence.idleTemplate"] } || defaultRichPresenceIdleTemplate;
		} else {
			const template = settings["discord.richPresence.template"] || defaultRichPresenceTemplate;

			const otherMemberCount = voiceChannel.members.filter((m) => m.isInVoiceChannel).length - 1;
			const placeholder: IRichPresencePlaceholder = {
				title: nowPlaying.mediaSource.title,
				creator: nowPlaying.mediaSource.creator,
				imageUrl: nowPlaying.mediaSource.minThumbnailUrl,
				duration: TimeUtil.secondsToTime(nowPlaying.mediaSource.duration),
				listenerKey: otherMemberCount > 0 ? "multi_user" : "single_user",
				listenerText:
					otherMemberCount <= 0
						? "Listening alone"
						: `Listening along with ${otherMemberCount} other ${
								otherMemberCount === 1 ? "person" : "people"
						  }`,
			};

			const startTimestamp = nowPlaying.playedAt
				? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000)
				: null;

			data = {
				...RichPresenceUtil.parseTemplate(template, placeholder),
				startTimestamp,
				buttons: [
					{
						label: nowPlaying.mediaSource.type === "youtube" ? "YouTube" : "Spotify",
						url: nowPlaying.mediaSource.url,
					},
				],
			};
		}

		// TODO better way to check current activity
		if (currentActivity && currentActivity === JSON.stringify(data)) return;
		currentActivity = JSON.stringify(data);
		desktop?.ipc.setActivity?.(RichPresenceUtil.toPresence(data));
	};
};
