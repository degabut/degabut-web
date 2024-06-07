import { useApi } from "@common";
import { createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { PlaylistApi, type IPlaylistMediaSource } from "../apis";

type IUsePlaylistProps = {
	playlistId: string;
	limit?: number;
	onLoad?: () => void;
};

export const usePlaylist = (params: IUsePlaylistProps) => {
	const api = useApi();
	const playlistApi = new PlaylistApi(api.client);
	const [mediaSources, setMediaSources] = createStore<IPlaylistMediaSource[]>([]);
	let page = 1;

	const [playlist, { refetch: refetchPlaylist, mutate: mutatePlaylist }] = createResource(
		params.playlistId,
		playlistApi.getPlaylist,
		{ initialValue: null }
	);
	const [_mediaSources, { refetch: refetchMediaSources, mutate: mutateMediaSources }] = createResource(
		() => playlistApi.getPlaylistMediaSources(params.playlistId, page, params.limit),
		{ initialValue: [] }
	);

	createEffect(() => {
		const newMediaSource = _mediaSources();
		if (!newMediaSource?.length) return;

		setMediaSources((d) => [...d, ...newMediaSource]);
		params.onLoad && setTimeout(params.onLoad, 0);
	});

	const nextMediaSources = () => {
		page++;
		refetchMediaSources();
	};

	const update = async (name: string) => {
		await playlistApi.updatePlaylist(params.playlistId, name);
	};

	const removeMediaSource = async (playlistMediaSourceId: string) => {
		await playlistApi.removePlaylistMediaSource(params.playlistId, playlistMediaSourceId);
		mutateMediaSources((mediaSources) => mediaSources?.filter((m) => m.id !== playlistMediaSourceId));
		mutatePlaylist((playlist) => {
			if (playlist) playlist.mediaSourceCount -= 1;
			return playlist;
		});
	};

	const isPlaylistLoading = () => playlist.loading;
	const isMediaSourceLoading = () => _mediaSources.loading;
	const isMediaSourceFetchable = () => !_mediaSources.loading && _mediaSources().length === params.limit;

	return {
		playlist,
		refetchPlaylist,
		nextMediaSources,
		mediaSources,
		update,
		removeMediaSource,
		isPlaylistLoading,
		isMediaSourceLoading,
		isMediaSourceFetchable,
	};
};
