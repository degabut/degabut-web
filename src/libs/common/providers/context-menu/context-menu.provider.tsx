import { ContextMenuDirectiveParams, IContextMenuItem } from "@common/directives";
import { useHashState, useScreen } from "@common/hooks";
import { ParentComponent, Show, createContext, createEffect, createSignal, onMount } from "solid-js";
import { FloatingContextMenu, SlideUpContextMenu } from "./components";

export type ShowContextMenuParams = ContextMenuDirectiveParams & {
	x: number;
	y: number;
};

type ContextMenuContextStore = {
	show: (params: ShowContextMenuParams) => void;
};

export const ContextMenuContext = createContext<ContextMenuContextStore>();

export const ContextMenuProvider: ParentComponent = (props) => {
	const screen = useScreen();
	const hash = useHashState({ onPopState: () => setIsShowContextMenu(false) });
	const [isShowContextMenu, setIsShowContextMenu] = createSignal(false);
	const [params, setParams] = createSignal<ShowContextMenuParams>({ x: 0, y: 0, items: [] });

	const show = (params: ShowContextMenuParams) => {
		setIsShowContextMenu(true);
		setParams(params);
	};

	createEffect(() => {
		if (!screen.lte.sm) return;
		isShowContextMenu() ? hash.push() : hash.back();
	});

	onMount(() => {
		window.addEventListener("popstate", () => {
			if (isShowContextMenu()) setIsShowContextMenu(false);
		});
	});

	const onClick = (item: IContextMenuItem) => {
		item.onClick?.();
		setIsShowContextMenu(false);
	};

	return (
		<ContextMenuContext.Provider value={{ show }}>
			<Show when={isShowContextMenu()}>
				<Show
					when={screen.lte.sm}
					fallback={
						<FloatingContextMenu
							params={params()}
							onClickOutside={() => setIsShowContextMenu(false)}
							onItemClick={onClick}
							onPositionChange={(pos) => setParams((p) => ({ ...p, ...pos }))}
						/>
					}
				>
					<SlideUpContextMenu
						params={params()}
						onClickOutside={() => setIsShowContextMenu(false)}
						onItemClick={onClick}
					/>
				</Show>
			</Show>
			{props.children}
		</ContextMenuContext.Provider>
	);
};
