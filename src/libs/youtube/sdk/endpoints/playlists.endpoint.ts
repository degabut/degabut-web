import type { IGooglePlaylistInsertResponse, IGooglePlaylistListResponse } from "../types";
import { BaseEndpoint } from "./base";

type PlaylistsListOptions = {
	id?: string;
	mine?: boolean;
	maxResults?: number;
	pageToken?: string;
};

export class PlaylistsEndpoint extends BaseEndpoint {
	list = async (options: PlaylistsListOptions = {}) => {
		const params: Record<string, string | number | boolean> = {
			part: "snippet,contentDetails,status",
		};

		if (options.mine) params.mine = true;
		if (options.id) params.id = options.id;
		if (options.pageToken) params.pageToken = options.pageToken;
		if (options.maxResults) params.maxResults = options.maxResults;

		return await this.request<IGooglePlaylistListResponse>("GET", "/playlists", params);
	};

	insert = async (title: string, description = "") => {
		return await this.request<IGooglePlaylistInsertResponse>("POST", "/playlists?part=snippet,status", undefined, {
			snippet: {
				title,
				description,
			},
			status: {
				privacyStatus: "unlisted",
			},
		});
	};
}
