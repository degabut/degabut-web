import { IS_BROWSER } from "@constants";
import { useQueue } from "@hooks/useQueue";
import { useSettings } from "@hooks/useSettings";
import { QueueResource } from "@providers/QueueProvider";
import { createContext, createEffect, onMount, ParentComponent } from "solid-js";

export const RPCContext = createContext();

export const RPCProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (IS_BROWSER) return <>{props.children}</>;

	const { settings } = useSettings();
	const queue = useQueue();

	onMount(() => {
		updateListeningActivity(queue.data);
		queue.emitter.on("track-audio-started", () => updateListeningActivity(queue.data));
		queue.emitter.on("member-added", () => updateListeningActivity(queue.data));
		queue.emitter.on("member-removed", () => updateListeningActivity(queue.data));
	});

	createEffect(() => {
		if (settings.discordRpc) {
			// TODO handle
		} else {
			// TODO handle
		}
	});

	const updateListeningActivity = async (queue: Partial<QueueResource>) => {
		if (!settings.discordRpc) return;

		// TODO handle
		if (!queue.nowPlaying || !queue.voiceChannel) {
			// {
			// 	details: "Not listening to anything",
			// 	state: "💤",
			// 	assets: {
			// 		large_image: "degabut",
			// 		large_text: "Degabut",
			// 	},
			// }
		} else {
			const { nowPlaying, voiceChannel } = queue;
			const title = nowPlaying.video.title;
			const channelName = nowPlaying.video.channel.name;
			const otherMemberCount = voiceChannel.members.length - 2;
			const smallImage = otherMemberCount > 0 ? "multi_user" : "single_user";
			const smallText =
				otherMemberCount <= 0
					? "Listening alone"
					: `Listening along with ${otherMemberCount} ${otherMemberCount === 1 ? "person" : "people"}`;
			const start = nowPlaying.playedAt ? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000) : null;

			// {
			// 	details: title,
			// 	state: channelName,
			// 	assets: {
			// 		large_image: "degabut",
			// 		large_text: "Degabut",
			// 		small_image: smallImage,
			// 		small_text: smallText,
			// 	},
			// 	timestamps: start ? { start } : undefined,
			// }
		}
	};

	return <RPCContext.Provider value={{}}>{props.children}</RPCContext.Provider>;
};
