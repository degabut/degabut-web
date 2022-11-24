import { IVideoCompact } from "@api";
import { Component } from "solid-js";

type Props = {
	video: IVideoCompact;
};

export const VideoEmbed: Component<Props> = (props) => {
	return <iframe class="w-full aspect-video" src={`https://www.youtube.com/embed/${props.video.id}`} />;
};
