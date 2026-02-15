import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import type { QueueResource } from "../";
import { type IGuild } from "../../../apis";

type Params = {
	queue: QueueResource;
};

export interface IVoiceChannelHistory {
	voiceChannel: {
		id: string;
		name: string;
	};
	textChannel: {
		id: string;
		name: string;
	} | null;
	guild: IGuild;
}

export const useVoiceChannelHistory = ({ queue }: Params) => {
	const [history, setHistory] = createStore<IVoiceChannelHistory[]>([]);
	const key = "voice_channel_history";

	const storedHistory = localStorage.getItem(key);
	if (storedHistory) setHistory(JSON.parse(storedHistory));

	const deleteHistory = (voiceChannelId: string, textChannelId?: string) => {
		setHistory((history) => {
			history = history.filter(
				(h) => h.voiceChannel.id !== voiceChannelId && h.textChannel?.id !== textChannelId
			);
			return [...history];
		});

		localStorage.setItem(key, JSON.stringify(history));
	};

	createEffect(() => {
		if (queue.empty) return;

		const { guild, voiceChannel } = queue;
		const data = {
			guild,
			voiceChannel: {
				id: voiceChannel.id,
				name: voiceChannel.name,
			},
			textChannel: queue.textChannel
				? {
						id: queue.textChannel.id,
						name: queue.textChannel.name,
				  }
				: null,
		};

		setHistory((history) => {
			const index = history.findIndex(
				(h) => h.voiceChannel.id === voiceChannel.id && h.textChannel?.id == queue.textChannel?.id
			);
			if (index !== -1) history.splice(index, 1);
			history = [data, ...history];
			history = history.slice(0, 10);
			return [...history];
		});

		localStorage.setItem(key, JSON.stringify(history));
	});

	return { history, deleteHistory };
};
