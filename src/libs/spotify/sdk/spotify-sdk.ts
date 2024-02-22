import axios from "axios";
import { Auth, isEmptyAccessToken } from "./auth";
import {
	AlbumsEndpoint,
	ArtistsEndpoint,
	AudiobooksEndpoint,
	BrowseEndpoint,
	ChaptersEndpoint,
	CurrentUserEndpoint,
	EpisodesEndpoint,
	MarketsEndpoint,
	PlayerEndpoint,
	PlaylistsEndpoint,
	RecommendationsEndpoint,
	SearchEndpoint,
	SearchExecutionFunction,
	ShowsEndpoint,
	TracksEndpoint,
	UsersEndpoint,
} from "./endpoints";
import type { AccessToken, AuthenticationResponse } from "./types";

export class SpotifySdk {
	private static rootUrl: string = "https://api.spotify.com/v1/";

	private auth: Auth;

	public albums: AlbumsEndpoint;
	public artists: ArtistsEndpoint;
	public audiobooks: AudiobooksEndpoint;
	public browse: BrowseEndpoint;
	public chapters: ChaptersEndpoint;
	public episodes: EpisodesEndpoint;
	public recommendations: RecommendationsEndpoint;
	public markets: MarketsEndpoint;
	public player: PlayerEndpoint;
	public playlists: PlaylistsEndpoint;
	public shows: ShowsEndpoint;
	public tracks: TracksEndpoint;
	public users: UsersEndpoint;
	public search: SearchExecutionFunction;
	public currentUser: CurrentUserEndpoint;

	public constructor(clientId: string, redirectUri: string, scopes: string[]) {
		this.albums = new AlbumsEndpoint(this);
		this.artists = new ArtistsEndpoint(this);
		this.audiobooks = new AudiobooksEndpoint(this);
		this.browse = new BrowseEndpoint(this);
		this.chapters = new ChaptersEndpoint(this);
		this.episodes = new EpisodesEndpoint(this);
		this.recommendations = new RecommendationsEndpoint(this);
		this.markets = new MarketsEndpoint(this);
		this.player = new PlayerEndpoint(this);
		this.playlists = new PlaylistsEndpoint(this);
		this.shows = new ShowsEndpoint(this);
		this.tracks = new TracksEndpoint(this);
		this.users = new UsersEndpoint(this);
		this.currentUser = new CurrentUserEndpoint(this);

		const search = new SearchEndpoint(this);
		this.search = search.execute.bind(search);

		this.auth = new Auth(clientId, redirectUri, scopes);
	}

	public async makeRequest<TReturnType>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		url: string,
		body: unknown = undefined
	): Promise<TReturnType> {
		try {
			const accessToken = await this.auth.getOrCreateAccessToken();
			if (isEmptyAccessToken(accessToken)) {
				console.warn("No access token found, authenticating now.");
				return null as TReturnType;
			}

			const token = accessToken?.access_token;
			const fullUrl = SpotifySdk.rootUrl + url;

			const result = await axios({
				method,
				url: fullUrl,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
			});

			if (result.status === 204) return null as TReturnType;

			return result.data as TReturnType;
		} catch (error) {
			console.error(error);
			return null as TReturnType;
		}
	}

	/**
	 * Use this when you're running in a browser and you want to control when first authentication+redirect happens.
	 */
	public async authenticate(): Promise<AuthenticationResponse> {
		const response = await this.auth.getOrCreateAccessToken(); // trigger any redirects

		return {
			authenticated: response.expires! > Date.now() && !isEmptyAccessToken(response),
			accessToken: response,
		};
	}

	/**
	 * @returns the current access token. null implies the SpotifyApi is not yet authenticated.
	 */
	public async getAccessToken(): Promise<AccessToken | null> {
		return this.auth.getAccessToken();
	}

	/**
	 * Removes the access token if it exists.
	 */
	public logOut(): void {
		this.auth.removeAccessToken();
	}
}
