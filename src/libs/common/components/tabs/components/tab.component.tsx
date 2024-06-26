import { Show, type Component } from "solid-js";
import type { ITabItem } from "../tabs.component";
import { TabLabel } from "./tab-label.component";

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

			<Show when={props.isActive}>
				<div class="sticky bottom-0 h-0.5 bg-white w-full" />
			</Show>
		</div>
	);
};
