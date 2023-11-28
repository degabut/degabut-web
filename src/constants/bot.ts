export type Bot = {
	id: string;
	name: string;
	iconUrl: string;
	apiBaseUrl: string;
	youtubeApiBaseUrl: string;
	wsUrl: string;
};

export const bots: Bot[] = import.meta.env.VITE_APPLICATIONS
	? JSON.parse(import.meta.env.VITE_APPLICATIONS).map((b: Bot) => ({
			...b,
			youtubeApiBaseUrl: b.youtubeApiBaseUrl || import.meta.env.VITE_YOUTUBE_API_BASE_URL,
	  }))
	: [
			{
				id: import.meta.env.VITE_APPLICATION_ID,
				name: "Degabut",
				iconUrl: "/icons/colors/degabut-default.png",
				apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
				youtubeApiBaseUrl: import.meta.env.VITE_YOUTUBE_API_BASE_URL,
				wsUrl: import.meta.env.VITE_WS_URL,
			},
	  ];
