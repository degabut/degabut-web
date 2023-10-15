import { Button, Text } from "@components/atoms";
import { useSettings } from "@hooks/useSettings";
import { Component, Show, createEffect, createSignal } from "solid-js";
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
	const { settings, setSettings } = useSettings();
	const [isThumbnail, setIsThumbnail] = createSignal(settings.queue.showThumbnail);

	createEffect(() => setSettings("queue", { showThumbnail: isThumbnail() }));

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
