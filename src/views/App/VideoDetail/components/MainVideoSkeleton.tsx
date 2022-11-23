import { ChannelThumbnailSkeleton } from "@components/Video/components";
import { Component } from "solid-js";

export const MainVideoSkeleton: Component = () => {
	return (
		<div class="flex flex-col space-y-6">
			<div class="w-full aspect-video mx-auto bg-neutral-800 rounded animate-pulse" />

			<div class="flex flex-col flex-grow space-y-5 flex-shrink truncate">
				<div class="max-w-[32rem] h-4 rounded-full bg-neutral-800 animate-pulse" />

				<div class="space-y-2">
					<div class="max-w-[8rem] h-3 rounded-full bg-neutral-800 animate-pulse" />

					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnailSkeleton />
						<div class="w-full max-w-[8rem] h-3 rounded-full bg-neutral-800 animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
};
