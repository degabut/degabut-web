import { useApp } from "@app/providers";
import { type IContextMenuItem } from "@common";
import { useQueue } from "@queue";
import { YouTubeConnectionState, useYouTubeConnect } from "@youtube";
import { type IMediaSource } from "../apis";
import { type MediaSourceSelectStore } from "../providers/media-source-select";

export type MediaSourceSelectionMenuBuilder = (extras?: IContextMenuItem[]) => IContextMenuItem[];

export const useMediaSourceSelectionMenu = (
	selection: MediaSourceSelectStore | undefined
): MediaSourceSelectionMenuBuilder => {
	const queueStore = useQueue();
	const youtubeStore = useYouTubeConnect();
	const appStore = useApp();

	return (extras = []) => {
		const selectedMediaSourceIds = selection?.ids() ?? {};
		const selectedIds = Object.keys(selectedMediaSourceIds);
		if (!selection || !queueStore || !selectedIds.length) return [];

		const tracks = queueStore.data.tracks;
		const hasUnqueuedSelection = selectedIds.some((id) => !tracks.some((t) => t.mediaSource.id === id));
		const hasQueuedSelection = tracks.some((t) => selectedMediaSourceIds[t.mediaSource.id]);
		const items: IContextMenuItem[] = [];

		if (hasUnqueuedSelection && !queueStore.data.empty) {
			items.push({
				label: `Add ${selectedIds.length} Selected to Queue`,
				icon: "plus",
				onClick: async () => {
					await queueStore.addTrackByIds(selectedIds);
					selection.clear();
				},
				wait: true,
			});
		}

		if (hasQueuedSelection && !queueStore.data.empty) {
			items.push({
				label: `Remove ${selectedIds.length} Selected from Queue`,
				icon: "trashBin",
				onClick: async () => {
					const selectedTracks = tracks.filter((t) => selectedMediaSourceIds[t.mediaSource.id]);
					await queueStore.removeTracks(selectedTracks.map((t) => t.id));
					selection.clear();
				},
				wait: true,
			});
		}

		if (appStore) {
			items.push({
				label: `Add ${selectedIds.length} Selected to Playlist`,
				icon: "playlistMusic",
				onClick: () => {
					const mediaSources = Object.values(selectedMediaSourceIds).filter((m): m is IMediaSource => !!m);
					appStore.promptAddMediaToPlaylist(mediaSources);
					selection.clear();
				},
				wait: true,
			});
		}

		if (youtubeStore.state() !== YouTubeConnectionState.Disabled) {
			items.push({
				label: `Add ${selectedIds.length} Selected to YouTube Playlist`,
				icon: "playlistMusic",
				disabled: youtubeStore.state() !== YouTubeConnectionState.Connected,
				onClick: () => {
					const mediaSources = Object.values(selectedMediaSourceIds).filter((m): m is IMediaSource => !!m);
					youtubeStore.promptAddToPlaylist(mediaSources);
					selection.clear();
				},
				wait: true,
			});
		}

		items.push(...extras);

		items.push({
			label: "Clear Selection",
			icon: "checkboxBlankOff",
			onClick: () => selection.clear(),
		});

		return items;
	};
};
