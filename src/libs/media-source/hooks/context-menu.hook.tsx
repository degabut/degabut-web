import { useApp } from "@app/hooks";
import { type AppContextStore } from "@app/providers";
import { TimeUtil, type ContextMenuDirectiveParams, type IContextMenuItem } from "@common";
import { useQueue, type QueueContextStore } from "@queue";
import { Show, createMemo, type Accessor } from "solid-js";
import { type IMediaSource } from "../apis";
import { useLikeMediaSource } from "./like-media-source.hook";

type MediaSourceContextMenuProps = {
	mediaSource: IMediaSource;
	openWithClick?: boolean;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export const useMediaSourceContextMenu = (
	props: Accessor<MediaSourceContextMenuProps>
): Accessor<ContextMenuDirectiveParams | undefined> => {
	const queueStore = useQueue() as QueueContextStore | undefined;
	const appStore = useApp() as AppContextStore | undefined;
	const like = useLikeMediaSource(() => props().mediaSource.id);

	const contextMenu = createMemo(() => {
		let items: IContextMenuItem[][] = [];

		const { mediaSource, modify, openWithClick } = props();
		if (!mediaSource) return undefined;

		const mediaSourceId = mediaSource.sourceId;

		if (queueStore && !queueStore.data.empty) {
			const nowPlaying = queueStore.data.nowPlaying;
			const trackInQueue = queueStore.data.tracks.findLast((t) => t.mediaSource.sourceId === mediaSourceId);
			const trackInNext = queueStore.data.nextTrackIds?.find((t) => t === trackInQueue?.id);

			const firstSection: IContextMenuItem[] = [];

			firstSection.push({
				label: !trackInQueue ? "Add to Queue" : "Remove from Queue",
				icon: !trackInQueue ? "plus" : "trashBin",
				onClick: () =>
					!trackInQueue ? queueStore.addTrack(mediaSource) : queueStore.removeTrack(trackInQueue),
				wait: true,
			});

			firstSection.push({
				label: "Play",
				icon: "play",
				disabled: nowPlaying?.mediaSource.sourceId === mediaSource.sourceId,
				onClick: () => queueStore.addAndPlayTrack(mediaSource),
				wait: true,
			});

			firstSection.push({
				label: !trackInNext ? "Play Next" : "Remove from Next",
				icon: !trackInNext ? "playlistPlay" : "playlistRemove",
				disabled: trackInQueue && nowPlaying?.id === trackInQueue?.id,
				onClick: () =>
					!trackInNext ? queueStore.addNextTrack(mediaSource) : queueStore.removeNextTrack(trackInNext),
				wait: true,
			});

			items.push(firstSection);
		}

		if (like || appStore) {
			const secondSection: IContextMenuItem[] = [];

			if (like) {
				secondSection.push({
					label: !like.isLiked() ? "Like" : "Unlike",
					icon: !like.isLiked() ? "heart" : "heartBroken",
					onClick: () => (!like.isLiked() ? like.like() : like.unlike()),
				});
			}

			if (appStore) {
				secondSection.push({
					label: "Add to Playlist",
					icon: "playlistMusic",
					onClick: () => appStore?.promptAddMediaToPlaylist(mediaSource),
				});
			}

			if (secondSection.length) items.push(secondSection);
		}

		if (appStore) {
			items.push([
				{
					label: `Open on ${mediaSource.type === "youtube" ? "YouTube" : "Spotify"}`,
					icon: "linkExternal",
					onClick: () => window.open(mediaSource.url, "_blank")?.focus(),
				},
			]);
		}

		// TODO
		if (modify) items = modify(items);

		return {
			items,
			openWithClick: openWithClick ?? true,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<div class="flex w-[16rem] h-[9rem] items-center my-4">
						<img class="h-full mx-auto" src={mediaSource.maxThumbnailUrl} alt={mediaSource.title} />
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{mediaSource.title}</div>
						<div class="text-sm text-center text-neutral-400 space-y-1">
							<Show when={mediaSource.creator} keyed>
								{(creator) => <div>{creator}</div>}
							</Show>
							<div class="flex flex-row space-x-4 justify-center">
								<div>{TimeUtil.secondsToTime(mediaSource.duration)}</div>
							</div>
						</div>
					</div>
				</div>
			),
		};
	});

	return contextMenu;
};
