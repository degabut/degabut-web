import { Switch } from "@components/Switch";
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
				<div>{props.label}</div>
				<Show when={props.description}>
					<div class="text-neutral-400 text-sm">{props.description}</div>
				</Show>
			</div>
			<Switch checked={props.checked} onChange={(c) => props.onChange(c)} />
		</div>
	);
};
