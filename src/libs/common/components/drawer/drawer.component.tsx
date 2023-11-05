import { resizable } from "@common/directives";
import { Component, createSignal, JSX, Show } from "solid-js";

resizable;

type Props = {
	isOpen?: boolean;
	handleClose?: () => void;
	extraContainerClass?: string;
	initialSize?: number;
	resizable?: boolean;
	onResize?: (size: number) => void;
	right?: true;
	children: (size: number) => JSX.Element;
};

export const Drawer: Component<Props> = (props) => {
	let dragHandler!: HTMLDivElement;
	const [size, setSize] = createSignal(props.initialSize ?? 256);
	const [isResizing, setIsResizing] = createSignal(false);

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
				use:resizable={
					props.resizable
						? {
								dragHandler,
								position: props.right ? "left" : "right",
								onResize,
								onDragStart: () => setIsResizing(true),
								onDragEnd: () => setIsResizing(false),
						  }
						: undefined
				}
				classList={{
					hidden: !props.isOpen,
					[props.extraContainerClass || ""]: !!props.extraContainerClass,
				}}
			>
				<div class="flex flex-col grow w-full">{props.children(size())}</div>

				<Show when={props.resizable}>
					<div
						ref={dragHandler}
						class="absolute top-0 h-full shrink w-2 border-neutral-500 cursor-col-resize select-none"
						classList={{
							"right-0 hover:border-r": !props.right,
							"left-0 hover:border-l": props.right,
							"border-r": !props.right && isResizing(),
							"border-l": props.right && isResizing(),
						}}
					/>
				</Show>
			</div>
		</div>
	);
};
