export type Bot = {
	name?: string;
	iconUrl?: string;
	apiBaseUrl: string;
	youtubeApiBaseUrl?: string;
	wsUrl: string;
};

export const bots: Bot[] | null = import.meta.env.VITE_DEGABUT_SERVERS
	? JSON.parse(import.meta.env.VITE_DEGABUT_SERVERS)
	: null;
