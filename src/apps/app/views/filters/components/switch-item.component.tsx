import { Switch } from "@common";
import type { Component } from "solid-js";
import { Item, type ValueProps } from "./item.component";

type Props = ValueProps<boolean>;

export const SwitchItem: Component<Props> = (props) => {
	return (
		<Item {...props}>
			<Switch checked={props.value()} onChange={(c) => props.onInput?.(c)} disabled={props.disabled} />
		</Item>
	);
};
