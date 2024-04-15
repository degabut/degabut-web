import type { ISpotifyTrack } from "@spotify";
import type { IVideoCompact } from "@youtube";
import { MediaSourceTypes, type IMediaSource } from "../apis";

export class MediaSourceFactory {
	static fromYoutubeVideo(video: IVideoCompact) {
		const media: IMediaSource = {
			...video,
			id: `youtube/${video.id}`,
			creator: video.channel?.name || "",
			maxThumbnailUrl: video.thumbnails.at(-1)?.url || "",
			minThumbnailUrl: video.thumbnails.at(0)?.url || "",
			type: MediaSourceTypes.Youtube,
			url: `https://youtu.be/${video.id}`,
			sourceId: video.id,
			playedYoutubeVideoId: video.id,
		};

		return media;
	}

	static fromSpotifyTrack(track: ISpotifyTrack) {
		const media: IMediaSource = {
			...track,
			id: `spotify/${track.id}`,
			title: track.name,
			duration: Math.round(track.durationMs / 1000),
			creator: track.artists.map((a) => a.name).join(", "),
			maxThumbnailUrl: track.album?.images.at(0)?.url || "",
			minThumbnailUrl: track.album?.images.at(-1)?.url || "",
			type: MediaSourceTypes.Spotify,
			url: `https://open.spotify.com/track/${track.id}`,
			sourceId: track.id,
			playedYoutubeVideoId: track.id,
		};

		return media;
	}
}
