import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { EmptyNowPlaying, NowPlaying } from "./NowPlaying";
import { QueueActions } from "./QueueActions";
import { SeekSlider } from "./SeekSlider";

export const QueuePlayer: Component = () => {
	const queue = useQueue();

	return (
		<div class="relative z-0 flex flex-col space-y-6 h-full">
			<div class="flex-grow flex items-center justify-center h-full">
				<Show when={queue.data.nowPlaying} keyed>
					{(track) => (
						<>
							<img
								src={track.video.thumbnails.at(-1)?.url || ""}
								alt={track.video.title}
								class="object-cover aspect-square max-h-[40vh]"
							/>
							<img
								src={track.video.thumbnails.at(0)?.url}
								class="absolute top-0 left-0 h-full w-full blur-2xl md:blur-3xl opacity-50 -z-[1000] pointer-events-none"
							/>
						</>
					)}
				</Show>
			</div>

			<div class="flex flex-col space-y-6 border border-neutral-700 rounded bg-black/25 px-2 py-4">
				<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
					{(track) => <NowPlaying track={track} />}
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
		</div>
	);
};
