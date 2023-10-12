import type { IGuildMember, IVideoCompact } from "@api";
import { Icon, Text } from "@components/atoms";
import { Item, ItemListProps } from "@components/molecules";
import { Component, Show } from "solid-js";
import { ChannelThumbnail, DurationBadge, LiveBadge } from "../components";

export type VideoListProps = {
	video: IVideoCompact;
	requestedBy?: IGuildMember | null;
	extraTitleClass?: string;
	inQueue?: boolean;
	onClick?: (video: IVideoCompact) => void;
} & Partial<ItemListProps>;

export const VideoList: Component<VideoListProps> = (props) => {
	return (
		<Item.List
			{...props}
			title={props.video.title}
			icon={props.video.thumbnails.map((t) => t.url)}
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

					<div class="flex-row-center truncate ml-2 space-x-1.5">
						<Show when={props.video.channel} keyed>
							{(channel) => <Text.Caption1 truncate>{channel.name}</Text.Caption1>}
						</Show>
						{props.requestedBy && (
							<>
								<Text.Caption2>—</Text.Caption2>
								<div class="flex-row-center space-x-1 truncate">
									<Show when={props.requestedBy.avatar} keyed>
										{(avatar) => <img src={avatar} class="h-4 w-4 rounded-full" />}
									</Show>
									<Text.Caption2>{props.requestedBy.displayName}</Text.Caption2>
								</div>
							</>
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
			icon={props.video.thumbnails.map((t) => t.url)}
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
