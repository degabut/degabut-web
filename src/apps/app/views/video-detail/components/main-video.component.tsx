import { useApp } from "@app/hooks";
import { ContextMenuButton, Text } from "@common/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { IVideoCompact } from "@youtube/apis";
import { Thumbnail, Video } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
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
			<Video.Embed initialVideoId={props.video.id} />

			<div class="flex flex-col">
				<div class="flex flex-row items-center justify-between">
					<Text.H3
						truncate
						title={props.video.title + (props.video.channel ? ` - ${props.video.channel.name}` : "")}
					>
						{props.video.title}
					</Text.H3>

					<ContextMenuButton
						contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
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
						<Show when={props.video.channel} keyed>
							{(channel) => (
								<>
									<Thumbnail.Channel thumbnails={props.video.thumbnails} />
									<Text.Body1>{channel.name}</Text.Body1>
								</>
							)}
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
};
