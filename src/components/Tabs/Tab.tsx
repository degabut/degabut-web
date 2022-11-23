import { Component } from "solid-js";
import { Item } from "./Tabs";

type Props = {
	item: Item;
	isActive: boolean;
	onClick: (item: Item) => void;
};

export const Tab: Component<Props> = (props) => {
	return (
		<div class="flex-grow md:flex-grow-0 cursor-pointer" onClick={() => props.onClick(props.item)}>
			<div class="px-2 md:px-12 py-3 md:py-2" classList={{ "border-b-2 border-b-white": props.isActive }}>
				{props.item.label({ isActive: props.isActive })}
			</div>
		</div>
	);
};
