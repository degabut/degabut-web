import { MaxInt, SpotifySdk, Track, TrackItem } from "../sdk";

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

export type ISpotifyPlaylist = ISpotifySimplifiedPlaylist & {
	tracks: ISpotifyTrack[];
};

export type ISpotifySimplifiedPlaylist = {
	id: string;
	name: string;
	images: ISpotifyImage[];
};

export type ISpotifyQueue = {
	currentlyPlaying: ISpotifyTrack | null;
	queue: ISpotifyTrack[];
};

export class SpotifyApi {
	constructor(private client: SpotifySdk) {}

	getPlaylist = async (id: string): Promise<ISpotifySimplifiedPlaylist | null> => {
		const playlist = await this.client.playlists.getPlaylist(id, undefined, "id,name,images");
		return playlist ? { id: playlist.id, name: playlist.name, images: playlist.images } : null;
	};

	getSelfPlaylists = async (page = 0, limit = 50): Promise<ISpotifySimplifiedPlaylist[]> => {
		const playlists = await this.client.currentUser.playlists.playlists(limit as MaxInt<50>, page * limit);
		return playlists.items;
	};

	getPlaylistTracks = async (playlistId: string, page = 0): Promise<ISpotifyTrack[]> => {
		const limit = 50;
		const tracks = await this.client.playlists.getPlaylistItems(
			playlistId,
			undefined,
			"items(track(id,name,duration_ms,album(id,name,images),artists(id,name)))",
			limit,
			page * limit
		);

		return tracks.items.map((h) => this.parseTrack(h.track));
	};

	getSavedTracks = async (page = 0, limit = 50): Promise<ISpotifyTrack[]> => {
		const tracks = await this.client.currentUser.tracks.savedTracks(limit as MaxInt<50>, page * limit);
		return tracks.items.map((h) => this.parseTrack(h.track));
	};

	getTopTracks = async (page = 0, limit = 10): Promise<ISpotifyTrack[]> => {
		const tracks = await this.client.currentUser.topItems(
			"tracks",
			"short_term",
			limit as MaxInt<50>,
			page * limit
		);
		return tracks.items.map(this.parseTrack);
	};

	getRecentlyPlayed = async (limit = 10): Promise<ISpotifyTrack[]> => {
		const tracks = await this.client.player.getRecentlyPlayedTracks(limit as MaxInt<50>);
		return tracks.items.map((h) => this.parseTrack(h.track));
	};

	getCurrentlyPlaying = async (): Promise<ISpotifyTrack | null> => {
		const track = await this.client.player.getPlaybackState();
		return this.isTrack(track.item) ? this.parseTrack(track.item) : null;
	};

	getQueue = async (): Promise<ISpotifyQueue | null> => {
		const { currently_playing, queue } = await this.client.player.getUsersQueue();
		return {
			currentlyPlaying: this.isTrack(currently_playing) ? this.parseTrack(currently_playing) : null,
			queue: queue.filter(this.isTrack).map(this.parseTrack),
		};
	};

	private isTrack = (track: TrackItem | null): track is Track => {
		return !!track && "album" in track;
	};

	private parseTrack(track: Track): ISpotifyTrack {
		return {
			album: {
				id: track.album.id,
				name: track.album.name,
				images: track.album.images,
			},
			albumId: track.album.id,
			artists: track.artists.map((a) => ({ id: a.id, name: a.name })),
			durationMs: track.duration_ms,
			id: track.id,
			name: track.name,
		};
	}
}
