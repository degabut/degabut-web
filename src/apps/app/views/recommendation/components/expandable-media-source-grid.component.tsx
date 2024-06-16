import { useApp } from "@app/hooks";
import { useApi, type IContextMenuItem } from "@common";
import { MediaSources, type IMediaSource, type MediaSourceCardProps } from "@media-source";
import { useQueue } from "@queue";
import { UserApi, UserConfirmationUtil } from "@user";
import type { Component } from "solid-js";
import { ThumbnailHover } from "./thumbnail-hover.component";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	mediaSources: IMediaSource[];
	label: string;
	isLoading: boolean;
	removable?: boolean;
	onRemove?: (media: IMediaSource) => void;
};

export const ExpandableMediaSourceGrid: Component<Props> = (props) => {
	const app = useApp();
	const api = useApi();
	const userApi = new UserApi(api.client);
	const queue = useQueue();

	const mediaSourceProps = (mediaSource: IMediaSource): MediaSourceCardProps => {
		const inQueue = queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id);
		const contextMenu = {
			modify: (items: IContextMenuItem[][]) => {
				if (props.removable) {
					items[items.length - 2].push({
						label: "Remove From History",
						icon: "closeLine",
						onClick: () => {
							app.setConfirmation({
								...UserConfirmationUtil.removePlayHistoryConfirmation(mediaSource),
								onConfirm: async () => {
									await userApi.removePlayHistory(mediaSource.id);
									props.onRemove?.(mediaSource);
								},
							});
						},
					});
				}
				return items;
			},
		};

		return {
			mediaSource,
			inQueue,
			contextMenu,
			imageHoverElement: () => (
				<ThumbnailHover
					mediaSource={mediaSource}
					showAddButtons={!queue.data.empty}
					inQueue={!!inQueue}
					isPlaying={queue.data.nowPlaying?.mediaSource.id === mediaSource.id}
					onPlay={() => queue.addAndPlayTrack(mediaSource)}
					onAddToQueue={() => queue.addTrack(mediaSource)}
				/>
			),
		};
	};

	return (
		<MediaSources.Grid
			title={() => <ShowMoreTitle {...props} />}
			data={props.mediaSources}
			isLoading={props.isLoading}
			mediaSourceProps={mediaSourceProps}
			skeletonCount={7}
		/>
	);
};
