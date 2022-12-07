import { Button } from "@components/Button";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	defaultValue: boolean;
	onChange: (isPaused: boolean) => void;
	disabled: boolean;
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
			flat
			disabled={props.disabled}
			onClick={onClick}
			class="p-2"
			title={isPaused() ? "Resume" : "Pause"}
			icon={isPaused() ? "play" : "pause"}
		/>
	);
};
