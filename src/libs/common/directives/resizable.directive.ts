import { createEffect, onCleanup, type Accessor } from "solid-js";
import { DelayUtil } from "../utils";

export type ResizableParams = {
	onResize?: (width: number) => void;
	onDragStart?: () => void;
	onDragEnd?: () => void;
	dragHandler: HTMLElement;
	position: "left" | "right";
};

export const resizable = (el: HTMLElement, params?: Accessor<ResizableParams>) => {
	if (!params?.()) return;
	let startPosition = 0;
	let startWidth = 0;

	createEffect(() => {
		if (params().dragHandler) {
			params().dragHandler.addEventListener("mousedown", startDrag);
			params().dragHandler.addEventListener("touchstart", startDrag);
		}
	});

	onCleanup(() => {
		if (params().dragHandler) {
			params().dragHandler.removeEventListener("mousedown", startDrag);
			params().dragHandler.removeEventListener("touchstart", startDrag);
		}
		stopDrag();
	});

	const startDrag = (e: MouseEvent | TouchEvent) => {
		document.body.style.cursor = "col-resize";
		startPosition = "clientX" in e ? e.clientX : e.touches[0].clientX;
		startWidth = el.getBoundingClientRect().width;
		window.addEventListener("mousemove", handleDragMove);
		window.addEventListener("touchmove", handleDragMove);
		window.addEventListener("mouseup", stopDrag, { once: true });
		window.addEventListener("touchend", stopDrag, { once: true });
		params().onDragStart?.();
	};

	const stopDrag = () => {
		document.body.style.cursor = "";
		window.removeEventListener("mousemove", handleDragMove);
		window.removeEventListener("touchmove", handleDragMove);
		params().onDragEnd?.();
	};

	const handleDragMove = DelayUtil.throttle((ev: MouseEvent | TouchEvent) => {
		const isRight = params().position === "right";
		const x = "clientX" in ev ? ev.clientX : ev.touches[0].clientX;
		const diff = x - startPosition;
		const size = !isRight ? startWidth - diff : startWidth + diff;
		setSize(Math.max(size, 0));
	}, 35);

	const setSize = (size: number) => {
		el.style.width = `${size}px`;
		params().onResize?.(size);
	};
};
