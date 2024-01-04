import { useApp } from "@app/hooks";
import { MediaSourceListProps, MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { ITrack } from "@queue/apis";
import { useQueue } from "@queue/hooks";
import { Component, Show } from "solid-js";
import { Card } from "../../../components";

export const TracksCard: Component = () => {
	const queue = useQueue();
	const app = useApp();

	const mediaSourceProps = (t: ITrack) => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const mediaSourceProps: MediaSourceListProps = {
			mediaSource: t.mediaSource,
			requestedBy: t.requestedBy,
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
			contextMenu: MediaSourceContextMenuUtil.getContextMenu({
				mediaSource: t.mediaSource,
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
			mediaSourceProps,
		};
	};

	return (
		<Card>
			<div class="flex flex-col h-full overflow-y-auto">
				<Show when={queue.data.tracks} keyed>
					{(tracks) => (
						<div classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
							<MediaSources.SortableList
								dense
								data={tracks}
								onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
								sortableProps={mediaSourceProps}
							/>
						</div>
					)}
				</Show>
			</div>
		</Card>
	);
};
