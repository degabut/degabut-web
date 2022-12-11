import { resizeable } from "@directives/resizeable";
import { Component, createSignal, JSX, Show } from "solid-js";

resizeable;

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
	let dragHandler!: HTMLDivElement;
	const [size, setSize] = createSignal(props.initialSize ?? 256);

	const onResize = (width: number) => {
		setSize(width);
		if (props.onResize) props.onResize(width);
	};

	return (
		<div class="h-full absolute md:static top-0 z-20" classList={{ "right-0": props.right }}>
			{props.isOpen && (
				<div class="block md:hidden fixed-screen bg-black bg-opacity-50 -z-50" onClick={props.handleClose} />
			)}

			<div
				class="relative flex flex-row h-full bg-black overflow-y-auto overflow-x-hidden"
				style={{ width: `${size()}px` }}
				use:resizeable={
					props.resizeable ? { dragHandler, position: props.right ? "left" : "right", onResize } : undefined
				}
				classList={{
					hidden: !props.isOpen,
					[props.extraContainerClass || ""]: !!props.extraContainerClass,
				}}
			>
				<div class="flex flex-col grow w-full">
					{typeof props.children === "function" ? props.children(size()) : props.children}
				</div>

				<Show when={props.resizeable}>
					<div
						ref={dragHandler}
						class="absolute top-0 h-full shrink w-2 border-neutral-600 cursor-col-resize select-none"
						classList={{
							"right-0 hover:border-r-[1px]": !props.right,
							"left-0 hover:border-l-[1px]": props.right,
						}}
					/>
				</Show>
			</div>
		</div>
	);
};
