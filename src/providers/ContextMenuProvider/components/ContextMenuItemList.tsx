import { Component, JSX } from "solid-js";

export type ContextMenuItem = {
	label?: string;
	element?: JSX.Element;
	onClick?: () => void;
};

type Props = {
	item: ContextMenuItem;
	onClick: (item: ContextMenuItem) => void;
	variant: "medium" | "big";
};

export const ContextMenuItemList: Component<Props> = (props) => {
	return (
		<div
			class="cursor-pointer hover:bg-white/10 rounded"
			classList={{
				"py-1.5 px-4": props.variant === "medium",
				"py-4 px-6": props.variant === "big",
			}}
			onClick={() => props.onClick(props.item)}
		>
			{props.item.element || props.item.label}
		</div>
	);
};
