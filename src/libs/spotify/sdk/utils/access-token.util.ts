import type { AccessToken, ICacheable } from "../types";

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

	public static toCacheable(item: AccessToken): ICacheable & AccessToken {
		if (item.expires && item.expires === -1) {
			return item;
		}

		return { ...item, expires: this.calculateExpiry(item) };
	}

	public static calculateExpiry(item: AccessToken) {
		return Date.now() + item.expires_in * 1000;
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
