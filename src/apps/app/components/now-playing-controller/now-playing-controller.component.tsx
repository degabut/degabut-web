import { Show, type Component } from "solid-js";

import { Button, ContextMenuButton, DelayUtil, Text } from "@common";
import { SourceBadge, useLikeMediaSource, useMediaSourceContextMenu } from "@media-source";
import { QueueActions, QueueButton, QueueSeekSlider, useQueue } from "@queue";
import { useSettings } from "@settings";
import { PreviewThumbnail } from "./components";

type NowPlayingControllerProps = {
	showMinimizeButton?: boolean;
};

export const NowPlayingController: Component<NowPlayingControllerProps> = (props) => {
	const queue = useQueue();
	const { setSettings } = useSettings();

	return (
		<div class="flex justify-center h-full w-full">
			<Show when={queue.data.nowPlaying} keyed>
				{(track) => (
					<img
						src={track.mediaSource.minThumbnailUrl}
						class="absolute top-0 w-full h-1/2 opacity-25 blur-3xl pointer-events-none"
					/>
				)}
			</Show>

			<div class="relative flex flex-col space-y-6 w-full h-full overflow-hidden max-w-lg">
				<div class="flex-row-center space-x-2 justify-between">
					<QueueButton.Options onClearQueue={() => queue.clear()} onStopQueue={() => queue.stop()} />

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

				<PreviewThumbnail
					mediaSource={queue.data.nowPlaying?.mediaSource}
					onClick={DelayUtil.countedThrottle(queue.jam, 350)}
				/>

				<div class="flex flex-col space-y-6">
					<Show when={queue.data.nowPlaying} keyed>
						{(track) => (
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
							</div>
						)}
					</Show>

					<div class="w-full px-2">
						<QueueSeekSlider
							disabled={queue.freezeState.seek}
							max={queue.data.nowPlaying?.mediaSource.duration || 0}
							value={(queue.data.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</div>

					<div class="space-y-4 pt-1.5">
						<QueueActions
							iconSize="lg"
							extraClass="flex-items-center justify-between"
							extraButtonClass="p-4"
						/>

						<div class="flex-row-center justify-between w-full">
							<Show when={queue.data.nowPlaying?.mediaSource} keyed>
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

							<Show when={props.showMinimizeButton}>
								<Button
									flat
									icon="chevronDown"
									title="Minimize"
									onClick={() => setSettings("app.player.minimized", true)}
									class="p-4"
									iconSize="lg"
								/>
							</Show>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
