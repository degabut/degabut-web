import { Component } from "solid-js";
import { ChannelThumbnailSkeleton, VideoThumbnailBigSkeleton, VideoThumbnailSkeleton } from "./components";

export const VideoListSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full md:p-1.5">
			<VideoThumbnailSkeleton />
			<div class="flex flex-col flex-grow flex-shrink space-y-2 py-1">
				<div class="max-w-[32rem] h-4 rounded-full bg-neutral-800 animate-pulse" />
				<div class="max-w-[8rem] h-4 rounded-full bg-neutral-800 animate-pulse" />
			</div>
		</div>
	);
};

export const VideoListBigSkeleton: Component = () => {
	return (
		<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0">
			<div class="sm:w-[20rem] w-full">
				<VideoThumbnailBigSkeleton />
			</div>
			<div class="flex flex-col space-y-2 w-full px-2 py-3">
				<div class="max-w-[32rem] h-4 rounded-full bg-neutral-800 animate-pulse" />
				<div class="max-w-[8rem] h-4 rounded-full bg-neutral-800 animate-pulse" />
				<div class="flex-row-center space-x-2 text-sm">
					<ChannelThumbnailSkeleton />
					<div class="w-full max-w-[8rem] h-3 rounded-full bg-neutral-800 animate-pulse" />
				</div>
			</div>
		</div>
	);
};