import { Show, type Accessor, type Component, type JSX } from "solid-js";
import { Icon } from "../../../components";

export type Notification = {
	imageUrl?: string | null;
	message: Accessor<JSX.Element>;
};

type NotificationProps = {
	onClose?: () => void;
} & Notification;

export const Notification: Component<NotificationProps> = (props) => {
	const onClickClose = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		props.onClose?.();
	};

	return (
		<div class="flex flex-row-center w-80 bg-gray-800 p-2 pl-3 rounded">
			<Show when={props.imageUrl} keyed>
				{(url) => <img src={url} class="flex-shrink-0 w-8 h-8 rounded-full" />}
			</Show>
			<div class="line-clamp-2 ml-3 flex-grow">{props.message()}</div>
			<button
				class="flex-shrink-0 h-full px-2 py-4 hover:cursor-pointer text-neutral-400 hover:text-white"
				onClick={onClickClose}
			>
				<Icon name="closeLine" size="sm" />
			</button>
		</div>
	);
};
