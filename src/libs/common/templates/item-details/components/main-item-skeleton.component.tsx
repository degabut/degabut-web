import { Skeleton } from "@common";
import type { Component } from "solid-js";

export const MainItemSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-4">
			<Skeleton.Image extraClass="w-24 md:w-32 aspect-square shrink-0" />
			<div class="space-y-8 w-full">
				<Skeleton.Text extraClass="max-w-[32rem] h-6" />
				<Skeleton.Text extraClass="max-w-[12rem] h-4" />
			</div>
		</div>
	);
};
