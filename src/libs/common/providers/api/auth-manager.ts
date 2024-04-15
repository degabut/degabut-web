import type { AxiosInstance } from "axios";

export class AuthManager {
	constructor(private client: AxiosInstance) {}

	public setAccessToken(accessToken: string): void {
		localStorage.setItem("access_token", accessToken);
		this.client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	public getAccessToken(): string {
		return localStorage.getItem("access_token") || "";
	}

	public hasAccessToken(): boolean {
		return !!this.getAccessToken();
	}

	public resetAccessToken(): void {
		localStorage.removeItem("access_token");
	}
}
