import { onCleanup, useContext, type Accessor, type JSX } from "solid-js";
import type { Icons } from "../components";
import { ContextMenuContext } from "../providers";

export type IContextMenuItem = {
	label: string;
	disabled?: boolean;
	onClick?: () => unknown | (() => Promise<unknown>);
	wait?: boolean;
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

	const onContextMenu = (e: MouseEvent | KeyboardEvent) => {
		e.preventDefault();
		const a = accessor();
		if (!a.items.length) return;

		const x = e instanceof MouseEvent ? e.pageX : el.getBoundingClientRect().left;
		const y = e instanceof MouseEvent ? e.pageY : el.getBoundingClientRect().bottom;

		setTimeout(() => {
			contextMenu.show({ x, y, target: el, ...a });
		}, 0);
	};

	const onClickContextMenu = (e: MouseEvent) => {
		e.stopPropagation();
		onContextMenu(e);
	};

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key !== "Enter") return;
		e.stopPropagation();
		onContextMenu(e);
	};

	el.addEventListener("contextmenu", onContextMenu);
	if (params.openWithClick) {
		el.addEventListener("click", onClickContextMenu);
		el.addEventListener("keypress", onKeyPress);
	}

	onCleanup(() => {
		el.removeEventListener("contextmenu", onContextMenu);
		if (params.openWithClick) {
			el.removeEventListener("click", onClickContextMenu);
			el.removeEventListener("keypress", onKeyPress);
		}
	});
}

export function buttonContextMenu(el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) {
	const contextMenu = useContext(ContextMenuContext);
	if (contextMenu) {

		const onClick = (e: MouseEvent) => {
			e.stopPropagation();
			const params = accessor();
			if (!params) return;

			contextMenu.show({
				x: e.pageX,
				y: e.pageY,
				target: el,
				...params,
			});
		};

		el.addEventListener("click", onClick);
		onCleanup(() => document.removeEventListener("click", onClick));
	}
}
