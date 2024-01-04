import { useApp } from "@app/hooks";
import { Container, Icon, Spinner } from "@common/components";
import { useQueue } from "@queue/hooks";
import { useLyrics, useTranscript, useVideoTranscript } from "@youtube/hooks";
import { Component, For, Match, Switch, createEffect, createMemo, onMount } from "solid-js";
import "./lyrics.style.css";

const LyricsNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="microphone" extraClass="fill-neutral-500 w-24 h-24" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Lyrics Found</div>
		</div>
	);
};

const Loading: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Spinner size="lg" />
		</div>
	);
};

export const Lyrics: Component = () => {
	let container!: HTMLDivElement;
	const queue = useQueue();
	const app = useApp();
	const currentId = createMemo(() => queue.data.nowPlaying?.mediaSource.playedYoutubeVideoId || "");
	const videoTranscripts = useVideoTranscript(currentId);
	const lyrics = useLyrics(currentId);
	const transcripts = useTranscript(() => ({
		elapsed: queue.data.position || 0,
		transcripts: videoTranscripts.data() || [],
	}));
	let initialScroll = true;
	let lastScrollTime = 0;

	onMount(() => app.setTitle("Lyrics"));

	createEffect(() => {
		if (transcripts.index() === -1 && container) {
			container.scrollTop = 0;
		} else {
			if (Date.now() - lastScrollTime < 3000) return;
			const index = transcripts.index();
			if (initialScroll) {
				setTimeout(() => scrollTo(index), 200);
				initialScroll = false;
			} else {
				scrollTo(index);
			}
		}
	});

	const scrollTo = (index: number) => {
		const element = container?.childNodes[index] as HTMLDivElement;
		if (!element) return;
		container.scrollTop = element.offsetTop - container.offsetHeight / 2.5 + element.offsetHeight / 2;
	};

	const onContainerScrollHandler = () => {
		lastScrollTime = Date.now();
	};

	return (
		<Container
			size="full"
			extraClass="h-full overflow-y-auto flex flex-col items-center space-y-2.5"
			centered
			ref={container}
			onScroll={onContainerScrollHandler}
		>
			<Switch fallback={<LyricsNotFound />}>
				<Match when={videoTranscripts.isLoading() || lyrics.data.loading}>
					<Loading />
				</Match>
				<Match when={videoTranscripts.data().length}>
					<For each={videoTranscripts.data()}>
						{(t, i) => (
							<div
								class="space-y-1 py-2 text"
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
				</Match>
				<Match when={lyrics.data()} keyed>
					{({ content, description }) => (
						<>
							<For each={content.split(/\r?\n/)}>
								{(t) => (
									<div class="!text-lg md:!text-xl text-neutral-300 text" classList={{ "py-1": !t }}>
										{t}
									</div>
								)}
							</For>
							<div class="pt-8 text-neutral-400 text">{description}</div>
						</>
					)}
				</Match>
			</Switch>
		</Container>
	);
};
