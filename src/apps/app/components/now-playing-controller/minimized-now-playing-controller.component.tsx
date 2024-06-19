import { Show, type Component } from "solid-js";

import { Button } from "@common";
import { useLikeMediaSource } from "@media-source";
import { QueueActions, QueueButton, useQueue } from "@queue";

export const MinimizedNowPlayingController: Component = () => {
	const queue = useQueue();

	return (
		<div class="grid grid-rows-5 py-4 h-full w-full">
			<div class="flex-col-center space-y-2 w-full">
				<Show when={queue.data.nowPlaying} keyed>
					{(track) => {
						const liked = useLikeMediaSource(() => track.mediaSource.id);
						return (
							<>
								<img src={track.mediaSource.maxThumbnailUrl} class="aspect-square object-cover" />
								<Button
									flat
									theme={liked?.isLiked() ? "brand" : "default"}
									icon={liked?.isLiked() ? "heart" : "heartLine"}
									onClick={liked?.toggle}
									class="p-2.5 justify-center"
									iconSize="lg"
								/>
							</>
						);
					}}
				</Show>
			</div>

			<QueueActions
				iconSize="lg"
				vertical
				extraClass="row-span-3 my-auto flex-items-center space-y-6"
				extraButtonClass="p-2.5"
			/>

			<div class="flex justify-center items-end">
				<QueueButton.Options
					extraClass="w-full justify-center p-2.5"
					onClearQueue={queue.clear}
					onStopQueue={queue.stop}
				/>
			</div>
		</div>
	);
};
