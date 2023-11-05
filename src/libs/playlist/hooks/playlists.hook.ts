import { useApi } from "@common/hooks";
import { createResource } from "solid-js";
import { PlaylistApi } from "../apis";

export const usePlaylists = () => {
	const api = useApi();
	const playlistApi = new PlaylistApi(api.client);
	const [data, { refetch, mutate }] = createResource([], playlistApi.getPlaylists);

	const createPlaylist = async (name: string) => {
		await playlistApi.createPlaylist(name);
		await refetch();
	};

	const deletePlaylist = async (id: string) => {
		await playlistApi.deletePlaylist(id);
		await refetch();
	};

	const addPlaylistVideo = async (playlistId: string, videoId: string) => {
		await playlistApi.addPlaylistVideo(playlistId, videoId);
	};

	return { data, refetch, mutate, createPlaylist, deletePlaylist, addPlaylistVideo };
};
