import { Grid } from "@components/Grid";
import { Video, VideoListProps } from "@components/Video";
import { useNavigate } from "solid-app-router";
import { createMemo, JSX, Show } from "solid-js";

type VideosGridProps<Data> = {
	data: Data[];
	title?: JSX.Element;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	skeletonCount?: number;
	videoProps?: (data: Data) => VideoListProps;
};

export function VideosGrid<Data = unknown>(props: VideosGridProps<Data>) {
	const navigate = useNavigate();

	const minWidth = "10rem";
	const cols = { "2xl": 7, xl: 6, lg: 5, xs: 7 };

	const videoProps = createMemo(() => {
		const processor = props.videoProps;
		if (!processor) return [];
		const videos = props.data.map((d) => processor(d));
		return videos;
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title}

			<div class="space-y-1.5">
				<Show when={props.showWhenLoading || !props.isLoading}>
					<Grid.Col
						extraClass="gap-2 md:gap-4 pb-2 overflow-x-auto snap-x"
						minWidth={minWidth}
						items={videoProps()}
						cols={cols}
						maxRows={1}
					>
						{(props) => (
							<Video.Card
								extraContainerClass="snap-center"
								onClick={() => navigate(`/app/video/${props.video.id}`)}
								{...props}
							/>
						)}
					</Grid.Col>
				</Show>

				<Show when={props.isLoading}>
					<Grid.Col
						cols={cols}
						minWidth={minWidth}
						items={[...Array(7)]}
						extraClass="gap-2 md:gap-4 pb-2 overflow-hidden"
					>
						<Video.CardSkeleton />
					</Grid.Col>
				</Show>
			</div>
		</div>
	);
}
