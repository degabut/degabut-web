import { onCleanup, type Accessor } from "solid-js";

export function doubleClick(el: HTMLElement, handler: Accessor<() => void>) {
	let lastClick = 0;

	const onClick = () => {
		if (Date.now() - lastClick < 500) {
			handler()?.();
		}
		lastClick = Date.now();
	};
	el.addEventListener("click", onClick);

	onCleanup(() => el.removeEventListener("click", onClick));
}
