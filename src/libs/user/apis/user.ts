import { IVideoCompact } from "@youtube/apis";
import { AxiosInstance } from "axios";

type GetVideosParams = { guild?: boolean } | { voiceChannel?: boolean };

export type GetLastPlayedParams = {
	last: number;
} & GetVideosParams;

export type GetMostPlayedParams = {
	days: number;
	count: number;
} & GetVideosParams;

export type IRecap = {
	mostPlayed: IMostPlayed[];
	monthly: IMonthly[];
	durationPlayed: number;
	songPlayed: number;
	uniqueSongPlayed: number;
};

export type IMonthly = {
	month: number;
	songPlayed: number;
	durationPlayed: number;
	mostPlayed: IMostPlayed | null;
};

export type IMostPlayed = {
	videoId: string;
	count: number;
	video: IVideoCompact;
};

export class UserApi {
	constructor(private client: AxiosInstance) {}

	getUserPlayHistory = async (
		id: string,
		params: GetLastPlayedParams | GetMostPlayedParams
	): Promise<IVideoCompact[]> => {
		const response = await this.client.get(`/users/${id}/play-history`, { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getPlayHistory = async (params: GetLastPlayedParams | GetMostPlayedParams): Promise<IVideoCompact[]> => {
		const response = await this.client.get("/me/play-history", { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	removePlayHistory = async (videoId: string): Promise<void> => {
		await this.client.delete(`/me/play-history/${videoId}`);
	};

	getRecap = async (year: number): Promise<IRecap | null> => {
		const response = await this.client.get(`/me/recap/${year}`);
		if (response.status === 200) return response.data;
		else return null;
	};
}
