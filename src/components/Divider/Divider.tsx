import { Component } from "solid-js";

type DividerProps = {
	extraClass?: string;
	dark?: boolean;
	light?: boolean;
	vertical?: boolean;
};

export const Divider: Component<DividerProps> = (props) => {
	return (
		<div
			classList={{
				"border-b": !props.vertical,
				"border-r": props.vertical,
				"border-neutral-800": props.dark,
				"border-neutral-600": props.light,
				"border-neutral-700": !props.dark && !props.light,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
