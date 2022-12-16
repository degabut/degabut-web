import { debounce } from "@utils";
import { createEffect, createMemo, createSignal } from "solid-js";
import { useVideos } from "./useVideos";
import { useYouTubePlaylists } from "./useYouTubePlaylists";

type Params = {
	debounce?: number;
	playlistStartIndex?: number;
	playlistCount?: number;
};

export const useSearchYouTube = (params: Params = {}) => {
	const [keyword, setKeyword] = createSignal("");
	const [debouncedKeyword, _setDebouncedKeyword] = createSignal("");
	const videos = useVideos(debouncedKeyword);
	const playlists = useYouTubePlaylists(debouncedKeyword);
	const [playlistStartIndex, setPlaylistStartIndex] = createSignal(-1);
	const [playlistEndIndex, setPlaylistEndIndex] = createSignal(-1);
	const [playlistCount, setPlaylistCount] = createSignal(-1);

	const setDebouncedKeyword = debounce((v: string) => _setDebouncedKeyword(v), params.debounce || 350);
	createEffect(() => setDebouncedKeyword(keyword()));

	const result = createMemo(() => {
		if (videos.data()?.length && !videos.data.loading && playlists.data()?.length && !playlists.data.loading) {
			const relevantVideos = videos.data()?.slice(0, params.playlistStartIndex || 3) || [];
			const relevantPlaylists = playlists.data()?.slice(0, params.playlistCount || 3) || [];
			const restVideos = videos.data()?.slice(params.playlistStartIndex || 3) || [];

			// set actual start index and count
			setPlaylistCount(relevantPlaylists.length);
			setPlaylistStartIndex(relevantPlaylists.length ? relevantVideos.length : -1);
			setPlaylistEndIndex(relevantPlaylists.length ? relevantVideos.length + relevantPlaylists.length - 1 : -1);

			return [...relevantVideos, ...relevantPlaylists, ...restVideos];
		}
		return [];
	});

	const isLoading = createMemo(() => videos.data.loading || playlists.data.loading);

	return {
		keyword,
		setKeyword,
		debouncedKeyword,
		result,
		playlistStartIndex,
		playlistEndIndex,
		playlistCount,
		isLoading,
		videos,
		playlists,
	};
};
