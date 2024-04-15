import { createResource } from "solid-js";
import { SpotifyApi } from "../apis";
import { useSpotify } from "./spotify.hook";

export const useSpotifyPlaylist = (id: string) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(() => api.getPlaylist(id), { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
