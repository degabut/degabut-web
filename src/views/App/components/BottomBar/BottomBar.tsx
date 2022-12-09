import { RouterLink } from "@components/A";
import { Icon, Icons } from "@components/Icon";
import { useLocation, useMatch } from "solid-app-router";
import { Component, For, Show } from "solid-js";
import { QueuePlayer } from "./QueuePlayer";
import { QueuePlayerMd } from "./QueuePlayerMd";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink
			href={props.path}
			class="flex-col-center grow space-y-1 pt-3 pb-2 transition-colors"
			classList={{
				"text-neutral-400": !isActive(),
				"text-neutral-100 bg-white/10 font-medium": !!isActive(),
			}}
		>
			<Icon name={props.icon} size="md" extraClass="fill-current" />
			<div>{props.label}</div>
		</RouterLink>
	);
};

export const BottomBar: Component = () => {
	const location = useLocation();

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/app/queue" },
		{ icon: "search", label: "Search", path: "/app/search" },
		{ icon: "heart", label: "For You", path: "/app/recommendation" },
	] as const;

	return (
		<div class="flex flex-col w-full z-10">
			<Show when={location.pathname !== "/app/queue"}>
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
