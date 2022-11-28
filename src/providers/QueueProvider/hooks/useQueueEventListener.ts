import { IMember, IQueue, ITrack } from "@api";
import { onMount, ResourceActions } from "solid-js";
import TypedEventEmitter from "typed-emitter";
import { QueueEvents } from "./useQueueEvents";

type Params = {
	actions: ResourceActions<IQueue | undefined>;
	emitter: TypedEventEmitter<QueueEvents>;
};

export const useQueueEventListener = ({ actions, emitter }: Params) => {
	onMount(() => {
		emitter.on("queue-destroyed", () => actions.mutate(undefined));
		emitter.on("queue-left", () => actions.mutate(undefined));
		emitter.on("queue-joined", () => actions.refetch());
		emitter.on("identify", () => actions.refetch());
		emitter.on("member-added", addMember);
		emitter.on("member-removed", removeMember);
		emitter.on("member-updated", updateMember);
		emitter.on("queue-pause-state-changed", (q) => updateQueue(q, true));
		emitter.on("queue-loop-type-changed", (q) => updateQueue(q, true));
		emitter.on("queue-shuffle-toggled", (q) => updateQueue(q, true));
		emitter.on("queue-created", updateQueue);
		emitter.on("track-added", ({ track }) => appendTrack(track));
		emitter.on("tracks-added", ({ tracks }) => appendTrack(tracks));
		emitter.on("track-removed", ({ track }) => removeTrack(track));
		emitter.on("track-order-changed", orderTrack);
		emitter.on("track-audio-started", onTrackAudioStarted);
		emitter.on("queue-processed", setNowPlaying);
		emitter.on("queue-cleared", ({ tracks }) => setTracks(tracks));
	});

	const addMember = (member: IMember) => {
		actions.mutate((q) => {
			if (!q) return;
			q.voiceChannel.members.push(member);
			return { ...q };
		});
	};

	const removeMember = (member: IMember) => {
		actions.mutate((q) => {
			if (!q) return;
			q.voiceChannel.members = q.voiceChannel.members.filter((m) => m.id !== member.id);
			return { ...q };
		});
	};

	const updateMember = (member: IMember) => {
		actions.mutate((q) => {
			if (!q) return;
			const index = q.voiceChannel.members.findIndex((m) => m.id === member.id);
			if (index === -1) return { ...q };
			q.voiceChannel.members[index] = member;
			return { ...q };
		});
	};

	const updateQueue = (queue: IQueue, partial?: boolean) => {
		if (partial) {
			actions.mutate((q) => {
				if (!q) return;
				return { ...q, ...queue };
			});
		} else {
			actions.mutate(queue);
		}
	};

	const appendTrack = (tracks: ITrack | ITrack[]) => {
		actions.mutate((q) => {
			if (!q) return;

			if (Array.isArray(tracks)) q.tracks.push(...tracks);
			else q.tracks.push(tracks);

			return { ...q };
		});
	};

	const removeTrack = (track: ITrack) => {
		actions.mutate((q) => {
			if (!q) return;
			q.tracks = q.tracks.filter((t) => t.id !== track.id);
			return { ...q };
		});
	};

	const orderTrack = (trackIds: string[]) => {
		actions.mutate((q) => {
			if (!q) return;
			q.tracks = q.tracks.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id));
			return { ...q };
		});
	};

	const onTrackAudioStarted = (track: ITrack) => {
		actions.mutate((q) => {
			if (!q) return;
			const trackIndex = q.tracks.findIndex((t) => t.id === track.id);
			if (trackIndex === -1) return { ...q };
			q.tracks[trackIndex] = track;
			q.nowPlaying = track;
			q.history.unshift(track);
			q.history.splice(25);
			return { ...q };
		});
	};

	const setNowPlaying = (track: ITrack | null) => {
		actions.mutate((q) => {
			if (!q) return;
			if (track) track.playedAt = null;
			q.nowPlaying = track;
			return { ...q };
		});
	};

	const setTracks = (tracks: ITrack[]) => {
		actions.mutate((q) => {
			if (!q) return;
			q.tracks = tracks;
			return { ...q };
		});
	};
};
