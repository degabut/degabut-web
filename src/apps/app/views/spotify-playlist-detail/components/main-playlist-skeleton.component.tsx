import { Skeleton } from "@common";
import type { Component } from "solid-js";

export const MainPlaylistSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-4">
			<Skeleton.Image extraClass="h-24 aspect-square" />
			<div class="space-y-8 w-full">
				<Skeleton.Text extraClass="max-w-[32rem] h-6" />
				<Skeleton.Text extraClass="max-w-[12rem] h-4" />
			</div>
		</div>
	);
};
