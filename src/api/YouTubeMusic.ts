import { AxiosInstance } from "axios";
import { IThumbnail } from "./YouTube";

export interface IShelf {
	title: string;
	items: IMusicSong[] | IMusicVideo[] | IMusicPlaylist[] | IMusicAlbum[];
}

export interface IMusicSong {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	artists: IMusicBaseArtist[];
	album: IMusicAlbum;
}

export interface IMusicVideo {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	artists: IMusicBaseArtist[];
}

export interface IMusicBaseAlbum {
	id: string;
	title: string;
}

export interface IMusicAlbum extends IMusicBaseAlbum {
	year: number;
	thumbnails: IThumbnail[];
	artists: IMusicBaseArtist[];
}

export interface IMusicBaseArtist {
	id: string;
	name: string;
}

export interface IMusicPlaylist {
	id: string;
	title: string;
	songCount: number;
	thumbnails: IThumbnail[];
	channel: IMusicBaseArtist;
}

export interface IMusicLyrics {
	content: string;
	description: string;
}

export class YouTubeMusic {
	constructor(private client: AxiosInstance) {}

	search = async (keyword: string): Promise<IShelf[]> => {
		if (!keyword) return [];

		const response = await this.client.get("/music/search", { params: { keyword } });
		if (response.status === 200) return response.data;
		else return [];
	};

	getLyrics = async (id: string): Promise<IMusicLyrics | null> => {
		if (!id) return null;

		const response = await this.client.get(`/music/songs/${id}/lyrics`);
		if (response.status === 404) return null;
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};
}
