import { Input } from "@common/components";
import { Component } from "solid-js";
import { Item, ValueProps } from "./item.component";

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
			/>
		</Item>
	);
};
