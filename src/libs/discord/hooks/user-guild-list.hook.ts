import { useApi } from "@common";
import { createResource } from "solid-js";
import { DiscordApi } from "../apis";

export const useUserGuildList = () => {
	const api = useApi();
	const discord = api.discordClient ? new DiscordApi(api.discordClient) : null;

	const resource = createResource(discord, (d) => (d ? d.getUserGuilds() : []), {
		initialValue: [],
	});

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
