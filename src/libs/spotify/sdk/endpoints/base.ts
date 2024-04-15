import type { SpotifySdk } from "../spotify-sdk";

export class BaseEndpoint {
	constructor(protected api: SpotifySdk) {}

	protected async getRequest<TReturnType>(url: string): Promise<TReturnType> {
		return await this.api.makeRequest<TReturnType>("GET", url);
	}

	protected async postRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType> {
		return await this.api.makeRequest<TReturnType>("POST", url, body);
	}

	protected async putRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType> {
		return await this.api.makeRequest<TReturnType>("PUT", url, body);
	}

	protected async deleteRequest<TReturnType, TBody = unknown>(url: string, body?: TBody): Promise<TReturnType> {
		return await this.api.makeRequest<TReturnType>("DELETE", url, body);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected paramsFor(args: Record<string, any>) {
		const params = new URLSearchParams();
		for (const key of Object.getOwnPropertyNames(args)) {
			if (args[key] || args[key] === 0 || (!args[key] && typeof args[key] === "boolean")) {
				params.append(key, args[key].toString());
			}
		}
		return [...params].length > 0 ? `?${params.toString()}` : "";
	}
}
