import { useApp, useQueue } from "@app/hooks";
import { useApi } from "@common/hooks";
import { useNavigate } from "@solidjs/router";
import { UserApi } from "@user/apis";
import { UserConfirmationUtil } from "@user/utils/confirmation.util";
import { IVideoCompact } from "@youtube/apis";
import { Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component } from "solid-js";
import { ThumbnailHover } from "./thumbnail-hover.component";
import { ShowMoreTitle } from "./title.component";

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	isLoading: boolean;
	removable?: boolean;
	onRemove?: (video: IVideoCompact) => void;
};

export const ExpandableVideoGrid: Component<Props> = (props) => {
	const app = useApp();
	const api = useApi();
	const userApi = new UserApi(api.client);
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (video: IVideoCompact) => {
		const inQueue = queue.data.tracks?.some((t) => t.video.id === video.id);
		const contextMenu = YouTubeContextMenuUtil.getVideoContextMenu({
			appStore: app,
			queueStore: queue,
			navigate,
			video,
			modify: (items) => {
				if (props.removable) {
					items[1].push({
						label: "Remove From History",
						icon: "closeLine",
						onClick: () => {
							app.setConfirmation({
								...UserConfirmationUtil.removePlayHistoryConfirmation(video),
								onConfirm: async () => {
									await userApi.removePlayHistory(video.id);
									props.onRemove?.(video);
								},
							});
						},
					});
				}
				return items;
			},
		});

		return {
			video,
			inQueue,
			contextMenu,
			imageHoverElement: () => (
				<ThumbnailHover
					contextMenu={contextMenu}
					showAddButtons={!queue.data.empty}
					inQueue={!!inQueue}
					isPlaying={queue.data.nowPlaying?.video.id === video.id}
					onPlay={() => queue.addAndPlayTrack(video)}
					onAddToQueue={() => queue.addTrack(video)}
				/>
			),
		};
	};

	return (
		<div class="space-y-4">
			<Videos.Grid
				title={() => <ShowMoreTitle {...props} />}
				data={props.videos}
				isLoading={props.isLoading}
				videoProps={videoProps}
				skeletonCount={7}
			/>
		</div>
	);
};
