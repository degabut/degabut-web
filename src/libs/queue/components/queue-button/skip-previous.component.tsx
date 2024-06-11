import { Button, type IconSize } from "@common";
import type { Component } from "solid-js";

type Props = {
	onClick: () => void;
	disabled: boolean;
	extraClass?: string;
	iconSize?: IconSize;
};

export const SkipPreviousButton: Component<Props> = (props) => {
	return (
		<Button
			flat
			onClick={() => props.onClick()}
			title="Previous"
			disabled={props.disabled}
			icon="skipPrevious"
			iconSize={props.iconSize || "lg"}
			class="p-2"
			classList={{
				"text-neutral-600": props.disabled,
				"hover:text-white text-neutral-300": !props.disabled,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
