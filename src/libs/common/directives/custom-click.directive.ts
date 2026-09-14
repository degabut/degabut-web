import { onCleanup, type Accessor } from "solid-js";

const LONG_PRESS_DURATION = 500;
const LONG_PRESS_RESET_DURATION = 1000;

export type CustomClickDirectiveParams = {
	onShiftClick?: (e: MouseEvent) => void;
	onLongPress?: () => void;
};

export function customClick(el: HTMLElement, accessor: Accessor<CustomClickDirectiveParams | undefined>) {
	let longPressTimeout: ReturnType<typeof setTimeout> | undefined;
	let resetTimeout: ReturnType<typeof setTimeout> | undefined;
	let isTouching = false;
	let didLongPress = false;

	const clearTimeouts = () => {
		clearTimeout(longPressTimeout);
		clearTimeout(resetTimeout);
		longPressTimeout = undefined;
		resetTimeout = undefined;
	};

	const stopEvent = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	};

	const onTouchStart = () => {
		if (!accessor()?.onLongPress) return;

		isTouching = true;
		didLongPress = false;
		clearTimeouts();
		longPressTimeout = setTimeout(() => {
			longPressTimeout = undefined;
			didLongPress = true;
			accessor()?.onLongPress?.();
		}, LONG_PRESS_DURATION);
	};

	const onTouchEnd = () => {
		isTouching = false;
		clearTimeout(longPressTimeout);
		longPressTimeout = undefined;
		if (!didLongPress) return;

		resetTimeout = setTimeout(() => {
			didLongPress = false;
		}, LONG_PRESS_RESET_DURATION);
	};

	const onTouchCancel = () => {
		isTouching = false;
		clearTimeouts();
	};

	const onTouchMove = () => {
		isTouching = false;
		clearTimeout(longPressTimeout);
		longPressTimeout = undefined;
	};

	const onContextMenu = (e: MouseEvent) => {
		if (!isTouching && !didLongPress) return;
		stopEvent(e);
	};

	const onClick = (e: MouseEvent) => {
		if (didLongPress) {
			clearTimeout(resetTimeout);
			resetTimeout = undefined;
			didLongPress = false;
			stopEvent(e);
			return;
		}

		const params = accessor();
		if (!params) return;

		if (e.shiftKey) {
			params.onShiftClick?.(e);
			e.stopPropagation();
		}
	};

	el.addEventListener("touchstart", onTouchStart);
	el.addEventListener("touchend", onTouchEnd);
	el.addEventListener("touchcancel", onTouchCancel);
	el.addEventListener("touchmove", onTouchMove);
	el.addEventListener("click", onClick, true);
	el.addEventListener("contextmenu", onContextMenu, true);

	onCleanup(() => {
		clearTimeouts();
		el.removeEventListener("touchstart", onTouchStart);
		el.removeEventListener("touchend", onTouchEnd);
		el.removeEventListener("touchcancel", onTouchCancel);
		el.removeEventListener("touchmove", onTouchMove);
		el.removeEventListener("click", onClick, true);
		el.removeEventListener("contextmenu", onContextMenu, true);
	});
}
