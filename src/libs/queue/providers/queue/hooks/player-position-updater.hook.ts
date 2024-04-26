import { createEffect } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";
import { type QueueResource } from "../queue.provider";

type Params = {
	queue: QueueResource;
	setQueue: SetStoreFunction<QueueResource>;
};

export const usePlayerPositionUpdater = ({ queue, setQueue }: Params) => {
	let tickInterval: NodeJS.Timeout;

	createEffect(() => {
		clearInterval(tickInterval);
		if (!queue.isPaused && queue.nowPlaying?.playedAt) tickInterval = setInterval(tick, 1000);
	});

	const tick = () => setQueue("position", (p) => p + 1000);
};
