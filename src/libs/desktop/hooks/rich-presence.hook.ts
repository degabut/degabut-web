import { IS_BROWSER } from "@constants";
import { IQueue } from "@queue/apis";
import { useSettings } from "@settings/hooks";
import { createEffect, onMount } from "solid-js";
import { useDesktop } from "./desktop.hook";

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
			data = {
				details: "Not listening to anything",
				state: "💤",
				largeImageText: "Degabut",
				largeImageKey: "degabut",
			};
		} else {
			const title = nowPlaying.mediaSource.title;
			const creator = nowPlaying.mediaSource.creator;
			const otherMemberCount = voiceChannel.members.length - 1;
			const smallImageKey = otherMemberCount > 0 ? "multi_user" : "single_user";
			const smallImageText =
				otherMemberCount <= 0
					? "Listening alone"
					: `Listening along with ${otherMemberCount} ${otherMemberCount === 1 ? "person" : "people"}`;
			const startTimestamp = nowPlaying.playedAt
				? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000)
				: null;

			data = {
				details: title,
				state: creator,
				largeImageText: nowPlaying.mediaSource.title,
				largeImageKey: nowPlaying.mediaSource.minThumbnailUrl,
				smallImageKey,
				smallImageText,
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
		desktop?.ipc.setActivity?.(data);
	};
};
