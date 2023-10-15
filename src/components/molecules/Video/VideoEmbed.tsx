import { IVideoCompact } from "@api";
import { Component, JSX } from "solid-js";

type BaseProps = {
	enableJsApi?: boolean;
	autoPlay?: boolean;
	disableKeyboard?: boolean;
	disableControls?: boolean;
} & JSX.HTMLAttributes<HTMLIFrameElement>;

type Props = BaseProps & ({ videoId: string } | { video: IVideoCompact });

export const VideoEmbed: Component<Props> = (props) => {
	const src = () => {
		const params = new URLSearchParams();
		params.set("enablejsapi", props.enableJsApi === false ? "0" : "1");
		params.set("autoplay", props.autoPlay ? "1" : "0");
		params.set("controls", props.disableControls ? "0" : "1");
		params.set("disablekb", props.disableKeyboard ? "1" : "0");

		const videoId = "videoId" in props ? props.videoId : props.video.id;

		return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
	};

	return <iframe {...props} class="w-full aspect-video" src={src()} />;
};
