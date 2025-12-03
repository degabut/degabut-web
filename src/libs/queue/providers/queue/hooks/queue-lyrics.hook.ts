import { useApi } from "@common";
import { createEffect, createResource, createSignal } from "solid-js";
import { QueueApi } from "../../../apis";
import { type QueueResource } from "../queue.provider";

type Params = {
	queue: QueueResource;
};

export const useQueueLyrics = ({ queue }: Params) => {
	const api = useApi();
	const queueApi = new QueueApi(api.client);

	const [isActive, setIsActive] = createSignal(false);
	const [currentId, setCurrentId] = createSignal<string | null>(null);

	createEffect(() => {
		if (isActive()) {
			setCurrentId(queue.nowPlaying?.mediaSource.id || null);
		}
	});

	const [data] = createResource(
		currentId,
		(currentId) => {
			if (!currentId) return null;
			return queueApi.lyrics(queue.voiceChannel.id);
		},
		{ initialValue: null }
	);

	return {
		data,
		isActive,
		setIsActive,
	};
};
