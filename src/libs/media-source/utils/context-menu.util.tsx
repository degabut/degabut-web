/* eslint-disable solid/reactivity */
import { Show } from "solid-js";

import type { AppContextStore } from "@app/providers";
import { TimeUtil, type ContextMenuDirectiveParams, type IContextMenuItem } from "@common";
import type { QueueContextStore } from "@queue";
import { type IMediaSource } from "../apis";

type SourceProps = {
	mediaSource: IMediaSource;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	openWithClick?: boolean;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export class MediaSourceContextMenuUtil {
	static getContextMenu(props: SourceProps) {
		const trackInQueue = props.queueStore.data.tracks?.findLast(
			(t) => t.mediaSource.sourceId === props.mediaSource.sourceId
		);

		let items: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			const firstSection: IContextMenuItem[] = [];
			if (!trackInQueue) {
				firstSection.push({
					label: "Add to Queue",
					icon: "plus",
					onClick: () => props.queueStore.addTrack(props.mediaSource),
					wait: true,
				});
			}

			firstSection.push({
				label: "Play",
				icon: "play",
				disabled: props.queueStore.data.nowPlaying?.mediaSource.sourceId === props.mediaSource.sourceId,
				onClick: () => props.queueStore.addAndPlayTrack(props.mediaSource),
				wait: true,
			});

			if (trackInQueue) {
				firstSection.push({
					label: "Remove from Queue",
					icon: "trashBin",
					onClick: () => props.queueStore.removeTrack(trackInQueue),
					wait: true,
				});
			}
			items.push(firstSection);
		}

		if (props.appStore) {
			items.push([
				{
					label: "Add to Playlist",
					icon: "plus",
					onClick: () => props.appStore?.promptAddMediaToPlaylist(props.mediaSource),
				},
			]);

			items.push([
				{
					label: `Open on ${props.mediaSource.type === "youtube" ? "YouTube" : "Spotify"}`,
					icon: "linkExternal",
					onClick: () => window.open(props.mediaSource.url, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			openWithClick: props.openWithClick ?? true,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<div class="flex w-[16rem] h-[9rem] items-center my-4">
						<img
							class="h-full mx-auto"
							src={props.mediaSource.maxThumbnailUrl}
							alt={props.mediaSource.title}
						/>
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.mediaSource.title}</div>
						<div class="text-sm text-center text-neutral-400 space-y-1">
							<Show when={props.mediaSource.creator} keyed>
								{(creator) => <div>{creator}</div>}
							</Show>
							<div class="flex flex-row space-x-4 justify-center">
								<div>{TimeUtil.secondsToTime(props.mediaSource.duration)}</div>
							</div>
						</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
