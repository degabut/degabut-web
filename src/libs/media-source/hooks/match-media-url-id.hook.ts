import { SpotifyUrlUtil } from "@spotify";
import { YoutubeUrlUtil } from "@youtube";
import { createMemo, createSignal } from "solid-js";

export type MediaUrlId = {
	type: "youtubeVideoId" | "youtubePlaylistId" | "spotifyTrackId" | "spotifyAlbumId" | "spotifyPlaylistId";
	value: string;
	label: string;
};

export function useMatchMediaUrlId(defaultKeyword = "") {
	const [keyword, setKeyword] = createSignal(defaultKeyword);

	const ids = createMemo(() => {
		if (!keyword()) return [];

		const youtubeIds = YoutubeUrlUtil.extractIds(keyword());
		const spotifyIds = SpotifyUrlUtil.extractIds(keyword());

		const result: MediaUrlId[] = [];

		if (youtubeIds.videoId)
			result.push({ type: "youtubeVideoId", value: youtubeIds.videoId, label: "YouTube video" });
		if (youtubeIds.playlistId)
			result.push({ type: "youtubePlaylistId", value: youtubeIds.playlistId, label: "YouTube playlist" });
		if (spotifyIds.trackId)
			result.push({ type: "spotifyTrackId", value: spotifyIds.trackId, label: "Spotify track" });
		if (spotifyIds.albumId)
			result.push({ type: "spotifyAlbumId", value: spotifyIds.albumId, label: "Spotify album" });
		if (spotifyIds.playlistId)
			result.push({ type: "spotifyPlaylistId", value: spotifyIds.playlistId, label: "Spotify playlist" });

		return result;
	});

	return {
		ids,
		setKeyword,
	};
}
