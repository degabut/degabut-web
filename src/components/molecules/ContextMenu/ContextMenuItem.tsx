import { Icon, Icons, Text } from "@components/atoms";
import { Component, Show } from "solid-js";

type Props = {
	icon?: Icons;
	label: string;
	disabled?: boolean;
};

export const ContextMenuItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center space-x-4">
			<Show when={props.icon} keyed>
				{(icon) => (
					<Icon
						name={icon}
						extraClass="fill-current h-4 w-4"
						extraClassList={{
							"text-neutral-400": !props.disabled,
							"text-neutral-600": !!props.disabled,
						}}
					/>
				)}
			</Show>
			<Text.Body1 classList={{ "text-neutral-500": props.disabled }}>{props.label}</Text.Body1>
		</div>
	);
};
