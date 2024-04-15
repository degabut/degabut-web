import { Text } from "@common";
import { SourceBadge } from "@media-source";
import { QueueSeekSlider, useQueue } from "@queue";
import { Show, type Component } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<div class="flex flex-col justify-center bg-neutral-950 w-full h-full overflow-hidden p-4 space-y-4">
			<div class="flex-row-center space-x-4">
				<div class="w-16 aspect-square rounded-md border-2 border-neutral-700" />
				<Text.H3 class="truncate text-neutral-500">It's lonely here...</Text.H3>
			</div>

			<div class="px-1">
				<QueueSeekSlider value={0} max={0} />
			</div>
		</div>
	);
};

export const DiscordActivityPip: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
			{({ mediaSource }) => (
				<div class="relative w-full h-full">
					<img
						src={mediaSource.maxThumbnailUrl}
						class="absolute blur-xl top-0 left-0 h-full w-full opacity-50"
					/>

					<div class="flex flex-col justify-center bg-neutral-950 w-full h-full overflow-hidden p-4 space-y-4 text-shadow">
						<div class="flex-row-center space-x-3 z-10">
							<img src={mediaSource.maxThumbnailUrl} class="w-16 aspect-square object-cover rounded-md" />
							<div class="truncate space-y-1">
								<Text.H3 class="truncate">{mediaSource.title}</Text.H3>
								<div class="flex-row-center space-x-1.5">
									<SourceBadge type={mediaSource.type} size="lg" />
									<Text.Body2 class="text-neutral-200 truncate">{mediaSource.creator}</Text.Body2>
								</div>
							</div>
						</div>

						<div class="px-1 z-10">
							<QueueSeekSlider value={queue.data.position / 1000} max={mediaSource.duration} />
						</div>
					</div>
				</div>
			)}
		</Show>
	);
};
