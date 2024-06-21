import { Item } from "@common";
import { MediaSource, type IMediaSource } from "@media-source";
import { For, Show, type Component } from "solid-js";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	mediaSources: IMediaSource[];
	label: string;
	isLoading: boolean;
};

export const ExpandableMediaSourceList: Component<Props> = (props) => {
	return (
		<div class="space-y-6 md:space-y-4">
			<ShowMoreTitle {...props} />

			<div class="grid grid-cols-1 xl:grid-cols-2 gap-x-6 2xl:gap-x-12 3xl:gap-x-24 gap-y-2">
				<Show when={!props.isLoading} fallback={<For each={Array(10)}>{() => <Item.ListSkeleton />}</For>}>
					<For each={props.mediaSources}>
						{(mediaSource) => <MediaSource.List mediaSource={mediaSource} />}
					</For>
				</Show>
			</div>
		</div>
	);
};
