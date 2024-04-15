import type { AxiosInstance } from "axios";

export interface IPlayer {
	position: number;
	isPaused: boolean;
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
}
