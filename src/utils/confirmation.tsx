import { IMixPlaylist, IPlaylist, IPlaylistCompact, IYoutubePlaylist } from "@api";

export const addPlaylistConfirmation = (
	playlist: IPlaylist | IPlaylistCompact | IYoutubePlaylist | IMixPlaylist,
	onConfirm?: () => Promise<void>
) => {
	return {
		title: "Add Playlist",
		message: () => (
			<div class="space-y-2">
				<div>
					Add playlist <b>{"name" in playlist ? playlist.name : playlist.title}</b> to the queue?
				</div>
				<div class="text-sm">
					This will add <b>{playlist.videoCount}</b> videos to the queue.
				</div>
			</div>
		),
		onConfirm,
	};
};
