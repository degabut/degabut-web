import { IMediaSource } from "@media-source/apis";
import { AxiosInstance } from "axios";

export enum LoopMode {
	DISABLED = "DISABLED",
	TRACK = "TRACK",
	QUEUE = "QUEUE",
}

export interface IQueue {
	tracks: ITrack[];
	history: IHistoryTrack[];
	shuffle: boolean;
	loopMode: LoopMode;
	nowPlaying: ITrack | null;
	voiceChannel: IVoiceChannel;
	textChannel: ITextChannel | null;
	guild: IGuild;
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
}

export interface ITrack {
	id: string;
	mediaSource: IMediaSource;
	requestedBy: IGuildMember;
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

	addTrackById = async (queueId: string, mediaSourceId: string): Promise<string> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { mediaSourceId });
		return response.data.trackId;
	};

	addTrackByKeyword = async (queueId: string, keyword: string): Promise<string> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { keyword });
		return response.data.trackId;
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

	clearQueue = async (queueId: string, includeNowPlaying = false): Promise<void> => {
		await this.client.delete(`/queues/${queueId}/tracks`, { data: { includeNowPlaying } });
	};

	changeLoopMode = async (queueId: string, loopMode: LoopMode): Promise<void> => {
		await this.client.post(`/queues/${queueId}/loop-mode`, { loopMode });
	};

	toggleShuffle = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/shuffle`);
	};

	jam = async (queueId: string, count: number): Promise<void> => {
		await this.client.post(`/queues/${queueId}/jam`, { count: Math.min(count, 5) });
	};
}
