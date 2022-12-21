import { IVideoCompact } from "@api";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { contextMenu } from "@directives/contextMenu";
import { ContextMenuDirectiveParams } from "@providers/ContextMenuProvider";
import { Component, Show } from "solid-js";
import { DurationBadge, LiveBadge } from "../components";

contextMenu;

type Props = {
	video: IVideoCompact;
	contextMenu?: ContextMenuDirectiveParams;
	disableContextMenu?: boolean;
	hideContextMenuButton?: boolean;
	extraContainerClass?: string;
	extraContainerClassList?: Record<string, boolean>;
	inQueue?: boolean;
	onClick?: (video: IVideoCompact) => void;
};

export const VideoCard: Component<Props> = (props) => {
	return (
		<div
			class="flex flex-col space-y-2"
			classList={{
				"cursor-pointer ": !!props.onClick,
				...props.extraContainerClassList,
				[props.extraContainerClass || ""]: !!props.extraContainerClass,
			}}
			use:contextMenu={props.disableContextMenu ? undefined : props.contextMenu}
			onClick={() => props.onClick?.(props.video)}
		>
			<img src={props.video.thumbnails.at(-1)?.url || ""} class="w-full rounded aspect-square object-cover" />

			<div class="flex flex-col space-y-0.5">
				<Text.Body1 class="w-full truncate font-normal">{props.video.title}</Text.Body1>
				<Text.Caption2 class="w-full truncate">{props.video.channel.name}</Text.Caption2>
			</div>

			<div class="flex-row-center space-x-1.5">
				<Show when={props.video.duration > 0} fallback={<LiveBadge />}>
					<DurationBadge video={props.video} />
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
