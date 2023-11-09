import { useScreen } from "@common/hooks";
import { useQueue } from "@queue/hooks";
import { useMatch } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { NavigationBar, QueueNowPlaying, QueuePlayer } from "./components";

export const BottomBar: Component = () => {
	const queue = useQueue();
	const screen = useScreen();
	const inQueue = useMatch(() => (screen.gte.md ? "/app/queue" : "/app/queue/player"));

	return (
		<div class="w-full z-10">
			<div class="hidden md:block">
				<QueuePlayer />
			</div>

			<div class="md:hidden flex flex-col ">
				<Show when={!inQueue() && !queue.data.empty}>
					<QueueNowPlaying />
				</Show>
				<NavigationBar />
			</div>
		</div>
	);
};
