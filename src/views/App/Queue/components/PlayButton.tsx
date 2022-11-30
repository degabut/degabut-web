import { Icon } from "@components/Icon";
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
		<button
			disabled={props.disabled}
			onClick={onClick}
			title={isPaused() ? "Resume" : "Pause"}
			class="p-2.5 fill-neutral-800 rounded-full"
			classList={{
				"bg-neutral-300 hover:bg-white": !props.disabled,
				"bg-neutral-500": props.disabled,
			}}
		>
			<Icon name={isPaused() ? "play" : "pause"} size="md" />
		</button>
	);
};
