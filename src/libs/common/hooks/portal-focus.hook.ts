import { createEffect, onCleanup, type Accessor } from "solid-js";

export const usePortalFocus = (focus: Accessor<boolean>) => {
	const root = document.getElementById("root");

	onCleanup(() => root?.removeAttribute("inert"));

	createEffect(() => {
		if (focus()) root?.setAttribute("inert", "true");
		else root?.removeAttribute("inert");
	});
};
