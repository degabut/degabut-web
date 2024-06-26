import { Button, Text } from "@common";
import type { Component } from "solid-js";

type Props = {
	onClick: () => void;
	disabled: boolean;
};

export const RefreshButton: Component<Props> = (props) => {
	return (
		<Button flat class="px-2 py-0.5" onClick={props.onClick} disabled={props.disabled}>
			<Text.Body2>Refresh</Text.Body2>
		</Button>
	);
};
