import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { Show, type Component } from "solid-js";

export const QueuePlayHistory: Component = () => {
	const queue = useQueue()!;

	return (
		<Show when={queue.data.history} keyed>
			{(tracks) => (
				<MediaSources.List
					data={tracks}
					mediaSourceProps={(t) => ({
						mediaSource: t.mediaSource,
						requestedBy: t.requestedBy,
						inQueue: queue.data.tracks?.some((qt) => qt.mediaSource.id === t.mediaSource.id),
					})}
				/>
			)}
		</Show>
	);
};
