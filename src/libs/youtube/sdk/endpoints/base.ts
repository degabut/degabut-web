import type { YouTubeSdk } from "../youtube-sdk";

export class BaseEndpoint {
	constructor(protected client: YouTubeSdk) {}

	protected async request<TReturnType>(
		method: "GET" | "POST",
		url: string,
		params?: Record<string, string | number | boolean | undefined>,
		body?: unknown
	): Promise<TReturnType | null> {
		return this.client.makeRequest(method, url, params, body);
	}
}
