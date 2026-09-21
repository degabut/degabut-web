import { DISCORD_ACTIVITY_URL_MAPPINGS } from "@constants";
import { PatchUrlUtil } from "@discord";

export class YouTubeIframeUtil {
	static ORIGIN = "https://www.youtube.com";
	static API_URL = `${YouTubeIframeUtil.ORIGIN}/iframe_api`;
	static EMBED_URL = `${YouTubeIframeUtil.ORIGIN}/embed`;

	static rewriteUrl(url: string): string {
		if (!DISCORD_ACTIVITY_URL_MAPPINGS.length) return url;
		return PatchUrlUtil.rewriteString(url, DISCORD_ACTIVITY_URL_MAPPINGS);
	}

	static getApiUrl(): string {
		return YouTubeIframeUtil.rewriteUrl(YouTubeIframeUtil.API_URL);
	}

	static getEmbedUrl(videoId: string, params?: URLSearchParams): string {
		const query = params?.toString();
		return YouTubeIframeUtil.rewriteUrl(`${YouTubeIframeUtil.EMBED_URL}/${videoId}${query ? `?${query}` : ""}`);
	}

	static loadApi() {
		const tag = document.createElement("script");

		tag.src = YouTubeIframeUtil.getApiUrl();
		const firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
	}
}
