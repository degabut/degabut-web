import { Component } from "solid-js";

export const VideoThumbnailSkeleton: Component = () => {
	return <div class="h-12 w-12 bg-neutral-800 rounded animate-pulse" />;
};

export const VideoThumbnailBigSkeleton: Component = () => {
	return <div class="w-full sm:w-[16rem] aspect-video mx-auto bg-neutral-800 rounded animate-pulse" />;
};
