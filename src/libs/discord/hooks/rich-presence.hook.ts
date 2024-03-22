import { TimeUtil, UrlUtil } from "@common/utils";
import { QueueContextStore } from "@queue/providers";
import { useSettings } from "@settings/hooks";
import { createEffect, createSignal, onMount } from "solid-js";
import { RichPresenceUtil } from "../utils";

export type IRichPresence = {
	details: string;
	state?: string;
	largeImageText: string;
	largeImageKey: string;
	smallImageKey?: string;
	smallImageText?: string;
	startTimestamp?: number;
	buttons?: {
		label: string;
		url: string;
	}[];
};

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

type RichPresencePlaceholderKey =
	| "title"
	| "creator"
	| "imageUrl"
	| "duration"
	| "listenerKey"
	| "listenerText"
	| "botName"
	| "botIconUrl";
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

export const useRichPresence = (context: QueueContextStore) => {
	const { settings } = useSettings();
	const [activity, setActivity] = createSignal<IRichPresence | null>(null);
	let currentActivity = "";

	onMount(() => updateListeningActivity());

	createEffect(() => {
		if (settings["discord.richPresence"]) updateListeningActivity();
		else setActivity(null);
	});

	const updateListeningActivity = async () => {
		if (!settings["discord.richPresence"]) return setActivity(null);

		const nowPlaying = context.data.nowPlaying;
		const voiceChannel = context.data.voiceChannel;
		const bot = context.bot();

		let data;
		if (!voiceChannel || !nowPlaying) {
			const template = settings["discord.richPresence.idleTemplate"] || defaultRichPresenceIdleTemplate;
			const placeholder: IRichPresencePlaceholder = {
				botIconUrl: UrlUtil.toAbsolute(bot.iconUrl),
				botName: bot.name,
			};

			data = {
				...RichPresenceUtil.parseTemplate(template, placeholder),
			};
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
				botIconUrl: UrlUtil.toAbsolute(bot.iconUrl),
				botName: bot.name,
			};

			const startTimestamp = nowPlaying.playedAt
				? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000)
				: undefined;

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
		if (!data || (currentActivity && currentActivity === JSON.stringify(data))) return;
		currentActivity = JSON.stringify(data);
		setActivity(RichPresenceUtil.toPresence(data));
	};

	return activity;
};
