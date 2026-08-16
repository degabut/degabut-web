import { Icon, Item, Text, contextMenu, type ContextMenuDirectiveParams, type ItemListProps } from "@common";
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
				<div class="flex items-center space-x-1.5">
					<Text.Caption2 class="border border-neutral-600 rounded px-0.5 text-neutral-300!">
						{props.playlist.videoCount} videos
					</Text.Caption2>
					<Show when={props.playlist.channel} keyed>
						{(c) => (
							<Text.Caption1 truncate class="ml-2">
								{c.name}
							</Text.Caption1>
						)}
					</Show>
					<Show when={props.playlist.isRestricted}>
						<div class="flex-row-center space-x-1" title="Private playlist can't be added to the queue">
							<Icon name="error" class="text-amber-400" />
							<Text.Caption2 class="text-amber-400!">Private Playlist</Text.Caption2>
						</div>
					</Show>
				</div>
			)}
		/>
	);
};
