import { useApi } from "@common";
import { Accessor, createEffect, createResource, createSignal } from "solid-js";
import { IContinuable, YouTubeApi, type IVideoCompact } from "../apis";

type PropsValue = string;

type IUseYouTubePlaylistVideosProps = Accessor<PropsValue> | PropsValue;

export const useYouTubePlaylistVideos = (id: IUseYouTubePlaylistVideosProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);
	const [data, setData] = createSignal<IVideoCompact[]>([]);
	let nextPageToken: string | null = null;

	const [_data, { mutate, refetch }] = createResource(
		id,
		async (id) => {
			if (nextPageToken) {
				return youtube.getPlaylistVideosContinuation(nextPageToken);
			} else {
				const result = await youtube.getPlaylist(id);
				return result?.videos || [];
			}
		},
		{ initialValue: null as IVideoCompact[] | IContinuable<IVideoCompact> | null }
	);

	createEffect(() => {
		const newData = _data();
		if (!newData) return;

		setData((d) => [...d, ...("items" in newData ? newData.items : newData)]);
		nextPageToken = "continuation" in newData ? newData.continuation || null : null;
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
