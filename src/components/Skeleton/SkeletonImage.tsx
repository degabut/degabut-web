import { Component } from "solid-js";

type Props = {
	extraClass?: string;
	rounded?: boolean;
};

export const SkeletonImage: Component<Props> = (props) => {
	return (
		<div
			class={`bg-neutral-800 animate-pulse ${props.extraClass}`}
			classList={{
				"rounded-full": props.rounded,
				rounded: !props.rounded,
			}}
		/>
	);
};
