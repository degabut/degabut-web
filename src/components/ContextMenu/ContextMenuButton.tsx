import { Icon } from "@components/Icon";
import { buttonContextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component } from "solid-js";

buttonContextMenu;

type Props = {
	contextMenu?: ContextMenuDirectiveParams;
};

export const ContextMenuButton: Component<Props> = (props) => {
	return (
		<div
			use:buttonContextMenu={props.contextMenu}
			class="flex-row-center cursor-pointer text-neutral-400 fill-current px-2 py-3"
		>
			<Icon name="ellipsis" extraClass="w-4 h-4" />
		</div>
	);
};
