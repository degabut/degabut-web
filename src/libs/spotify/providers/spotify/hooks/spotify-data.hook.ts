import { createResource, type Accessor, type InitializedResource, type InitializedResourceReturn } from "solid-js";
import { SpotifyApi, type ISpotifyAlbum, type ISpotifySimplifiedPlaylist, type ISpotifyTrack } from "../../../apis";
import type { SpotifySdk } from "../../../sdk";

type ParsedResourceReturn<T> = {
	data: InitializedResource<T>;
	mutate: (data: T) => void;
	refetch: () => void;
};

export type SpotifyData = {
	playlists: ParsedResourceReturn<ISpotifySimplifiedPlaylist[]>;
	albums: ParsedResourceReturn<ISpotifyAlbum[]>;
	recentlyPlayed: ParsedResourceReturn<ISpotifyTrack[]>;
	topTracks: ParsedResourceReturn<ISpotifyTrack[]>;
	currentlyPlaying: ParsedResourceReturn<ISpotifyTrack | null>;
};

export const useSpotifyData = (fetch: Accessor<boolean>, client: SpotifySdk): SpotifyData => {
	const api = new SpotifyApi(client);

	const albums = createResource(fetch, (f) => f && api.getSelfAlbums(), { initialValue: [] });
	const playlists = createResource(fetch, (f) => f && api.getSelfPlaylists(), { initialValue: [] });
	const recentlyPlayed = createResource(fetch, (f) => f && api.getRecentlyPlayed(10), { initialValue: [] });
	const topTracks = createResource(fetch, (f) => f && api.getTopTracks(0, 10), { initialValue: [] });
	const currentlyPlaying = createResource(fetch, (f) => f && api.getCurrentlyPlaying(), { initialValue: null });

	const parseReturn = <T>(resource: InitializedResourceReturn<T>): ParsedResourceReturn<T> => ({
		data: resource[0],
		mutate: resource[1].mutate,
		refetch: resource[1].refetch,
	});

	return {
		albums: parseReturn(albums),
		playlists: parseReturn(playlists),
		recentlyPlayed: parseReturn(recentlyPlayed),
		topTracks: parseReturn(topTracks),
		currentlyPlaying: parseReturn(currentlyPlaying),
	};
};
