import { Show, type Component } from "solid-js";

import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { QueueTrackList } from "@app/views/queue/components/queue-tabs/components";
import { Button, ContextMenuButton, DelayUtil, Divider, Text, useNavigate } from "@common";
import { useDesktop } from "@desktop";
import { SourceBadge, useLikeMediaSource, useMediaSourceContextMenu } from "@media-source";
import { QueueActions, QueueButton, QueueSeekSlider, VolumeSlider, useQueue } from "@queue";
import { useSettings } from "@settings";
import { PreviewThumbnail } from "./components";

export const NowPlayingController: Component = () => {
	const app = useApp()!;
	const { settings, setSettings } = useSettings();
	const desktop = useDesktop();
	const queue = useQueue()!;
	const navigate = useNavigate();

	return (
		<div class="relative flex-col-center w-full h-full">
			<Show when={queue.data.nowPlaying} keyed>
				{(track) => (
					<img
						src={track.mediaSource.minThumbnailUrl}
						class="absolute top-0 w-full h-2/3 opacity-40 blur-3xl pointer-events-none"
					/>
				)}
			</Show>

			<div class="relative flex flex-col shrink-0 w-full min-h-full max-h-fit overflow-hidden max-w-lg ">
				<div class="flex-row-center space-x-2 justify-between">
					<QueueButton.Options
						disabled={queue.data.empty}
						onClearQueue={queue.clear}
						onStopQueue={queue.stop}
					/>

					<Show when={queue.data.nowPlaying} keyed>
						{(track) => (
							<div class="flex-row-center space-x-1.5 truncate text-shadow">
								<Show when={track.requestedBy.avatar} keyed>
									{(avatar) => <img src={avatar} class="h-5 w-5 rounded-full" />}
								</Show>
								<Text.Caption2 class="truncate">{track.requestedBy.displayName}</Text.Caption2>
							</div>
						)}
					</Show>

					<Show when={queue.data.nowPlaying} keyed>
						{(track) => {
							const nowPlayingContextMenu = useMediaSourceContextMenu(() => ({
								mediaSource: track.mediaSource,
							}));

							return <ContextMenuButton contextMenu={nowPlayingContextMenu()} />;
						}}
					</Show>
				</div>

				<div class="h-full min-h-2 max-h-4 shrink" />

				<div class="w-full h-full px-2 shrink">
					<PreviewThumbnail
						mediaSource={queue.data.nowPlaying?.mediaSource}
						onClick={DelayUtil.countedThrottle(queue.jam, 350)}
					/>
				</div>

				<div class="h-full max-h-6 shrink" />

				<Show when={queue.data.nowPlaying} keyed>
					{(track) => {
						const liked = useLikeMediaSource(() => track.mediaSource.id);

						return (
							<div class="flex-row-center">
								<div class="grow flex flex-col space-y-1 px-2 text-shadow truncate">
									<Text.H3 truncate>{track.mediaSource.title}</Text.H3>

									<div class="flex-row-center space-x-1.5">
										<SourceBadge size="lg" type={track.mediaSource.type} />
										<Text.Body1 truncate class="text-neutral-300">
											{track.mediaSource.creator}
										</Text.Body1>
									</div>
								</div>

								<Button
									flat
									icon={liked?.isLiked() ? "heart" : "heartLine"}
									theme={liked?.isLiked() ? "brand" : "default"}
									onClick={liked?.toggle}
									class="p-4"
									iconSize="lg"
								/>
							</div>
						);
					}}
				</Show>

				<div class="w-full px-2 pt-4">
					<QueueSeekSlider
						disabled={queue.freezeState.seek}
						max={queue.data.nowPlaying?.mediaSource.duration || 0}
						value={(queue.data.position || 0) / 1000}
						onChange={(value) => queue.seek(value * 1000)}
					/>
				</div>

				<div class="h-full min-h-6 max-h-8 shrink-[2]" />

				<QueueActions iconSize="lg" extraClass="flex-items-center justify-around" extraButtonClass="p-4" />

				<div class="h-full min-h-4 max-h-6 md:max-h-10 shrink-[2]" />

				<div class="grid grid-cols-5 gap-x-3 px-1.5">
					<div class="w-9 h-9 mx-auto">
						<Show when={queue.data.nowPlaying} keyed>
							{(track) => (
								<Button
									flat
									onClick={() => app.promptAddMediaToPlaylist(track.mediaSource)}
									class="p-2.5"
									iconSize="md"
									icon="playlistPlus"
									title="Add to Playlist"
								/>
							)}
						</Show>
					</div>

					<div class="col-span-3 mx-auto">
						<Show when={settings["discord.rpc"]}>
							<VolumeSlider
								extraContainerClass="max-w-40"
								value={settings["botVolumes"][queue.bot().id]}
								onChange={(volume) => {
									setSettings("botVolumes", { [queue.bot().id]: volume });
									desktop?.ipc.send?.("set-bot-volume", { volume, id: queue.bot().id });
								}}
								onMuteToggled={(isMuted) => {
									desktop?.ipc.send?.("set-bot-volume", {
										volume: isMuted ? 0 : settings["botVolumes"][queue.bot().id],
										id: queue.bot().id,
									});
								}}
							/>
						</Show>
					</div>

					<div class="mx-auto">
						<QueueButton.Lyrics
							iconSize="md"
							extraClass="p-2.5"
							onClick={() => navigate(AppRoutes.Lyrics)}
						/>
					</div>
				</div>

				<div class="h-full min-h-2 max-h-4 md:max-h-6 shrink-[2]" />
			</div>

			<Show when={!queue.data.empty && queue.data.tracks.length}>
				<Divider extraClass="my-8" dark />
				<div class="w-full max-w-lg space-y-4 h-full min-h-full">
					<Text.H2 class="text-center">Queue</Text.H2>
					<QueueTrackList />
					<div class="h-8" />
				</div>
			</Show>
		</div>
	);
};
