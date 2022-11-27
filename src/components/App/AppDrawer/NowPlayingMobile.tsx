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
						class="relative overflow-hidden flex-row-center p-2 z-10 rounded cursor-pointer bg-gray-800"
						title={video.title}
					>
						<img
							src={video.thumbnails.at(0)?.url}
							class="absolute top-0 left-0 h-full w-full blur-3xl -z-10 pointer-events-none"
						/>

						<div class="flex-row-center space-x-3 truncate">
							<VideoThumbnail video={video} />

							<div class="flex flex-col truncate">
								<div class="truncate">{video.title}</div>
								<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
							</div>
						</div>

						<Icon name="musicNote" extraClass="absolute right-2 w-12 h-12 fill-white/10" />
					</SolidLink>
				</div>
			)}
		</Show>
	);
};
