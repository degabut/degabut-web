import { Videos } from "@components/organisms";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";

export const QueuePlayHistory: Component = (props) => {
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
						contextMenu: getVideoContextMenu({
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
