import { Icons } from "@common/components";
import { Accessor, JSX, onCleanup, useContext } from "solid-js";
import { ContextMenuContext } from "../providers";

export type IContextMenuItem = {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
	icon?: Icons;
	iconUrl?: string;
};

export type ContextMenuDirectiveParams = {
	openWithClick?: boolean;
	items: IContextMenuItem[][] | IContextMenuItem[];
	header?: JSX.Element;
	extraContainerClass?: string;
};

export function contextMenu(el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) {
	const params = accessor();
	if (!params) return;

	const contextMenu = useContext(ContextMenuContext);
	if (!contextMenu) return;

	const onContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		setTimeout(() => {
			contextMenu.show({
				x: e.pageX,
				y: e.pageY,
				...accessor(),
			});
		}, 0);
	};

	const onClickContextMenu = (e: MouseEvent) => {
		e.stopPropagation();
		onContextMenu(e);
	};

	el.addEventListener("contextmenu", onContextMenu);
	if (params.openWithClick) el.addEventListener("click", onClickContextMenu);

	onCleanup(() => {
		el.removeEventListener("contextmenu", onContextMenu);
		if (params.openWithClick) el.removeEventListener("click", onClickContextMenu);
	});
}

export function buttonContextMenu(el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) {
	const contextMenu = useContext(ContextMenuContext);
	if (contextMenu) {
		const params = accessor();

		const onClick = (e: MouseEvent) => {
			e.stopPropagation();
			contextMenu.show({
				x: e.pageX,
				y: e.pageY,
				...params,
			});
		};

		el.addEventListener("click", onClick);
		onCleanup(() => document.removeEventListener("click", onClick));
	}
}