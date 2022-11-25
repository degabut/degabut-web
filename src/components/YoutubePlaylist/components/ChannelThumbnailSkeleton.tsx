import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

export const ChannelThumbnailSkeleton: Component = () => {
	return <Skeleton.Image rounded extraClass="w-8 h-8" />;
};
