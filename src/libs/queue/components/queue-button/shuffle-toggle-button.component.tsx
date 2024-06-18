import { Button, type IconSize } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";

type Props = {
	defaultValue: boolean;
	onChange: (shuffle: boolean) => void;
	disabled: boolean;
	extraClass?: string;
	iconSize?: IconSize;
};

export const ShuffleToggleButton: Component<Props> = (props) => {
	const [shuffle, setShuffle] = createSignal<boolean>(props.defaultValue);

	const onClick = () => {
		setShuffle((s) => !s);
		props.onChange(shuffle());
	};

	createEffect(() => setShuffle(props.defaultValue));

	return (
		<Button
			flat
			onClick={onClick}
			title="Shuffle"
			theme={shuffle() ? "brand" : "default"}
			disabled={props.disabled}
			icon="shuffle"
			iconSize={props.iconSize || "lg"}
			class="p-2"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};
