import { useApi } from "@common";
import { createResource, type Accessor } from "solid-js";
import { YouTubeMusicApi } from "../apis";

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
