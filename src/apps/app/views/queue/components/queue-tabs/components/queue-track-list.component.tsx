import { useApp } from "@app/hooks";
import { Icon } from "@common";
import { MediaSourceContextMenuUtil, MediaSources, type MediaSourceListProps } from "@media-source";
import { useQueue, type ITrack } from "@queue";
import { Show, type Component } from "solid-js";

export const QueueTrackList: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const mediaSourceProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const nextTrackIndex = queue.data.nextTrackIds.findIndex((id) => id === t.id);

		const mediaSourceProps: MediaSourceListProps = {
			mediaSource: t.mediaSource,
			requestedBy: t.requestedBy,
			imageOverlayElement: () => (
				<Show when={nextTrackIndex >= 0}>
					<div class="absolute -bottom-2 -right-2">
						<div
							title={"Next Track" + (nextTrackIndex > 0 ? ` (${nextTrackIndex + 1})` : "")}
							class="relative bg-neutral-950 rounded-full p-1"
						>
							<Icon name="play" class="text-brand-600" size="sm" />
						</div>
					</div>
				</Show>
			),
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
			contextMenu: MediaSourceContextMenuUtil.getContextMenu({
				mediaSource: t.mediaSource,
				appStore: app,
				queueStore: queue,
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
