import { Container } from "@components/templates";
import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useSettings } from "@hooks/useSettings";
import { useApp } from "@providers/AppProvider";
import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { NowPlaying, QueueNotFound, QueueTabs } from "./components";

export const Queue: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const queue = useQueue();
	const { settings, setSettings } = useSettings();
	const [isThumbnail, setIsThumbnail] = createSignal(settings.queue.showThumbnail);

	onMount(() => app.setTitle("Queue"));

	createEffect(() => setSettings("queue", { showThumbnail: isThumbnail() }));

	return (
		<Container
			size="full"
			padless
			centered
			extraClass="h-full"
			extraClassList={{
				"lg:grid": true,
				"grid-cols-2": isThumbnail(),
				"grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]": !isThumbnail(),
				"lg:gap-x-8 xl:gap-x-10 2xl:gap-x-16": true,
				"space-y-8 md:space-y-0": true,
				"py-6 px-3 md:px-8 lg:pr-12 2xl:pr-16": true,
			}}
		>
			<Show when={screen.gte.lg}>
				<NowPlaying isThumbnail={isThumbnail()} onChangeViewMode={setIsThumbnail} />
			</Show>

			<Show when={!queue.data.empty || queue.isInitialLoading()} fallback={<QueueNotFound />}>
				<QueueTabs />
			</Show>
		</Container>
	);
};
