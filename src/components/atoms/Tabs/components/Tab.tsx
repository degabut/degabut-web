import { Icon, Icons } from "@components/atoms";
import { Component, Show } from "solid-js";
import { Item } from "../Tabs";

type LabelProps = {
	label: string;
	icon?: Icons;
	isActive: boolean;
};

const TabLabel = (props: LabelProps) => {
	return (
		<div
			class="flex-row-center space-x-2 justify-center"
			classList={{
				"font-medium": props.isActive,
				"text-neutral-400": !props.isActive,
			}}
		>
			<Show when={props.icon} keyed>
				{(icon) => <Icon name={icon} size="md" extraClass="fill-current" />}
			</Show>
			<div>{props.label}</div>
		</div>
	);
};

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
