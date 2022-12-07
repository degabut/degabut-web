import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useSearchable } from "@hooks/useSearchable";
import { getVideoContextMenu } from "@utils";
import { useNavigate } from "solid-app-router";
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
			const keys = [video.title, video.channel.name];
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
