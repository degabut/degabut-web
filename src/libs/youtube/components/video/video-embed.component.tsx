import { Component, JSX } from "solid-js";

type Props = {
	initialVideoId?: string;
	initialParams?: {
		enableJsApi?: boolean;
		autoPlay?: boolean;
		disableKeyboard?: boolean;
		disableControls?: boolean;
	};
} & JSX.HTMLAttributes<HTMLIFrameElement>;

export const VideoEmbed: Component<Props> = (props) => {
	const params = new URLSearchParams();
	params.set("enablejsapi", props.initialParams?.enableJsApi === false ? "0" : "1");
	params.set("autoplay", props.initialParams?.autoPlay ? "1" : "0");
	params.set("controls", props.initialParams?.disableControls ? "0" : "1");
	params.set("disablekb", props.initialParams?.disableKeyboard ? "1" : "0");

	const src = `https://www.youtube.com/embed/${props.initialVideoId}?${params.toString()}`;

	return <iframe {...props} class="w-full aspect-video" src={src} />;
};
