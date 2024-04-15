import { useApi } from "@common";
import { createResource } from "solid-js";
import { PlaylistApi } from "../apis";

export const usePlaylists = () => {
	const api = useApi();
	const playlistApi = new PlaylistApi(api.client);
	const [data, { refetch, mutate }] = createResource(playlistApi.getPlaylists, { initialValue: [] });

	const createPlaylist = async (name: string) => {
		await playlistApi.createPlaylist(name);
		await refetch();
	};

	const deletePlaylist = async (id: string) => {
		await playlistApi.deletePlaylist(id);
		await refetch();
	};

	const addPlaylistMediaSource = async (playlistId: string, mediaSourceId: string) => {
		await playlistApi.addPlaylistMediaSource(playlistId, mediaSourceId);
	};

	return { data, refetch, mutate, createPlaylist, deletePlaylist, addPlaylistMediaSource };
};
