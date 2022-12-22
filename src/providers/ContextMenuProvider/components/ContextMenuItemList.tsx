import { Component, JSX } from "solid-js";

export type ContextMenuItem = {
	label?: string;
	element?: JSX.Element;
	disabled?: boolean;
	onClick?: () => void;
};

type Props = {
	item: ContextMenuItem;
	onClick: (item: ContextMenuItem) => void;
	variant: "medium" | "big";
};

export const ContextMenuItemList: Component<Props> = (props) => {
	const onClick = (e: MouseEvent) => {
		if (props.item.disabled) return e.preventDefault();
		props.onClick(props.item);
	};

	return (
		<div
			class="rounded"
			classList={{
				"py-1.5 px-4": props.variant === "medium",
				"py-4 px-6": props.variant === "big",
				"cursor-pointer hover:bg-white/10": !props.item.disabled,
			}}
			onClick={onClick}
		>
			{props.item.element || props.item.label}
		</div>
	);
};
