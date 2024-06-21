import type { Component } from "solid-js";
import { Skeleton } from "../../";
import "../item.css";
import { type ItemListSize } from "./item-list.component";

type ItemListSkeletonProps = {
	size?: ItemListSize;
};

export const ItemListImageSkeleton: Component<ItemListSkeletonProps> = (props) => {
	return (
		<Skeleton.Image
			extraClassList={{
				"item-image": !props.size || props.size === "md",
				"item-image-lg": props.size === "lg",
			}}
		/>
	);
};

export const ItemListSkeleton: Component<ItemListSkeletonProps> = (props) => {
	return (
		<div class="flex-row-center space-x-1.5 md:space-x-3 w-full p-1.5">
			<ItemListImageSkeleton {...props} />
			<div class="flex flex-col grow shrink space-y-2 py-1">
				<Skeleton.Text extraClass="max-w-[32rem] h-4" />
				<Skeleton.Text extraClass="max-w-[8rem] h-3" />
			</div>
		</div>
	);
};
