import { Tabs } from "@components/Tabs";
import { Videos } from "@components/Videos";
import { useQueue } from "@hooks/useQueue";
import { Component, createSignal, Show } from "solid-js";
import { QueueHint } from "./QueueHint";
import { QueueInfo } from "./QueueInfo";
import { QueuePlayHistory } from "./QueuePlayHistory";
import { QueueTrackList } from "./QueueTrackList";
import { SearchInput } from "./SearchInput";

export const QueueTabs: Component = () => {
	const queue = useQueue();
	const [keyword, setKeyword] = createSignal("");

	return (
		<Tabs
			end={<SearchInput keyword={keyword()} onInput={setKeyword} />}
			extraContainerClass="h-full overflow-y-hidden"
			extraContentContainerClass="h-full overflow-y-auto lg:pr-2"
			items={[
				{
					id: "trackList",
					labelText: "Track List",
					icon: "audioPlaylist",
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
							<div class="space-y-1.5">
								<QueueTrackList keyword={keyword()} />
								<QueueHint />
							</div>
						</Show>
					),
				},
				{
					id: "queueHistory",
					labelText: "History",
					icon: "history",
					element: () => (
						<Show when={!queue.isInitialLoading()} fallback={<Videos.List data={[]} isLoading />}>
							<div class="pt-6">
								<QueuePlayHistory keyword={keyword()} />
							</div>
						</Show>
					),
				},
			]}
		/>
	);
};
