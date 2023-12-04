import { Icon } from "@common/components";
import { useScreen } from "@common/hooks";
import { Accessor, Component, For, JSX, ParentComponent, Show, createContext, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";

export type Notification = {
	imageUrl?: string | null;
	message: Accessor<JSX.Element>;
};

type NotificationProps = {
	onClose?: () => void;
} & Notification;

const Notification: Component<NotificationProps> = (props) => {
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
				<Icon name="closeLine" size="sm" class="fill-current" />
			</button>
		</div>
	);
};

export type NotificationContextStore = {
	push: (notification: Notification) => void;
};

export const NotificationContext = createContext<NotificationContextStore>({
	push: () => {},
});

export const NotificationProvider: ParentComponent = (props) => {
	const screen = useScreen();
	const maxNotification = 5;
	const [notifications, setNotifications] = createSignal<Notification[]>([]);

	const push = (notification: Notification) => {
		setNotifications((prev) => [...prev, notification].slice(0, maxNotification));
		setTimeout(() => remove(notification), 5000);
	};

	const remove = (notification: Notification) => {
		setNotifications((prev) => prev.filter((n) => n !== notification));
	};

	const store = { push };

	return (
		<NotificationContext.Provider value={store}>
			{props.children}
			<Show when={screen.gte.md}>
				<div class="fixed bottom-24 right-4 flex flex-col space-y-3 z-20">
					<TransitionGroup
						onEnter={(el, done) => {
							el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).finished.then(done);
						}}
						onExit={(el, done) => {
							el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150 }).finished.then(done);
						}}
					>
						<For each={notifications()}>
							{(notification) => <Notification {...notification} onClose={() => remove(notification)} />}
						</For>
					</TransitionGroup>
				</div>
			</Show>
		</NotificationContext.Provider>
	);
};
