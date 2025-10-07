import type { AxiosInstance } from "axios";

export interface IPlayerFilters {
	equalizer?: {
		band: number;
		gain: number;
	}[];
	timescale?: {
		enabled?: boolean;
		speed?: number;
		pitch?: number;
		rate?: number;
	};
	tremolo?: {
		enabled?: boolean;
		frequency?: number;
		depth?: number;
	};
	vibrato?: {
		enabled?: boolean;
		frequency?: number;
		depth?: number;
	};
	rotation?: {
		enabled?: boolean;
		rotationHz?: number;
	};
	pluginFilters?: {
		echo?: {
			echoLength?: number;
			decay?: number;
		};
	};
}

export interface IPlayer {
	position: number;
	isPaused: boolean;
	filters?: IPlayerFilters;
}

export class PlayerApi {
	constructor(private client: AxiosInstance) {}

	join = async (voiceChannelId: string, textChannelId?: string): Promise<boolean> => {
		const response = await this.client.post("/players", { voiceChannelId, textChannelId });
		if (response.status !== 201) return false;
		return true;
	};

	stop = async (voiceChannelId: string): Promise<void> => {
		await this.client.delete(`/players/${voiceChannelId}`);
	};

	getPlayer = async (queueId: string): Promise<IPlayer | null> => {
		const response = await this.client.get(`/players/${queueId}`);
		if (response.status !== 200) return null;
		return response.data;
	};

	skipTrack = async (queueId: string): Promise<void> => {
		await this.client.post(`/players/${queueId}/skip`);
	};

	seek = async (queueId: string, position: number): Promise<void> => {
		await this.client.post(`/players/${queueId}/seek`, { position });
	};

	pause = async (queueId: string): Promise<void> => {
		await this.client.post(`/players/${queueId}/pause`);
	};

	unpause = async (queueId: string): Promise<void> => {
		await this.client.post(`/players/${queueId}/unpause`);
	};

	setFilters = async (queueId: string, filters: IPlayerFilters): Promise<void> => {
		await this.client.put(`/players/${queueId}/filters`, filters);
	};
}
