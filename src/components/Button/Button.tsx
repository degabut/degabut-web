import { Component, JSX } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
};

export const Button: Component<Props> = (props) => {
	return (
		<button
			{...props}
			class="flex-row-center justify-center space-x-2 border rounded border-neutral-400 px-8 py-1"
			classList={{
				"bg-white/5 text-neutral-400 border-neutral-400": props.disabled,
				"hover:bg-white/10": !props.disabled,
				"!rounded-full": props.rounded,
				...props.classList,
				[props.class || ""]: !!props.class,
			}}
		>
			{props.children}
		</button>
	);
};
