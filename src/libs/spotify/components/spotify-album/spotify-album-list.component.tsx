import { Item, Text, contextMenu, type ContextMenuDirectiveParams } from "@common";
import { type Component } from "solid-js";
import { type ISpotifyAlbum, type ISpotifySimplifiedAlbum } from "../../apis";

contextMenu;

export type SpotifyAlbumListProps = {
	album: ISpotifySimplifiedAlbum | ISpotifyAlbum;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean | undefined>;
	extraTitleClass?: string;
	onClick?: (album: ISpotifySimplifiedAlbum | ISpotifyAlbum) => void;
};

export const SpotifyAlbumList: Component<SpotifyAlbumListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.album.name}
			imageUrl={props.album.images?.at(-1)?.url}
			onClick={() => props.onClick?.(props.album)}
			extra={() =>
				"tracks" in props.album && (
					<Text.Caption2 class="border border-neutral-600 rounded px-0.5 !text-neutral-300">
						{props.album.tracks.total} tracks
					</Text.Caption2>
				)
			}
		/>
	);
};
