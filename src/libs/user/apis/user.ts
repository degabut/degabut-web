import type { IMediaSource } from "@media-source";
import type { AxiosInstance } from "axios";
import dayjs from "dayjs";

type GetVideosParams = { guild?: boolean } | { voiceChannel?: boolean };

export type GetLastPlayedParams = {
	last: number;
} & GetVideosParams;

export type GetMostPlayedParams =
	| {
			days: number;
			count: number;
	  }
	| ({
			from: Date;
			to: Date;
			limit: number;
			excludeFrom?: Date;
			excludeTo?: Date;
			excludeTopPercent?: number;
	  } & GetVideosParams);

export type GetMonthlyPlayActivityParams = {
	from: Date;
	to: Date;
};

export type IMonthlyPlayActivity = {
	date: Date;
	playCount: number;
	uniquePlayCount: number;
};

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
	mediaSource: IMediaSource;
};

export type ILikedMediaSource = {
	likedAt: string;
	mediaSource: IMediaSource;
};

export type LikedMediaSourceDict = Record<string, boolean>;

export class UserApi {
	constructor(private client: AxiosInstance) {}

	getLikedMediaSource = async (page: number, limit = 100): Promise<ILikedMediaSource[]> => {
		const response = await this.client.get<ILikedMediaSource[]>("/me/liked", { params: { page, limit } });
		if (response.status === 200) return response.data;
		return [];
	};

	getIsLikedMediaSource = async (allMediaSourceIds: string[]): Promise<LikedMediaSourceDict> => {
		// batch to 100 ids per request
		const max = 100;
		const promises: Promise<LikedMediaSourceDict>[] = [];

		for (let i = 0; i < allMediaSourceIds.length; i += max) {
			const mediaSourceIds = allMediaSourceIds.slice(i, i + max);
			if (mediaSourceIds.length === 0) break;

			const promise = async (): Promise<LikedMediaSourceDict> => {
				const response = await this.client.post<boolean[]>("/me/liked/is-liked", { mediaSourceIds });
				if (response.status >= 400) return {};

				return response.data.reduce<LikedMediaSourceDict>((acc, r, i) => {
					acc[mediaSourceIds[i]] = r;
					return acc;
				}, {});
			};

			promises.push(promise());
		}

		const responses = await Promise.all(promises);
		let result: LikedMediaSourceDict = {};
		for (const r of responses) result = { ...result, ...r };

		return result;
	};

	likeMediaSource = async (mediaSourceId: string): Promise<void> => {
		await this.client.post("/me/liked", { mediaSourceId });
	};

	unlikeMediaSource = async (mediaSourceId: string): Promise<void> => {
		await this.client.delete(`/me/liked/${encodeURIComponent(mediaSourceId)}`);
	};

	getUserPlayHistory = async (
		id: string,
		params: GetLastPlayedParams | GetMostPlayedParams
	): Promise<IMediaSource[]> => {
		const response = await this.client.get(`/users/${id}/play-history`, { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getMonthlyPlayActivity = async (params: GetMonthlyPlayActivityParams): Promise<IMonthlyPlayActivity[]> => {
		const response = await this.client.get("/me/monthly-play-activity", {
			params: {
				from: dayjs(params.from).format("YYYY-MM"),
				to: dayjs(params.to).format("YYYY-MM"),
			},
		});

		if (response.status === 200) {
			return response.data.map((d: IMonthlyPlayActivity) => ({
				...d,
				date: new Date(d.date),
			}));
		} else {
			return [];
		}
	};

	getPlayHistory = async (params: GetLastPlayedParams | GetMostPlayedParams): Promise<IMediaSource[]> => {
		const response = await this.client.get("/me/play-history", { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getMostPlayed = async (params: GetMostPlayedParams): Promise<IMediaSource[]> => {
		const response = await this.client.get("/me/most-played", {
			params: {
				...params,
				from: "from" in params && params.from ? dayjs(params.from).format("YYYY-MM-DD") : undefined,
				to: "to" in params && params.to ? dayjs(params.to).format("YYYY-MM-DD") : undefined,
				excludeFrom:
					"excludeFrom" in params && params.excludeFrom
						? dayjs(params.excludeFrom).format("YYYY-MM-DD")
						: undefined,
				excludeTo:
					"excludeTo" in params && params.excludeTo
						? dayjs(params.excludeTo).format("YYYY-MM-DD")
						: undefined,
			},
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	removePlayHistory = async (mediaSourceId: string): Promise<void> => {
		await this.client.delete(`/me/play-history/${encodeURIComponent(mediaSourceId)}`);
	};

	getRecap = async (year: number): Promise<IRecap | null> => {
		const response = await this.client.get(`/me/recap/${year}`);
		if (response.status === 200) return response.data;
		else return null;
	};
}
