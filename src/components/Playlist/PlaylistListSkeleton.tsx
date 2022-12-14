import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

export const PlaylistListSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full h-[3.625rem] md:pr-2 bg-white/5 animate-pulse rounded cursor-pointer">
			<div class="flex flex-col grow shrink space-y-0.5 py-1.5 px-3 truncate">
				<div class="flex flex-col grow shrink space-y-2 py-1">
					<Skeleton.Text extraClass="max-w-[32rem] h-4" />
					<Skeleton.Text extraClass="max-w-[8rem] h-4" />
				</div>
			</div>
		</div>
	);
};
