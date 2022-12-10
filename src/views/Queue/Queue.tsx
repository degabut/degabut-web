import { Container } from "@components/Container";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { Component, onMount, Show } from "solid-js";
import { QueueNotFound, QueuePlayer, QueueTabs } from "./components";

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
