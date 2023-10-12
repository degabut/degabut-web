import { Switch, Text } from "@components/atoms";
import { Component, Show } from "solid-js";

type Props = {
	label: string;
	description?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
};

export const SwitchItem: Component<Props> = (props) => {
	return (
		<div class="flex-row-center justify-between space-x-4">
			<div class="flex flex-col">
				<Text.Body1>{props.label}</Text.Body1>
				<Show when={props.description}>
					<Text.Caption1>{props.description}</Text.Caption1>
				</Show>
			</div>
			<Switch checked={props.checked} onChange={(c) => props.onChange(c)} />
		</div>
	);
};
