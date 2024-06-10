import { useApp } from "@app/hooks";
import { AppRoutes } from "@app/routes";
import { Container, ContextMenuButton, DelayUtil, Text, useNavigate } from "@common";
import { SourceBadge, useMediaSourceContextMenu } from "@media-source";
import { QueueActions, QueueButton, QueueSeekSlider, useQueue } from "@queue";
import { Show, onMount, type Component } from "solid-js";
import { PreviewThumbnail } from "./components";

export const QueueNowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	onMount(() => app.setTitle("Queue"));

	return (
		<Container size="full" centered bottomPadless extraClass="h-full pb-12">
			<div class="relative flex flex-col space-y-6 h-full">
				<div class="flex-grow flex items-center justify-center px-4">
					<PreviewThumbnail
						mediaSource={queue.data.nowPlaying?.mediaSource}
						onClick={DelayUtil.countedThrottle(queue.jam, 350)}
					/>
				</div>

				<div class="flex flex-col space-y-6 py-4">
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

										<div class="flex-row-center space-x-2 truncate">
											<Show when={track.requestedBy.avatar} keyed>
												{(avatar) => <img src={avatar} class="h-6 w-6 rounded-full" />}
											</Show>
											<Text.Caption1>{track.requestedBy.displayName}</Text.Caption1>
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

					<QueueActions
						iconSize="xl"
						extra={() => (
							<QueueButton.Lyrics
								extraClass="p-4 grow justify-center"
								iconSize="xl"
								onClick={() => navigate(AppRoutes.Lyrics)}
							/>
						)}
						extraClass="flex-items-center w-full space-x-2 px-2 pt-1.5"
						extraButtonClass="p-4 grow justify-center"
					/>
				</div>
			</div>
		</Container>
	);
};
