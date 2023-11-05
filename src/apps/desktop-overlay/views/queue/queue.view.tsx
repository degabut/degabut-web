import { useQueue } from "@app/hooks";
import { Component, Show } from "solid-js";
import { PlayerCard, TracksCard } from "./components";

export const Queue: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying}>
			<div class="grid grid-cols-2 gap-2 lg:gap-4 2xl:gap-8 h-full">
				<PlayerCard />
				<TracksCard />
			</div>
		</Show>
	);
};
