import axios, { type AxiosInstance } from "axios";
import { Auth } from "./auth";
import { PlaylistItemsEndpoint, PlaylistsEndpoint, VideosEndpoint } from "./endpoints";
import type { AuthenticationResponse, GoogleToken } from "./types";
import { GoogleTokenUtil } from "./utils";

export class YouTubeSdk {
	private static rootUrl: string = "https://www.googleapis.com/youtube/v3/";
	private static accountRootUrl: string = "https://oauth2.googleapis.com/";

	private auth: Auth;

	public httpClient: AxiosInstance;
	public authHttpClient: AxiosInstance;

	public playlists: PlaylistsEndpoint;
	public playlistItems: PlaylistItemsEndpoint;
	public videos: VideosEndpoint;

	public constructor(
		clientId: string,
		redirectUri: string,
		scopes: string[],
		apiKey: string,
		clientSecret: string = ""
	) {
		this.playlists = new PlaylistsEndpoint(this);
		this.playlistItems = new PlaylistItemsEndpoint(this);
		this.videos = new VideosEndpoint(this);

		this.httpClient = axios.create({
			baseURL: YouTubeSdk.rootUrl,
		});
		this.authHttpClient = axios.create({
			baseURL: YouTubeSdk.accountRootUrl,
		});

		this.auth = new Auth(clientId, redirectUri, scopes, this.authHttpClient, clientSecret);

		if (apiKey) {
			this.httpClient.defaults.params = { ...this.httpClient.defaults.params, key: apiKey };
		}
	}

	public async makeRequest<TReturnType>(
		method: "GET" | "POST",
		url: string,
		params?: Record<string, string | number | boolean | undefined>,
		body: unknown = undefined
	): Promise<TReturnType> {
		try {
			const accessToken = await this.auth.getAccessToken();

			const headers: Record<string, string> = {};
			if (accessToken?.access_token && !GoogleTokenUtil.isEmptyAccessToken(accessToken)) {
				headers.Authorization = `Bearer ${accessToken.access_token}`;
			}

			const result = await this.httpClient({
				method,
				url,
				params,
				headers: {
					...headers,
					...(body ? { "Content-Type": "application/json" } : {}),
				},
				data: body ? JSON.stringify(body) : undefined,
			});

			if (result.status === 204) return null as TReturnType;

			return result.data as TReturnType;
		} catch (error) {
			console.error(error);
			return null as TReturnType;
		}
	}

	public async authenticate(code?: string): Promise<AuthenticationResponse> {
		const response = await this.auth.getOrCreateAccessToken(code);

		return {
			authenticated: response.expires! > Date.now() && !GoogleTokenUtil.isEmptyAccessToken(response),
			accessToken: response,
		};
	}

	public async getRedirectUrl(): Promise<string> {
		return await this.auth.getRedirectUrl();
	}

	public async getAccessToken(): Promise<GoogleToken | null> {
		return this.auth.getAccessToken();
	}

	public logOut(): void {
		this.auth.removeAccessToken();
	}
}
