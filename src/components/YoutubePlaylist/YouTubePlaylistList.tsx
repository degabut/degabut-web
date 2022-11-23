import type { IPlaylistCompact } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, Show } from "solid-js";
import { ChannelThumbnail, PlaylistThumbnail, PlaylistThumbnailBig } from "./components";

contextMenu;

export type YouTubePlaylistListProps = {
	playlist: IPlaylistCompact;
	contextMenu?: ContextMenuDirectiveParams;
	disableContextMenu?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraTitleClass?: string;
};

export const YouTubePlaylistList: Component<YouTubePlaylistListProps> = (props) => {
	return (
		<div
			class={`flex-row-center space-x-3 w-full md:p-1.5 hover:bg-white/5 rounded ${props.extraContainerClass}`}
			classList={props.extraContainerClassList}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
		>
			<PlaylistThumbnail playlist={props.playlist} extraContainerClass="flex-shrink-0" />
			<div class="flex flex-col flex-grow flex-shrink space-y-0.5 truncate">
				<div
					class={`truncate ${props.extraTitleClass}`}
					title={`${props.playlist.title} - ${props.playlist.channel?.name}`}
				>
					{props.playlist.title}
				</div>
				<div class="flex flex-row space-x-3 text-sm align-bottom">
					<div class="text-neutral-400">{props.playlist.videoCount} videos</div>
					<Show when={props.playlist.channel} keyed>
						{(c) => (
							<div class="text-neutral-400 truncate">
								<span class="text-neutral-300">{c.name}</span>
							</div>
						)}
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
			class={`flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0 hover:bg-white/5 rounded ${props.extraContainerClass}`}
			classList={props.extraContainerClassList}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
		>
			<PlaylistThumbnailBig playlist={props.playlist} />
			<div class="flex flex-col space-y-2 w-full truncate p-2">
				<div class="flex-row-center truncate">
					<div
						class={`flex-grow font-medium truncate ${props.extraTitleClass}`}
						title={`${props.playlist.title} - ${props.playlist.channel?.name}`}
					>
						{props.playlist.title}
					</div>

					<Show when={!props.disableContextMenu}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>
				<div class="space-y-1">
					<div class="text-neutral-400 text-sm">{props.playlist.videoCount} videos</div>
					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail playlist={props.playlist} />
						<Show when={props.playlist.channel} keyed>
							{(c) => <div>{c.name}</div>}
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
