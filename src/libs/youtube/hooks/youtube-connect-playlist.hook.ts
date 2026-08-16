import { createResource } from "solid-js";
import { YouTubeConnectApi } from "../apis";
import { useYouTubeConnect } from "../providers";

export const useYouTubePlaylist = (id: string) => {
	const youtube = useYouTubeConnect();
	const api = new YouTubeConnectApi(youtube.client);

	const [data, { mutate, refetch }] = createResource(() => api.getPlaylist(id), { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
