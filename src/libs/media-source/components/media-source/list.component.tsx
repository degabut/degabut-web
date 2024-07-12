import { Button, Icon, Item, Text, useGlobalShortcut, type IContextMenuItem, type ItemListProps } from "@common";
import { SPOTIFY_INTEGRATION } from "@constants";
import { useQueue, type IGuildMember } from "@queue";
import { Show, createMemo, type Component } from "solid-js";
import { type IMediaSource } from "../../apis";
import { useLikeMediaSource, useMediaSourceContextMenu } from "../../hooks";
import { DurationBadge, LiveBadge, SourceBadge } from "./components";

export type MediaSourceListProps = Partial<Omit<ItemListProps, "contextMenu">> & {
	mediaSource: IMediaSource;
	requestedBy?: IGuildMember | null;
	hideInQueue?: boolean;
	hideDefaultRight?: boolean;
	disableActiveTitle?: boolean;
	alwaysShowLikeButton?: boolean;
	contextMenu?: {
		openWithClick?: boolean;
		modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
	};
	lightExtra?: boolean;
};

export const MediaSourceList: Component<MediaSourceListProps> = (props) => {
	const queue = useQueue();
	const globalShortcut = useGlobalShortcut();
	const contextMenu = useMediaSourceContextMenu(() => ({
		mediaSource: props.mediaSource,
		options: props.contextMenu,
	}));
	const like = useLikeMediaSource(() => props.mediaSource.id);
	const inQueue = createMemo(() => queue?.data.tracks?.find((t) => t.mediaSource.id === props.mediaSource.id));
	const isNowPlaying = createMemo(() => queue?.data.nowPlaying && queue.data.nowPlaying.id === inQueue()?.id);

	return (
		<Item.List
			{...props}
			contextMenu={contextMenu()}
			title={props.mediaSource.title}
			imageUrl={props.mediaSource.minThumbnailUrl}
			imageHoverOnParent
			extraTitleClassList={{
				"text-brand-600": !props.disableActiveTitle && !!isNowPlaying(),
				...props.extraTitleClassList,
			}}
			imageHoverElement={() => (
				<>
					<Show when={!queue?.data.empty && !isNowPlaying()} fallback={props.imageHoverElement?.()}>
						<button
							title={globalShortcut.shift || inQueue() ? "Play" : "Add to Queue"}
							class="flex-row-center justify-center w-full h-full bg-black/60 hover:bg-black/50"
							on:click={async (e) => {
								e.stopImmediatePropagation();

								const track = inQueue();
								if (track) await queue?.playTrack(track);
								else if (globalShortcut.shift) await queue?.addAndPlayTrack(props.mediaSource);
								else await queue?.addTrack(props.mediaSource);
							}}
						>
							<Icon
								name={globalShortcut.shift || inQueue() ? "play" : "plus"}
								size={props.size === "lg" ? "lg" : "md"}
								class="text-white"
							/>
						</button>
					</Show>
					{props.imageHoverElement?.()}
				</>
			)}
			right={() => (
				<Show when={!props.hideDefaultRight || props.alwaysShowLikeButton} fallback={props.right?.()}>
					<div class="flex-row-center">
						<Show when={like} keyed>
							{({ isLiked, toggle }) => (
								<Button
									flat
									icon={isLiked() ? "heart" : "heartLine"}
									iconSize={props.size === "lg" ? "lg" : "md"}
									class="p-2.5"
									theme={isLiked() ? "brand" : "secondary"}
									classList={{
										"md:visible": isLiked(),
										"!hidden md:!block": !props.alwaysShowLikeButton,
										visible: props.alwaysShowLikeButton,
									}}
									title={isLiked() ? "Unlike" : "Like"}
									on:click={(e) => {
										e.stopImmediatePropagation();
										toggle();
									}}
								/>
							)}
						</Show>
						{props.right?.()}
					</div>
				</Show>
			)}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.mediaSource.duration} fallback={<LiveBadge />}>
						<DurationBadge duration={props.mediaSource.duration} />
					</Show>

					<Show when={SPOTIFY_INTEGRATION}>
						<SourceBadge type={props.mediaSource.type} />
					</Show>

					<Show when={!props.hideInQueue && inQueue()}>
						<div title="In Queue">
							<Icon name="degabut" size="sm" class="text-brand-600" />
						</div>
					</Show>

					<div class="flex-row-center truncate space-x-1.5">
						<Show when={props.mediaSource.creator} keyed>
							{(c) => (
								<Text.Caption1 light={props.lightExtra} truncate>
									{c}
								</Text.Caption1>
							)}
						</Show>
						{props.requestedBy && (
							<>
								<Text.Caption2>—</Text.Caption2>
								<div class="flex-row-center space-x-1 truncate">
									<Show when={props.requestedBy.avatar} keyed>
										{(avatar) => <img src={avatar} class="h-4 w-4 rounded-full" />}
									</Show>
									<Text.Caption2 light={props.lightExtra}>
										{props.requestedBy.displayName}
									</Text.Caption2>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		/>
	);
};
