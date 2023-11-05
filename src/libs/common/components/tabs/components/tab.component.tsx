import { Component, Show } from "solid-js";
import { Icon, Icons } from "../../icon";
import { ITabItem } from "../tabs.component";

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
	item: ITabItem;
	isActive: boolean;
	onClick: (item: ITabItem) => void;
};

export const Tab: Component<Props> = (props) => {
	return (
		<div class="grow md:grow-0 cursor-pointer" onClick={() => props.onClick(props.item)}>
			<div
				class="px-2 md:px-12 xl:px-14 py-3 md:py-2"
				classList={{ "md:border-b-2 border-b-[5px] border-b-white": props.isActive }}
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
