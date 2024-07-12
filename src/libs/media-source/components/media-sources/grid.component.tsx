import { Grid, Item } from "@common";
import { Show, type Accessor, type Component, type JSX } from "solid-js";
import { type IMediaSource } from "../../apis";
import { MediaSource, type MediaSourceCardProps } from "../media-source";

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

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<Grid.Col
				extraClass="gap-3 md:gap-5 pb-2 overflow-x-auto"
				minWidth={minWidth}
				items={
					!props.isLoading
						? props.mediaSourceProps
							? props.data.map(props.mediaSourceProps)
							: []
						: [...Array(7)]
				}
				cols={cols}
				maxRows={1}
			>
				{(p) => (
					<Show when={!props.isLoading} fallback={<Item.CardSkeleton />}>
						<MediaSource.Card {...p} />
					</Show>
				)}
			</Grid.Col>
		</div>
	);
};
