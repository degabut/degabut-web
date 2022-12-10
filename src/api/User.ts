import { AxiosInstance } from "axios";
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

	getPlayHistory = async (
		id: string,
		params: GetLastPlayedParams | GetMostPlayedParams
	): Promise<IVideoCompact[]> => {
		const response = await this.client.get(`/users/${id}/play-history`, { params });
		if (response.status === 200) return response.data;
		else return [];
	};
}
