import { AppRoutes } from "@app/routes";
import { A, Text, useNavigate } from "@common";
import { MediaSource } from "@media-source";
import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";

const EmptyNowPlaying: Component = () => {
	return (
		<div class="bg-neutral-950 w-full h-full p-1.5">
			<A href={AppRoutes.Player} class="flex-row-center items-center p-1.5 z-10 rounded bg-gray-800">
				<div class="flex-row-center space-x-3 truncate">
					<div class="h-12 w-12 border border-neutral-600 rounded" />

					<Text.Body1 class="text-neutral-400">Nothing is playing</Text.Body1>
				</div>
			</A>
		</div>
	);
};

export const QueueNowPlaying: Component = () => {
	const queue = useQueue()!;
	const navigate = useNavigate();

	return (
		<Show when={queue.data.nowPlaying} keyed fallback={<EmptyNowPlaying />}>
			{({ mediaSource }) => (
				<div class="relative bg-neutral-950 w-full h-full p-1.5">
					<Show when={queue.data.position} keyed>
						{(position) => (
							<div
								class="absolute top-0 bg-brand-500 h-0.5 -mx-1.5"
								style={{ width: `${position / 10 / mediaSource.duration}%` }}
							/>
						)}
					</Show>

					<div class="relative overflow-hidden rounded" title={mediaSource.title}>
						<img
							src={mediaSource.minThumbnailUrl}
							class="absolute top-0 left-0 h-full w-full blur-2xl opacity-75 pointer-events-none"
						/>

						<MediaSource.List
							extraContainerClass="relative text-shadow"
							mediaSource={mediaSource}
							onClick={() => navigate(AppRoutes.Player)}
							disableActiveTitle
							hideInQueue
							alwaysShowLikeButton
							hideContextMenuButton
							contextMenu={{ openWithClick: false }}
						/>
					</div>
				</div>
			)}
		</Show>
	);
};
