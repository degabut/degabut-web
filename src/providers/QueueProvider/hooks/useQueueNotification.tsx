import { IMember, ITrack } from "@api";
import { Text } from "@components/atoms";
import { useNotification } from "@hooks/useNotification";
import { useSettings } from "@hooks/useSettings";
import { notify } from "@utils/notification";
import { onMount } from "solid-js";
import TypedEventEmitter from "typed-emitter";
import { QueueEvents } from "./useQueueEvents";

type Params = {
	emitter: TypedEventEmitter<QueueEvents>;
};

export const useQueueNotification = ({ emitter }: Params) => {
	const { settings } = useSettings();
	const notification = useNotification();

	onMount(() => {
		emitter.on("queue-processed", onQueueProcessed);
		emitter.on("track-added", ({ track }) => onTrackAdded(track));
		emitter.on("tracks-added", ({ tracks, member }) => onTracksAdded(tracks, member));
		emitter.on("track-removed", ({ track, member }) => onTrackRemoved(track, member));
	});

	const onTrackAdded = async (track: ITrack) => {
		if (!settings.notification.inApp) return;

		notification.push({
			imageUrl: track.requestedBy.avatar,
			message: () => (
				<Text.Body2 title={`${track.requestedBy.displayName} added ${track.video.title} to the queue`}>
					<b>{track.requestedBy.displayName}</b> added <b>{track.video.title}</b> to the queue
				</Text.Body2>
			),
		});
	};

	const onTracksAdded = async (tracks: ITrack[], member: IMember) => {
		if (!settings.notification.inApp) return;

		const videoCount = tracks.length > 1 ? `${tracks.length} videos` : "a video";
		notification.push({
			imageUrl: member.avatar,
			message: () => (
				<Text.Body2 title={`${member.displayName} added ${videoCount} to the queue`}>
					<b>{member.displayName}</b> added <b>{videoCount}</b> to the queue
				</Text.Body2>
			),
		});
	};

	const onTrackRemoved = async (track: ITrack, member: IMember | null) => {
		if (!settings.notification.inApp || !member) return;

		notification.push({
			imageUrl: member.avatar,
			message: () => (
				<Text.Body2 title={`${member.displayName} removed ${track.video.title} from the queue`}>
					<b>{member.displayName}</b> removed <b>{track.video.title}</b> from the queue
				</Text.Body2>
			),
		});
	};

	const onQueueProcessed = async (nowPlaying: ITrack | null) => {
		if (!nowPlaying || !settings.notification.browser) return;

		let body = nowPlaying.video.title;
		if (nowPlaying.video.channel) body += `\n${nowPlaying.video.channel.name}`;

		const notification = await notify("Now Playing", {
			body,
			tag: "now-playing/" + nowPlaying.id,
		});

		if (!notification) return;
		notification.onclick = () => {
			window.focus();
			notification.close();
		};
	};
};
