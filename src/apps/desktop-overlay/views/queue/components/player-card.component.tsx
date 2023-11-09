import { Text } from "@common/components";
import { QueueActions, QueueSeekSlider } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { Component, Show } from "solid-js";
import { Card } from "../../../components";

export const PlayerCard: Component = () => {
	const queue = useQueue();

	return (
		<Card>
			<div class="grow flex-col-center justify-end space-y-6 h-full">
				<Show when={queue.data.nowPlaying} keyed>
					{({ video }) => (
						<>
							<img
								src={video.thumbnails.at(-1)?.url || ""}
								class="grow h-12 max-h-96 object-cover rounded"
							/>

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
						</>
					)}
				</Show>

				<QueueSeekSlider
					disabled={queue.freezeState.seek}
					max={queue.data.nowPlaying?.video.duration || 0}
					onChange={(value) => queue.seek(value * 1000)}
					value={(queue.data.position || 0) / 1000}
				/>

				<QueueActions extraClass="justify-evenly w-full" extraButtonClass="p-3 md:px-6" iconSize="lg" />
			</div>
		</Card>
	);
};
