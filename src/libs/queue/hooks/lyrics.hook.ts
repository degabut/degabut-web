import { useApi } from "@common";
import { createResource } from "solid-js";
import { QueueApi } from "../apis";
import { useQueue } from "../providers";

export const useLyrics = () => {
	const queue = useQueue()!;
	const api = useApi();
	const queueApi = new QueueApi(api.client);

	const [data, { refetch, mutate }] = createResource(
		() => queue?.data.nowPlaying,
		(nowPlaying) => (nowPlaying ? queueApi.lyrics(queue.data.voiceChannel.id) : null),
		{ initialValue: null }
	);

	return {
		data,
		mutate,
		refetch,
	};
};
