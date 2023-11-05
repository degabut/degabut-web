import { AxiosInstance } from "axios";
import { IMusicAlbum, IMusicPlaylist, IMusicSong, IMusicVideo } from "./youtube-music";

export type IVideoLike = IVideoCompact | IVideo | IMusicVideo | IMusicSong;
export type IYouTubePlaylistLike =
	| IYouTubePlaylist
	| IYouTubePlaylistCompact
	| IYouTubeMixPlaylist
	| IMusicAlbum
	| IMusicPlaylist;

export type IThumbnail = {
	url: string;
	width: number;
	height: number;
};

export type IChapter = {
	title: string;
	start: number;
	thumbnails: IThumbnail[];
};

export type IContinuable<T> = {
	token: string | null;
	items: T[];
};

export interface IVideo {
	id: string;
	title: string;
	duration: number;
	chapters: IChapter[];
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
	channel?: IChannel;
};

export type IYouTubePlaylistCompact = {
	id: string;
	title: string;
	videoCount: number;
	thumbnails: IThumbnail[];
	channel: IChannel | null;
};

export type IYouTubePlaylist = {
	videos: IContinuable<IVideoCompact>;
	viewCount: number;
} & IYouTubePlaylistCompact;

export type IYouTubeMixPlaylist = {
	videos: IVideoCompact[];
	channel: undefined;
} & Omit<IYouTubePlaylistCompact, "viewCount" | "channel" | "thumbnails">;

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

export class YouTubeApi {
	constructor(private client: AxiosInstance) {}

	search = async (keyword: string): Promise<(IVideoCompact | IYouTubePlaylistCompact)[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/search", {
			params: { keyword },
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	searchVideos = async (keyword: string): Promise<IVideoCompact[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/videos", {
			params: { keyword },
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	getVideo = async (id: string): Promise<IVideo | null> => {
		if (!id) return null;

		const response = await this.client.get("/videos/" + id);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	getVideoTranscript = async (id: string): Promise<ITranscript[] | null> => {
		if (!id) return null;

		const response = await this.client.get(`/videos/${id}/transcript`);
		if (response.status !== 200) return null;
		return response.data;
	};

	searchPlaylists = async (keyword: string): Promise<IYouTubePlaylistCompact[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/playlists", {
			params: { keyword },
		});
		if (response.status === 200) return response.data;
		else return [];
	};

	getPlaylist = async (id: string): Promise<IYouTubePlaylist | IYouTubeMixPlaylist | null> => {
		if (!id) return null;

		const response = await this.client.get("/playlists/" + id);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	getPlaylistVideosContinuation = async (token: string): Promise<IContinuable<IVideoCompact>> => {
		const response = await this.client.get("/continuation/playlists-videos", {
			params: { token },
		});
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};
}
