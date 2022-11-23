import { VideoList, VideoListBig, VideoListResponsive } from "./VideoList";
import { VideoListBigSkeleton, VideoListSkeleton } from "./VideoListSkeleton";

export * from "./utils";
export * from "./VideoList";
export * from "./VideoListSkeleton";

export const Video = {
	List: VideoList,
	ListBig: VideoListBig,
	ListResponsive: VideoListResponsive,
	ListSkeleton: VideoListSkeleton,
	ListBigSkeleton: VideoListBigSkeleton,
};
