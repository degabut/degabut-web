import { VideoEmbed } from "./VideoEmbed";
import { VideoList, VideoListBig, VideoListBigSkeleton, VideoListResponsive, VideoListSkeleton } from "./VideoList";

export * from "./components";
export * from "./VideoList";

export const Video = {
	List: VideoList,
	ListBig: VideoListBig,
	ListResponsive: VideoListResponsive,
	ListSkeleton: VideoListSkeleton,
	ListBigSkeleton: VideoListBigSkeleton,
	Embed: VideoEmbed,
};
