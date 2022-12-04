import { IQueue } from "@api";
import * as models from "@go/models";
import * as rpc from "@go/rpc/Client";
import { useQueue } from "@hooks/useQueue";
import { useSettings } from "@hooks/useSettings";
import { createContext, createEffect, onMount, ParentComponent } from "solid-js";
import { IS_BROWSER } from "../../constants";

export const RPCContext = createContext();

export const RPCProvider: ParentComponent = (props) => {
	// eslint-disable-next-line solid/components-return-once
	if (IS_BROWSER) return <>{props.children}</>;

	const { settings } = useSettings();
	const queue = useQueue();
	let connected = false;
	let connecting = false;

	onMount(() => {
		const isEnabled = settings.discordRpc;
		if (isEnabled) start();
	});

	const start = async () => {
		if (connected || connecting) return;

		connecting = true;
		const error = await rpc.Connect();
		if (!error) {
			connected = true;
			if (!queue.data.empty) updateListeningActivity(queue.data);
		}
		connecting = false;
	};

	const stop = () => {
		rpc.Close();
		connected = false;
	};

	createEffect(() => {
		const isEnabled = settings.discordRpc;
		if (isEnabled && !connected) start();
		else if (!isEnabled && connected) stop();
	});

	createEffect(() => {
		if (!queue.data.empty) updateListeningActivity(queue.data);
	});

	const updateListeningActivity = async (queue: IQueue) => {
		if (!connected) return;

		if (!queue.nowPlaying) {
			await rpc.SetActivity({
				details: "Not listening to anything",
				state: "💤",
				assets: {
					large_image: "degabut",
					large_text: "Degabut",
				},
			} as models.rpc.Activity);
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
