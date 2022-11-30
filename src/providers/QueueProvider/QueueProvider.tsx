import { IPlayer, IQueue } from "@api";
import { useApi } from "@hooks/useApi";
import EventEmitter from "events";
import {
	Accessor,
	createContext,
	createEffect,
	createResource,
	createSignal,
	onCleanup,
	onMount,
	ParentComponent,
} from "solid-js";
import TypedEventEmitter from "typed-emitter";
import {
	QueueEvents,
	usePlayer,
	useQueueActions,
	useQueueEventListener,
	useQueueEvents,
	useQueueNotification,
} from "./hooks";

export type QueueContextStore = {
	data: Accessor<QueueResource>;
	isInitialLoading: Accessor<boolean>;
	isQueueFreezed: Accessor<boolean>;
	isTrackFreezed: Accessor<boolean>;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>({
	data: () => undefined,
	isInitialLoading: () => true,
	isQueueFreezed: () => false,
	isTrackFreezed: () => false,
	emitter: new EventEmitter(),
} as QueueContextStore);

export type QueueResource = (IQueue & IPlayer) | undefined;

export const QueueProvider: ParentComponent = (props) => {
	const api = useApi();
	let lastVisibilityRefetch = 0;
	const [isInitialLoading, setIsInitialLoading] = createSignal(true);
	const [isQueueFreezed, setIsQueueFreezed] = createSignal(true);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(true);

	const initialFetcher = async () => {
		try {
			const queue = await api.user.getSelfQueue();
			if (!queue) return;

			const player = await api.player.getPlayer(queue.voiceChannel.id);
			if (!player) return;

			return {
				...queue,
				...player,
			};
		} finally {
			setIsInitialLoading(false);
		}
	};

	const [queue, actions] = createResource(() => initialFetcher());
	const queueActions = useQueueActions({ queue, setIsQueueFreezed, setIsTrackFreezed });
	const queueEvents = useQueueEvents();

	const player = usePlayer({ queue, actions, emitter: queueEvents.emitter });
	useQueueEventListener({ actions, emitter: queueEvents.emitter });
	useQueueNotification({ emitter: queueEvents.emitter });

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
		actions.refetch();
		queueEvents.listen();
	});

	onCleanup(() => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
		queueEvents.close();
	});

	createEffect(() => {
		if (queue()) {
			setIsTrackFreezed(false);
			setIsQueueFreezed(false);
		}
	});

	const onVisibilityChange = () => {
		// refetch if > 60 seconds after last refetch
		if (document.visibilityState === "visible" && Date.now() - lastVisibilityRefetch > 60 * 1000) {
			lastVisibilityRefetch = Date.now();
			actions.refetch();
			player.refetch();
		}
	};

	const store: QueueContextStore = {
		data: () => queue() || undefined,
		isInitialLoading,
		isQueueFreezed,
		isTrackFreezed,
		emitter: queueEvents.emitter,
		...queueActions,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
