import { Container } from "@components/Container";
import { Icon } from "@components/Icon";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { Component, onMount, Show } from "solid-js";
import { QueuePlayer, QueueTabs } from "./components";

const QueueNotFound: Component = () => {
	return (
		<div class="flex-col-center w-full h-full justify-center space-y-4">
			<Icon name="musicOff" extraClass="fill-neutral-400/10" />
			<div class="text-xl md:text-2xl text-center text-neutral-300">No Queue Found</div>
		</div>
	);
};

export const Queue: Component = () => {
	const app = useApp();
	const queue = useQueue();

	onMount(() => app.setTitle("Queue"));

	return (
		<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<QueueNotFound />}>
			<Container extraClass="space-y-8 md:space-y-4">
				<QueuePlayer />
				<QueueTabs />
			</Container>
		</Show>
	);
};
