import { IVideoCompact } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Video } from "@components/Video";
import { ChannelThumbnail } from "@components/Video/components";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { useNavigate } from "solid-app-router";
import { Component, Show } from "solid-js";

type Props = {
	video: IVideoCompact;
};

export const MainVideo: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="flex flex-col space-y-3">
			<Video.Embed video={props.video} />

			<div class="flex flex-col flex-grow flex-shrink">
				<div class="flex flex-row items-center justify-between">
					<div
						class="truncate text-lg font-medium"
						title={`${props.video.title} - ${props.video.channel.name}`}
					>
						{props.video.title}
					</div>

					<ContextMenuButton
						contextMenu={getVideoContextMenu({
							video: props.video,
							appStore: app,
							queueStore: queue,
							navigate,
						})}
					/>
				</div>

				<div class="space-y-2">
					<Show when={props.video.viewCount} keyed>
						{(c) => <div class="text-neutral-400 text-sm">{c.toLocaleString("en-US")} views</div>}
					</Show>

					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail video={props.video} />
						<div>{props.video.channel.name}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
