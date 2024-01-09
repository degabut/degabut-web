type YoutubeIds = {
	videoId?: string;
	playlistId?: string;
};

export class YoutubeUrlUtil {
	static HOSTS = ["youtube.com", "youtu.be", "music.youtube.com"];

	static extractIds(urlString: string): YoutubeIds {
		try {
			const url = new URL(urlString);
			const host = url.host.replace(/^www\./, "");

			if (!YoutubeUrlUtil.HOSTS.includes(host)) return {};

			const videoId =
				url.searchParams.get("v") || host === "youtube.be" ? url.pathname.split("/").pop() : undefined;
			const playlistId = url.searchParams.get("list") || undefined;

			return { videoId, playlistId };
		} catch {
			return {};
		}
	}
}
