import { IGuild } from "@queue/apis";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { QueueResource } from "../";

type Params = {
	queue: QueueResource;
};

export interface IHistory {
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
	const [history, setHistory] = createStore<IHistory[]>([]);

	const storedHistory = localStorage.getItem("voice_channel_history");
	if (storedHistory) setHistory(JSON.parse(storedHistory));

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

		localStorage.setItem("voice_channel_history", JSON.stringify(history));
	});

	return history;
};
