import { onMount } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type TypedEventEmitter from "typed-emitter";
import { type FreezeState, type QueueResource } from "../";
import { type IMember, type IPlayerFilters, type IQueue, type ITrack } from "../../../apis";
import { defaultQueue } from "../../../constants";
import type { QueueEvents } from "./queue-events.hook";

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
	onMount(() => {
		emitter.on("queue-destroyed", resetQueue);
		emitter.on("queue-left", resetQueue);
		emitter.on("queue-joined", fetchQueue);
		emitter.on("identify", fetchQueue);
		emitter.on("member-joined", updateMember);
		emitter.on("member-left", updateMember);
		emitter.on("member-updated", updateMember);
		emitter.on("queue-loop-mode-changed", partialUpdateQueue);
		emitter.on("queue-shuffle-toggled", partialUpdateQueue);
		emitter.on("queue-autoplay-toggled", partialUpdateQueue);
		emitter.on("queue-created", updateQueue);
		emitter.on("player-pause-state-changed", ({ isPaused }) => partialUpdateQueue({ isPaused }));
		emitter.on("player-filters-changed", ({ filters }) => updateFilters(filters));
		emitter.on("player-tick", ({ position }) => onPlayerTick(position));
		emitter.on("track-seeked", ({ position }) => onTrackSeeked(position));
		emitter.on("tracks-added", ({ tracks }) => appendTrack(tracks));
		emitter.on("tracks-removed", ({ tracks }) => removeTrack(tracks));
		emitter.on("next-track-added", ({ track }) => addNextTrack(track));
		emitter.on("next-track-removed", ({ track }) => removeNextTrack(track));
		emitter.on("track-order-changed", orderTrack);
		emitter.on("track-audio-started", onTrackAudioStarted);
		emitter.on("queue-processed", setNowPlaying);
		emitter.on("queue-cleared", ({ tracks }) => setTracks(tracks));
	});

	const resetQueue = () => {
		setQueue(structuredClone(defaultQueue));
	};

	const updateMember = (member: IMember) => {
		setQueue("voiceChannel", (vc) => {
			const index = vc.members.findIndex((m) => m.id === member.id);
			if (index === -1) return { ...vc, members: [...vc.members, member] };

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

	const updateFilters = (filters: IPlayerFilters) => {
		setQueue("filters", {
			equalizer: filters.equalizer || undefined,
			timescale: filters.timescale || undefined,
			tremolo: filters.tremolo || undefined,
			vibrato: filters.vibrato || undefined,
			rotation: filters.rotation || undefined,
		});
	};

	const appendTrack = (newTracks: ITrack | ITrack[]) => {
		setQueue("tracks", (tracks) => {
			const newTracksArray = Array.isArray(newTracks) ? newTracks : [newTracks];
			return [...tracks, ...newTracksArray];
		});
	};

	const removeTrack = (tracks: ITrack[]) => {
		const trackIds = tracks.map((t) => t.id);
		setQueue("tracks", (tracks) => tracks.filter((t) => !trackIds.includes(t.id)));
	};

	const addNextTrack = (track: ITrack) => {
		setQueue("nextTrackIds", (nextTracks) => {
			nextTracks = nextTracks.filter((id) => id !== track.id);
			return [track.id, ...nextTracks];
		});
	};

	const removeNextTrack = (track: ITrack) => {
		setQueue("nextTrackIds", (nextTracks) => nextTracks.filter((t) => t !== track.id));
	};

	const orderTrack = (trackIds: string[]) => {
		setQueue("tracks", (tracks) => [
			...(tracks?.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id)) || []),
		]);
	};

	const onTrackAudioStarted = (track: ITrack) => {
		setQueue("position", 0);
		setQueue("history", (history) => {
			history.unshift(track);
			history.splice(25);
			return history;
		});
		setNowPlaying(track);
		setQueue("nowPlaying", "playedAt", new Date().toISOString());
		setFreezeState({ seek: false });
	};

	const setNowPlaying = (nowPlaying: ITrack | null) => {
		setQueue("position", 0);
		setQueue({ nowPlaying });
	};

	const setTracks = (tracks: ITrack[]) => {
		setQueue({ tracks });
	};

	const onPlayerTick = (position: number) => {
		setQueue("position", position);
	};

	const onTrackSeeked = (position: number) => {
		setQueue("position", position);
		setFreezeState({ seek: false });
	};
};
