import { useApp } from "@app/providers";
import { Container, Icon, Spinner } from "@common";
import { useQueue } from "@queue";
import { useLyrics } from "@youtube";
import { For, Match, Switch, createMemo, onMount, type Component } from "solid-js";
import "./lyrics.style.css";

const LyricsNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="microphone" extraClass="text-neutral-500 w-24 h-24" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Lyrics Found</div>
		</div>
	);
};

const Loading: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Spinner size="2xl" />
		</div>
	);
};

export const Lyrics: Component = () => {
	let container!: HTMLDivElement;
	const queue = useQueue()!;
	const app = useApp()!;
	const currentId = createMemo(() => queue.data.nowPlaying?.mediaSource.playedYoutubeVideoId || "");
	const lyrics = useLyrics(currentId);
	// let initialScroll = true;
	// let lastScrollTime = 0;

	onMount(() => app.setTitle("Lyrics"));

	// createEffect(() => {
	// 	if (timedText.index() === -1 && container) {
	// 		container.scrollTop = 0;
	// 	} else {
	// 		if (Date.now() - lastScrollTime < 3000) return;
	// 		const index = timedText.index();
	// 		if (initialScroll) {
	// 			setTimeout(() => scrollTo(index), 200);
	// 			initialScroll = false;
	// 		} else {
	// 			scrollTo(index);
	// 		}
	// 	}
	// });

	// const scrollTo = (index: number) => {
	// 	const element = container?.childNodes[index] as HTMLDivElement;
	// 	if (!element) return;
	// 	container.scrollTop = element.offsetTop - container.offsetHeight / 2.5 + element.offsetHeight / 2;
	// };

	// const onContainerScrollHandler = () => {
	// 	lastScrollTime = Date.now();
	// };

	return (
		<Container
			size="full"
			extraClass="h-full flex flex-col items-center space-y-2.5"
			centered
			ref={container}
			// onScroll={onContainerScrollHandler}
		>
			<Switch fallback={<LyricsNotFound />}>
				<Match when={lyrics.data.loading}>
					<Loading />
				</Match>
				{/* <Match when={videoTranscripts.data().length}>
					<For each={videoTranscripts.data()}>
						{(t, i) => (
							<div
								class="space-y-1 py-2 text"
								classList={{
									"text-neutral-300": i() < timedText.index(),
									"text-neutral-500": i() > timedText.index(),
									"!text-neutral-300": i() === timedText.index() + 1,
									"!text-neutral-400": i() === timedText.index() + 2,
									"text-xl md:text-2xl": i() !== timedText.index(),
									"font-semibold text-2xl md:text-3xl !text-neutral-100": i() === timedText.index(),
								}}
							>
								<For each={t.texts}>{(text) => <div>{text}</div>}</For>
							</div>
						)}
					</For>
				</Match> */}
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
