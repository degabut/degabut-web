import { Button, Text } from "@common";
import { useYouTubeConnect, YouTubeConnectionState } from "@youtube";
import { createMemo, Show, type Component } from "solid-js";

type Props = {
	defaultPlaylistName: string;
	videoIds: () => Promise<string[]>;
};

export const SyncYouTubeButton: Component<Props> = (props) => {
	const youtube = useYouTubeConnect();

	const state = createMemo(() => youtube.state?.() ?? YouTubeConnectionState.Disconnected);
	const isConnected = createMemo(() => state() === YouTubeConnectionState.Connected);

	const onClick = () => {
		youtube.setSyncRequest?.({ videoIds: props.videoIds, defaultPlaylistName: props.defaultPlaylistName });
	};

	return (
		<Show when={state() !== YouTubeConnectionState.Disabled}>
			<Button
				flat
				class="px-2 py-1 space-x-1.5"
				disabled={!isConnected() || !props.videoIds}
				onClick={onClick}
				title={
					isConnected()
						? `Sync to YouTube (${props.defaultPlaylistName})`
						: "Connect your YouTube account in Settings to sync playlists"
				}
			>
				<img src="/img/youtube.png" class="w-4 h-4 text-neutral-400" />
				<Text.Caption1>Sync</Text.Caption1>
			</Button>
		</Show>
	);
};
