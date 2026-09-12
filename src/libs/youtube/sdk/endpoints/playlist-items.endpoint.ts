import type { IGooglePlaylistItemInsertResponse, IGooglePlaylistItemListResponse } from "../types";
import { BaseEndpoint } from "./base";

type PlaylistItemsListOptions = {
	playlistId: string;
	maxResults?: number;
	pageToken?: string;
};

export class PlaylistItemsEndpoint extends BaseEndpoint {
	list = async (options: PlaylistItemsListOptions) => {
		const params: Record<string, string | number> = {
			part: "snippet,contentDetails",
			playlistId: options.playlistId,
			maxResults: options.maxResults || 50,
		};

		if (options.pageToken) params.pageToken = options.pageToken;

		return await this.request<IGooglePlaylistItemListResponse>("GET", "/playlistItems", params);
	};

	insert = async (playlistId: string, videoId: string) => {
		return await this.request<IGooglePlaylistItemInsertResponse>("POST", "/playlistItems?part=snippet", undefined, {
			snippet: {
				playlistId,
				resourceId: {
					kind: "youtube#video",
					videoId,
				},
			},
		});
	};

	remove = async (playlistItemId: string) => {
		return await this.request<null>("DELETE", `/playlistItems?id=${playlistItemId}`);
	};

	update = async (playlistItemId: string, playlistId: string, position: number) => {
		return await this.request<IGooglePlaylistItemInsertResponse>("PUT", "/playlistItems?part=snippet", undefined, {
			id: playlistItemId,
			snippet: {
				playlistId,
				position,
			},
		});
	};
}
