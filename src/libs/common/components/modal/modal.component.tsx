import { useLocation } from "@solidjs/router";
import { Show, createEffect, type ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { clickOutside } from "../../directives";
import { useHashState, usePortalFocus, useShortcut } from "../../hooks";
import { Button } from "../button";

clickOutside;

type Props = {
	isOpen: boolean;
	extraContainerClass?: string;
	closeOnEscape?: boolean;
	hideCloseButton?: boolean;
	disableHashState?: boolean;
	closeOnPathChange?: boolean;
	handleClose: () => void;
};

export const Modal: ParentComponent<Props> = (props) => {
	const location = useLocation();
	const hash = useHashState({ onPopState: () => props.handleClose() });
	usePortalFocus(() => props.isOpen);
	let parentContainer!: HTMLDivElement;

	useShortcut({
		shortcuts: [
			{
				key: "Escape",
				handler: (e) => {
					if (props.isOpen && props.closeOnEscape) {
						e.preventDefault();
						props.handleClose();
					}
				},
			},
		],
	});

	createEffect(() => {
		if (props.disableHashState !== true) props.isOpen ? hash.push() : hash.back();
	});

	createEffect(() => {
		if (props.closeOnPathChange && location.pathname) props.handleClose?.();
	});

	return (
		<Show when={props.isOpen}>
			<Portal>
				<div ref={parentContainer} class="fixed-screen flex items-center justify-center bg-black/75 z-30">
					<div
						class="absolute max-w-[calc(100vw-1.5rem)] rounded-lg bg-neutral-900"
						classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
						use:clickOutside={{
							handler: props.handleClose,
							target: parentContainer,
						}}
					>
						<Show when={!props.hideCloseButton}>
							<Button
								flat
								icon="closeLine"
								class="absolute right-2 top-2 md:right-4 md:top-4 p-2"
								onClick={() => props.handleClose?.()}
							/>
						</Show>
						{props.children}
					</div>
				</div>
			</Portal>
		</Show>
	);
};
