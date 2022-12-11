import { IVideoCompact } from "@api";
import { Videos } from "@components/Videos";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";
import { ShowMoreTitle } from "./Title";

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	isLoading: boolean;
};

export const ExpandableVideoGrid: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (video: IVideoCompact) => ({
		video,
		onClick: () => {},
		inQueue: queue.data.tracks?.some((t) => t.video.id === video.id),
		contextMenu: getVideoContextMenu({
			appStore: app,
			queueStore: queue,
			navigate,
			video,
		}),
	});

	return (
		<div class="space-y-4">
			<Videos.Grid
				title={<ShowMoreTitle {...props} />}
				data={props.videos}
				isLoading={props.isLoading}
				videoProps={videoProps}
				skeletonCount={7}
			/>
		</div>
	);
};
