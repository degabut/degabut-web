import { Divider } from "@components/Divider";
import { clickOutside } from "@directives/clickOutside";
import { Component, createEffect, For, Show } from "solid-js";
import { ShowParams } from "../ContextMenuProvider";
import { ContextMenuItem, ContextMenuItemList } from "./ContextMenuItemList";

clickOutside;

type Position = {
	x?: number;
	y?: number;
};

type Props = {
	params: ShowParams;
	onClickOutside: () => void;
	onPositionChange: (position: Position) => void;
	onItemClick: (item: ContextMenuItem) => void;
};

export const FloatingContextMenu: Component<Props> = (props) => {
	let contextMenuElement!: HTMLDivElement;

	createEffect(() => {
		if (props.params && contextMenuElement) {
			const rect = contextMenuElement.getBoundingClientRect();

			const pos: { x?: number; y?: number } = {};

			if (rect.x + rect.width > window.innerWidth) pos.x = window.innerWidth - rect.width;
			if (rect.y + rect.height > window.innerHeight) pos.y = window.innerHeight - rect.height;
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
			class={`fixed bg-neutral-900 z-50 min-w-[12rem] w-max p-1.5 rounded ${props.params.extraContainerClass}`}
		>
			<For each={props.params.items}>
				{(itemItems, i) => (
					<>
						<For each={itemItems}>
							{(item) => <ContextMenuItemList item={item} onClick={props.onItemClick} variant="medium" />}
						</For>

						<Show when={i() < props.params.items.length - 1 && itemItems.length}>
							<Divider dark extraClass="my-1.5" />
						</Show>
					</>
				)}
			</For>
		</div>
	);
};
