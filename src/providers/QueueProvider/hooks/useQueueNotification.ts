import { ITrack } from "@api";
import { useSettings } from "@hooks/useSettings";
import { notify } from "@utils/notification";
import { onMount } from "solid-js";
import TypedEventEmitter from "typed-emitter";
import { QueueEvents } from "./useQueueEvents";

type Params = {
	emitter: TypedEventEmitter<QueueEvents>;
};

export const useQueueNotification = ({ emitter }: Params) => {
	const { settings } = useSettings();

	onMount(() => {
		emitter.on("queue-processed", onQueueProcessed);
	});

	const onQueueProcessed = async (nowPlaying: ITrack | null) => {
		if (!settings.notification) return;
		if (!nowPlaying) return;

		const notification = await notify("Now Playing", {
			body: `${nowPlaying.video.title}\n${nowPlaying.video.channel.name}`,
			tag: "now-playing/" + nowPlaying.id,
		});

		if (!notification) return;
		notification.onclick = () => {
			window.focus();
			notification.close();
		};
	};
};
