import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";
import { ChannelThumbnailSkeleton, PlaylistThumbnailBigSkeleton, PlaylistThumbnailSkeleton } from "./components";

export const YouTubePlaylistListSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full md:p-1.5">
			<PlaylistThumbnailSkeleton />
			<div class="flex flex-col flex-grow flex-shrink space-y-2 py-1">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />
				<Skeleton.Text extraClass="max-w-[8rem] h-4" />
			</div>
		</div>
	);
};

export const YouTubePlaylistListBigSkeleton: Component = () => {
	return (
		<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0">
			<div class="sm:w-[20rem] w-full">
				<PlaylistThumbnailBigSkeleton />
			</div>
			<div class="flex flex-col space-y-4 w-full px-2 py-3">
				<Skeleton.Text extraClass="max-w-[32rem] h-5 " />
				<div class="flex flex-col space-y-1">
					<Skeleton.Text extraClass="max-w-[8rem] h-4" />
					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnailSkeleton />
						<Skeleton.Text extraClass="w-full max-w-[8rem] h-4" />
					</div>
				</div>
			</div>
		</div>
	);
};
