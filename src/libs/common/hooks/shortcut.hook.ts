import { onCleanup, onMount } from "solid-js";

type Shortcut = {
	key: string;
	ctrl?: boolean;
	handler: (e: KeyboardEvent) => void;
};

type Params = {
	shortcuts: Shortcut[];
};

export const useShortcut = (params: Params) => {
	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		document.removeEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();
		if (tagName === "INPUT" || tagName === "TEXTAREA") return;

		const key = e.key.toLowerCase();
		const isCtrl = e.ctrlKey;

		params.shortcuts.forEach((shortcut) => {
			if (key === shortcut.key.toLowerCase() && isCtrl === !!shortcut.ctrl) {
				e.preventDefault();
				shortcut.handler(e);
			}
		});
	};
};
