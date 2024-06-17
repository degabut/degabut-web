import { createEffect, onCleanup } from "solid-js";
import { DelayUtil } from "../utils";

type IUseInfiniteScrollingProps = {
	callback: () => unknown | Promise<unknown>;
	disabled: () => boolean;
	container: () => HTMLElement;
	bottomOffset?: number;
};

export const useInfiniteScrolling = ({ callback, disabled, container, bottomOffset }: IUseInfiniteScrollingProps) => {
	const observer = new MutationObserver(() => load());

	const load = DelayUtil.throttle(() => {
		const containerRect = container()?.getBoundingClientRect();
		if (!disabled() && containerRect && window.innerHeight - containerRect.bottom > (bottomOffset ?? -128)) {
			callback();
		}
	}, 250);

	createEffect(() => {
		cleanup();

		const c = container();
		if (!c) return;

		observer.observe(c, { childList: true, subtree: true });
		document.addEventListener("scroll", load, true);
	});

	onCleanup(() => cleanup());

	const cleanup = () => {
		observer?.disconnect();
		document.removeEventListener("scroll", load, true);
	};
};
