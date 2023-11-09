import { useApp } from "@app/hooks";
import { Icon, RouterLink, Text } from "@common/components";
import { contextMenu } from "@common/directives";
import { QueueActions } from "@queue/components";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show } from "solid-js";

contextMenu;

export const PreviewThumbnail: Component = () => {
	const queue = useQueue();
	const app = useApp();
	const navigate = useNavigate();

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<Skeleton />}>
			{({ video }) => (
				<div
					class="relative w-full max-w-[32rem] aspect-square mx-auto"
					use:contextMenu={YouTubeContextMenuUtil.getVideoContextMenu({
						queueStore: queue,
						appStore: app,
						navigate,
						video,
					})}
				>
					<div class="absolute w-full h-full opacity-0 hover:opacity-100 transition flex items-end">
						<div class="w-full flex flex-col justify-end min-h-[50%] bg-gradient-to-t from-black to-black/0">
							<RouterLink
								href={`/app/video/${video.id}`}
								class="text-center space-y-2 truncate text-shadow px-4"
							>
								<Text.H1 truncate>{video.title}</Text.H1>
								<Text.Body2 truncate>{video.channel?.name}</Text.Body2>
							</RouterLink>
							<QueueActions
								extraClass="w-full justify-evenly py-4"
								extraButtonClass="p-4"
								iconSize="lg"
							/>
						</div>
					</div>
					<img src={video.thumbnails.at(-1)?.url || ""} class="h-full object-cover" />
				</div>
			)}
		</Show>
	);
};

const Skeleton: Component = () => {
	return (
		<div class="w-full max-w-[32rem] aspect-square mx-auto border border-white opacity-10 flex items-center justify-center">
			<Icon name="musicNotes" extraClass="fill-white h-[50%] w-auto p-8" />
		</div>
	);
};
