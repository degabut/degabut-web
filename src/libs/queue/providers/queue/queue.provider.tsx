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

export interface IPlayerFiltersState {
	equalizer: {
		enabled: boolean;
		bands: {
			band: number;
			gain: number;
		}[];
	};
	timescale: {
		enabled: boolean;
		speed: number;
		pitch: number;
		rate: number;
	};
	tremolo: {
		enabled: boolean;
		frequency: number;
		depth: number;
	};
	vibrato: {
		enabled: boolean;
		frequency: number;
		depth: number;
	};
	rotation: {
		enabled: boolean;
		rotationHz: number;
	};
	pluginFilters: {
		echo: {
			enabled: boolean;
			echoLength: number;
			decay: number;
		};
	};
}

export type QueueResource = IQueue & IPlayer & { empty: boolean; filtersState: IPlayerFiltersState };

export type QueueContextStore = {
	data: QueueResource;
	voiceChannelHistory: ReturnType<typeof useVoiceChannelHistory>;
	isInitialLoading: Accessor<boolean>;
	freezeState: FreezeState;
	bot: Accessor<Bot>;
	setBot: (index: number) => void;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>();

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
	let resetQueueTimeout: NodeJS.Timeout | null = null;
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

			setQueue((q) => ({
				...q,
				...queue,
				...player,
				empty: false,
			}));
		} finally {
			setIsInitialLoading(false);
		}
	};

	const [queue, setQueue] = createStore<QueueResource>(structuredClone(defaultQueue));
	const { emitter, listen, close } = useQueueEvents();
	const queueActions = useQueueActions({ queue, setFreezeState });
	const voiceChannelHistory = useVoiceChannelHistory({ queue });
	useQueueEventListener({ queue, setQueue, setFreezeState, fetchQueue, emitter });
	usePlayerPositionUpdater({ queue, setQueue });

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
		emitter.on("closed", () => {
			resetQueueTimeout = setTimeout(resetQueue, 10000);
		});
		emitter.on("identify", () => {
			if (resetQueueTimeout) {
				clearTimeout(resetQueueTimeout);
				resetQueueTimeout = null;
			}
		});
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
		setQueue("filtersState", (f) => {
			return {
				equalizer: {
					enabled: !!queue.filters?.equalizer,
					bands: queue.filters?.equalizer || f.equalizer.bands,
				},
				timescale: {
					enabled: !!queue.filters?.timescale,
					speed: queue.filters?.timescale?.speed || f.timescale.speed,
					pitch: queue.filters?.timescale?.pitch || f.timescale.pitch,
					rate: queue.filters?.timescale?.rate || f.timescale.rate,
				},
				tremolo: {
					enabled: !!queue.filters?.tremolo,
					frequency: queue.filters?.tremolo?.frequency || f.tremolo.frequency,
					depth: queue.filters?.tremolo?.depth || f.tremolo.depth,
				},
				vibrato: {
					enabled: !!queue.filters?.vibrato,
					frequency: queue.filters?.vibrato?.frequency || f.vibrato.frequency,
					depth: queue.filters?.vibrato?.depth || f.vibrato.depth,
				},
				rotation: {
					enabled: !!queue.filters?.rotation,
					rotationHz: queue.filters?.rotation?.rotationHz || f.rotation.rotationHz,
				},
				pluginFilters: {
					echo: {
						enabled: !!queue.filters?.pluginFilters?.echo,
						echoLength: queue.filters?.pluginFilters?.echo?.echoLength || f.pluginFilters.echo.echoLength,
						decay: queue.filters?.pluginFilters?.echo?.decay || f.pluginFilters.echo.decay,
					},
				},
			};
		});
	});

	createEffect(() => {
		const bot = botSelector.bot();
		setIsInitialLoading(true);
		close();
		resetQueue();
		listen(bot.wsUrl);
	});

	const resetQueue = () => {
		setQueue(structuredClone(defaultQueue));
	};

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
