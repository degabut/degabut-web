import { For, type Component } from "solid-js";
import { clickOutside, type IContextMenuItem } from "../../../directives";
import type { ShowContextMenuParams } from "../context-menu.provider";
import { ContextMenuItem } from "./context-menu-item.component";

clickOutside;

type SlideUpContextMenuProps = {
	params: ShowContextMenuParams;
	onClickOutside: () => void;
	onItemClick: (item: IContextMenuItem) => void;
};

export const SlideUpContextMenu: Component<SlideUpContextMenuProps> = (props) => {
	return (
		<div class="fixed-screen bg-black/75 z-50">
			<div
				use:clickOutside={props.onClickOutside}
				class="absolute bottom-0 w-full bg-neutral-900 py-8 z-50 min-h-[50vh] max-h-[75vh] overflow-y-auto rounded-t-[3rem]"
				classList={{ [props.params.extraContainerClass || ""]: !!props.params.extraContainerClass }}
			>
				<div class="px-2">{props.params.header}</div>
				<For each={props.params.items.flat()}>
					{(item) => <ContextMenuItem item={item} size="lg" onClick={props.onItemClick} />}
				</For>
			</div>
		</div>
	);
};
