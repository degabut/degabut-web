import { useApp } from "@app/providers";
import { Container, useScreen } from "@common";
import { useSettings } from "@settings";
import { Show, createEffect, createSignal, onMount, type Component } from "solid-js";
import { Preview, QueueTabs } from "./components";
import { QueueInfo } from "./components/queue-tabs/components";

export const Queue: Component = () => {
	const app = useApp()!;
	const screen = useScreen();
	const { settings, setSettings } = useSettings();
	const [isThumbnail, setIsThumbnail] = createSignal(settings["queue.showThumbnail"]);

	onMount(() => app.setTitle("Queue"));

	createEffect(() => setSettings("queue.showThumbnail", isThumbnail()));

	return (
		<div
			class="h-full"
			classList={{
				"lg:grid gap-x-2": settings["app.player.minimized"],
				"grid-cols-2": isThumbnail(),
				"grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]": !isThumbnail(),
			}}
		>
			<Show when={screen.gte.lg && settings["app.player.minimized"]}>
				<Container size="full" padless extraClass="h-full py-6 px-8">
					<Preview isThumbnail={isThumbnail()} onChangeViewMode={setIsThumbnail} />
				</Container>
			</Show>

			<div class="flex flex-col h-full overflow-y-auto md:space-y-2">
				<div class="shrink">
					<Container padless extraClass={"py-3 px-4 md:px-8"}>
						<QueueInfo />
					</Container>
				</div>

				<Container size="full" padless centered extraClass="h-full py-3 md:py-5 px-3 md:px-8">
					<QueueTabs />
				</Container>
			</div>
		</div>
	);
};
