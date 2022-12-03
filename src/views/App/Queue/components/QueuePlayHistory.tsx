import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

export const QueuePlayHistory: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const history = () => queue.data.history || [];

	return (
		<>
			{!history().length ? (
				<div>Empty</div>
			) : (
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
			)}
		</>
	);
};
