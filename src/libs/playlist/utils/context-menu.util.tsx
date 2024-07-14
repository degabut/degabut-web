import type { ContextMenuDirectiveParams, IContextMenuItem } from "@common";
import type { QueueContextStore } from "@queue";
import { type IPlaylist } from "../apis";

type PlaylistProps = {
	playlist: IPlaylist;
	queueStore: QueueContextStore;
	onDelete?: (playlist: IPlaylist) => void;
	onAddToQueue?: (playlist: IPlaylist) => void;
};

export class PlaylistContextMenuUtil {
	static getContextMenu(props: PlaylistProps) {
		const items: IContextMenuItem[] = [
			{
				label: "Delete",
				icon: "trashBin",
				onClick: () => props.onDelete?.(props.playlist),
			},
		];

		if (!props.queueStore.data.empty) {
			items.unshift({
				label: "Add to Queue",
				icon: "plus",
				onClick: () => props.onAddToQueue?.(props.playlist),
			});
		}

		return {
			items,
			header: (
				<div class="flex-col-center justify-center pb-8 space-y-1">
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.playlist.name}</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
