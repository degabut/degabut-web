import { AxiosInstance } from "axios";

type AuthResponse = {
	token: string;
	discordAccessToken: string;
};

export class Auth {
	constructor(private client: AxiosInstance) {}

	getAccessToken = async (code: string, redirectUri?: string): Promise<AuthResponse> => {
		const response = await this.client.post<AuthResponse>("/auth", { code, redirectUri });
		return response.data;
	};
}
