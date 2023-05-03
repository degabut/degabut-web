import { IPlaylist, IVideoCompact } from "@api";
import { ContextMenuItem } from "@components/ContextMenu";
import { AppContextStore } from "@providers/AppProvider";
import { ContextMenuDirectiveParams, ContextMenuItem as IContextMenuItem } from "@providers/ContextMenuProvider";
import { QueueContextStore } from "@providers/QueueProvider";
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { IYouTubePlaylistCompact } from "@api";
import { useScreen } from "@hooks/useScreen";
import { addPlaylistConfirmation } from "./confirmation";
import { secondsToTime } from "./time";

type VideoProps = {
	video: IVideoCompact;
	queueStore: QueueContextStore;
	appStore: AppContextStore;
	openWithClick?: boolean;
	min?: boolean;
	navigate?: ReturnType<typeof useNavigate>;
	modifyContextMenuItems?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export const getVideoContextMenu = (props: VideoProps) => {
	const screen = useScreen();

	const items = () => {
		const inQueue = props.queueStore.data.tracks?.some((t) => t.video.id === props.video.id);
		const isPlaying = props.queueStore.data.nowPlaying?.video.id === props.video.id;

		const i: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			i.push([
				{
					element: () => <ContextMenuItem disabled={inQueue} icon="plus" label="Add to Queue" />,
					onClick: () => props.queueStore.addTrack(props.video),
					disabled: inQueue,
				},
				{
					element: () => <ContextMenuItem disabled={isPlaying} icon="play" label="Play" />,
					onClick: () => props.queueStore.addAndPlayTrack(props.video),
					disabled: isPlaying,
				},
			]);
		}

		if (!props.min) {
			i.push([
				{
					element: () => <ContextMenuItem icon="plus" label="Add to Playlist" />,
					onClick: () => props.appStore.setVideoPlaylist(props.video),
				},
			]);

			i.push([
				{
					element: () => <ContextMenuItem icon="list" label="Related" />,
					onClick: () => props.navigate?.("/app/video/" + props.video.id),
				},
				{
					element: () => <ContextMenuItem icon="youtube" label="Open on YouTube" />,
					onClick: () => window.open(`https://youtu.be/${props.video.id}`, "_blank")?.focus(),
				},
			]);
		}

		return props.modifyContextMenuItems?.(i) || i;
	};

	return {
		items: items(),
		openWithClick: screen.lte.sm || props.openWithClick,
		header: (
			<div class="flex-col-center justify-center py-4 space-y-1">
				<div class="w-[16rem] h-[9rem] text-center my-4">
					<img class="w-full h-full" src={props.video.thumbnails[0].url} alt={props.video.title} />
				</div>
				<div class="flex-col-center space-y-2">
					<div class="font-medium text-center">{props.video.title}</div>
					<div class="text-sm text-center text-neutral-400 space-y-1">
						<Show when={props.video.channel} keyed>
							{(channel) => <div>{channel.name}</div>}
						</Show>
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

type YouTubePlaylistProps = {
	playlist: IYouTubePlaylistCompact;
	queueStore: QueueContextStore;
	appStore: AppContextStore;
	openWithClick?: boolean;
	min?: boolean;
	modifyContextMenuItems?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
};

export const getYouTubePlaylistContextMenu = (props: YouTubePlaylistProps) => {
	const screen = useScreen();

	const promptAddPlaylist = (playlist: IYouTubePlaylistCompact) => {
		props.appStore.setConfirmation(
			addPlaylistConfirmation(playlist, () => props.queueStore.addYouTubePlaylist(playlist.id))
		);
	};

	const items = () => {
		const i: IContextMenuItem[][] = [];

		if (!props.queueStore.data.empty) {
			i.push([
				{
					element: () => <ContextMenuItem icon="plus" label="Add to Queue" />,
					onClick: () => promptAddPlaylist(props.playlist),
				},
			]);
		}

		if (!props.min) {
			i.push([
				{
					element: () => <ContextMenuItem icon="youtube" label="Open on YouTube" />,
					onClick: () =>
						window.open(`https://youtube.com/playlist?list=${props.playlist.id}`, "_blank")?.focus(),
				},
			]);
		}

		return props.modifyContextMenuItems?.(i) || i;
	};

	return {
		items: items(),
		openWithClick: screen.lte.sm || props.openWithClick,
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

type PlaylistProps = {
	playlist: IPlaylist;
	queueStore: QueueContextStore;
	onDelete?: (playlist: IPlaylist) => void;
	onAddToQueue?: (playlist: IPlaylist) => void;
};

export const getPlaylistContextMenu = (props: PlaylistProps) => {
	const items = () => {
		const i = [
			{
				element: () => <ContextMenuItem icon="trashBin" label="Delete" />,
				onClick: () => props.onDelete?.(props.playlist),
			},
		];

		if (!props.queueStore.data.empty) {
			i.unshift({
				element: () => <ContextMenuItem icon="plus" label="Add to Queue" />,
				onClick: () => props.onAddToQueue?.(props.playlist),
			});
		}

		return i;
	};

	return {
		items: items(),
		header: (
			<div class="flex-col-center justify-center pt-4 pb-8 space-y-1">
				<div class="flex-col-center space-y-2">
					<div class="font-medium text-center">{props.playlist.name}</div>
				</div>
			</div>
		),
	} as ContextMenuDirectiveParams;
};
