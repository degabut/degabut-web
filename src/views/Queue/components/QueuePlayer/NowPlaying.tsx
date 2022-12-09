import { ITrack } from "@api";
import { RouterLink } from "@components/A";
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
	);
};

export const EmptyNowPlaying: Component = () => {
	return (
		<RouterLink
			href="/app/recommendation"
			class="flex flex-row items-center w-full space-x-4 p-1.5 hover:bg-white/[2.5%] rounded"
		>
			<div class="!w-16 !h-16 rounded border border-neutral-600" />
			<div class="text-neutral-400">It's lonely here...</div>
		</RouterLink>
	);
};
