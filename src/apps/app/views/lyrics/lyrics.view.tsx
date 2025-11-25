import { useApp } from "@app/providers";
import { Container, Icon, Spinner, useTimedText } from "@common";
import { LyricsUtil, useLyrics, useQueue } from "@queue";
import { For, Match, Switch, createEffect, onMount, type Component } from "solid-js";
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
	const app = useApp()!;
	const queue = useQueue()!;
	const lyrics = useLyrics();
	const timedText = useTimedText(() => {
		const lyrics = syncedLyrics();
		return {
			elapsed: queue.data.position / 1000,
			timedTexts: lyrics || [],
		};
	});

	onMount(() => app.setTitle("Lyrics"));

	let initialScroll = true;
	let lastScrollTime = 0;

	const syncedLyrics = () => {
		const nowPlaying = queue.data.nowPlaying;
		if (!nowPlaying) return null;

		const lyricsOptions = lyrics.data();
		if (!lyricsOptions?.length) return null;

		const bestMatch = lyricsOptions
			.sort((a, b) => {
				const aDiff = Math.abs(a.duration - nowPlaying.mediaSource.duration);
				const bDiff = Math.abs(b.duration - nowPlaying.mediaSource.duration);
				return aDiff - bDiff;
			})
			.at(0)?.synced;

		return bestMatch ? LyricsUtil.parse(bestMatch).synced : null;
	};

	const normalLyrics = () => {
		const nowPlaying = queue.data.nowPlaying;
		if (!nowPlaying) return null;

		const lyricsOptions = lyrics.data();
		if (!lyricsOptions?.length) return null;

		const unsyncedLyrics = lyricsOptions.find((l) => l.unsynced);
		if (unsyncedLyrics?.unsynced) {
			return {
				content: unsyncedLyrics.unsynced,
				description: unsyncedLyrics.source,
			};
		}

		const synced = lyricsOptions.find((l) => l.synced);
		if (synced?.synced) {
			return {
				content:
					LyricsUtil.parse(synced.synced)
						.synced?.map((s) => s.text)
						.join("\n") || "",
				description: synced.source,
			};
		}

		return null;
	};

	createEffect(() => {
		if (timedText.index() === -1 && container) {
			container.scrollTop = 0;
		} else {
			if (Date.now() - lastScrollTime < 3000) return;
			const index = timedText.index();
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
			extraClass="h-full flex flex-col items-center space-y-2.5"
			centered
			ref={container}
			onScroll={onContainerScrollHandler}
		>
			<Switch fallback={<LyricsNotFound />}>
				<Match when={lyrics.data.loading}>
					<Loading />
				</Match>
				<Match when={syncedLyrics()} keyed>
					<For each={syncedLyrics()}>
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
								<div>{t.text}</div>
							</div>
						)}
					</For>
				</Match>
				<Match when={normalLyrics()} keyed>
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
