import { IS_DESKTOP } from "@constants";
import { For, Show, createContext, createMemo, createSignal, useContext, type ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { TransitionGroup } from "solid-transition-group";
import { Notification } from "./components";
import { PersistentNotification } from "./persistent-notification";

type NotificationContextStore = {
	push: (notification: Notification) => void;
	createPersistent: () => PersistentNotification;
};

export const NotificationContext = createContext<NotificationContextStore>({
	push: () => {},
	createPersistent: () => new PersistentNotification(() => {}),
});

export const NotificationProvider: ParentComponent = (props) => {
	let nextTimeout: NodeJS.Timeout | null = null;
	const [queuedNotifications, setQueuedNotifications] = createSignal<Notification[]>([]);
	const [currentNotification, setCurrentNotification] = createSignal<Notification | null>(null);
	const [persistentNotifications, setPersistentNotifications] = createSignal<PersistentNotification[]>([]);

	const visiblePersistentNotifications = createMemo(() => persistentNotifications().filter((n) => n.isVisible()));

	const push = (notification: Notification) => {
		setQueuedNotifications((prev) => [...prev, notification]);
		next();
	};

	const removePersistent = (notification: PersistentNotification) => {
		setPersistentNotifications((prev) => prev.filter((n) => n.id !== notification.id));
	};

	const createPersistent = (): PersistentNotification => {
		const notification = new PersistentNotification(removePersistent);
		setPersistentNotifications((prev) => [...prev, notification]);
		return notification;
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

	const store = { push, createPersistent };

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
					<Show when={visiblePersistentNotifications().length}>
						<div class="space-y-2 mb-2">
							<For each={visiblePersistentNotifications()}>
								{(notification) => <Notification element={notification.message} />}
							</For>
						</div>
					</Show>

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
