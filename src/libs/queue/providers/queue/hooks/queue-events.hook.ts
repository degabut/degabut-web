import { useApi } from "@common/hooks";
import { IGuildMember, IJamCollection, IMember, IPlayer, IQueue, ITrack } from "@queue/apis";
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
	member: IMember | null;
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
	closed: (ev: CloseEvent) => void;
	identify: () => void;
	"member-jammed": (data: IJamCollection) => void;
	"member-joined": (data: IMember) => void;
	"member-left": (data: IMember) => void;
	"member-updated": (data: IMember) => void;
	"queue-destroyed": (data: IQueue) => void;
	"queue-loop-mode-changed": (data: IQueue) => void;
	"queue-shuffle-toggled": (data: IQueue) => void;
	"queue-created": (data: IQueue) => void;
	"player-pause-state-changed": (data: IPlayer) => void;
	"player-tick": (data: { position: number }) => void;
	"track-added": (data: TrackAction) => void;
	"track-removed": (data: TrackAction) => void;
	"tracks-removed": (data: TracksAction) => void;
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
	let ws: WebSocket | undefined;
	let reconnectTimeout: NodeJS.Timeout;
	const emitter = new EventEmitter() as TypedEmitter<QueueEvents>;

	const listen = (url: string) => {
		ws = new WebSocket(url);
		ws.onmessage = ({ data }) => {
			try {
				const message = JSON.parse(data) as Message;
				emitter.emit(message.event, message.data);
			} catch {
				// ignore
			}
		};
		ws.onopen = async () => {
			send("identify", { token: api.authManager.getAccessToken() });
		};
		ws.onclose = (ev) => {
			if (ev.code === 3333) return;
			emitter.emit("closed", ev);
			reconnectTimeout = setTimeout(() => listen(url), 5000);
		};
	};

	const close = () => {
		if (ws) {
			ws.close(3333);
			ws.onmessage = null;
			ws.onopen = null;
			ws.onclose = null;
		}
		clearTimeout(reconnectTimeout);
	};

	onCleanup(() => {
		if (ws) {
			ws.onmessage = null;
			ws.onopen = null;
			ws.onclose = null;
		}
		emitter.removeAllListeners();
		clearTimeout(reconnectTimeout);
	});

	const send = (event: string, data: unknown) => {
		const message = JSON.stringify({ event, data });
		ws?.send(message);
	};

	return { listen, close, emitter };
};
