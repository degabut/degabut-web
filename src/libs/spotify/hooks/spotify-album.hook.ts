import { SpotifyApi } from "@spotify/apis";
import { createResource } from "solid-js";
import { useSpotify } from "./spotify.hook";

export const useSpotifyAlbum = (id: string) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(() => api.getAlbum(id));

	return {
		data,
		mutate,
		refetch,
	};
};
