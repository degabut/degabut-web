import { AxiosInstance } from "axios";
import { IPlaylist } from "./Playlist";
import { IQueue } from "./Queue";
import { GetLastPlayedParams, GetMostPlayedParams } from "./User";
import { IVideoCompact } from "./YouTube";

export class Me {
	constructor(private client: AxiosInstance) {}

	getPlayHistory = async (params: GetLastPlayedParams | GetMostPlayedParams): Promise<IVideoCompact[]> => {
		const response = await this.client.get("/me/play-history", { params });
		if (response.status === 200) return response.data;
		else return [];
	};

	getQueue = async (): Promise<IQueue | undefined> => {
		const response = await this.client.get("/me/queue");
		if (response.status !== 200) return undefined;
		return response.data;
	};

	getPlaylists = async (): Promise<IPlaylist[]> => {
		const response = await this.client.get("/me/playlists");

		if (response.status === 200) return response.data;
		else return [];
	};
}
