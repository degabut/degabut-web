import type { Component } from "solid-js";

type Props = {
	extraClass?: string;
	extraClassList?: Record<string, boolean | undefined>;
	rounded?: boolean;
};

export const SkeletonImage: Component<Props> = (props) => {
	return (
		<div
			class="bg-neutral-800 animate-pulse"
			classList={{
				"rounded-full": props.rounded,
				rounded: !props.rounded,
				[props.extraClass || ""]: !!props.extraClass,
				...props.extraClassList,
			}}
		/>
	);
};
