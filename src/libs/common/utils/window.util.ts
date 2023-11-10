import { Bot } from "@constants";
import { QueueEvents } from "@queue/providers/queue/hooks";

type Event = {
	auth: () => void;

	"set-bot-volume": (volume: number) => void;
	"authenticate-rpc": (data: unknown) => void;
	"set-activity": (data: unknown) => void;
	"clear-activity": () => void;

	"bot-switched": (index: number, bot: Bot) => void;

	"settings-changed": (key: string, value: unknown, previous?: unknown) => void;
} & QueueEvents;

export class WindowPosterUtil {
	static postMessage<K extends keyof Event>(event: K, ...data: Parameters<Event[K]>) {
		window.postMessage({ event, data });
	}
}
