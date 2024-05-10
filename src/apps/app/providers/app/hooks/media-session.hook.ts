import { useQueue } from "@queue";
import { createEffect, onMount } from "solid-js";

export const useMediaSession = () => {
	if (!("mediaSession" in navigator)) return;

	const mediaSession = navigator.mediaSession;
	const queue = useQueue();

	onMount(() => {
		mediaSession.setActionHandler("play", () => queue.unpause());
		mediaSession.setActionHandler("pause", () => queue.pause());
		mediaSession.setActionHandler("nexttrack", () => queue.skipTrack());
		mediaSession.setActionHandler("seekto", (details) => queue.seek((details.seekTime || 0) * 1000));
	});

	createEffect(() => {
		const { nowPlaying } = queue.data;

		if (nowPlaying) {
			mediaSession.playbackState = !queue.data.isPaused ? "playing" : "paused";

			const position = queue.data.position / 1000;
			const duration = nowPlaying.mediaSource.duration;
			mediaSession.setPositionState({ duration, position, playbackRate: 1 });

			mediaSession.metadata = new MediaMetadata({
				title: nowPlaying.mediaSource.title,
				artist: nowPlaying.mediaSource.creator,
				artwork: [
					{ src: nowPlaying.mediaSource.minThumbnailUrl },
					{ src: nowPlaying.mediaSource.maxThumbnailUrl },
				],
			});
		} else {
			mediaSession.metadata = null;
		}
	});
};
