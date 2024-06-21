import { useApp } from "@app/providers";
import { Icon, Spinner, Text, useApi } from "@common";
import { SPOTIFY_INTEGRATION } from "@constants";
import { PlaylistConfirmationUtil } from "@playlist";
import { useQueue } from "@queue";
import { SpotifyUrlUtil } from "@spotify";
import { YouTubeApi, YoutubeUrlUtil, type IVideo, type IYouTubeMixPlaylist, type IYouTubePlaylist } from "@youtube";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { VideoPlaylistChooser } from "./components";

type VideoPlaylistOption = null | {
	video: IVideo;
	playlist: IYouTubePlaylist | IYouTubeMixPlaylist;
};

export const ExternalTrackAdder = () => {
	const app = useApp()!;
	const api = useApi();
	const youtubeApi = new YouTubeApi(api.youtubeClient);
	const queue = useQueue()!;

	const [dragCounter, setDragCounter] = createSignal(0);
	const [isLoading, setIsLoading] = createSignal(false);
	const [videoPlaylistOption, setVideoPlaylistOption] = createSignal<VideoPlaylistOption>(null);

	onMount(() => {
		window.addEventListener("dragenter", onDragEnter);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("drop", onDrop);
		document.addEventListener("paste", onPaste);
	});

	onCleanup(() => {
		window.removeEventListener("dragenter", onDragEnter);
		window.removeEventListener("dragleave", onDragLeave);
		window.removeEventListener("dragover", onDragOver);
		window.removeEventListener("drop", onDrop);
		document.removeEventListener("paste", onPaste);
	});

	const onDragEnter = (e: DragEvent) => {
		e.preventDefault();
		if (!e.dataTransfer?.types.includes("text/uri-list")) return;
		if (e.currentTarget === window) setDragCounter((v) => v + 1);
	};

	const onDragOver = (e: DragEvent) => {
		e.preventDefault();
	};

	const onDragLeave = (e: DragEvent) => {
		e.preventDefault();
		if (e.currentTarget === window) setDragCounter((v) => Math.max(v - 1, 0));
	};

	const onDrop = async (e: DragEvent) => {
		e.preventDefault();

		const url = e.dataTransfer?.getData("URL");
		if (!url) {
			showInvalidUrlAlert();
			return setDragCounter(0);
		}

		await processUrl(url);
	};

	const onPaste = async (e: ClipboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();
		if (tagName === "INPUT" || tagName === "TEXTAREA") return;

		const url = e.clipboardData?.getData("text");
		if (!url) return;
		await processUrl(url);
	};

	const processUrl = async (url: string) => {
		setDragCounter(1);

		const youtubeIds = YoutubeUrlUtil.extractIds(url);
		const spotifyIds = SPOTIFY_INTEGRATION ? SpotifyUrlUtil.extractIds(url) : {};

		if (![...Object.values(youtubeIds), ...Object.values(spotifyIds)].filter((v) => !!v).length) {
			showInvalidUrlAlert();
			return setDragCounter(0);
		}

		if (!queue.data.empty) {
			setIsLoading(true);

			if (youtubeIds.videoId && youtubeIds.playlistId) {
				const [video, playlist] = await Promise.all([
					youtubeApi.getVideo(youtubeIds.videoId),
					youtubeApi.getPlaylist(youtubeIds.playlistId),
				]);

				if (video && playlist) setVideoPlaylistOption({ video, playlist });
				else if (video) await queue.addTrackById(`youtube/${video.id}`);
				else if (playlist) showAddPlaylistConfirmation(playlist);
			} else if (youtubeIds.videoId) {
				await queue.addTrackById(`youtube/${youtubeIds.videoId}`);
			} else if (youtubeIds.playlistId) {
				const playlist = await youtubeApi.getPlaylist(youtubeIds.playlistId);
				if (!playlist) showInvalidUrlAlert();
				else showAddPlaylistConfirmation(playlist);
			} else if (spotifyIds.trackId) {
				await queue.addTrackById(`spotify/${spotifyIds.trackId}`);
			} else if (spotifyIds.playlistId) {
				await queue.addSpotifyPlaylist(spotifyIds.playlistId);
			} else if (spotifyIds.albumId) {
				await queue.addSpotifyAlbum(spotifyIds.albumId);
			}

			setIsLoading(false);
		}

		setDragCounter(0);
	};

	const showInvalidUrlAlert = () => {
		app.setConfirmation({
			title: "Invalid URL",
			message: "The URL you dropped is not a valid URL.",
			isAlert: true,
		});
	};

	const showAddPlaylistConfirmation = (playlist: IYouTubePlaylist | IYouTubeMixPlaylist) => {
		app.setConfirmation(
			PlaylistConfirmationUtil.addPlaylistConfirmation(playlist, () => queue.addYouTubePlaylist(playlist.id))
		);
	};

	const addItemToQueue = (item: IVideo | IYouTubePlaylist | IYouTubeMixPlaylist) => {
		if ("videoCount" in item) showAddPlaylistConfirmation(item);
		else queue.addTrackById(`youtube/${item.id}`);
		setVideoPlaylistOption(null);
	};

	return (
		<>
			<Show when={videoPlaylistOption()} keyed>
				{({ video, playlist }) => (
					<VideoPlaylistChooser
						video={video}
						playlist={playlist}
						onClose={() => setVideoPlaylistOption(null)}
						onChoose={addItemToQueue}
					/>
				)}
			</Show>

			<Show when={dragCounter() > 0 && !queue.data.empty}>
				<div
					onClick={() => setDragCounter(0)}
					class="fixed-screen z-[1000] flex items-center justify-center bg-black/90 text-center p-4"
				>
					<div class="w-full max-w-md rounded border-neutral-500 p-4 bg-neutral-850">
						<div class="flex flex-col space-y-8 justify-center items-center p-6 w-full border border-neutral-600 border-dashed rounded">
							<Show when={!isLoading()} fallback={<Spinner size="2xl" />}>
								<Icon name="link" extraClass="text-neutral-400 w-24 h-24" />
							</Show>
							<div class="flex flex-col space-y-4">
								<Text.H1 class="text-neutral-300">Add to Queue</Text.H1>
								<Text.Body1 class="text-neutral-400">
									You can also copy a URL and paste it anywhere on the page.
								</Text.Body1>
							</div>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
};
