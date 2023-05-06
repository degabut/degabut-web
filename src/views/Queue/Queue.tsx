import { Container } from "@components/Container";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useApp } from "@providers/AppProvider";
import { Component, onMount, Show } from "solid-js";
import { NowPlayingMd, QueueNotFound, QueueTabs } from "./components";

export const Queue: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const queue = useQueue();

	onMount(() => app.setTitle("Queue"));

	return (
		<Container
			size="full"
			padless
			centered
			extraClass="md:h-full overflow-y-hidden"
			extraClassList={{
				"lg:grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]": true,
				"lg:gap-x-8 xl:gap-x-10 2xl:gap-x-16": true,
				"space-y-8 md:space-y-0": true,
				"py-6 px-3 md:px-8 lg:pr-12 2xl:pr-16": true,
			}}
		>
			<Show when={screen.gte.md}>
				<NowPlayingMd />
			</Show>

			<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<QueueNotFound />}>
				<QueueTabs />
			</Show>
		</Container>
	);
};
