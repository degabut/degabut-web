import type { Component } from "solid-js";
import { Skeleton } from "../../";

export const ItemListImageSkeleton: Component = () => {
	return <Skeleton.Image extraClass="h-12 w-12" />;
};

export const ItemListImageBigSkeleton: Component = () => {
	return <Skeleton.Image extraClass="w-full sm:w-[16rem] aspect-video mx-auto" />;
};

export const ItemListSkeleton: Component = () => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full p-1.5">
			<ItemListImageSkeleton />
			<div class="flex flex-col grow shrink space-y-2 py-1">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />
				<Skeleton.Text extraClass="max-w-[8rem] h-3" />
			</div>
		</div>
	);
};

export const ItemListBigSkeleton: Component = () => {
	return (
		<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0">
			<div class="sm:w-[20rem] w-full">
				<ItemListImageBigSkeleton />
			</div>
			<div class="flex flex-col space-y-2 w-full px-2 py-3">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />
				<Skeleton.Text extraClass="max-w-[8rem] h-4" />
				<div class="flex-row-center space-x-2 text-sm">
					<Skeleton.Text extraClass="w-full max-w-[8rem] h-3" />
				</div>
			</div>
		</div>
	);
};
