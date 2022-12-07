import { Component } from "solid-js";
import { TabLabel } from "./TabLabel";
import { Item } from "./Tabs";

type Props = {
	item: Item;
	isActive: boolean;
	onClick: (item: Item) => void;
};

export const Tab: Component<Props> = (props) => {
	return (
		<div class="grow md:grow-0 cursor-pointer" onClick={() => props.onClick(props.item)}>
			<div
				class="px-2 md:px-8 lg:px-10 xl:px-12 py-3 md:py-2"
				classList={{ "border-b-2 border-b-white": props.isActive }}
			>
				{"labelText" in props.item ? (
					<TabLabel icon={props.item.icon} label={props.item.labelText} isActive={props.isActive} />
				) : (
					props.item.label({ isActive: props.isActive })
				)}
			</div>
		</div>
	);
};
