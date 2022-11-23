import { Accessor, createResource } from "solid-js";
import { useApi } from "./useApi";

type IUseVideoProps = {
	videoId?: Accessor<string>;
};

export const useVideo = ({ videoId }: IUseVideoProps) => {
	const api = useApi();
	const [data, { refetch, mutate }] = createResource(videoId, api.youtube.getVideo);

	return {
		data,
		mutate,
		refetch,
	};
};
