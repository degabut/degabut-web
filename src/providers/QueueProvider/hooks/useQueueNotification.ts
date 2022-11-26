import { ITrack } from "@api";
import { useApp } from "@hooks/useApp";
import { notify } from "@utils";
import EventEmitter from "events";
import { onMount } from "solid-js";

type Params = {
	emitter: EventEmitter;
};

export const useQueueNotification = ({ emitter }: Params) => {
	const app = useApp();

	onMount(() => {
		emitter.on("queue-processed", onQueueProcessed);
	});

	const onQueueProcessed = async (nowPlaying: ITrack | null) => {
		if (!app.settings().notification) return;
		if (!nowPlaying) return;

		const notification = await notify("Now Playing", {
			body: `${nowPlaying.video.title}\n${nowPlaying.video.channel.name}`,
		});

		if (!notification) return;
		notification.onclick = () => window.open("/app/queue");
	};
};
