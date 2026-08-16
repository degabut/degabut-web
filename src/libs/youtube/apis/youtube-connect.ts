import type { GoogleThumbnails, IGooglePlaylist, IGooglePlaylistItem, YouTubeSdk } from "../sdk";
import type { IChannel, IThumbnail, IVideoCompact, IYouTubePlaylistCompact } from "./youtube";

export type IYouTubeConnectVideosPage = {
	videos: IVideoCompact[];
	nextPageToken?: string;
};

export type IYouTubeConnectPlaylistsPage = {
	playlists: IYouTubePlaylistCompact[];
	nextPageToken?: string;
};

export class YouTubeConnectApi {
	constructor(private client: YouTubeSdk) {}

	getSelfPlaylists = async (pageToken?: string): Promise<IYouTubeConnectPlaylistsPage | null> => {
		const playlists = await this.client.playlists.list({ mine: true, pageToken });

		if (!playlists) return null;

		return {
			playlists: playlists.items.map(YouTubeConnectApi.parsePlaylist),
			nextPageToken: playlists.nextPageToken,
		};
	};

	getPlaylist = async (id: string): Promise<IYouTubePlaylistCompact | null> => {
		const playlists = await this.client.playlists.list({ id });

		if (!playlists?.items.length) return null;

		return YouTubeConnectApi.parsePlaylist(playlists.items[0]);
	};

	getPlaylistVideos = async (playlistId: string, pageToken?: string): Promise<IYouTubeConnectVideosPage | null> => {
		const items = await this.client.playlistItems.list({ playlistId, pageToken });
		if (!items) return null;
		const videos = await this.parsePlaylistItems(items.items);
		return {
			videos,
			nextPageToken: items.nextPageToken,
		};
	};

	addToPlaylist = async (playlistId: string, videoId: string): Promise<boolean> => {
		const result = await this.client.playlistItems.insert(playlistId, videoId);
		return !!result?.id;
	};

	private parsePlaylistItems = async (items: IGooglePlaylistItem[]): Promise<IVideoCompact[]> => {
		const videoIds = items
			.map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
			.filter((id): id is string => !!id);

		const durations = await this.getDurations(videoIds);

		return items.map((item) => {
			const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || "";
			const channel = YouTubeConnectApi.parseChannel(
				item.snippet?.videoOwnerChannelId,
				item.snippet?.videoOwnerChannelTitle
			);

			return {
				id: videoId,
				title: item.snippet?.title || "",
				duration: durations.get(videoId) || 0,
				thumbnails: YouTubeConnectApi.parseThumbnails(item.snippet?.thumbnails),
				viewCount: null,
				channel,
			} as IVideoCompact;
		});
	};

	private getDurations = async (videoIds: string[]): Promise<Map<string, number>> => {
		const map = new Map<string, number>();
		if (!videoIds.length) return map;

		for (let i = 0; i < videoIds.length; i += 50) {
			const batch = videoIds.slice(i, i + 50);
			const videos = await this.client.videos.list(batch);
			if (!videos) continue;

			for (const video of videos.items) {
				const seconds = YouTubeConnectApi.parseIsoDuration(video.contentDetails?.duration);
				if (seconds) map.set(video.id, seconds);
			}
		}

		return map;
	};

	private static parsePlaylist(playlist: IGooglePlaylist): IYouTubePlaylistCompact {
		return {
			id: playlist.id,
			title: playlist.snippet?.title || "",
			videoCount: playlist.contentDetails?.itemCount || 0,
			thumbnails: YouTubeConnectApi.parseThumbnails(playlist.snippet?.thumbnails),
			channel: null,
			isRestricted: playlist.status?.privacyStatus === "private",
		};
	}

	private static parseChannel(id: string | undefined, name: string | undefined): IChannel | null {
		if (!id) return null;

		return {
			id,
			name: name || "",
		};
	}

	private static parseThumbnails(thumbnails: GoogleThumbnails | undefined): IThumbnail[] {
		if (!thumbnails) return [];

		return Object.values(thumbnails)
			.filter((t): t is NonNullable<typeof t> => !!t)
			.sort((a, b) => a.width * a.height - b.width * b.height);
	}

	private static parseIsoDuration(duration: string | undefined): number {
		if (!duration) return 0;

		const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
		if (!match) return 0;

		const hours = parseInt(match[1] || "0", 10);
		const minutes = parseInt(match[2] || "0", 10);
		const seconds = parseInt(match[3] || "0", 10);

		return hours * 3600 + minutes * 60 + seconds;
	}
}
