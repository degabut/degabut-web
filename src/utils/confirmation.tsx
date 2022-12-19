import { IMixPlaylist, IPlaylist, IPlaylistCompact, IVideo, IVideoCompact, IYoutubePlaylist } from "@api";
import { Text } from "@components/Text";
import { Video } from "@components/Video";

export const addPlaylistConfirmation = (
	playlist: IPlaylist | IPlaylistCompact | IYoutubePlaylist | IMixPlaylist,
	onConfirm?: () => Promise<void>
) => {
	return {
		title: "Add Playlist",
		message: () => (
			<div class="flex-col-center space-y-2">
				<Text.Body1>
					Add playlist <b>{"name" in playlist ? playlist.name : playlist.title}</b> to the queue?
				</Text.Body1>
				<Text.Caption1>
					This will add <b>{playlist.videoCount}</b> videos to the queue.
				</Text.Caption1>
			</div>
		),
		onConfirm,
	};
};

export const removePlayHistoryConfirmation = (video: IVideo | IVideoCompact, onConfirm?: () => Promise<void>) => {
	return {
		title: "Remove Play History",
		message: () => (
			<div class="flex-col-center space-y-3">
				<Video.List video={video} disableContextMenu />
				<Text.Body2>
					This action will remove the video from your most played and recently played lists until you play it
					again.
				</Text.Body2>
			</div>
		),
		onConfirm,
	};
};
