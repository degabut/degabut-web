import { useApp } from "@app/hooks";
import { Item } from "@common/components";
import { IMediaSource } from "@media-source/apis";
import { MediaSource } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	mediaSources: IMediaSource[];
	label: string;
	isLoading: boolean;
};

export const ExpandableMediaSourceList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="space-y-6 md:space-y-4">
			<ShowMoreTitle {...props} />

			<div class="grid grid-cols-1 xl:grid-cols-2 gap-x-6 2xl:gap-x-12 3xl:gap-x-24 gap-y-2">
				<Show when={!props.isLoading} fallback={<For each={Array(10)}>{() => <Item.ListSkeleton />}</For>}>
					<For each={props.mediaSources}>
						{(mediaSource) => (
							<MediaSource.List
								mediaSource={mediaSource}
								inQueue={queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id)}
								contextMenu={MediaSourceContextMenuUtil.getContextMenu({
									appStore: app,
									queueStore: queue,
									navigate,
									mediaSource,
								})}
							/>
						)}
					</For>
				</Show>
			</div>
		</div>
	);
};
