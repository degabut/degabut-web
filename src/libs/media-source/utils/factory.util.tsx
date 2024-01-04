import { IMediaSource, MediaSourceTypes } from "@media-source/apis";
import { IVideoCompact } from "@youtube/apis";

export class MediaSourceFactory {
	static fromYoutubeVideo(video: IVideoCompact) {
		const media: IMediaSource = {
			...video,
			id: `youtube/${video.id}`,
			creator: video.channel?.name || "",
			maxThumbnailUrl: video.thumbnails.at(-1)?.url || "",
			minThumbnailUrl: video.thumbnails.at(0)?.url || "",
			type: MediaSourceTypes.Youtube,
			url: `https://youtu.be/${video.id}`,
			sourceId: video.id,
			playedYoutubeVideoId: video.id,
		};

		return media;
	}
}
