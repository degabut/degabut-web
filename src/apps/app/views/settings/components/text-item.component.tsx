import { Input } from "@common";
import type { Component } from "solid-js";
import { Item, type ValueProps } from "./item.component";

type Props = ValueProps<string>;

export const TextItem: Component<Props> = (props) => {
	return (
		<Item {...props}>
			<Input
				dense
				outlined
				type={props.type}
				class="w-48 text-sm"
				value={props.value()}
				onInput={(v) => props.onChange?.(v.currentTarget.value)}
				disabled={props.disabled}
			/>
		</Item>
	);
};
