import { onCleanup, type Accessor } from "solid-js";

export type ClickOutsideParams =
	| (() => void)
	| {
			handler?: () => void;
			target?: HTMLElement;
	  };

export function clickOutside(el: HTMLElement, params: Accessor<ClickOutsideParams>) {
	let currentElement: HTMLElement | null = null;

	const onMouseDown = (e: MouseEvent) => {
		currentElement = e.target as HTMLElement;
	};

	const onMouseUp = (e: MouseEvent) => {
		const p = params();
		const options = typeof p === "function" ? { handler: p } : p;

		if (options.target) {
			if (
				!options.target.contains(currentElement) ||
				el.contains(e.target as HTMLElement) ||
				el.contains(currentElement)
			)
				return;
			options.handler?.();
		} else if (currentElement && !el.contains(e.target as HTMLElement) && !el.contains(currentElement)) {
			options.handler?.();
			currentElement = null;
		}
	};

	document.body.addEventListener("mousedown", onMouseDown);
	document.body.addEventListener("mouseup", onMouseUp);

	onCleanup(() => {
		document.body.removeEventListener("mousedown", onMouseDown);
		document.body.removeEventListener("mouseup", onMouseUp);
	});
}
