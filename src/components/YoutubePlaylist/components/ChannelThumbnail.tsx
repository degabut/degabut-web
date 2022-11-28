import { IPlaylistCompact } from "@api";
import { Component, createMemo, Show } from "solid-js";

type Props = {
	playlist: IPlaylistCompact;
};

export const ChannelThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() => props.playlist.channel?.thumbnails?.at(0)?.url);

	return (
		<Show when={thumbnail()}>
			<img src={thumbnail()} class="w-8 h-8 rounded-full" alt={props.playlist.channel?.name} />
		</Show>
	);
};
