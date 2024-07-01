import { Item, Text, TimeUtil, contextMenu, type ItemListProps } from "@common";
import { Show, type Component } from "solid-js";
import { type IPlaylist } from "../../apis";

contextMenu;

type Props = Partial<ItemListProps> & {
	playlist: IPlaylist;
};

export const PlaylistList: Component<Props> = (props) => {
	const countLabel = () => {
		return props.playlist.mediaSourceCount === 1 ? "1 song" : props.playlist.mediaSourceCount + " songs";
	};

	return (
		<Item.List
			{...props}
			title={props.playlist.name}
			imageUrl={props.playlist.images.sort((a, b) => a.width - b.width).at(0)?.url}
			extra={() => (
				<div>
					<Show when={props.playlist.mediaSourceCount > 0}>
						<Text.Caption1>{countLabel()}</Text.Caption1>
					</Show>
					<Text.Caption2>
						{props.playlist.mediaSourceCount > 0 && " — "} Created{" "}
						{TimeUtil.getRelativeTime(props.playlist.createdAt)}
					</Text.Caption2>
				</div>
			)}
		/>
	);
};
