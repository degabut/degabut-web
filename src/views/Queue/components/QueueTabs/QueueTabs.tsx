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
			end={(e) => (
				<SearchInput
					keyword={keyword()}
					onInput={setKeyword}
					placeholder={`Search ${e.id === "trackList" ? "queue" : "history"}`}
				/>
			)}
			extraContainerClass="h-full"
			extraContentContainerClass="h-full overflow-y-auto md:pr-2"
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
