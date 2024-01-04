import { IMediaSource } from "@media-source/apis";
import { AxiosInstance } from "axios";

export interface IPlaylist {
	id: string;
	name: string;
	ownerId: string;
	mediaSourceCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface IPlaylistMediaSource {
	id: string;
	playlistId: string;
	mediaSourceId: string;
	createdBy: string;
	createdAt: string;
	mediaSource: IMediaSource;
}

export class PlaylistApi {
	constructor(private client: AxiosInstance) {}

	getPlaylists = async (): Promise<IPlaylist[]> => {
		const response = await this.client.get("/me/playlists");

		if (response.status === 200) return response.data;
		else return [];
	};

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

	getPlaylistMediaSources = async (playlistId: string): Promise<IPlaylistMediaSource[]> => {
		if (!playlistId) return [];

		const response = await this.client.get(`/playlists/${playlistId}/media-sources`);
		if (response.status !== 200) throw new Error(response.data.message);
		return response.data;
	};

	addPlaylistMediaSource = async (playlistId: string, mediaSourceId: string): Promise<boolean> => {
		const response = await this.client.post(`/playlists/${playlistId}/media-sources`, { mediaSourceId });
		return response.data === 200;
	};

	removePlaylistMediaSource = async (playlistId: string, playlistMediaSourceId: string): Promise<boolean> => {
		const response = await this.client.delete(`/playlists/${playlistId}/media-sources/${playlistMediaSourceId}`);
		return response.data === 200;
	};
}
