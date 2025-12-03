import type { IMediaSource } from "@media-source";
import type { AxiosInstance } from "axios";

export enum LoopMode {
	DISABLED = "DISABLED",
	TRACK = "TRACK",
	QUEUE = "QUEUE",
}

export interface IQueue {
	tracks: ITrack[];
	history: IHistoryTrack[];
	shuffle: boolean;
	autoplay: boolean;
	autoplayOptions: IAutoplayOptions;
	loopMode: LoopMode;
	nowPlaying: ITrack | null;
	nextTrackIds: string[];
	voiceChannel: IVoiceChannel;
	textChannel: ITextChannel | null;
	guild: IGuild;
}
export type QueueAutoplayType =
	| "QUEUE_RELATED"
	| "QUEUE_LAST_PLAYED_RELATED"
	| "USER_RECENTLY_LIKED"
	| "USER_RECENTLY_LIKED_RELATED"
	| "USER_RECENTLY_PLAYED"
	| "USER_RECENTLY_PLAYED_RELATED"
	| "USER_RECENT_MOST_PLAYED"
	| "USER_RECENT_MOST_PLAYED_RELATED"
	| "USER_OLD_MOST_PLAYED"
	| "USER_OLD_MOST_PLAYED_RELATED";

export interface IAutoplayOptions {
	minDuration: number | null;
	maxDuration: number | null;
	excludedMemberIds: string[];
	types: QueueAutoplayType[];
}

export interface IVoiceChannel {
	id: string;
	name: string;
	members: IMember[];
}

export interface IVoiceChannelMin {
	id: string;
	name: string;
}

export interface IGuild {
	id: string;
	name: string;
	icon: string | null;
}

export interface ITextChannel {
	id: string;
	name: string;
}

export interface IMember {
	id: string;
	displayName: string;
	nickname: null | string;
	username: string;
	discriminator: string;
	avatar: null | string;
	isInVoiceChannel: boolean;
}

export interface ITrackAutoplayData {
	member: IGuildMember | null;
	type: QueueAutoplayType;
}

export interface ITrack {
	id: string;
	mediaSource: IMediaSource;
	requestedBy: IGuildMember | null;
	autoplayData: ITrackAutoplayData | null;
	error: string | null;
	playedAt: string | null;
}

export type IHistoryTrack = Omit<ITrack, "requestedBy"> & { requestedBy: IGuildMember | null };

export interface IGuildMember {
	id: string;
	displayName: string;
	nickname: string;
	username: string;
	discriminator: string;
	avatar: string;
}

export type IChangeAutoplayOptions = Partial<IAutoplayOptions> & {
	addExcludedMemberId?: string;
	removeExcludedMemberId?: string;
};

export interface ILyrics {
	source: string;
	richSynced: string | null;
	synced: string | null;
	unsynced: string | null;
	duration: number;
}

export class QueueApi {
	constructor(private client: AxiosInstance) {}

	getQueue = async (): Promise<IQueue | undefined> => {
		const response = await this.client.get("/me/queue");
		if (response.status !== 200) return undefined;
		return response.data;
	};

	addPlaylist = async (queueId: string, playlistId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { playlistId });
		return response.data.trackIds;
	};

	addYouTubePlaylist = async (queueId: string, youtubePlaylistId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { youtubePlaylistId });
		return response.data.trackIds;
	};

	addSpotifyPlaylist = async (queueId: string, spotifyPlaylistId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { spotifyPlaylistId });
		return response.data.trackIds;
	};

	addSpotifyAlbum = async (queueId: string, spotifyAlbumId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { spotifyAlbumId });
		return response.data.trackIds;
	};

	addTrackById = async (queueId: string, mediaSourceId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { mediaSourceId });
		return response.data.trackIds;
	};

	addTrackByKeyword = async (queueId: string, keyword: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { keyword });
		return response.data.trackIds;
	};

	addLastLiked = async (queueId: string, lastLikedCount = 1000): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { lastLikedCount });
		return response.data.trackIds;
	};

	orderTrack = async (queueId: string, trackId: string, to: number): Promise<void> => {
		await this.client.post(`/queues/${queueId}/tracks/${trackId}/order`, { to });
	};

	playTrack = async (queueId: string, trackId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/tracks/${trackId}/play`);
	};

	removeTrack = async (queueId: string, trackId: string): Promise<void> => {
		await this.client.delete(`/queues/${queueId}/tracks/${trackId}`);
	};

	removeTracksByMemberId = async (queueId: string, memberId: string): Promise<void> => {
		await this.client.delete(`/queues/${queueId}/tracks`, { data: { memberId } });
	};

	addNextTrack = async (queueId: string, trackId: string) => {
		await this.client.post(`/queues/${queueId}/tracks/${trackId}/next`);
	};

	removeNextTrack = async (queueId: string, trackId: string) => {
		await this.client.delete(`/queues/${queueId}/tracks/${trackId}/next`);
	};

	clearQueue = async (queueId: string, includeNowPlaying = false): Promise<void> => {
		await this.client.delete(`/queues/${queueId}/tracks`, { data: { includeNowPlaying } });
	};

	changeLoopMode = async (queueId: string, loopMode: LoopMode): Promise<void> => {
		await this.client.post(`/queues/${queueId}/loop-mode`, { loopMode });
	};

	toggleShuffle = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/shuffle`);
	};

	toggleAutoplay = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/autoplay`);
	};

	changeAutoplayOptions = async (queueId: string, options: IChangeAutoplayOptions): Promise<void> => {
		await this.client.patch(`/queues/${queueId}/autoplay/options`, options);
	};

	jam = async (queueId: string, count: number): Promise<void> => {
		await this.client.post(`/queues/${queueId}/jam`, { count: Math.min(count, 5) });
	};

	lyrics = async (queueId: string): Promise<ILyrics[]> => {
		// retries 5xx errors
		let attempts = 3;

		while (attempts > 0) {
			try {
				const response = await this.client.get(`/queues/${queueId}/lyrics`, {});
				if (response.status !== 200) return [];
				return response.data;
			} catch (err) {
				attempts -= 1;
				if (attempts === 0) throw err;
			}
		}

		return [];
	};
}
