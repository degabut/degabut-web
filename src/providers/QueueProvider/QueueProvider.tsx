import { IPlayer, IQueue } from "@api";
import { useApi } from "@hooks/useApi";
import { useBotSelector } from "@hooks/useBotSelector";
import EventEmitter from "events";
import { Accessor, createContext, createEffect, createSignal, onCleanup, onMount, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import TypedEventEmitter from "typed-emitter";
import {
	IHistory,
	QueueEvents,
	useQueueActions,
	useQueueEventListener,
	useQueueEvents,
	useQueueNotification,
	useVoiceChannelHistory,
} from "./hooks";

export type QueueContextStore = {
	data: QueueResource;
	voiceChannelHistory: IHistory[];
	isInitialLoading: Accessor<boolean>;
	freezeState: FreezeState;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>({
	data: { empty: true },
	voiceChannelHistory: [] as IHistory[],
	isInitialLoading: () => true,
	freezeState: {
		queue: true,
		track: true,
		seek: true,
	},
	emitter: new EventEmitter(),
} as QueueContextStore);

type FullQueue = IQueue & IPlayer;
export type QueueResource = (FullQueue & { empty: false }) | (Partial<FullQueue> & { empty: true });

export type FreezeState = {
	queue: boolean;
	track: boolean;
	seek: boolean;
};

export const QueueProvider: ParentComponent = (props) => {
	const api = useApi();
	const botSelector = useBotSelector();

	let lastHidden = 0;
	const [isInitialLoading, setIsInitialLoading] = createSignal(true);
	const [freezeState, setFreezeState] = createStore<FreezeState>({
		queue: true,
		track: true,
		seek: true,
	});

	const fetchQueue = async () => {
		try {
			const queue = await api.me.getQueue();
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

	const [queue, setQueue] = createStore<QueueResource>({ empty: true });
	const { emitter, listen, close } = useQueueEvents();
	const queueActions = useQueueActions({ queue, setFreezeState });
	const voiceChannelHistory = useVoiceChannelHistory({ queue });
	useQueueEventListener({ setQueue, setFreezeState, fetchQueue, emitter });
	useQueueNotification({ emitter });

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
	});

	onCleanup(() => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
		close();
	});

	const onVisibilityChange = () => {
		// refetch if > 60 seconds after last refetch
		if (document.visibilityState === "hidden") lastHidden = Date.now();
		if (document.visibilityState === "visible" && Date.now() - lastHidden > 60 * 1000) {
			fetchQueue();
		}
	};

	createEffect(() => {
		if (queue) setFreezeState({ track: false, queue: false, seek: false });
	});

	createEffect(() => {
		const bot = botSelector.currentBot();
		setIsInitialLoading(true);
		close();
		setQueue({
			empty: true,
			nowPlaying: undefined,
			guild: undefined,
			history: undefined,
			isPaused: undefined,
			loopMode: undefined,
			position: undefined,
			shuffle: undefined,
			tracks: undefined,
			voiceChannel: undefined,
		});
		listen(bot.wsUrl);
	});

	const store: QueueContextStore = {
		data: queue,
		voiceChannelHistory,
		isInitialLoading,
		freezeState,
		emitter,
		...queueActions,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
