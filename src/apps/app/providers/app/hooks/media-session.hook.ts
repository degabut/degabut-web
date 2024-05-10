import { type IMediaSource } from "@media-source";
import { useQueue } from "@queue";
import { useSettings } from "@settings";
import { type ISpotifyImage } from "@spotify";
import { type IThumbnail } from "@youtube";
import { createEffect } from "solid-js";

export const useMediaSession = () => {
	if (!("mediaSession" in navigator)) return;

	const mediaSession = navigator.mediaSession;
	const { settings } = useSettings();
	const queue = useQueue();

	const audioSrc = "/audio/silence.mp3";
	const audio = new Audio();
	audio.volume = 0;
	audio.autoplay = true;
	audio.loop = true;
	audio.src = audioSrc;

	// trigger play on first user interaction, in case autoplay doesn't work
	document.addEventListener("click", () => audio.play(), { once: true });

	createEffect(() => {
		if (settings["app.mediaSession.enabled"]) {
			audio.autoplay = true;
			audio.src = audioSrc;

			mediaSession.setActionHandler("play", togglePause);
			mediaSession.setActionHandler("pause", togglePause);
			mediaSession.setActionHandler("nexttrack", () => queue.skipTrack());
			mediaSession.setActionHandler("seekto", (details) => queue.seek((details.seekTime || 0) * 1000));
		} else {
			audio.src = "";
		}
	});

	createEffect(() => {
		if (!settings["app.mediaSession.enabled"]) return;

		const { nowPlaying, isPaused } = queue.data;
		mediaSession.playbackState = isPaused ? "paused" : "playing";

		if (nowPlaying) {
			const duration = nowPlaying.mediaSource.duration;
			let position = queue.data.position / 1000;
			if (position > duration) position = duration;

			mediaSession.setPositionState({ duration, position, playbackRate: 1 });

			mediaSession.metadata = new MediaMetadata({
				title: nowPlaying.mediaSource.title,
				artist: nowPlaying.mediaSource.creator,
				artwork: getMediaSourceImages(nowPlaying.mediaSource),
			});
		} else {
			mediaSession.metadata = null;
			mediaSession.setPositionState();
		}
	});

	const getMediaSourceImages = (mediaSource: IMediaSource): MediaImage[] => {
		const { youtubeVideo, spotifyTrack } = mediaSource;
		let images: (IThumbnail | ISpotifyImage)[] = [];

		if (youtubeVideo) images = youtubeVideo.thumbnails;
		if (spotifyTrack?.album) images = spotifyTrack.album.images;

		return images.map((t) => ({
			src: t.url,
			sizes: `${t.width}x${t.height}`,
		}));
	};

	const togglePause = async () => {
		if (queue.data.isPaused) {
			await queue.unpause();
			audio.play();
		} else {
			await queue.pause();
			audio.pause();
		}
	};
};
