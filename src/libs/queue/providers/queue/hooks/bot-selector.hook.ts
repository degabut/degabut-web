import { useSettings } from "@app/hooks";
import { useApi } from "@common/hooks";
import { Bot, bots } from "@constants";
import { DesktopUtil } from "@desktop/utils";
import { createSignal } from "solid-js";

export const useBotSelector = () => {
	const api = useApi();
	const { settings, setSettings } = useSettings();
	const [bot, _setBot] = createSignal<Bot>({ ...bots[settings.botIndex] });

	// eslint-disable-next-line solid/reactivity
	api.setClientUrl(bot().apiBaseUrl, bot().youtubeApiBaseUrl);

	const setBot = async (index?: number) => {
		index = index || 0;
		const bot = bots?.at(index);
		if (!bot) return;

		_setBot(bot);
		setSettings("botIndex", index);
		DesktopUtil.switchBot(index, bot);
		api.setClientUrl(bot.apiBaseUrl, bot.youtubeApiBaseUrl);
	};

	return { bot, setBot };
};
