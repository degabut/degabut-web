import { useApi } from "@common/hooks";
import { WindowPosterUtil } from "@common/utils";
import { Bot, bots } from "@constants";
import { createSignal, onMount } from "solid-js";

export const useBotSelector = () => {
	const api = useApi();

	const botIndex = localStorage.getItem("bot_index");
	const [bot, _setBot] = createSignal<Bot>(
		bots
			? { ...bots[botIndex ? +botIndex : 0] }
			: { apiBaseUrl: import.meta.env.VITE_API_BASE_URL, wsUrl: import.meta.env.VITE_WS_URL }
	);

	// eslint-disable-next-line solid/reactivity
	api.setClientUrl(bot().apiBaseUrl);

	onMount(() => {
		const botIndex = localStorage.getItem("bot_index");
		if (!botIndex || !bots?.at(+botIndex)) setBot(0);
	});

	const setBot = async (index?: number) => {
		index = index || 0;
		const bot = bots?.at(index);
		if (!bot) return;

		_setBot(bot);
		localStorage.setItem("bot_index", `${index}`);
		WindowPosterUtil.postMessage("bot-switched", index, bot);

		api.setClientUrl(bot.apiBaseUrl, bot.youtubeApiBaseUrl);
	};

	return { bot, setBot };
};
