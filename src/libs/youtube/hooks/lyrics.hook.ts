import { useApi } from "@common/hooks";
import { YouTubeMusicApi } from "@youtube/apis";
import { Accessor, createResource } from "solid-js";

type IUseLyricsProps = Accessor<string>;

export const useLyrics = (songId: IUseLyricsProps) => {
	const api = useApi();
	const youtubeMusic = new YouTubeMusicApi(api.youtubeClient);

	const [data, { refetch, mutate }] = createResource(songId, youtubeMusic.getLyrics, { initialValue: null });

	return {
		data,
		mutate,
		refetch,
	};
};
