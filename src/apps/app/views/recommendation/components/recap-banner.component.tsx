import { Icon, Text } from "@common";
import { RecapRoutes } from "@recap/routes";
import type { Component } from "solid-js";

type RecapBannerProps = {
	year: number;
};

export const RecapBanner: Component<RecapBannerProps> = (props) => {
	return (
		<a
			href={RecapRoutes.Recap}
			target="_blank"
			class="flex space-x-4 items-center border border-brand-800 text-brand-600 hover:bg-brand-500/5 rounded px-6 py-3 w-full"
		>
			<Icon name="stars" size="xl" />
			<Text.H3>Check Out Your {props.year} Recap</Text.H3>
		</a>
	);
};
