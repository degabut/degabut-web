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
	contextMenu?: {
		openWithClick?: boolean;
		modify?: (current: IContextMenuItem[][]) => IContextMenuItem[][];
	};
};

export const MediaSourceList: Component<MediaSourceListProps> = (props) => {
	const queue = useQueue();
	const globalShortcut = useGlobalShortcut();
	const contextMenu = useMediaSourceContextMenu(() => ({
		mediaSource: props.mediaSource,
		options: props.contextMenu,
	}));
	const like = useLikeMediaSource(() => props.mediaSource.id);
	const inQueue = createMemo(() => queue?.data.tracks?.some((t) => t.mediaSource.id === props.mediaSource.id));

	return (
		<Item.List
			{...props}
			contextMenu={contextMenu()}
			title={props.mediaSource.title}
			imageUrl={props.mediaSource.minThumbnailUrl}
			imageHoverOnParent
			imageHoverElement={() => (
				<Show
					when={!queue?.data.empty && !props.imageHoverElement && !inQueue()}
					fallback={props.imageHoverElement?.()}
				>
					<button
						title={globalShortcut.shift ? "Play" : "Add to Queue"}
						class="flex-row-center justify-center w-full h-full bg-black/60 hover:bg-black/50"
						on:click={async (e) => {
							e.stopImmediatePropagation();

							if (globalShortcut.shift) await queue?.addAndPlayTrack(props.mediaSource);
							else await queue?.addTrack(props.mediaSource);
						}}
					>
						<Icon
							name={globalShortcut.shift ? "play" : "plus"}
							size={props.size === "lg" ? "lg" : "md"}
							class="text-white"
						/>
					</button>
				</Show>
			)}
			right={() => (
				<div class="flex-row-center">
					<Show when={like} keyed>
						{({ isLiked, toggle }) => (
							<Button
								flat
								icon={isLiked() ? "heart" : "heartLine"}
								iconSize={props.size === "lg" ? "lg" : "md"}
								class="p-2.5 !hidden md:!block"
								theme={isLiked() ? "brand" : "default"}
								classList={{ "md:visible": isLiked() }}
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
			)}
			extra={() => (
				<div class="flex-row-center space-x-1.5">
					<Show when={props.mediaSource.duration} fallback={<LiveBadge />}>
						<DurationBadge duration={props.mediaSource.duration} />
					</Show>

					<Show when={SPOTIFY_INTEGRATION}>
						<SourceBadge type={props.mediaSource.type} />
					</Show>

					<Show when={inQueue()}>
						<div title="In Queue">
							<Icon name="degabut" size="sm" class="text-brand-600" />
						</div>
					</Show>

					<div class="flex-row-center truncate space-x-1.5">
						<Show when={props.mediaSource.creator} keyed>
							{(c) => <Text.Caption1 truncate>{c}</Text.Caption1>}
						</Show>
						{props.requestedBy && (
							<>
								<Text.Caption2>—</Text.Caption2>
								<div class="flex-row-center space-x-1 truncate">
									<Show when={props.requestedBy.avatar} keyed>
										{(avatar) => <img src={avatar} class="h-4 w-4 rounded-full" />}
									</Show>
									<Text.Caption2>{props.requestedBy.displayName}</Text.Caption2>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		/>
	);
};
