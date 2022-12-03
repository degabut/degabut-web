import { IPlaylist } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { useQueue } from "@hooks/useQueue";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";

type Props = {
	playlist: IPlaylist;
	onDelete?: (playlist: IPlaylist) => void;
	onAddToQueue?: (playlist: IPlaylist) => void;
};

export const playlistContextMenu = (props: Props) => {
	const queue = useQueue();

	const items = [
		{
			element: () => <ContextMenuItem icon="trashBin" label="Delete" />,
			onClick: () => props.onDelete?.(props.playlist),
		},
	];

	if (!queue.data.empty) {
		items.unshift({
			element: () => <ContextMenuItem icon="plus" label="Add to Queue" />,
			onClick: () => props.onAddToQueue?.(props.playlist),
		});
	}

	return {
		items: [items],
		header: (
			<div class="flex-col-center justify-center pt-4 pb-8 space-y-1">
				<div class="flex-col-center space-y-2">
					<div class="font-medium text-center">{props.playlist.name}</div>
				</div>
			</div>
		),
	} as ContextMenuDirectiveParams;
};
