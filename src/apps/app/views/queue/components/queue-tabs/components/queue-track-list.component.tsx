import { useApp } from "@app/hooks";
import { MediaSourceListProps, MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { ITrack } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const mediaSourceProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const mediaSourceProps: MediaSourceListProps = {
			mediaSource: t.mediaSource,
			requestedBy: t.requestedBy,
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
			contextMenu: MediaSourceContextMenuUtil.getContextMenu({
				mediaSource: t.mediaSource,
				appStore: app,
				queueStore: queue,
				navigate,
			}),
		};

		return {
			id: t.id,
			mediaSourceProps,
		};
	};

	return (
		<Show when={queue.data.tracks.length}>
			<div classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
				<MediaSources.SortableList
					data={queue.data.tracks}
					onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
					sortableProps={mediaSourceProps}
				/>
			</div>
		</Show>
	);
};
