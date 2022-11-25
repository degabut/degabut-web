import type { IGuildMember, IVideoCompact } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { secondsToTime } from "@utils";
import { Component, Show } from "solid-js";
import { ChannelThumbnail, VideoThumbnail, VideoThumbnailBig } from "./components";

contextMenu;

export type VideoListProps = {
	video: IVideoCompact;
	contextMenu?: ContextMenuDirectiveParams;
	requestedBy?: IGuildMember;
	disableContextMenu?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraThumbnailClass?: string;
	extraTitleClass?: string;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoList: Component<VideoListProps> = (props) => {
	return (
		<div
			class={`flex-row-center w-full min-w-0 md:p-1.5 hover:bg-white/5 rounded ${props.extraContainerClass}`}
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			<VideoThumbnail video={props.video} extraClass={`flex-shrink-0 ${props.extraThumbnailClass}`} />
			<div class="flex flex-col flex-grow  space-y-0.5 truncate ml-3">
				<div
					class={`truncate ${props.extraTitleClass}`}
					title={`${props.video.title} - ${props.video.channel.name}`}
				>
					{props.video.title}
				</div>
				<div class="flex flex-row space-x-3 text-sm align-bottom">
					<div class="text-neutral-400">{secondsToTime(props.video.duration)}</div>
					<div class="text-neutral-400 truncate">
						<span class="text-neutral-300">{props.video.channel.name}</span>
						{props.requestedBy && (
							<span class="text-xs"> — Requested by {props.requestedBy.displayName}</span>
						)}
					</div>
				</div>
			</div>
			<Show when={!props.disableContextMenu}>
				<ContextMenuButton contextMenu={props.contextMenu} />
			</Show>
		</div>
	);
};

export const VideoListBig: Component<VideoListProps> = (props) => {
	return (
		<div
			class={`flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0 hover:bg-white/5 rounded ${props.extraContainerClass}`}
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			<VideoThumbnailBig video={props.video} extraClass={props.extraThumbnailClass} />
			<div class="flex flex-col sm:space-y-2 w-full truncate px-2 pb-2 sm:pt-1">
				<div class="flex-row-center truncate">
					<div
						class={`flex-grow font-medium truncate ${props.extraTitleClass}`}
						title={`${props.video.title} - ${props.video.channel.name}`}
					>
						{props.video.title}
					</div>

					<Show when={!props.disableContextMenu}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>
				<div class="space-y-1">
					<Show when={props.video.viewCount} keyed>
						{(c) => <div class="text-neutral-400 text-sm">{c.toLocaleString("en-US")} views</div>}
					</Show>
					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail video={props.video} />
						<div>{props.video.channel.name}</div>
					</div>
				</div>

				{props.requestedBy && <div class="my-auto">Requested by {props.requestedBy.displayName}</div>}
			</div>
		</div>
	);
};

export const VideoListResponsive: Component<VideoListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<VideoList {...props} />}>
			<VideoListBig {...props} />
		</Show>
	);
};
