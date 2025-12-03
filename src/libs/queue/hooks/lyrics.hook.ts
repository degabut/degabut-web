import { onCleanup, onMount } from "solid-js";
import { useQueue } from "../providers";

export const useLyrics = () => {
	const queue = useQueue()!;

	onMount(() => {
		queue.lyrics.setIsActive(true);
	});

	onCleanup(() => {
		queue.lyrics.setIsActive(false);
	});

	return queue.lyrics.data;
};
