import { Divider, Modal } from "@common/components";
import { IVideo, IYouTubeMixPlaylist, IYouTubePlaylist } from "@youtube/apis";
import { Video, YouTubePlaylist } from "@youtube/components";
import { Component } from "solid-js";

type Props = {
	video: IVideo;
	playlist: IYouTubePlaylist | IYouTubeMixPlaylist;
	onChoose: (item: IVideo | IYouTubePlaylist | IYouTubeMixPlaylist) => void;
	onClose: () => void;
};

export const VideoPlaylistChooser: Component<Props> = (props) => {
	return (
		<Modal
			extraContainerClass="absolute w-[42rem] overflow-auto"
			isOpen={true}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<div class="space-y-8 py-8 px-2 md:px-8">
				<div>
					<div class="text-xl font-medium text-center mb-4">Add to Queue</div>
					<div class="text-center text-lg text-neutral-300">
						Which item would you like to add to the queue?
					</div>
				</div>

				<div class="space-y-1">
					<Video.List video={props.video} onClick={() => props.onChoose(props.video)} />

					<div class="flex-row-center space-x-4">
						<Divider light />
						<div class="text-neutral-400">or</div>
						<Divider light />
					</div>

					<YouTubePlaylist.List playlist={props.playlist} onClick={() => props.onChoose(props.playlist)} />
				</div>
			</div>
		</Modal>
	);
};