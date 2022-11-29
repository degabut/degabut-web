import { Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

export const ExternalDragDrop = () => {
	const queue = useQueue();
	const app = useApp();
	const [dragCounter, setDragCounter] = createSignal(0);
	const [isLoading, setIsLoading] = createSignal(false);

	onMount(() => {
		window.addEventListener("dragenter", onDragEnter);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("drop", onDrop);
	});

	onCleanup(() => {
		window.removeEventListener("dragenter", onDragEnter);
		window.removeEventListener("dragleave", onDragLeave);
		window.removeEventListener("dragover", onDragOver);
		window.removeEventListener("drop", onDrop);
	});

	const onDragEnter = (e: DragEvent) => {
		e.preventDefault();
		if (e.currentTarget === window) setDragCounter((v) => v + 1);
	};

	const onDragOver = (e: DragEvent) => {
		e.preventDefault();
	};

	const onDragLeave = (e: DragEvent) => {
		e.preventDefault();
		if (e.currentTarget === window) setDragCounter((v) => v - 1);
	};

	const onDrop = async (e: DragEvent) => {
		e.preventDefault();

		const url = e.dataTransfer?.getData("URL");
		if (url) {
			const videoId = new URL(url).searchParams.get("v");
			if (!videoId) {
				app.setConfirmation({
					title: "Invalid URL",
					message: "The URL you dropped is not a valid YouTube URL.",
					isAlert: true,
				});
			} else {
				setIsLoading(true);
				await queue.addTrackById(videoId);
				setIsLoading(false);
			}
		} else {
			app.setConfirmation({
				title: "Invalid URL",
				message: "The URL you dropped is not a valid YouTube URL.",
				isAlert: true,
			});
		}

		setDragCounter(0);
	};

	return (
		<Show when={dragCounter() > 0}>
			<div class="fixed w-screen h-screen top-0 left-0 z-[1000] flex items-center justify-center bg-black/90">
				<div class="flex flex-col space-y-2 items-center border-4 border-dashed rounded border-neutral-500 py-8 px-24">
					<Show when={!isLoading()} fallback={<Spinner size="2xl" />}>
						<Icon name="youtube" extraClass="fill-neutral-500 w-24 h-24" />
					</Show>
					<div class="text-3xl text-neutral-300">Drop Here</div>
					<div class="text-lg text-neutral-300">Drop a YouTube video URL to add it to the Queue</div>
				</div>
			</div>
		</Show>
	);
};
