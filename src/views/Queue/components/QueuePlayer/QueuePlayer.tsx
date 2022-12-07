import { RouterLink } from "@components/A";
import { Divider } from "@components/Divider";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { NowPlaying } from "./NowPlaying";
import { QueueActions } from "./QueueActions";
import { SeekSlider } from "./SeekSlider";

const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-16 !h-16 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};

export const QueuePlayer: Component = () => {
	const queue = useQueue();

	return (
		<div class="relative flex flex-col lg:items-start space-y-1.5 p-2 border border-neutral-600 rounded bg-black/[25%] text-shadow">
			<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
				{(track) => <NowPlaying track={track} />}
			</Show>

			<div class="w-full">
				<Show
					when={queue.data.nowPlaying?.video.duration}
					fallback={
						<div class="h-8 px-2">
							<Divider light extraClass="h-7" />
						</div>
					}
				>
					<SeekSlider
						max={queue.data.nowPlaying?.video.duration || 0}
						value={(queue.data.position || 0) / 1000}
						onChange={(value) => queue.seek(value * 1000)}
					/>
				</Show>
			</div>

			<QueueActions
				extended
				extraClass="flex-wrap justify-between md:justify-start w-full md:space-x-6 px-2 pt-1.5"
			/>
		</div>
	);
};
