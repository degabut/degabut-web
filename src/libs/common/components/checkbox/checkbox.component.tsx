import type { Component } from "solid-js";

// TODO add size prop
export type CheckboxProps = {
	checked: boolean;
	onChange?: (checked: boolean) => void;
};

export const Checkbox: Component<CheckboxProps> = (props) => {
	return (
		<div class="grid items-center justify-center">
			<input
				type="checkbox"
				checked={props.checked}
				onChange={(e) => props.onChange?.(e.currentTarget.checked)}
				class="row-start-1 col-start-1 forced-colors:appearance-auto appearance-none w-5 h-5 border border-neutral-500 rounded"
			/>

			<svg
				viewBox="0 0 14 14"
				fill="none"
				classList={{
					"!visible": props.checked,
					invisible: !props.checked,
				}}
				class="row-start-1 col-start-1 stroke-neutral-200 forced-colors:hidden pointer-events-none p-0.5"
			>
				<path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
	);
};
