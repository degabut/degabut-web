import { useApi } from "@common/hooks";
import { YouTubeApi } from "@youtube/apis";
import { Accessor, createResource } from "solid-js";

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
