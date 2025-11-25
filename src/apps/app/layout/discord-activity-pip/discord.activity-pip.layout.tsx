import { Button, Divider, Icon, Spinner, Text, useContextMenu, useTimedText } from "@common";
import { SourceBadge, useLikeMediaSource } from "@media-source";
import { LyricsUtil, QueueActions, QueueSeekSlider, useLyrics, useQueue } from "@queue";
import { useSettings } from "@settings";
import { onMount, Show, type Component } from "solid-js";

type Props = {
	bottomPadding?: boolean;
};

const EmptyNowPlaying: Component<Props> = (props) => {
	return (
		<div class="flex flex-col justify-center bg-neutral-950 w-full h-full">
			<div class="grow flex items-center justify-center">
				<div class=" flex-row-center justify-center h-20 w-20 aspect-square rounded-md border-2 border-neutral-700">
					<Icon name="degabutThin" size="3xl" class="text-neutral-700" />
				</div>
			</div>
			<Divider dark />
			<div class="flex items-center h-[3.5rem] px-4">
				<Text.H3 class="truncate text-neutral-500 hidden discord-pip:block">It's lonely here...</Text.H3>
			</div>

			<Show when={props.bottomPadding}>
				<div class="h-3 shrink-0" />
			</Show>
		</div>
	);
};

const Lyrics: Component = () => {
	const queue = useQueue()!;
	const lyrics = useLyrics();
	const timedText = useTimedText(() => {
		const lyrics = syncedLyrics();
		return {
			elapsed: queue.data.position / 1000,
			timedTexts: lyrics || [],
		};
	});
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

	const lines = () => {
		const index = timedText.index();
		return {
			previous: syncedLyrics()?.[index - 1]?.text || "",
			current: syncedLyrics()?.[index]?.text || "",
			next: syncedLyrics()?.[index + 1]?.text || "",
		};
	};

	return (
		<div
			class="relative h-full w-full flex flex-col justify-center overflow-hidden"
			classList={{ "items-center": lyrics.data.loading }}
		>
			<Show when={!lyrics.data.loading} fallback={<Spinner />}>
				<Show
					when={lyrics.data()?.length}
					fallback={<Text.Body2 class="text-neutral-400 text-center">No Lyrics Found :(</Text.Body2>}
				>
					<div class="relative max-h-8">
						<Text.Caption1 class="absolute bottom-0 left-0 px-4">{lines().previous}</Text.Caption1>
					</div>
					<Text.Body1 class="text-white font-medium px-4 py-2">{lines().current}</Text.Body1>
					<div class="relative max-h-8">
						<Text.Caption1 class="absolute top-0 left-0 px-4">{lines().next}</Text.Caption1>
					</div>
				</Show>
			</Show>
		</div>
	);
};

export const DiscordActivityPip: Component = () => {
	const queue = useQueue()!;
	const contextMenu = useContextMenu()!;
	const { settings, setSettings } = useSettings()!;

	const like = useLikeMediaSource(() => queue.data.nowPlaying?.mediaSource.id || "")!;

	onMount(() => {
		contextMenu.setIsShowContextMenu(false);
	});

	const user = () => queue.data.nowPlaying?.requestedBy || queue.data.nowPlaying?.autoplayData?.member;

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying bottomPadding />}>
			{({ mediaSource }) => (
				<div class="w-full h-full flex flex-col">
					<div class="group/item-list flex items-center justify-center relative w-full h-full overflow-hidden">
						<Show when={!settings["discord.pip.lyrics"]} fallback={<Lyrics />}>
							<img
								src={mediaSource.minThumbnailUrl}
								class="absolute blur-2xl top-0 left-0 h-full w-full opacity-50"
							/>
							<img
								src={mediaSource.maxThumbnailUrl}
								class="relative h-20 w-20 rounded-lg object-cover m-2.5"
							/>
						</Show>

						<div class="group-hover/item-list:opacity-100 opacity-0 transition-all absolute flex-row-center justify-center w-full h-full  bg-black/75">
							<QueueActions extraClass="w-full justify-between max-w-64" iconSize="lg" />
						</div>

						<div class="absolute bottom-0 left-0 w-full z-10">
							<QueueSeekSlider
								dense
								extraLabelClass={`px-2.5 text-shadow ${
									settings["discord.pip.lyrics"] ? "invisible" : "visible"
								}`}
								value={queue.data.position / 1000}
								onChange={(v) => queue.seek(v * 1000)}
								max={mediaSource.duration}
								viewOnly
							/>
						</div>
					</div>

					<div class="relative flex flex-row w-full bg-neutral-950 space-x-2 px-4 pr-2 py-2">
						<div class="grow flex flex-col space-y-1 truncate justify-center">
							<Text.Body1 class="truncate font-medium text-sm" title={mediaSource.title}>
								{mediaSource.title}
							</Text.Body1>

							<div class="flex-row-center w-full truncate space-x-1.5" title={mediaSource.creator}>
								<SourceBadge type={mediaSource.type} size="md" />
								<Text.Caption1 class="!text-neutral-400 w-full grow truncate !text-xs">
									{mediaSource.creator}
								</Text.Caption1>

								<Show when={user()} keyed>
									{(u) => (
										<>
											<Show when={queue.data.nowPlaying?.autoplayData}>
												<Text.Caption2 class="!text-xxs">for</Text.Caption2>
											</Show>
											<Show when={u.avatar} keyed>
												{(avatar) => <img src={avatar} class="h-4 w-4 rounded-full" />}
											</Show>
											<Text.Caption2 class="shrink !text-xxs">{u.displayName}</Text.Caption2>
											<Show when={queue.data.nowPlaying?.autoplayData}>
												<Icon name="stars" size="sm" class="text-brand-500 shrink-0" />
											</Show>
										</>
									)}
								</Show>
							</div>
						</div>

						<Show when={settings["discord.pip.interactive"]}>
							<div class="flex space-x-0.5">
								<Button
									flat
									icon={like.isLiked() ? "heart" : "heartLine"}
									iconSize={"md"}
									class="p-2 visible"
									theme={like.isLiked() ? "brand" : "secondary"}
									title={like.isLiked() ? "Unlike" : "Like"}
									on:click={(e) => {
										e.stopImmediatePropagation();
										like.toggle();
									}}
								/>
								<Button
									flat
									icon={"microphone"}
									iconSize={"md"}
									class="p-2 visible"
									theme={settings["discord.pip.lyrics"] ? "brand" : "secondary"}
									title={settings["discord.pip.lyrics"] ? "Hide Lyrics" : "Show Lyrics"}
									on:click={(e) => {
										e.stopImmediatePropagation();
										setSettings("discord.pip.lyrics", (v) => !v);
									}}
								/>
							</div>
						</Show>
					</div>

					<Show when={settings["discord.pip.interactive"]}>
						<div class="h-3 shrink-0" />
					</Show>
				</div>
			)}
		</Show>
	);
};
