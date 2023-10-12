import {
	IMusicAlbum,
	IMusicPlaylist,
	IPlaylist,
	IVideo,
	IVideoCompact,
	IYouTubeMixPlaylist,
	IYouTubePlaylist,
	IYouTubePlaylistCompact,
} from "@api";
import { Text } from "@components/atoms";
import { Video } from "@components/molecules";
import { Show } from "solid-js";

export const addPlaylistConfirmation = (
	playlist:
		| IPlaylist
		| IYouTubePlaylistCompact
		| IYouTubePlaylist
		| IYouTubeMixPlaylist
		| IMusicPlaylist
		| IMusicAlbum,
	onConfirm?: () => Promise<void>
) => {
	return {
		title: "Add Playlist",
		message: () => (
			<div class="flex-col-center space-y-2">
				<Text.Body1>
					Add playlist <b>{"name" in playlist ? playlist.name : playlist.title}</b> to the queue?
				</Text.Body1>
				<Show when={"videoCount" in playlist && playlist.videoCount} keyed>
					{(videoCount) => (
						<Text.Caption1>
							This will add <b>{videoCount}</b> videos to the queue.{" "}
						</Text.Caption1>
					)}
				</Show>
			</div>
		),
		onConfirm,
	};
};

export const removePlayHistoryConfirmation = (video: IVideo | IVideoCompact, onConfirm?: () => Promise<void>) => {
	return {
		title: "Remove Play History",
		message: () => (
			<div class="flex-col-center space-y-6">
				<Video.List video={video} />
				<Text.Body2 class="text-center">
					This action will remove the video from your most played and recently played lists until you play it
					again.
				</Text.Body2>
			</div>
		),
		onConfirm,
	};
};
