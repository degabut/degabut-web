/* eslint-disable solid/reactivity */

import { AppContextStore } from "@app/providers";
import { AbbreviationIcon } from "@common/components";
import { ContextMenuDirectiveParams, IContextMenuItem } from "@common/directives";
import { PlaylistConfirmationUtil } from "@playlist/utils";
import { QueueContextStore } from "@queue/providers";
import { ISpotifyAlbum, ISpotifyPlaylist, ISpotifySimplifiedAlbum, ISpotifySimplifiedPlaylist } from "@spotify/apis";
import { Show } from "solid-js";

type SpotifyPlaylistProps = {
	playlist: ISpotifyPlaylist | ISpotifySimplifiedPlaylist;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

type SpotifyAlbumProps = {
	album: ISpotifyAlbum | ISpotifySimplifiedAlbum;
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

		if (props.appStore) {
			items.push([
				{
					label: "Open on Spotify",
					icon: "linkExternal",
					onClick: () =>
						window.open(`https://open.spotify.com/playlist/${props.playlist.id}`, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<Show
						when={props.playlist.images?.length}
						fallback={<AbbreviationIcon text={props.playlist.name} size="xl" />}
					>
						<div class="h-[9rem] text-center my-4">
							<img
								class="w-full h-full"
								src={props.playlist.images?.at(0)?.url}
								alt={props.playlist.name}
							/>
						</div>
					</Show>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.playlist.name}</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}

	static getAlbumContextMenu(props: SpotifyAlbumProps) {
		const promptAddPlaylist = (album: ISpotifyAlbum | ISpotifySimplifiedAlbum) => {
			props.appStore?.setConfirmation(
				PlaylistConfirmationUtil.addPlaylistConfirmation(album, () =>
					props.queueStore.addSpotifyAlbum(album.id)
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
							? promptAddPlaylist(props.album)
							: props.queueStore.addSpotifyAlbum(props.album.id),
				},
			]);
		}

		if (props.appStore) {
			items.push([
				{
					label: "Open on Spotify",
					icon: "linkExternal",
					onClick: () => window.open(`https://open.spotify.com/album/${props.album.id}`, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<Show
						when={props.album.images?.length}
						fallback={<AbbreviationIcon text={props.album.name} size="xl" />}
					>
						<div class="h-[9rem] text-center my-4">
							<img class="w-full h-full" src={props.album.images?.at(0)?.url} alt={props.album.name} />
						</div>
					</Show>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.album.name}</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
