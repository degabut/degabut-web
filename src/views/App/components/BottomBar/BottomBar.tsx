import { useMatch } from "@providers/BotSelectorProvider";
import { Component, For, Show } from "solid-js";
import { Link } from "./Link";
import { QueuePlayer } from "./QueuePlayer";
import { QueuePlayerMd } from "./QueuePlayerMd";

export const BottomBar: Component = () => {
	const inQueue = useMatch(() => "/app/queue");

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/app/queue" },
		{ icon: "search", label: "Search", path: "/app/search" },
		{ icon: "heart", label: "For You", path: "/app/recommendation" },
	] as const;

	return (
		<div class="flex flex-col w-full z-10">
			<Show when={!inQueue()}>
				<div class="md:hidden">
					<QueuePlayer />
				</div>
				<div class="hidden md:block">
					<QueuePlayerMd />
				</div>
			</Show>

			<div class="flex-row-center flex-wrap bg-black h-full md:hidden block">
				<For each={links}>{(link) => <Link {...link} />}</For>
			</div>
		</div>
	);
};
