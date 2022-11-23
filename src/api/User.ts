import { AxiosInstance } from "axios";
import { IQueue } from "./Queue";
import { IVideoCompact } from "./YouTube";

type GetVideosParams = { guild?: boolean } | { voiceChannel?: boolean };

export type GetLastPlayedParams = {
	last: number;
} & GetVideosParams;

export type GetMostPlayedParams = {
	days: number;
	count: number;
} & GetVideosParams;

export class User {
	constructor(private client: AxiosInstance) {}

	getVideoHistory = async (
		id: string,
		params: GetLastPlayedParams | GetMostPlayedParams
	): Promise<IVideoCompact[]> => {
		const response = await this.client.get(`/users/${id}/videos`, { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getSelfQueue = async (): Promise<IQueue | undefined> => {
		const response = await this.client.get("/users/me/queue");
		if (response.status !== 200) return undefined;
		return response.data;
	};
}
