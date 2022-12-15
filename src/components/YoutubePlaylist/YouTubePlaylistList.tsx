import type { IMixPlaylist, IPlaylistCompact, IYoutubePlaylist } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, Show } from "solid-js";
import { ChannelThumbnail, PlaylistThumbnail, PlaylistThumbnailBig } from "./components";

contextMenu;

export type YouTubePlaylistListProps = {
	playlist: IPlaylistCompact | IYoutubePlaylist | IMixPlaylist;
	contextMenu?: ContextMenuDirectiveParams;
	disableContextMenu?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
	onClick?: (playlist: IPlaylistCompact | IYoutubePlaylist | IMixPlaylist) => void;
};

export const YouTubePlaylistList: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<div
			class="flex-row-center w-full p-1.5 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.playlist)}
		>
			<PlaylistThumbnail playlist={props.playlist} extraContainerClass="shrink-0" />
			<div class="flex flex-col grow space-y-0.5 truncate ml-3">
				<Text.Body1
					truncate
					classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
					title={`${props.playlist.title} - ${props.playlist.channel?.name}`}
				>
					{props.playlist.title}
				</Text.Body1>
				<div class="flex-row-center space-x-2 text-sm align-bottom">
					<Text.Caption2 class="border border-neutral-600 rounded px-0.5 text-neutral-300">
						{props.playlist.videoCount} videos
					</Text.Caption2>
					<Show when={props.playlist.channel} keyed>
						{(c) => <Text.Caption1 truncate>{c.name}</Text.Caption1>}
					</Show>
				</div>
			</div>
			<Show when={!props.disableContextMenu}>
				<ContextMenuButton contextMenu={props.contextMenu} />
			</Show>
		</div>
	);
};

export const YouTubePlaylistListBig: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<div
			class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.playlist)}
		>
			<PlaylistThumbnailBig playlist={props.playlist} />
			<div class="flex flex-col space-y-2 w-full truncate p-2">
				<div class="flex-row-center truncate">
					<Text.H4
						truncate
						class="grow"
						classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
						title={`${props.playlist.title} - ${props.playlist.channel?.name}`}
					>
						{props.playlist.title}
					</Text.H4>

					<Show when={!props.disableContextMenu}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>
				<div class="space-y-1">
					<Text.Caption1>{props.playlist.videoCount} videos</Text.Caption1>
					<div class="flex-row-center space-x-2">
						<ChannelThumbnail playlist={props.playlist} />
						<Show when={props.playlist.channel} keyed>
							{(c) => <Text.Body2>{c.name}</Text.Body2>}
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
};

export const YouTubePlaylistListResponsive: Component<YouTubePlaylistListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<YouTubePlaylistList {...props} />}>
			<YouTubePlaylistListBig {...props} />
		</Show>
	);
};
