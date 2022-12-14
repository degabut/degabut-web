import { IMixPlaylist, IVideo, IYoutubePlaylist } from "@api/YouTube";
import { Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { useApi } from "@hooks/useApi";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { addPlaylistConfirmation } from "@utils";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { VideoPlaylistChooser } from "./components";

type VideoPlaylistOption = null | {
	video: IVideo;
	playlist: IYoutubePlaylist | IMixPlaylist;
};

export const ExternalTrackAdder = () => {
	const app = useApp();
	const api = useApi();
	const queue = useQueue();

	const [dragCounter, setDragCounter] = createSignal(0);
	const [isLoading, setIsLoading] = createSignal(false);
	const [videoPlaylistOption, setVideoPlaylistOption] = createSignal<VideoPlaylistOption>(null);
	let dropContainer!: HTMLDivElement;
	let containerDragCounter = 0;

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

		if (!dropContainer.contains(e.target as Node)) return setDragCounter(0);

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

		const searchParams = new URL(url).searchParams;
		const videoId = searchParams.get("v") || url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
		const playlistId = searchParams.get("list");

		if (!videoId && !playlistId) {
			showInvalidUrlAlert();
			return setDragCounter(0);
		}

		if (!queue.data.empty) {
			setIsLoading(true);

			if (videoId && playlistId) {
				const [video, playlist] = await Promise.all([
					api.youtube.getVideo(videoId),
					api.youtube.getPlaylist(playlistId),
				]);

				if (video && playlist) setVideoPlaylistOption({ video, playlist });
				else if (video) await queue.addTrackById(video.id);
				else if (playlist) showAddPlaylistConfirmation(playlist);
			} else if (videoId) {
				await queue.addTrackById(videoId);
			} else if (playlistId) {
				const playlist = await api.youtube.getPlaylist(playlistId);
				if (!playlist) showInvalidUrlAlert();
				else showAddPlaylistConfirmation(playlist);
			}

			setIsLoading(false);
		}

		setDragCounter(0);
	};

	const onContainerDragEnter = () => {
		++containerDragCounter && dropContainer.classList.add("bg-white/10");
	};

	const onContainerDragLeave = () => {
		--containerDragCounter || dropContainer.classList.remove("bg-white/10");
	};

	const showInvalidUrlAlert = () => {
		app.setConfirmation({
			title: "Invalid URL",
			message: "The URL you dropped is not a valid YouTube URL.",
			isAlert: true,
		});
	};

	const showAddPlaylistConfirmation = (playlist: IYoutubePlaylist | IMixPlaylist) => {
		app.setConfirmation(addPlaylistConfirmation(playlist, () => queue.addYouTubePlaylist(playlist.id)));
	};

	const addItemToQueue = (item: IVideo | IYoutubePlaylist | IMixPlaylist) => {
		if ("videoCount" in item) showAddPlaylistConfirmation(item);
		else queue.addTrackById(item.id);
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
					class="fixed-screen z-[1000] flex items-center justify-center bg-black/90 text-center"
				>
					<div
						ref={dropContainer}
						onDragEnter={onContainerDragEnter}
						onDragLeave={onContainerDragLeave}
						class="flex flex-col space-y-8 min-w-[50vw] min-h-[50vh] justify-center items-center border-4 border-dashed rounded border-neutral-500 p-8"
					>
						<Show when={!isLoading()} fallback={<Spinner size="3xl" />}>
							<Icon name="youtube" extraClass="fill-neutral-400 w-32 h-32" />
						</Show>
						<div class="space-y-4">
							<div class="text-4xl font-medium text-neutral-300">Drop Here</div>
							<div class="text-xl text-neutral-400">Drop a YouTube video URL to add it to the Queue</div>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
};
