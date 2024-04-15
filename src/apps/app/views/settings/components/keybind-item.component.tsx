import { InputKeybind } from "@common";
import type { Component } from "solid-js";
import { Item, type ValueProps } from "./item.component";

type Props = ValueProps<string[]>;

export const KeybindItem: Component<Props> = (props) => {
	return (
		<Item {...props}>
			<InputKeybind
				disabled={props.disabled}
				class="w-48"
				value={props.value()}
				onChange={(v) => props.onChange?.(v)}
			/>
		</Item>
	);
};
