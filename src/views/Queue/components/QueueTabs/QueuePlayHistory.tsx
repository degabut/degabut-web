import { Videos } from "@components/Videos";
import { useQueue } from "@hooks/useQueue";
import { useSearchable } from "@hooks/useSearchable";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";

type Props = {
	keyword: string;
};

export const QueuePlayHistory: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const history = useSearchable({
		keyword: () => props.keyword,
		items: () => queue.data.history || [],
		keys: ({ video, requestedBy }) => {
			const keys = [video.title];
			if (video.channel) keys.push(video.channel.name);
			if (requestedBy) keys.push(requestedBy.displayName, requestedBy.nickname, requestedBy.username);
			return keys;
		},
	});

	return (
		<Show when={history().length} fallback={<div>Empty</div>}>
			<Videos.List
				data={history()}
				videoProps={(t) => ({
					video: t.video,
					requestedBy: t.requestedBy,
					inQueue: queue.data.tracks?.some((t) => t.video.id === t.video.id),
					contextMenu: getVideoContextMenu({
						video: t.video,
						appStore: app,
						queueStore: queue,
						navigate,
					}),
				})}
			/>
		</Show>
	);
};
