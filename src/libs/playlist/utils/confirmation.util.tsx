import { Text } from "@common/components";
import { IPlaylist } from "@playlist/apis";
import { ISpotifyAlbum, ISpotifyPlaylist, ISpotifySimplifiedAlbum, ISpotifySimplifiedPlaylist } from "@spotify/apis";
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
			| IMusicAlbum
			| ISpotifySimplifiedPlaylist
			| ISpotifyPlaylist
			| ISpotifyAlbum
			| ISpotifySimplifiedAlbum,
		onConfirm?: () => Promise<void>
	) {
		return {
			title: "Add Playlist",
			message: () => (
				<div class="flex-col-center space-y-2">
					<Text.Body1>
						Add playlist <b>{"name" in playlist ? playlist.name : playlist.title}</b> to the queue?
					</Text.Body1>
					<Show when={"mediaSourceCount" in playlist && playlist.mediaSourceCount} keyed>
						{(c) => (
							<Text.Caption1>
								This will add <b>{c}</b> tracks to the queue.{" "}
							</Text.Caption1>
						)}
					</Show>
				</div>
			),
			onConfirm,
		};
	}
}
