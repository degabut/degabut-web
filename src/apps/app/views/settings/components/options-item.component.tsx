import { SelectOptions } from "@common";
import type { Component } from "solid-js";
import { Item, type ValueProps } from "./item.component";

export type OptionsItemProps = ValueProps<string> & {
	options: { value: string; label: string }[];
};

export const OptionsItem: Component<OptionsItemProps> = (props) => {
	return (
		<Item {...props}>
			<SelectOptions
				value={props.value()}
				outlined
				dense
				class="w-48 text-sm"
				options={props.options}
				onInput={(v) => props.onChange?.(v.currentTarget.value)}
			/>
		</Item>
	);
};
