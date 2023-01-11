import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

export const ItemListThumbnailSkeleton: Component = () => {
	return <Skeleton.Image extraClass="h-12 w-12" />;
};

export const ItemListThumbnailBigSkeleton: Component = () => {
	return <Skeleton.Image extraClass="w-full sm:w-[16rem] aspect-video mx-auto" />;
};
