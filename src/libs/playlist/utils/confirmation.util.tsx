import { Text } from "@common/components";
import { IPlaylist } from "@playlist/apis";
import {
	IMusicAlbum,
	IMusicPlaylist,
	IYouTubeMixPlaylist,
	IYouTubePlaylist,
	IYouTubePlaylistCompact,
} from "@youtube/apis";
import { Show } from "solid-js";

export class PlaylistConfirmationUtil {
	static addPlaylistConfirmation(
		playlist:
			| IPlaylist
			| IYouTubePlaylistCompact
			| IYouTubePlaylist
			| IYouTubeMixPlaylist
			| IMusicPlaylist
			| IMusicAlbum,
		onConfirm?: () => Promise<void>
	) {
		return {
			title: "Add Playlist",
			message: (
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
	}
}
