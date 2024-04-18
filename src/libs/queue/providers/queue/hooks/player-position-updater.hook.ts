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
		if (!queue.isPaused && queue.nowPlaying) {
			startTickInterval();
		} else {
			stopTickInterval();
		}
	});

	const startTickInterval = () => {
		stopTickInterval();
		if (!queue.isPaused && queue.nowPlaying) tickInterval = setInterval(tick, 1000);
	};

	const stopTickInterval = () => clearInterval(tickInterval);

	const tick = () => {
		if (!queue.nowPlaying) return;
		const position = queue.position + 1000;
		setQueue("position", Math.max(position, queue.nowPlaying.mediaSource.duration));
	};
};
