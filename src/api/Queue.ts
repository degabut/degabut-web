import { AxiosInstance } from "axios";
import { IVideoCompact } from "./YouTube";

export enum LoopType {
	DISABLED = "DISABLED",
	SONG = "SONG",
	QUEUE = "QUEUE",
}

export interface IQueue {
	tracks: ITrack[];
	history: ITrack[];
	shuffle: boolean;
	isPaused: boolean;
	loopType: LoopType;
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
		await this.client.patch(`/queues/${queueId}/tracks/${trackId}`, { to });
	};

	skipTrack = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/skip`);
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

	changeLoopType = async (queueId: string, loopType: LoopType): Promise<void> => {
		await this.client.patch(`/queues/${queueId}/loop-type`, { loopType });
	};

	toggleShuffle = async (queueId: string): Promise<void> => {
		await this.client.patch(`/queues/${queueId}/shuffle`);
	};

	pause = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/pause`);
	};

	unpause = async (queueId: string): Promise<void> => {
		await this.client.post(`/queues/${queueId}/unpause`);
	};

	jam = async (queueId: string, count: number): Promise<void> => {
		await this.client.post(`/queues/${queueId}/jam`, { count: Math.min(count, 5) });
	};
}
