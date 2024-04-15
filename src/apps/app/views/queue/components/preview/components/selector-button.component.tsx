import { Button, Text } from "@common";
import type { Component } from "solid-js";

type SelectorButtonProps = {
	text: string;
	isActive: boolean;
	onClick: () => void;
};

export const SelectorButton: Component<SelectorButtonProps> = (props) => {
	return (
		<Button class="px-4 py-1" flat={!props.isActive} onClick={props.onClick}>
			<Text.Body2>{props.text}</Text.Body2>
		</Button>
	);
};
