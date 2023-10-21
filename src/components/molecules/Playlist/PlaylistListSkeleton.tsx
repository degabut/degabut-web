import { Skeleton } from "@components/atoms";
import { Component } from "solid-js";

export const PlaylistListSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full p-1.5">
			<Skeleton.Image extraClass="h-12 w-12" />
			<div class="flex flex-col grow shrink space-y-2 py-1">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />
				<Skeleton.Text extraClass="max-w-[8rem] h-3" />
			</div>
		</div>
	);
};
