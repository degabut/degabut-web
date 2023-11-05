import { VideoCard } from "./video-card.component";
import { VideoEmbed } from "./video-embed.component";
import { VideoList, VideoListBig, VideoListResponsive } from "./video-list.component";

export * from "./video-card.component";
export * from "./video-list.component";

export const Video = {
	List: VideoList,
	ListBig: VideoListBig,
	ListResponsive: VideoListResponsive,
	Card: VideoCard,
	Embed: VideoEmbed,
};
