import axios from "axios";
import { Cache } from "./cache";
import type { AccessToken, ICachable } from "./types";
import { AccessTokenUtil } from "./utils";

export interface CachedVerifier extends ICachable {
	verifier: string;
	expiresOnAccess: boolean;
}

export class Auth {
	private cache = new Cache(
		async () => {
			const token = await this.redirectOrVerifyToken();
			return AccessTokenUtil.toCachable(token);
		},
		async (expiring) => {
			return AccessTokenUtil.refreshCachedAccessToken(this.clientId, expiring);
		}
	);

	constructor(protected clientId: string, protected redirectUri: string, protected scopes: string[]) {}

	public async getOrCreateAccessToken(): Promise<AccessToken> {
		return await this.cache.getOrCreateToken();
	}

	public async getAccessToken(): Promise<AccessToken | null> {
		return await this.cache.getToken();
	}

	public removeAccessToken(): void {
		this.cache.removeToken();
	}

	private async redirectOrVerifyToken(): Promise<AccessToken> {
		const hashParams = new URLSearchParams(window.location.search);
		const code = hashParams.get("code");

		if (code) {
			const token = await this.verifyAndExchangeCode(code);
			this.removeCodeFromUrl();
			return token;
		}

		this.redirectToSpotify();
		return AccessTokenUtil.emptyAccessToken;
	}

	private async redirectToSpotify() {
		const verifier = AccessTokenUtil.generateCodeVerifier(128);
		const challenge = await AccessTokenUtil.generateCodeChallenge(verifier);

		const singleUseVerifier: CachedVerifier = {
			verifier,
			expiresOnAccess: true,
		};
		this.cache.setVerifier(singleUseVerifier);

		const redirectTarget = await this.generateRedirectUrlForUser(this.scopes, challenge);
		window.location.href = redirectTarget;
	}

	private async verifyAndExchangeCode(code: string) {
		const cachedItem = this.cache.getVerifier();
		const verifier = cachedItem?.verifier;

		if (!verifier) throw new Error("No verifier found in cache");

		return await this.exchangeCodeForToken(code, verifier!);
	}

	private removeCodeFromUrl() {
		const url = new URL(window.location.href);
		url.searchParams.delete("code");

		const newUrl = url.search ? url.href : url.href.replace("?", "");
		window.history.replaceState({}, document.title, newUrl);
	}

	protected async generateRedirectUrlForUser(scopes: string[], challenge: string) {
		const scope = scopes.join(" ");

		const params = new URLSearchParams();
		params.append("client_id", this.clientId);
		params.append("response_type", "code");
		params.append("redirect_uri", this.redirectUri);
		params.append("scope", scope);
		params.append("code_challenge_method", "S256");
		params.append("code_challenge", challenge);

		return `https://accounts.spotify.com/authorize?${params.toString()}`;
	}

	protected async exchangeCodeForToken(code: string, verifier: string): Promise<AccessToken> {
		const params = new URLSearchParams();
		params.append("client_id", this.clientId);
		params.append("grant_type", "authorization_code");
		params.append("code", code);
		params.append("redirect_uri", this.redirectUri);
		params.append("code_verifier", verifier!);

		const result = await axios.post("https://accounts.spotify.com/api/token", params);
		if (result.status !== 200) throw new Error("Failed to exchange code for token");

		return result.data;
	}
}
