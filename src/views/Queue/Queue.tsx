import { Container } from "@components/Container";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useApp } from "@providers/AppProvider";
import { Component, onMount, Show } from "solid-js";
import { NowPlayingMd, QueueNotFound, QueuePlayer, QueueTabs } from "./components";

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
			extraClass="max-w-[120rem] md:h-full overflow-y-hidden"
			extraClassList={{
				"lg:grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]  gap-x-8": true,
				"space-y-8 md:space-y-0": true,
				"px-3 md:px-8 lg:px-12 2xl:px-16": true,
				"py-8 lg:!py-6": true,
			}}
		>
			<Show when={screen.lte.sm} fallback={<NowPlayingMd />}>
				<Show when={!queue.data.empty}>
					<QueuePlayer />
				</Show>
			</Show>

			<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<QueueNotFound />}>
				<QueueTabs />
			</Show>
		</Container>
	);
};
