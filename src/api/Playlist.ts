import { AxiosInstance } from "axios";
import { IVideoCompact } from "./YouTube";

export interface IPlaylist {
	id: string;
	name: string;
	ownerId: string;
	videoCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface IPlaylistVideo {
	id: string;
	playlistId: string;
	videoId: string;
	createdBy: string;
	createdAt: string;
	video: IVideoCompact;
}

export class Playlist {
	constructor(private client: AxiosInstance) {}

	createPlaylist = async (name: string): Promise<boolean> => {
		const response = await this.client.post("/playlists", { name });
		return response.status === 200;
	};

	deletePlaylist = async (id: string): Promise<boolean> => {
		const response = await this.client.delete(`/playlists/${id}`);
		return response.status === 200;
	};

	updatePlaylist = async (id: string, name: string): Promise<boolean> => {
		const response = await this.client.patch(`/playlists/${id}`, { name });
		return response.status === 200;
	};

	getPlaylist = async (id: string): Promise<IPlaylist | undefined> => {
		const response = await this.client.get(`/playlists/${id}`);

		if (response.status === 200) return response.data;
		else return undefined;
	};

	getPlaylists = async (): Promise<IPlaylist[]> => {
		const response = await this.client.get("/users/me/playlists");

		if (response.status === 200) return response.data;
		else return [];
	};

	getPlaylistVideos = async (playlistId: string): Promise<IPlaylistVideo[]> => {
		if (!playlistId) return [];

		const response = await this.client.get(`/playlists/${playlistId}/videos`);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	addPlaylistVideo = async (playlistId: string, videoId: string): Promise<boolean> => {
		const response = await this.client.post(`/playlists/${playlistId}/videos`, { videoId });
		return response.data === 200;
	};

	removePlaylistVideo = async (playlistId: string, playlistVideoId: string): Promise<boolean> => {
		const response = await this.client.delete(`/playlists/${playlistId}/videos/${playlistVideoId}`);
		return response.data === 200;
	};
}
