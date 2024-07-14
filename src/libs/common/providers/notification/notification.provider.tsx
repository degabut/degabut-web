import { IS_DESKTOP } from "@constants";
import { Show, createContext, createSignal, useContext, type ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";
import { Notification } from "./components";

type NotificationContextStore = {
	push: (notification: Notification) => void;
};

export const NotificationContext = createContext<NotificationContextStore>({
	push: () => {},
});

export const NotificationProvider: ParentComponent = (props) => {
	let nextTimeout: NodeJS.Timeout | null = null;
	const [queuedNotifications, setQueuedNotifications] = createSignal<Notification[]>([]);
	const [currentNotification, setCurrentNotification] = createSignal<Notification | null>(null);

	const push = (notification: Notification) => {
		setQueuedNotifications((prev) => [...prev, notification]);
		next();
	};

	const next = (force = false) => {
		if (force) {
			clearTimeout(nextTimeout!);
			nextTimeout = null;
		}

		if (nextTimeout) return;

		setCurrentNotification(queuedNotifications().at(0) || null);
		setQueuedNotifications((n) => {
			n.shift();
			return n;
		});

		if (!currentNotification()) return;

		nextTimeout = setTimeout(() => {
			nextTimeout = null;
			next();
		}, 3000);
	};

	const store = { push };

	return (
		<NotificationContext.Provider value={store}>
			{props.children}

			<Portal>
				<div
					class="fixed left-1/2 z-20 -translate-x-1/2 w-full px-4 md:px-0 md:w-fit"
					classList={{
						"top-4": !IS_DESKTOP,
						"top-8": IS_DESKTOP,
					}}
				>
					<TransitionGroup
						onEnter={(el, done) => {
							el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).finished.then(done);
						}}
						onExit={(_, done) => done()}
					>
						<Show when={currentNotification()} keyed>
							{(notification) => <Notification {...notification} onClose={() => next(true)} />}
						</Show>
					</TransitionGroup>
				</div>
			</Portal>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => useContext(NotificationContext);
