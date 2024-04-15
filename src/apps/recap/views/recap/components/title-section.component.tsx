import { Text } from "@common";
import type { Component } from "solid-js";

type TitleSectionProps = {
	year: number;
};

export const TitleSection: Component<TitleSectionProps> = (props) => {
	return (
		<Text.H1 class="text-7xl text-center text-brand font-semibold leading-tight">
			Degabut <span class="text-white">{props.year}</span> Recap
		</Text.H1>
	);
};
