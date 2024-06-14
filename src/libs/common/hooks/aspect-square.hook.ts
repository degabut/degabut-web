import { createEffect, createSignal, on, onCleanup, type Accessor } from "solid-js";
import { DelayUtil } from "../utils";

export const useAspectSquare = (el: Accessor<HTMLElement>) => {
	const [size, setSize] = createSignal(0);
	let observer: ResizeObserver;

	createEffect(
		on(el, (el) => {
			if (observer) observer.disconnect();
			if (!el) return;

			observer = new ResizeObserver(() => onResize(el));
			observer.observe(el);
			onResize(el);
		})
	);

	onCleanup(() => observer.disconnect());

	const onResize = DelayUtil.throttle((el: HTMLElement) => {
		const rect = el.getBoundingClientRect();
		setSize(Math.min(rect.width, rect.height));
	}, 100);

	return size;
};
