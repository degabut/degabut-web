import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { SpotifyApi, type ISpotifyTrack } from "../apis";
import { useSpotify } from "../providers";

export const useSpotifySelfTracks = (limit = 50) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);
	const [data, setData] = createStore<ISpotifyTrack[]>([]);
	let page = 0;

	const [_data, { mutate, refetch }] = createResource(() => api.getSavedTracks(page, limit), { initialValue: [] });

	createEffect(() => {
		const newData = _data();
		if (!newData?.length) return;

		setData((d) => [...d, ...newData]);
	});

	const next = () => {
		page++;
		refetch();
	};

	const isFetchable = () => {
		const length = _data().length;
		return !_data.loading && length === limit;
	};

	return {
		data,
		mutate,
		isFetchable,
		isLoading: () => _data.loading,
		next,
	};
};
