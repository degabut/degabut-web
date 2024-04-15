import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { YouTubeApi } from "../apis";

type IUseVideoProps = {
	videoId?: Accessor<string>;
};

export const useVideo = ({ videoId }: IUseVideoProps) => {
	const api = useApi();
	const youtube = new YouTubeApi(api.youtubeClient);

	const [data, { refetch, mutate }] = createResource(videoId, youtube.getVideo, { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
