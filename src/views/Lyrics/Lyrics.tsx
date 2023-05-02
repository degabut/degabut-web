import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { Text } from "@components/Text";
import { useLyrics } from "@hooks/useLyrics";
import { useQueue } from "@hooks/useQueue";
import { useTranscript } from "@hooks/useTranscript";
import { useVideoTranscript } from "@hooks/useVideoTranscript";
import { useApp } from "@providers/AppProvider";
import { Component, createEffect, createMemo, For, Match, onMount, Switch } from "solid-js";

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
	const lyrics = useLyrics(currentId);
	const transcripts = useTranscript(() => ({
		elapsed: queue.data.position || 0,
		transcripts: videoTranscripts.data() || [],
	}));

	onMount(() => app.setTitle("Lyrics"));

	createEffect(() => {
		if (transcripts.index() === -1 && container) {
			container.scrollTop = 0;
		} else {
			const element = container?.childNodes[transcripts.index()] as HTMLDivElement;
			if (!element) return;
			container.scrollTop = element.offsetTop - container.offsetHeight / 2.5 + element.offsetHeight / 2;
		}
	});

	return (
		<Container size="full" extraClass="h-full" padless>
			<Switch fallback={<LyricsNotFound />}>
				<Match when={videoTranscripts.isLoading() || lyrics.data.loading}>
					<Spinner size="lg" />
				</Match>
				<Match when={videoTranscripts.data().length}>
					<div class="space-y-8 h-full overflow-y-auto px-3 md:px-8 py-8 pb-32" ref={container}>
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
										"font-semibold text-2xl md:text-3xl !text-neutral-100":
											i() === transcripts.index(),
									}}
								>
									<For each={t.texts}>{(text) => <div>{text}</div>}</For>
								</div>
							)}
						</For>
					</div>
				</Match>
				<Match when={lyrics.data()} keyed>
					{({ content, description }) => (
						<div class="flex flex-col space-y-8 select-text px-3 md:px-8 py-8 pb-32">
							<div class="flex flex-col space-y-2">
								<For each={content.split(/\r?\n/)}>
									{(t) => <Text.Body1 classList={{ "py-1": !t }}>{t}</Text.Body1>}
								</For>
							</div>
							<Text.Body2>{description}</Text.Body2>
						</div>
					)}
				</Match>
			</Switch>
		</Container>
	);
};
