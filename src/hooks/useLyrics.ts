import { Accessor, createResource } from "solid-js";
import { useApi } from "./useApi";

type IUseLyricsProps = Accessor<string>;

export const useLyrics = (songId: IUseLyricsProps) => {
	const api = useApi();
	const [data, { refetch, mutate }] = createResource(songId, api.youtubeMusic.getLyrics);

	return {
		data,
		mutate,
		refetch,
	};
};
