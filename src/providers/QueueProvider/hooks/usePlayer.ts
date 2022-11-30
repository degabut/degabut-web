import { useApi } from "@hooks/useApi";
import { clearInterval, setInterval } from "@utils/timers";
import { onCleanup, onMount, Resource, ResourceActions } from "solid-js";
import TypedEventEmitter from "typed-emitter";
import { QueueResource } from "../QueueProvider";
import { QueueEvents } from "./useQueueEvents";

type Params = {
	queue: Resource<QueueResource | null>;
	actions: ResourceActions<QueueResource>;
	emitter: TypedEventEmitter<QueueEvents>;
};

export const usePlayer = ({ queue, actions, emitter }: Params) => {
	const api = useApi();
	let playerRefetchInterval: number;

	onMount(() => {
		playerRefetchInterval = setInterval(refetch, 1000);
		emitter.on("track-seeked", ({ position }) => onTrackSeeked(position));
		emitter.on("queue-processed", onQueueProcessed);
	});

	onCleanup(() => {
		clearInterval(playerRefetchInterval);
	});

	const onQueueProcessed = () => {
		partialUpdateQueue({ position: 0 });
	};

	const onTrackSeeked = (position: number) => {
		partialUpdateQueue({ position });
	};

	const partialUpdateQueue = (queue: Partial<QueueResource>) => {
		actions.mutate((q) => {
			if (!q) return;
			return { ...q, ...queue };
		});
	};

	const refetch = async () => {
		const voiceChannelId = queue()?.voiceChannel.id;
		if (!voiceChannelId) return;
		const player = await api.player.getPlayer(voiceChannelId);
		if (!player) return;

		actions.mutate((q) => {
			if (!q) return;
			return { ...q, ...player };
		});
	};

	return { refetch };
};
