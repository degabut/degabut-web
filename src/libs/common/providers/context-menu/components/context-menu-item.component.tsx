import { Icon, Text } from "@common/components";
import { IContextMenuItem } from "@common/directives";
import { Component, Show } from "solid-js";

type ContextMenuItemProps = {
	item: IContextMenuItem;
	variant: "medium" | "big";
	onClick: (item: IContextMenuItem) => void;
};

export const ContextMenuItem: Component<ContextMenuItemProps> = (props) => {
	return (
		<div
			class="flex-row-center space-x-4 rounded"
			classList={{
				"cursor-pointer hover:bg-white/10": !props.item.disabled,
				"py-1.5 px-4": props.variant === "medium",
				"py-4 px-6": props.variant === "big",
			}}
			onClick={() => !props.item.disabled && props.onClick(props.item)}
		>
			<Show when={props.item.icon} keyed>
				{(icon) => (
					<Icon
						name={icon}
						extraClass="fill-current h-4 w-4"
						extraClassList={{
							"text-neutral-400": !props.item.disabled,
							"text-neutral-600": !!props.item.disabled,
						}}
					/>
				)}
			</Show>
			<Show when={props.item.iconUrl} keyed>
				{(url) => <img src={url} class="h-6 w-6" />}
			</Show>
			<Text.Body1 classList={{ "text-neutral-500": props.item.disabled }}>{props.item.label}</Text.Body1>
		</div>
	);
};
