import { type MediaSourceListProps } from "@media-source";
import { SortableTrackList, useQueue, type ITrack } from "@queue";
import { Show, type Component } from "solid-js";
import { Card } from "../../../components";

export const TracksCard: Component = () => {
	const queue = useQueue()!;

	const mediaSourceProps = (t: ITrack): MediaSourceListProps => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		return {
			mediaSource: t.mediaSource,
			requestedBy: t.requestedBy,
			extraTitleClassList: { "test-brand-600": isActive },
		};
	};

	return (
		<Card>
			<div class="flex flex-col h-full overflow-y-auto">
				<Show when={queue.data.tracks} keyed>
					{(tracks) => (
						<div classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
							<SortableTrackList
								dense
								tracks={tracks}
								onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
								mediaSourceProps={mediaSourceProps}
							/>
						</div>
					)}
				</Show>
			</div>
		</Card>
	);
};
