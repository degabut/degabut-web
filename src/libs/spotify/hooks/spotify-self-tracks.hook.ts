import { ISpotifyTrack, SpotifyApi } from "@spotify/apis";
import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { useSpotify } from "./spotify.hook";

type Params = {
	limit?: number;
	onLoad?: () => void;
};

export const useSpotifySelfTracks = (params: Params) => {
	const spotify = useSpotify();
	const api = new SpotifyApi(spotify.client);
	const [data, setData] = createStore<ISpotifyTrack[]>([]);
	const limit = params.limit || 50;
	let page = 0;

	const [_data, { mutate, refetch }] = createResource(() => api.getSavedTracks(page, limit), { initialValue: [] });

	createEffect(() => {
		const newData = _data();
		if (!newData?.length) return;

		setData((d) => [...d, ...newData]);
		params.onLoad && setTimeout(params.onLoad, 0);
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
