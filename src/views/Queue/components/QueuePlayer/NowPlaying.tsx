import { ITrack } from "@api";
import { Video } from "@components/Video";
import { useApp } from "@hooks/useApp";
import { useQueue } from "@hooks/useQueue";
import { getVideoContextMenu } from "@utils";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

type Props = {
	track: ITrack;
};

export const NowPlaying: Component<Props> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<div class="w-full">
			<img
				src={props.track.video.thumbnails.at(0)?.url}
				class="absolute top-0 left-0 h-full w-full blur-3xl opacity-50 -z-[1000] pointer-events-none"
			/>

			<Video.List
				video={props.track.video}
				requestedBy={props.track.requestedBy}
				onClick={() => navigate(`/app/video/${props.track.video.id}`)}
				extraThumbnailClass="!w-16 !h-16"
				extraTitleClass="!text-lg font-medium bg-opacity-10"
				contextMenu={getVideoContextMenu({
					modifyContextMenuItems: (items) => {
						items.shift();
						return items;
					},
					video: props.track.video,
					appStore: app,
					queueStore: queue,
					navigate,
				})}
			/>
		</div>
	);
};
