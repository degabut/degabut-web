import { createEffect, createResource, createSignal } from "solid-js";
import { YouTubeConnectApi, type IYouTubePlaylistCompact } from "../apis";
import { useYouTubeConnect } from "../providers";

export const useYouTubeConnectPlaylists = () => {
	const youtube = useYouTubeConnect();
	const api = new YouTubeConnectApi(youtube.client);
	const [data, setData] = createSignal<IYouTubePlaylistCompact[]>([]);
	let isInitiated = false;
	let page = 0;
	const limit = 50;
	let nextPageToken: string | null = null;

	const [_data, { mutate, refetch }] = createResource(() => api.getSelfPlaylists(limit, nextPageToken || undefined), {
		initialValue: null,
	});

	createEffect(() => {
		isInitiated = true;
		const newData = _data();
		if (!newData) return;
		nextPageToken = newData.playlists.length ? newData.nextPageToken || null : null;
		setData((d) => [...d, ...newData.playlists]);
	});

	const next = () => {
		page++;
		refetch();
	};

	const isFetchable = () => {
		return (nextPageToken || !isInitiated) && !_data.loading;
	};

	return {
		data,
		mutate,
		isFetchable,
		isLoading: () => _data.loading,
		next,
	};
};
