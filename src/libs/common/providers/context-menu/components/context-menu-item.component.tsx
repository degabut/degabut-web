import { Show, type Component } from "solid-js";
import { Button, Icon, Text } from "../../../components";
import { type IContextMenuItem } from "../../../directives";

type ContextMenuItemProps = {
	item: IContextMenuItem;
	size: "md" | "lg";
	onClick: (item: IContextMenuItem) => void;
};

export const ContextMenuItem: Component<ContextMenuItemProps> = (props) => {
	return (
		<Button
			flat
			disabled={props.item.disabled}
			class="flex-row-center space-x-4 rounded w-full"
			classList={{
				"py-1.5 px-4": props.size === "md",
				"py-4 px-6": props.size === "lg",
			}}
			onClick={() => !props.item.disabled && props.onClick(props.item)}
		>
			<Show when={props.item.icon} keyed>
				{(icon) => <Icon name={icon} extraClass="fill-current h-4 w-4" />}
			</Show>
			<Show when={props.item.iconUrl} keyed>
				{(url) => <img src={url} class="h-6 w-6" />}
			</Show>
			<Text.Body1>{props.item.label}</Text.Body1>
		</Button>
	);
};
