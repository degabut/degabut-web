import { clickOutside } from "@directives/clickOutside";
import { Component, For } from "solid-js";
import { ShowParams } from "../ContextMenuProvider";
import { ContextMenuItem, ContextMenuItemList } from "./ContextMenuItemList";

clickOutside;

type Props = {
	params: ShowParams;
	onClickOutside: () => void;
	onItemClick: (item: ContextMenuItem) => void;
};

export const SlideUpContextMenu: Component<Props> = (props) => {
	return (
		<div class="fixed w-screen h-screen top-0 left-0 bg-black/75 z-50">
			<div
				use:clickOutside={props.onClickOutside}
				class={`absolute bottom-0 w-full bg-neutral-900 pb-8 z-50 min-h-[50vh] max-h-full overflow-y-auto rounded-t-3xl ${props.params.extraContainerClass}`}
			>
				<div class="px-2">{props.params.header}</div>
				<For each={props.params.items.flat()}>
					{(item) => <ContextMenuItemList variant="big" item={item} onClick={props.onItemClick} />}
				</For>
			</div>
		</div>
	);
};
