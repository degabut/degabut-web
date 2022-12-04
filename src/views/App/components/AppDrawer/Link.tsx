import { Icon, Icons } from "@components/Icon";
import { RouterLink } from "@components/Link";
import { useMatch } from "solid-app-router";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path: string;
	variant?: "normal" | "small";
	onClick: () => void;
};

export const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink
			href={props.path}
			class="flex-row-center space-x-4 cursor-pointer px-4 rounded"
			classList={{
				"text-neutral-400 fill-neutral-400 hover:bg-white/5": !isActive(),
				"text-neutral-100 fill-neutral-100 bg-white/[7.5%] font-medium": !!isActive(),
				"py-3.5 md:py-2.5": props.variant !== "normal",
				"py-2 text-sm": props.variant === "small",
			}}
			onClick={() => props.onClick()}
		>
			<Icon name={props.icon} size={props.variant === "small" ? "md" : "lg"} />
			<div>{props.label}</div>
		</RouterLink>
	);
};
