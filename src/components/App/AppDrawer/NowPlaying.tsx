import { VideoThumbnail } from "@components/Video/components";
import { useQueue } from "@hooks/useQueue";
import { QueueActions } from "@views/App/Queue";
import { Link as SolidLink } from "solid-app-router";
import { Component, Show } from "solid-js";

export const NowPlaying: Component = () => {
	const queue = useQueue();

	return (
		<div class="hidden md:block space-y-1">
			<Show when={queue.data()?.nowPlaying} keyed>
				{({ video, requestedBy }) => (
					<SolidLink
						href="/app/queue"
						class="flex flex-col py-4 px-2 space-y-3 cursor-pointer hover:bg-white/5 rounded"
						title={video.title}
					>
						<div class="text-lg font-medium">Now Playing</div>
						<VideoThumbnail video={video} extraContainerClass="!h-24" extraClass="!h-24 !w-full" />
						<div class="flex flex-row space-x-2">
							<div class="flex-grow flex flex-col truncate">
								<div class="truncate">{video.title}</div>
								<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
								<div class="truncate text-sm text-neutral-400">
									Requested By {requestedBy.displayName}
								</div>
							</div>
						</div>
					</SolidLink>
				)}
			</Show>

			<QueueActions extraClass="justify-evenly" hideSettings />
		</div>
	);
};
