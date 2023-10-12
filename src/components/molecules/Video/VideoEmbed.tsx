import { IVideoCompact } from "@api";
import { Component, JSX } from "solid-js";

type Props = {
	video: IVideoCompact;
	enableJsApi?: boolean;
	autoPlay?: boolean;
	showInfo?: boolean;
	controls?: boolean;
} & JSX.HTMLAttributes<HTMLIFrameElement>;

export const VideoEmbed: Component<Props> = (props) => {
	const src = () => {
		const params = new URLSearchParams();
		params.set("enablejsapi", props.enableJsApi ? "1" : "0");
		params.set("autoplay", props.autoPlay ? "1" : "0");
		params.set("showinfo", props.showInfo ? "1" : "0");

		return `https://www.youtube.com/embed/${props.video.id}?${params.toString()}`;
	};

	return <iframe {...props} class="w-full aspect-video max-w-3xl" src={src()} />;
};
