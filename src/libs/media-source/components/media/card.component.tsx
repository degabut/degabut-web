import { Icon, Item, ItemCardProps } from "@common/components";
import { contextMenu } from "@common/directives";
import { SPOTIFY_INTEGRATION } from "@constants";
import { IMediaSource } from "@media-source/apis";
import { Component, Show } from "solid-js";
import { DurationBadge, LiveBadge, SourceBadge } from "./components";

contextMenu;

export type MediaSourceCardProps = Partial<ItemCardProps> & {
	mediaSource: IMediaSource;
	inQueue?: boolean;
};

export const MediaSourceCard: Component<MediaSourceCardProps> = (props) => {
	return (
		<Item.Card
			{...props}
			title={props.mediaSource.title}
			description={props.mediaSource.creator}
			imageUrl={props.mediaSource.maxThumbnailUrl}
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
							<Icon name="degabut" title="In Queue" class="fill-brand-600 w-3.5 h-3.5" />
						</div>
					</Show>
				</div>
			)}
		/>
	);
};
