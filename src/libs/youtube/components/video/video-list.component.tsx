import { Icon, Item, ItemListProps, Text } from "@common/components";
import { IGuildMember } from "@queue/apis";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact } from "@youtube/apis";
import { Component, Show } from "solid-js";
import { Thumbnail } from "../thumbnail";
import { DurationBadge, LiveBadge } from "./components";

export type VideoListProps = Omit<Partial<ItemListProps>, "onClick"> & {
	video: IVideoCompact;
	requestedBy?: IGuildMember | null;
	inQueue?: boolean;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoList: Component<VideoListProps> = (props) => {
	const navigate = useNavigate();

	return (
		<Item.List
			{...props}
			title={props.video.title}
			imageUrl={props.video.thumbnails.map((t) => t.url)}
			onClick={() => (props.onClick ? props.onClick(props.video) : navigate(`/video/${props.video.id}`))}
			extra={() => (
				<>
					<Show when={props.inQueue}>
						<div class="mr-1" title="In Queue">
							<Icon name="degabut" size="sm" class="fill-brand-600" />
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
			)}
		/>
	);
};

export const VideoListBig: Component<VideoListProps> = (props) => {
	const navigate = useNavigate();

	return (
		<Item.ListBig
			{...props}
			title={props.video.title}
			imageUrl={props.video.thumbnails.map((t) => t.url)}
			onClick={() => (props.onClick ? props.onClick(props.video) : navigate(`/video/${props.video.id}`))}
			extra={() => (
				<>
					<Show when={"viewCount" in props.video && props.video.viewCount} keyed>
						{(c) => <Text.Caption1>{c.toLocaleString("en-US")} views</Text.Caption1>}
					</Show>
					<div class="flex-row-center space-x-2 text-sm">
						<Thumbnail.Channel thumbnails={props.video.thumbnails} />
						<Show when={props.video.channel} keyed>
							{(channel) => <Text.Body2 truncate>{channel.name}</Text.Body2>}
						</Show>
					</div>
					<Show when={!props.video.duration}>
						<LiveBadge />
					</Show>
				</>
			)}
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
