import { AxiosInstance } from "axios";

export class AuthManager {
	constructor(private client: AxiosInstance) {}

	public async setAccessToken(accessToken: string): Promise<void> {
		localStorage.setItem("access_token", accessToken);

		this.client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	public async getAccessToken(): Promise<string> {
		return localStorage.getItem("access_token") || "";
	}

	public async resetAccessToken(): Promise<void> {
		localStorage.removeItem("access_token");
	}
}

export class Auth {
	constructor(private client: AxiosInstance) {}

	getAccessToken = async (code: string, redirectUri: string): Promise<string> => {
		const response = await this.client.post("/auth", { code, redirectUri });
		return response.data.token;
	};
}
