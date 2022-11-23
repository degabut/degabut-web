import { IVideoCompact } from "@api";
import { secondsToTime } from "@utils";
import { Component } from "solid-js";

type Props = {
	video: IVideoCompact;
	extraClass?: string;
	extraContainerClass?: string;
};

export const VideoThumbnail: Component<Props> = (props) => {
	return (
		<img
			src={props.video.thumbnails[0]?.url}
			alt={props.video.title}
			class={`h-12 w-12 object-cover rounded ${props.extraClass}`}
		/>
	);
};

export const VideoThumbnailBig: Component<Props> = (props) => {
	return (
		<div class={`relative flex bg-black rounded ${props.extraContainerClass}`}>
			<div class="sm:w-[16rem] sm:h-[9rem] mx-auto">
				<img
					src={props.video.thumbnails.at(-1)?.url}
					alt={props.video.title}
					class={`h-full w-full relative object-cover rounded ${props.extraClass}`}
				/>
			</div>
			<div class="absolute bottom-0 right-0 text-sm bg-black/90 py-1 px-2 rounded-br">
				{secondsToTime(props.video.duration)}
			</div>
		</div>
	);
};
