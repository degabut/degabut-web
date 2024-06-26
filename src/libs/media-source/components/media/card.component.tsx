import { Icon, Item, contextMenu, type IContextMenuItem, type ItemCardProps } from "@common";
import { SPOTIFY_INTEGRATION } from "@constants";
import { useQueue } from "@queue";
import { Show, createMemo, type Component } from "solid-js";
import { type IMediaSource } from "../../apis";
import { useMediaSourceContextMenu } from "../../hooks";
import { CardImageHover, DurationBadge, LiveBadge, SourceBadge } from "./components";

contextMenu;

export type MediaSourceCardProps = Partial<Omit<ItemCardProps, "contextMenu">> & {
	mediaSource: IMediaSource;
	inQueue?: boolean;
	contextMenu?: {
		openWithClick?: boolean;
		modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
	};
};

export const MediaSourceCard: Component<MediaSourceCardProps> = (props) => {
	const queue = useQueue();
	const contextMenu = useMediaSourceContextMenu(() => ({
		mediaSource: props.mediaSource,
		options: props.contextMenu,
	}));
	const inQueue = createMemo(() => queue?.data.tracks?.find((t) => t.mediaSource.id === props.mediaSource.id));
	const isNowPlaying = createMemo(() => queue?.data.nowPlaying && queue.data.nowPlaying.id === inQueue()?.id);

	return (
		<Item.Card
			{...props}
			contextMenu={contextMenu()}
			title={props.mediaSource.title}
			description={props.mediaSource.creator}
			imageUrl={props.mediaSource.maxThumbnailUrl}
			extraTitleClass={isNowPlaying() ? "!text-brand-600" : ""}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.mediaSource.duration > 0} fallback={<LiveBadge />}>
						<DurationBadge duration={props.mediaSource.duration} />
					</Show>

					<Show when={SPOTIFY_INTEGRATION}>
						<SourceBadge type={props.mediaSource.type} />
					</Show>

					<Show when={props.inQueue}>
						<div title="In Queue">
							<Icon name="degabut" title="In Queue" class="text-brand-600 w-3.5 h-3.5" />
						</div>
					</Show>
				</div>
			)}
			imageHoverElement={() => (
				<Show when={queue} keyed>
					{(q) => (
						<CardImageHover
							mediaSource={props.mediaSource}
							showAddButtons={!queue?.data.empty}
							inQueue={!!inQueue()}
							isPlaying={queue?.data.nowPlaying?.mediaSource.id === props.mediaSource.id}
							onPlay={() => q.addAndPlayTrack(props.mediaSource)}
							onAddToQueue={() => q.addTrack(props.mediaSource)}
						/>
					)}
				</Show>
			)}
		/>
	);
};
