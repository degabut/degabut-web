import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useTranscript } from "@hooks/useTranscript";
import { useVideoTranscript } from "@hooks/useVideoTranscript";
import { Component, createEffect, createMemo, For, onMount, Show } from "solid-js";

const LyricsNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="microphone" extraClass="fill-neutral-500 w-24 h-24" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Lyrics Found</div>
		</div>
	);
};

export const Lyrics: Component = () => {
	let container!: HTMLDivElement;
	const queue = useQueue();
	const app = useApp();
	const currentId = createMemo(() => queue.data.nowPlaying?.video.id || "");
	const videoTranscripts = useVideoTranscript(currentId);
	const transcripts = useTranscript(() => ({
		elapsed: queue.data.position || 0,
		transcripts: videoTranscripts.data() || [],
	}));

	onMount(() => app.setTitle("Lyrics"));

	createEffect(() => {
		if (transcripts.index() === -1) {
			container.scrollTop = 0;
		} else {
			const element = container.childNodes[transcripts.index()] as HTMLDivElement;
			if (!element) return;
			container.scrollTop = element.offsetTop - container.offsetHeight / 2.5 + element.offsetHeight / 2;
		}
	});

	return (
		<Container size="full" extraClass="h-full" padless>
			<div class="h-full px-3 md:px-8 py-8 pb-32 space-y-8 overflow-y-auto" ref={container}>
				<Show
					when={videoTranscripts.data().length || videoTranscripts.isLoading()}
					fallback={<LyricsNotFound />}
				>
					<For each={videoTranscripts.data()}>
						{(t, i) => (
							<div
								class="space-y-1"
								classList={{
									"text-neutral-300": i() < transcripts.index(),
									"text-neutral-500": i() > transcripts.index(),
									"!text-neutral-300": i() === transcripts.index() + 1,
									"!text-neutral-400": i() === transcripts.index() + 2,
									"text-xl md:text-2xl": i() !== transcripts.index(),
									"font-semibold text-2xl md:text-3xl !text-neutral-100": i() === transcripts.index(),
								}}
							>
								<For each={t.texts}>{(text) => <div>{text}</div>}</For>
							</div>
						)}
					</For>
				</Show>
			</div>
		</Container>
	);
};
