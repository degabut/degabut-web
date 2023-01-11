import type { IGuildMember, IVideoCompact } from "@api";
import { Icon } from "@components/Icon";
import { Item } from "@components/Item";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, JSX, Show } from "solid-js";
import { ChannelThumbnail, DurationBadge, LiveBadge } from "../components";

contextMenu;

export type VideoListProps = {
	video: IVideoCompact;
	contextMenu?: ContextMenuDirectiveParams;
	requestedBy?: IGuildMember | null;
	disableContextMenu?: boolean;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	hideThumbnail?: boolean;
	extraThumbnailClass?: string;
	extraTitleClass?: string;
	inQueue?: boolean;
	left?: JSX.Element;
	right?: JSX.Element;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoList: Component<VideoListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.video.title}
			thumbnails={props.video.thumbnails}
			onClick={() => props.onClick?.(props.video)}
			extra={
				<>
					<Show when={props.inQueue}>
						<div class="mr-1" title="In Queue">
							<Icon name="degabut" class="fill-brand-600 w-3.5 h-3.5" />
						</div>
					</Show>

					<Show when={props.video.duration > 0} fallback={<LiveBadge />}>
						<DurationBadge duration={props.video.duration} />
					</Show>

					<div class="truncate ml-2">
						<Show when={props.video.channel} keyed>
							{(channel) => <Text.Caption1 truncate>{channel.name}</Text.Caption1>}
						</Show>
						{props.requestedBy && (
							<Text.Caption2 truncate> — Requested by {props.requestedBy.displayName}</Text.Caption2>
						)}
					</div>
				</>
			}
		/>
	);
};

export const VideoListBig: Component<VideoListProps> = (props) => {
	return (
		<Item.ListBig
			{...props}
			title={props.video.title}
			thumbnails={props.video.thumbnails}
			onClick={() => props.onClick?.(props.video)}
			extra={
				<>
					<Show when={"viewCount" in props.video && props.video.viewCount} keyed>
						{(c) => <Text.Caption1>{c.toLocaleString("en-US")} views</Text.Caption1>}
					</Show>
					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail thumbnails={props.video.thumbnails} />
						<Show when={props.video.channel} keyed>
							{(channel) => <Text.Body2 truncate>{channel.name}</Text.Body2>}
						</Show>
					</div>
					<Show when={!props.video.duration}>
						<LiveBadge />
					</Show>
				</>
			}
		/>
	);
};

export const VideoListResponsive: Component<VideoListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<VideoList {...props} />}>
			<VideoListBig {...props} />
		</Show>
	);
};
