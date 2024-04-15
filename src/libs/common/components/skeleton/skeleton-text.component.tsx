import type { Component } from "solid-js";

type Props = {
	extraClass?: string;
};

export const SkeletonText: Component<Props> = (props) => {
	return (
		<div
			class="rounded-full bg-neutral-800 animate-pulse font-m"
			classList={{ [props.extraClass || ""]: !!props.extraClass }}
		/>
	);
};
