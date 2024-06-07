/* eslint-disable solid/reactivity */
import { Show } from "solid-js";

import type { AppContextStore } from "@app/providers";
import { TimeUtil, type ContextMenuDirectiveParams, type IContextMenuItem } from "@common";
import type { QueueContextStore } from "@queue";
import { type IMediaSource } from "../apis";
import { useLikeMediaSource } from "../hooks";

type SourceProps = {
	mediaSource: IMediaSource;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	openWithClick?: boolean;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export class MediaSourceContextMenuUtil {
	static getContextMenu(props: SourceProps) {
		const like = useLikeMediaSource(() => props.mediaSource.id);

		let items: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			const nowPlaying = props.queueStore.data.nowPlaying;
			const trackInQueue = props.queueStore.data.tracks?.findLast(
				(t) => t.mediaSource.sourceId === props.mediaSource.sourceId
			);
			const trackInNext = props.queueStore.data.nextTrackIds?.find((t) => t === trackInQueue?.id);

			const firstSection: IContextMenuItem[] = [];

			firstSection.push({
				label: !trackInQueue ? "Add to Queue" : "Remove from Queue",
				icon: !trackInQueue ? "plus" : "trashBin",
				onClick: () =>
					!trackInQueue
						? props.queueStore.addTrack(props.mediaSource)
						: props.queueStore.removeTrack(trackInQueue),
				wait: true,
			});

			firstSection.push({
				label: "Play",
				icon: "play",
				disabled: nowPlaying?.mediaSource.sourceId === props.mediaSource.sourceId,
				onClick: () => props.queueStore.addAndPlayTrack(props.mediaSource),
				wait: true,
			});

			firstSection.push({
				label: !trackInNext ? "Play Next" : "Remove from Next",
				icon: !trackInNext ? "playlistPlay" : "closeLine",
				disabled: trackInQueue && nowPlaying?.id === trackInQueue?.id,
				onClick: () =>
					!trackInNext
						? props.queueStore.addNextTrack(props.mediaSource)
						: props.queueStore.removeNextTrack(trackInNext),
				wait: true,
			});

			items.push(firstSection);
		}

		if (like || props.appStore) {
			const secondSection: IContextMenuItem[] = [];

			if (like) {
				secondSection.push({
					label: !like.isLiked() ? "Like" : "Unlike",
					icon: !like.isLiked() ? "heart" : "heartBroken",
					onClick: () => (!like.isLiked() ? like.like() : like.unlike()),
				});
			}

			if (props.appStore) {
				secondSection.push({
					label: "Add to Playlist",
					icon: "playlistMusic",
					onClick: () => props.appStore?.promptAddMediaToPlaylist(props.mediaSource),
				});
			}

			if (secondSection.length) items.push(secondSection);
		}

		if (props.appStore) {
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
