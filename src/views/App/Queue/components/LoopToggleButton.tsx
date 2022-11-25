import { LoopType } from "@api";
import { Icon } from "@components/Icon";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	defaultValue: LoopType;
	onChange: (loopType: LoopType) => void;
	disabled: boolean;
};

const loopTypes = [LoopType.DISABLED, LoopType.QUEUE, LoopType.SONG];

export const LoopToggleButton: Component<Props> = (props) => {
	const [loopType, setLoopType] = createSignal<LoopType>(props.defaultValue);

	const onClick = () => {
		const nextLoopType = loopTypes[(loopTypes.indexOf(loopType()) + 1) % loopTypes.length];
		setLoopType(nextLoopType);
		props.onChange(nextLoopType);
	};

	createEffect(() => setLoopType(props.defaultValue));

	return (
		<button
			onClick={onClick}
			class="p-2"
			title="Loop"
			disabled={props.disabled}
			classList={{
				"fill-brand-600 hover:fill-brand-400": loopType() !== LoopType.DISABLED && !props.disabled,
				"fill-brand-800": loopType() !== LoopType.DISABLED && props.disabled,
				"fill-neutral-300 hover:fill-white": loopType() === LoopType.DISABLED && !props.disabled,
				"fill-neutral-500": loopType() === LoopType.DISABLED && props.disabled,
			}}
		>
			<Icon name={loopType() === LoopType.SONG ? "loopOne" : "loop"} extraClass="w-5 h-5" />
		</button>
	);
};
