import { IVideoCompact } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { Videos } from "@components/Videos";
import { useApi } from "@hooks/useApi";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { removePlayHistoryConfirmation } from "@utils/confirmation";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component } from "solid-js";
import { ThumbnailHover } from "./ThumbnailHover";
import { ShowMoreTitle } from "./Title";

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
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (video: IVideoCompact) => {
		const inQueue = queue.data.tracks?.some((t) => t.video.id === video.id);
		const contextMenu = getVideoContextMenu({
			appStore: app,
			queueStore: queue,
			navigate,
			video,
			modifyContextMenuItems: (items) => {
				if (props.removable) {
					items[0].push({
						element: () => <ContextMenuItem label="Remove From History" icon="closeLine" />,
						onClick: () => promptRemoveVideo(video),
					});
				}
				return items;
			},
		});

		return {
			video,
			inQueue,
			contextMenu,
			thumbnailHoverElement: () => (
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

	const promptRemoveVideo = (video: IVideoCompact) => {
		app.setConfirmation(
			removePlayHistoryConfirmation(video, async () => {
				await api.me.removePlayHistory(video.id);
				props.onRemove?.(video);
			})
		);
	};

	return (
		<div class="space-y-4">
			<Videos.Grid
				title={<ShowMoreTitle {...props} />}
				data={props.videos}
				isLoading={props.isLoading}
				videoProps={videoProps}
				skeletonCount={7}
			/>
		</div>
	);
};
