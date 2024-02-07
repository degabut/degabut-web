/* eslint-disable solid/reactivity */

import { AppContextStore } from "@app/providers";
import { ContextMenuDirectiveParams, IContextMenuItem } from "@common/directives";
import { PlaylistConfirmationUtil } from "@playlist/utils";
import { QueueContextStore } from "@queue/providers";
import { ISpotifyPlaylist, ISpotifySimplifiedPlaylist } from "@spotify/apis";

type SpotifyPlaylistProps = {
	playlist: ISpotifyPlaylist | ISpotifySimplifiedPlaylist;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export class SpotifyContextMenuUtil {
	static getPlaylistContextMenu(props: SpotifyPlaylistProps) {
		const promptAddPlaylist = (playlist: ISpotifyPlaylist | ISpotifySimplifiedPlaylist) => {
			props.appStore?.setConfirmation(
				PlaylistConfirmationUtil.addPlaylistConfirmation(playlist, () =>
					props.queueStore.addSpotifyPlaylist(playlist.id)
				)
			);
		};

		let items: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			items.push([
				{
					label: "Add to Queue",
					icon: "plus",
					onClick: () =>
						props.appStore
							? promptAddPlaylist(props.playlist)
							: props.queueStore.addSpotifyPlaylist(props.playlist.id),
				},
			]);
		}

		if (!props.appStore) {
			items.push([
				{
					label: "Open on Spotify",
					icon: "youtube",
					onClick: () =>
						window.open(`https://youtube.com/playlist?list=${props.playlist.id}`, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<div class="w-[16rem] h-[9rem] text-center my-4">
						<img class="w-full h-full" src={props.playlist.images.at(0)?.url} alt={props.playlist.name} />
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.playlist.name}</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
