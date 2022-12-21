import { IVideoCompact } from "@api";
import { ContextMenuButton } from "@components/ContextMenu";
import { Text } from "@components/Text";
import { ChannelThumbnail, Video } from "@components/Video";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
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

			<div class="flex flex-col">
				<div class="flex flex-row items-center justify-between">
					<Text.H3 truncate title={`${props.video.title} - ${props.video.channel.name}`}>
						{props.video.title}
					</Text.H3>

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
						{(c) => <Text.Caption1>{c.toLocaleString("en-US")} views</Text.Caption1>}
					</Show>

					<div class="flex-row-center space-x-2 text-sm">
						<ChannelThumbnail video={props.video} />
						<Text.Body1>{props.video.channel.name}</Text.Body1>
					</div>
				</div>
			</div>
		</div>
	);
};
