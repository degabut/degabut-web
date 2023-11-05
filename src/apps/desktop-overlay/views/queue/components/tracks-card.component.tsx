import { useApp, useQueue } from "@app/hooks";
import { ITrack } from "@queue/apis";
import { VideoListProps, Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show } from "solid-js";
import { Card } from "../../../components";

export const TracksCard: Component = () => {
	const queue = useQueue();
	const app = useApp();

	const videoProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const videoProps: VideoListProps = {
			video: t.video,
			requestedBy: t.requestedBy,
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
			contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
				video: t.video,
				queueStore: queue,
				appStore: app,
				modify: (c) => {
					if (queue.data.empty) return [];
					return [c[0]];
				},
			}),
		};

		return {
			id: t.id,
			videoProps,
		};
	};

	return (
		<Card>
			<div class="flex flex-col h-full overflow-y-auto">
				<Show when={queue.data.tracks} keyed>
					{(tracks) => (
						<div classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
							<Videos.SortableList
								data={tracks}
								onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
								sortableProps={videoProps}
							/>
						</div>
					)}
				</Show>
			</div>
		</Card>
	);
};
