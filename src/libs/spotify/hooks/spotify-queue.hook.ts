import { SpotifyApi } from "@spotify/apis";
import { createResource } from "solid-js";
import { useSpotify } from "./spotify.hook";

export const useSpotifyQueue = () => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);

	const [data, { mutate, refetch }] = createResource(api.getQueue);

	return {
		data,
		mutate,
		refetch,
	};
};
