import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { YouTubeApi } from "../apis";

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
