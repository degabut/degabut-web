import type { AxiosInstance } from "axios";

type AuthResponse = {
	token: string;
	discord: DiscordCredentials;
};

export type DiscordCredentials = {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
	refreshToken: string;
	scope: string;
};

export class Auth {
	constructor(private client: AxiosInstance) {}

	getAccessToken = async (code: string, redirectUri?: string): Promise<AuthResponse> => {
		const response = await this.client.post<AuthResponse>("/auth", { code, redirectUri });
		return response.data;
	};
}
