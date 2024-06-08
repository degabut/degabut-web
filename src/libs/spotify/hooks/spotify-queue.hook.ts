import { createResource } from "solid-js";
import { SpotifyApi } from "../apis";
import { useSpotify } from "../providers";

export const useSpotifyQueue = () => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(api.getQueue, { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
