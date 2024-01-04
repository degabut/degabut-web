import { useApp } from "@app/hooks";
import { MediaSources } from "@media-source/components";
import { MediaSourceContextMenuUtil } from "@media-source/utils";
import { useQueue } from "@queue/hooks";
import { useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";

export const QueuePlayHistory: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<Show when={queue.data.history} keyed>
			{(tracks) => (
				<MediaSources.List
					data={tracks}
					mediaSourceProps={(t) => ({
						mediaSource: t.mediaSource,
						requestedBy: t.requestedBy,
						inQueue: queue.data.tracks?.some((qt) => qt.mediaSource.id === t.mediaSource.id),
						contextMenu: MediaSourceContextMenuUtil.getContextMenu({
							mediaSource: t.mediaSource,
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
