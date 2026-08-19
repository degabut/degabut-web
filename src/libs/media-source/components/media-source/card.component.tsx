import { useApp } from "@app/providers";
import {
	Icon,
	Item,
	contextMenu,
	customClick,
	type CustomClickDirectiveParams,
	type IContextMenuItem,
	type ItemCardProps,
} from "@common";
import { SPOTIFY_INTEGRATION } from "@constants";
import { useQueue } from "@queue";
import { Show, createMemo, type Component } from "solid-js";
import { type IMediaSource } from "../../apis";
import { useMediaSourceContextMenu } from "../../hooks";
import { CardImageHover, DurationBadge, LiveBadge, SourceBadge } from "./components";

contextMenu;
customClick;

export type MediaSourceCardProps = Partial<Omit<ItemCardProps, "contextMenu">> & {
	mediaSource: IMediaSource;
	inQueue?: boolean;
	contextMenu?: {
		openWithClick?: boolean;
		modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
	};
};

export const MediaSourceCard: Component<MediaSourceCardProps> = (props) => {
	const app = useApp();
	const queue = useQueue();
	const contextMenu = useMediaSourceContextMenu(() => ({
		mediaSource: props.mediaSource,
		options: props.contextMenu,
	}));
	const inQueue = createMemo(() => queue?.data.tracks?.find((t) => t.mediaSource.id === props.mediaSource.id));
	const isNowPlaying = createMemo(() => queue?.data.nowPlaying && queue.data.nowPlaying.id === inQueue()?.id);
	const isSelected = createMemo(() => !!app?.mediaSourceSelect.ids()[props.mediaSource.id]);
	const customClickParams = createMemo<CustomClickDirectiveParams>(() => ({
		onShiftClick: (e) => {
			e.preventDefault();
			app?.mediaSourceSelect.toggle(props.mediaSource);
		},
	}));

	return (
		<Item.Card
			{...props}
			contextMenu={contextMenu()}
			customClick={customClickParams()}
			title={props.mediaSource.title}
			description={props.mediaSource.creator}
			imageUrl={props.mediaSource.maxThumbnailUrl}
			extraTitleClass={isNowPlaying() ? "text-brand-600!" : ""}
			extraImageClass={`${props.extraImageClass || ""} ${isSelected() ? "border-2 border-brand-500" : ""}`.trim()}
			imageOverlayElement={() => (
				<Show when={isSelected()}>
					<div class="absolute bottom-1.5 right-1.5">
						<Icon name="check" class="w-5 h-5 text-brand-500 bg-black/70 rounded-full p-0.5" />
					</div>
				</Show>
			)}
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
