import { SpotifyApi } from "@spotify/apis";
import { Accessor, createResource } from "solid-js";
import { useSpotify } from "./spotify.hook";

export const useSpotifySelfPlaylists = (page: Accessor<number>, limit = 10) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(page, (page) => api.getSelfPlaylists(page, limit));

	return {
		data,
		mutate,
		refetch,
	};
};
