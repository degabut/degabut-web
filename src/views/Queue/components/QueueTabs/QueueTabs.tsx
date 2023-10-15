import { Tabs } from "@components/atoms";
import { Videos } from "@components/organisms";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";
import { QueueHint, QueueInfo, QueuePlayHistory, QueueTrackList } from "./components";

export const QueueTabs: Component = () => {
	const queue = useQueue();

	return (
		<Tabs
			extraContainerClass="h-full overflow-y-auto"
			extraContentContainerClass="h-full overflow-y-auto md:pr-2"
			items={[
				{
					id: "trackList",
					labelText: "Queue",
					element: () => (
						<Show
							when={!queue.isInitialLoading()}
							fallback={
								<div class="pt-6">
									<Videos.List data={[]} isLoading />
								</div>
							}
						>
							<QueueInfo />
							<QueueTrackList />
							<QueueHint />
						</Show>
					),
				},
				{
					id: "queueHistory",
					labelText: "History",
					element: () => (
						<Show when={!queue.isInitialLoading()} fallback={<Videos.List data={[]} isLoading />}>
							<div class="pt-6">
								<QueuePlayHistory />
							</div>
						</Show>
					),
				},
			]}
		/>
	);
};
