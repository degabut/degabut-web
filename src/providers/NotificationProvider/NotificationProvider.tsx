import { Icon } from "@components/Icon";
import { Component, For, JSX, ParentComponent, Show, createContext, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";

export type Notification = {
	imageUrl?: string;
	message: JSX.Element;
};

type NotificationProps = {
	onClose?: () => void;
} & Notification;

const Notification: Component<NotificationProps> = (props) => {
	return (
		<div class="flex flex-row-center w-80 h-16 bg-gray-800 p-2 pl-3 rounded">
			<Show when={props.imageUrl} keyed>
				{(url) => <img src={url} class="flex-shrink-0 w-8 h-8 rounded-full" />}
			</Show>
			<div class="line-clamp-2 ml-3 flex-grow">{props.message}</div>
			<button
				class="flex-shrink-0 h-full p-2 hover:cursor-pointer text-neutral-400 hover:text-white"
				onClick={() => props.onClose?.()}
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
	const maxNotification = 5;
	const [notifications, setNotifications] = createSignal<Notification[]>([]);

	const push = (notification: Notification) => {
		setNotifications((prev) => [notification, ...prev].slice(0, maxNotification));
		setTimeout(() => remove(notification), 5000);
	};

	const remove = (notification: Notification) => {
		setNotifications((prev) => prev.filter((n) => n !== notification));
	};

	const store = { push };

	return (
		<NotificationContext.Provider value={store}>
			{props.children}
			<div class="fixed bottom-4 right-4 flex flex-col space-y-3 z-[1000]">
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
		</NotificationContext.Provider>
	);
};
