import { Item } from "@common/components";
import { Accessor, For, JSX, Show, createMemo } from "solid-js";
import { Video, VideoListProps } from "../video";

type VideosListProps<Data> = {
	data: Data[];
	title?: Accessor<JSX.Element>;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	skeletonCount?: number;
	videoProps?: (data: Data) => VideoListProps;
};

export function VideosList<Data = unknown>(props: VideosListProps<Data>) {
	const videoProps = createMemo(() => {
		const processor = props.videoProps;
		if (!processor) return [];
		return props.data.map(processor);
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<div class="space-y-2">
				<Show when={props.showWhenLoading || !props.isLoading}>
					<For each={videoProps()}>{(p) => <Video.List {...p} />}</For>
				</Show>
				<Show when={props.isLoading}>
					<For each={Array(props.skeletonCount || 5)}>{() => <Item.ListSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
}
