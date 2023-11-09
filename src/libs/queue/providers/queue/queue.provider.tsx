import { useApi } from "@common/hooks";
import { Bot } from "@constants";
import { IPlayer, IQueue, LoopMode, PlayerApi, QueueApi } from "@queue/apis";
import EventEmitter from "events";
import { Accessor, ParentComponent, createContext, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import TypedEventEmitter from "typed-emitter";
import {
	IHistory,
	QueueEvents,
	useBotSelector,
	useQueueActions,
	useQueueEventListener,
	useQueueEvents,
	useVoiceChannelHistory,
} from "./hooks";

export type QueueResource = IQueue & IPlayer & { empty: boolean };

export type QueueContextStore = {
	data: QueueResource;
	voiceChannelHistory: IHistory[];
	isInitialLoading: Accessor<boolean>;
	freezeState: FreezeState;
	bot: Accessor<Bot>;
	setBot: (index: number) => void;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const defaultQueue: QueueResource = {
	guild: { icon: null, id: "", name: "" },
	history: [],
	isPaused: false,
	loopMode: LoopMode.DISABLED,
	nowPlaying: null,
	position: 0,
	shuffle: false,
	textChannel: null,
	tracks: [],
	voiceChannel: { id: "", name: "", members: [] },
	empty: true,
};

export const QueueContext = createContext<QueueContextStore>({
	data: { ...defaultQueue },
	voiceChannelHistory: [] as IHistory[],
	isInitialLoading: () => true,
	freezeState: {
		queue: true,
		track: true,
	},
	bot: () => ({ apiBaseUrl: import.meta.env.VITE_API_BASE_URL, wsUrl: import.meta.env.VITE_WS_URL }),
	emitter: new EventEmitter(),
} as QueueContextStore);

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

	const [queue, setQueue] = createStore<QueueResource>({ ...defaultQueue });
	const { emitter, listen, close } = useQueueEvents();
	const queueActions = useQueueActions({ queue, setFreezeState });
	const voiceChannelHistory = useVoiceChannelHistory({ queue });
	useQueueEventListener({ setQueue, setFreezeState, fetchQueue, emitter });

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
		setQueue({ ...defaultQueue });
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

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
