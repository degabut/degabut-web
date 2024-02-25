import { ISpotifySimplifiedPlaylist, ISpotifyTrack, SpotifyApi } from "@spotify/apis";
import { SpotifySdk } from "@spotify/sdk";
import { Accessor, Resource, ResourceReturn, createResource } from "solid-js";

type ParsedResourceReturn<T> = {
	data: Resource<T>;
	mutate: (data: T) => void;
	refetch: () => void;
};

export type SpotifyData = {
	playlists: ParsedResourceReturn<ISpotifySimplifiedPlaylist[]>;
	recentlyPlayed: ParsedResourceReturn<ISpotifyTrack[]>;
	topTracks: ParsedResourceReturn<ISpotifyTrack[]>;
	currentlyPlaying: ParsedResourceReturn<ISpotifyTrack | null>;
};

export const useSpotifyData = (isConnected: Accessor<boolean>, client: SpotifySdk): SpotifyData => {
	const api = new SpotifyApi(client);

	const playlists = createResource(isConnected, (c) => c && api.getSelfPlaylists(0, 10));
	const recentlyPlayed = createResource(isConnected, (c) => c && api.getRecentlyPlayed(10));
	const topTracks = createResource(isConnected, (c) => c && api.getTopTracks(0, 10));
	const currentlyPlaying = createResource(api.getCurrentlyPlaying);

	const parseReturn = <T>(resource: ResourceReturn<T>): ParsedResourceReturn<T> => ({
		data: resource[0],
		mutate: resource[1].mutate,
		refetch: resource[1].refetch,
	});

	return {
		playlists: parseReturn(playlists),
		recentlyPlayed: parseReturn(recentlyPlayed),
		topTracks: parseReturn(topTracks),
		currentlyPlaying: parseReturn(currentlyPlaying),
	};
};
