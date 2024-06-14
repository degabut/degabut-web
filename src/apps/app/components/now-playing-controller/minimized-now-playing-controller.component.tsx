import { Show, type Component } from "solid-js";

import { Button } from "@common";
import { useLikeMediaSource } from "@media-source";
import { QueueActions, useQueue } from "@queue";
import { useSettings } from "@settings";

export const MinimizedNowPlayingController: Component = () => {
	const queue = useQueue();
	const { setSettings } = useSettings();

	return (
		<div class="relative flex-col-center justify-between py-4 h-full w-full">
			<div class="w-full aspect-square px-1">
				<Show when={queue.data.nowPlaying} keyed>
					{(track) => <img src={track.mediaSource.maxThumbnailUrl} class="aspect-square" />}
				</Show>
			</div>

			<QueueActions
				iconSize="lg"
				vertical
				extraClass="flex-items-center justify-between space-y-6"
				extraButtonClass="p-2.5"
			/>

			<div class="flex-col-center justify-between w-full pt-1.5">
				<Show
					when={queue.data.nowPlaying?.mediaSource}
					keyed
					fallback={<Button flat icon="heartLine" disabled class="p-4" iconSize="lg" />}
				>
					{(mediaSource) => {
						const liked = useLikeMediaSource(() => mediaSource.id);
						return (
							<Button
								flat
								icon={liked?.isLiked() ? "heart" : "heartLine"}
								iconClassList={{ "text-brand-600": liked?.isLiked() }}
								onClick={liked?.toggle}
								class="p-4"
								iconSize="lg"
							/>
						);
					}}
				</Show>

				<Button
					flat
					icon="chevronDown"
					title="Minimize"
					onClick={() => setSettings("app.player.minimized", true)}
					class="p-4"
					iconSize="lg"
				/>
			</div>
		</div>
	);
};
