import { Tabs } from "@common/components";
import { MediaSources } from "@media-source/components";
import { useQueue } from "@queue/hooks";
import { Component, Show } from "solid-js";
import { QueueHint, QueueInfo, QueuePlayHistory, QueueTrackList } from "./components";

export const QueueTabs: Component = () => {
	const queue = useQueue();

	return (
		<div class="flex flex-col space-y-4 overflow-y-auto">
			<QueueInfo />

			<Tabs
				extraTabsClass="md:w-max"
				extraContainerClass="h-full overflow-y-auto"
				extraContentContainerClass="h-full overflow-y-auto md:pr-2 pt-4"
				items={[
					{
						id: "trackList",
						labelText: "Queue",
						element: () => (
							<Show when={!queue.isInitialLoading()} fallback={<MediaSources.List data={[]} isLoading />}>
								<div class="space-y-2">
									<QueueTrackList />
									<QueueHint />
								</div>
							</Show>
						),
					},
					{
						id: "queueHistory",
						labelText: "History",
						element: () => (
							<Show when={!queue.isInitialLoading()} fallback={<MediaSources.List data={[]} isLoading />}>
								<QueuePlayHistory />
							</Show>
						),
					},
				]}
			/>
		</div>
	);
};
