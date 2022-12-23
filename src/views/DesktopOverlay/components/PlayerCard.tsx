import { Text } from "@components/Text";
import { useQueue } from "@hooks/useQueue";
import { QueueActions, SeekSlider } from "@views/Queue";
import { Component, Show } from "solid-js";
import { Card } from "./Card";

export const PlayerCard: Component = () => {
	const queue = useQueue();

	return (
		<Card>
			<Show when={queue.data.nowPlaying} keyed>
				{({ video }) => (
					<div class="grow flex-col-center justify-evenly space-y-6 h-full">
						<img src={video.thumbnails.at(-1)?.url || ""} class="grow h-12 max-h-96 object-cover rounded" />

						<div class="flex-col-center w-full text-shadow space-y-2 text-center">
							<Text.H1 truncate class="w-full text-2xl text-shadow">
								{video.title}
							</Text.H1>
							<Show when={video.channel} keyed>
								{(channel) => (
									<Text.Body2 truncate class="w-full">
										{channel.name}
									</Text.Body2>
								)}
							</Show>
						</div>

						<SeekSlider
							disabled={queue.freezeState.seek}
							max={video.duration}
							onChange={(value) => queue.seek(value * 1000)}
							value={(queue.data.position || 0) / 1000}
						/>

						<QueueActions extraClass="justify-evenly w-full" extraButtonClass="p-3 md:px-6" iconSize="lg" />
					</div>
				)}
			</Show>
		</Card>
	);
};
