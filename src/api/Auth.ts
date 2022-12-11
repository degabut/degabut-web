import { IS_BROWSER } from "@constants";
import { GetAccessToken, SetAccessToken } from "@go/app/App";
import { AxiosInstance } from "axios";

export class AuthManager {
	constructor(private client: AxiosInstance) {}

	public async setAccessToken(accessToken: string): Promise<void> {
		if (!IS_BROWSER) SetAccessToken(accessToken);
		localStorage.setItem("access_token", accessToken);

		this.client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	public async getAccessToken(): Promise<string> {
		if (IS_BROWSER) {
			return localStorage.getItem("access_token") || "";
		} else {
			return GetAccessToken() || localStorage.getItem("access_token") || "";
		}
	}

	public async resetAccessToken(): Promise<void> {
		if (IS_BROWSER) {
			localStorage.removeItem("access_token");
		} else {
			SetAccessToken("");
		}
	}
}

export class Auth {
	constructor(private client: AxiosInstance) {}

	getAccessToken = async (code: string, redirectUri: string): Promise<string> => {
		const response = await this.client.post("/auth", { code, redirectUri });
		return response.data.token;
	};
}
