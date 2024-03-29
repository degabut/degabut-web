import { Icon, RouterLink, Text } from "@common/components";
import { MediaSource } from "@media-source/components";
import { useQueue } from "@queue/hooks";
import { Component, Show } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<div class="bg-neutral-950 w-full h-full p-1.5">
			<RouterLink
				href="/queue/player"
				class="flex-row-center items-center p-2 z-10 rounded cursor-pointer bg-gray-800"
			>
				<div class="flex-row-center space-x-3 truncate">
					<div class="h-12 w-12 border border-neutral-600 rounded" />

					<Text.Body1 class="text-neutral-400">Nothing is playing</Text.Body1>
				</div>
			</RouterLink>
		</div>
	);
};

export const QueueNowPlaying: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
			{({ mediaSource }) => (
				<div class="bg-neutral-950 w-full h-full relative p-1.5">
					<Show when={queue.data.position} keyed>
						{(position) => (
							<div
								class="absolute top-0 bg-brand-500 h-0.5 -mx-1.5"
								style={{ width: `${position / 10 / mediaSource.duration}%` }}
							/>
						)}
					</Show>

					<RouterLink
						href="/queue/player"
						class="relative overflow-hidden flex-row-center z-10 rounded cursor-pointer bg-gray-800"
						title={mediaSource.title}
					>
						<img
							src={mediaSource.minThumbnailUrl}
							class="absolute top-0 left-0 h-full w-full blur-2xl -z-10 pointer-events-none"
						/>

						<MediaSource.List mediaSource={mediaSource} extraContainerClass="text-shadow" />

						<Icon name="musicNotes" extraClass="absolute right-2 w-12 h-12 fill-white/10" />
					</RouterLink>
				</div>
			)}
		</Show>
	);
};
