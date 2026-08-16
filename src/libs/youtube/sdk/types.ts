// Configuration types
export interface AuthenticationResponse {
	authenticated: boolean;
	accessToken: GoogleToken;
}

export interface ICacheable {
	expires?: number;
	expiresOnAccess?: boolean;
}

// Google OAuth token types
export type GoogleToken = {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	scope?: string;
} & ICacheable;

// YouTube Data API v3 response types
export type GoogleThumbnail = {
	url: string;
	width: number;
	height: number;
};

export type GoogleThumbnails = Partial<{
	default: GoogleThumbnail;
	medium: GoogleThumbnail;
	high: GoogleThumbnail;
	standard: GoogleThumbnail;
	maxres: GoogleThumbnail;
}>;

export type IGooglePlaylist = {
	id: string;
	snippet?: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails?: GoogleThumbnails;
		channelTitle: string;
	};
	contentDetails?: {
		itemCount: number;
	};
	status?: {
		privacyStatus: string;
	};
};

export type IGooglePlaylistItem = {
	id: string;
	snippet?: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails?: GoogleThumbnails;
		channelTitle: string;
		videoOwnerChannelId?: string;
		videoOwnerChannelTitle?: string;
		position: number;
		resourceId?: {
			kind: string;
			videoId: string;
		};
	};
	contentDetails?: {
		videoId: string;
		videoPublishedAt: string;
	};
};

export type IGoogleVideo = {
	id: string;
	contentDetails?: {
		duration: string; // ISO 8601 duration, e.g. "PT4M13S"
	};
};

export type IGooglePlaylistListResponse = {
	kind: string;
	nextPageToken?: string;
	items: IGooglePlaylist[];
};

export type IGooglePlaylistItemListResponse = {
	kind: string;
	nextPageToken?: string;
	items: IGooglePlaylistItem[];
};

export type IGoogleVideoListResponse = {
	kind: string;
	items: IGoogleVideo[];
};

export type IGooglePlaylistItemInsertResponse = {
	kind: string;
	id: string;
};
