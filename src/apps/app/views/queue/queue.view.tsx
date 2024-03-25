import { useApp } from "@app/hooks";
import { Container } from "@common/components";
import { useScreen } from "@common/hooks";
import { useSettings } from "@settings/hooks";
import { Component, Show, createEffect, createSignal, onMount } from "solid-js";
import { Preview, QueueTabs } from "./components";

export const Queue: Component = () => {
	const app = useApp();
	const screen = useScreen();
	const { settings, setSettings } = useSettings();
	const [isThumbnail, setIsThumbnail] = createSignal(settings["queue.showThumbnail"]);

	onMount(() => app.setTitle("Queue"));

	createEffect(() => setSettings("queue.showThumbnail", isThumbnail()));

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
				"pt-3 md:py-6 px-3 md:px-8 lg:pr-12 2xl:pr-16": true,
			}}
		>
			<Show when={screen.gte.lg}>
				<Preview isThumbnail={isThumbnail()} onChangeViewMode={setIsThumbnail} />
			</Show>

			<QueueTabs />
		</Container>
	);
};
