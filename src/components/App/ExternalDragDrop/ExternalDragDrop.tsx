import { Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

export const ExternalDragDrop = () => {
	const queue = useQueue();
	const app = useApp();
	const [dragCounter, setDragCounter] = createSignal(0);
	let dropContainer!: HTMLDivElement;
	let containerDragCounter = 0;
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

		if (!dropContainer.contains(e.target as Node)) return setDragCounter(0);

		const url = e.dataTransfer?.getData("URL");
		if (!url) {
			showAlert();
			return setDragCounter(0);
		}

		const videoId = new URL(url).searchParams.get("v");
		if (!videoId) {
			showAlert();
			return setDragCounter(0);
		}

		setIsLoading(true);
		await queue.addTrackById(videoId);
		setIsLoading(false);
		setDragCounter(0);
	};

	const onContainerDragEnter = () => {
		++containerDragCounter && dropContainer.classList.add("bg-white/10");
	};

	const onContainerDragLeave = () => {
		--containerDragCounter || dropContainer.classList.remove("bg-white/10");
	};

	const showAlert = () => {
		app.setConfirmation({
			title: "Invalid URL",
			message: "The URL you dropped is not a valid YouTube URL.",
			isAlert: true,
		});
	};

	return (
		<Show when={dragCounter() > 0 && queue.data()}>
			<div class="fixed w-screen h-screen top-0 left-0 z-[1000] flex items-center justify-center bg-black/90">
				<div
					ref={dropContainer}
					onDragEnter={onContainerDragEnter}
					onDragLeave={onContainerDragLeave}
					class="flex flex-col space-y-2 items-center border-4 border-dashed rounded border-neutral-500 py-8 px-24"
				>
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
