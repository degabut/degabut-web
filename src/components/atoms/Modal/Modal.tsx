import { Button } from "@components/atoms";
import { clickOutside } from "@directives/clickOutside";
import { useHashState } from "@hooks/useHashState";
import { useLocation } from "@solidjs/router";
import { createEffect, onCleanup, onMount, ParentComponent, Show } from "solid-js";

clickOutside;

type Props = {
	isOpen: boolean;
	extraContainerClass?: string;
	closeOnEscape?: boolean;
	hideCloseButton?: boolean;
	disableHashState?: boolean;
	closeOnPathChange?: boolean;
	onClickOutside?: () => void;
};

export const Modal: ParentComponent<Props> = (props) => {
	const location = useLocation();
	const hash = useHashState({ onPopState: () => props.onClickOutside?.() });
	let parentContainer!: HTMLDivElement;

	createEffect(() => {
		if (props.disableHashState !== true) {
			props.isOpen ? hash.push() : hash.back();
		}
	});

	createEffect(() => {
		if (props.closeOnPathChange && location.pathname) {
			props.onClickOutside?.();
		}
	});

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		document.removeEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && props.isOpen && props.closeOnEscape) {
			e.preventDefault();
			props.onClickOutside?.();
		}
	};

	return (
		<Show when={props.isOpen}>
			<div ref={parentContainer} class="fixed-screen flex items-center justify-center bg-black/75 z-30">
				<div
					class="max-w-[calc(100vw-1.5rem)] rounded-lg"
					classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
					use:clickOutside={{
						handler: props.onClickOutside,
						target: parentContainer,
					}}
				>
					<Show when={!props.hideCloseButton}>
						<div class="sticky top-0 right-0 z-30">
							<Button
								flat
								icon="closeLine"
								class="absolute right-2 top-2 md:right-4 md:top-4 p-2"
								onClick={() => props.onClickOutside?.()}
							/>
						</div>
					</Show>
					{props.children}
				</div>
			</div>
		</Show>
	);
};
