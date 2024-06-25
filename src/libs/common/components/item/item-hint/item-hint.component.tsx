import type { Accessor, Component, JSX } from "solid-js";
import { Button, Icon, type Icons } from "../../";
import { type ItemListSize } from "../item-list";
import "../item.css";

type ItemHintProps = {
	icon: Icons;
	size?: ItemListSize;
	onClick?: () => void;
	label: Accessor<JSX.Element>;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean | undefined>;
};

export const ItemHint: Component<ItemHintProps> = (props) => {
	return (
		<Button
			flat
			onClick={() => props.onClick?.()}
			class="flex flex-row items-center w-full space-x-3 p-1.5"
			classList={{
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
		>
			<div
				class="shrink-0 flex items-center justify-center rounded border border-neutral-600"
				classList={{
					"item-image": !props.size || props.size === "md",
					"item-image-lg": props.size === "lg",
				}}
			>
				<Icon name={props.icon} size="lg" extraClass="text-neutral-400" />
			</div>
			{props.label()}
		</Button>
	);
};
