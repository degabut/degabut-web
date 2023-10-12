import { Text } from "@components/atoms";
import { QueueActions, QueueSeekSlider } from "@components/organisms";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { Card } from "./Card";
import { SwitchViewButton } from "./SwitchViewButton";

type Props = {
	isShowTracks: boolean;
	onSwitchView: () => void;
};

export const PlayerCard: Component<Props> = (props) => {
	const queue = useQueue();

	return (
		<Card extraClassList={{ "hidden md:block": props.isShowTracks }}>
			<div class="flex flex-col h-full space-y-4">
				<SwitchViewButton isShowTracks={props.isShowTracks} onClick={() => props.onSwitchView()} />

				<Show when={queue.data.nowPlaying} keyed>
					{({ video }) => (
						<div class="grow flex-col-center justify-evenly space-y-6 h-full">
							<img
								src={video.thumbnails.at(-1)?.url || ""}
								class="grow h-12 max-h-96 object-cover rounded"
							/>

							<div class="flex-col-center w-full text-shadow space-y-2 text-center">
								<Text.H1 truncate class="w-full text-3xl text-shadow">
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

							<QueueSeekSlider
								disabled={queue.freezeState.seek}
								max={video.duration}
								onChange={(value) => queue.seek(value * 1000)}
								value={(queue.data.position || 0) / 1000}
							/>

							<QueueActions
								extraClass="justify-evenly w-full"
								extraButtonClass="p-4 md:px-8"
								iconSize="xl"
							/>
						</div>
					)}
				</Show>
			</div>
		</Card>
	);
};
