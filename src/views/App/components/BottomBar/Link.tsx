import { RouterLink } from "@components/A";
import { Icon, Icons } from "@components/Icon";
import { useMatch } from "@providers/BotSelectorProvider";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

export const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink
			href={props.path}
			class="relative flex-col-center grow space-y-1 pt-3 pb-2 transition-colors"
			classList={{
				"text-neutral-400": !isActive(),
				"text-neutral-100 bg-white/5 font-medium": !!isActive(),
			}}
		>
			<div classList={{ "absolute top-0 border-b-2 border-neutral-100 rounded-full w-full": !!isActive() }} />
			<Icon name={props.icon} size="md" extraClass="fill-current" />
			<div>{props.label}</div>
		</RouterLink>
	);
};
