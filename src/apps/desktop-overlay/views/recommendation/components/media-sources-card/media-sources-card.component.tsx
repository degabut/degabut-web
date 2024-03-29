import { Text } from "@common/components";
import { Card } from "@desktop-overlay/components";
import { IMediaSource } from "@media-source/apis";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { Component } from "solid-js";

type MediaSourcesCardProps = {
	title: string;
	isLoading: boolean;
	mediaSources: IMediaSource[];
};

export const MediaSourcesCard: Component<MediaSourcesCardProps> = (props) => {
	const queue = useQueue();

	return (
		<Card>
			<div class="flex flex-col space-y-3 h-full">
				<Text.H3 class="text-center">{props.title}</Text.H3>
				<div class="grow overflow-y-auto">
					<MediaSources.List
						isLoading={props.isLoading}
						showWhenLoading
						dense
						data={props.mediaSources}
						mediaSourceProps={(mediaSource) => ({
							mediaSource,
							inQueue: queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id),
							contextMenu: MediaSourceContextMenuUtil.getContextMenu({
								mediaSource,
								queueStore: queue,
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
