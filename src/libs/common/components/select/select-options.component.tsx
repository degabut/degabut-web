import { For, type Component, type JSX } from "solid-js";
import { clickOutside } from "../../directives";

clickOutside;

export type SelectOptionsProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
	value: string;
	options: { value: string; label: string }[];
	rounded?: boolean;
	outlined?: boolean;
	dense?: boolean;
};

export const SelectOptions: Component<SelectOptionsProps> = (props) => {
	return (
		<div
			classList={{
				"bg-transparent border border-neutral-500 text-current rounded": props.outlined,
				"bg-white text-black": !props.outlined,
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				"bg-neutral-300 text-neutral-500": props.disabled,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			<select
				{...props}
				class="outline-0 w-full bg-transparent font-normal"
				classList={{
					"rounded-full": !!props.rounded,
					"py-2 px-4": !props.dense,
					"py-1 px-2": props.dense,
				}}
			>
				<For each={props.options}>
					{(option) => (
						<option class="bg-neutral-900" value={option.value} selected={props.value === option.value}>
							{option.label}
						</option>
					)}
				</For>
			</select>
		</div>
	);
};
