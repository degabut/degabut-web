import { Video } from "@components/molecules";
import { useQueue } from "@hooks/useQueue";
import { loadIframeApi } from "@utils/youtube";
import { Component, onCleanup, onMount } from "solid-js";

export const NowPlayingEmbed: Component = () => {
	const queue = useQueue();

	let player: YT.Player;
	let iframe!: HTMLIFrameElement;

	const currentVideoId = () => queue.data.nowPlaying?.video.id || "";

	onMount(() => {
		if (!window.YT) {
			window.onYouTubeIframeAPIReady = onIframeReady;
			loadIframeApi();
		} else {
			onIframeReady();
		}
	});

	onCleanup(() => {
		player?.destroy();
		queue.emitter.off("player-pause-state-changed", onPauseStateChange);
		queue.emitter.off("player-tick", onTick);
	});

	const onIframeReady = () => {
		player = new YT.Player(iframe, { events: { onReady } });
		queue.emitter.on("player-pause-state-changed", onPauseStateChange);
		queue.emitter.on("player-tick", onTick);
	};

	const onReady = (e: YT.PlayerEvent) => {
		player = e.target;
		player.setVolume(0);

		if (!queue.data.isPaused && queue.data.position) {
			player.playVideo();
			player.seekTo(queue.data.position / 1000, true);
		}
	};

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

	return <Video.Embed ref={iframe} videoId={currentVideoId()} enableJsApi disableKeyboard />;
};
