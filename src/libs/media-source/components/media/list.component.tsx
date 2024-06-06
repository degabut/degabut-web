import { Button, Icon, Item, Text, type ItemListProps } from "@common";
import { SPOTIFY_INTEGRATION } from "@constants";
import type { IGuildMember } from "@queue";
import { Show, type Component } from "solid-js";
import { type IMediaSource } from "../../apis";
import { useLikeMediaSource } from "../../hooks";
import { DurationBadge, LiveBadge, SourceBadge } from "./components";

export type MediaSourceListProps = Partial<ItemListProps> & {
	mediaSource: IMediaSource;
	requestedBy?: IGuildMember | null;
	inQueue?: boolean;
};

export const MediaSourceList: Component<MediaSourceListProps> = (props) => {
	const like = useLikeMediaSource(() => props.mediaSource.id);

	return (
		<Item.List
			{...props}
			title={props.mediaSource.title}
			imageUrl={props.mediaSource.minThumbnailUrl}
			right={() => (
				<div class="flex-row-center">
					<Show when={like} keyed>
						{({ isLiked, like, unlike }) => (
							<div class="hidden md:block">
								<Button
									flat
									class="p-2"
									title={isLiked() ? "Unlike" : "Like"}
									on:click={(e) => {
										e.stopImmediatePropagation();
										if (isLiked()) unlike();
										else like();
									}}
								>
									<Icon name={isLiked() ? "heart" : "heartLine"} class="text-brand-600" size="lg" />
								</Button>
							</div>
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

					<Show when={like?.isLiked()}>
						<div title="Liked">
							<Icon name="heart" size="sm" class="text-brand-600" />
						</div>
					</Show>

					<Show when={SPOTIFY_INTEGRATION}>
						<SourceBadge type={props.mediaSource.type} />
					</Show>

					<Show when={props.inQueue}>
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

export const MediaSourceListBig: Component<MediaSourceListProps> = (props) => {
	return (
		<Item.ListBig
			{...props}
			title={props.mediaSource.title}
			imageUrl={props.mediaSource.maxThumbnailUrl}
			imageOverlayElement={() => (
				<div class="absolute bottom-0 right-0 py-0.5 px-1.5 bg-black/75 rounded-tl">
					<DurationBadge duration={props.mediaSource.duration} />
				</div>
			)}
			extra={() => (
				<>
					<div class="flex-row-center space-x-2 text-sm">
						<Show when={props.mediaSource.creator} keyed>
							{(c) => <Text.Body2 truncate>{c}</Text.Body2>}
						</Show>
					</div>
					<Show when={!props.mediaSource.duration}>
						<LiveBadge />
					</Show>
				</>
			)}
		/>
	);
};

export const MediaSourceListResponsive: Component<MediaSourceListProps & { big?: boolean }> = (props) => {
	return (
		<Show when={props.big} fallback={<MediaSourceList {...props} />}>
			<MediaSourceListBig {...props} />
		</Show>
	);
};
