import { Video, VideoListProps } from "@components/Video";
import { useNavigate } from "solid-app-router";
import { createMemo, For, JSX, Show } from "solid-js";

type DoubleVideosListProps<Data> = {
	data: Data[];
	label?: JSX.Element;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	videoProps: (data: Data) => VideoListProps;
};

export function DoubleVideosList<Data = unknown>(props: DoubleVideosListProps<Data>) {
	const navigate = useNavigate();

	const videoProps = createMemo(() => {
		const videos = props.data.map((d) => props.videoProps(d));
		return videos;
	});

	return (
		<div class="space-y-4">
			{props.label}

			<div class="grid grid-cols-1 2xl:grid-cols-2 2xl:gap-x-12 3xl:gap-x-24 gap-y-1.5">
				<Show
					when={props.showWhenLoading || !props.isLoading}
					fallback={<For each={Array(10)}>{() => <Video.ListSkeleton />}</For>}
				>
					<For each={videoProps()}>
						{(props) => <Video.List {...props} onClick={() => navigate(`/app/video/${props.video.id}`)} />}
					</For>
				</Show>
			</div>
		</div>
	);
}
