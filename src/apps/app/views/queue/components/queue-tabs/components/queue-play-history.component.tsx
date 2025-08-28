import { MediaSources } from "@media-source";
import { useQueue } from "@queue";
import { type Component } from "solid-js";

export const QueuePlayHistory: Component = () => {
	const queue = useQueue()!;

	return (
		<MediaSources.List
			data={queue.data.history}
			mediaSourceProps={(t) => ({
				mediaSource: t.mediaSource,
				requestedBy: t.requestedBy,
				inQueue: queue.data.tracks?.some((qt) => qt.mediaSource.id === t.mediaSource.id),
			})}
		/>
	);
};
