import { createEffect, createResource, createSignal } from "solid-js";
import { YouTubeConnectApi, type IVideoCompact } from "../apis";
import { useYouTubeConnect } from "../providers";

export const useYouTubePlaylistVideos = (id: string) => {
	const youtube = useYouTubeConnect();
	const api = new YouTubeConnectApi(youtube.client);
	const [data, setData] = createSignal<IVideoCompact[]>([]);
	let nextPageToken: string | undefined;

	const [_data, { mutate, refetch }] = createResource(() => api.getPlaylistVideos(id, nextPageToken), {
		initialValue: { videos: [], nextPageToken: undefined },
	});

	createEffect(() => {
		const newData = _data();
		if (!newData?.videos.length) return;

		setData((d) => [...d, ...newData.videos]);
		nextPageToken = newData.nextPageToken;
	});

	const next = () => {
		if (!nextPageToken) return;
		refetch();
	};

	const isFetchable = () => {
		return !!nextPageToken && !_data.loading;
	};

	return {
		data,
		mutate,
		isFetchable,
		isLoading: () => _data.loading,
		next,
	};
};
