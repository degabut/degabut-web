import { Input, Text } from "@common";
import type { Component } from "solid-js";

type InputTextProps = {
	label: string;
	value: string;
	onInput: (v: string) => void;
};

export const InputText: Component<InputTextProps> = (props) => {
	return (
		<div class="space-y-2 grow">
			<Text.H4>{props.label}</Text.H4>
			<Input type="text" outlined value={props.value} onInput={(e) => props.onInput(e.currentTarget.value)} />
		</div>
	);
};
