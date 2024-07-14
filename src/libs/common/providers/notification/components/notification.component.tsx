import interact from "@interactjs/interact";
import { type DragEvent, type Interactable } from "@interactjs/types";
import { createEffect, onCleanup, Show, type Accessor, type Component, type JSX } from "solid-js";
import { Icon } from "../../../components";
import { useScreen } from "../../screen";

export type Notification = {
	imageUrl?: string | null;
	message: Accessor<JSX.Element>;
};

type NotificationProps = {
	onClose?: () => void;
} & Notification;

export const Notification: Component<NotificationProps> = (props) => {
	let ref!: HTMLDivElement;
	let interactable: Interactable;
	const screen = useScreen();
	let x = 0;

	createEffect(() => {
		interactable?.unset();
		if (!screen.gte.md) {
			interactable = interact(ref).draggable({
				startAxis: "x",
				lockAxis: "x",
				inertia: true,
				listeners: {
					move: (event: DragEvent) => {
						x += event.dx;
						event.target.style.transition = "";
						event.target.style.transform = `translate(${x}px`;

						if (!event.interaction.pointerIsDown && Math.abs(x) > event.target.clientWidth / 3) {
							const translate = x > 0 ? "100%" : "-100%";
							event.interaction.end();
							event.target.style.transition = "transform 0.15s";
							event.target.style.transform = `translate(${translate})`;
							setTimeout(() => props.onClose?.(), 150);
						}
					},
					end: (event: DragEvent) => {
						event.target.style.transition = "transform 0.15s";
						event.target.style.transform = "";
						x = 0;
					},
				},
			});
		}
	});

	onCleanup(() => interactable?.unset());

	const onClickClose = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		props.onClose?.();
	};

	return (
		<div ref={ref} class="flex flex-row-center w-full md:w-96 bg-gray-800 py-2 px-3 space-x-3 rounded touch-none">
			<Show when={props.imageUrl} keyed>
				{(url) => <img src={url} class="flex-shrink-0 w-8 h-8 rounded-full" />}
			</Show>
			<div class="line-clamp-2 flex-grow">{props.message()}</div>
			<button
				class="flex-shrink-0 h-full px-2 py-4 hover:cursor-pointer text-neutral-400 hover:text-white"
				onClick={onClickClose}
			>
				<Icon name="closeLine" size="sm" />
			</button>
		</div>
	);
};
