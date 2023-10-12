import { useQueue } from "@hooks/useQueue";
import { useScreen } from "@hooks/useScreen";
import { useMatch } from "@providers/BotSelectorProvider";
import { Component, Show } from "solid-js";
import { NavigationBar, QueueNowPlaying, QueuePlayer } from "./components";

export const BottomBar: Component = () => {
	const queue = useQueue();
	const screen = useScreen();
	const inQueue = useMatch(() => (screen.gte.md ? "/app/queue" : "/app/queue/player"));

	return (
		<div class="flex flex-col w-full z-10">
			<Show when={!inQueue() && !queue.data.empty}>
				<div class="md:hidden">
					<QueueNowPlaying />
				</div>
			</Show>

			<div class="hidden md:block">
				<QueuePlayer />
			</div>

			<div class="md:hidden block">
				<NavigationBar />
			</div>
		</div>
	);
};
