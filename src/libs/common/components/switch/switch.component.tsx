import { Component } from "solid-js";

export type SwitchProps = {
	checked?: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
};

export const Switch: Component<SwitchProps> = (props) => {
	return (
		<div
			class="relative rounded-full h-[1.375rem] w-10 "
			classList={{
				"bg-brand-700": props.checked && !props.disabled,
				"bg-brand-900": props.checked && props.disabled,
				"bg-neutral-700 border-neutral-600": !props.checked,
				"cursor-pointer": !props.disabled,
			}}
			onClick={() => !props.disabled && props.onChange?.(!props.checked)}
		>
			<div
				class="rounded-full w-[1.115rem] h-[1.115rem] my-[0.13rem] mx-[0.2rem] absolute"
				classList={{
					"right-0": props.checked,
					"left-0": !props.checked,
					"bg-neutral-400": props.disabled,
					"bg-white": props.checked && !props.disabled,
					"bg-neutral-300": !props.checked && !props.disabled,
				}}
			/>
		</div>
	);
};
