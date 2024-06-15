import { Button, type IconSize } from "@common";
import type { Component } from "solid-js";

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
			class="p-2 text-neutral-300"
			iconSize={props.iconSize || "lg"}
			onClick={() => props.onClick()}
			title="Lyrics"
			classList={{
				[props.extraClass || ""]: !!props.extraClass,
			}}
		/>
	);
};
