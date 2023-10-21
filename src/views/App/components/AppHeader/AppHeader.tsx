import { Button, Text } from "@components/atoms";
import { useApp } from "@hooks/useApp";
import { Component } from "solid-js";

export const AppHeader: Component = () => {
	const app = useApp();

	return (
		<div class="block md:hidden flex-row-center bg-black border-b border-neutral-700 h-14 md:h-12 px-4 py-2 space-x-3">
			<Button
				rounded
				flat
				icon="menu"
				iconSize="lg"
				class="md:hidden p-2"
				onClick={() => app.setIsMenuOpen((v) => !v)}
			/>

			<Text.H3 truncate class="grow">
				{app?.title()}
			</Text.H3>
		</div>
	);
};
