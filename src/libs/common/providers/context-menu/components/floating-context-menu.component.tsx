import { Divider } from "@common/components";
import { IContextMenuItem, clickOutside } from "@common/directives";
import { Component, For, Show, createEffect } from "solid-js";
import { ShowContextMenuParams } from "../context-menu.provider";
import { ContextMenuItem } from "./context-menu-item.component";

clickOutside;

type Position = {
	x?: number;
	y?: number;
};

type FloatingContextMenuProps = {
	params: ShowContextMenuParams;
	onClickOutside: () => void;
	onPositionChange: (position: Position) => void;
	onItemClick: (item: IContextMenuItem) => void;
};

export const FloatingContextMenu: Component<FloatingContextMenuProps> = (props) => {
	let contextMenuElement!: HTMLDivElement;

	createEffect(() => {
		if (props.params && contextMenuElement) {
			const rect = contextMenuElement.getBoundingClientRect();

			const pos: { x?: number; y?: number } = {};

			if (rect.x + rect.width > window.innerWidth) pos.x = props.params.x - rect.width;
			if (rect.y + rect.height > window.innerHeight) pos.y = props.params.y - rect.height;
			if (pos.x || pos.y) props.onPositionChange(pos);
		}
	});

	return (
		<div
			ref={contextMenuElement}
			use:clickOutside={props.onClickOutside}
			style={{
				left: props.params.x + "px",
				top: props.params.y + "px",
			}}
			class="fixed bg-neutral-800 z-50 min-w-[12rem] w-max p-1.5 rounded"
			classList={{ [props.params.extraContainerClass || ""]: !!props.params.extraContainerClass }}
		>
			<Show
				when={Array.isArray(props.params.items.at(0))}
				keyed
				fallback={
					<For each={props.params.items as IContextMenuItem[]}>
						{(item) => <ContextMenuItem variant="medium" item={item} onClick={props.onItemClick} />}
					</For>
				}
			>
				<For each={props.params.items as IContextMenuItem[][]}>
					{(itemItems, i) => (
						<>
							<For each={itemItems}>
								{(item) => <ContextMenuItem variant="medium" item={item} onClick={props.onItemClick} />}
							</For>

							<Show when={i() < props.params.items.length - 1 && itemItems.length}>
								<Divider extraClass="my-1.5" />
							</Show>
						</>
					)}
				</For>
			</Show>
		</div>
	);
};
