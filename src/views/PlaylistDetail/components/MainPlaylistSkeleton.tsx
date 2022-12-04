import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

export const MainPlaylistSkeleton: Component = () => {
	return (
		<div class="space-y-8">
			<Skeleton.Text extraClass="max-w-[32rem] h-6" />
			<Skeleton.Text extraClass="max-w-[12rem] h-4" />
		</div>
	);
};
