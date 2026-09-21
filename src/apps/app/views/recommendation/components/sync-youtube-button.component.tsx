import { useApp } from "@app/providers";
import { Button, Text } from "@common";
import { useYouTubeConnect, YouTubeConnectionState } from "@youtube";
import { createMemo, type Component } from "solid-js";

type Props = {
	defaultPlaylistName: string;
	videoIds: () => Promise<string[]>;
};

export const SyncYouTubeButton: Component<Props> = (props) => {
	const youtube = useYouTubeConnect();
	const app = useApp();

	const isConnected = createMemo(() => youtube.state?.() === YouTubeConnectionState.Connected);

	const onClick = () => {
		if (!isConnected()) {
			app?.setConfirmation?.({
				title: "YouTube Not Connected",
				message: "Please connect your YouTube account in Settings to sync playlists.",
				isAlert: true,
			});
		} else {
			youtube.setSyncRequest?.({ videoIds: props.videoIds, defaultPlaylistName: props.defaultPlaylistName });
		}
	};

	return (
		<Button
			flat
			class="px-2 py-1 space-x-1.5"
			classList={{ "opacity-50": !props.videoIds }}
			disabled={!props.videoIds}
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
	);
};
