import { Tabs } from "@common";
import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";
import { QueueHint, QueueNotFound, QueuePlayHistory, QueueTrackList } from "./components";

export const QueueTabs: Component = () => {
	const queue = useQueue();

	return (
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
							<Show when={!queue.data.empty} fallback={<QueueNotFound />}>
								<div class="space-y-2">
									<QueueTrackList />
									<QueueHint />
								</div>
							</Show>
						</Show>
					),
				},
				{
					id: "queueHistory",
					labelText: "History",
					disabled: () => queue.data.empty,
					element: () => (
						<Show when={!queue.isInitialLoading()} fallback={<MediaSources.List data={[]} isLoading />}>
							<Show when={!queue.data.empty} fallback={<QueueNotFound />}>
								<QueuePlayHistory />
							</Show>
						</Show>
					),
				},
			]}
		/>
	);
};
