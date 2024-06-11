import type { Accessor, Component, JSX } from "solid-js";
import { Button, Icon, type Icons } from "../../";

type ItemHintProps = {
	icon: Icons;
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
			<div class="!w-12 !h-12 shrink-0 flex items-center justify-center rounded border border-neutral-600">
				<Icon name={props.icon} size="lg" extraClass="text-neutral-500" />
			</div>
			{props.label()}
		</Button>
	);
};
