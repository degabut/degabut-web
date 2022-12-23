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

		let body = nowPlaying.video.title;
		if (nowPlaying.video.channel) body += `\n${nowPlaying.video.channel.name}`;

		const notification = await notify("Now Playing", {
			body,
			tag: "now-playing/" + nowPlaying.id,
		});

		if (!notification) return;
		notification.onclick = () => {
			window.focus();
			notification.close();
		};
	};
};
