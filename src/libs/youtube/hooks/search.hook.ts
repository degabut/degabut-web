import { DelayUtil } from "@common";
import { createEffect, createMemo, createSignal } from "solid-js";
import { useYouTubePlaylists } from "./playlist.hook";
import { useVideos } from "./videos.hook";

type Params = {
	debounce?: number;
	playlistStartIndex?: number;
	playlistCount?: number;
};

export const useSearch = (params: Params = {}) => {
	const [keyword, setKeyword] = createSignal("");
	const [debouncedKeyword, _setDebouncedKeyword] = createSignal("");
	const videos = useVideos(debouncedKeyword);
	const playlists = useYouTubePlaylists(debouncedKeyword);

	const setDebouncedKeyword = DelayUtil.debounce(
		(v: string) => _setDebouncedKeyword(v.startsWith("https://") ? "" : v),
		params.debounce || 250
	);
	createEffect(() => setDebouncedKeyword(keyword()));

	const result = createMemo(() => {
		if (videos.data() && !videos.data.loading && !playlists.data.loading) {
			const relevantVideos = videos.data().slice(0, params.playlistStartIndex || 3) || [];
			const relevantPlaylists = playlists.data().slice(0, params.playlistCount || 3) || [];
			const restVideos = videos.data().slice(params.playlistStartIndex || 3) || [];

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
		isLoading,
		videos,
		playlists,
	};
};
