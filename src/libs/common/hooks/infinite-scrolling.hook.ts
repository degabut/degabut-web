import { onCleanup, onMount } from "solid-js";

type IUseInfiniteScrollingProps = {
	callback: () => void;
	disabled: () => boolean;
	container: () => HTMLElement;
	bottomOffset?: number;
};

export const useInfiniteScrolling = ({ callback, disabled, container, bottomOffset }: IUseInfiniteScrollingProps) => {
	const load = () => {
		const containerRect = container()?.getBoundingClientRect();
		if (!disabled() && containerRect && window.innerHeight - containerRect.bottom > (bottomOffset ?? -128)) {
			callback();
		}
	};

	onMount(() => document.addEventListener("scroll", load, true));
	onCleanup(() => document.removeEventListener("scroll", load, true));

	return { load };
};
