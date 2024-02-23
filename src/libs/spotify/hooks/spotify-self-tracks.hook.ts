import { ISpotifyTrack, SpotifyApi } from "@spotify/apis";
import { Accessor, createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { useSpotify } from "./spotify.hook";

export const useSpotifySelfTracks = (page: Accessor<number>, limit = 50) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);
	const [data, setData] = createStore<ISpotifyTrack[]>([]);

	const [_data, { mutate, refetch }] = createResource(page, async (page) => {
		const tracks = await api.getSavedTracks(page, limit);
		return tracks;
	});

	createEffect(() => {
		const newData = _data();
		if (newData) setData((d) => [...d, ...newData]);
	});

	const isFetchable = () => {
		const length = _data()?.length || 0;
		return !_data.loading && length === limit;
	};

	return {
		data,
		isFetchable,
		isLoading: () => _data.loading,
		mutate,
		refetch,
	};
};
