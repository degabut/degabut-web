import { VideoCard, VideoCardSkeleton } from "./VideoCard";
import { VideoEmbed } from "./VideoEmbed";
import { VideoList, VideoListBig, VideoListBigSkeleton, VideoListResponsive, VideoListSkeleton } from "./VideoList";

export * from "./components";
export * from "./VideoCard";
export * from "./VideoList";

export const Video = {
	Card: VideoCard,
	CardSkeleton: VideoCardSkeleton,
	List: VideoList,
	ListBig: VideoListBig,
	ListResponsive: VideoListResponsive,
	ListSkeleton: VideoListSkeleton,
	ListBigSkeleton: VideoListBigSkeleton,
	Embed: VideoEmbed,
};
