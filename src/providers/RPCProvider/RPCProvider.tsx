import { IQueue } from "@api";
import * as models from "@go/models";
import * as rpc from "@go/rpc/Client";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { createContext, createEffect, onMount, ParentComponent } from "solid-js";
import { IS_BROWSER } from "../../constants";

export const RPCContext = createContext();

export const RPCProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (IS_BROWSER) return <>{props.children}</>;

	const app = useApp();
	const queue = useQueue();
	let connected = false;
	let previousQueue: IQueue | null = null;

	onMount(() => {
		const isEnabled = app.settings().discordRpc;
		if (isEnabled) start();
	});

	const start = async () => {
		const error = await rpc.Connect();
		if (error) return;
		connected = true;
		updateListeningActivity();
	};

	const stop = () => {
		rpc.Close();
		connected = false;
	};

	createEffect(() => {
		const isEnabled = app.settings().discordRpc;
		if (isEnabled && !connected) start();
		else if (!isEnabled && connected) stop();
	});

	createEffect(() => {
		const queueData = queue.data();

		if (
			!queueData ||
			queueData.nowPlaying?.id !== previousQueue?.nowPlaying?.id ||
			queueData.voiceChannel.members.length !== previousQueue?.voiceChannel.members.length
		) {
			previousQueue = queueData;
			updateListeningActivity();
		}
	});

	const updateListeningActivity = async () => {
		if (!connected) return;
		const queueData = queue.data();

		if (!queueData?.nowPlaying) {
			await rpc.SetActivity({
				details: "Not listening to anything",
				state: "💤",
				assets: {
					large_image: "degabut",
					large_text: "Degabut",
				},
			} as models.rpc.Activity);
		} else {
			const { nowPlaying, voiceChannel } = queueData;

			const title = nowPlaying.video.title;
			const channelName = nowPlaying.video.channel.name;
			const otherMemberCount = voiceChannel.members.length - 2;
			const smallImage = otherMemberCount > 0 ? "multi_user" : "single_user";
			const smallText =
				otherMemberCount <= 0
					? "Listening alone"
					: `Listening along with ${otherMemberCount} ${otherMemberCount === 1 ? "person" : "people"}`;
			const start = nowPlaying.playedAt ? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000) : null;

			await rpc.SetActivity({
				details: title,
				state: channelName,
				assets: {
					large_image: "degabut",
					large_text: "Degabut",
					small_image: smallImage,
					small_text: smallText,
				},
				timestamps: start ? { start } : undefined,
			} as models.rpc.Activity);
		}
	};

	return <RPCContext.Provider value={{}}>{props.children}</RPCContext.Provider>;
};
