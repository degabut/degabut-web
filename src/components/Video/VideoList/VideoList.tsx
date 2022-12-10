import type { IGuildMember, IVideoCompact } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { secondsToTime } from "@utils";
import { Component, JSX, Show } from "solid-js";
import { ChannelThumbnail, LiveBadge } from "../components";
import { VideoListThumbnail, VideoListThumbnailBig } from "./components";

contextMenu;

export type VideoListProps = {
	video: IVideoCompact;
	contextMenu?: ContextMenuDirectiveParams;
	requestedBy?: IGuildMember | null;
	disableContextMenu?: boolean;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraThumbnailClass?: string;
	extraTitleClass?: string;
	inQueue?: boolean;
	left?: JSX.Element;
	right?: JSX.Element;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoList: Component<VideoListProps> = (props) => {
	return (
		<div
			class="flex-row-center items-stretch w-full p-1.5 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			{props.left}

			<VideoListThumbnail video={props.video} extraClass={`shrink-0 ${props.extraThumbnailClass}`} />

			<div class="flex flex-col grow space-y-0.5 truncate ml-3">
				<Text.Body1
					truncate
					classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
					title={`${props.video.title} - ${props.video.channel.name}`}
				>
					{props.video.title}
				</Text.Body1>

				<div class="flex-row-center text-sm align-bottom">
					<Show when={props.inQueue}>
						<div class="mr-1" title="In Queue">
							<Icon name="degabut" class="fill-brand-600 w-3.5 h-3.5" />
						</div>
					</Show>

					<Show when={props.video.duration > 0} fallback={<LiveBadge />}>
						<Text.Caption2 class="border border-neutral-600 rounded px-0.5 text-neutral-300">
							{secondsToTime(props.video.duration)}
						</Text.Caption2>
					</Show>

					<div class="truncate ml-2">
						<Text.Caption1 truncate>{props.video.channel.name}</Text.Caption1>
						{props.requestedBy && (
							<Text.Caption2 truncate> — Requested by {props.requestedBy.displayName}</Text.Caption2>
						)}
					</div>
				</div>
			</div>

			{props.right}

			<Show when={!props.disableContextMenu && !props.hideContextMenuButton}>
				<ContextMenuButton contextMenu={props.contextMenu} />
			</Show>
		</div>
	);
};

export const VideoListBig: Component<VideoListProps> = (props) => {
	return (
		<div
			class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0 hover:bg-white/5 rounded"
			classList={{
				"cursor-pointer": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			<VideoListThumbnailBig inQueue={props.inQueue} video={props.video} extraClass={props.extraThumbnailClass} />
			<div class="flex flex-col sm:space-y-2 w-full truncate px-2 pb-2 sm:pt-1">
				<div class="flex-row-center truncate">
					<Text.H4
						truncate
						class="grow"
						classList={{ [props.extraTitleClass || ""]: !!props.extraTitleClass }}
						title={`${props.video.title} - ${props.video.channel.name}`}
					>
						{props.video.title}
					</Text.H4>

					<Show when={!props.disableContextMenu && !props.hideContextMenuButton}>
						<ContextMenuButton contextMenu={props.contextMenu} />
					</Show>
				</div>
				<div class="space-y-1">
					<Show when={props.video.viewCount} keyed>
						{(c) => <Text.Caption1>{c.toLocaleString("en-US")} views</Text.Caption1>}
					</Show>
					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail video={props.video} />
						<Text.Body2>{props.video.channel.name}</Text.Body2>
					</div>
				</div>
				<Show when={!props.video.duration}>
					<LiveBadge />
				</Show>
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
