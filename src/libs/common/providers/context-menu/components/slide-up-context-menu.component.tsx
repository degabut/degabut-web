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
				class="absolute bottom-0 w-full bg-neutral-900 pt-6 flex flex-col min-h-[50vh] max-h-[75vh] mt-72 rounded-t-[1.5rem]"
				classList={{ [props.params.extraContainerClass || ""]: !!props.params.extraContainerClass }}
			>
				<div class="h-full overflow-y-auto pb-8">
					<div class="px-2 pb-4">{props.params.header}</div>
					<For each={props.params.items.flat()}>
						{(item) => <ContextMenuItem item={item} size="lg" onClick={props.onItemClick} />}
					</For>
				</div>
			</div>
		</div>
	);
};
