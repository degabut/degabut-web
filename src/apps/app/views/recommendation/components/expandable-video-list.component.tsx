import { useApp } from "@app/hooks";
import { Item } from "@common/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact } from "@youtube/apis";
import { Video } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, For, Show } from "solid-js";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	isLoading: boolean;
};

export const ExpandableVideoList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="space-y-6 md:space-y-4">
			<ShowMoreTitle {...props} />

			<div class="grid grid-cols-1 2xl:grid-cols-2 2xl:gap-x-12 3xl:gap-x-24 gap-y-2">
				<Show when={!props.isLoading} fallback={<For each={Array(10)}>{() => <Item.ListSkeleton />}</For>}>
					<For each={props.videos}>
						{(video) => (
							<Video.List
								video={video}
								inQueue={queue.data.tracks?.some((t) => t.video.id === video.id)}
								contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
									appStore: app,
									queueStore: queue,
									navigate,
									video,
								})}
							/>
						)}
					</For>
				</Show>
			</div>
		</div>
	);
};
