import { IGuildMember, IJamCollection, IMember, IPlayer, IQueue, ITrack } from "@api";
import { useApi } from "@hooks/useApi";
import { EventEmitter } from "events";
import { onCleanup } from "solid-js";
import TypedEmitter from "typed-emitter";

type Message = {
	event: keyof QueueEvents;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
};

type TrackAction = {
	track: ITrack;
	member: IMember;
};

type TracksAction = {
	tracks: ITrack[];
	member: IMember;
};

type TrackSeededData = {
	position: number;
	member: IGuildMember;
};

export type QueueEvents = {
	identify: () => void;
	"member-jammed": (data: IJamCollection) => void;
	"member-added": (data: IMember) => void;
	"member-removed": (data: IMember) => void;
	"member-updated": (data: IMember) => void;
	"queue-destroyed": (data: IQueue) => void;
	"queue-loop-type-changed": (data: IQueue) => void;
	"queue-shuffle-toggled": (data: IQueue) => void;
	"queue-created": (data: IQueue) => void;
	"player-pause-state-changed": (data: IPlayer) => void;
	"player-tick": (data: IPlayer) => void;
	"track-added": (data: TrackAction) => void;
	"track-removed": (data: TrackAction) => void;
	"track-skipped": (data: TrackAction) => void;
	"track-seeked": (data: TrackSeededData) => void;
	"track-order-changed": (data: string[]) => void;
	"track-audio-started": (data: ITrack) => void;
	"queue-processed": (data: ITrack) => void;
	"tracks-added": (data: TracksAction) => void;
	"queue-cleared": (data: TracksAction) => void;
	"queue-joined": (data: void) => void;
	"queue-left": (data: void) => void;
};

export const useQueueEvents = () => {
	const api = useApi();
	let ws: WebSocket;
	let reconnectTimeout: NodeJS.Timeout;
	const emitter = new EventEmitter() as TypedEmitter<QueueEvents>;

	const listen = () => {
		ws = new WebSocket(import.meta.env.VITE_WS_URL);
		ws.onmessage = ({ data }) => {
			try {
				const message = JSON.parse(data) as Message;
				emitter.emit(message.event, message.data);
			} catch {
				// ignore
			}
		};
		ws.onopen = async () => {
			send("identify", { token: await api.authManager.getAccessToken() });
		};
		ws.onclose = (ev) => {
			if (ev.code === 3333) return;
			reconnectTimeout = setTimeout(listen, 5000);
		};
	};

	const close = () => ws?.close(3333);

	onCleanup(() => {
		ws.onmessage = null;
		ws.onopen = null;
		ws.onclose = null;
		emitter.removeAllListeners();
		clearTimeout(reconnectTimeout);
	});

	const send = (event: string, data: unknown) => {
		const message = JSON.stringify({ event, data });
		ws.send(message);
	};

	return { listen, close, emitter };
};
