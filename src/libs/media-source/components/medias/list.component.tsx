import { Item } from "@common/components";
import { Accessor, For, JSX, Show, createMemo } from "solid-js";
import { MediaSource, MediaSourceListProps } from "../media";

type MediaSourcesListProps<Data> = {
	data: Data[];
	dense?: boolean;
	title?: Accessor<JSX.Element>;
	isLoading?: boolean;
	showWhenLoading?: boolean;
	skeletonCount?: number;
	mediaSourceProps?: (data: Data) => MediaSourceListProps;
};

export function MediaSourcesList<Data = unknown>(props: MediaSourcesListProps<Data>) {
	const mediaSourceProps = createMemo(() => {
		const processor = props.mediaSourceProps;
		if (!processor) return [];
		return props.data.map(processor);
	});

	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<div
				classList={{
					"space-y-2": !props.dense,
					"space-y-0.5": props.dense,
				}}
			>
				<Show when={props.showWhenLoading || !props.isLoading}>
					<For each={mediaSourceProps()}>{(p) => <MediaSource.List {...p} />}</For>
				</Show>
				<Show when={props.isLoading}>
					<For each={Array(props.skeletonCount || 5)}>{() => <Item.ListSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
}
