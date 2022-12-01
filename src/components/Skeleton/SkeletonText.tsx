import { Component } from "solid-js";

type Props = {
	extraClass?: string;
};

export const SkeletonText: Component<Props> = (props) => {
	return <div class={`rounded-full bg-neutral-700 animate-pulse font-m ${props.extraClass}`} />;
};
