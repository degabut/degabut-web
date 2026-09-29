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
	streamToken: string | null;
	filters?: IPlayerFilters;
	plugins: string[];
}

export class PlayerApi {
	constructor(private client: AxiosInstance) {}

	create = async (voiceChannelId: string, textChannelId?: string): Promise<boolean> => {
		try {
			const response = await this.client.post("/players", { voiceChannelId, textChannelId });
			if (response.status !== 201) return false;
			return true;
		} catch {
			return false;
		}
	};

	getStreamUrl = (voiceChannelId: string, token: string): string => {
		const baseUrl = this.client.defaults.baseURL?.startsWith("/")
			? window.location.origin + this.client.defaults.baseURL
			: (this.client.defaults.baseURL ?? "");
		const url = new URL(`/players/${voiceChannelId}/stream`, baseUrl);
		if (token) url.searchParams.set("token", token);
		return url.toString();
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
