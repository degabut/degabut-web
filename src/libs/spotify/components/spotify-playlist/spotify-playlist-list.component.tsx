import { Item, Text, contextMenu, type ContextMenuDirectiveParams } from "@common";
import { type Component } from "solid-js";
import { type ISpotifyPlaylist, type ISpotifySimplifiedPlaylist } from "../../apis";

contextMenu;

export type SpotifyPlaylistListProps = {
	playlist: ISpotifySimplifiedPlaylist | ISpotifyPlaylist;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean | undefined>;
	extraTitleClass?: string;
	onClick?: (playlist: ISpotifySimplifiedPlaylist | ISpotifyPlaylist) => void;
};

export const SpotifyPlaylistList: Component<SpotifyPlaylistListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.playlist.name}
			imageUrl={props.playlist.images?.at(-1)?.url}
			onClick={() => props.onClick?.(props.playlist)}
			extra={() => (
				<Text.Caption2 class="border border-neutral-600 rounded px-0.5 !text-neutral-300">
					{props.playlist.tracks.total} tracks
				</Text.Caption2>
			)}
		/>
	);
};
