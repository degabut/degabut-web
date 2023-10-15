import { Button, Text } from "@components/atoms";
import { Component, createSignal, Show } from "solid-js";
import { NowPlayingEmbed, NowPlayingThumbnail } from "./components";

type Props = {
	text: string;
	isActive: boolean;
	onClick: () => void;
};

const SelectorButton: Component<Props> = (props) => {
	return (
		<Button class="px-4 py-1" flat={props.isActive} onClick={props.onClick}>
			<Text.Body2>{props.text}</Text.Body2>
		</Button>
	);
};

export const NowPlaying: Component = () => {
	const [isThumbnail, setIsThumbnail] = createSignal(true);

	return (
		<div class="flex flex-col h-full">
			<div class="flex-row-center justify-center space-x-4 w-full">
				<SelectorButton text="Thumbnail" isActive={!isThumbnail()} onClick={() => setIsThumbnail(true)} />
				<SelectorButton text="Video" isActive={isThumbnail()} onClick={() => setIsThumbnail(false)} />
			</div>

			<div class="grow flex-row-center">
				<Show when={isThumbnail()} fallback={<NowPlayingEmbed />}>
					<NowPlayingThumbnail />
				</Show>
			</div>
		</div>
	);
};
