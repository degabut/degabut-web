import { onMount, type Component, type JSX } from "solid-js";
import { YouTubeIframeUtil } from "../../utils";

type Props = {
	onReady?: (e: YT.PlayerEvent) => void;
	initialVideoId?: string;
	initialParams?: {
		enableJsApi?: boolean;
		autoPlay?: boolean;
		disableKeyboard?: boolean;
		disableControls?: boolean;
	};
} & JSX.HTMLAttributes<HTMLIFrameElement>;

// TODO discord activity support
export const VideoEmbed: Component<Props> = (props) => {
	let iframeRef!: HTMLIFrameElement;

	const params = new URLSearchParams();
	params.set("enablejsapi", props.initialParams?.enableJsApi === false ? "0" : "1");
	params.set("autoplay", props.initialParams?.autoPlay ? "1" : "0");
	params.set("controls", props.initialParams?.disableControls ? "0" : "1");
	params.set("disablekb", props.initialParams?.disableKeyboard ? "1" : "0");

	onMount(() => {
		if (!window.YT) {
			window.onYouTubeIframeAPIReady = onIframeReady;
			YouTubeIframeUtil.loadApi();
		} else {
			onIframeReady();
		}
	});

	const onIframeReady = () => new YT.Player(iframeRef, { events: { onReady: props.onReady } });

	return (
		<iframe
			{...props}
			ref={iframeRef}
			class="w-full aspect-video"
			src={`https://www.youtube.com/embed/${props.initialVideoId}?${params.toString()}`}
		/>
	);
};
