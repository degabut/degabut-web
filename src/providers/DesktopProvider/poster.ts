type Event = {
	"settings-changed": (key: string, value: unknown, previous?: unknown) => void;
	"set-activity": (data: unknown) => void;
	"clear-activity": () => void;
};

export const postMessage = <T extends keyof Event>(event: T, ...data: Parameters<Event[T]>) => {
	window.postMessage({ event, data });
};
