import { createResource } from "solid-js";
import { useApi } from "./useApi";

export const usePlaylists = () => {
	const api = useApi();
	const [data, { refetch, mutate }] = createResource([], api.playlist.getPlaylists);

	const createPlaylist = async (name: string) => {
		await api.playlist.createPlaylist(name);
		await refetch();
	};

	const deletePlaylist = async (id: string) => {
		await api.playlist.deletePlaylist(id);
		await refetch();
	};

	return { data, refetch, mutate, createPlaylist, deletePlaylist };
};
