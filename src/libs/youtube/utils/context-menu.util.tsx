/* eslint-disable solid/reactivity */
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { AppContextStore } from "@app/providers";
import { ContextMenuDirectiveParams, IContextMenuItem } from "@common/directives";
import { TimeUtil } from "@common/utils";
import { PlaylistConfirmationUtil } from "@playlist/utils";
import { QueueContextStore } from "@queue/providers";
import { IVideoCompact, IYouTubePlaylistCompact } from "@youtube/apis";

type VideoProps = {
	video: IVideoCompact;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	navigate?: ReturnType<typeof useNavigate>;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

type YouTubePlaylistProps = {
	playlist: IYouTubePlaylistCompact;
	queueStore: QueueContextStore;
	appStore?: AppContextStore;
	modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export class YouTubeContextMenuUtil {
	static getVideoContextMenu(props: VideoProps) {
		const trackInQueue = props.queueStore.data.tracks?.findLast((t) => t.video.id === props.video.id);

		let items: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			const firstSection: IContextMenuItem[] = [];
			if (!trackInQueue) {
				firstSection.push({
					label: "Add to Queue",
					icon: "plus",
					onClick: () => props.queueStore.addTrack(props.video),
				});
			}

			firstSection.push({
				label: "Play",
				icon: "play",
				disabled: props.queueStore.data.nowPlaying?.video.id === props.video.id,
				onClick: () => props.queueStore.addAndPlayTrack(props.video),
			});

			if (trackInQueue) {
				firstSection.push({
					label: "Remove from Queue",
					icon: "trashBin",
					onClick: () => props.queueStore.removeTrack(trackInQueue),
				});
			}
			items.push(firstSection);
		}

		if (props.appStore) {
			items.push([
				{
					label: "Add to Playlist",
					icon: "plus",
					onClick: () => props.appStore?.setVideoPlaylist(props.video),
				},
			]);

			items.push([
				{
					label: "Related",
					icon: "list",
					onClick: () => props.navigate?.("/app/video/" + props.video.id),
				},
				{
					label: "Open on YouTube",
					icon: "youtube",
					onClick: () => window.open(`https://youtu.be/${props.video.id}`, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<div class="w-[16rem] h-[9rem] text-center my-4">
						<img class="w-full h-full" src={props.video.thumbnails.at(-1)?.url} alt={props.video.title} />
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.video.title}</div>
						<div class="text-sm text-center text-neutral-400 space-y-1">
							<Show when={props.video.channel} keyed>
								{(channel) => <div>{channel.name}</div>}
							</Show>
							<div class="flex flex-row space-x-4 justify-center">
								<div>{TimeUtil.secondsToTime(props.video.duration)}</div>
								<Show when={props.video.viewCount} keyed>
									{(c) => <div>{c.toLocaleString("en-US")} views</div>}
								</Show>
							</div>
						</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}

	static getPlaylistContextMenu(props: YouTubePlaylistProps) {
		const promptAddPlaylist = (playlist: IYouTubePlaylistCompact) => {
			props.appStore?.setConfirmation(
				PlaylistConfirmationUtil.addPlaylistConfirmation(playlist, () =>
					props.queueStore.addYouTubePlaylist(playlist.id)
				)
			);
		};

		let items: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			items.push([
				{
					label: "Add to Queue",
					icon: "plus",
					onClick: () =>
						props.appStore
							? promptAddPlaylist(props.playlist)
							: props.queueStore.addYouTubePlaylist(props.playlist.id),
				},
			]);
		}

		if (!props.appStore) {
			items.push([
				{
					label: "Open on YouTube",
					icon: "youtube",
					onClick: () =>
						window.open(`https://youtube.com/playlist?list=${props.playlist.id}`, "_blank")?.focus(),
				},
			]);
		}

		if (props.modify) items = props.modify(items);

		return {
			items,
			header: (
				<div class="flex-col-center justify-center py-4 space-y-1">
					<div class="w-[16rem] h-[9rem] text-center my-4">
						<img
							class="w-full h-full"
							src={props.playlist.thumbnails.at(-1)?.url}
							alt={props.playlist.title}
						/>
					</div>
					<div class="flex-col-center space-y-2">
						<div class="font-medium text-center">{props.playlist.title}</div>
						<div class="text-sm text-neutral-400 text-center space-y-1">
							<div>{props.playlist.channel?.name}</div>
							<div>
								{props.playlist.videoCount} {props.playlist.videoCount === 1 ? "video" : "videos"}
							</div>
						</div>
					</div>
				</div>
			),
		} as ContextMenuDirectiveParams;
	}
}
