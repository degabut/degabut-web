import { IVideoCompact } from "@api";
import { Videos } from "@components/organisms";
import { useQueue } from "@hooks/useQueue";
import { useApp } from "@providers/AppProvider";
import { useNavigate } from "@solidjs/router";
import { getVideoContextMenu } from "@utils/contextMenu";
import { Component, Show } from "solid-js";
import { ShowMoreTitle } from "./Title";

type Props = {
	onClickMore: () => void;
	videos: IVideoCompact[];
	label: string;
	double?: boolean;
	isLoading: boolean;
};

export const ExpandableVideoList: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	const videoProps = (video: IVideoCompact) => ({
		video,
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
			<Show
				when={props.double}
				fallback={
					<Videos.List
						title={<ShowMoreTitle {...props} />}
						isLoading={props.isLoading}
						data={props.videos}
						videoProps={videoProps}
					/>
				}
			>
				<Videos.DoubleList
					title={<ShowMoreTitle {...props} />}
					isLoading={props.isLoading}
					data={props.videos}
					videoProps={videoProps}
				/>
			</Show>
		</div>
	);
};
