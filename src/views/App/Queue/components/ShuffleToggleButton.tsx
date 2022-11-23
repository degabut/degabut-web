import { Icon } from "@components/Icon";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	defaultValue: boolean;
	onChange: (shuffle: boolean) => void;
	disabled: boolean;
};

export const ShuffleToggleButton: Component<Props> = (props) => {
	const [shuffle, setShuffle] = createSignal<boolean>(props.defaultValue);

	const onClick = () => {
		setShuffle((s) => !s);
		props.onChange(shuffle());
	};

	createEffect(() => setShuffle(props.defaultValue));

	return (
		<button onClick={onClick} class="p-2" title="Shuffle" disabled={props.disabled}>
			<Icon
				name="shuffle"
				extraClass="w-5 h-6"
				extraClassList={{
					"fill-brand-600 hover:fill-brand-500": shuffle() && !props.disabled,
					"fill-brand-800": shuffle() && props.disabled,
					"fill-neutral-300 hover:fill-white": !shuffle() && !props.disabled,
					"fill-neutral-500": !shuffle() && props.disabled,
				}}
			/>
		</button>
	);
};
