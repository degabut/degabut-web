import { Text } from "@common/components";
import { Card } from "@desktop-overlay/components";
import { useQueue } from "@queue/hooks";
import { IVideoCompact } from "@youtube/apis";
import { Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component } from "solid-js";

type VideosCardProps = {
	title: string;
	isLoading: boolean;
	videos: IVideoCompact[];
};

export const VideosCard: Component<VideosCardProps> = (props) => {
	const queue = useQueue();

	return (
		<Card>
			<div class="flex flex-col space-y-3 h-full">
				<Text.H3 class="text-center">{props.title}</Text.H3>
				<div class="grow overflow-y-auto">
					<Videos.List
						isLoading={props.isLoading}
						showWhenLoading
						dense
						data={props.videos}
						videoProps={(video) => ({
							video,
							inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
							contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
								queueStore: queue,
								video,
								modify: (c) => {
									if (queue.data.empty) return [];
									return [c[0]];
								},
							}),
						})}
					/>
				</div>
			</div>
		</Card>
	);
};
