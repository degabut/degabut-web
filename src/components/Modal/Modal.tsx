import { Icon } from "@components/Icon";
import { clickOutside } from "@directives/clickOutside";
import { useHashState } from "@hooks/useHashState";
import { createEffect, onCleanup, onMount, ParentComponent, Show } from "solid-js";

clickOutside;

type Props = {
	isOpen: boolean;
	extraContainerClass?: string;
	closeOnEscape?: boolean;
	hideCloseButton?: boolean;
	onClickOutside?: () => void;
};

export const Modal: ParentComponent<Props> = (props) => {
	let parentContainer!: HTMLDivElement;
	const hash = useHashState({
		onPopState: () => props.onClickOutside?.(),
	});

	createEffect(() => {
		props.isOpen ? hash.push() : hash.back();
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
			<div
				ref={parentContainer}
				class="fixed w-screen h-screen top-0 left-0 flex items-center justify-center bg-black/75 z-30"
			>
				<div
					class={`max-w-[calc(100vw-1.5rem)] rounded-lg ${props.extraContainerClass}`}
					use:clickOutside={{
						handler: props.onClickOutside,
						target: parentContainer,
					}}
				>
					<Show when={!props.hideCloseButton}>
						<div class="sticky top-0 right-0 z-30">
							<button
								class="absolute right-4 top-4 p-1 cursor-pointer fill-neutral-500 hover:fill-neutral-200"
								onClick={() => props.onClickOutside?.()}
							>
								<Icon name="closeLine" size="md" />
							</button>
						</div>
					</Show>
					{props.children}
				</div>
			</div>
		</Show>
	);
};