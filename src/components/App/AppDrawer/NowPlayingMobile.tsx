import { Icon } from "@components/Icon";
import { VideoThumbnail } from "@components/Video/components";
import { useQueue } from "@hooks/useQueue";
import { Link as SolidLink } from "solid-app-router";
import { Component, Show } from "solid-js";

export const NowPlayingMobile: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data()?.nowPlaying} keyed>
			{({ video }) => (
				<div class="bg-neutral-900 w-full p-1.5">
					<SolidLink
						href="/app/queue"
						class="flex-row-center space-x-3 p-2 rounded bg-gray-800 cursor-pointer"
						title={video.title}
					>
						<VideoThumbnail video={video} />
						<div class="flex flex-col truncate">
							<div class="truncate">{video.title}</div>
							<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
						</div>

						<Icon name="musicNote" extraClass="absolute right-4 w-12 h-12 fill-white/10" />
					</SolidLink>
				</div>
			)}
		</Show>
	);
};
