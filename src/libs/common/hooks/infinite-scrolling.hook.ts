import { createEffect, onCleanup } from "solid-js";
import { DelayUtil } from "../utils";

type IUseInfiniteScrollingProps = {
	callback: () => unknown | Promise<unknown>;
	disabled: () => boolean;
	container: () => HTMLElement | undefined;
	parentContainer?: () => HTMLElement | undefined;
	bottomOffset?: number;
};

export const useInfiniteScrolling = ({
	callback,
	disabled,
	container,
	parentContainer,
	bottomOffset,
}: IUseInfiniteScrollingProps) => {
	const observer = new MutationObserver(() => load());

	const load = DelayUtil.throttle(() => {
		const el = container();
		const containerRect = el?.getBoundingClientRect();
		const parentRect = parentContainer?.()?.getBoundingClientRect();
		const viewportBottom = parentRect ? parentRect.bottom : window.innerHeight;
		if (!disabled() && containerRect) {
			const contentBottom = containerRect.bottom + (el!.scrollHeight - el!.clientHeight - el!.scrollTop);
			if (viewportBottom - contentBottom > (bottomOffset ?? -128)) {
				callback();
			}
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
