import { useApp } from "@app/providers";
import { Button, Container, Divider, Icon, Input, Spinner, Text, useTimedText } from "@common";
import { LyricsUtil, useLyrics, usePlayerSpeed, useQueue } from "@queue";
import { useSettings } from "@settings";
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
	const speed = usePlayerSpeed();
	const { settings, setSettings } = useSettings();
	const lyrics = useLyrics();
	const timedText = useTimedText(() => {
		const lyrics = syncedLyrics();
		return {
			offset: settings["app.lyrics.offset"],
			elapsed: queue.data.position / 1000,
			timedTexts: lyrics?.content || [],
			speed: speed(),
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
			.at(0);

		return bestMatch?.synced
			? {
					source: bestMatch.source,
					content: LyricsUtil.parse(bestMatch.synced).synced,
			  }
			: null;
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
				source: unsyncedLyrics.source,
			};
		}

		const synced = lyricsOptions.find((l) => l.synced);
		if (synced?.synced) {
			return {
				content:
					LyricsUtil.parse(synced.synced)
						.synced?.map((s) => s.text)
						.join("\n") || "",
				source: synced.source,
			};
		}

		return null;
	};

	const source = () => {
		return (syncedLyrics()?.source || normalLyrics()?.source || "-").toUpperCase();
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
		<div class="flex flex-col h-full overflow-y-auto space-y-0.5 md:space-y-2">
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
						<For each={syncedLyrics()?.content}>
							{(t, i) => (
								<div
									class="space-y-1 py-2 text"
									classList={{
										"text-neutral-300": i() < timedText.index(),
										"text-neutral-500": i() > timedText.index(),
										"!text-neutral-300": i() === timedText.index() + 1,
										"!text-neutral-400": i() === timedText.index() + 2,
										"text-xl md:text-2xl": i() !== timedText.index(),
										"font-semibold text-2xl md:text-3xl !text-neutral-100":
											i() === timedText.index(),
									}}
								>
									<div>{t.text}</div>
								</div>
							)}
						</For>
					</Match>
					<Match when={normalLyrics()} keyed>
						{({ content }) => (
							<>
								<For each={content.split(/\r?\n/)}>
									{(t) => (
										<div
											class="!text-lg md:!text-xl text-neutral-300 text"
											classList={{ "py-1": !t }}
										>
											{t}
										</div>
									)}
								</For>
							</>
						)}
					</Match>
				</Switch>
			</Container>

			<div class="shrink">
				<Container
					padless
					extraClass={"h-full py-3 px-4 md:px-8 flex flex-row items-center space-x-4 md:space-x-6"}
				>
					<div class="flex flex-row h-full items-center space-x-4">
						<Text.Caption1>Offset</Text.Caption1>
						<div class="flex flex-row h-full space-x-2">
							<Input
								type="number"
								outlined
								dense
								prefix={() => (
									<Button
										flat
										onClick={() => setSettings("app.lyrics.offset", (v) => v - 100)}
										class="px-2"
									>
										-
									</Button>
								)}
								class="h-full w-36 appearance-none"
								inputExtraClass="text-center"
								suffix={() => (
									<div class="flex flex-row items-center space-x-1.5">
										<Text.Caption1>s</Text.Caption1>
										<Button
											flat
											onClick={() => setSettings("app.lyrics.offset", (v) => v + 100)}
											class="px-2"
										>
											+
										</Button>
									</div>
								)}
								value={settings["app.lyrics.offset"] / 1000}
								step={0.1}
								onChange={(e) => {
									setSettings("app.lyrics.offset", +e.currentTarget.value * 1000);
								}}
							/>
						</div>
					</div>
					<Divider vertical dark extraClass="h-full" />
					<Text.Caption1>Source: {source()}</Text.Caption1>
				</Container>
			</div>
		</div>
	);
};
