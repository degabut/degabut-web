import { createEffect, createResource, createSignal, type Accessor } from "solid-js";
import { YouTubeConnectApi, type IYouTubePlaylistCompact } from "../apis";
import { YouTubeConnectionState, useYouTubeConnect } from "../providers";

export type YouTubeConnectPlaylists = {
	data: Accessor<IYouTubePlaylistCompact[]>;
	isLoading: Accessor<boolean>;
	isInitialLoading: Accessor<boolean>;
	isFetchable: Accessor<boolean>;
	next: () => void;
	refresh: () => void;
};

export const useYouTubeConnectPlaylists = (): YouTubeConnectPlaylists => {
	const youtube = useYouTubeConnect();
	const api = new YouTubeConnectApi(youtube.client);

	const [playlists, setPlaylists] = createSignal<IYouTubePlaylistCompact[]>([]);
	const [request, setRequest] = createSignal(0);
	let nextPageToken: string | undefined;
	let hasLoaded = false;

	const isConnected = () => youtube.state?.() === YouTubeConnectionState.Connected;

	const [page] = createResource(
		request,
		async (request) => {
			if (!request || !isConnected()) return null;
			return await api.getSelfPlaylists(undefined, nextPageToken);
		},
		{ initialValue: null }
	);

	createEffect(() => {
		const result = page();
		if (!result) return;

		hasLoaded = true;
		nextPageToken = result.nextPageToken;
		setPlaylists((prev) => [...prev, ...result.playlists]);
	});

	const next = () => {
		if (page.loading) return;
		if (hasLoaded && !nextPageToken) return;
		setRequest((n) => n + 1);
	};

	const refresh = () => {
		nextPageToken = undefined;
		hasLoaded = false;
		setPlaylists([]);
		setRequest((n) => n + 1);
	};

	return {
		data: playlists,
		isLoading: () => page.loading,
		isInitialLoading: () => page.loading && !playlists().length,
		isFetchable: () => !!nextPageToken && !page.loading,
		next,
		refresh,
	};
};
