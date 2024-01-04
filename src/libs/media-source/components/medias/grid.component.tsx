import { Grid, Item } from "@common/components";
import { IMediaSource } from "@media-source/apis";
import { Accessor, Component, JSX, Show, createMemo } from "solid-js";
import { MediaSource, MediaSourceCardProps } from "../media";

type MediaSourcesGridProps = {
	data: IMediaSource[];
	title?: Accessor<JSX.Element>;
	isLoading?: boolean;
	skeletonCount?: number;
	mediaSourceProps?: (data: IMediaSource) => MediaSourceCardProps;
};

export const MediaSourcesGrid: Component<MediaSourcesGridProps> = (props) => {
	const minWidth = "9.5rem";
	const cols = { "2xl": 7, xl: 6, lg: 5, xs: 7 };

	const mediaSourceProps = createMemo(() => {
		const processor = props.mediaSourceProps;
		if (!processor) return [];
		return props.data.map(processor);
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<Grid.Col
				extraClass="gap-3 md:gap-5 pb-2 overflow-x-auto snap-x"
				minWidth={minWidth}
				items={!props.isLoading ? mediaSourceProps() : [...Array(7)]}
				cols={cols}
				maxRows={1}
			>
				{(p) => (
					<Show when={!props.isLoading} fallback={<Item.CardSkeleton />}>
						<MediaSource.Card extraContainerClass="snap-center" {...p} />
					</Show>
				)}
			</Grid.Col>
		</div>
	);
};
