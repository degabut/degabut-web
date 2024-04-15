import { Show, createContext, createEffect, createSignal, onMount, useContext, type ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { type ContextMenuDirectiveParams, type IContextMenuItem } from "../../directives";
import { useHashState, usePortalFocus, useShortcut } from "../../hooks";
import { useScreen } from "../screen";
import { FloatingContextMenu, SlideUpContextMenu } from "./components";

export type ShowContextMenuParams = ContextMenuDirectiveParams & {
	target: HTMLElement | null;
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
	const [params, setParams] = createSignal<ShowContextMenuParams>({ x: 0, y: 0, items: [], target: null });
	usePortalFocus(isShowContextMenu);
	useShortcut({
		shortcuts: [
			{
				key: "Escape",
				handler: () => setIsShowContextMenu(false),
			},
		],
	});

	const show = (params: ShowContextMenuParams) => {
		setIsShowContextMenu(true);
		setParams(params);
	};

	createEffect(() => {
		if (screen.gte.md) return;
		isShowContextMenu() ? hash.push() : hash.back();
	});

	onMount(() => {
		window.addEventListener("popstate", () => {
			if (isShowContextMenu()) setIsShowContextMenu(false);
		});
	});

	const onClick = async (item: IContextMenuItem) => {
		const promise = item.onClick?.();
		setIsShowContextMenu(false);

		if (item.wait) {
			const el = params().target;
			if (el) {
				el.classList.add("opacity-50", "pointer-events-none");
				await promise;
				el.classList.remove("opacity-50", "pointer-events-none");
			}
		}
	};

	return (
		<ContextMenuContext.Provider value={{ show }}>
			<Portal>
				<Show when={isShowContextMenu()}>
					<Show
						when={!screen.gte.md}
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
			</Portal>
			{props.children}
		</ContextMenuContext.Provider>
	);
};

export const useContextMenu = () => useContext(ContextMenuContext);
