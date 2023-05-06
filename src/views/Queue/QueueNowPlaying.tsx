import { Container } from "@components/Container";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { Component, onMount, Show } from "solid-js";
import { QueueNotFound, QueuePlayer } from "./components";

export const QueueNowPlaying: Component = () => {
	const app = useApp();
	const queue = useQueue();

	onMount(() => app.setTitle("Queue"));

	return (
		<Container size="full" centered bottomPadless extraClass="h-full">
			<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<QueueNotFound />}>
				<QueuePlayer />
			</Show>
		</Container>
	);
};
