import { SpotifyApi } from "@spotify/apis";
import { createResource } from "solid-js";
import { useSpotify } from "./spotify.hook";

export const useSpotifyPlaylist = (id: string) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(() => api.getPlaylist(id));

	return {
		data,
		mutate,
		refetch,
	};
};
