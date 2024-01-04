export type ISpotifyImage = {
	height: number;
	url: string;
	width: number;
};

export type ISpotifyAlbum = {
	id: string;
	name: string;
	images: ISpotifyImage[];
};

export type ISpotifyArtist = {
	id: string;
	name: string;
};

export type ISpotifyTrack = {
	id: string;
	name: string;
	durationMs: number;
	albumId: string;
	album: ISpotifyAlbum;
	artists: ISpotifyArtist[];
};

export type ISpotifyPlaylist = {
	id: string;
	name: string;
	images: ISpotifyImage[];
	tracks: ISpotifyTrack[];
};
