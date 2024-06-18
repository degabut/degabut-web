import { AbbreviationIcon, Item, Text, contextMenu, type ContextMenuDirectiveParams } from "@common";
import { Show, type Component } from "solid-js";
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
			left={!props.playlist.images?.length ? () => <AbbreviationIcon text={props.playlist.name} /> : undefined}
		/>
	);
};

export const SpotifyPlaylistListBig: Component<SpotifyPlaylistListProps> = (props) => {
	return (
		<Item.ListBig
			{...props}
			title={props.playlist.name}
			imageUrl={props.playlist.images?.at(0)?.url}
			onClick={() => props.onClick?.(props.playlist)}
		/>
	);
};

export const SpotifyPlaylistListResponsive: Component<SpotifyPlaylistListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<SpotifyPlaylistList {...props} />}>
			<SpotifyPlaylistListBig {...props} />
		</Show>
	);
};
