import { Button } from "@components/Button";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
	extraClass?: string;
};

export const SeeMoreTextButton: Component<Props> = (props) => {
	return (
		<div
			class={`text-sm hover:underline underline-offset-2 cursor-pointer max-w-max px-3 ${props.extraClass}`}
			onClick={() => props.onClick()}
		>
			See More
		</div>
	);
};

export const SeeMoreButton: Component<Props> = (props) => {
	return (
		<Button class={`border-neutral-700 w-full !py-1.5 ${props.extraClass}`} onClick={() => props.onClick()}>
			<div>See More</div>
		</Button>
	);
};
