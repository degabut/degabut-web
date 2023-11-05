import { Switch } from "@common/components";
import { Component } from "solid-js";
import { Item, ValueProps } from "./Item";

type Props = ValueProps<boolean>;

export const SwitchItem: Component<Props> = (props) => {
	return (
		<Item {...props}>
			<Switch checked={props.value()} onChange={(c) => props.onChange(c)} />
		</Item>
	);
};
