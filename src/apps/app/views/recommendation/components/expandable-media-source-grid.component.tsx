import { useApp } from "@app/hooks";
import { useApi } from "@common/hooks";
import { IMediaSource } from "@media-source/apis";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { UserApi } from "@user/apis";
import { UserConfirmationUtil } from "@user/utils/confirmation.util";
import { Component } from "solid-js";
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
	const navigate = useNavigate();

	const mediaSourceProps = (mediaSource: IMediaSource) => {
		const inQueue = queue.data.tracks?.some((t) => t.mediaSource.id === mediaSource.id);
		const contextMenu = MediaSourceContextMenuUtil.getContextMenu({
			appStore: app,
			queueStore: queue,
			navigate,
			mediaSource,
			modify: (items) => {
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
		});

		return {
			mediaSource,
			inQueue,
			contextMenu,
			imageHoverElement: () => (
				<ThumbnailHover
					contextMenu={contextMenu}
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
		<div class="space-y-4">
			<MediaSources.Grid
				title={() => <ShowMoreTitle {...props} />}
				data={props.mediaSources}
				isLoading={props.isLoading}
				mediaSourceProps={mediaSourceProps}
				skeletonCount={7}
			/>
		</div>
	);
};
