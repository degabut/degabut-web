import { Component } from "solid-js";

export const MainPlaylistSkeleton: Component = () => {
	return (
		<div class="space-y-8">
			<div class="max-w-[32rem] h-6 rounded-full bg-neutral-700 animate-pulse" />
			<div class="max-w-[12rem] h-4 rounded-full bg-neutral-700 animate-pulse" />
		</div>
	);
};
