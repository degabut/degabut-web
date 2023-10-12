import { QueueActions, QueueSeekSlider } from "@components/organisms";
import { Container } from "@components/templates";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { countedThrottle } from "@utils/throttle";
import { Component, Show, onMount } from "solid-js";
import { QueueEmptyPlayer, QueuePlayer } from "./components";

export const QueueNowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const throttledJam = countedThrottle(queue.jam, 350);

	onMount(() => app.setTitle("Queue"));

	return (
		<Container size="full" centered bottomPadless extraClass="h-full pb-8">
			<div class="relative z-0 flex flex-col space-y-6 h-full">
				<div class="flex-grow flex items-center justify-center h-full">
					<Show when={queue.data.nowPlaying} keyed>
						{({ video }) => (
							<>
								<img
									src={video.thumbnails.at(-1)?.url || ""}
									alt={video.title}
									class="object-cover aspect-square max-h-[40vh]"
									onClick={throttledJam}
								/>
								<img
									src={video.thumbnails.at(0)?.url}
									class="absolute top-0 left-0 h-full max-h-[50vh] w-full blur-3xl opacity-50 -z-[1000] pointer-events-none"
								/>
							</>
						)}
					</Show>
				</div>

				<div class="flex flex-col space-y-6 px-2 py-4">
					<Show when={queue.data.nowPlaying} keyed fallback={<QueueEmptyPlayer />}>
						{(track) => <QueuePlayer track={track} />}
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
