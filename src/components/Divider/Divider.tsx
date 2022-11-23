import { Component } from "solid-js";

type DividerProps = {
	extraClass?: string;
	dark?: boolean;
};

export const Divider: Component<DividerProps> = (props) => {
	return (
		<div
			class={`border-b ${props.extraClass}`}
			classList={{
				"border-neutral-800": props.dark,
				"border-neutral-600": !props.dark,
			}}
		/>
	);
};
