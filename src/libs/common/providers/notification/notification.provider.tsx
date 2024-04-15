import { For, Show, createContext, createSignal, useContext, type ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";
import { useScreen } from "../screen";
import { Notification } from "./components";

type NotificationContextStore = {
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
				<Portal>
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
								{(notification) => (
									<Notification {...notification} onClose={() => remove(notification)} />
								)}
							</For>
						</TransitionGroup>
					</div>
				</Portal>
			</Show>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => useContext(NotificationContext);
