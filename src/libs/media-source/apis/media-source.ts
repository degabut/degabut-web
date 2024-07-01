import type { ISpotifyTrack } from "@spotify";
import type { IVideoCompact } from "@youtube";

export enum MediaSourceTypes {
	Youtube = "youtube",
	Spotify = "spotify",
}

export type IMediaSourceImage = {
	url: string;
	width: number;
	height: number;
};

export type IMediaSource = {
	id: string;
	sourceId: string;
	url: string;
	title: string;
	creator: string;
	duration: number;
	images: IMediaSourceImage[];
	maxThumbnailUrl: string;
	minThumbnailUrl: string;
	playedYoutubeVideoId: string | null;
	type: MediaSourceTypes;
	youtubeVideoId?: string;
	youtubeVideo?: IVideoCompact;
	spotifyTrackId?: string;
	spotifyTrack?: ISpotifyTrack;
};
