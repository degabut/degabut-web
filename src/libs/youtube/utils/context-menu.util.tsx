/* eslint-disable solid/reactivity */

import type { AppContextStore } from "@app/providers";
import type { ContextMenuDirectiveParams, IContextMenuItem } from "@common";
import { PlaylistConfirmationUtil } from "@playlist";
import type { QueueContextStore } from "@queue";
import type { IYouTubePlaylistCompact } from "@youtube";

type YouTubePlaylistProps = {
	playlist: IYouTubePlaylistCompact;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export class YouTubeContextMenuUtil {
	static getPlaylistContextMenu(props: YouTubePlaylistProps) {
		const promptAddPlaylist = (playlist: IYouTubePlaylistCompact) => {
			props.appStore?.setConfirmation(
				PlaylistConfirmationUtil.addPlaylistConfirmation(playlist, () =>
					props.queueStore.addYouTubePlaylist(playlist.id)
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
							: props.queueStore.addYouTubePlaylist(props.playlist.id),
				},
			]);
		}

		if (!props.appStore) {
			items.push([
				{
					label: "Open on YouTube",
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
						<img
							class="w-full h-full"
							src={props.playlist.thumbnails.at(-1)?.url}
							alt={props.playlist.title}
						/>
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.playlist.title}</div>
						<div class="text-sm text-neutral-400 text-center space-y-1">
							<div>{props.playlist.channel?.name}</div>
							<div>
								{props.playlist.videoCount} {props.playlist.videoCount === 1 ? "video" : "videos"}
							</div>
						</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
