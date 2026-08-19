import { onCleanup, type Accessor } from "solid-js";

export type CustomClickDirectiveParams = {
	onShiftClick?: (e: MouseEvent) => void;
};

export function customClick(el: HTMLElement, accessor: Accessor<CustomClickDirectiveParams | undefined>) {
	const onClick = (e: MouseEvent) => {
		const params = accessor();
		if (!params) return;

		if (e.shiftKey) {
			params.onShiftClick?.(e);
			e.stopPropagation();
		}
	};

	el.addEventListener("click", onClick);
	onCleanup(() => el.removeEventListener("click", onClick));
}
