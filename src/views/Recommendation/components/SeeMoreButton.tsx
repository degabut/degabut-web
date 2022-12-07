import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
};

export const SeeMoreTextButton: Component<Props> = (props) => {
	return (
		<Button flat class="px-2 py-0.5" onClick={() => props.onClick()}>
			<Text.Body2>See More</Text.Body2>
		</Button>
	);
};

export const SeeMoreButton: Component<Props> = (props) => {
	return (
		<Button class="w-full justify-center py-1.5" onClick={() => props.onClick()}>
			See More
		</Button>
	);
};
