import { IThumbnail } from "@api";
import { Component, createMemo, Show } from "solid-js";

type Props = {
	thumbnails: IThumbnail[];
};

export const ChannelThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() => props.thumbnails?.at(0)?.url);

	return (
		<Show when={thumbnail()}>
			<img src={thumbnail()} class="w-8 h-8 rounded-full" />
		</Show>
	);
};
