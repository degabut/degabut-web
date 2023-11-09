import { useApp } from "@app/hooks";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Videos } from "@youtube/components";
import { YouTubeContextMenuUtil } from "@youtube/utils";
import { Component, Show } from "solid-js";

export const QueuePlayHistory: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<Show when={queue.data.history} keyed>
			{(tracks) => (
				<Videos.List
					data={tracks}
					videoProps={(t) => ({
						video: t.video,
						requestedBy: t.requestedBy,
						inQueue: queue.data.tracks?.some((qt) => qt.video.id === t.video.id),
						contextMenu: YouTubeContextMenuUtil.getVideoContextMenu({
							video: t.video,
							appStore: app,
							queueStore: queue,
							navigate,
						}),
					})}
				/>
			)}
		</Show>
	);
};
