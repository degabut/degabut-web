import { Divider, Modal, Text } from "@common";
import { MediaSource, MediaSourceFactory } from "@media-source";
import { YouTubePlaylist ,type  IVideo,type  IYouTubeMixPlaylist,type  IYouTubePlaylist  } from "@youtube";
import type { Component } from "solid-js";

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
			handleClose={() => props.onClose()}
		>
			<div class="space-y-8 py-8 px-2 md:px-8">
				<div class="flex-col-center space-y-4">
					<Text.H2>Add to Queue</Text.H2>
					<Text.Body1>Which item would you like to add to the queue?</Text.Body1>
				</div>

				<div class="space-y-1">
					<MediaSource.List
						mediaSource={MediaSourceFactory.fromYoutubeVideo(props.video)}
						onClick={() => props.onChoose(props.video)}
					/>

					<div class="flex-row-center space-x-4">
						<Divider light />
						<Text.Caption1>or</Text.Caption1>
						<Divider light />
					</div>

					<YouTubePlaylist.List playlist={props.playlist} onClick={() => props.onChoose(props.playlist)} />
				</div>
			</div>
		</Modal>
	);
};
