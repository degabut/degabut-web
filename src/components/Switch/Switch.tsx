import { Component } from "solid-js";

export type SwitchProps = {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
};

export const Switch: Component<SwitchProps> = (props) => {
	return (
		<div
			class="relative rounded-full h-[1.375rem] w-10 cursor-pointer"
			classList={{
				"bg-brand-700": props.checked,
				"bg-neutral-700 border-neutral-600": !props.checked,
			}}
			onClick={() => props.onChange?.(!props.checked)}
		>
			<div
				class="rounded-full w-[1.115rem] h-[1.115rem] my-[0.13rem] mx-[0.2rem] absolute"
				classList={{
					"right-0 bg-white": props.checked,
					"left-0 bg-neutral-300": !props.checked,
				}}
			/>
		</div>
	);
};
