import { InputKeybind, Text } from "@components/atoms";
import { Component, Show } from "solid-js";

type Props = {
	label: string;
	description?: string;
	value: string[];
	onChange: (value: string[]) => void;
};

export const KeybindItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center justify-between space-x-4">
			<div class="flex flex-col">
				<Text.Body1>{props.label}</Text.Body1>
				<Show when={props.description}>
					<Text.Caption1>{props.description}</Text.Caption1>
				</Show>
			</div>
			<InputKeybind class="w-48" value={props.value} onChange={(v) => props.onChange(v)} />
		</div>
	);
};
