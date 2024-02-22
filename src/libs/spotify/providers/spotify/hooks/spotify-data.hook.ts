import { SpotifyApi } from "@spotify/apis";
import {
	useSpotifyQueue,
	useSpotifyRecentlyPlayed,
	useSpotifySelfPlaylists,
	useSpotifyTopTracks,
} from "@spotify/hooks";
import { SpotifySdk } from "@spotify/sdk";
import { Accessor, ResourceReturn, createResource } from "solid-js";

export type SpotifyData = {
	playlists: ReturnType<typeof useSpotifySelfPlaylists>;
	recentlyPlayed: ReturnType<typeof useSpotifyRecentlyPlayed>;
	topTracks: ReturnType<typeof useSpotifyTopTracks>;
	queue: ReturnType<typeof useSpotifyQueue>;
};

export const useSpotifyData = (isConnected: Accessor<boolean>, client: SpotifySdk): SpotifyData => {
	const api = new SpotifyApi(client);

	const playlists = createResource(isConnected, (c) => c && api.getSelfPlaylists(0, 10));
	const recentlyPlayed = createResource(isConnected, (c) => c && api.getRecentlyPlayed(10));
	const topTracks = createResource(isConnected, (c) => c && api.getTopTracks(0, 10));
	const queue = createResource(isConnected, (c) => c && api.getQueue());

	const parseReturn = <T>(resource: ResourceReturn<T>) => ({
		data: resource[0],
		mutate: resource[1].mutate,
		refetch: resource[1].refetch,
	});

	return {
		playlists: parseReturn(playlists),
		recentlyPlayed: parseReturn(recentlyPlayed),
		topTracks: parseReturn(topTracks),
		queue: parseReturn(queue),
	};
};
