import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";
import { PlayerCard, TracksCard, VoiceChannelsCard } from "./components";

export const Queue: Component = () => {
	const queue = useQueue()!;

	return (
		<div class="grid grid-cols-2 gap-2 lg:gap-4 2xl:gap-8 h-full">
			<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<VoiceChannelsCard />}>
				<PlayerCard />
				<TracksCard />
			</Show>
		</div>
	);
};
