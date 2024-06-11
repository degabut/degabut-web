import { Button, type IconSize } from "@common";
import { createEffect, createSignal, type Component } from "solid-js";

type Props = {
	defaultValue: boolean;
	onChange: (isPaused: boolean) => void;
	disabled: boolean;
	extraClass?: string;
	iconSize?: IconSize;
};

export const PlayButton: Component<Props> = (props) => {
	const [isPaused, setIsPaused] = createSignal(props.defaultValue);

	const onClick = () => {
		setIsPaused((s) => !s);
		props.onChange(isPaused());
	};

	createEffect(() => setIsPaused(props.defaultValue));

	return (
		<Button
			rounded
			disabled={props.disabled}
			onClick={onClick}
			iconSize={props.iconSize || "lg"}
			class="p-2"
			classList={{
				[props.extraClass || ""]: !!props.extraClass,
				"!bg-neutral-600": props.disabled,
				"text-neutral-850 bg-neutral-300 hover:!bg-white": !props.disabled,
			}}
			title={isPaused() ? "Resume" : "Pause"}
			icon={isPaused() ? "play" : "pause"}
		/>
	);
};
