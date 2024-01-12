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
	extraContainerClass?: string;
	onClick: (item: ITabItem) => void;
};

export const Tab: Component<Props> = (props) => {
	return (
		<div
			class="grow cursor-pointer"
			classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
			onClick={() => props.onClick(props.item)}
		>
			<div class="px-2 md:px-12 xl:px-14 py-3 md:py-2">
				{"labelText" in props.item ? (
					<TabLabel icon={props.item.icon} label={props.item.labelText} isActive={props.isActive} />
				) : (
					props.item.label({ isActive: props.isActive })
				)}
			</div>

			<Show when={props.isActive}>
				<div class="sticky bottom-0 h-0.5 bg-white w-full" />
			</Show>
		</div>
	);
};
