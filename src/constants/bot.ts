export type Bot = {
	name?: string;
	iconUrl?: string;
	apiBaseUrl: string;
	youtubeApiBaseUrl?: string;
	wsUrl: string;
};

export const bots: Bot[] = import.meta.env.VITE_DEGABUT_SERVERS
	? JSON.parse(import.meta.env.VITE_DEGABUT_SERVERS)
	: [{ apiBaseUrl: import.meta.env.VITE_API_BASE_URL, wsUrl: import.meta.env.VITE_WS_URL }];
