import { Item, Text, contextMenu, type ContextMenuDirectiveParams, type ItemListProps } from "@common";
import type { IYouTubeMixPlaylist, IYouTubePlaylist, IYouTubePlaylistCompact } from "@youtube";
import { Show, type Component } from "solid-js";

contextMenu;

export type YouTubePlaylistListProps = Partial<ItemListProps> & {
	playlist: IYouTubePlaylistCompact | IYouTubePlaylist | IYouTubeMixPlaylist;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean | undefined>;
	extraTitleClass?: string;
	onClick?: () => void;
};

export const YouTubePlaylistList: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.playlist.title}
			imageUrl={"thumbnails" in props.playlist ? props.playlist.thumbnails.map((t) => t.url) : []}
			extra={() => (
				<>
					<Text.Caption2 class="border border-neutral-600 rounded px-0.5 !text-neutral-300">
						{props.playlist.videoCount} videos
					</Text.Caption2>
					<Show when={props.playlist.channel} keyed>
						{(c) => (
							<Text.Caption1 truncate class="ml-2">
								{c.name}
							</Text.Caption1>
						)}
					</Show>
				</>
			)}
		/>
	);
};
