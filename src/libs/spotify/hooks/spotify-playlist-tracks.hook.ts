import { ISpotifyTrack, SpotifyApi } from "@spotify/apis";
import { createEffect, createResource, createSignal } from "solid-js";
import { useSpotify } from "./spotify.hook";

export const useSpotifyPlaylistTracks = (id: string) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);
	const [data, setData] = createSignal<ISpotifyTrack[]>([]);
	let page = 0;

	const [_data, { mutate, refetch }] = createResource(() => api.getPlaylistTracks(id, page));

	createEffect(() => {
		const newData = _data();
		if (newData?.length) setData((d) => [...d, ...newData]);
	});

	const next = () => {
		page++;
		refetch();
	};

	return {
		data,
		mutate,
		next,
	};
};
