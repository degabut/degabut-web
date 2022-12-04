import { throttle } from "@utils";
import { Component, createSignal, JSX, onCleanup, Show } from "solid-js";

type Props = {
	isOpen?: boolean;
	handleClose?: () => void;
	extraContainerClass?: string;
	initialSize?: number;
	resizeable?: boolean;
	onResize?: (size: number) => void;
	right?: true;
	children: JSX.Element | ((size: number) => JSX.Element);
};

export const Drawer: Component<Props> = (props) => {
	const [size, setSize] = createSignal(props.initialSize || 256);
	const [isDragging, setIsDragging] = createSignal(false);

	onCleanup(() => cleanup());

	const startDrag = () => {
		if (!props.resizeable) return;
		setIsDragging(true);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", stopDrag);
	};

	const stopDrag = () => {
		setIsDragging(false);
		props.onResize?.(size());
		cleanup();
	};

	const cleanup = () => {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", stopDrag);
	};

	const handleMouseMove = throttle((ev: MouseEvent) => {
		setSize(props.right ? window.innerWidth - ev.clientX : ev.clientX);
	}, 50);

	return (
		<div class={`h-full absolute md:static top-0 z-20 ${props.extraContainerClass}`}>
			{props.isOpen && (
				<div
					class="block md:hidden fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-50 -z-50"
					onClick={props.handleClose}
				/>
			)}

			<div
				class="relative flex flex-row h-full min-w-[4.25rem] max-w-[90vw] md:max-w-sm bg-black overflow-y-auto overflow-x-hidden"
				classList={{ hidden: !props.isOpen }}
				style={{ width: `${size()}px` }}
			>
				<div class="flex flex-col grow w-full">
					{typeof props.children === "function" ? props.children(size()) : props.children}
				</div>

				<Show when={props.resizeable}>
					<div
						onMouseDown={startDrag}
						class="absolute top-0 h-full shrink w-2 border-neutral-600 cursor-col-resize select-none"
						classList={{
							"border-r-[1px]": isDragging() && !props.right,
							"border-l-[1px]": isDragging() && props.right,
							"right-0 hover:border-r-[1px]": !props.right,
							"left-0 hover:border-l-[1px]": props.right,
						}}
					/>
				</Show>
			</div>
		</div>
	);
};
