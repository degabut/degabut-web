import { TimeUtil, UrlUtil } from "@common";
import type { QueueContextStore } from "@queue";
import { createEffect, createSignal, type Accessor } from "solid-js";
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

type Params = {
	enabled: Accessor<boolean>;
	queueContext: QueueContextStore;
	template: Accessor<IRichPresenceTemplate>;
	idleTemplate: Accessor<IRichPresenceTemplate>;
};

export const useRichPresence = (params: Params) => {
	const [activity, setActivity] = createSignal<IRichPresence | null>(null);
	let currentActivity = "";

	createEffect(() => {
		if (!params.enabled()) return setActivity(null);

		const nowPlaying = params.queueContext.data.nowPlaying;
		const voiceChannel = params.queueContext.data.voiceChannel;
		const bot = params.queueContext.bot();

		let data;
		if (!voiceChannel || !nowPlaying) {
			const template = params.idleTemplate();
			const placeholder: IRichPresencePlaceholder = {
				botIconUrl: UrlUtil.toAbsolute(bot.iconUrl),
				botName: bot.name,
			};

			data = {
				...RichPresenceUtil.parseTemplate(template, placeholder),
			};
		} else {
			const template = params.template();

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
		if (!data || currentActivity === JSON.stringify(data)) return;
		currentActivity = JSON.stringify(data);
		setActivity(RichPresenceUtil.toPresence(data));
	});

	return activity;
};
