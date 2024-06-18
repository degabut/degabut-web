import { Show, type Component } from "solid-js";

import { useApp } from "@app/hooks";
import { AppRoutes } from "@app/routes";
import { Button, ContextMenuButton, DelayUtil, Text, useNavigate } from "@common";
import { SourceBadge, useLikeMediaSource, useMediaSourceContextMenu } from "@media-source";
import { QueueActions, QueueButton, QueueSeekSlider, useQueue } from "@queue";
import { PreviewThumbnail } from "./components";

export const NowPlayingController: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="flex justify-center h-full w-full">
			<Show when={queue.data.nowPlaying} keyed>
				{(track) => (
					<img
						src={track.mediaSource.minThumbnailUrl}
						class="absolute top-0 w-full h-2/3 opacity-25 blur-3xl pointer-events-none"
					/>
				)}
			</Show>

			<div class="relative flex flex-col w-full h-full overflow-hidden max-w-lg">
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

				<div class="w-full h-full py-6 shrink-[1]">
					<PreviewThumbnail
						mediaSource={queue.data.nowPlaying?.mediaSource}
						onClick={DelayUtil.countedThrottle(queue.jam, 350)}
					/>
				</div>

				<div class="space-y-6">
					<Show when={queue.data.nowPlaying} keyed>
						{(track) => {
							const liked = useLikeMediaSource(() => track.mediaSource.id);

							return (
								<div class="flex-row-center">
									<div class="grow flex flex-col space-y-2 px-2 text-shadow truncate">
										<Text.H2 truncate>{track.mediaSource.title}</Text.H2>

										<div class="flex-row-center space-x-2.5">
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

					<div class="w-full px-2">
						<QueueSeekSlider
							disabled={queue.freezeState.seek}
							max={queue.data.nowPlaying?.mediaSource.duration || 0}
							value={(queue.data.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</div>

					<div class="space-y-2.5">
						<QueueActions
							iconSize="lg"
							extraClass="flex-items-center justify-between"
							extraButtonClass="p-4"
						/>

						<div class="flex flex-row-reverse justify-between px-1.5">
							<QueueButton.Lyrics
								iconSize="md"
								extraClass="p-2.5"
								onClick={() => navigate(AppRoutes.Lyrics)}
							/>

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
					</div>
				</div>

				<div class="h-full max-h-8 shrink-[2]" />
			</div>
		</div>
	);
};
