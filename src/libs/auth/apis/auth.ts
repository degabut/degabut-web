import { AxiosInstance } from "axios";

export class Auth {
	constructor(private client: AxiosInstance) {}

	getAccessToken = async (code: string, redirectUri?: string): Promise<string> => {
		const response = await this.client.post("/auth", { code, redirectUri });
		return response.data.token;
	};
}
