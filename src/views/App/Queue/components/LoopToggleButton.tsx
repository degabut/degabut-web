import { LoopMode } from "@api";
import { Icon } from "@components/Icon";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	defaultValue: LoopMode;
	onChange: (loopMode: LoopMode) => void;
	disabled: boolean;
};

const loopModes = [LoopMode.DISABLED, LoopMode.QUEUE, LoopMode.TRACK];

export const LoopToggleButton: Component<Props> = (props) => {
	const [loopMode, setLoopMode] = createSignal<LoopMode>(props.defaultValue);

	const onClick = () => {
		const nextLoopMode = loopModes[(loopModes.indexOf(loopMode()) + 1) % loopModes.length];
		setLoopMode(nextLoopMode);
		props.onChange(nextLoopMode);
	};

	createEffect(() => setLoopMode(props.defaultValue));

	return (
		<button
			onClick={onClick}
			class="p-2"
			title="Loop"
			disabled={props.disabled}
			classList={{
				"fill-brand-600 hover:fill-brand-400": loopMode() !== LoopMode.DISABLED && !props.disabled,
				"fill-brand-800": loopMode() !== LoopMode.DISABLED && props.disabled,
				"fill-neutral-300 hover:fill-white": loopMode() === LoopMode.DISABLED && !props.disabled,
				"fill-neutral-500": loopMode() === LoopMode.DISABLED && props.disabled,
			}}
		>
			<Icon name={loopMode() === LoopMode.TRACK ? "loopOne" : "loop"} extraClass="w-5 h-5" />
		</button>
	);
};
