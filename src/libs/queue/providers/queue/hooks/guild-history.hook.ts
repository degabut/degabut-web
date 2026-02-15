import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import type { QueueResource } from "../";
import { type IGuild } from "../../../apis";

type Params = {
	queue: QueueResource;
};

export type IGuildHistory = IGuild;

export const useGuildHistory = ({ queue }: Params) => {
	const [history, setHistory] = createStore<IGuildHistory[]>([]);
	const key = "guild_history";

	const storedHistory = localStorage.getItem(key);
	if (storedHistory) setHistory(JSON.parse(storedHistory));

	const deleteHistory = (guildId: string) => {
		setHistory((history) => {
			history = history.filter((h) => h.id !== guildId);
			return [...history];
		});

		localStorage.setItem(key, JSON.stringify(history));
	};

	createEffect(() => {
		if (queue.empty) return;

		const { guild } = queue;

		setHistory((history) => {
			const index = history.findIndex((h) => h.id === guild.id);
			if (index !== -1) history.splice(index, 1);
			history = [guild, ...history];
			history = history.slice(0, 10);
			return [...history];
		});

		localStorage.setItem(key, JSON.stringify(history));
	});

	return { history, deleteHistory };
};
