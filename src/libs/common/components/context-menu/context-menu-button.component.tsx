import type { Component } from "solid-js";
import { buttonContextMenu, type ContextMenuDirectiveParams } from "../../directives";
import { Icon, type IconSize } from "../icon";

buttonContextMenu;

type Props = {
	contextMenu?: ContextMenuDirectiveParams;
	iconSize?: IconSize;
};

export const ContextMenuButton: Component<Props> = (props) => {
	return (
		<div
			use:buttonContextMenu={props.contextMenu}
			class="flex-row-center cursor-pointer text-neutral-400 hover:text-neutral-50 px-1 py-3"
		>
			<Icon name="ellipsis" size={props.iconSize || "md"} />
		</div>
	);
};
