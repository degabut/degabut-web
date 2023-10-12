import { Button, IconSize } from "@components/atoms";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
	extraClass?: string;
	iconSize?: IconSize;
};

export const LyricsButton: Component<Props> = (props) => {
	return (
		<Button
			flat
			icon="microphone"
			class="p-2"
			iconSize={props.iconSize || "lg"}
			onClick={() => props.onClick()}
			title="Lyrics"
			classList={{
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
