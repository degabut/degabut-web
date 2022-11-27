import { Video, VideoListProps } from "@components/Video";
import { useNavigate } from "solid-app-router";
import { createMemo, For, JSX, Show } from "solid-js";

type VideosListProps<Data> = {
	data: Data[];
	label?: JSX.Element;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	videoProps?: (data: Data) => VideoListProps;
};

export function VideosList<Data = unknown>(props: VideosListProps<Data>) {
	const navigate = useNavigate();

	const videoProps = createMemo(() => {
		const processor = props.videoProps;
		if (!processor) return [];
		const videos = props.data.map((d) => processor(d));
		return videos;
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.label}

			<div class="space-y-1.5">
				<Show when={props.showWhenLoading || !props.isLoading}>
					<For each={videoProps()}>
						{(props) => <Video.List onClick={() => navigate(`/app/video/${props.video.id}`)} {...props} />}
					</For>
				</Show>
				<Show when={props.isLoading}>
					<For each={Array(5)}>{() => <Video.ListSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
}
