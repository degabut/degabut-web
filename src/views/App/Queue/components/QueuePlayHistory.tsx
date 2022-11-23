import { ITrack, IVideoCompact } from "@api";
import { getVideoContextMenu } from "@components/Video";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

type Props = {
	tracks: ITrack[];
	onRemoveTrack?: (track: ITrack) => void;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	onAddToQueueAndPlay?: (video: IVideoCompact) => Promise<void>;
};

export const QueuePlayHistory: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<>
			{!props.tracks.length ? (
				<div>Empty</div>
			) : (
				<Videos.List
					data={props.tracks}
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
