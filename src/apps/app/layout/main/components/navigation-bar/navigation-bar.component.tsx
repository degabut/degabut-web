import { AppRoutes } from "@app/routes";
import { A, Icon, type Icons } from "@common";
import { useMatch } from "@solidjs/router";
import { For, type Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<A
			href={props.path}
			class="relative flex-col-center grow space-y-1 pt-3 pb-2 transition-colors"
			classList={{
				"text-neutral-400": !isActive(),
				"text-current bg-white/5 font-medium": !!isActive(),
			}}
		>
			<div classList={{ "absolute top-0 border-b-2 border-current rounded-full w-full": !!isActive() }} />
			<Icon name={props.icon} size="md" />
			<div>{props.label}</div>
		</A>
	);
};

export const NavigationBar: Component = () => {
	const links = [
		{ icon: "degabutThin", label: "Queue", path: AppRoutes.Queue },
		{ icon: "search", label: "Search", path: AppRoutes.Search },
		{ icon: "heart", label: "For You", path: AppRoutes.Recommendation },
	] as const;

	return (
		<div class="flex-row-center flex-wrap bg-black">
			<For each={links}>{(link) => <Link {...link} />}</For>
		</div>
	);
};
