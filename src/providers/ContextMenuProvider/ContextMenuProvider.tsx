import { useScreen } from "@hooks/useScreen";
import { createContext, createSignal, JSX, onMount, ParentComponent, Show } from "solid-js";
import { ContextMenuItem, FloatingContextMenu, SlideUpContextMenu } from "./components";

export type ShowParams = {
	x: number;
	y: number;
	openWithClick?: boolean;
	items: ContextMenuItem[][];
	header?: JSX.Element;
	extraContainerClass?: string;
};
export type ContextMenuDirectiveParams = Omit<ShowParams, "x" | "y">;

type ContextMenuContextStore = {
	show: (params: ShowParams) => void;
};

export const ContextMenuContext = createContext<ContextMenuContextStore>();

// TODO back button to close context menu
export const ContextMenuProvider: ParentComponent = (props) => {
	const screen = useScreen();
	const [isShowContextMenu, setIsShowContextMenu] = createSignal(false);
	const [params, setParams] = createSignal<ShowParams>({ x: 0, y: 0, items: [], header: null });

	const show = (params: ShowParams) => {
		setIsShowContextMenu(true);
		setParams(params);
	};

	onMount(() => {
		window.addEventListener("popstate", () => {
			if (isShowContextMenu()) setIsShowContextMenu(false);
		});
	});

	const onClick = (item: ContextMenuItem) => {
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
