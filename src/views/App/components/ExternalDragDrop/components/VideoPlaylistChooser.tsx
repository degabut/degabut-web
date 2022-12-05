import { IMixPlaylist, IVideo, IYoutubePlaylist } from "@api";
import { Divider } from "@components/Divider";
import { Modal } from "@components/Modal";
import { Video } from "@components/Video";
import { YouTubePlaylist } from "@components/YoutubePlaylist";
import { Component } from "solid-js";

type Props = {
	video: IVideo;
	playlist: IYoutubePlaylist | IMixPlaylist;
	onChoose: (item: IVideo | IYoutubePlaylist | IMixPlaylist) => void;
	onClose: () => void;
};

export const VideoPlaylistChooser: Component<Props> = (props) => {
	return (
		<Modal
			extraContainerClass="absolute bg-neutral-900 w-[42rem] overflow-auto"
			isOpen={true}
			closeOnEscape
			onClickOutside={() => props.onClose()}
		>
			<div class="space-y-8 bg-neutral-900 py-8 px-2 md:px-8">
				<div>
					<div class="text-xl font-medium text-center mb-4">Add to Queue</div>
					<div class="text-center text-lg text-neutral-300">
						Which item would you like to add to the queue?
					</div>
				</div>

				<div class="space-y-1">
					<Video.List disableContextMenu video={props.video} onClick={() => props.onChoose(props.video)} />

					<div class="flex-row-center space-x-4">
						<Divider light extraClass="w-full" />
						<div class="text-neutral-400">or</div>
						<Divider light extraClass="w-full" />
					</div>

					<YouTubePlaylist.List
						disableContextMenu
						playlist={props.playlist}
						onClick={() => props.onChoose(props.playlist)}
					/>
				</div>
			</div>
		</Modal>
	);
};
