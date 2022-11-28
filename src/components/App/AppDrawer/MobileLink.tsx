import { RouterLink } from "@components/Link";
import { useMatch } from "solid-app-router";
import { Component } from "solid-js";
import { Icon, Icons } from "../../Icon";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

export const MobileLink: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink
			href={props.path}
			class="flex-col-center flex-grow space-y-1 py-2 transition-colors"
			classList={{
				"text-neutral-400": !isActive(),
				"text-neutral-100 bg-white/10 font-medium": !!isActive(),
			}}
		>
			<div class="pt-1">
				<Icon name={props.icon} size="md" extraClass="fill-current" />
			</div>
			<div>{props.label}</div>
		</RouterLink>
	);
};
