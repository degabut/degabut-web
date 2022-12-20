import { useQueue } from "@hooks/useQueue";
import { useSettings } from "@hooks/useSettings";
import { createEffect, onMount } from "solid-js";
import { postMessage } from "../poster";

export const useDiscordRPC = () => {
	const { settings } = useSettings();
	const queue = useQueue();
	let currentActivity = "";

	onMount(() => updateListeningActivity());

	createEffect(() => {
		if (settings.discordRpc) updateListeningActivity();
		else postMessage("clear-activity");
	});

	const updateListeningActivity = async () => {
		if (!settings.discordRpc) return;

		const nowPlaying = queue.data.nowPlaying;
		const voiceChannel = queue.data.voiceChannel;

		let data;
		if (!nowPlaying || !voiceChannel) {
			data = {
				details: "Not listening to anything",
				state: "💤",
				largeImageText: "Degabut",
				largeImageKey: "degabut",
			};
		} else {
			const title = nowPlaying.video.title;
			const channelName = nowPlaying.video.channel.name;
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
				state: channelName,
				largeImageText: "Degabut",
				largeImageKey: "degabut",
				smallImageKey,
				smallImageText,
				startTimestamp,
				buttons: [
					{
						label: "YouTube",
						url: "https://youtu.be/" + nowPlaying.video.id,
					},
				],
			};
		}

		// TODO better way to check current activity
		if (currentActivity && currentActivity === JSON.stringify(data)) return;
		currentActivity = JSON.stringify(data);
		postMessage("set-activity", data);
	};
};
