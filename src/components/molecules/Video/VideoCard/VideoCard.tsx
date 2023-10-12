import { IVideoCompact } from "@api";
import { Icon, Text } from "@components/atoms";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, JSX, Show } from "solid-js";
import { DurationBadge, LiveBadge } from "../components";

contextMenu;

export type VideoCardProps = {
	video: IVideoCompact;
	contextMenu?: ContextMenuDirectiveParams;
	thumbnailHoverElement?: JSX.Element;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	extraThumbnailClass?: string;
	inQueue?: boolean;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoCard: Component<VideoCardProps> = (props) => {
	return (
		<div
			class="flex flex-col space-y-2"
			classList={{
				"cursor-pointer ": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			<div class="relative">
				{props.thumbnailHoverElement}
				<img
					src={props.video.thumbnails.at(-1)?.url || ""}
					class="w-full rounded-md aspect-square object-cover"
					classList={{ [props.extraThumbnailClass || ""]: !!props.extraThumbnailClass }}
				/>
			</div>

			<div class="flex flex-col space-y-0.5">
				<Text.Body1 class="w-full truncate font-normal hover:underline underline-offset-2">
					{props.video.title}
				</Text.Body1>
				<Show when={props.video.channel} keyed>
					{(channel) => <Text.Caption2 class="w-full truncate">{channel.name}</Text.Caption2>}
				</Show>
			</div>

			<div class="flex-row-center space-x-1.5">
				<Show when={props.video.duration > 0} fallback={<LiveBadge />}>
					<DurationBadge duration={props.video.duration} />
				</Show>

				<Show when={props.inQueue}>
					<div title="In Queue">
						<Icon name="degabut" class="fill-brand-600 w-3.5 h-3.5" />
					</div>
				</Show>
			</div>
		</div>
	);
};
