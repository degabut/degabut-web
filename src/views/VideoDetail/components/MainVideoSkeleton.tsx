import { Skeleton } from "@components/atoms";
import { ChannelThumbnailSkeleton } from "@components/molecules";
import { Component } from "solid-js";

export const MainVideoSkeleton: Component = () => {
	return (
		<div class="flex flex-col space-y-6">
			<Skeleton.Image extraClass="w-full aspect-video mx-auto" />

			<div class="flex flex-col grow space-y-5 shrink truncate">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />

				<div class="space-y-2">
					<Skeleton.Text extraClass="max-w-[8rem] h-3" />

					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnailSkeleton />
						<Skeleton.Text extraClass="w-full max-w-[8rem] h-3" />
					</div>
				</div>
			</div>
		</div>
	);
};
