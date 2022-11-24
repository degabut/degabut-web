import { Component } from "solid-js";

type DividerProps = {
	extraClass?: string;
	dark?: boolean;
	vertical?: boolean;
};

export const Divider: Component<DividerProps> = (props) => {
	return (
		<div
			class={props.extraClass}
			classList={{
				"border-b": !props.vertical,
				"border-r": props.vertical,
				"border-neutral-800": props.dark,
				"border-neutral-700": !props.dark,
			}}
		/>
	);
};
