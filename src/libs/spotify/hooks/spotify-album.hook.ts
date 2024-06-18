import { createResource } from "solid-js";
import { SpotifyApi } from "../apis";
import { useSpotify } from "../providers";

export const useSpotifyAlbum = (id: string) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(() => api.getAlbum(id), { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
