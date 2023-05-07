import { RouterLink } from "@components/A";
import { Icon } from "@components/Icon";
import { Text } from "@components/Text";
import { VideoListThumbnail } from "@components/Video";
import { useQueue } from "@hooks/useQueue";
import { Component, Show } from "solid-js";

export const QueuePlayer: Component = () => {
	const queue = useQueue();

	return (
		<Show when={queue.data.nowPlaying} keyed>
			{({ video }) => (
				<div class="bg-neutral-950 w-full h-full">
					<Show when={queue.data.position} keyed>
						{(position) => (
							<div class="bg-brand-500 h-0.5" style={{ width: `${position / 10 / video.duration}%` }} />
						)}
					</Show>

					<RouterLink
						href="/app/queue/player"
						class="relative overflow-hidden flex-row-center m-1.5 p-2 z-10 rounded cursor-pointer bg-gray-800"
						title={video.title}
					>
						<img
							src={video.thumbnails.at(0)?.url}
							class="absolute top-0 left-0 h-full w-full blur-2xl -z-10 pointer-events-none"
						/>

						<div class="flex-row-center space-x-3 truncate">
							<VideoListThumbnail video={video} />

							<div class="flex flex-col truncate text-shadow">
								<Text.Body1 class="truncate">{video.title}</Text.Body1>
								<Show when={video.channel} keyed>
									{(channel) => (
										<Text.Body2 class="truncate text-sm text-neutral-300">
											{channel.name}
										</Text.Body2>
									)}
								</Show>
							</div>
						</div>

						<Icon name="musicNotes" extraClass="absolute right-2 w-12 h-12 fill-white/10" />
					</RouterLink>
				</div>
			)}
		</Show>
	);
};
