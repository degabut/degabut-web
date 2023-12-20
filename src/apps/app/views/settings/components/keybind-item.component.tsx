import { InputKeybind } from "@common/components";
import { Component } from "solid-js";
import { Item, ValueProps } from "./item.component";

type Props = ValueProps<string[]>;

export const KeybindItem: Component<Props> = (props) => {
	return (
		<Item {...props}>
			<InputKeybind class="w-48" value={props.value()} onChange={(v) => props.onChange?.(v)} />
		</Item>
	);
};
