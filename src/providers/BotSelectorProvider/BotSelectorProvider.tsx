import { Bot, bots } from "@constants";
import { useApi } from "@hooks/useApi";
import { useBeforeLeave, useLocation, useNavigate, useParams } from "@solidjs/router";
import { Accessor, createContext, createSignal, onMount, ParentComponent } from "solid-js";

export type BotSelectorContextStore = {
	currentBot: Accessor<Bot>;
	switchBot: (index?: number) => void;
};

export const BotSelectorContext = createContext<BotSelectorContextStore>({} as BotSelectorContextStore);

export const BotSelectorProviders: ParentComponent = (props) => {
	const api = useApi();
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams<{ botIndex: string }>();

	const [currentBot, setCurrentBot] = createSignal<Bot>(
		bots
			? { ...bots[+params.botIndex || 0] }
			: { apiBaseUrl: import.meta.env.VITE_API_BASE_URL, wsUrl: import.meta.env.VITE_WS_URL }
	);

	// eslint-disable-next-line solid/reactivity
	api.setClientUrl(currentBot().apiBaseUrl);

	onMount(() => {
		if (!params.botIndex || !bots?.at(+params.botIndex)) switchBot(0);
	});

	useBeforeLeave((e) => {
		if (typeof e.to === "number" || !e.to.startsWith("/app")) return;

		const from = e.from.pathname;
		const fromBotIndex = from.match(/\/app\/(\d+)/)?.[1];
		const toBotIndex = e.to.match(/\/app\/(\d+)/)?.[1];
		if (fromBotIndex === undefined || toBotIndex !== undefined) return;

		const path = e.to.replace(/\/app(\/\d+)?\//, "");
		const to = `/app/${fromBotIndex}/${path}`;
		e.preventDefault();
		navigate(to);
	});

	const switchBot = async (index?: number) => {
		const bot = bots?.at(index || 0);
		if (!bot) return;

		const path = location.pathname.replace(/^\/app([/0-9]{1,})?\//, "");
		navigate(`/app/${index || 0}/${path}`);

		setCurrentBot(bot);
		api.setClientUrl(bot.apiBaseUrl);
	};

	return (
		<BotSelectorContext.Provider value={{ currentBot, switchBot }}>{props.children}</BotSelectorContext.Provider>
	);
};
