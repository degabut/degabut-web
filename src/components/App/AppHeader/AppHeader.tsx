import { Icon } from "@components/Icon";
import { useApp } from "@hooks/useApp";
import { Component } from "solid-js";

export const AppHeader: Component = () => {
	const app = useApp();

	return (
		<div class="flex-row-center bg-neutral-900 h-14 md:h-12 px-4 py-2 space-x-2">
			<div class="md:hidden cursor-pointer p-2" onClick={() => app.setIsMenuOpen((v) => !v)}>
				<Icon name="menu" size="lg" extraClass="fill-white" />
			</div>

			<div class="flex-grow text-lg font-medium truncate px-1">{app?.title()}</div>

			<div class="cursor-pointer p-2" onClick={() => app.setIsMemberOpen((v) => !v)}>
				<Icon name="people" size="lg" extraClass="fill-white" />
			</div>
		</div>
	);
};
