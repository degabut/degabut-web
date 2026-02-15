import { type DiscordCredentials } from "@auth";

export class DiscordAuthManager {
	public setDiscordCredentials(credentials: DiscordCredentials): void {
		localStorage.setItem("discord_credentials", JSON.stringify(credentials));
	}

	public getDiscordCredentials(): DiscordCredentials | null {
		const credentialsString = localStorage.getItem("discord_credentials");
		if (!credentialsString) return null;
		try {
			return JSON.parse(credentialsString) as DiscordCredentials;
		} catch {
			return null;
		}
	}
}
