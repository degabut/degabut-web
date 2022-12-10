import { IGuild } from "@api";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { QueueResource } from "../QueueProvider";

type Params = {
	queue: QueueResource;
};

export interface IHistory {
	voiceChannel: {
		id: string;
		name: string;
	};
	guild: IGuild;
}

export const useVoiceChannelHistory = ({ queue }: Params) => {
	const [history, setHistory] = createStore<IHistory[]>([]);

	const storedHistory = localStorage.getItem("voice_channel_history");
	if (storedHistory) setHistory(JSON.parse(storedHistory));

	createEffect(() => {
		if (!queue.voiceChannel || !queue.guild) return;

		const { guild, voiceChannel } = queue;
		const data = {
			guild,
			voiceChannel: {
				id: voiceChannel.id,
				name: voiceChannel.name,
			},
		};

		setHistory((history) => {
			const exists = history.find((h) => h.voiceChannel.id === voiceChannel.id);
			if (exists) history = history.filter(({ voiceChannel: v }) => v.id !== voiceChannel.id);
			history = [data, ...history];
			history = history.slice(0, 5);
			return [...history];
		});

		localStorage.setItem("voice_channel_history", JSON.stringify(history));
	});

	return history;
};
