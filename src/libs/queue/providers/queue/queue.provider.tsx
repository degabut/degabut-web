import { useApi } from "@common";
import { type Bot } from "@constants";
import {
	Show,
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	useContext,
	type Accessor,
	type ParentComponent,
} from "solid-js";
import { createStore } from "solid-js/store";
import type TypedEventEmitter from "typed-emitter";
import { PlayerApi, QueueApi, type IPlayer, type IQueue } from "../../apis";
import { defaultQueue } from "../../constants";
import {
	useBotSelector,
	usePlayerPositionUpdater,
	useQueueActions,
	useQueueEventListener,
	useQueueEvents,
	useVoiceChannelHistory,
	type QueueEvents,
} from "./hooks";

export type QueueResource = IQueue & IPlayer & { empty: boolean };

export type QueueContextStore = {
	data: QueueResource;
	voiceChannelHistory: ReturnType<typeof useVoiceChannelHistory>;
	isInitialLoading: Accessor<boolean>;
	freezeState: FreezeState;
	bot: Accessor<Bot>;
	setBot: (index: number) => void;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>({} as QueueContextStore);

export type FreezeState = {
	queue: boolean;
	track: boolean;
	seek: boolean;
};

export const QueueProvider: ParentComponent = (props) => {
	const api = useApi();
	const queueApi = new QueueApi(api.client);
	const playerApi = new PlayerApi(api.client);
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
			const queue = await queueApi.getQueue();
			if (!queue) return setQueue({ empty: true });

			const player = await playerApi.getPlayer(queue.voiceChannel.id);
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

	const [queue, setQueue] = createStore<QueueResource>(structuredClone(defaultQueue));
	const { emitter, listen, close } = useQueueEvents();
	const queueActions = useQueueActions({ queue, setFreezeState });
	const voiceChannelHistory = useVoiceChannelHistory({ queue });
	useQueueEventListener({ setQueue, setFreezeState, fetchQueue, emitter });
	usePlayerPositionUpdater({ queue, setQueue });

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
		const bot = botSelector.bot();
		setIsInitialLoading(true);
		close();
		setQueue(structuredClone(defaultQueue));
		listen(bot.wsUrl);
	});

	const store: QueueContextStore = {
		data: queue,
		voiceChannelHistory,
		isInitialLoading,
		freezeState,
		emitter,
		...botSelector,
		...queueActions,
	};

	return (
		<QueueContext.Provider value={store}>
			<Show when={store.data}>{props.children}</Show>
		</QueueContext.Provider>
	);
};

export const useQueue = () => useContext(QueueContext);
