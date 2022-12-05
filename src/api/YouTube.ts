import { AxiosInstance } from "axios";

export type IThumbnail = {
	url: string;
	width: number;
	height: number;
};

export type Continuable<T> = {
	token: string | null;
	items: T[];
};

export interface IVideo {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	viewCount: number;
	channel: IChannel;
	related?: IVideoCompact[];
}

export type IVideoCompact = {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	viewCount: number | null;
	channel: IChannel;
};

export type IPlaylistCompact = {
	id: string;
	title: string;
	videoCount: number;
	thumbnails: IThumbnail[];
	channel: IChannel | null;
};

export type IYoutubePlaylist = {
	videos: Continuable<IVideoCompact>;
} & Omit<IPlaylistCompact, "viewCount" | "thumbnails">;

export type IMixPlaylist = {
	videos: IVideoCompact[];
	channel: undefined;
} & Omit<IPlaylistCompact, "viewCount" | "channel" | "thumbnails">;

export type IChannel = {
	id: string;
	name: string;
	thumbnails?: IThumbnail[];
};

export interface ITranscript {
	start: number;
	end: number;
	duration: number;
	text: string;
}

export class YouTube {
	constructor(private client: AxiosInstance) {}

	searchVideos = async (keyword: string): Promise<IVideoCompact[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/youtube/videos", {
			params: { keyword },
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	getVideo = async (id: string): Promise<IVideo | null> => {
		if (!id) return null;

		const response = await this.client.get("/youtube/videos/" + id);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	getVideoTranscript = async (id: string): Promise<ITranscript[] | null> => {
		if (!id) return null;

		const response = await this.client.get(`/youtube/videos/${id}/transcript`);
		if (response.status !== 200) return null;
		return response.data;
	};

	searchPlaylists = async (keyword: string): Promise<IPlaylistCompact[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/youtube/playlists", {
			params: { keyword },
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	getPlaylist = async (id: string): Promise<IYoutubePlaylist | IMixPlaylist | null> => {
		if (!id) return null;

		const response = await this.client.get("/youtube/playlists/" + id);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	getPlaylistVideosContinuation = async (token: string): Promise<Continuable<IVideoCompact>> => {
		const response = await this.client.get("/youtube/continuation/playlists-videos", {
			params: { token },
		});
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};
}
