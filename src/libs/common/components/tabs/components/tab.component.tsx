import { Component, Show } from "solid-js";
import { Icon, Icons } from "../../icon";
import { ITabItem } from "../tabs.component";

type LabelProps = {
	label: string;
	icon?: Icons;
	disabled?: boolean;
	isActive: boolean;
};

const TabLabel = (props: LabelProps) => {
	return (
		<div
			class="flex-row-center space-x-2 justify-center"
			classList={{
				"font-medium": props.isActive,
				"text-neutral-400": !props.isActive,
				"text-neutral-600": props.disabled,
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
	disabled?: boolean;
	extraContainerClass?: string;
	onClick: (item: ITabItem) => void;
};

export const Tab: Component<Props> = (props) => {
	return (
		<div
			class="grow"
			classList={{
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
				"cursor-pointer": !props.disabled,
			}}
			onClick={() => !props.disabled && props.onClick(props.item)}
		>
			<div class="px-2 md:px-12 xl:px-14 py-3 md:py-2">
				{"labelText" in props.item ? (
					<TabLabel
						icon={props.item.icon}
						label={props.item.labelText}
						disabled={props.disabled}
						isActive={props.isActive}
					/>
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
