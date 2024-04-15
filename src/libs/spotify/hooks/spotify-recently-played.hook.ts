import { createResource } from "solid-js";
import { SpotifyApi } from "../apis";
import { useSpotify } from "./spotify.hook";

export const useSpotifyRecentlyPlayed = (limit = 10) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(() => api.getRecentlyPlayed(limit), { initialValue: [] });

	return {
		data,
		mutate,
		refetch,
	};
};
