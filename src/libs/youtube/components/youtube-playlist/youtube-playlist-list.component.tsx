import { Item, Text } from "@common/components";
import { ContextMenuDirectiveParams, contextMenu } from "@common/directives";
import { IYouTubeMixPlaylist, IYouTubePlaylist, IYouTubePlaylistCompact } from "@youtube/apis";
import { Component, Show } from "solid-js";
import { Thumbnail } from "../thumbnail";

contextMenu;

export type YouTubePlaylistListProps = {
	playlist: IYouTubePlaylistCompact | IYouTubePlaylist | IYouTubeMixPlaylist;
	contextMenu?: ContextMenuDirectiveParams;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
	onClick?: (playlist: IYouTubePlaylistCompact | IYouTubePlaylist | IYouTubeMixPlaylist) => void;
};

export const YouTubePlaylistList: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.playlist.title}
			imageUrl={"thumbnails" in props.playlist ? props.playlist.thumbnails.map((t) => t.url) : []}
			onClick={() => props.onClick?.(props.playlist)}
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

export const YouTubePlaylistListBig: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<Item.ListBig
			{...props}
			title={props.playlist.title}
			imageUrl={"thumbnails" in props.playlist ? props.playlist.thumbnails.map((t) => t.url) : []}
			onClick={() => props.onClick?.(props.playlist)}
			extra={() => (
				<>
					<Text.Caption1>{props.playlist.videoCount} videos</Text.Caption1>
					<div class="flex-row-center space-x-2">
						<Thumbnail.Channel
							thumbnails={"thumbnails" in props.playlist ? props.playlist.thumbnails : []}
						/>
						<Show when={props.playlist.channel} keyed>
							{(c) => <Text.Body2>{c.name}</Text.Body2>}
						</Show>
					</div>
				</>
			)}
		/>
	);
};

export const YouTubePlaylistListResponsive: Component<YouTubePlaylistListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<YouTubePlaylistList {...props} />}>
			<YouTubePlaylistListBig {...props} />
		</Show>
	);
};
