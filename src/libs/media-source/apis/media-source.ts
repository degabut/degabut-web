import { ISpotifyTrack } from "@spotify/apis";
import { IVideoCompact } from "@youtube/apis";

export enum MediaSourceTypes {
	Youtube = "youtube",
	Spotify = "spotify",
}

export type IMediaSource = {
	id: string;
	sourceId: string;
	url: string;
	title: string;
	creator: string;
	duration: number;
	maxThumbnailUrl: string;
	minThumbnailUrl: string;
	playedYoutubeVideoId: string | null;
	type: MediaSourceTypes;
	youtubeVideoId?: string;
	youtubeVideo?: IVideoCompact;
	spotifyTrackId?: string;
	spotifyTrack?: ISpotifyTrack;
};
