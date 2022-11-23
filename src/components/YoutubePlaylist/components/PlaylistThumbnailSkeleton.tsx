import { Component } from "solid-js";

export const PlaylistThumbnailSkeleton: Component = () => {
	return <div class="h-12 w-12 bg-neutral-800 animate-pulse" />;
};

export const PlaylistThumbnailBigSkeleton: Component = () => {
	return <div class="w-full sm:h-[10rem] h-[14rem] mx-auto bg-neutral-800 animate-pulse" />;
};
