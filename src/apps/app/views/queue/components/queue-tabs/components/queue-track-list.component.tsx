import { Icon } from "@common";
import { type MediaSourceListProps } from "@media-source";
import { SortableTrackList, useQueue, type ITrack } from "@queue";
import { Show, type Component } from "solid-js";

export const QueueTrackList: Component = () => {
	const queue = useQueue()!;

	const mediaSourceProps = (t: ITrack): MediaSourceListProps => {
		const isActive = queue.data.nowPlaying?.id === t.id;
		const nextTrackIndex = queue.data.nextTrackIds.findIndex((id) => id === t.id);

		return {
			mediaSource: t.mediaSource,
			requestedBy: t.requestedBy,
			hideInQueue: true,
			imageHoverElement: () => (
				<Show when={nextTrackIndex >= 0}>
					<div class="absolute visible -bottom-2 -right-2">
						<div
							title={"Next Track" + (nextTrackIndex > 0 ? ` (${nextTrackIndex + 1})` : "")}
							class="relative bg-neutral-950 rounded-full p-1.5"
						>
							<Icon name="play" class="text-brand-600" size="sm" />
						</div>
					</div>
				</Show>
			),
			extraTitleClass: isActive ? "!text-brand-600" : undefined,
		};
	};

	return (
		<Show when={queue.data.tracks.length}>
			<div classList={{ "opacity-50 pointer-events-none": queue.freezeState.track }}>
				<SortableTrackList
					tracks={queue.data.tracks}
					onSort={({ to }, data) => queue.changeTrackOrder(data.id, to)}
					mediaSourceProps={mediaSourceProps}
				/>
			</div>
		</Show>
	);
};
