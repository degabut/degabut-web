import { useApi } from "@common";
import { bots, type Bot } from "@constants";
import { useSettings } from "@settings";
import { createEffect, createSignal } from "solid-js";

export const useBotSelector = () => {
	const api = useApi();
	const { settings, setSettings } = useSettings();
	const [bot, _setBot] = createSignal<Bot>({ ...bots[settings.botIndex] });

	createEffect(() => {
		const bot = bots.at(settings.botIndex) || bots.at(0);
		if (!bot) return;
		_setBot(bot);
	});

	createEffect(() => {
		api.setClientUrl(bot().apiBaseUrl, bot().youtubeApiBaseUrl);
	});

	const setBot = async (index?: number) => {
		index = index || 0;
		const bot = bots?.at(index);
		if (!bot) return;

		_setBot(bot);
		setSettings("botIndex", index);
	};

	return { bot, setBot };
};
