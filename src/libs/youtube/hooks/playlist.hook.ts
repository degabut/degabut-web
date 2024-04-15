import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { YouTubeApi } from "../apis";

type PropsValue = string;

type IUseYouTubePlaylistsProps = Accessor<PropsValue> | PropsValue;

export const useYouTubePlaylists = (props: IUseYouTubePlaylistsProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);

	const resource = createResource(props, youtube.searchPlaylists, { initialValue: [] });

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
