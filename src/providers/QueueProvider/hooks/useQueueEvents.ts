import { IQueue } from "@api";
import { useApi } from "@hooks/useApi";
import { EventEmitter } from "events";
import { onCleanup } from "solid-js";
import { ResourceActions } from "solid-js/types/reactive/signal";

type Params = {
	actions: ResourceActions<IQueue | undefined>;
};

type Message<T = unknown> = {
	event: string;
	data: T;
};

export const useQueueEvents = ({ actions }: Params) => {
	const api = useApi();
	let ws: WebSocket;
	let reconnectTimeout: NodeJS.Timeout;
	const emitter = new EventEmitter();

	const listen = () => {
		ws = new WebSocket(import.meta.env.VITE_WS_URL);
		ws.onmessage = ({ data }) => {
			try {
				const message = JSON.parse(data) as Message;
				onEvent(message.event, message.data);
			} catch {
				// ignore
			}
		};
		ws.onopen = async () => {
			actions.refetch();
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
		clearTimeout(reconnectTimeout);
	});

	const send = (event: string, data: unknown) => {
		const message = JSON.stringify({ event, data });
		ws.send(message);
	};

	const onEvent = (event: string, data: unknown) => {
		emitter.emit(event, data);
		if (event === "identify" || event === "member-jammed") return;
		else if (event === "queue-destroyed" || event === "queue-left") return actions.mutate(undefined);
		else if (event === "queue-joined") return;
		else actions.mutate(data as IQueue);
	};

	return { listen, close, emitter };
};
