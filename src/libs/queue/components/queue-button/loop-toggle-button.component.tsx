import { Button, type IconSize } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";
import { LoopMode } from "../../apis";

type Props = {
	defaultValue: LoopMode;
	onChange: (loopMode: LoopMode) => void;
	disabled: boolean;
	extraClass?: string;
	iconSize?: IconSize;
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
		<Button
			flat
			onClick={onClick}
			title="Loop"
			icon={loopMode() === LoopMode.TRACK ? "loopOne" : "loop"}
			iconSize={props.iconSize || "lg"}
			class="p-2"
			disabled={props.disabled}
			classList={{
				"text-brand-600 hover:!text-brand-600": loopMode() !== LoopMode.DISABLED && !props.disabled,
				"text-brand-800": loopMode() !== LoopMode.DISABLED && props.disabled,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
