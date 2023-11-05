import { Icon, Item, ItemCardProps } from "@common/components";
import { contextMenu } from "@common/directives";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact } from "@youtube/apis";
import { Component, Show } from "solid-js";
import { DurationBadge, LiveBadge } from "./components";

contextMenu;

export type VideoCardProps = Omit<Partial<ItemCardProps>, "onClick"> & {
	video: IVideoCompact;
	inQueue?: boolean;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoCard: Component<VideoCardProps> = (props) => {
	const navigate = useNavigate();

	return (
		<Item.Card
			{...props}
			title={props.video.title}
			description={props.video.channel?.name}
			imageUrl={props.video.thumbnails.map((t) => t.url)}
			onClick={() => (props.onClick ? props.onClick(props.video) : navigate(`/app/video/${props.video.id}`))}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.video.duration > 0} fallback={<LiveBadge />}>
						<DurationBadge duration={props.video.duration} />
					</Show>

					<Show when={props.inQueue}>
						<Icon name="degabut" title="In Queue" class="fill-brand-600 w-3.5 h-3.5" />
					</Show>
				</div>
			)}
		/>
	);
};
