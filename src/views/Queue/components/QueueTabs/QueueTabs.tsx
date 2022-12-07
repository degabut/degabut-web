import { Tabs } from "@components/Tabs";
import { Videos } from "@components/Videos";
import { useQueue } from "@hooks/useQueue";
import { Component, createSignal, Show } from "solid-js";
import { QueueHint } from "./QueueHint";
import { QueuePlayHistory } from "./QueuePlayHistory";
import { QueueTrackList } from "./QueueTrackList";
import { SearchInput } from "./SearchInput";

export const QueueTabs: Component = () => {
	const queue = useQueue();
	const [keyword, setKeyword] = createSignal("");

	return (
		<Tabs
			extraContentContainerClass="pt-4 md:pt-6"
			end={<SearchInput keyword={keyword()} onInput={setKeyword} />}
			items={[
				{
					id: "trackList",
					labelText: "Track List",
					icon: "audioPlaylist",
					element: () => (
						<Show when={!queue.isInitialLoading()} fallback={<Videos.List data={[]} isLoading />}>
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
							<QueuePlayHistory keyword={keyword()} />
						</Show>
					),
				},
			]}
		/>
	);
};
