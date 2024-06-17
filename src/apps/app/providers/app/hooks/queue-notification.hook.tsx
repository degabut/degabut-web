import { NotificationUtil, Text, useNotification } from "@common";
import { useQueue, type IMember, type ITrack } from "@queue";
import { useSettings } from "@settings";
import { onCleanup, onMount } from "solid-js";

export const useQueueNotification = () => {
	const { emitter } = useQueue();
	const { settings } = useSettings();
	const notification = useNotification();

	onMount(() => {
		emitter.on("queue-processed", onQueueProcessed);
		emitter.on("queue-cleared", onQueueCleared);
		emitter.on("tracks-added", onTracksAdded);
		emitter.on("tracks-removed", onTracksRemoved);
	});

	onCleanup(() => {
		emitter.removeListener("queue-processed", onQueueProcessed);
		emitter.removeListener("queue-cleared", onQueueCleared);
		emitter.removeListener("tracks-added", onTracksAdded);
		emitter.removeListener("tracks-removed", onTracksRemoved);
	});

	const onTracksAdded = async ({ tracks, member }: { tracks: ITrack[]; member: IMember }) => {
		if (!settings["notification.inApp"]) return;

		if (tracks.length > 1) {
			notification.push({
				imageUrl: member.avatar,
				message: () => (
					<Text.Body2 title={`${member.displayName} added ${tracks.length} tracks to the queue`}>
						<b>{member.displayName}</b> added <b>{tracks.length} tracks</b> to the queue
					</Text.Body2>
				),
			});
		} else {
			const track = tracks.at(0);
			if (!track) return;

			notification.push({
				imageUrl: member.avatar,
				message: () => (
					<Text.Body2
						title={`${track.requestedBy.displayName} added ${track.mediaSource.title} to the queue`}
					>
						<b>{track.requestedBy.displayName}</b> added <b>{track.mediaSource.title}</b> to the queue
					</Text.Body2>
				),
			});
		}
	};

	const onTracksRemoved = async ({ tracks, member }: { tracks: ITrack[]; member: IMember | null }) => {
		if (!settings["notification.inApp"] || !member) return;

		const title = tracks.length > 1 ? `${tracks.length} tracks` : tracks.at(0)?.mediaSource.title;

		notification.push({
			imageUrl: member.avatar,
			message: () => (
				<Text.Body2 title={`${member.displayName} removed ${title} from the queue`}>
					<b>{member.displayName}</b> removed <b>{title}</b> from the queue
				</Text.Body2>
			),
		});
	};

	const onQueueCleared = async ({ member }: { member: IMember }) => {
		if (!settings["notification.inApp"]) return;

		notification.push({
			imageUrl: member.avatar,
			message: () => (
				<Text.Body2 title={`${member.displayName} cleared the queue`}>
					<b>{member.displayName}</b> cleared the queue
				</Text.Body2>
			),
		});
	};

	const onQueueProcessed = async (nowPlaying: ITrack | null) => {
		if (!nowPlaying || !settings["notification.browser"]) return;

		let body = nowPlaying.mediaSource.title;
		if (nowPlaying.mediaSource.creator) body += `\n${nowPlaying.mediaSource.creator}`;

		const notification = await NotificationUtil.notify("Now Playing", {
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
