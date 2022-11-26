import { IQueue } from "@api";
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
import { QueueEvents, useQueueActions, useQueueEventListener, useQueueEvents, useQueueNotification } from "./hooks";

export type QueueContextStore = {
	data: Accessor<IQueue | null>;
	isInitialLoading: Accessor<boolean>;
	isQueueFreezed: Accessor<boolean>;
	isTrackFreezed: Accessor<boolean>;
	emitter: TypedEventEmitter<QueueEvents>;
} & ReturnType<typeof useQueueActions>;

export const QueueContext = createContext<QueueContextStore>({
	data: () => null,
	isInitialLoading: () => true,
	isQueueFreezed: () => false,
	isTrackFreezed: () => false,
	emitter: new EventEmitter(),
} as QueueContextStore);

export const QueueProvider: ParentComponent = (props) => {
	const api = useApi();
	const [isInitialLoading, setIsInitialLoading] = createSignal(true);
	const [isQueueFreezed, setIsQueueFreezed] = createSignal(true);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(true);

	const initialFetcher = async () => {
		try {
			return await api.user.getSelfQueue();
		} finally {
			setIsInitialLoading(false);
		}
	};

	const [queue, actions] = createResource(() => initialFetcher());
	const queueActions = useQueueActions({ queue, setIsQueueFreezed, setIsTrackFreezed });
	const queueEvents = useQueueEvents();

	useQueueEventListener({ actions, emitter: queueEvents.emitter });
	useQueueNotification({ emitter: queueEvents.emitter });

	onMount(() => {
		actions.refetch();
		queueEvents.listen();
	});

	onCleanup(() => {
		queueEvents.close();
	});

	createEffect(() => {
		if (queue()) {
			setIsTrackFreezed(false);
			setIsQueueFreezed(false);
		}
	});

	const store: QueueContextStore = {
		data: () => queue() || null,
		isInitialLoading,
		isQueueFreezed,
		isTrackFreezed,
		emitter: queueEvents.emitter,
		...queueActions,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
