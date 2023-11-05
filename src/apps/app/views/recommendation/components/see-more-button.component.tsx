import { Button, Text } from "@common/components";
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
	return <Button rounded flat icon="list" class="p-2 text-neutral-300" onClick={() => props.onClick()} />;
};
