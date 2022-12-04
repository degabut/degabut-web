import { IPlayer, IQueue } from "@api";
import { useApi } from "@hooks/useApi";
import EventEmitter from "events";
import { Accessor, createContext, createEffect, createSignal, onCleanup, onMount, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import TypedEventEmitter from "typed-emitter";
import { QueueEvents, useQueueActions, useQueueEventListener, useQueueEvents, useQueueNotification } from "./hooks";

export type QueueContextStore = {
	data: QueueResource;
	isInitialLoading: Accessor<boolean>;
	isQueueFreezed: Accessor<boolean>;
	isTrackFreezed: Accessor<boolean>;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>({
	data: { empty: true },
	isInitialLoading: () => true,
	isQueueFreezed: () => false,
	isTrackFreezed: () => false,
	emitter: new EventEmitter(),
} as QueueContextStore);

type FullQueue = IQueue & IPlayer;
export type QueueResource = (FullQueue & { empty: false }) | (Partial<FullQueue> & { empty: true });

export const QueueProvider: ParentComponent = (props) => {
	const api = useApi();
	let lastHidden = 0;
	const [isInitialLoading, setIsInitialLoading] = createSignal(true);
	const [isQueueFreezed, setIsQueueFreezed] = createSignal(true);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(true);

	const [queue, setQueue] = createStore<QueueResource>({ empty: true });
	const queueActions = useQueueActions({ queue, setIsQueueFreezed, setIsTrackFreezed });
	const queueEvents = useQueueEvents();

	const fetchQueue = async () => {
		try {
			const queue = await api.user.getSelfQueue();
			if (!queue) return setQueue({ empty: true });

			const player = await api.player.getPlayer(queue.voiceChannel.id);
			if (!player) return setQueue({ empty: true });

			setQueue({
				...queue,
				...player,
				empty: false,
			});
		} finally {
			setIsInitialLoading(false);
		}
	};

	useQueueEventListener({ setQueue, fetchQueue, emitter: queueEvents.emitter });
	useQueueNotification({ emitter: queueEvents.emitter });

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
		// fetchQueue();
		queueEvents.listen();
	});

	onCleanup(() => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
		queueEvents.close();
	});

	createEffect(() => {
		if (queue) {
			setIsTrackFreezed(false);
			setIsQueueFreezed(false);
		}
	});

	const onVisibilityChange = () => {
		// refetch if > 60 seconds after last refetch
		if (document.visibilityState === "hidden") lastHidden = Date.now();
		if (document.visibilityState === "visible" && Date.now() - lastHidden > 60 * 1000) {
			fetchQueue();
		}
	};

	const store: QueueContextStore = {
		data: queue,
		isInitialLoading,
		isQueueFreezed,
		isTrackFreezed,
		emitter: queueEvents.emitter,
		...queueActions,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
