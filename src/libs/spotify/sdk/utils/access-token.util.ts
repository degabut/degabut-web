import axios from "axios";
import type { AccessToken, ICachable } from "../types";

export class AccessTokenUtil {
	public static emptyAccessToken: AccessToken = {
		access_token: "emptyAccessToken",
		token_type: "",
		expires_in: 0,
		refresh_token: "",
		expires: -1,
	};

	public static isEmptyAccessToken(value: unknown): boolean {
		return value === this.emptyAccessToken;
	}

	public static async refreshCachedAccessToken(clientId: string, item: AccessToken) {
		const updated = await AccessTokenUtil.refreshToken(clientId, item.refresh_token);
		return AccessTokenUtil.toCachable(updated);
	}

	public static toCachable(item: AccessToken): ICachable & AccessToken {
		if (item.expires && item.expires === -1) {
			return item;
		}

		return { ...item, expires: this.calculateExpiry(item) };
	}

	public static calculateExpiry(item: AccessToken) {
		return Date.now() + item.expires_in * 1000;
	}

	private static async refreshToken(clientId: string, refreshToken: string): Promise<AccessToken> {
		const params = new URLSearchParams();
		params.append("client_id", clientId);
		params.append("grant_type", "refresh_token");
		params.append("refresh_token", refreshToken);

		const result = await axios.post("https://accounts.spotify.com/api/token", params);
		if (result.status !== 200) throw new Error("Failed to refresh token");

		return result.data;
	}

	public static generateCodeVerifier(length: number) {
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	public static async generateCodeChallenge(codeVerifier: string) {
		const data = new TextEncoder().encode(codeVerifier);
		const digest = await window.crypto.subtle.digest("SHA-256", data);

		const digestBytes = [...new Uint8Array(digest)];
		const hasBuffer = typeof Buffer !== "undefined";

		const digestAsBase64 = hasBuffer
			? Buffer.from(digest).toString("base64")
			: btoa(String.fromCharCode.apply(null, digestBytes));

		return digestAsBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}
}
