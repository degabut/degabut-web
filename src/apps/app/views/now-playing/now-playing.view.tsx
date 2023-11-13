import { useApp } from "@app/hooks";
import { Container, ContextMenuButton, RouterLink, Text } from "@common/components";
import { DelayUtil } from "@common/utils";
import { QueueActions, QueueSeekSlider } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show, onMount } from "solid-js";

export const QueueNowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const throttledJam = DelayUtil.countedThrottle(queue.jam, 350);

	onMount(() => app.setTitle("Queue"));

	return (
		<Container size="full" centered bottomPadless extraClass="h-full pb-12">
			<div class="relative z-0 flex flex-col space-y-6 h-full">
				<div class="flex-grow flex items-center justify-center px-4">
					<Show when={queue.data.nowPlaying} keyed>
						{({ video }) => (
							<>
								<img
									src={video.thumbnails.at(-1)?.url || ""}
									alt={video.title}
									class="object-cover max-w-[50vh] w-full aspect-square rounded-2xl"
									onClick={throttledJam}
								/>
								<img
									src={video.thumbnails.at(0)?.url}
									class="absolute top-0 left-0 h-full max-h-[50vh] w-full blur-3xl -z-[1000] pointer-events-none"
								/>
							</>
						)}
					</Show>
				</div>

				<div class="flex flex-col space-y-6 py-4">
					<Show
						when={queue.data.nowPlaying}
						keyed
						fallback={
							<RouterLink
								href="/recommendation"
								class="flex flex-row items-center w-full space-x-4 px-1.5 py-2 hover:bg-white/[2.5%] rounded"
							>
								<div class="!w-16 !h-16 rounded border border-neutral-600" />
								<div class="text-neutral-400">It's lonely here...</div>
							</RouterLink>
						}
					>
						{(track) => (
							<div class="flex-row-center">
								<div class="grow flex flex-col space-y-1.5 px-2 text-shadow truncate">
									<Text.H2 truncate>{track.video.title}</Text.H2>
									<Text.Body1 truncate class="text-neutral-300">
										{track.video.channel?.name}
									</Text.Body1>
									<div class="flex-row-center space-x-2 truncate">
										<Show when={track.requestedBy.avatar} keyed>
											{(avatar) => <img src={avatar} class="h-6 w-6 rounded-full" />}
										</Show>
										<Text.Caption1>{track.requestedBy.displayName}</Text.Caption1>
									</div>
								</div>

								<ContextMenuButton
									contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
										video: track.video,
										appStore: app,
										queueStore: queue,
										navigate,
									})}
								/>
							</div>
						)}
					</Show>

					<div class="w-full px-2">
						<QueueSeekSlider
							disabled={queue.freezeState.seek}
							max={queue.data.nowPlaying?.video.duration || 0}
							value={(queue.data.position || 0) / 1000}
							onChange={(value) => queue.seek(value * 1000)}
						/>
					</div>

					<QueueActions
						extended
						extraClass="flex-wrap justify-between md:justify-start w-full md:space-x-6 px-2 pt-1.5"
					/>
				</div>
			</div>
		</Container>
	);
};
