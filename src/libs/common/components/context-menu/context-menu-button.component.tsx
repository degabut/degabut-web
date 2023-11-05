import { ContextMenuDirectiveParams, buttonContextMenu } from "@common/directives";
import { Component } from "solid-js";
import { Icon } from "../icon";

buttonContextMenu;

type Props = {
	contextMenu?: ContextMenuDirectiveParams;
};

export const ContextMenuButton: Component<Props> = (props) => {
	return (
		<div
			use:buttonContextMenu={props.contextMenu}
			class="flex-row-center cursor-pointer text-neutral-400 hover:text-neutral-50 px-1 py-3"
		>
			<Icon name="ellipsis" extraClass="w-4 h-4 fill-current" />
		</div>
	);
};
