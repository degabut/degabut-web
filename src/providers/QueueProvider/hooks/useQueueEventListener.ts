import { IMember, IQueue, ITrack } from "@api";
import { onMount } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import TypedEventEmitter from "typed-emitter";
import { FreezeState, QueueResource } from "../QueueProvider";
import { QueueEvents } from "./useQueueEvents";

type Params = {
	setQueue: SetStoreFunction<QueueResource>;
	setFreezeState: SetStoreFunction<FreezeState>;
	fetchQueue: () => Promise<void>;
	emitter: TypedEventEmitter<QueueEvents>;
};

/**
 * ! NOTE
 *
 * Avoid mutating nested object using `setQueue`
 * DON'T: setQueue("voiceChannel", "members", (members) => { members });
 * DO: setQueue("voiceChannel", (voiceChannel) => { voiceChannel.mebers })
 */

export const useQueueEventListener = ({ setQueue, setFreezeState, fetchQueue, emitter }: Params) => {
	let lastTrackSeekedPosition = -1;

	onMount(() => {
		emitter.on("queue-destroyed", resetQueue);
		emitter.on("queue-left", resetQueue);
		emitter.on("queue-joined", fetchQueue);
		emitter.on("identify", fetchQueue);
		emitter.on("member-added", addMember);
		emitter.on("member-removed", removeMember);
		emitter.on("member-updated", updateMember);
		emitter.on("queue-loop-mode-changed", partialUpdateQueue);
		emitter.on("queue-shuffle-toggled", partialUpdateQueue);
		emitter.on("queue-created", updateQueue);
		emitter.on("player-pause-state-changed", ({ isPaused }) => partialUpdateQueue({ isPaused }));
		emitter.on("player-tick", ({ position }) => onPlayerTick(position));
		emitter.on("track-seeked", ({ position }) => onTrackSeeked(position));
		emitter.on("track-added", ({ track }) => appendTrack(track));
		emitter.on("tracks-added", ({ tracks }) => appendTrack(tracks));
		emitter.on("track-removed", ({ track }) => removeTrack(track));
		emitter.on("track-order-changed", orderTrack);
		emitter.on("track-audio-started", onTrackAudioStarted);
		emitter.on("queue-processed", setNowPlaying);
		emitter.on("queue-cleared", ({ tracks }) => setTracks(tracks));
	});

	const resetQueue = () => {
		setQueue((q) => {
			const newQueue: QueueResource = { empty: true };
			const keys = Object.keys(q) as (keyof QueueResource)[];
			for (const key of keys) {
				newQueue[key] = undefined as never;
			}
			newQueue.empty = true;
			return newQueue;
		});
	};

	const addMember = (member: IMember) => {
		setQueue("voiceChannel", (vc) => {
			if (!vc) return;
			return { ...vc, members: [...vc.members, member] };
		});
	};

	const removeMember = (member: IMember) => {
		setQueue("voiceChannel", (vc) => {
			if (!vc) return;
			return {
				...vc,
				members: vc.members.filter((m) => m.id !== member.id),
			};
		});
	};

	const updateMember = (member: IMember) => {
		setQueue("voiceChannel", (vc) => {
			if (!vc) return;

			const index = vc.members.findIndex((m) => m.id === member.id);
			if (index === -1) return vc;

			const members = [...vc.members];
			members[index] = member;
			return { ...vc, members };
		});
	};

	const updateQueue = (queue: IQueue) => {
		setQueue((q) => {
			if (!q) return { ...queue, position: -1, isPaused: false, empty: false };
			return { ...q, ...queue, empty: false };
		});
	};

	const partialUpdateQueue = (queue: Partial<QueueResource>) => {
		for (const [key, value] of Object.entries(queue)) {
			setQueue(key as keyof QueueResource, value);
		}
	};

	const appendTrack = (newTracks: ITrack | ITrack[]) => {
		setQueue("tracks", (tracks) => {
			const newTracksArray = Array.isArray(newTracks) ? newTracks : [newTracks];

			if (!tracks) return newTracksArray;
			return [...tracks, ...newTracksArray];
		});
	};

	const removeTrack = (track: ITrack) => {
		setQueue("tracks", (tracks) => tracks?.filter((t) => t.id !== track.id));
	};

	const orderTrack = (trackIds: string[]) => {
		setQueue("tracks", (tracks) => [
			...(tracks?.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id)) || []),
		]);
	};

	const onTrackAudioStarted = (track: ITrack) => {
		setQueue("position", 0);
		setQueue("history", (history) => {
			if (!history) return history;
			history.unshift(track);
			history.splice(25);
			return history;
		});
		lastTrackSeekedPosition = -1;
	};

	const setNowPlaying = (nowPlaying: ITrack | null) => {
		setQueue({ nowPlaying });
	};

	const setTracks = (tracks: ITrack[]) => {
		setQueue({ tracks });
	};

	const onPlayerTick = (position: number) => {
		if (lastTrackSeekedPosition >= 0) {
			const diff = Math.abs(position - lastTrackSeekedPosition);
			if (diff < 250 || diff > 2250) return;
			lastTrackSeekedPosition = -1;
			setFreezeState({ seek: false });
		}

		setQueue("position", position);
	};

	const onTrackSeeked = (position: number) => {
		lastTrackSeekedPosition = position;
	};
};
