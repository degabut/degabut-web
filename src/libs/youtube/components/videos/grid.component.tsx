import { Grid, Item } from "@common/components";
import { IVideoCompact } from "@youtube/apis";
import { Accessor, Component, JSX, Show, createMemo } from "solid-js";
import { Video, VideoCardProps } from "../video";

type VideosGridProps = {
	data: IVideoCompact[];
	title?: Accessor<JSX.Element>;
	isLoading?: boolean;
	skeletonCount?: number;
	videoProps?: (data: IVideoCompact) => VideoCardProps;
};

export const VideosGrid: Component<VideosGridProps> = (props) => {
	const minWidth = "9.5rem";
	const cols = { "2xl": 7, xl: 6, lg: 5, xs: 7 };

	const videoProps = createMemo(() => {
		const processor = props.videoProps;
		if (!processor) return [];
		return props.data.map(processor);
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<Grid.Col
				extraClass="gap-3 md:gap-5 pb-2 overflow-x-auto snap-x"
				minWidth={minWidth}
				items={!props.isLoading ? videoProps() : [...Array(7)]}
				cols={cols}
				maxRows={1}
			>
				{(p) => (
					<Show when={!props.isLoading} fallback={<Item.CardSkeleton />}>
						<Video.Card extraContainerClass="snap-center" {...p} />
					</Show>
				)}
			</Grid.Col>
		</div>
	);
};
