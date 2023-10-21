import { Icon, Icons, RouterLink } from "@components/atoms";
import { useMatch } from "@hooks/useMatch";
import { Component, For } from "solid-js";

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
			class="relative flex-col-center grow space-y-1 pt-3 pb-2 transition-colors"
			classList={{
				"text-neutral-400": !isActive(),
				"text-current bg-white/5 font-medium": !!isActive(),
			}}
		>
			<div classList={{ "absolute top-0 border-b-2 border-current rounded-full w-full": !!isActive() }} />
			<Icon name={props.icon} size="md" extraClass="fill-current" />
			<div>{props.label}</div>
		</RouterLink>
	);
};

export const NavigationBar: Component = () => {
	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/app/queue" },
		{ icon: "search", label: "Search", path: "/app/search" },
		{ icon: "heart", label: "For You", path: "/app/recommendation" },
	] as const;

	return (
		<div class="flex-row-center flex-wrap bg-black h-full">
			<For each={links}>{(link) => <Link {...link} />}</For>
		</div>
	);
};
