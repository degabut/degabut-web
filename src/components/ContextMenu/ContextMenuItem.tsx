import { Icon, Icons } from "@components/Icon";
import { Text } from "@components/Text";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	disabled?: boolean;
};

export const ContextMenuItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-4">
			<Icon
				name={props.icon}
				extraClass="fill-current h-4 w-4"
				extraClassList={{
					"text-neutral-400": !props.disabled,
					"text-neutral-700": !!props.disabled,
				}}
			/>
			<Text.Body1 classList={{ "text-neutral-600": props.disabled }}>{props.label}</Text.Body1>
		</div>
	);
};
