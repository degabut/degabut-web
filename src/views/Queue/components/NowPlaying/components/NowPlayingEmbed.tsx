import { Video } from "@components/molecules";
import { useQueue } from "@hooks/useQueue";
import { Component, onCleanup, onMount } from "solid-js";

export const NowPlayingEmbed: Component = () => {
	const queue = useQueue();

	let player: YT.Player;
	let iframe!: HTMLIFrameElement;

	const currentVideoId = () => {
		return queue.data.nowPlaying?.video.id || "";
	};

	onMount(() => {
		player = new YT.Player(iframe, {
			events: {
				onReady: (e) => {
					player = e.target;
					player.setVolume(0);
					const paused = queue.data.isPaused;
					if (paused) player.pauseVideo();
				},
			},
		});

		queue.emitter.on("player-pause-state-changed", onPauseStateChange);
		queue.emitter.on("player-tick", onTick);
	});

	onCleanup(() => {
		player.destroy();

		queue.emitter.off("player-pause-state-changed", onPauseStateChange);
		queue.emitter.off("player-tick", onTick);
	});

	const onPauseStateChange = ({ isPaused }: { isPaused: boolean }) => {
		if (isPaused) player.pauseVideo();
		else player.playVideo();
	};

	const onTick = ({ position }: { position: number }) => {
		position = position / 1000;

		const currentTime = player.getCurrentTime();
		const diff = Math.abs(currentTime - position);

		if (player.getPlayerState() !== YT.PlayerState.PLAYING && !queue.data.isPaused) player.playVideo();
		if (diff > 0.5) player.seekTo(position, true);
	};

	return (
		<div class="px-12 w-full">
			<Video.Embed ref={iframe} videoId={currentVideoId()} enableJsApi disableKeyboard />
		</div>
	);
};
