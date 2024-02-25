import { AbbreviationIcon, Item, Text } from "@common/components";
import { ContextMenuDirectiveParams, contextMenu } from "@common/directives";
import { ISpotifyAlbum, ISpotifySimplifiedAlbum } from "@spotify/apis";
import { Component, Show } from "solid-js";

contextMenu;

export type SpotifyAlbumListProps = {
	album: ISpotifySimplifiedAlbum | ISpotifyAlbum;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
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
			left={!props.album.images?.length ? () => <AbbreviationIcon text={props.album.name} /> : undefined}
		/>
	);
};

export const SpotifyAlbumListBig: Component<SpotifyAlbumListProps> = (props) => {
	return (
		<Item.ListBig
			{...props}
			title={props.album.name}
			imageUrl={props.album.images?.at(0)?.url}
			onClick={() => props.onClick?.(props.album)}
		/>
	);
};

export const SpotifyAlbumListResponsive: Component<SpotifyAlbumListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<SpotifyAlbumList {...props} />}>
			<SpotifyAlbumListBig {...props} />
		</Show>
	);
};
