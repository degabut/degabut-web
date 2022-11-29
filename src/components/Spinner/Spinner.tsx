import { Component } from "solid-js";

type Props = {
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
};

export const Spinner: Component<Props> = (props) => {
	const sizeClass = () => {
		switch (props.size) {
			case "xs":
				return "w-4 h-4 border-2";
			case "sm":
				return "w-6 h-6 border-2";
			case "lg":
				return "w-12 h-12 border-4";
			case "xl":
				return "w-16 h-16 border-4";
			case "2xl":
				return "w-24 h-24 border-8";
			default:
				return "w-8 h-8 border-4";
		}
	};

	return (
		<div class={`relative rounded-full !border-0 ${sizeClass()}`}>
			<div class={`absolute border-neutral-600 rounded-full ${sizeClass()}`} />
			<div class={`absolute animate-spin border-transparent border-t-brand-600 rounded-full ${sizeClass()}`} />
		</div>
	);
};
