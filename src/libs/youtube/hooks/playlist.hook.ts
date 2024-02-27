import { useApi } from "@common/hooks";
import { YouTubeApi } from "@youtube/apis";
import { Accessor, createResource } from "solid-js";

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
