import { AppRoutes } from "@app/routes";
import { A, Icon, Text } from "@common";
import { MediaSource } from "@media-source";
import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<div class="bg-neutral-950 w-full h-full p-1.5">
			<A href={AppRoutes.Player} class="flex-row-center items-center p-1.5 z-10 rounded bg-gray-800">
				<div class="flex-row-center space-x-3 truncate">
					<div class="h-12 w-12 border border-neutral-600 rounded" />

					<Text.Body1 class="text-neutral-400">Nothing is playing</Text.Body1>
				</div>
			</A>
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

					<A
						href={AppRoutes.Player}
						class="relative overflow-hidden flex-row-center rounded z-0"
						title={mediaSource.title}
					>
						<img
							src={mediaSource.minThumbnailUrl}
							class="absolute top-0 left-0 h-full w-full blur-2xl opacity-75 -z-10 pointer-events-none"
						/>

						<MediaSource.List
							mediaSource={mediaSource}
							extraContainerClass="text-shadow"
							right={() => <Icon name="musicNotes" extraClass="w-12 h-12 fill-white/10" />}
						/>
					</A>
				</div>
			)}
		</Show>
	);
};