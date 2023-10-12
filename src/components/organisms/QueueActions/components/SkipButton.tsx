import { Button, IconSize } from "@components/atoms";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
	disabled: boolean;
	extraClass?: string;
	iconSize?: IconSize;
};

export const SkipButton: Component<Props> = (props) => {
	return (
		<Button
			flat
			onClick={() => props.onClick()}
			title="Skip"
			disabled={props.disabled}
			icon="forward"
			iconSize={props.iconSize || "lg"}
			class="p-2"
			classList={{
				"fill-neutral-600": props.disabled,
				"hover:fill-white fill-neutral-300": !props.disabled,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
