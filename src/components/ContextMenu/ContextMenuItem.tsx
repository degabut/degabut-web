import { Icon, Icons } from "@components/Icon";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
};

export const ContextMenuItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-4">
			<Icon name={props.icon} extraClass="fill-current text-neutral-400 h-4 w-4" />
			<div>{props.label}</div>
		</div>
	);
};
