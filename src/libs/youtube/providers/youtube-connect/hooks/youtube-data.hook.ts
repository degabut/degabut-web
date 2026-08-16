import {
	createResource,
	createSignal,
	type Accessor,
	type InitializedResource,
	type InitializedResourceReturn,
} from "solid-js";
import { YouTubeConnectApi, type IYouTubeConnectPlaylistsPage } from "../../../apis";
import type { YouTubeSdk } from "../../../sdk";

type ParsedResourceReturn<T> = {
	data: InitializedResource<T>;
	mutate: (data: T) => void;
	refetch: () => void;
};

export type YouTubeData = {
	playlists: ParsedResourceReturn<IYouTubeConnectPlaylistsPage | null>;
	loadPlaylists: () => void;
};

export const useYouTubeData = (fetch: Accessor<boolean>, client: YouTubeSdk): YouTubeData => {
	const api = new YouTubeConnectApi(client);

	const [playlistsRequest, setPlaylistsRequest] = createSignal(0);

	const playlists = createResource(
		playlistsRequest,
		async (request) => {
			if (!request || !fetch()) return { playlists: [], nextPageToken: undefined };
			return await api.getSelfPlaylists();
		},
		{ initialValue: { playlists: [], nextPageToken: undefined } }
	);

	const loadPlaylists = () => setPlaylistsRequest((n) => n + 1);

	const parseReturn = <T>(resource: InitializedResourceReturn<T>): ParsedResourceReturn<T> => ({
		data: resource[0],
		mutate: resource[1].mutate,
		refetch: resource[1].refetch,
	});

	return {
		playlists: parseReturn(playlists),
		loadPlaylists,
	};
};
