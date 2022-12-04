import { VideoEmbed } from "./VideoEmbed";
import { VideoList, VideoListBig, VideoListResponsive } from "./VideoList";
import { VideoListBigSkeleton, VideoListSkeleton } from "./VideoListSkeleton";

export * from "./VideoList";
export * from "./VideoListSkeleton";

export const Video = {
	List: VideoList,
	ListBig: VideoListBig,
	ListResponsive: VideoListResponsive,
	ListSkeleton: VideoListSkeleton,
	ListBigSkeleton: VideoListBigSkeleton,
	Embed: VideoEmbed,
};
