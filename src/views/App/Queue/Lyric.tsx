import { Container } from "@components/Container";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useVideoTranscript } from "@hooks/useVideoTranscript";
import { Component, createEffect, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { clearTimeout, setTimeout } from "worker-timers";

export const Lyric: Component = () => {
	let container!: HTMLDivElement;
	let updateTimeout: number | null = null;
	const queue = useQueue();
	const app = useApp();
	const currentId = createMemo(() => queue.data()?.nowPlaying?.video.id || "");
	const transcripts = useVideoTranscript(currentId);
	const [currentActiveIndex, setCurrentActiveIndex] = createSignal(-1);

	onMount(() => {
		app.setTitle("Lyric");
		queue.emitter.on("track-audio-started", startUpdateActiveIndex);
	});

	onCleanup(() => {
		queue.emitter.off("track-audio-started", startUpdateActiveIndex);
		updateTimeout && clearTimeout(updateTimeout);
	});

	createEffect(() => {
		if (transcripts.data().length) startUpdateActiveIndex();
	});

	createEffect(() => {
		if (currentActiveIndex() === -1) container.scrollTop = 0;
		else scrollToActiveIndex();
	});

	const scrollToActiveIndex = () => {
		const element = container.childNodes[currentActiveIndex()] as HTMLDivElement;
		if (!element) return;
		container.scrollTop = element.offsetTop - container.offsetHeight / 2.5 + element.offsetHeight / 2;
	};

	const startUpdateActiveIndex = () => {
		updateTimeout && clearTimeout(updateTimeout);
		updateTimeout = null;
		container.scrollTop = 0;
		setCurrentActiveIndex(-1);

		const nowPlaying = queue.data()?.nowPlaying;
		if (!nowPlaying?.playedAt) return;

		const elapsed = transcripts.getFixedTime() - new Date(nowPlaying.playedAt).getTime();
		const data = transcripts.data();

		let initialIndex = data.findIndex((t) => elapsed <= t.end);
		const transcript = data.at(initialIndex);
		if (!transcript) return;

		let delay = 0;
		if (elapsed >= transcript.start) {
			// current
			delay = transcript.end - elapsed;
		} else {
			// next
			const next = data[initialIndex];
			initialIndex--;
			if (!next) return;
			delay = next.start - elapsed;
		}
		setCurrentActiveIndex(initialIndex);
		updateTimeout = setTimeout(updateActiveIndex, delay);
	};

	const updateActiveIndex = () => {
		const nowPlaying = queue.data()?.nowPlaying;
		if (!nowPlaying?.playedAt) return;

		setCurrentActiveIndex((v) => v + 1);

		const elapsed = transcripts.getFixedTime() - new Date(nowPlaying.playedAt).getTime();
		const data = transcripts.data();
		const next = data.at(currentActiveIndex() + 1);

		if (!next) return;
		const delay = Math.max(next.start - elapsed, 0);
		updateTimeout = setTimeout(updateActiveIndex, delay);
	};

	return (
		<Container size="full" extraClass="h-full" padless>
			<div class="h-full overflow-y-auto px-3 md:px-8 py-8 pb-32 space-y-8" ref={container}>
				<For each={transcripts.data()}>
					{(t, i) => (
						<div
							class="space-y-1"
							classList={{
								"text-neutral-300": i() < currentActiveIndex(),
								"text-neutral-500": i() > currentActiveIndex(),
								"!text-neutral-300": i() === currentActiveIndex() + 1,
								"!text-neutral-400": i() === currentActiveIndex() + 2,
								"text-xl md:text-2xl": i() !== currentActiveIndex(),
								"font-semibold text-2xl md:text-3xl !text-neutral-100": i() === currentActiveIndex(),
							}}
						>
							<For each={t.texts}>{(text) => <div>{text}</div>}</For>
						</div>
					)}
				</For>
			</div>
		</Container>
	);
};
