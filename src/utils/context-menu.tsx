import { IVideoCompact } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { AppContextStore } from "@providers/AppProvider";
import { ContextMenuDirectiveParams, ContextMenuItem as IContextMenuItem } from "@providers/ContextMenuProvider";
import { QueueContextStore } from "@providers/QueueProvider";
import { secondsToTime } from "@utils";
import { useNavigate } from "solid-app-router";
import { Show } from "solid-js";

import { IPlaylistCompact } from "@api";

type VideoProps = {
	video: IVideoCompact;
	queueStore: QueueContextStore;
	appStore: AppContextStore;
	navigate: ReturnType<typeof useNavigate>;
	modifyContextMenuItems?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export const getVideoContextMenu = (props: VideoProps) => {
	const items = () => {
		const i = [
			!props.queueStore.data.empty
				? [
						{
							element: () => <ContextMenuItem icon="plus" label="Add to Queue" />,
							onClick: () => props.queueStore.addTrack(props.video),
						},
						{
							element: () => <ContextMenuItem icon="play" label="Add to Queue and Play" />,
							onClick: () => props.queueStore.addAndPlayTrack(props.video),
						},
				  ]
				: [],
			[
				{
					element: () => <ContextMenuItem icon="plus" label="Add to Playlist" />,
					onClick: () => props.appStore.setVideoPlaylist(props.video),
				},
			],
			[
				{
					element: () => <ContextMenuItem icon="list" label="Related" />,
					onClick: () => props.navigate("/app/video/" + props.video.id),
				},
				{
					element: () => <ContextMenuItem icon="youtube" label="Open on YouTube" />,
					onClick: () => window.open(`https://youtu.be/${props.video.id}`, "_blank")?.focus(),
				},
			],
		];

		return props.modifyContextMenuItems?.(i) || i;
	};

	return {
		items: items(),
		header: (
			<div class="flex-col-center justify-center py-4 space-y-1">
				<div class="w-[16rem] h-[9rem] text-center my-4">
					<img class="w-full h-full" src={props.video.thumbnails[0].url} alt={props.video.title} />
				</div>
				<div class="flex-col-center space-y-2">
					<div class="font-medium text-center">{props.video.title}</div>
					<div class="text-sm text-center text-neutral-400 space-y-1">
						<div>{props.video.channel.name}</div>
						<div class="flex flex-row space-x-4 justify-center">
							<div>{secondsToTime(props.video.duration)}</div>
							<Show when={props.video.viewCount} keyed>
								{(c) => <div>{c.toLocaleString("en-US")} views</div>}
							</Show>
						</div>
					</div>
				</div>
			</div>
		),
	} as ContextMenuDirectiveParams;
};

type PlaylistProps = {
	playlist: IPlaylistCompact;
	queueStore: QueueContextStore;
	appStore: AppContextStore;
	modifyContextMenuItems?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export const getYouTubePlaylistContextMenu = (props: PlaylistProps) => {
	const promptAddPlaylist = (playlist: IPlaylistCompact) => {
		props.appStore.setConfirmation({
			title: "Add Playlist",
			message: (
				<div class="space-y-2">
					<div>
						Add playlist <b>{playlist.title}</b> to the queue?{" "}
					</div>
					<div class="text-sm">
						This will add <b>{playlist.videoCount}</b> videos to the queue.
					</div>
				</div>
			),
			onConfirm: () => props.queueStore.addYouTubePlaylist(playlist.id),
		});
	};

	const items = () => {
		const i = [
			!props.queueStore.data.empty
				? [
						{
							element: () => <ContextMenuItem icon="plus" label="Add to Queue" />,
							onClick: () => promptAddPlaylist(props.playlist),
						},
				  ]
				: [],
			[
				{
					element: () => <ContextMenuItem icon="youtube" label="Open on YouTube" />,
					onClick: () =>
						window.open(`https://youtube.com/playlist?list=${props.playlist.id}`, "_blank")?.focus(),
				},
			],
		];

		return props.modifyContextMenuItems?.(i) || i;
	};

	return {
		items: items(),
		header: (
			<div class="flex-col-center justify-center py-4 space-y-1">
				<div class="w-[16rem] h-[9rem] text-center my-4">
					<img class="w-full h-full" src={props.playlist.thumbnails[0].url} alt={props.playlist.title} />
				</div>
				<div class="flex-col-center space-y-2">
					<div class="font-medium text-center">{props.playlist.title}</div>
					<div class="text-sm text-neutral-400 space-y-1">
						<div>{props.playlist.channel?.name}</div>
						<div class="flex flex-row space-x-4 justify-center ">
							<div>{props.playlist.videoCount}</div>
						</div>
					</div>
				</div>
			</div>
		),
	} as ContextMenuDirectiveParams;
};