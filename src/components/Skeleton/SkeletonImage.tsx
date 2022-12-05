import { Component } from "solid-js";

type Props = {
	extraClass?: string;
	rounded?: boolean;
};

export const SkeletonImage: Component<Props> = (props) => {
	return (
		<div
			class="bg-neutral-700 animate-pulse"
			classList={{
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
