import { type AxiosInstance } from "axios";
import { Cache } from "./cache";
import type { GoogleToken, ICacheable } from "./types";
import { GoogleTokenUtil } from "./utils";

export interface CachedVerifier extends ICacheable {
	verifier: string;
	expiresOnAccess: boolean;
}

export class Auth {
	private cache = new Cache(
		async (code) => {
			if (!code) throw new Error("Missing authorization code");

			const token = await this.exchangeCodeForToken(code);
			return GoogleTokenUtil.toCacheable(token);
		},
		async (expiring) => {
			return this.refreshCachedAccessToken(this.clientId, expiring);
		}
	);

	constructor(
		protected clientId: string,
		protected redirectUri: string,
		protected scopes: string[],
		protected axios: AxiosInstance,
		protected clientSecret: string = ""
	) {}

	public async getOrCreateAccessToken(code?: string): Promise<GoogleToken> {
		return await this.cache.getOrCreateToken(code);
	}

	public async getAccessToken(): Promise<GoogleToken | null> {
		return await this.cache.getToken();
	}

	public removeAccessToken(): void {
		this.cache.removeToken();
	}

	public async getRedirectUrl(): Promise<string> {
		const verifier = GoogleTokenUtil.generateCodeVerifier(128);
		const challenge = await GoogleTokenUtil.generateCodeChallenge(verifier);

		const singleUseVerifier: CachedVerifier = {
			verifier,
			expiresOnAccess: true,
		};
		this.cache.setVerifier(singleUseVerifier);

		return this.generateRedirectUrlForUser(this.scopes, challenge);
	}

	private async refreshCachedAccessToken(clientId: string, item: GoogleToken) {
		const params = new URLSearchParams();
		params.append("client_id", clientId);
		params.append("grant_type", "refresh_token");
		params.append("refresh_token", item.refresh_token || "");
		params.append("redirect_uri", this.redirectUri);
		this.appendClientSecret(params);

		const result = await this.axios.post("/token", params);
		if (result.status !== 200) throw new Error("Failed to refresh token");

		const updated = result.data;

		return GoogleTokenUtil.toCacheable(updated);
	}

	private async exchangeCodeForToken(input: string): Promise<GoogleToken> {
		const cachedItem = this.cache.getVerifier();
		const verifier = cachedItem?.verifier;

		if (!verifier) {
			throw new Error("No verifier found in cache. Click Authenticate again to start a new flow.");
		}

		const code = GoogleTokenUtil.extractCodeFromInput(input);
		if (!code) {
			throw new Error("No authorization code found in the pasted text. Copy the full URL from the address bar.");
		}

		const params = new URLSearchParams();
		params.append("client_id", this.clientId);
		params.append("grant_type", "authorization_code");
		params.append("code", code);
		params.append("redirect_uri", this.redirectUri);
		params.append("code_verifier", verifier);
		this.appendClientSecret(params);

		let result;
		try {
			result = await this.axios.post("/token", params);
		} catch (error) {
			const data =
				error && typeof error === "object" && "response" in error
					? (error as { response?: { data?: { error_description?: string; error?: string } } }).response?.data
					: undefined;

			const detail = data?.error_description || data?.error || "";
			throw new Error(`Failed to exchange code for token${detail ? `: ${detail}` : ""}`);
		}

		this.cache.removeVerifier();

		return result.data;
	}

	private appendClientSecret(params: URLSearchParams): void {
		if (this.clientSecret) params.append("client_secret", this.clientSecret);
	}

	private async generateRedirectUrlForUser(scopes: string[], challenge: string) {
		const scope = scopes.join(" ");

		const params = new URLSearchParams();
		params.append("client_id", this.clientId);
		params.append("redirect_uri", this.redirectUri);
		params.append("response_type", "code");
		params.append("scope", scope);
		params.append("code_challenge_method", "S256");
		params.append("code_challenge", challenge);
		params.append("access_type", "offline");
		params.append("prompt", "consent");

		return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	}
}
