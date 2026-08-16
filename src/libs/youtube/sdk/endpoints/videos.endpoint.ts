import type { IGoogleVideoListResponse } from "../types";
import { BaseEndpoint } from "./base";

export class VideosEndpoint extends BaseEndpoint {
	list = async (ids: string[]) => {
		if (!ids.length) return null;

		const params: Record<string, string | number> = {
			part: "contentDetails",
			id: ids.join(","),
			maxResults: Math.min(ids.length, 50),
		};

		return await this.request<IGoogleVideoListResponse>("GET", "/videos", params);
	};
}
