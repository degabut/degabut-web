import { useApi } from "@common/hooks";
import { YouTubeApi } from "@youtube/apis";
import { Accessor, createResource } from "solid-js";

type PropsValue = string;

type IUseVideosProps = Accessor<PropsValue> | PropsValue;

export const useVideos = (props: IUseVideosProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);

	const resource = createResource(props, youtube.searchVideos, { initialValue: [] });

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
