import { Show } from "solid-js";
import { Icon, type Icons } from "../../";

type LabelProps = {
	label: string;
	icon?: Icons;
	disabled?: boolean;
	isActive: boolean;
};

export const TabLabel = (props: LabelProps) => {
	return (
		<div
			class="flex-row-center space-x-2 justify-center px-2 md:px-12 xl:px-14 py-3 md:py-2"
			classList={{
				"font-medium": props.isActive,
				"text-neutral-400": !props.isActive,
				"text-neutral-600": props.disabled,
			}}
		>
			<Show when={props.icon} keyed>
				{(icon) => <Icon name={icon} size="md" />}
			</Show>
			<div>{props.label}</div>
		</div>
	);
};
