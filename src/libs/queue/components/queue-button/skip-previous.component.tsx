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
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};
