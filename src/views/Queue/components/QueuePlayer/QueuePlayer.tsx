import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { EmptyNowPlaying, NowPlaying } from "./NowPlaying";
import { QueueActions } from "./QueueActions";
import { SeekSlider } from "./SeekSlider";

export const QueuePlayer: Component = () => {
	const queue = useQueue();

	return (
		<div class="relative z-0 flex flex-col items-start space-y-6 px-2 py-4 border border-neutral-600 rounded bg-black/25">
			<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
				{(track) => (
					<div class="w-full">
						<img
							src={track.video.thumbnails.at(0)?.url}
							class="absolute top-0 left-0 h-full w-full blur-2xl md:blur-3xl opacity-50 -z-[1000] pointer-events-none"
						/>
						<NowPlaying track={track} />
					</div>
				)}
			</Show>

			<div class="w-full px-2">
				<SeekSlider
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
	);
};
