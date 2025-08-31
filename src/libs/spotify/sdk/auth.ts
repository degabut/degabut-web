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
		async (code) => {
			const token = await this.redirectOrVerifyToken(code);
			return AccessTokenUtil.toCachable(token);
		},
		async (expiring) => {
			return AccessTokenUtil.refreshCachedAccessToken(this.clientId, expiring);
		}
	);

	constructor(protected clientId: string, protected redirectUri: string, protected scopes: string[]) {}

	public async getOrCreateAccessToken(code?: string): Promise<AccessToken> {
		return await this.cache.getOrCreateToken(code);
	}

	public async getAccessToken(): Promise<AccessToken | null> {
		return await this.cache.getToken();
	}

	public removeAccessToken(): void {
		this.cache.removeToken();
	}

	private async redirectOrVerifyToken(code?: string): Promise<AccessToken> {
		const hashParams = new URLSearchParams(window.location.search);
		const finalCode = code || hashParams.get("code");

		if (finalCode) {
			const token = await this.verifyAndExchangeCode(finalCode);
			this.removeCodeFromUrl();
			return token;
		}

		if (!code) this.redirectToSpotify();

		return AccessTokenUtil.emptyAccessToken;
	}

	public async getRedirectUrl() {
		const verifier = AccessTokenUtil.generateCodeVerifier(128);
		const challenge = await AccessTokenUtil.generateCodeChallenge(verifier);

		const singleUseVerifier: CachedVerifier = {
			verifier,
			expiresOnAccess: true,
		};
		this.cache.setVerifier(singleUseVerifier);

		return await this.generateRedirectUrlForUser(this.scopes, challenge);
	}

	private async redirectToSpotify() {
		window.location.href = await this.getRedirectUrl();
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
