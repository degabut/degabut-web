import { Item } from "@common";
import { For, Show, type Accessor, type JSX } from "solid-js";
import { MediaSource, type MediaSourceListProps } from "../media-source";

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
	return (
		<div class="space-y-6 md:space-y-4">
			{props.title?.()}

			<div
				classList={{
					"space-y-2": !props.dense,
					"space-y-0.5": props.dense,
				}}
			>
				<Show when={(props.showWhenLoading || !props.isLoading) && props.mediaSourceProps}>
					<For each={props.data}>{(p) => <MediaSource.List {...props.mediaSourceProps!(p)} />}</For>
				</Show>
				<Show when={props.isLoading}>
					<For each={Array(props.skeletonCount || 5)}>{() => <Item.ListSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
}
