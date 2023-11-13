import { useApp } from "@app/hooks";
import { ITrack } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { VideoListProps, Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component } from "solid-js";

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const videoProps: VideoListProps = {
			video: t.video,
			requestedBy: t.requestedBy,
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
			onClick: (v) => navigate(`/video/${v.id}`),
			contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
				video: t.video,
				appStore: app,
				queueStore: queue,
				navigate,
			}),
		};

		return {
			id: t.id,
			videoProps,
		};
	};

	return (
		<div class="space-y-2">
			<div class="h-full" classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
				<Videos.SortableList
					data={queue.data.tracks}
					onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
					sortableProps={videoProps}
				/>
			</div>
		</div>
	);
};
