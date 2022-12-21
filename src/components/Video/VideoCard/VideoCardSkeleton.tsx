import { Skeleton } from "@components/Skeleton";
import { Component } from "solid-js";

type Props = {
	extraContainerClass?: string;
};

export const VideoCardSkeleton: Component<Props> = (props) => {
	return (
		<div
			class="flex flex-col space-y-2"
			classList={{
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
		>
			<Skeleton.Image extraClass="w-full aspect-square" />
			<div class="py-1">
				<Skeleton.Text extraClass="w-full h-4" />
			</div>
			<div class="py-0.5">
				<Skeleton.Text extraClass="w-[50%] h-3" />
			</div>
			<Skeleton.Text extraClass="w-[25%] h-3" />
		</div>
	);
};
