import { useApi } from "@common";
import { EventEmitter } from "events";
import { onCleanup } from "solid-js";
import type TypedEmitter from "typed-emitter";
import {
	type IGuildMember,
	type IJamCollection,
	type IMember,
	type IPlayer,
	type IQueue,
	type ITrack,
} from "../../../apis";

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
	message: (data: Message) => void;
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
	let isAuthenticated = false;
	const emitter = new EventEmitter() as TypedEmitter<QueueEvents>;

	const listen = (url: string) => {
		ws = new WebSocket(url);

		emitter.once("identify", () => {
			isAuthenticated = true;
		});

		ws.onmessage = ({ data }) => {
			try {
				const message = JSON.parse(data) as Message;
				emitter.emit("message", message);
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

			if (isAuthenticated) {
				emitter.emit("closed", ev);
				reconnectTimeout = setTimeout(() => listen(url), 5000);
			} else {
				api.logout();
			}
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
