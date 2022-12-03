import { AxiosInstance } from "axios";
import { IVideoCompact } from "./YouTube";

export enum LoopMode {
	DISABLED = "DISABLED",
	TRACK = "TRACK",
	QUEUE = "QUEUE",
}

export interface IQueue {
	tracks: ITrack[];
	history: ITrack[];
	shuffle: boolean;
	loopMode: LoopMode;
	nowPlaying: ITrack | null;
	voiceChannel: IVoiceChannel;
}

export interface IVoiceChannel {
	id: string;
	name: string;
	members: IMember[];
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
	video: IVideoCompact;
	requestedBy: IGuildMember;
	playedAt: string | null;
}

export interface IGuildMember {
	id: string;
	displayName: string;
	nickname: string;
	username: string;
	discriminator: string;
	avatar: string;
}

export class Queue {
	constructor(private client: AxiosInstance) {}

	addPlaylist = async (queueId: string, playlistId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { playlistId });
		return response.data.trackIds;
	};

	addYouTubePlaylist = async (queueId: string, youtubePlaylistId: string): Promise<string[]> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { youtubePlaylistId });
		return response.data.trackIds;
	};

	addTrackByVideoId = async (queueId: string, videoId: string): Promise<string> => {
		const response = await this.client.post(`/queues/${queueId}/tracks`, { videoId });
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
		await this.client.post(`/queues/${queueId}/loop-type`, { loopMode });
	};

	toggleShuffle = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/shuffle`);
	};

	jam = async (queueId: string, count: number): Promise<void> => {
		await this.client.post(`/queues/${queueId}/jam`, { count: Math.min(count, 5) });
	};
}
