import { Show, type Component } from "solid-js";

import { Button, ContextMenuButton, DelayUtil, Text } from "@common";
import { SourceBadge, useLikeMediaSource, useMediaSourceContextMenu } from "@media-source";
import { QueueActions, QueueSeekSlider, useQueue } from "@queue";
import { useSettings } from "@settings";
import { PreviewThumbnail } from "./components";

export const NowPlayingController: Component = () => {
	const queue = useQueue();
	const { setSettings } = useSettings();

	return (
		<div class="flex flex-col space-y-6 h-full">
			<div class="relative flex-grow flex items-center justify-center px-4">
				<PreviewThumbnail
					mediaSource={queue.data.nowPlaying?.mediaSource}
					onClick={DelayUtil.countedThrottle(queue.jam, 350)}
				/>
			</div>

			<div class="relative flex flex-col space-y-6">
				<Show when={queue.data.nowPlaying} keyed>
					{(track) => {
						const nowPlayingContextMenu = useMediaSourceContextMenu(() => ({
							mediaSource: track.mediaSource,
						}));

						return (
							<div class="flex-row-center">
								<div class="grow flex flex-col space-y-1.5 px-2 text-shadow truncate">
									<Text.H2 truncate>{track.mediaSource.title}</Text.H2>

									<div class="flex-row-center space-x-2.5">
										<SourceBadge size="lg" type={track.mediaSource.type} />
										<Text.Body1 truncate class="text-neutral-300">
											{track.mediaSource.creator}
										</Text.Body1>
									</div>
								</div>

								<ContextMenuButton contextMenu={nowPlayingContextMenu()} />
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

				<div class="space-y-4">
					<QueueActions
						iconSize="lg"
						extraClass="flex-items-center justify-between space-x-2 px-2 pt-1.5"
						extraButtonClass="p-4"
					/>

					<div class="flex-row-center justify-between w-full space-x-2 px-2 pt-1.5">
						<Show
							when={queue.data.nowPlaying?.mediaSource}
							keyed
							fallback={<Button flat icon="heartLine" disabled class="p-4" iconSize="lg" />}
						>
							{(mediaSource) => {
								const liked = useLikeMediaSource(() => mediaSource.id);
								return (
									<Button
										flat
										icon={liked?.isLiked() ? "heart" : "heartLine"}
										iconClassList={{ "text-brand-600": liked?.isLiked() }}
										onClick={liked?.toggle}
										class="p-4"
										iconSize="lg"
									/>
								);
							}}
						</Show>

						<Show when={queue.data.nowPlaying} keyed>
							{(track) => (
								<div class="flex-row-center space-x-1.5 py-4 truncate">
									<Show when={track.requestedBy.avatar} keyed>
										{(avatar) => <img src={avatar} class="h-5 w-5 rounded-full" />}
									</Show>
									<Text.Caption2 class="truncate">{track.requestedBy.displayName}</Text.Caption2>
								</div>
							)}
						</Show>

						<Button
							flat
							icon="chevronDown"
							title="Minimize"
							onClick={() => setSettings("app.player.minimized", true)}
							class="p-4"
							iconSize="lg"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
