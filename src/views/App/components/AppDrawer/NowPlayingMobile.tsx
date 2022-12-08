import { Icon } from "@components/Icon";
import { VideoThumbnail } from "@components/Video/components";
import { useQueue } from "@hooks/useQueue";
import { Link as SolidLink } from "solid-app-router";
import { Component, Show } from "solid-js";

export const NowPlayingMobile: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying} keyed>
			{({ video }) => (
				<div class="bg-neutral-900 w-full">
					<SolidLink
						href="/app/queue"
						class="relative overflow-hidden flex-row-center m-1.5 p-2 z-10 rounded cursor-pointer bg-gray-800"
						title={video.title}
					>
						<img
							src={video.thumbnails.at(0)?.url}
							class="absolute top-0 left-0 h-full w-full blur-2xl -z-10 pointer-events-none"
						/>

						<div class="flex-row-center space-x-3 truncate">
							<VideoThumbnail video={video} />

							<div class="flex flex-col truncate text-shadow">
								<div class="truncate">{video.title}</div>
								<div class="truncate text-sm text-neutral-300">{video.channel.name}</div>
							</div>
						</div>

						<Icon name="musicNote" extraClass="absolute right-2 w-12 h-12 fill-white/10" />
					</SolidLink>

					<Show when={queue.data.position} keyed>
						{(position) => (
							<div class="bg-brand-500 h-1" style={{ width: `${position / 10 / video.duration}%` }} />
						)}
					</Show>
				</div>
			)}
		</Show>
	);
};
