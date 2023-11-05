import { Button, IconSize } from "@common/components";
import { Component, createEffect, createSignal } from "solid-js";

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
			disabled={props.disabled}
			icon="shuffle"
			iconSize={props.iconSize || "lg"}
			class="p-2"
			classList={{
				"text-brand-600 hover:!text-brand-600": shuffle() && !props.disabled,
				"text-brand-800": shuffle() && props.disabled,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
