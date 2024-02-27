import { SpotifyApi } from "@spotify/apis";
import { Accessor, createResource } from "solid-js";
import { useSpotify } from "./spotify.hook";

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
