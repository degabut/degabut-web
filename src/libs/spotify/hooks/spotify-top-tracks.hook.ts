import { createResource, type Accessor } from "solid-js";
import { SpotifyApi } from "../apis";
import { useSpotify } from "../providers";

export const useSpotifyTopTracks = (page: Accessor<number>, limit = 10) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(page, (page) => api.getTopTracks(page, limit), {
		initialValue: [],
	});

	return {
		data,
		mutate,
		refetch,
	};
};
