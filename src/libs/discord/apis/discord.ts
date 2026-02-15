import { type IGuild } from "@queue";
import type { AxiosInstance } from "axios";

export class DiscordApi {
	constructor(private client: AxiosInstance) {}

	getUserGuilds = async () => {
		const response = await this.client.get<IGuild[]>("/users/@me/guilds");
		if (response.status !== 200) return [];

		const result = response.data.map((guild) => ({
			id: guild.id,
			name: guild.name,
			icon: guild.icon ? "https://cdn.discordapp.com/icons/" + guild.id + "/" + guild.icon + ".png" : null,
		}));

		return result;
	};
}
