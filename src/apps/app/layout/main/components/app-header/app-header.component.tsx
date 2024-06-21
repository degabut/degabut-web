import { useApp } from "@app/providers";
import { Button, Text } from "@common";
import type { Component } from "solid-js";

type AppHeaderProps = {
	onMenuClick: () => void;
};

export const AppHeader: Component<AppHeaderProps> = (props) => {
	const app = useApp()!;

	return (
		<div class="flex-row-center bg-black border-b border-neutral-700 h-14 md:h-12 px-4 py-2 space-x-3">
			<Button rounded flat icon="menu" iconSize="lg" class="p-2" onClick={() => props.onMenuClick()} />

			<Text.H3 truncate class="grow">
				{app?.title()}
			</Text.H3>
		</div>
	);
};
