import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

export const PlaylistThumbnailSkeleton: Component = () => {
	return <Skeleton.Image extraClass="h-12 w-12" />;
};

export const PlaylistThumbnailBigSkeleton: Component = () => {
	return <Skeleton.Image extraClass="w-full sm:h-[10rem] h-[14rem] mx-auto" />;
};
