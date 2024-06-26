import { useQueue } from "@queue";
import { Video } from "@youtube";
import { createEffect, on, onCleanup, type Component } from "solid-js";

export const PreviewEmbed: Component = () => {
	const queue = useQueue()!;

	let player: YT.Player | undefined;
	let iframe!: HTMLIFrameElement;

	onCleanup(() => {
		player?.destroy();
		queue.emitter.off("player-pause-state-changed", onPauseStateChange);
	});

	createEffect(() => {
		const nowPlaying = queue.data.nowPlaying;
		player?.cueVideoById(nowPlaying?.mediaSource.playedYoutubeVideoId || "0");
	});

	const onReady = (e: YT.PlayerEvent) => {
		player = e.target;
		player.setVolume(0);

		queue.emitter.on("player-pause-state-changed", onPauseStateChange);

		if (!queue.data.isPaused && queue.data.position) {
			player.playVideo();
			player.seekTo(queue.data.position / 1000, true);
		}
	};

	const onPauseStateChange = ({ isPaused }: { isPaused: boolean }) => {
		if (isPaused) player?.pauseVideo();
		else player?.playVideo();
	};

	createEffect(
		on(
			() => queue.data.position,
			(position) => {
				if (!player) return;

				if (player.getPlayerState() !== YT.PlayerState.PLAYING && !queue.data.isPaused) player.playVideo();

				if (!queue.data.nowPlaying?.mediaSource.duration) return;

				position = position / 1000;

				const currentTime = player.getCurrentTime();
				const diff = Math.abs(currentTime - position);

				if (diff > 0.5) player.seekTo(position, true);
			}
		)
	);

	return (
		<Video.Embed
			onReady={onReady}
			ref={iframe}
			initialVideoId={queue.data.nowPlaying?.mediaSource.playedYoutubeVideoId || undefined}
			initialParams={{ enableJsApi: true, disableKeyboard: true }}
		/>
	);
};
